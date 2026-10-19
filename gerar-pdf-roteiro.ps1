# Gera o PDF do roteiro das entrevistas via Chrome headless.
# Rode a partir da pasta de handoff:  .\gerar-pdf-roteiro.ps1
#
# O CSS de impressao (quebras de pagina, densidade, cores) vive dentro do proprio
# fontes\entrevistas-print.html, num bloco @media print. Se editar o roteiro em
# entrevistas-com-as-redes.html, replique a alteracao no arquivo de impressao.

$ErrorActionPreference = "Stop"
$base  = $PSScriptRoot
$fonte = Join-Path $base "fontes\entrevistas-print.html"
$dir   = Join-Path $base "entregaveis"
$saida = Join-Path $dir  "Pe-de-Meia-Entrevistas-com-as-Redes.pdf"

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

$url = "file:///" + ($fonte -replace '\\','/')

# O Chrome escreve a confirmacao no stderr. No PowerShell 5.1 isso vira
# NativeCommandError e derrubaria o script com ErrorActionPreference = Stop,
# mesmo com o PDF gerado corretamente. Por isso afrouxamos so nesta chamada
# e validamos pelo arquivo, que e o que importa.
$ErrorActionPreference = "Continue"
& $exe --headless --disable-gpu --no-sandbox --no-pdf-header-footer --virtual-time-budget=12000 --print-to-pdf="$saida" $url 2>&1 | Out-Null
$ErrorActionPreference = "Stop"

if (-not (Test-Path $saida)) { throw "O PDF nao foi gerado." }

$kb = [math]::Round((Get-Item $saida).Length / 1KB)
Write-Output "  PDF gerado: $saida ($kb KB)"
Write-Output ""
Write-Output "  Esperado: 7 paginas A4, um bloco de tarefas por pagina."
