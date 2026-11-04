// Monta o deploy-gestao/index.html a partir da fonte do Painel de Gestao.
// E o par do gerar-pacote.mjs para o link novo (prototipo-portalpdm-gestao):
// le OUTRA fonte e escreve em OUTRA pasta. Nao toca em fontes/janelas-de-processamento.html
// nem em deploy/ - o link das entrevistas fica intocado.
//
// Da raiz do repositorio:  node gerar-pacote-gestao.mjs

import { readFileSync, writeFileSync, existsSync, mkdirSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const base   = dirname(fileURLToPath(import.meta.url));
const fonte  = join(base, "fontes", "painel-de-gestao.html");
const deploy = join(base, "deploy-gestao");
const saida  = join(deploy, "index.html");

if (!existsSync(fonte)) throw new Error(`Fonte nao encontrada: ${fonte}`);
if (!existsSync(deploy)) mkdirSync(deploy, { recursive: true });

let s = readFileSync(fonte, "utf8");
if (s.charCodeAt(0) === 0xfeff) s = s.slice(1);

// O corpo da pagina comeca na faixa de prototipo; tudo antes disso e head.
const marca = '<div class="proto-bar">';
const i = s.indexOf(marca);
if (i < 0) throw new Error("Marcador nao encontrado na fonte. A estrutura do arquivo mudou?");

const head = s.slice(0, i).trimEnd();
const body = s.slice(i).trimEnd();

const doc = `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<meta name="description" content="Prototipo navegavel - Painel de Gestao do Portal do Usuario do Programa Pe-de-Meia (visao gerencial). Dados ilustrativos.">
${head}
</head>
<body>
${body}
</body>
</html>`;

writeFileSync(saida, doc, "utf8");   // UTF-8 sem BOM

for (const f of ["_headers", "_redirects"]) {
  if (!existsSync(join(deploy, f))) {
    console.warn(`AVISO: ${f} nao esta na pasta deploy-gestao. O noindex / fallback nao sera aplicado.`);
  }
}

const kb  = Math.round(statSync(saida).size / 1024);
const rev = (doc.match(/Painel de Gest.o: Revis.o \d+ . \w+ de \d{4}/) || ["(nao encontrada)"])[0];

console.log("");
console.log(`  deploy-gestao/index.html gerado: ${kb} KB`);
console.log(`  versao no rodape: ${rev}`);
console.log("");
console.log("  Para publicar (PowerShell, fora da pasta do git):");
console.log("");
console.log('  cd $env:TEMP; npx --yes wrangler pages deploy "C:\\dev\\prototipo-pdm\\deploy-gestao" --project-name=prototipo-portalpdm-gestao --branch=production');
console.log("");
