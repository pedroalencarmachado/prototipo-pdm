// Gera entregaveis/Pe-de-Meia-Painel-de-Gestao-sintese.pdf a partir de
// sintese/sintese-painel-de-gestao.html (texto) e sintese/prints/ (telas).
// Para refazer os prints antes: node sintese/capturar-prints.mjs
//
// Requer puppeteer-core (fora do repositório) e o Chrome instalado:
//   $env:FERRAMENTAS="<pasta com node_modules/puppeteer-core>"; node sintese/gerar-pdf-sintese.mjs
import { createRequire } from "node:module";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { existsSync, statSync } from "node:fs";

const base = dirname(dirname(fileURLToPath(import.meta.url)));
const req = createRequire(process.env.FERRAMENTAS ? join(process.env.FERRAMENTAS, "x.js") : import.meta.url);
const puppeteer = req("puppeteer-core");
const chrome = [process.env.CHROME, "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"].find(p => p && existsSync(p));
const fonte = join(base, "sintese", "sintese-painel-de-gestao.html");
const saida = join(base, "entregaveis", "Pe-de-Meia-Painel-de-Gestao-sintese.pdf");

const browser = await puppeteer.launch({ executablePath: chrome, headless: true, args: ["--allow-file-access-from-files"] });
const page = await browser.newPage();
await page.goto(pathToFileURL(fonte).href, { waitUntil: "networkidle0", timeout: 60000 });
await page.evaluate(() => document.fonts.ready);
await page.pdf({
  path: saida, format: "A4", printBackground: true, preferCSSPageSize: true,
  displayHeaderFooter: true,
  headerTemplate: "<span></span>",
  footerTemplate: `<div style="width:100%; font-size:7.5pt; color:#71809A; font-family:Segoe UI, sans-serif; padding:0 16mm; display:flex; justify-content:space-between">
    <span>Pé-de-Meia · Painel de Gestão e ajustes das entrevistas e do MEC — síntese · Revisão 2 · protótipo, dados ilustrativos</span>
    <span><span class="pageNumber"></span> / <span class="totalPages"></span></span></div>`
});
await browser.close();
console.log(`  PDF: ${saida} (${Math.round(statSync(saida).size / 1024)} KB)`);
