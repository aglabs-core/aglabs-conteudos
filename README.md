# AG LABS · Biblioteca gratuita

Site estático que reúne os materiais disponibilizados nos posts da AG LABS. HTML, CSS e JavaScript sem dependências de build.

## Local e Git

Projeto transferido para `D:\projetos github\conteudos-gratuito` com histórico e remote preservados: `https://github.com/aglabs-core/aglabs-conteudos.git`.

## Estrutura

- `index.html`: índice dos materiais com busca por título, tema e palavra-chave.
- `assets/biblioteca.css`: visual compacto e responsivo.
- `assets/biblioteca.js`: filtro local, contagem automática e estado sem resultados.
- `assets/rotina.css` e `assets/rotina.js`: estilos e interações do guia.
- `assets/logo-ag.png`: logo original do cabeçalho.
- `assets/favicons/`: ícones azuis e manifesto para navegadores e dispositivos.
- `assets/perfil.css` e `assets/perfil.js`: estilos e cópia do guia de foto de perfil.
- `assets/claw.css` e `assets/claw.js`: estilos e cópia do guia do OpenClaw.
- `assets/gpt.css` e `assets/gpt.js`: estilos e cópia do guia dos 5 prompts do ChatGPT.
- `assets/colagem.css` e `assets/colagem.js`: estilos e cópia do guia de colagem editorial.
- `assets/especifico.css` e `assets/especifico.js`: estilos e cópia do guia de conteúdo específico.
- `conteudos/rotina/index.html`: guia com cinco prompts de rotina. Slug da palavra-chave `ROTINA`.
- `conteudos/rotina/pacote/`: arquivos originais do material.
- `conteudos/perfil/index.html`: três prompts de foto de perfil em preto e branco. Slug da palavra-chave `perfil`.
- `conteudos/gpt/index.html`: cinco prompts cirúrgicos para o ChatGPT. Slug da palavra-chave `GPT`.
- `conteudos/colagem/index.html`: quatro prompts de colagem editorial. Palavra-chave `PROMPT`, slug pelo tema.
- `conteudos/especifico/index.html`: dois prompts de conteúdo específico, em quatro etapas. Slug da palavra-chave `ESPECIFICO`.
- `conteudos/claw/index.html`: link oficial do OpenClaw e cinco casos de uso. Slug da palavra-chave `CLAW`.
- `vercel.json`: URLs limpas e cabeçalhos de segurança.

## Prévia local

Na raiz, execute `python -m http.server 3045 --bind 127.0.0.1` e abra `http://127.0.0.1:3045`. Não há instalação ou build.

## Adicionar material

1. Crie `conteudos/<slug>/index.html` e a pasta `pacote/`, se houver arquivos.
2. Defina título, descrição e âncoras. Use o guia de rotina como referência e mantenha o retorno à biblioteca.
3. Adicione um `article` dentro de `#catalogo` em `index.html`, com título, resumo e link. Inclua temas e sinônimos em `data-keywords`. A busca e a contagem reconhecem todos os artigos automaticamente; a busca ignora acentos e maiúsculas. Atualize também a contagem inicial do HTML, exibida quando JavaScript estiver desativado.
4. Se houver captura, use um script próprio e ajuste a origem e o destino do pacote. Não reutilize a origem `rotina` em outro material.
5. Confira os links, o celular e os botões antes de publicar o post.

## Slug = palavra-chave do CTA

Cada página mora em `conteudos/<palavra-chave>/`, exatamente a palavra que o post pede no comentário. Post novo já nasce com o endereço definido, e quem responde os comentários sabe o link de cabeça.

**Atalho curto:** cada slug também responde na raiz — `/gpt` redireciona para `/conteudos/gpt`. É a forma que a gente manda no direct, porque cabe melhor na mensagem. **Slug novo exige uma linha nova em `redirects` no `vercel.json`**, senão a URL curta dá 404.

| palavra-chave | página | post |
|---|---|---|
| `ROTINA` | `/conteudos/rotina` | As 5 rotinas do Claude |
| `perfil` | `/conteudos/perfil` | Foto de perfil em preto e branco |
| `CLAW` | `/conteudos/claw` | OpenClaw |
| `GPT` | `/conteudos/gpt` | 5 prompts cirúrgicos para o ChatGPT |
| `PROMPT` → por post | `/conteudos/colagem` | 4 prompts de colagem editorial |
| `ESPECIFICO` | `/conteudos/especifico` | O prompt que tira o conteúdo do genérico |

Palavra-chave não se repete entre posts: é assim que se sabe de qual post veio o comentário.

**Palavras reservadas — não usar como slug aqui:**

| palavra | vai para | por quê |
|---|---|---|
| `PROMPT` / `PROMPTS` | **depende do post** | ver abaixo |
| `KIT` | automação n8n | material que cabe numa mensagem é fluxo, não página |
| `COMUNIDADE` | automação n8n | idem — links da comunidade |
| `APP` | automação n8n | link do app (`aglabs.app.br`); serve a qualquer post, não é material de um post só |

Por isso o post dos 5 prompts do ChatGPT usa `GPT`, e não `PROMPTS`: o plural cairia perto demais do gatilho do app.

### `PROMPT` é uma palavra de muitos posts

Todo post de prompt de **imagem** pede a mesma palavra: `PROMPT`. Quem decide o destino é o
`media_id` do post, na data table `MSG POR POST AGLABS` do n8n. Uma palavra para o seguidor
lembrar, e a resposta certa para cada post.

| o post entrega | destino |
|---|---|
| um prompt só | biblioteca do app — o prompt e o botão de gerar no mesmo lugar |
| um pack de vários | página aqui, e a página leva para o app |
| nada cadastrado | biblioteca do app (fallback do workflow) |

Nesses casos o **slug é o tema do pack**, não a palavra-chave — `colagem`, não `prompt`. A
regra "slug = palavra-chave" continua valendo para as palavras exclusivas de um post só.

**Regra de destino**, na dúvida: prompt que gera imagem → app, porque o app é o gerador.
Prompt de ação ou texto → página aqui. Link ou lista curta → n8n.

## Formulário

O conteúdo é aberto. O pacote extra usa o formulário existente de nome, WhatsApp e consentimento, com registro no Supabase e acesso ao Drive. A interface confirma a disponibilidade do download; o envio pelo WhatsApp depende da automação externa.

Somente a chave pública do Supabase fica no navegador. As permissões do banco precisam continuar limitadas à inserção. Nunca inclua service keys ou arquivos `.env` no Git. O comportamento de RLS descrito em `conteudos/README.md` vem da configuração original e não é verificado pelo site.

## Hospedagem

Projeto estático compatível com Vercel: sem comando de build, raiz como diretório público. A página de rotina mantém os metadados originais de `aglabs.ia.br`; ajuste canonical e Open Graph se a publicação usar outro domínio. Links para o site institucional são absolutos.
