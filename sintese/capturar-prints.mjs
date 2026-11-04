// Captura os prints usados na síntese do Painel de Gestão (sintese/prints/*.jpg).
// Abre as páginas direto dos arquivos — deploy-gestao/ (versão nova) e, só para os
// prints de "antes", deploy/ (protótipo das entrevistas, apenas lido, nunca alterado).
//
// Requer o pacote puppeteer-core (não fica no repositório) e o Chrome instalado:
//   npm i puppeteer-core          (numa pasta qualquer)
//   $env:FERRAMENTAS="<essa pasta>"; node sintese/capturar-prints.mjs
import { createRequire } from "node:module";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { mkdirSync, existsSync } from "node:fs";

const base = dirname(dirname(fileURLToPath(import.meta.url)));
const req = createRequire(process.env.FERRAMENTAS ? join(process.env.FERRAMENTAS, "x.js") : import.meta.url);
const puppeteer = req("puppeteer-core");
const chrome = [process.env.CHROME, "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"].find(p => p && existsSync(p));
const NOVO = pathToFileURL(join(base, "deploy-gestao", "index.html")).href;
const ANTES = pathToFileURL(join(base, "deploy", "index.html")).href;
const OUT = join(base, "sintese", "prints");
mkdirSync(OUT, { recursive: true });

const browser = await puppeteer.launch({ executablePath: chrome, headless: true, args: ["--allow-file-access-from-files"] });
const page = await browser.newPage();
await page.setViewport({ width: 1366, height: 900, deviceScaleFactor: 1.5 });
const espera = ms => new Promise(r => setTimeout(r, ms));

async function abrir(url, hash){
  await page.goto(url + (hash || ""), { waitUntil: "load" });
  await page.addStyleTag({ content: ".proto-bar,.topbar{position:static !important} *{animation:none !important; transition:none !important}" });
  await page.evaluate(() => document.fonts && document.fonts.ready);
  await espera(300);
}
async function rodar(js){ await page.evaluate(js); await espera(250); }
/* recorta de um elemento ao outro, na largura da área de conteúdo */
async function print(nome, fn, pad = 10){
  const r = await page.evaluate(fn);
  if (!r) throw new Error("região não encontrada: " + nome);
  const clip = { x: Math.max(0, r.x - pad), y: Math.max(0, r.y - pad), width: r.w + pad * 2, height: r.h + pad * 2 };
  await page.screenshot({ path: join(OUT, nome + ".jpg"), type: "jpeg", quality: 86, clip, captureBeyondViewport: true });
  console.log("  " + nome);
}
/* função (texto) que devolve a caixa entre dois elementos */
const entre = (topo, fundo) => `(() => {
  const app = document.getElementById('app').getBoundingClientRect();
  const t = (${topo})(), b = (${fundo})();
  if (!t || !b) return null;
  const tr = t.getBoundingClientRect(), br = b.getBoundingClientRect();
  return { x: app.left + 18, y: tr.top + scrollY, w: app.width - 36, h: br.bottom - tr.top };
})()`;
const q = s => `() => document.querySelector(${JSON.stringify(s)})`;
const ql = s => `() => [...document.querySelectorAll(${JSON.stringify(s)})].pop()`;
const antesDoExport = `() => { const e = [...document.querySelectorAll('#app .export')].pop(); return e ? e.previousElementSibling : null; }`;
const linha = n => `() => document.querySelectorAll('#app table tbody tr')[${n}] || [...document.querySelectorAll('#app table tbody tr')].pop()`;

