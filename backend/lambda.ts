/**
 * API de pedidos do livro "Curva Zero" (AWS Lambda com Function URL). O site é estático e não tem servidor,
 * então este arquivo é o único trecho que roda no servidor: valida o pedido, grava no DynamoDB e envia os e-mails pelo SES.
 * Configuração e implantação: backend/README.md.
 */
import { DynamoDBClient, GetItemCommand, PutItemCommand, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { SESv2Client, SendEmailCommand } from "@aws-sdk/client-sesv2";
import { brl, digits, hasErrors, validateAddress, validateBuyer, type OrderRequest, type OrderResponse } from "../src/lib/book-order";

/** Evento de uma Lambda Function URL (payload 2.0): só os campos que usamos. */
type UrlEvent = {
  headers?: Record<string, string | undefined>;
  body?: string;
  isBase64Encoded?: boolean;
  requestContext: { http: { method: string; sourceIp?: string } };
};
type UrlResult = { statusCode: number; headers: Record<string, string>; body: string };

type Order = {
  id: string;
  createdAt: string;
  status: "Aguardando confirmação do pagamento";
  book: string;
  quantity: 1;
  totalCents: number;
  buyer: OrderRequest["buyer"];
  address: OrderRequest["address"];
  /** o responsável já foi avisado por e-mail */
  notified: boolean;
};

const env = (name: string) => process.env[name] ?? "";
const TABLE = () => env("TABLE_NAME");
/** origens aceitas, separadas por vírgula, sem barra no fim e sem o caminho (ex.: https://plathanus-tech.github.io) */
const allowedOrigins = () => env("ALLOWED_ORIGINS").split(",").map((o) => o.trim()).filter(Boolean);

const BOOK = "Curva Zero: quando obstinação e disciplina te ensinam que desistir não é uma opção";
const RETENTION_SECONDS = 60 * 60 * 24 * 180; // 180 dias: tempo para conferir o pagamento, enviar e resolver problemas
const MAX_PER_HOUR = 5; // pedidos por endereço de rede, por hora
const MIN_FILL_MS = 8000; // abaixo disso quem preencheu foi um robô

const db = new DynamoDBClient({});
const ses = new SESv2Client({});

const now = () => Math.floor(Date.now() / 1000);

/** Lê um valor; o TTL do DynamoDB apaga com atraso (até 48 h), então itens vencidos são ignorados aqui. */
async function kvGet(key: string): Promise<string | null> {
  const out = await db.send(new GetItemCommand({ TableName: TABLE(), Key: { pk: { S: key } } }));
  const item = out.Item;
  if (!item?.data?.S) return null;
  if (item.ttl?.N && Number(item.ttl.N) <= now()) return null;
  return item.data.S;
}

async function kvPut(key: string, value: string, ttlSeconds: number) {
  await db.send(new PutItemCommand({ TableName: TABLE(), Item: { pk: { S: key }, data: { S: value }, ttl: { N: String(now() + ttlSeconds) } } }));
}

/** Soma 1 ao contador de forma atômica e devolve o novo valor. */
async function bump(key: string, ttlSeconds: number): Promise<number> {
  const out = await db.send(
    new UpdateItemCommand({
      TableName: TABLE(),
      Key: { pk: { S: key } },
      UpdateExpression: "ADD hits :one SET #ttl = :ttl",
      ExpressionAttributeNames: { "#ttl": "ttl" },
      ExpressionAttributeValues: { ":one": { N: "1" }, ":ttl": { N: String(now() + ttlSeconds) } },
      ReturnValues: "UPDATED_NEW",
    }),
  );
  return Number(out.Attributes?.hits?.N ?? 1);
}

const ESCAPES: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ESCAPES[c]);

async function sha256(text: string) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function newOrderId(date: Date) {
  const alphabet = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"; // sem 0/O/1/I/L, fácil de ditar
  const rnd = crypto.getRandomValues(new Uint8Array(6));
  const suffix = [...rnd].map((n) => alphabet[n % alphabet.length]).join("");
  return `CZ-${date.toISOString().slice(0, 10).split("-").join("")}-${suffix}`;
}

type Mail = { to: string; subject: string; html: string; text: string; replyTo?: string };

