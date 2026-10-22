/**
 * API de pedidos do livro "Curva Zero" (Cloudflare Worker). O site é estático (GitHub Pages) e não tem servidor,
 * então este arquivo é o único trecho que roda no servidor: valida o pedido, grava no Cloudflare KV e envia os e-mails pelo Resend.
 * Configuração e implantação: backend/README.md.
 */
import { brl, digits, hasErrors, validateAddress, validateBuyer, type OrderRequest, type OrderResponse } from "../src/lib/book-order";

type KV = {
  get(key: string): Promise<string | null>;
  put(key: string, value: string, opts?: { expirationTtl?: number }): Promise<void>;
};

export interface Env {
  ORDERS: KV;
  /** segredo: chave da API do Resend */
  RESEND_API_KEY: string;
  /** e-mail do responsável pela venda, que recebe cada pedido */
  OWNER_EMAIL: string;
  /** remetente verificado no Resend, ex.: "Curva Zero <pedidos@seudominio.com.br>" */
  MAIL_FROM: string;
  /** origem do site, ex.: https://plathanus-tech.github.io (sem barra e sem o caminho) */
  ALLOWED_ORIGIN: string;
  /** valor do livro em centavos; precisa ser igual ao do site (padrão 4990) */
  PRICE_CENTS?: string;
  /** só para testes: troca o endereço da API do Resend */
  RESEND_API_URL?: string;
}

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

const BOOK = "Curva Zero: quando obstinação e disciplina te ensinam que desistir não é uma opção";
const RETENTION_SECONDS = 60 * 60 * 24 * 180; // 180 dias: tempo para conferir o pagamento, enviar e resolver problemas
const MAX_PER_HOUR = 5; // pedidos por endereço de rede, por hora
const MIN_FILL_MS = 8000; // abaixo disso quem preencheu foi um robô

const json = (body: unknown, status: number, cors: Record<string, string>) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store", ...cors } });

const ESCAPES: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ESCAPES[c]);

async function sha256(text: string) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function newOrderId(now: Date) {
  const alphabet = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"; // sem 0/O/1/I/L, fácil de ditar
  const rnd = crypto.getRandomValues(new Uint8Array(6));
  const suffix = [...rnd].map((n) => alphabet[n % alphabet.length]).join("");
  return `CZ-${now.toISOString().slice(0, 10).split("-").join("")}-${suffix}`;
}

type Mail = { to: string; subject: string; html: string; text: string; replyTo?: string };

