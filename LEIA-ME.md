# Protótipo "Janelas de Processamento" — Portal do Pé-de-Meia

> **Handoff completo.** Tudo que foi feito, onde está, como publicar e o que ficou pendente.
> Última atualização: 20/10/2026 · Revisão 3 do protótipo, no ar · roteiro da 2ª rodada (versões A e B).

---

## Começando em outro computador

Se você acabou de descompactar este pacote num PC novo, faça só isto:

1. **Descompacte em uma pasta simples**, por exemplo `C:\pdm-janelas\`. Evite caminho com acento.
2. **Abra o Claude Code nessa pasta** e diga: *"leia o LEIA-ME.md — vamos continuar o protótipo do Pé-de-Meia"*.
3. **Confirme que há Node instalado** (necessário só para publicar):
   ```powershell
   node --version
   ```
   Se não houver, instale de [nodejs.org](https://nodejs.org) — a versão LTS serve.
4. **Faça o login do Cloudflare** (o token é por máquina, então precisa ser refeito):
   ```powershell
   npx --yes wrangler login
   ```

Só isso. Os dois scripts usam caminho relativo à própria pasta, então funcionam de onde estiverem.
O Chrome só é necessário se você for regerar o PDF do roteiro.

**Nada mais precisa ser configurado.** Não há dependência de OneDrive, de memória do Claude ou de
qualquer estado da máquina anterior — este pacote se basta.

### Repositório no GitHub

Desde 19/10/2026 o pacote vive em **`pedroalencarmachado/prototipo-pdm`**, que passa a ser a cópia
válida (no lugar da pasta do OneDrive). Para continuar de qualquer lugar — inclusive numa sessão do
Claude Code na nuvem — basta abrir o repositório; o `CLAUDE.md` da raiz manda ler este documento.

- **Fora do Windows**, use `node gerar-pacote.mjs` no lugar do `.\gerar-pacote.ps1`. Os dois geram o
  mesmo `deploy/index.html`, byte a byte.
- O `.gitattributes` desliga a conversão de quebras de linha: as fontes são CRLF e precisam continuar
  assim para o `index.html` sair idêntico.
- O `prototipo-cloudflare.zip` não é versionado (é derivado de `deploy/`); os scripts o recriam.
- **Publicar continua sendo pela sua máquina** (seção 6). A sessão na nuvem não tem login do Cloudflare
  e a rede dela não alcança `*.pages.dev`.

---

## Índice

1. [O que é isto](#1-o-que-é-isto)
2. [Links rápidos](#2-links-rápidos)
3. [O problema que a proposta resolve](#3-o-problema-que-a-proposta-resolve)
4. [Vocabulário — o que usar e o que não usar](#4-vocabulário--o-que-usar-e-o-que-não-usar)
5. [Inventário de arquivos](#5-inventário-de-arquivos)
6. [Publicar uma nova versão](#6-publicar-uma-nova-versão)
7. [Regerar o pacote depois de editar o protótipo](#7-regerar-o-pacote-depois-de-editar-o-protótipo)
8. [Regerar o PDF do roteiro](#8-regerar-o-pdf-do-roteiro)
9. [Histórico de revisões](#9-histórico-de-revisões)
10. [Dados do protótipo e gabaritos das 15 tarefas](#10-dados-do-protótipo-e-gabaritos-das-15-tarefas)
11. [Restringir o acesso por e-mail](#11-restringir-o-acesso-por-e-mail)
12. [Pendências](#12-pendências)
13. [Armadilhas do ambiente](#13-armadilhas-do-ambiente)

---

## 1. O que é isto

Protótipo navegável de uma **proposta de evolução do Portal do Usuário do Programa Pé-de-Meia**:
acrescentar a leitura por **janela de processamento** — ver o que foi processado em cada data — ao
lado da leitura que já existe hoje, que é por **ciclo** (ano-referência do dado).

O protótipo é um **arquivo HTML único, sem backend**, com dados ilustrativos. Serve para duas coisas:

- apresentar a proposta ao time do MEC (Laís e Guilherme);
- rodar **testes de usabilidade com operadores de rede estadual**, usando o roteiro de 15 tarefas.

Nada nele altera sistema algum. A faixa preta no topo diz, de forma permanente,
*"Protótipo · dados ilustrativos · não é o portal oficial"*.

---

## 2. Links rápidos

| O quê | Onde |
|---|---|
| **Protótipo no ar** (link público, usado nas entrevistas) | https://prototipo-portalpdm.pages.dev |
| Protótipo — artifact (fonte editável no Claude) | https://claude.ai/artifact/5r7JJphRYHVbRn4fu6HX9y |
| Roteiro das entrevistas (2ª rodada, com o manual de conduta) — artifact | https://claude.ai/artifact/4aQCJZZ26h5ksv4TgUT1i6 |
| Documento explicativo da proposta — artifact ⚠️ *desatualizado (revisão 1)* | https://claude.ai/code/artifact/ca5c86ce-3ea5-4e63-ba3d-887a6dfeee7d |
| Painel do Cloudflare | https://dash.cloudflare.com → **Compute → Workers & Pages** → `prototipo-portalpdm` |

**Conta Cloudflare:** `pedro.machado@nees.ufal.br` · subdomínio `pedro-machado.workers.dev` · plano gratuito.

O link público **não é indexado** por buscadores (cabeçalho `x-robots-tag: noindex, nofollow, noarchive`),
mas **hoje qualquer pessoa com o endereço acessa**. Para restringir por e-mail, ver a [seção 11](#11-restringir-o-acesso-por-e-mail).

---

## 3. O problema que a proposta resolve

O Portal responde bem a *"como está o ciclo de 2026"*. Não responde a *"o que aconteceu no
processamento de 26 de agosto"*.

Num mesmo processamento são gerados resultados de **ciclos diferentes**. O caso real que originou tudo:
em agosto de 2026 houve um processamento que atingiu os ciclos de 2024, 2025 e 2026 ao mesmo tempo —
inclusive liberando **pagamento de matrícula do ciclo de 2024**. Um gestor que abre o Portal no dia
seguinte com o ciclo 2026 selecionado vê apenas um terço disso. Para achar o resto precisaria já saber
que havia algo para procurar.

A causa de fundo é o termo **Competência**: nas telas de elegibilidade ele exibe um *contador de
execuções* (por isso o ciclo 2024 chega a `202422` — a 22ª vez que o algoritmo rodou sobre 2024),
enquanto nas telas de pagamento exibe o *marco do calendário* (sempre 01 a 12). Mesmo rótulo, dados
diferentes.

**A proposta:** uma entrada nova no menu (*Processamentos*) com duas telas, e um filtro de janela nas
três listagens que já existem. Nada é removido, nada é reagrupado.

---

## 4. Vocabulário — o que usar e o que não usar

Decidido com o MEC ao longo de duas rodadas de revisão. **Seguir isso em qualquer evolução:**

| Não usar | Usar |
|---|---|
| execuções, apurações, avaliações | **matrículas processadas** |
| reprocessamento | **ciclos afetados** (o conceito sumiu da interface) |
| identificador de apuração (`202608`, `202422`) | nada — foi removido da tela |
| competência / códigos `AAAAMM` | nada na interface; só **incentivo** (Matrícula, Frequência, Conclusão, Enem) |
| elegibilidade (nos cartões de resumo) | **matrículas** |
| EMR e EJA separados na visão de janela | visão única; as abas existem só nas listagens |

O filtro de **Competência saiu** das listagens. Ficaram **Janela de processamento (filtro pai)** e
**Ciclo (filho)**, dependentes nos dois sentidos: escolher um ciclo reduz as janelas oferecidas,
escolher uma janela reduz os ciclos.

---

## 5. Inventário de arquivos

Tudo abaixo está nesta pasta de handoff. Os caminhos "no projeto" são onde os arquivos vivem
normalmente — a pasta `Documentos\IA\` sincroniza entre seus PCs pelo OneDrive.

### `deploy/` — o que sobe para o Cloudflare

| Arquivo | Para que serve |
|---|---|
| `index.html` | O protótipo inteiro, autocontido (~96 KB). **Precisa se chamar `index.html`** — é o único nome que o Cloudflare serve na raiz do domínio. |
| `_headers` | Aplica `X-Robots-Tag: noindex, nofollow, noarchive` e `Referrer-Policy: no-referrer` em todas as rotas. |
| `_redirects` | Faz qualquer caminho digitado errado cair no protótipo, em vez de um 404. |

No projeto: `Documentos\IA\prototipo-cloudflare\`

### `fontes/` — os arquivos que você edita

| Arquivo | Para que serve |
|---|---|
| `janelas-de-processamento.html` | **Fonte do protótipo.** É o arquivo publicado como artifact no Claude. Não tem `<head>` nem `<!doctype>` — o Claude injeta isso ao publicar. Para virar `index.html` precisa passar pelo script da [seção 7](#7-regerar-o-pacote-depois-de-editar-o-protótipo). |
| `entrevistas-com-as-redes.html` | **Fonte do roteiro** das entrevistas, com o manual de conduta do entrevistador. Também é fragmento. Traz as versões A e B do termo (botões no topo da página) e o CSS de impressão (`@media print`), de onde saem os PDFs. |

> O antigo `entrevistas-print.html` saiu em 20/10/2026: o CSS de impressão foi para dentro da fonte e o
> script de PDF monta a cópia de impressão sozinho. Não há mais dois arquivos para manter iguais.

No projeto: estavam no diretório temporário da sessão; **a cópia válida agora é esta pasta**.

### `entregaveis/`

| Arquivo | O que é |
|---|---|
| `Pe-de-Meia-Entrevistas-com-as-Redes-versao-A-processamento.pdf` | Roteiro da **2ª rodada**, versão A (termo "processamento"). 11 páginas A4: manual de conduta, abertura e um bloco de tarefas por página. É o que o moderador usa na sessão das redes A. |
| `Pe-de-Meia-Entrevistas-com-as-Redes-versao-B-janela-de-processamento.pdf` | O mesmo, versão B (termo "janela de processamento"), para as redes B. |
| `Pe-de-Meia-Entrevistas-com-as-Redes-rodada-1.pdf` | Roteiro usado na 1ª rodada (7 páginas). Guardado para referência. |
| `Pe-de-Meia-Janelas-de-Processamento-prototipo.pdf` | Deck com as 10 telas comentadas. ⚠️ **É da revisão 1** — mostra reprocessamento, frequência na janela e filtro de competência, tudo já removido. Decisão de 30/09: deixar como está por ora. |

### Scripts

| Arquivo | O que faz |
|---|---|
| `gerar-pacote.ps1` | Lê `fontes/janelas-de-processamento.html`, monta o `deploy/index.html` completo e refaz o zip. |
| `gerar-pacote.mjs` | O mesmo que o `gerar-pacote.ps1`, em Node, para qualquer SO. |
| `gerar-pdf-roteiro.ps1` | Gera os dois PDFs do roteiro (versões A e B) a partir de `fontes/entrevistas-com-as-redes.html`, via Chrome headless. |
| `gerar-pdf-roteiro.mjs` | O mesmo, em Node, para qualquer SO (usa Chrome, Chromium ou Edge; aceita o caminho na variável `CHROME`). |

---

## 6. Publicar uma nova versão

**Não use o painel do Cloudflare para subir arquivo.** Nessa máquina o upload do navegador não
conclui: o arquivo maior fica com um círculo girando para sempre e o campo do nome do app mostra um X
vermelho. São chamadas à API do Cloudflare sendo bloqueadas no navegador — provavelmente uma extensão
ou o proxy da rede. Nenhum projeto chega a ser criado.

**O caminho que funciona** é a linha de comando. Abra o PowerShell **dentro desta pasta de handoff** e
rode:

```powershell
npx --yes wrangler pages deploy ".\deploy" --project-name=prototipo-portalpdm
```

O `.\deploy` é relativo, então o comando funciona em qualquer máquina e em qualquer pasta — não
depende de OneDrive nem de caminho fixo.

O `--yes` é obrigatório: sem ele o npx faz a pergunta *"Ok to proceed?"* e qualquer caractere extra
derruba com `npm error canceled`.

Como o nome do projeto é sempre o mesmo, **a URL não muda** — `prototipo-portalpdm.pages.dev` passa a
servir a versão nova em alguns segundos.

### Se pedir login

```powershell
npx --yes wrangler login
```

Abre o navegador pedindo autorização da conta. Autorize e volte ao terminal. O token fica salvo por
algumas semanas.

### Se der erro de leitura dos arquivos

O OneDrive às vezes mantém arquivos como "somente na nuvem" e isso atrapalha a leitura. Nesse caso,
copie para um caminho local e publique de lá:

```powershell
New-Item -ItemType Directory -Force "C:\temp\prototipo-cloudflare" | Out-Null
Copy-Item "$env:USERPROFILE\OneDrive - DB1 Group\Documentos\IA\prototipo-cloudflare\*" "C:\temp\prototipo-cloudflare\" -Force
npx --yes wrangler pages deploy "C:\temp\prototipo-cloudflare" --project-name=prototipo-portalpdm
```

### Conferir que subiu

Abra a URL e olhe o rodapé — deve dizer a revisão esperada. Ou, pelo terminal:

```powershell
(Invoke-WebRequest "https://prototipo-portalpdm.pages.dev").Content -match "Revis.o \d+" | Out-Null; $Matches[0]
```

Para checar os cabeçalhos de não indexação:

```powershell
(Invoke-WebRequest -Method Head "https://prototipo-portalpdm.pages.dev").Headers["x-robots-tag"]
```

### Versões anteriores

Cada publicação ganha também um endereço imutável próprio, no formato
`https://<hash>.prototipo-portalpdm.pages.dev`. Dá para vê-los em **Compute → Workers & Pages →
prototipo-portalpdm → Deployments**. Útil para registrar **qual versão cada entrevistado viu**.