async function sendMail(msg: Mail) {
  await ses.send(
    new SendEmailCommand({
      FromEmailAddress: env("MAIL_FROM"),
      // conjunto de configuração do SES: avisa por SNS quando um e-mail devolve (bounce) ou gera reclamação
      ...(env("CONFIG_SET") ? { ConfigurationSetName: env("CONFIG_SET") } : {}),
      Destination: { ToAddresses: [msg.to] },
      ...(msg.replyTo ? { ReplyToAddresses: [msg.replyTo] } : {}),
      Content: {
        Simple: {
          Subject: { Data: msg.subject, Charset: "UTF-8" },
          Body: { Html: { Data: msg.html, Charset: "UTF-8" }, Text: { Data: msg.text, Charset: "UTF-8" } },
        },
      },
    }),
  );
}

const row = (k: string, v: string) => `<tr><td style="padding:4px 12px 4px 0;color:#555">${esc(k)}</td><td style="padding:4px 0"><b>${esc(v)}</b></td></tr>`;

function addressLine(a: Order["address"], sep: string) {
  return `${a.street}, ${a.number}${a.complement ? ` (${a.complement})` : ""}${sep}${a.district}${sep}${a.city}/${a.state}${sep}CEP ${a.cep}`;
}

function ownerMail(o: Order, to: string): Mail {
  const lines: [string, string][] = [
    ["Pedido", o.id],
    ["Status do pagamento", o.status],
    ["Criado em", new Date(o.createdAt).toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })],
    ["Livro", `${o.book} (${o.quantity} un.)`],
    ["Valor total", brl(o.totalCents)],
    ["Comprador", o.buyer.name],
    ["E-mail", o.buyer.email],
    ["CPF", o.buyer.cpf],
    ["Entrega", addressLine(o.address, " · ")],
  ];
  return {
    to,
    subject: `Novo pedido ${o.id} · Curva Zero · aguardando pagamento`,
    html: `<p>Novo pedido pelo site. <b>O pagamento ainda não foi confirmado:</b> confira o Pix de ${esc(brl(o.totalCents))} antes de enviar o livro.</p><table>${lines.map(([k, v]) => row(k, v)).join("")}</table><p style="color:#777;font-size:12px">Dados pessoais: use só para conferir o pagamento e enviar o livro.</p>`,
    text: `Novo pedido pelo site. O pagamento ainda NÃO foi confirmado: confira o Pix de ${brl(o.totalCents)} antes de enviar.\n\n${lines.map(([k, v]) => `${k}: ${v}`).join("\n")}`,
    replyTo: o.buyer.email,
  };
}

function buyerMail(o: Order): Mail {
  const addr = addressLine(o.address, ", ");
  const first = o.buyer.name.split(" ")[0];
  return {
    to: o.buyer.email,
    subject: `Recebemos seu pedido ${o.id} · Curva Zero`,
    html: `<p>Olá, ${esc(first)}.</p><p>Recebemos o seu pedido do livro <b>Curva Zero</b>. Ele está com o status <b>${esc(o.status)}</b>: o envio acontece depois que o pagamento do Pix for conferido pela nossa equipe.</p><table>${row("Pedido", o.id)}${row("Valor", brl(o.totalCents))}${row("Entrega em", addr)}</table><p>Se ainda não fez o Pix, ele pode ser feito pelo site, na etapa de pagamento. Guarde o número do pedido: ele identifica sua compra caso precise falar conosco.</p>`,
    text: `Olá, ${first}.\n\nRecebemos o seu pedido do livro Curva Zero (${o.id}). Status: ${o.status}. O envio acontece depois que o pagamento do Pix for conferido pela nossa equipe.\n\nValor: ${brl(o.totalCents)}\nEntrega em: ${addr}\n\nGuarde o número do pedido para falar conosco, se precisar.`,
  };
}

async function notify(order: Order) {
  await sendMail(ownerMail(order, env("OWNER_EMAIL")));
  order.notified = true;
  await kvPut(`order:${order.id}`, JSON.stringify(order), RETENTION_SECONDS);
  // confirmação ao comprador: se falhar, o pedido continua válido (o responsável já foi avisado)
  await sendMail(buyerMail(order)).catch((e) => console.error("confirmação ao comprador falhou", e));
}

const NOTIFY_FAILED = "Não conseguimos avisar a equipe agora. Tente novamente em instantes.";

