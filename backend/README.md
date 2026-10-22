# API de pedidos do livro "Curva Zero"

O site é estático (GitHub Pages) e não tem servidor. Este Worker (Cloudflare) é o único trecho que roda no servidor.
Ele recebe o pedido do modal de compra, valida tudo de novo no servidor, **grava no Cloudflare KV** e **envia os e-mails pelo Resend**.

```
navegador (site) ──POST /──▶ Worker ──▶ KV (pedido gravado, 180 dias)
                                   └──▶ Resend ──▶ e-mail ao responsável + confirmação ao comprador
```

## O que o responsável precisa criar (todos têm plano gratuito suficiente)

1. **Conta na Cloudflare** (Workers + KV). Rodar uma vez, na pasta `backend/`:
   ```bash
   npx wrangler login
   npx wrangler kv namespace create ORDERS
   ```
   Copie o `id` mostrado para `id = "..."` em `wrangler.toml`.
2. **Conta no Resend** (resend.com): verificar um domínio de e-mail e criar uma chave de API.
3. Preencher em `wrangler.toml`: `OWNER_EMAIL` (quem recebe os pedidos) e `MAIL_FROM` (remetente do domínio verificado, ex.: `Curva Zero <pedidos@seudominio.com.br>`). `ALLOWED_ORIGIN` já aponta para o GitHub Pages; se o site mudar de endereço, atualize.
4. Guardar a chave como segredo (nunca no código):
   ```bash
   npx wrangler secret put RESEND_API_KEY
   ```
5. Publicar a API:
   ```bash
   npx wrangler deploy
   ```
   O comando mostra o endereço, algo como `https://curva-zero-pedidos.SEU-USUARIO.workers.dev`.
6. No GitHub do projeto: **Settings → Secrets and variables → Actions → Variables → New repository variable**, nome `ORDER_API_URL`, valor = esse endereço. A próxima publicação do site já usa a API.

## Segurança e privacidade

- Chave do Resend só como segredo do Worker; nada de credencial no site.
- A API só aceita pedidos vindos de `ALLOWED_ORIGIN` (CORS e verificação de origem).
- Os mesmos validadores do formulário (`src/lib/book-order.ts`) rodam no servidor.
- Contra spam: campo-isca escondido, tempo mínimo de preenchimento, limite de 5 pedidos por hora por endereço de rede.
- Contra duplicidade: chave de idempotência por pedido e conferência por conteúdo; reenvio devolve o mesmo pedido.
- Dados pessoais: ficam só no KV privado da conta e no e-mail do responsável; apagados em 180 dias (`RETENTION_SECONDS`). O CPF aparece apenas no e-mail do responsável (para conferir o pagamento) e não vai no e-mail do comprador.
- O Pix é fixo: o pedido nasce como **"Aguardando confirmação do pagamento"**. Nada confirma pagamento sozinho; o responsável confere no banco e envia o livro.

## Ver os pedidos gravados

```bash
npx wrangler kv key list --binding ORDERS --prefix order:
npx wrangler kv key get --binding ORDERS "order:CZ-AAAAMMDD-XXXXXX"
```