---

## 7. Regerar o pacote depois de editar o protótipo

O arquivo que você edita (`fontes/janelas-de-processamento.html`) **não é** o que sobe. Ele é um
fragmento: começa direto no `<title>` e no `<style>`, sem `<!doctype>`, `<html>` ou `<head>` — porque
o Claude injeta essa estrutura quando publica o artifact. Para o arquivo funcionar sozinho num
servidor, essa estrutura precisa ser montada.

É o que o script faz. Da pasta de handoff:

```powershell
.\gerar-pacote.ps1
```

Fora do Windows (Linux, macOS, sessão na nuvem), o equivalente é `node gerar-pacote.mjs`.

Ele lê a fonte, monta o `deploy/index.html` com `<head>` completo (charset UTF-8, viewport e a meta de
`noindex`) e refaz o `prototipo-cloudflare.zip`. Depois é só rodar o comando da [seção 6](#6-publicar-uma-nova-versão).

> **Se pular essa etapa e subir a fonte direto:** a página carrega, mas todos os acentos aparecem
> quebrados (`MatrÃ­culas`), porque sem o `<meta charset>` o navegador assume latin-1.

---

## 8. Regerar o PDF do roteiro

```powershell
.\gerar-pdf-roteiro.ps1
```

Fora do Windows: `node gerar-pdf-roteiro.mjs`.

Usa o Chrome em modo headless para imprimir `fontes/entrevistas-com-as-redes.html` duas vezes, uma por
versão do termo (`#versao-a` e `#versao-b` no endereço). Resultado: dois PDFs de 11 páginas A4, texto
vetorial (selecionável), cores preservadas, um bloco de tarefas por página, com a versão escrita no
topo de cada página de tarefas.

O CSS de impressão fica **dentro** da própria fonte, no segundo bloco `<style>` (`@media print`). Ele
evita cartões partidos entre páginas, abre uma página nova para as seções 1 e 2 e para cada bloco de
tarefas, e compacta o espaçamento. Editou o roteiro? É só rodar o script de novo e conferir se cada
bloco de tarefas continua cabendo numa página.

**Como as versões funcionam na fonte:** cada trecho que muda é um par
`<span class="termo"><span class="va">…processamento…</span><span class="vb">…janela de processamento…</span></span>`.
O `.termo` só dá o destaque na tela (some no papel). Para uma frase nova que cite o termo, use o mesmo
par, ajustando artigo e concordância nos dois lados ("nesse processamento" / "nessa janela de
processamento").

---

## 9. Histórico de revisões

### Revisão 1 — 05/09/2026
Primeira versão da proposta: lista de janelas, detalhe da janela, comparação, e o filtro de janela nas
três listagens. Junto saíram o documento explicativo e o PDF das 10 telas.

### Revisão 2 — 30/09/2026 (após 2 reuniões com o MEC)
Oito pedidos, todos aplicados:

1. Tags de reprocessamento removidas da lista — ficou só "ciclos afetados".
2. "Elegibilidade" virou "matrículas" nos cartões; EMR e EJA agrupados na visão sintética.
3. Identificadores de apuração (`202608`, `202422`) removidos do detalhe da janela.
4. Bloco de frequência retirado do detalhe da janela.
5. Gráfico de pagamento passou a mostrar **valor por ciclo**, não por situação.
6. Visão de janela unificada, sem recorte EMR/EJA.
7. Um termo único para volume processado ("matrículas processadas").
8. Filtro de competência substituído por **janela (pai) + ciclo (filho)**, dependentes.

Nessa rodada entrou a segunda chave de destaque no topo ("destacar o que foi alterado pós revisão",
em teal) e o roteiro de 15 tarefas foi criado.

### Revisão 3 — 06/10/2026 (ajustes pré-piloto)

**No protótipo:**

- **Integridade dos números.** As matrículas processadas numa janela agora batem com "Matrículas na
  Rede": cada ciclo processa o total da rede daquele ciclo. A janela de agosto marca **1.319.109**
  (445.793 + 442.108 + 431.208) — era 1.427.011, que somava EJA e não fechava com o cartão.
- **Elegibilidade filtrada por janela** passou a mostrar *todas* as matrículas processadas, na mesma
  tabela de sempre. Saíram as colunas "situação anterior" e "alterada em" — a janela só restringe
  quais linhas aparecem. O botão na tela da janela virou *"Ver todas as matrículas desta janela"*.
  O antes-e-depois continua no bloco dentro da janela.
- **Comparar janelas** ganhou todas as janelas nos dois seletores, com trava: escolhida a Janela A,
  a B só oferece janelas posteriores. A coluna virou "Variação", lendo de A para B.
- **Gráfico × listagem no Pagamento.** O gráfico dizia 56.074 aguardando e a lista mostrava 3. Gerei
  uma amostra sintética (60 estudantes, ~130 parcelas) e as listagens passaram a **paginar**: mostram
  25 linhas e informam *"Exibindo 25 de 56.074 registros"* — o mesmo número do gráfico.
- **Cores da frequência:** ≥80% verde · 75–80% amarelo · <75% vermelho. Filtro renomeado para
  **"Frequência acumulada"**.
- **Competência removida da interface** (pedido em 06/10, em três etapas): do grupo "Parcelas desta
  janela" na tela de Pagamento, do subtexto da coluna Incentivo na listagem, do grupo "Parcelas
  liberadas" no detalhe da janela, e do modal do estudante.

**No roteiro:**

- Duração para **1 hora**; perfil só **rede estadual** (não existe municipal).
- **3 minutos de navegação livre** no início, com o participante falando em voz alta e o moderador
  apenas anotando, sem responder perguntas.
- "Concluiu" virou três opções: *Sim com facilidade · Sim com dificuldade · Não*.
- Nova medida **Utilidade (1 a 5)** — *"o quão útil essa informação é para o seu dia a dia como
  operador?"* — aplicada nas tarefas **5, 9, 10, 12 e 14**, com a pergunta impressa no pé do cartão.
- Tarefa 4 pede **quantidade de parcelas** e a 6 pede **valor em reais**, de propósito: o gabarito
  manda registrar "não concluiu" se a pessoa trocar a métrica.
- Tarefa 3 passou a perguntar por **ciclo**; a 7 fala em "elegibilidade alterada"; a 10 explicita o
  **Ensino Médio Regular** e pergunta "que tipo de incentivo foi pago"; a 11 pede os estudantes com
  situação "Aguardando Pagamento"; a 12 ganhou duas perguntas extras (sobreposição com o *Consulta
  Estudante* e uso do campo NIS).
- Fechamento reduzido a 3 perguntas. Amostra: **4 participantes**.

### Roteiro da 2ª rodada — 20/10/2026 (após a 1ª rodada de testes)

O protótipo não mudou (segue na revisão 3). Mudou só o roteiro:

1. **Saiu a pergunta sobre o Consulta Estudante** do fim da tarefa 12. Ficou a de uso do campo NIS.
2. **Manual de conduta do entrevistador incorporado** (proposta "Manual do Entrevistador — Conduta nas
   entrevistas com as redes", de 15/10): princípios de conduta, quadro sobre a confusão com o SGP,
   abertura em quatro momentos (apresentação, conversa inicial, explicação da dinâmica, navegação
   livre), regras durante as tarefas e encerramento. Ajustes de forma: a numeração repetida (2.3) virou
   2.3 e 2.4, o "5. Encerramento" virou 4, e o parágrafo "Como usar este manual" foi adaptado, já que
   agora manual e tarefas estão no mesmo documento.
3. **Conversa inicial ganhou a pergunta 4**, sobre o nome que o operador dá ao sistema (há quem confunda
   o Portal do Usuário com o SGP, e a própria equipe o chama de "Portal do Pé-de-Meia"). Ela reconhece
   que cada rede usa um nome, para não induzir, e tem um seguimento: *"E tem algum outro sistema que você
   usa para o Pé-de-Meia? Como você diferencia um do outro?"*.
4. **Versões A e B do termo**, alternadas entre as redes: A diz *processamento*, B diz *janela de
   processamento*. Muda só o texto lido em voz alta (tarefas 2 a 11, 14 e 15 e as perguntas de
   utilidade); a tarefa 1 usa o verbo ("processou") nas duas. Um PDF por versão.
5. **Tarefa 13**: o caminho esperado agora exige **Ciclo = Todos os ciclos** e **Janela de processamento =
   Todas as janelas** (além de limpar a busca). Resposta: **2 estudantes**.
6. **Tarefa 5** ganhou a pergunta de entendimento *"O que você entende quando dizemos que, na janela de
   processamento de agosto de 2026, os ciclos 2024, 2025 e 2026 foram afetados?"*, com o que indica
   entendimento e os sinais de confusão para o moderador.
7. **Perguntas de utilidade específicas por tarefa** (5, 9, 10, 12 e 14), no lugar da pergunta genérica.
   Cada uma é seguida de *"De 1 a 5, que nota você dá?"*, para a nota continuar comparável entre
   participantes.

---

## 10. Dados do protótipo e gabaritos das 15 tarefas

Todos os números abaixo foram **conferidos rodando contra a versão publicada**. Se você mexer nos
dados, refaça essa conferência antes de usar o roteiro.

### Números-chave

| Indicador | Valor |
|---|---|
| Matrículas na rede — ciclo 2026 / 2025 / 2024 | 445.793 · 442.108 · 431.208 |
| Matrículas na rede — todos os ciclos | **1.319.109** |
| Janelas existentes | 6, de 25/03/2026 a 26/08/2026 |
| Janela de 26/08/2026 — ciclos afetados | 2024, 2025 e 2026 |
| Janela de 26/08/2026 — processadas | 1.319.109 |
| Janela de 26/08/2026 — parcelas / valor | 227.942 · R$ 50.819.600,00 |
| └ ciclo 2026 (Frequência) | 212.004 · R$ 42.400.800,00 |
| └ ciclo 2025 (Conclusão) | 6.539 · R$ 6.539.000,00 |
| └ ciclo 2024 (Matrícula + Frequência) | 9.399 · R$ 1.879.800,00 |
| Janela de 24/07/2026 — valor | R$ 43.009.200,00 |
| Aguardando pagamento na janela de agosto | 56.074 |

### Gabaritos

| # | Tarefa | Resposta |
|---|---|---|
| 1 | Último processamento | 26/08/2026, concluído às 07:48 |
| 2 | Matrículas processadas nele | 1.319.109 |
| 3 | Processamentos neste ciclo | 6 |
| 4 | **Quantas parcelas** na janela de agosto | 227.942 |
| 5 | Ciclos afetados | 2024, 2025 e 2026 · *pergunta de entendimento + utilidade* |
| 6 | **Valor** liberado ao ciclo 2024 | R$ 1.879.800,00 |
| 7 | Matrículas do ciclo 2024 com elegibilidade alterada | 3.417, de 431.208 processadas |
| 8 | Comparar julho e agosto | Agosto, R$ 7.810.400,00 a mais |
| 9 | Em quantos processamentos o ciclo 2024 apareceu | Um só (26/08/2026) · *perguntar utilidade* |
| 10 | Janela de agosto + ciclo 2025, que incentivo | Conclusão · 6.539 parcelas · R$ 6.539.000,00 · *perguntar utilidade* |
| 11 | Aguardando pagamento na janela de agosto | 56.074 (a lista mostra a 1ª página e informa o total) |
| 12 | NIS `20055510001` | Estudante 1000068739 — Elegível, matrícula 30279793, Salvador · *utilidade + pergunta sobre o campo NIS* |
| 13 | Frequência acumulada abaixo de 80% | **2**, com Ciclo = Todos os ciclos e Janela = Todas as janelas: 5712230375 (76,15%, amarelo) e 6180442379 (74,4%, vermelho). Quem chega das tarefas 10–12 ainda está com janela 26/08, ciclo 2025 e o NIS na busca, e vê 0 *(conferido em 20/10/2026)* |
| 14 | Matrícula `26440817` — quando mudou | Janela de 26/08/2026; era Não elegível, ciclo 2024 · *perguntar utilidade* |
| 15 | CPF `123.456.789-01` — quantas parcelas | 2, ambas pagas (Matrícula e Frequência), na janela de 26/08/2026 |

### Como a base funciona

- **17 estudantes nomeados** respondem às buscas por nome, CPF, NIS e matrícula. São eles que
  sustentam os gabaritos — não mexa nos CPFs e NIS sem refazer a conferência.
- **60 estudantes sintéticos** (gerados em tempo de carga, determinísticos) enchem as listagens para
  elas parecerem reais. Têm sempre frequência ≥80% e situação Elegível, justamente para não
  interferir nos gabaritos dos filtros.
- Os **CPFs e NIS são fictícios** e foram verificados para não colidirem entre si — uma colisão
  chegou a quebrar a busca do CPF `123.456.789-01`, que retornava 2 resultados porque batia com o NIS
  de outro estudante.
- **A busca atravessa os ciclos** (acha a pessoa mesmo com o filtro em outro ano, e avisa isso ao lado
  da contagem); os **filtros de lista** respeitam o ciclo selecionado. Essa diferença é uma decisão de
  desenho ainda não validada — está anotada no roteiro para o moderador observar.

---

## 11. Restringir o acesso por e-mail

**Ainda não configurado.** O link está aberto a quem tiver o endereço. O caminho é o Cloudflare
Access, grátis até 50 usuários. Quem abrir vai receber **um código de 6 dígitos por e-mail** — não
precisa ter conta Cloudflare nem Google.

### Parte 1 — Ativar o Zero Trust (uma vez só)

1. No painel, menu lateral, em *Protect & connect* → **Zero Trust**.
2. Clique em **Get started**.
3. Escolha um **nome de equipe** — sugestão `nees-pdm`. Vira o endereço da tela de login:
   `nees-pdm.cloudflareaccess.com`.
4. Escolha o plano **Free**.
5. Se pedir método de pagamento, é esperado mesmo no gratuito — não há cobrança.

### Parte 2 — Confirmar o login por código

6. Zero Trust → **Settings** → **Authentication**.
7. Em *Login methods*, confirme que **One-time PIN** está ativo (costuma vir ligado).

### Parte 3 — Ligar a proteção no projeto

8. Painel principal → **Compute → Workers & Pages** → `prototipo-portalpdm` → **Settings**.
9. Ative **Enable access policy**.

> Isso protege apenas os endereços de pré-visualização. **O link principal ainda fica aberto** — é
> aqui que a maioria para achando que terminou.

### Parte 4 — Estender para o link principal

10. Clique em **Manage** na política criada (leva ao Zero Trust).
11. **Access controls → Applications** → sua aplicação → **Configure**.
12. Na seção **Public hostname**, **apague o `*`** do campo de subdomínio e salve.
13. Se der erro ao salvar, mude o **Application name** (ex.: `Prototipo PDM producao`) e salve de novo
    — a documentação da Cloudflare avisa que esse erro acontece e que renomear resolve.
14. *Opcional:* volte ao projeto e ative o *access policy* mais uma vez para recriar a política dos
    previews, agora separada.

### Parte 5 — Definir quem entra

15. Na aplicação → aba **Policies** → criar/editar política (ex.: `Participantes do piloto`).
16. **Action: Allow**. Em **Include**, combine:
    - **Emails** — lista de e-mails individuais, um por linha;
    - **Emails ending in** — domínio inteiro, ex. `@mec.gov.br`.
17. **Inclua o seu próprio e-mail**, senão você se tranca para fora. O Access é *negar por padrão*.

### Parte 6 — Duração da sessão

18. Ainda na aplicação, ajuste **Session Duration** para **24 horas** ou **1 semana**, para o
    participante não precisar logar de novo no meio da entrevista.

### Parte 7 — Testar

19. Janela anônima → abrir a URL → entrar com um e-mail **da lista** → confirmar que o protótipo abre.
20. Repetir com um e-mail **fora da lista** → tem que bloquear. É esse segundo teste que prova que
    funcionou.

### Observações práticas

- **Cadastre os participantes antes.** Esperar o código chegar durante a sessão queima os primeiros
  minutos, justamente quando você quer medir a primeira impressão da tela.
- **Avise sobre a caixa de spam** — o código vem de um remetente da Cloudflare e e-mail institucional
  de órgão público costuma filtrar.
- **Para destravar rápido**, se algo der errado na hora: projeto → **Settings** → desativar o
  *access policy*. O link volta a ser aberto na hora.

**Documentação:** [aplicação self-hosted](https://developers.cloudflare.com/cloudflare-one/applications/configure-apps/self-hosted-public-app/)
· [Access no domínio pages.dev](https://developers.cloudflare.com/pages/platform/known-issues/)

---

## 12. Pendências

| O quê | Situação |
|---|---|
| **Cloudflare Access** | Não configurado. Passo a passo na seção 11; parei na tela de boas-vindas do Zero Trust (botão *Get started*). |
| **Documento explicativo da proposta** | É da revisão 1. Ainda fala de reprocessamento, frequência dentro da janela e filtro de competência. Precisa ser atualizado antes de circular. |
| **PDF das 10 telas** | Também da revisão 1. Decisão de 30/09: deixar como está "a princípio". |
| **1ª rodada de testes** | Feita. Os ajustes pedidos depois dela estão no roteiro da 2ª rodada (seção 9). Ainda vale registrar aqui os achados sobre o protótipo em si. |
| **"Todas as janelas" × "todos os processamentos"** | O pedido da tarefa 13 falava em filtrar por "todos os processamentos", mas a opção do filtro no protótipo se chama **"Todas as janelas"**. O roteiro usa o rótulo da tela. Decidir se o rótulo do protótipo muda. |
| **"Nome de aba" no manual** | O princípio "Fidelidade à versão do roteiro da rede" fala em usar "o termo e o nome de aba" da versão. Hoje só o termo varia entre A e B. Se a ideia era variar também o nome de uma aba, falta definir qual. |
| **Enunciado da tarefa 13** | O texto continua "encontre os estudantes com frequência acumulada abaixo de 80%", sem dizer "em todos os ciclos". Com o gabarito novo (2), quem responde 1 está lendo certo o recorte da tela. Decidir se o enunciado ganha "em todos os ciclos". |
| **`gerar-pdf-roteiro.ps1` reescrito sem teste no Windows** | A versão Node foi executada e conferida. A de PowerShell foi reescrita para gerar as duas versões e revisada, mas não rodou num Windows ainda. |
| **Tarefa 6 do roteiro** | Mantive o recorte do ciclo 2024 ("valor liberado ao ciclo 2024"). Se a intenção era o valor da janela inteira (R$ 50.819.600,00), é uma linha para trocar. |
| **Modal do estudante** | Removi a coluna de competência também ali, indo além do pedido explícito. Se quiser o código de volta no detalhe individual, é só reverter. |
| **Três pontos técnicos nunca validados** | Herdados da apuração de agosto: (a) de qual campo cada tela puxa o filtro; (b) se existe rastreabilidade de pagamento por execução — sem isso a janela não consegue afirmar quais parcelas saíram de qual execução; (c) intervalo das parcelas de frequência, 02–10 ou 02–09. |

---

## 13. Armadilhas do ambiente

Coisas que já custaram tempo e vão se repetir:

- **Upload pelo painel do Cloudflare não funciona** nesta máquina. Sintoma: arquivo maior com spinner
  infinito e X vermelho no campo do nome. Use sempre o `wrangler` pela linha de comando.
- **`npx` sem `--yes`** falha com `npm error canceled` — o prompt de confirmação recebe caractere extra.
- **O menu do Cloudflare mudou:** o antigo "Workers & Pages" agora fica em **Compute → Workers &
  Pages**. A home também tem upload direto no cartão *"Ship something new"*, mas ele esbarra no mesmo
  bloqueio do painel.
- **Pages está em modo de manutenção** (a Cloudflare convergiu para Workers), mas
  `wrangler pages deploy` continua funcionando e entrega a URL `.pages.dev`, mais curta que a de Worker.
- **O arquivo precisa ser `index.html`** na raiz do pacote, senão a URL principal dá 404.
- **Sem `<meta charset>` os acentos quebram** — por isso o `gerar-pacote.ps1` existe.
- **Para gerar PDF** não há `pdftoppm` nem LibreOffice nesta máquina. O caminho que funciona é o
  Chrome headless (`--headless --print-to-pdf`), e para inspecionar o PDF gerado, `pymupdf` via Python.
- **Scripts `.ps1` precisam ser ASCII puro.** O PowerShell 5.1 lê arquivos de script como ANSI, não
  UTF-8: um travessão ou acento no meio de uma string vira `â€”` e quebra o parser antes mesmo de o
  script rodar. Por isso os dois scripts desta pasta não têm acento algum.
- **O Chrome escreve a confirmação do PDF no stderr**, e no PowerShell 5.1 isso vira
  `NativeCommandError` — com `$ErrorActionPreference = "Stop"` o script morre mesmo tendo gerado o
  arquivo corretamente. O `gerar-pdf-roteiro.ps1` contorna afrouxando a preferência só naquela
  chamada e validando pela existência do arquivo.

---

## 14. Como este pacote está organizado

```
PDM-Janelas-handoff/
├── LEIA-ME.md                  <- este documento
├── CLAUDE.md                   <- instrucoes curtas para o Claude Code (aponta para cá)
├── gerar-pacote.ps1            <- fonte  ->  deploy/index.html + zip (Windows)
├── gerar-pacote.mjs            <- o mesmo, em Node (qualquer SO)
├── gerar-pdf-roteiro.ps1       <- fonte  ->  PDFs do roteiro, versoes A e B (Windows)
├── gerar-pdf-roteiro.mjs       <- o mesmo, em Node (qualquer SO)
├── prototipo-cloudflare.zip    <- o pacote pronto (gerado, fora do git)
├── deploy/                     <- o que vai para o Cloudflare
│   ├── index.html
│   ├── _headers
│   └── _redirects
├── fontes/                     <- o que você edita
│   ├── janelas-de-processamento.html
│   └── entrevistas-com-as-redes.html
└── entregaveis/
    ├── Pe-de-Meia-Entrevistas-com-as-Redes-versao-A-processamento.pdf
    ├── Pe-de-Meia-Entrevistas-com-as-Redes-versao-B-janela-de-processamento.pdf
    ├── Pe-de-Meia-Entrevistas-com-as-Redes-rodada-1.pdf
    └── Pe-de-Meia-Janelas-de-Processamento-prototipo.pdf
```

**Fluxo normal de trabalho:** editar `fontes/janelas-de-processamento.html` → rodar
`.\gerar-pacote.ps1` → rodar o comando de publicação da [seção 6](#6-publicar-uma-nova-versão) →
conferir o rodapé na URL.

A pasta inteira vive em `Documentos\IA\PDM-Janelas-handoff\`, que sincroniza pelo OneDrive entre os
seus PCs. O `gerar-pacote.ps1` e o `gerar-pacote.mjs` reproduzem o `index.html` publicado byte a
byte. O `gerar-pdf-roteiro.mjs` gera as duas versões do roteiro da 2ª rodada (11 páginas cada); o
`.ps1` equivalente ainda não foi rodado no Windows (seção 12).
