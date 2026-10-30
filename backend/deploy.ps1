# Cria (ou atualiza) a API de pedidos do livro na AWS: tabela DynamoDB, papel IAM, Lambda, Function URL e identidade do SES.
# Pode ser executado de novo para publicar uma nova versão do código ou mudar as variáveis. Passo a passo: backend/README.md.
#
# Exemplo (teste):
#   .\backend\deploy.ps1 -OwnerEmail igorluizbelterrosiak@gmail.com -MailFrom igorluizbelterrosiak@gmail.com -AllowedOrigins "http://localhost:3000"
param(
  [Parameter(Mandatory)] [string] $OwnerEmail,   # quem recebe cada pedido
  [Parameter(Mandatory)] [string] $MailFrom,     # remetente: e-mail ou domínio verificado no SES
  [Parameter(Mandatory)] [string] $AllowedOrigins, # origens do site, separadas por vírgula, sem barra no fim (ex.: https://main.xxxx.amplifyapp.com)
  [string] $Region = "sa-east-1",
  [string] $Name = "curva-zero-pedidos",
  [int] $PriceCents = 4990,
  [string] $ConfigSet = "curva-zero" # conjunto de configuração do SES com alerta de bounce/reclamação (vazio = sem)
)
$ErrorActionPreference = "Continue"
$root = Split-Path -Parent $PSScriptRoot
$dist = Join-Path $PSScriptRoot "dist"

function Step($t) { Write-Host "`n==> $t" -ForegroundColor Cyan }
function Ok { if ($LASTEXITCODE -ne 0) { throw "Falhou (código $LASTEXITCODE). Veja a mensagem acima." } }
function Exists { $LASTEXITCODE -eq 0 }
function WriteJson($path, $obj) { [IO.File]::WriteAllText($path, ($obj | ConvertTo-Json -Depth 10 -Compress), (New-Object Text.UTF8Encoding($false))) }

$account = aws sts get-caller-identity --query Account --output text --region $Region; Ok
Write-Host "Conta AWS $account · região $Region"

Step "Gerando o pacote da Lambda"
New-Item -ItemType Directory -Force $dist | Out-Null
Push-Location $root
npx esbuild backend/lambda.ts --bundle --platform=node --target=node22 --format=cjs --outfile=backend/dist/index.js --log-level=warning; Ok
Pop-Location
$zip = Join-Path $dist "lambda.zip"
if (Test-Path $zip) { Remove-Item $zip }
Compress-Archive -Path (Join-Path $dist "index.js") -DestinationPath $zip