async function sendMail(env: Env, msg: Mail) {
  const res = await fetch(env.RESEND_API_URL ?? "https://api.resend.com/emails", {
    method: "POST",
    headers: { authorization: `Bearer ${env.RESEND_API_KEY}`, "content-type": "application/json" },
    body: JSON.stringify({ from: env.MAIL_FROM, to: [msg.to], subject: msg.subject, html: msg.html, text: msg.text, ...(msg.replyTo ? { reply_to: msg.replyTo } : {}) }),
  });
  if (!res.ok) throw new Error(`Resend ${res.status}`);
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

async function notify(env: Env, order: Order) {
  await sendMail(env, ownerMail(order, env.OWNER_EMAIL));
  order.notified = true;
  await env.ORDERS.put(`order:${order.id}`, JSON.stringify(order), { expirationTtl: RETENTION_SECONDS });
  // confirmação ao comprador: se falhar, o pedido continua válido (o responsável já foi avisado)
  await sendMail(env, buyerMail(order)).catch(() => {});
}

const NOTIFY_FAILED = "Não conseguimos avisar a equipe agora. Tente novamente em instantes.";

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin = request.headers.get("origin") ?? "";
    const allowed = origin === env.ALLOWED_ORIGIN;
    const cors: Record<string, string> = allowed
      ? { "access-control-allow-origin": origin, vary: "origin", "access-control-allow-methods": "POST, OPTIONS", "access-control-allow-headers": "content-type" }
      : { vary: "origin" };

    if (request.method === "OPTIONS") return new Response(null, { status: allowed ? 204 : 403, headers: cors });
    if (request.method !== "POST") return json({ error: "Método não permitido." }, 405, cors);
    if (!allowed) return json({ error: "Origem não autorizada." }, 403, cors);

    let body: Partial<OrderRequest>;
    try {
      body = (await request.json()) as Partial<OrderRequest>;
    } catch {
      return json({ error: "Pedido inválido." }, 400, cors);
    }

    // robôs: campo-isca preenchido ou formulário enviado rápido demais
    if ((body.website ?? "") !== "" || typeof body.elapsedMs !== "number" || body.elapsedMs < MIN_FILL_MS) {
      return json({ error: "Não foi possível registrar o pedido. Tente novamente em instantes." }, 429, cors);
    }

    const { buyer, address, idempotencyKey } = body;
    if (!buyer || !address || body.consent !== true || body.quantity !== 1 || typeof idempotencyKey !== "string" || !/^[\w-]{16,64}$/.test(idempotencyKey))
      return json({ error: "Pedido incompleto." }, 400, cors);

    const clean = {
      buyer: { name: String(buyer.name ?? "").trim(), email: String(buyer.email ?? "").trim().toLowerCase(), cpf: String(buyer.cpf ?? "") },
      address: Object.fromEntries(Object.entries(address).map(([k, v]) => [k, String(v ?? "").trim()])) as OrderRequest["address"],
    };
    const errors = { ...validateBuyer(clean.buyer), ...validateAddress(clean.address) };
    if (hasErrors(errors)) return json({ error: "Revise os dados do pedido.", fields: errors }, 422, cors);
    clean.buyer.cpf = digits(clean.buyer.cpf).replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4");

    // pedido repetido (clique duplo, recarregar, reenvio após falha): devolve o mesmo, sem duplicar nada
    const contentHash = await sha256(JSON.stringify([clean.buyer, clean.address]));
    const existingId = (await env.ORDERS.get(`idem:${idempotencyKey}`)) ?? (await env.ORDERS.get(`dup:${contentHash}`));
    const raw = existingId ? await env.ORDERS.get(`order:${existingId}`) : null;
    if (raw) {
      const existing = JSON.parse(raw) as Order;
      if (!existing.notified) {
        try {
          await notify(env, existing);
        } catch {
          return json({ error: NOTIFY_FAILED }, 502, cors);
        }
      }
      return json({ orderId: existing.id, status: "awaiting_payment" } satisfies OrderResponse, 200, cors);
    }

    // limite por endereço de rede
    const ip = request.headers.get("cf-connecting-ip") ?? "unknown";
    const bucket = `rl:${await sha256(ip)}:${new Date().toISOString().slice(0, 13)}`;
    const used = Number((await env.ORDERS.get(bucket)) ?? 0);
    if (used >= MAX_PER_HOUR) return json({ error: "Muitas tentativas. Tente novamente mais tarde." }, 429, cors);
    await env.ORDERS.put(bucket, String(used + 1), { expirationTtl: 3600 });

    const now = new Date();
    const order: Order = {
      id: newOrderId(now),
      createdAt: now.toISOString(),
      status: "Aguardando confirmação do pagamento",
      book: BOOK,
      quantity: 1,
      totalCents: Number(env.PRICE_CENTS ?? 4990),
      buyer: clean.buyer,
      address: clean.address,
      notified: false,
    };
    await env.ORDERS.put(`order:${order.id}`, JSON.stringify(order), { expirationTtl: RETENTION_SECONDS });
    await env.ORDERS.put(`idem:${idempotencyKey}`, order.id, { expirationTtl: 86400 });
    await env.ORDERS.put(`dup:${contentHash}`, order.id, { expirationTtl: 3600 });

    try {
      await notify(env, order);
    } catch {
      // o pedido está gravado; o site pode reenviar com a mesma chave e o aviso é tentado de novo
      return json({ error: NOTIFY_FAILED }, 502, cors);
    }
    return json({ orderId: order.id, status: "awaiting_payment" } satisfies OrderResponse, 200, cors);
  },
};
