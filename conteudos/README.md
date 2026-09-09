# Páginas de conteúdo gratuito

Onde cada post do Instagram entrega o que prometeu. Uma pasta por **palavra-chave de CTA**.

```
conteudos/
  rotina/            -> aglabs.ia.br/conteudos/rotina      (post F12, fila ordem 2)
    index.html         a página
    pacote/            os arquivos que vão para o Drive
```

A URL sai da própria palavra-chave do CTA. Post novo já nasce com endereço definido.

---

## Nem toda palavra-chave precisa de página

São dois caminhos de entrega, e a escolha é por **tamanho do material**:

| | quando usar |
|---|---|
| **Automação no n8n** | o material cabe numa mensagem: links, uma lista, um convite. O fluxo responde o comentário e manda no direct. Não precisa de página. |
| **Página em `/conteudos`** | o material é longo o bastante para alguém querer voltar nele — prompts para copiar, passo a passo, arquivo para baixar. |

Em uso hoje:

- `ROTINA` (F12) → **página**, porque são cinco prompts longos, feitos para copiar e voltar depois
- `KIT` (F13) → **n8n**, é uma lista de links
- `COMUNIDADE` (F14) → **n8n**, são os links da comunidade

Antes de montar página nova, perguntar: isso cabe numa mensagem? Se couber, é fluxo, não página.

---

## O modelo de entrega

**Conteúdo aberto, gate só no extra.**

O que o post prometeu está visível na página, sem formulário. Quem comentou já demonstrou interesse — cobrar dado antes de entregar quebra a confiança no primeiro contato, e a página não indexaria.

O formulário aparece uma vez só, no fim, oferecendo os **arquivos prontos** (o pacote do Drive). Aí o pedido é justo: a pessoa está levando algo que dá trabalho montar.

Captura: **nome + WhatsApp**, com aceite explícito de LGPD. Não usamos e-mail — o público é brasileiro e o follow-up por e-mail morre.

**Sem área de login.** Para conteúdo gratuito é o pior dos dois mundos: atrito de produto pago com valor de conteúdo grátis.

---

## Como subir uma página nova

1. Copiar `rotina/index.html` como base.
2. Trocar o conteúdo, o `<title>`, a `description`, o `canonical` e o `og:url`.
3. Em um script próprio para o novo material (o atual é `assets/rotina.js`), ajustar `ORIGEM` para o slug da pasta e `LINK_PACOTE` para o link do Drive.
4. Adicionar o material ao índice da raiz e publicar em `aglabs.ia.br/conteudos/<slug>`.
5. Só então liberar o post correspondente na `fila/`.

O passo 5 é regra: **post que promete material não vai ao ar antes da página existir.**

---

## Banco de leads

Projeto Supabase `meunnuxoojhbuddcskgm` (o mesmo dos carrosséis), tabela `public.leads_conteudo`.

| coluna | |
|---|---|
| `nome` | 2–120 caracteres |
| `whatsapp` | só dígitos, com DDI. A página normaliza: 11 dígitos vira `55` + número |
| `origem` | o slug da página — é assim que se sabe de qual post veio |
| `consentimento` | tem que ser `true`; a policy recusa `false` |
| `user_agent`, `criado_em` | |

Segurança, já aplicada:

- RLS ligado. A chave pública tem **INSERT e mais nada** — `select`, `update` e `delete` foram revogados de `anon` e `authenticated`.
- Sem `SELECT`, a tabela também sai do schema GraphQL público: ninguém consegue listar os leads com a chave da página.
- Índice único em `(whatsapp, origem)`. Quem já baixou e volta recebe `409`, que a página trata como sucesso — a pessoa vê o download de novo e não cria linha duplicada.
- Leitura só pelo `service_role` (backoffice / n8n). **Nunca colocar a service key numa página.**

⚠️ Não usar o header `Prefer: resolution=ignore-duplicates` no POST: ele transforma a inserção em upsert e exige permissão de UPDATE, que o `anon` não tem (e não deve ter). Tratar o `409` no JavaScript, como está feito.

---

## O que falta para o `rotina/` entrar no ar

1. ~~Subir o `pacote/` no Drive~~ — feito, pasta pública.
2. ~~Colar o link em `LINK_PACOTE`~~ — feito.
3. **Publicar a rota** `/conteudos/rotina` — pendente.
4. Liberar `fila/rotinas-claude/` para a rotina publicar.

---

## Padrão visual das páginas

Minimalista e compacto, herdado do blog: fundo `#0F0F0F`, Inter, azul `#2563EB`, **raio de 4px em tudo** (`--r`). Largura de leitura 720px, corpo em 15px.

Nada de parágrafo longo: título curto, uma linha de contexto, o bloco de prompt, uma linha de nota. Quem chegou pelo Instagram quer copiar e sair.

## O formulário fica num modal

A página não pede dado nenhum enquanto a pessoa lê. No fim há **um botão só** — `Receber o pacote` — que abre o modal com nome + WhatsApp + aceite.

Fecha por `Esc`, por clique no fundo ou no `×`, e trava o scroll enquanto está aberto.

**Atalho útil:** `aglabs.ia.br/conteudos/rotina#pacote` abre o modal já aberto. É esse o link para mandar no direct de quem pediu só o arquivo.