Step "Tabela DynamoDB ($Name)"
aws dynamodb describe-table --table-name $Name --region $Region *> $null
if (-not (Exists)) {
  aws dynamodb create-table --table-name $Name --region $Region --billing-mode PAY_PER_REQUEST `
    --attribute-definitions AttributeName=pk,AttributeType=S --key-schema AttributeName=pk,KeyType=HASH | Out-Null; Ok
  aws dynamodb wait table-exists --table-name $Name --region $Region; Ok
  # apaga sozinha os itens vencidos (pedidos após 180 dias, chaves de idempotência e contadores)
  aws dynamodb update-time-to-live --table-name $Name --region $Region --time-to-live-specification "Enabled=true,AttributeName=ttl" | Out-Null; Ok
} else { Write-Host "já existe" }

Step "Papel IAM ($Name-role)"
$roleName = "$Name-role"
$roleArn = "arn:aws:iam::${account}:role/$roleName"
aws iam get-role --role-name $roleName *> $null
if (-not (Exists)) {
  $trust = Join-Path $dist "trust.json"
  WriteJson $trust @{ Version = "2012-10-17"; Statement = @(@{ Effect = "Allow"; Principal = @{ Service = "lambda.amazonaws.com" }; Action = "sts:AssumeRole" }) }
  aws iam create-role --role-name $roleName --assume-role-policy-document "file://$trust" | Out-Null; Ok
  aws iam attach-role-policy --role-name $roleName --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole; Ok
  $newRole = $true
} else { Write-Host "já existe" }
# permissões mínimas: só esta tabela e só enviar e-mail
$policy = Join-Path $dist "policy.json"
WriteJson $policy @{ Version = "2012-10-17"; Statement = @(
  @{ Effect = "Allow"; Action = @("dynamodb:GetItem", "dynamodb:PutItem", "dynamodb:UpdateItem"); Resource = "arn:aws:dynamodb:${Region}:${account}:table/$Name" },
  @{ Effect = "Allow"; Action = @("ses:SendEmail"); Resource = "*" }
) }
aws iam put-role-policy --role-name $roleName --policy-name "$Name-access" --policy-document "file://$policy"; Ok
if ($newRole) { Write-Host "aguardando o papel propagar..."; Start-Sleep -Seconds 12 }

Step "Identidade do SES ($MailFrom)"
$identity = if ($MailFrom -match "<(.+)>") { $Matches[1] } else { $MailFrom }
aws sesv2 get-email-identity --email-identity $identity --region $Region *> $null
$covered = Exists
if (-not $covered) {
  # um endereço também fica coberto quando o domínio dele está verificado
  aws sesv2 get-email-identity --email-identity ($identity -split "@")[-1] --region $Region *> $null
  $covered = Exists
}
if (-not $covered) {
  aws sesv2 create-email-identity --email-identity $identity --region $Region | Out-Null; Ok
  Write-Host "Enviamos um e-mail de verificação para ${identity}: abra e clique no link." -ForegroundColor Yellow
} else { Write-Host "já existe (confira se está verificada no console do SES)" }

Step "Função Lambda ($Name)"
$envFile = Join-Path $dist "env.json"
WriteJson $envFile @{ Variables = @{ TABLE_NAME = $Name; OWNER_EMAIL = $OwnerEmail; MAIL_FROM = $MailFrom; ALLOWED_ORIGINS = $AllowedOrigins; PRICE_CENTS = "$PriceCents"; CONFIG_SET = $ConfigSet } }
aws lambda get-function --function-name $Name --region $Region *> $null
if (-not (Exists)) {
  aws lambda create-function --function-name $Name --region $Region --runtime nodejs22.x --handler index.handler `
    --role $roleArn --zip-file "fileb://$zip" --timeout 15 --memory-size 256 --environment "file://$envFile" | Out-Null; Ok
} else {
  aws lambda update-function-code --function-name $Name --region $Region --zip-file "fileb://$zip" | Out-Null; Ok
  aws lambda wait function-updated --function-name $Name --region $Region; Ok
  aws lambda update-function-configuration --function-name $Name --region $Region --environment "file://$envFile" | Out-Null; Ok
}
aws lambda wait function-active-v2 --function-name $Name --region $Region; Ok

Step "Endereço público (Function URL)"
# o CORS é tratado no código (lista ALLOWED_ORIGINS), por isso não há configuração de CORS aqui
$url = aws lambda get-function-url-config --function-name $Name --region $Region --query FunctionUrl --output text 2>$null
if (-not $url) {
  $url = aws lambda create-function-url-config --function-name $Name --region $Region --auth-type NONE --query FunctionUrl --output text; Ok
}
# acesso público à URL (sem isso a chamada devolve 403); erro de "já existe" é esperado em reexecuções
aws lambda add-permission --function-name $Name --region $Region --statement-id FunctionURLAllowPublicAccess `
  --action lambda:InvokeFunctionUrl --principal "*" --function-url-auth-type NONE *> $null
aws lambda add-permission --function-name $Name --region $Region --statement-id FunctionURLAllowInvoke `
  --action lambda:InvokeFunction --principal "*" --invoked-via-function-url *> $null

Write-Host "`nPronto. Endereço da API:" -ForegroundColor Green
Write-Host "  $url"
Write-Host "Use esse valor em NEXT_PUBLIC_ORDER_API_URL (sem mudar nada, com a barra no final)."
