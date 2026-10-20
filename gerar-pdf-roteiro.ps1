# Gera os PDFs do roteiro das entrevistas (versao A e versao B do termo) via Chrome headless.
# Rode a partir da pasta do repositorio:  .\gerar-pdf-roteiro.ps1
# Fora do Windows, o equivalente e:       node gerar-pdf-roteiro.mjs
#
# O CSS de impressao (quebras de pagina, densidade, cores) vive dentro da propria
# fonte, fontes\entrevistas-com-as-redes.html, num bloco @media print. A fonte e um
# fragmento sem <head>; aqui ela ganha o <head> com charset numa copia temporaria,
# que e impressa duas vezes: #versao-a ("processamento") e #versao-b ("janela de
# processamento").

$ErrorActionPreference = "Stop"
$base  = $PSScriptRoot
$fonte = Join-Path $base "fontes\entrevistas-com-as-redes.html"
$dir   = Join-Path $base "entregaveis"
$temp  = Join-Path $env:TEMP "pdm-roteiro-print.html"

$versoes = @(
  @{ id = "a"; saida = "Pe-de-Meia-Entrevistas-com-as-Redes-versao-A-processamento.pdf" },
  @{ id = "b"; saida = "Pe-de-Meia-Entrevistas-com-as-Redes-versao-B-janela-de-processamento.pdf" }
)

if (-not (Test-Path $fonte)) { throw "Fonte nao encontrada: $fonte" }
if (-not (Test-Path $dir))   { New-Item -ItemType Directory -Force $dir | Out-Null }

$navegadores = @(
  "$env:ProgramFiles\Google\Chrome\Application\chrome.exe",
  "${env:ProgramFiles(x86)}\Google\Chrome\Application\chrome.exe",
  "${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe",
  "$env:ProgramFiles\Microsoft\Edge\Application\msedge.exe"
)
$exe = $navegadores | Where-Object { Test-Path $_ } | Select-Object -First 1
if (-not $exe) { throw "Nem Chrome nem Edge foram encontrados nesta maquina." }

Write-Output "  navegador: $(Split-Path $exe -Leaf)"

$s = Get-Content $fonte -Raw -Encoding UTF8

# O corpo comeca no wrapper do documento; tudo antes disso e head.
$marca = '<div class="wrap">'
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
$head
</head>
<body>
$body
</body>
</html>
"@

# UTF-8 sem BOM
[System.IO.File]::WriteAllText($temp, $doc, (New-Object System.Text.UTF8Encoding($false)))

try {
  foreach ($v in $versoes) {
    $saida = Join-Path $dir $v.saida
    if (Test-Path $saida) { Remove-Item $saida -Force }
    $url = "file:///" + ($temp -replace '\\','/') + "#versao-" + $v.id

    # O Chrome escreve a confirmacao no stderr. No PowerShell 5.1 isso vira
    # NativeCommandError e derrubaria o script com ErrorActionPreference = Stop,
    # mesmo com o PDF gerado corretamente. Por isso afrouxamos so nesta chamada
    # e validamos pelo arquivo, que e o que importa.
    $ErrorActionPreference = "Continue"
    & $exe --headless --disable-gpu --no-sandbox --no-pdf-header-footer --virtual-time-budget=12000 --print-to-pdf="$saida" $url 2>&1 | Out-Null
    $ErrorActionPreference = "Stop"

    if (-not (Test-Path $saida)) { throw "O PDF da versao $($v.id.ToUpper()) nao foi gerado." }
    $kb = [math]::Round((Get-Item $saida).Length / 1KB)
    Write-Output "  PDF gerado: $saida ($kb KB)"
  }
} finally {
  if (Test-Path $temp) { Remove-Item $temp -Force }
}

Write-Output ""
Write-Output "  Esperado: 11 paginas A4 em cada versao, um bloco de tarefas por pagina."
