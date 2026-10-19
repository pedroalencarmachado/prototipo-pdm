// Monta o deploy/index.html a partir da fonte do prototipo e refaz o zip.
// Equivalente ao gerar-pacote.ps1, para rodar em qualquer SO (Linux, macOS,
// sessao do Claude Code na nuvem). Da raiz do repositorio:  node gerar-pacote.mjs
//
// Por que este script existe: a fonte (fontes/janelas-de-processamento.html) e um
// fragmento, sem <!doctype>/<html>/<head> - o Claude injeta isso ao publicar o
// artifact. Para o arquivo funcionar sozinho num servidor, o <head> tem de ser
// montado aqui. Sem o <meta charset>, todos os acentos quebram na pagina.
//
// A saida e identica byte a byte a do gerar-pacote.ps1 (a fonte e CRLF, o
// cabecalho montado aqui e LF, sem quebra de linha no fim).

import { readFileSync, writeFileSync, existsSync, mkdirSync, rmSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const base   = dirname(fileURLToPath(import.meta.url));
const fonte  = join(base, "fontes", "janelas-de-processamento.html");
const deploy = join(base, "deploy");
const saida  = join(deploy, "index.html");
const zip    = join(base, "prototipo-cloudflare.zip");

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
<meta name="description" content="Prototipo navegavel - proposta de Janelas de Processamento para o Portal do Usuario do Programa Pe-de-Meia. Dados ilustrativos.">
${head}
</head>
<body>
${body}
</body>
</html>`;

// UTF-8 sem BOM
writeFileSync(saida, doc, "utf8");

// _headers e _redirects tem de subir junto
for (const f of ["_headers", "_redirects"]) {
  if (!existsSync(join(deploy, f))) {
    console.warn(`AVISO: ${f} nao esta na pasta deploy. O noindex / fallback nao sera aplicado.`);
  }
}

let zipMsg = zip;
try {
  if (existsSync(zip)) rmSync(zip);
  execFileSync("zip", ["-q", "-j", zip, saida, join(deploy, "_headers"), join(deploy, "_redirects")]);
} catch {
  zipMsg = "(nao gerado - comando zip indisponivel; nao e necessario para publicar)";
}

const kb  = Math.round(statSync(saida).size / 1024);
const rev = (doc.match(/Revis.o \d+ . \w+ de \d{4}/) || ["(nao encontrada)"])[0];

console.log("");
console.log(`  index.html gerado: ${kb} KB`);
console.log(`  versao no rodape:  ${rev}`);
console.log(`  zip:               ${zipMsg}`);
console.log("");
console.log("  Para publicar, rode:");
console.log("");
console.log('  npx --yes wrangler pages deploy "./deploy" --project-name=prototipo-portalpdm');
console.log("");
