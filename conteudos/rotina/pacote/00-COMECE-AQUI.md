# As 5 rotinas do Claude

AG LABS · aglabs.ia.br/conteudos/rotina

Cada rotina é um **Projeto do Claude**: instruções fixas + os arquivos do seu negócio.

## Montagem

1. Crie um Projeto com o nome da rotina.
2. Cole o prompt do `.txt` correspondente nas instruções do projeto.
3. Suba o seu `contexto.md` (modelo em `contexto-modelo.md`) no conhecimento.
4. Troque os campos entre `[COLCHETES]`.
5. Rode, aponte o que saiu torto e cole a correção nas instruções.

O passo 5 é o que quase todo mundo pula. É o que faz a rotina prestar.

## Arquivos

| | |
|---|---|
| `contexto-modelo.md` | vale para as cinco. Sem ele, a resposta sai genérica |
| `01-briefing-diario.txt` | manhã, dia útil |
| `02-triagem-de-email.txt` | uma ou duas vezes por dia |
| `03-relatorio-semanal.txt` | sexta à tarde ou domingo |
| `04-organizacao-de-arquivos.txt` | quando a pasta doer |
| `05-pauta-de-conteudo.txt` | segunda de manhã |

## Rodar sozinho

Projeto do Claude não dispara sozinho: você abre e manda a palavra. Para rodar sem ninguém abrir nada — chegando no WhatsApp no horário certo — é preciso ligar a API a um orquestrador e conectar as fontes. Essa parte a AG LABS monta: aglabs.ia.br

Mas comece pela versão manual. Se ela não for útil na mão, automatizar só entrega coisa inútil mais rápido.
