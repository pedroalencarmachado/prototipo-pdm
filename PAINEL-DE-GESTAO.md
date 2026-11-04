# Painel de Gestão — protótipo da visão gerencial

Proposta de uma **visão gerencial** para o Portal do Usuário do Pé-de-Meia: um painel com cara de BI,
orientado a dados, para o gestor acompanhar a evolução dos indicadores entre processamentos e ciclos,
comparar recortes (EMR × EJA, municípios) e receber **insights já escritos** (simulação de geração por IA).

Surgiu das agendas com o MEC: há perfis mais analíticos, de decisão, e o protótipo de *Janelas de
Processamento* e as entrevistas são operacionais. O painel **complementa** essa visão; não substitui nada.

| | |
|---|---|
| **Link** | https://prototipo-portalpdm-gestao.pages.dev (projeto Cloudflare `prototipo-portalpdm-gestao`) |
| **Link das entrevistas** | https://prototipo-portalpdm.pages.dev — **intocado**. Nada deste painel vai para lá. |
| **Fonte** | `fontes/painel-de-gestao.html` |
| **Build** | `node gerar-pacote-gestao.mjs` → `deploy-gestao/index.html` |
| **Revisão atual** | Painel de Gestão: Revisão 1 — novembro de 2026 (demais telas: base da Revisão 5) |

---

## 1. Isolamento do projeto anterior (regra principal)

- O painel vive numa **cópia** da fonte: `fontes/painel-de-gestao.html` partiu da Revisão 5 de
  `fontes/janelas-de-processamento.html`. As duas fontes **não se sincronizam**.
- **Nunca** editar `fontes/janelas-de-processamento.html`, `deploy/` nem `gerar-pacote.mjs`/`.ps1` por causa
  do painel. Eles servem o link das entrevistas, cujos gabaritos dependem dos números de lá.
- O painel tem script, pasta de deploy e projeto Cloudflare próprios.
- Na cópia, **as telas existentes não mudaram** (Início, Elegibilidade, Frequência, Pagamento,
  Processamentos e o detalhe). Na cópia só mudaram: o menu (novo item *Painel de Gestão*), a rota inicial
  (o link abre no painel), o título da aba do navegador, o texto da faixa preta e o rodapé.

## 2. Decisões do Pedro (03/11/2026)

1. Perfil: **gestor da rede estadual da Bahia**, mesma base do protótipo, com recortes por município.
2. Eixo do tempo: **processamento** (nada de competência, `AAAAMM`, na interface).
3. **EMR × EJA** reaberto **só no painel** (na visão de processamento continua unificado).
4. Insights: **simulados**, com o selo *Gerado por IA* e o aviso para o gestor revisar. Nenhuma IA real.
5. Chave **Roteiro A | B** mantida (A = processamento, B = janela de processamento).
6. Nome *Painel de Gestão*; link **aberto** (sem Cloudflare Access), num **projeto novo**.
7. As telas internas existentes **não mudam**, a princípio.
8. (Ajustes pré-publicação, 03/11/2026) A aba/domínio "Matrículas" do painel passa a se chamar
   **Elegibilidade**, como no menu. Ficam como estão: "Matrículas na rede" (rótulo do cartão do Portal),
   "Frequência de Matrículas" (título da tela existente) e o incentivo "Matrícula".
9. Insights num **carrossel**: uma linha, dois cartões por vez, com setas e pontos.
10. Filtro de **processamento** no painel, além do de ciclo, dependentes como nas listagens.
11. **Sem** alternância Barras/Linhas e **sem** eventos nos gráficos, para não confundir e para os filtros
    caberem numa linha. Os gráficos ficam fixos: barras para a composição, linha para a tendência.
    (Os eventos eram marcadores numerados com o que aconteceu em cada data — prazo, processamento
    extraordinário — para o gestor ligar uma queda a uma causa. Ideia guardada para depois.)

## 3. O que tem na tela

