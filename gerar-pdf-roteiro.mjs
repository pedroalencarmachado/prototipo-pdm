// Gera os PDFs do roteiro (versao A e versao B do termo) via Chrome/Chromium headless.
// Equivalente ao gerar-pdf-roteiro.ps1, para rodar em qualquer SO.
// Da raiz do repositorio:  node gerar-pdf-roteiro.mjs
//
// O CSS de impressao (quebras de pagina, densidade, cores) vive dentro da propria
// fonte, num bloco @media print. A fonte e um fragmento sem <head>, como a do
// prototipo; aqui ela ganha o <head> com charset numa copia temporaria, que e
// impressa duas vezes: #versao-a ("processamento") e #versao-b ("janela de
// processamento"). O navegador pode ser indicado pela variavel CHROME.

import { readFileSync, writeFileSync, existsSync, mkdirSync, statSync, readdirSync, rmSync } from "node:fs";
import { join, dirname } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath, pathToFileURL } from "node:url";
import { spawnSync } from "node:child_process";

const base  = dirname(fileURLToPath(import.meta.url));
const fonte = join(base, "fontes", "entrevistas-com-as-redes.html");
const dir   = join(base, "entregaveis");
const versoes = [
  { id: "a", saida: "Pe-de-Meia-Entrevistas-com-as-Redes-versao-A-processamento.pdf" },
  { id: "b", saida: "Pe-de-Meia-Entrevistas-com-as-Redes-versao-B-janela-de-processamento.pdf" },
];

if (!existsSync(fonte)) throw new Error(`Fonte nao encontrada: ${fonte}`);
if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

function acharNavegador() {
  const c = [process.env.CHROME];
  if (process.platform === "win32") {
    for (const pf of [process.env.ProgramFiles, process.env["ProgramFiles(x86)"]]) {
      if (!pf) continue;
      c.push(join(pf, "Google", "Chrome", "Application", "chrome.exe"));
      c.push(join(pf, "Microsoft", "Edge", "Application", "msedge.exe"));
    }
  } else if (process.platform === "darwin") {
    c.push("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome");
    c.push("/Applications/Chromium.app/Contents/MacOS/Chromium");
  } else {
    c.push("/usr/bin/google-chrome", "/usr/bin/chromium", "/usr/bin/chromium-browser");
    const pw = process.env.PLAYWRIGHT_BROWSERS_PATH || "/opt/pw-browsers";
    if (existsSync(pw)) {
      for (const d of readdirSync(pw).filter(d => /^chromium-\d+$/.test(d)).sort().reverse()) {
        c.push(join(pw, d, "chrome-linux", "chrome"));
      }
    }
  }
  return c.find(p => p && existsSync(p));
}

const exe = acharNavegador();
if (!exe) throw new Error("Nenhum Chrome/Chromium/Edge encontrado. Indique o caminho na variavel CHROME.");
console.log(`  navegador: ${exe}`);

let s = readFileSync(fonte, "utf8");
if (s.charCodeAt(0) === 0xfeff) s = s.slice(1);

// O corpo comeca no wrapper do documento; tudo antes disso e head.
const marca = '<div class="wrap">';
const i = s.indexOf(marca);
if (i < 0) throw new Error("Marcador nao encontrado na fonte. A estrutura do arquivo mudou?");

const doc = `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
${s.slice(0, i).trimEnd()}
</head>
<body>
${s.slice(i).trimEnd()}
</body>
</html>`;

const temp = join(tmpdir(), "pdm-roteiro-print.html");
writeFileSync(temp, doc, "utf8");

try {
  for (const v of versoes) {
    const saida = join(dir, v.saida);
    if (existsSync(saida)) rmSync(saida);
    const url = pathToFileURL(temp).href + `#versao-${v.id}`;
    spawnSync(exe, [
      "--headless", "--disable-gpu", "--no-sandbox", "--no-pdf-header-footer",
      "--virtual-time-budget=12000", `--print-to-pdf=${saida}`, url,
    ], { stdio: "ignore" });
    if (!existsSync(saida)) throw new Error(`O PDF da versao ${v.id.toUpperCase()} nao foi gerado.`);
    console.log(`  PDF gerado: ${saida} (${Math.round(statSync(saida).size / 1024)} KB)`);
  }
} finally {
  rmSync(temp, { force: true });
}
