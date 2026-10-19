# Monta o deploy\index.html a partir da fonte do prototipo e refaz o zip.
# Rode a partir da pasta de handoff:  .\gerar-pacote.ps1
#
# Por que este script existe: a fonte (fontes\janelas-de-processamento.html) e um
# fragmento, sem <!doctype>/<html>/<head> - o Claude injeta isso ao publicar o
# artifact. Para o arquivo funcionar sozinho num servidor, o <head> tem de ser
# montado aqui. Sem o <meta charset>, todos os acentos quebram na pagina.

$ErrorActionPreference = "Stop"
$base   = $PSScriptRoot
$fonte  = Join-Path $base "fontes\janelas-de-processamento.html"
$deploy = Join-Path $base "deploy"
$saida  = Join-Path $deploy "index.html"
$zip    = Join-Path $base "prototipo-cloudflare.zip"

if (-not (Test-Path $fonte))  { throw "Fonte nao encontrada: $fonte" }
if (-not (Test-Path $deploy)) { New-Item -ItemType Directory -Force $deploy | Out-Null }

$s = Get-Content $fonte -Raw -Encoding UTF8

# O corpo da pagina comeca na faixa de prototipo; tudo antes disso e head.
$marca = '<div class="proto-bar">'
$i = $s.IndexOf($marca)
if ($i -lt 0) { throw "Marcador nao encontrado na fonte. A estrutura do arquivo mudou?" }

$head = $s.Substring(0, $i).TrimEnd()
$body = $s.Substring($i).TrimEnd()

$doc = @"
<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<meta name="description" content="Prototipo navegavel - proposta de Janelas de Processamento para o Portal do Usuario do Programa Pe-de-Meia. Dados ilustrativos.">
$head
</head>
<body>
$body
</body>
</html>
"@

# UTF-8 sem BOM
[System.IO.File]::WriteAllText($saida, $doc, (New-Object System.Text.UTF8Encoding($false)))

# _headers e _redirects tem de subir junto
foreach ($f in @("_headers","_redirects")) {
  if (-not (Test-Path (Join-Path $deploy $f))) {
    Write-Warning "$f nao esta na pasta deploy. O noindex / fallback nao sera aplicado."
  }
}

if (Test-Path $zip) { Remove-Item $zip -Force }
Compress-Archive -Path (Join-Path $deploy "*") -DestinationPath $zip

$kb  = [math]::Round((Get-Item $saida).Length / 1KB)
$rev = (Select-String -Path $saida -Pattern "Revis.o \d+ . \w+ de \d{4}").Matches.Value

Write-Output ""
Write-Output "  index.html gerado: $kb KB"
Write-Output "  versao no rodape:  $rev"
Write-Output "  zip:               $zip"
Write-Output ""
Write-Output "  Para publicar, rode:"
Write-Output ""
Write-Output "  npx --yes wrangler pages deploy `".\deploy`" --project-name=prototipo-portalpdm"
Write-Output ""
