// Gera entregaveis/Pe-de-Meia-Roteiro-de-Apresentacao-Painel-de-Gestao.pdf a partir de
// apresentacao/roteiro-apresentacao-painel-de-gestao.html — roteiro do hands-on com o MEC
// (Processamentos e Painel de Gestão). Não tem relação com os roteiros das entrevistas.
//
// Requer puppeteer-core (fora do repositório) e o Chrome instalado:
//   $env:FERRAMENTAS="<pasta com node_modules/puppeteer-core>"; node apresentacao/gerar-pdf-roteiro-apresentacao.mjs
import { createRequire } from "node:module";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { existsSync, statSync } from "node:fs";

const base = dirname(dirname(fileURLToPath(import.meta.url)));
const req = createRequire(process.env.FERRAMENTAS ? join(process.env.FERRAMENTAS, "x.js") : import.meta.url);
const puppeteer = req("puppeteer-core");
const chrome = [process.env.CHROME, "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"].find(p => p && existsSync(p));
const fonte = join(base, "apresentacao", "roteiro-apresentacao-painel-de-gestao.html");
const saida = join(base, "entregaveis", "Pe-de-Meia-Roteiro-de-Apresentacao-Painel-de-Gestao.pdf");

const browser = await puppeteer.launch({ executablePath: chrome, headless: true });
const page = await browser.newPage();
await page.goto(pathToFileURL(fonte).href, { waitUntil: "networkidle0", timeout: 60000 });
await page.evaluate(() => document.fonts.ready);
await page.pdf({
  path: saida, format: "A4", printBackground: true, preferCSSPageSize: true,
  displayHeaderFooter: true,
  headerTemplate: "<span></span>",
  footerTemplate: `<div style="width:100%; font-size:7.5pt; color:#71809A; font-family:Segoe UI, sans-serif; padding:0 14mm; display:flex; justify-content:space-between">
    <span>Pé-de-Meia · Roteiro de apresentação — Processamentos e Painel de Gestão · hands-on com o MEC · 40 min</span>
    <span><span class="pageNumber"></span> / <span class="totalPages"></span></span></div>`
});
await browser.close();
console.log(`  PDF: ${saida} (${Math.round(statSync(saida).size / 1024)} KB)`);