- **Filtros:** Processamento (pai) · Ciclo (filho) · Modalidade (Visão geral | EMR | EJA) · Município
  (12 maiores redes + "Demais municípios (405)"), todos numa linha.
  O estado é próprio do painel (`state.g*`), separado dos filtros das telas operacionais.
- **Como o filtro de processamento funciona:** ele define o **processamento de referência** ("como estava
  naquela data"). Sem escolha, a referência é o último processamento do ciclo. Indicadores, insights, ranking
  de municípios, retrato por ciclo e comparativo EMR × EJA leem tudo **até** a referência; os gráficos
  continuam mostrando a série inteira do ciclo, com a coluna da referência destacada, e a linha dela fica
  marcada nas tabelas ("selecionado"). Processamento e ciclo dependem um do outro, como nas listagens:
  o ciclo reduz os processamentos oferecidos e o processamento reduz os ciclos. Os botões "Abrir …" levam à
  tela operacional já com o mesmo processamento e ciclo.
- **5 indicadores com tendência:** matrículas na rede, % elegível, frequência ≥ 80%, parcelas no último
  processamento e valor liberado ao ciclo — com variação contra o processamento anterior e minigráfico.
- **Insights (IA simulada):** carrossel numa linha só, dois cartões por vez (setas, "1–2 de 6" e pontos);
  até 6 cartões (Alerta, Atenção, Informativo, Positivo), cada um com "Como este insight foi gerado" (os
  números usados), um botão de ação (filtra o painel ou abre a tela operacional) e avaliação 👍/👎.
  "Gerar novamente" simula a geração (≈1,3 s), marca o horário e volta à primeira página.
- **Abas:**
  - *Elegibilidade* — situação de elegibilidade por processamento (empilhado) + % elegível; tabela com Δ.
  - *Frequência* — ≥ 80% / < 80% / não informada + % ≥ 80% (só ciclo 2026; nos outros, explica onde achar).
  - *Pagamento* — parcelas por incentivo + valor liberado; tabela com Δ e acumulado.
  - *Ciclos* — valor liberado por ciclo afetado em cada processamento + retrato por ciclo.
  - *Municípios* — ranking ordenável (queda de frequência, não informada, menor frequência, valor, nome),
    com tendência e marcações ▼ queda / ● não informada; "Filtrar" aplica o município ao painel e
    "Estudantes" abre a listagem de Frequência (só para municípios que existem na amostra de estudantes).
  - *EMR × EJA* — três gráficos lado a lado (% elegível, frequência ≥ 80%, valor por elegível) e tabela.
- Tabelas destacam a linha **mais recente** e trazem **Δ** contra o processamento anterior; cada aba tem o
  bloco "Solicitar Planilha" no padrão do Portal.
- Gráficos em **SVG próprio**, sem biblioteca: o arquivo continua único, sem CDN. Paletas conferidas com
  validador de cor (contraste e daltonismo); sem eixo duplo; tooltip em todo gráfico.

## 4. Como a base gerencial é montada (e por que os números batem)

Tudo é derivado dos dados que já existem na fonte, sem tocar neles:

- **Pagamento** = exatamente as parcelas de `JANELAS` (por processamento × ciclo × incentivo).
- **Matrículas** = parte do retrato final de cada ciclo (`REDE`) e volta no tempo usando `alteradas` /
  `paraElegivel` de cada processamento; a pendência bancária do ciclo 2026 vai de 3.410 (mar) a 0 (jul).
- **Frequência** (ciclo 2026, abr–ago, apurando fev–jun) termina igual aos cartões da tela Início
  (313.613 · 27.834 · 823).
- A divisão por **modalidade × município** (26 unidades) é determinística e fecha a soma exata (maior resto).
  As "histórias" que os insights encontram estão na função `fator()`: Juazeiro em queda contínua,
  Jequié com frequência não informada alta em jul e ago, Camaçari melhorando, EJA com frequência menor.

**Conferido em 03/11/2026** rodando no navegador: 32 checagens (valor e parcelas de cada processamento =
`JANELAS`; retrato de cada ciclo = `REDE`; frequência de agosto = cartões do Início; agosto − julho =
R$ 7.810.400,00; ciclo 2024 em agosto = R$ 1.879.800,00; partições EMR/EJA e municípios somam o total;
nenhum valor negativo) e 3.024 combinações de tela (2 roteiros × 3 ciclos × 3 modalidades × 14 municípios
× 6 abas × 2 tipos de gráfico) sem erro, sem "NaN" e sem a palavra "janela" na versão A.

> As abas EMR/EJA das telas operacionais seguem decorativas (herança da base): o recorte EMR × EJA só existe
> no painel. Os botões que levam às telas operacionais abrem a visão geral delas.

## 5. Editar, gerar e publicar

1. `git pull` em `C:\dev\prototipo-pdm`.
2. Editar **só** `fontes/painel-de-gestao.html`.
3. `node gerar-pacote-gestao.mjs` (regera `deploy-gestao/index.html`).
4. A cada revisão nova, atualizar o rodapé ("Painel de Gestão: Revisão N — mês de ano") e a seção 7 abaixo.
5. Se mexer em dados, refazer as checagens da seção 4.
6. Commit + push.

**Publicar — primeira vez** (cria o projeto; PowerShell):

```powershell
cd $env:TEMP; npx --yes wrangler pages project create prototipo-portalpdm-gestao --production-branch=production
```

**Publicar — sempre:**

```powershell
cd $env:TEMP; npx --yes wrangler pages deploy "C:\dev\prototipo-pdm\deploy-gestao" --project-name=prototipo-portalpdm-gestao --branch=production
```

**Conferir:**

```powershell
(Invoke-WebRequest -UseBasicParsing "https://prototipo-portalpdm-gestao.pages.dev").Content -match "Painel de Gest.o: Revis.o \d+" | Out-Null; $Matches[0]
```

Mesmas armadilhas do outro link (LEIA-ME, seção 13): `--yes` obrigatório, rodar fora da pasta do git
(`cd $env:TEMP`) para não publicar como preview, e nada de upload pelo painel do Cloudflare.

## 6. Pendências e ideias para a próxima revisão

- Validar com o MEC se o eixo por processamento funciona para o gestor (e se a frequência "apurada no
  processamento" — dois meses depois — é clara).
- Visão MEC nacional (comparação entre UFs) ficou para uma v2: exige outra base.
- Comparar ciclos no mesmo ponto do calendário (2026 × 2025) exigiria inventar processamentos de 2025 —
  ficou de fora para não contradizer as 6 janelas da base.
- Se o painel for para entrevistas, criar roteiro próprio (o roteiro atual é da visão operacional).

## 7. Histórico

### Revisão 1 — 03/11/2026
Primeira versão do Painel de Gestão: filtros, 5 indicadores com tendência, insights simulados, 6 abas,
ranking de municípios e comparativo EMR × EJA. Publicação num projeto Cloudflare novo.

Ajustes pedidos antes da primeira publicação (ainda Revisão 1): "Matrículas" → **Elegibilidade** na aba e
nos títulos do painel; insights em **carrossel** de uma linha; **filtro de processamento** (referência) ligado
ao de ciclo. Conferido: 1.152 combinações de tela (2 roteiros × 3 ciclos × todos os processamentos de cada
um × modalidade × município × 6 abas × página do carrossel) sem erro, sem "NaN" e sem "janela" na versão A;
dependência processamento ↔ ciclo; indicadores com referência em 24/07 = números de julho em `JANELAS`.

Depois, ainda antes de publicar: saíram a alternância Barras/Linhas e os eventos nos gráficos; os filtros
cabem numa linha. Conferido: 288 combinações (2 roteiros × 3 ciclos × processamentos × modalidade × 6 abas)
sem erro e sem resto de "Eventos", "Barras" ou "Linhas" na tela.
