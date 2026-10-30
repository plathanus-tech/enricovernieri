# API de pedidos do livro "Curva Zero"

O site é estático e não tem servidor. Esta função (AWS Lambda) é o único trecho que roda no servidor.
Ela recebe o pedido do modal de compra, valida tudo de novo no servidor, **grava no DynamoDB** e **envia os e-mails pelo SES**.

```
navegador (site) ──POST──▶ Lambda (Function URL) ──▶ DynamoDB (pedido gravado, 180 dias)
                                                 └──▶ SES ──▶ e-mail ao responsável + confirmação ao comprador
```

Custo esperado: centavos por mês (Lambda e DynamoDB dentro do free tier; SES cobra cerca de US$0,10 por mil e-mails).

## Publicar (ou atualizar)

Pré-requisitos: AWS CLI autenticado (`aws sts get-caller-identity` funciona) e Node instalado. Na raiz do projeto:

```powershell
npm ci
.\backend\deploy.ps1 -OwnerEmail igorluizbelterrosiak@gmail.com -MailFrom igorluizbelterrosiak@gmail.com -AllowedOrigins "http://localhost:3000"
```

O script cria a tabela, o papel IAM (só com as permissões necessárias), a Lambda, a Function URL e a identidade do SES, e imprime o endereço da API.
Pode ser executado de novo a qualquer momento para publicar uma nova versão do código ou mudar as variáveis.

| Parâmetro | O que é |
|---|---|
| `-OwnerEmail` | quem recebe cada pedido (o responsável pela venda) |
| `-MailFrom` | remetente: um e-mail ou domínio verificado no SES |
| `-AllowedOrigins` | origens do site, separadas por vírgula, sem barra no fim e sem o caminho. É a lista de quem pode chamar a API |
| `-Region` | padrão `sa-east-1` |

## Verificar o remetente no SES (obrigatório)

O script dispara um e-mail de verificação para o endereço de `-MailFrom`. **Abra e clique no link.** Sem isso nenhum e-mail sai.
Confira em SES → Identities (na mesma região) que o status está *Verified*.

### Sandbox do SES

Toda conta nova começa no *sandbox*: só dá para enviar **para endereços verificados**. Para teste isso basta, desde que quem recebe também esteja verificado
(use o seu e-mail como comprador). Antes de vender, é preciso sair do sandbox: SES → Account dashboard → **Request production access**
(a AWS costuma responder em cerca de 1 dia útil). Sem isso a confirmação aos compradores reais falha, e o pedido só avisa o responsável se ele estiver verificado.

## Testar no seu computador

1. Crie `.env.local` na raiz com o endereço impresso pelo script (mantenha a barra no final):
   ```
   NEXT_PUBLIC_ORDER_API_URL=https://xxxxxxxx.lambda-url.sa-east-1.on.aws/
   ```
2. `npm run dev`, abra `http://localhost:3000/livro`, e faça um pedido. O formulário só envia depois de 8 segundos (proteção contra robôs).
3. O e-mail do pedido chega em `-OwnerEmail`. Use o próprio e-mail como comprador para receber também a confirmação.

Ver os pedidos gravados:

```powershell
aws dynamodb scan --table-name curva-zero-pedidos --region sa-east-1 --filter-expression "begins_with(pk, :p)" --expression-attribute-values '{\":p\":{\"S\":\"order:\"}}'
```

Logs da função: CloudWatch → Log groups → `/aws/lambda/curva-zero-pedidos`.

## Colocar no ar (produção)

1. Rode o script de novo com o e-mail do responsável, o remetente definitivo e **todas as origens do site**, por exemplo:
   ```powershell
   .\backend\deploy.ps1 -OwnerEmail pascoal@exemplo.com.br -MailFrom "Curva Zero <pedidos@exemplo.com.br>" -AllowedOrigins "https://main.xxxx.amplifyapp.com,http://localhost:3000"
   ```
2. Peça a saída do sandbox do SES (acima).
3. **Amplify**: App settings → Environment variables → `NEXT_PUBLIC_ORDER_API_URL` = endereço da API → redeploy. A variável é lida no *build*, então precisa de um novo build.
   **GitHub Pages**: Settings → Secrets and variables → Actions → Variables → `ORDER_API_URL`.
4. Faça um pedido real no site publicado e confira os dois e-mails.

## Segurança e privacidade

- Nenhuma credencial no site nem no código: a Lambda usa o papel IAM, que só acessa esta tabela e o envio de e-mail.
- A API só aceita pedidos vindos das origens de `ALLOWED_ORIGINS` (CORS e verificação de origem). O CORS é tratado no código, não na Function URL.
- Os mesmos validadores do formulário (`src/lib/book-order.ts`) rodam no servidor.
- Contra spam: campo-isca escondido, tempo mínimo de preenchimento, limite de 5 pedidos por hora por endereço de rede.
- Contra duplicidade: chave de idempotência por pedido e conferência por conteúdo; reenvio devolve o mesmo pedido.
- Dados pessoais: ficam só na tabela privada da conta e no e-mail do responsável; apagados em 180 dias (TTL do DynamoDB, que remove com até 48 h de atraso). O CPF aparece apenas no e-mail do responsável e não vai no e-mail do comprador.
- O Pix é fixo: o pedido nasce como **"Aguardando confirmação do pagamento"**. Nada confirma pagamento sozinho; o responsável confere no banco e envia o livro.

## Proteção de custo (recomendado)

A URL é pública, então um ataque poderia gerar chamadas em volume. Duas travas simples:

```powershell
# alerta de orçamento: crie em Billing → Budgets (ex.: US$5/mês) com aviso por e-mail
# limite de execuções simultâneas (se a conta permitir; contas novas podem ter limite baixo)
aws lambda put-function-concurrency --function-name curva-zero-pedidos --region sa-east-1 --reserved-concurrent-executions 5
```

## Problemas comuns

- **403 ao chamar a URL**: a permissão pública não foi aplicada. Atualize o AWS CLI (`--invoked-via-function-url` é recente) e rode o script de novo, ou crie a URL pelo console (Configuration → Function URL, auth *NONE*), que aplica as duas permissões.
- **"Origem não autorizada"**: a origem do site não está em `-AllowedOrigins` (confira `http` vs `https`, e a porta no `localhost`).
- **502 "Não conseguimos avisar a equipe"**: o SES recusou o envio. Veja os logs; quase sempre é remetente não verificado, ou destinatário não verificado no sandbox. O pedido fica gravado e o reenvio tenta o aviso de novo.