/* ═════════════ PARTE 1 — PAINEL DE GESTÃO ═════════════ */
await abrir(NOVO, "#/gestao");
await rodar("setRoteiro('a'); render()");
await print("p01-painel-visao-geral", entre(q(".page-head"), q(".ins-wrap")));
await rodar("gInsIr(1)");
await print("p02-insights-pagina-2", entre(q(".ins-wrap"), q(".ins-wrap")));
await rodar("gInsIr(0)");
for (const [aba, nome] of [["elegibilidade", "p03-aba-elegibilidade"], ["frequencia", "p04-aba-frequencia"], ["pagamento", "p05-aba-pagamento"],
                           ["ciclos", "p06-aba-ciclos"], ["municipios", "p07-aba-municipios"], ["modalidades", "p08-aba-emr-eja"]]){
  await rodar(`state.gAba='${aba}'; render()`);
  await print(nome, entre(q("#app .tabs"), antesDoExport));
}
await rodar("state.gAba='elegibilidade'; gSetProc('2026-07-24')");
await print("p09-filtro-processamento-2407", entre(q(".gfil"), q(".ins-wrap")));
await rodar("gSetProc('')");
await rodar("state.gAba='elegibilidade'; render(); document.querySelectorAll('.gcard')[0].scrollIntoView({block:'center'})");
{
  const box = await page.evaluate(() => { const r = document.querySelectorAll('.gsvg')[0].querySelectorAll('.hcol rect')[5].getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + 80 }; });
  await page.mouse.move(box.x, box.y); await espera(200);
  await print("p10-tooltip-grafico", `(() => { const c = document.querySelectorAll('.gcard')[0].getBoundingClientRect(); const t = document.querySelector('.gtip').getBoundingClientRect();
    const top = Math.min(c.top, t.top), bot = Math.max(c.bottom, t.bottom), l = Math.min(c.left, t.left), r = Math.max(c.right, t.right);
    return { x: l, y: top + scrollY, w: r - l, h: bot - top }; })()`);
  await page.mouse.move(5, 5);
}

/* ═════════════ PARTE 2 — MUDANÇAS DO FEEDBACK DAS REDES ═════════════ */
const ateOutrosAcessos = `() => { const t = [...document.querySelectorAll('#app .section-title')].find(e => e.textContent.includes('Outros acessos')); return t ? t.previousElementSibling : null; }`;
await abrir(ANTES, "#/inicio");
await rodar("setRoteiro('a'); render()");
await print("f01-inicio-antes", entre(q(".page-head"), ateOutrosAcessos));
await abrir(ANTES, "#/pagamento");
await print("f03-pagamento-antes", entre(q(".page-head"), q("#app .panel")));
await abrir(ANTES, "#/elegibilidade");
await print("f05-elegibilidade-antes", entre(q(".page-head"), linha(2)));

await abrir(NOVO, "#/inicio");
await rodar("setRoteiro('a'); limparFiltros(); render()");
await print("f02-inicio-depois", entre(q(".page-head"), ateOutrosAcessos));
await rodar("irCom('#/pagamento', {})"); await espera(300);
await print("f04-pagamento-depois", entre(q(".page-head"), q(".fchips")));
await rodar("irCom('#/elegibilidade', {sitF:'Não elegível'})"); await espera(300);
await print("f06-elegibilidade-depois", entre(q(".page-head"), linha(2)));
await rodar("irCom('#/pagamento', {janela:'2026-08-26', ciclo:'todos', sitPagF:'Aguardando Pagamento'})"); await espera(300);
await print("f07-pagamento-agosto-aguardando", entre(q("#app .filters"), linha(3)));
await rodar("location.hash = '#/janela/2026-08-26'"); await espera(300);
await print("f08-detalhe-processamento", entre(q(".win-head"), q("#app .tbl-wrap")));
await rodar("irCom('#/elegibilidade', {janela:'2026-08-26', ciclo:'2024', altF:true})"); await espera(300);
await print("f09-lista-alteradas", entre(q(".lhead"), q("#app .tbl-wrap")));
await rodar("location.hash = '#/processamentos'"); await espera(300);
await print("f10-lista-processamentos", entre(q(".page-head"), `() => document.querySelectorAll('.window-card')[1]`));
await rodar("irCom('#/elegibilidade', {busca:'116324677421'})"); await espera(300);
await print("f11-busca-codigo", entre(q(".lhead"), q("#app .tbl-wrap")));
/* modal: aumenta a janela para caber inteiro */
await page.setViewport({ width: 1366, height: 1700, deviceScaleFactor: 1.5 });
await rodar("irCom('#/pagamento', {busca:'123.456.789-01', ciclo:'todos'})"); await espera(300);
await rodar("const e=[...document.querySelectorAll('#app table .eye')]; e[e.length-1].click()");
{
  const el = await page.$(".modal");
  await el.screenshot({ path: join(OUT, "f12-detalhe-estudante-trajetoria.jpg"), type: "jpeg", quality: 86 });
  console.log("  f12-detalhe-estudante-trajetoria");
}
await browser.close();