export async function handler(event: UrlEvent): Promise<UrlResult> {
  const origin = event.headers?.origin ?? "";
  const allowed = allowedOrigins().includes(origin);
  const cors: Record<string, string> = allowed
    ? { "access-control-allow-origin": origin, vary: "origin", "access-control-allow-methods": "POST, OPTIONS", "access-control-allow-headers": "content-type" }
    : { vary: "origin" };
  const reply = (body: unknown, statusCode: number): UrlResult => ({
    statusCode,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store", ...cors },
    body: JSON.stringify(body),
  });

  const method = event.requestContext.http.method;
  if (method === "OPTIONS") return { statusCode: allowed ? 204 : 403, headers: cors, body: "" };
  if (method !== "POST") return reply({ error: "Método não permitido." }, 405);
  if (!allowed) return reply({ error: "Origem não autorizada." }, 403);

  let body: Partial<OrderRequest>;
  try {
    const raw = event.isBase64Encoded ? Buffer.from(event.body ?? "", "base64").toString("utf8") : (event.body ?? "");
    body = JSON.parse(raw) as Partial<OrderRequest>;
  } catch {
    return reply({ error: "Pedido inválido." }, 400);
  }

  // robôs: campo-isca preenchido ou formulário enviado rápido demais
  if ((body.website ?? "") !== "" || typeof body.elapsedMs !== "number" || body.elapsedMs < MIN_FILL_MS) {
    return reply({ error: "Não foi possível registrar o pedido. Tente novamente em instantes." }, 429);
  }

  const { buyer, address, idempotencyKey } = body;
  if (!buyer || !address || body.consent !== true || body.quantity !== 1 || typeof idempotencyKey !== "string" || !/^[\w-]{16,64}$/.test(idempotencyKey))
    return reply({ error: "Pedido incompleto." }, 400);

  const clean = {
    buyer: { name: String(buyer.name ?? "").trim(), email: String(buyer.email ?? "").trim().toLowerCase(), cpf: String(buyer.cpf ?? "") },
    address: Object.fromEntries(Object.entries(address).map(([k, v]) => [k, String(v ?? "").trim()])) as OrderRequest["address"],
  };
  const errors = { ...validateBuyer(clean.buyer), ...validateAddress(clean.address) };
  if (hasErrors(errors)) return reply({ error: "Revise os dados do pedido.", fields: errors }, 422);
  clean.buyer.cpf = digits(clean.buyer.cpf).replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4");

  // pedido repetido (clique duplo, recarregar, reenvio após falha): devolve o mesmo, sem duplicar nada
  const contentHash = await sha256(JSON.stringify([clean.buyer, clean.address]));
  const existingId = (await kvGet(`idem:${idempotencyKey}`)) ?? (await kvGet(`dup:${contentHash}`));
  const stored = existingId ? await kvGet(`order:${existingId}`) : null;
  if (stored) {
    const existing = JSON.parse(stored) as Order;
    if (!existing.notified) {
      try {
        await notify(existing);
      } catch (e) {
        console.error("aviso ao responsável falhou", e);
        return reply({ error: NOTIFY_FAILED }, 502);
      }
    }
    return reply({ orderId: existing.id, status: "awaiting_payment" } satisfies OrderResponse, 200);
  }

  // limite por endereço de rede
  const ip = event.requestContext.http.sourceIp ?? "unknown";
  const used = await bump(`rl:${await sha256(ip)}:${new Date().toISOString().slice(0, 13)}`, 3600);
  if (used > MAX_PER_HOUR) return reply({ error: "Muitas tentativas. Tente novamente mais tarde." }, 429);

  const created = new Date();
  const order: Order = {
    id: newOrderId(created),
    createdAt: created.toISOString(),
    status: "Aguardando confirmação do pagamento",
    book: BOOK,
    quantity: 1,
    totalCents: Number(env("PRICE_CENTS") || 4990),
    buyer: clean.buyer,
    address: clean.address,
    notified: false,
  };
  await kvPut(`order:${order.id}`, JSON.stringify(order), RETENTION_SECONDS);
  await kvPut(`idem:${idempotencyKey}`, order.id, 86400);
  await kvPut(`dup:${contentHash}`, order.id, 3600);

  try {
    await notify(order);
  } catch (e) {
    // o pedido está gravado; o site pode reenviar com a mesma chave e o aviso é tentado de novo
    console.error("aviso ao responsável falhou", e);
    return reply({ error: NOTIFY_FAILED }, 502);
  }
  return reply({ orderId: order.id, status: "awaiting_payment" } satisfies OrderResponse, 200);
}
