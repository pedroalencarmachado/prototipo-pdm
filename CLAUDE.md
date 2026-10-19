# Protótipo "Janelas de Processamento" — Portal do Pé-de-Meia

Leia o `LEIA-ME.md` antes de qualquer alteração. Ele tem o contexto da proposta, o histórico de
revisões, os gabaritos das 15 tarefas e as pendências.

Regras que valem para toda edição:

- **Edite só `fontes/janelas-de-processamento.html`.** Depois rode `node gerar-pacote.mjs` (ou
  `.\gerar-pacote.ps1` no Windows) para regerar `deploy/index.html`. Nunca edite o `deploy/index.html`
  à mão.
- **Siga o vocabulário da seção 4 do LEIA-ME** (ex.: "matrículas processadas", "ciclos afetados";
  nada de competência/`AAAAMM`, reprocessamento ou identificador de apuração na interface).
- **Mexeu em dados? Refaça a conferência dos gabaritos** da seção 10 contra a página gerada. Os 17
  estudantes nomeados sustentam as respostas do roteiro — não altere CPF, NIS ou matrícula deles.
- **Mudou o roteiro?** Replique a alteração em `fontes/entrevistas-com-as-redes.html` e em
  `fontes/entrevistas-print.html` (este é o que vira PDF).
- **Atualize o rodapé ("Revisão N — mês de ano")** e a seção 9 do LEIA-ME a cada nova revisão.
- Scripts `.ps1` precisam continuar **ASCII puro** (PowerShell 5.1).
