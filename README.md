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
- `conteudos/rotina/index.html`: guia com cinco prompts de rotina. Slug da palavra-chave `ROTINA`.
- `conteudos/rotina/pacote/`: arquivos originais do material.
- `conteudos/perfil/index.html`: três prompts de foto de perfil em preto e branco. Slug da palavra-chave `perfil`.
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

| palavra-chave | página | post |
|---|---|---|
| `ROTINA` | `/conteudos/rotina` | As 5 rotinas do Claude |
| `perfil` | `/conteudos/perfil` | Foto de perfil em preto e branco |
| `CLAW` | `/conteudos/claw` | OpenClaw |

Palavra-chave não se repete entre posts: é assim que se sabe de qual post veio o comentário. `KIT` e `COMUNIDADE` são entregues por automação no n8n e não têm página — material que cabe numa mensagem é fluxo, não página.

## Formulário

O conteúdo é aberto. O pacote extra usa o formulário existente de nome, WhatsApp e consentimento, com registro no Supabase e acesso ao Drive. A interface confirma a disponibilidade do download; o envio pelo WhatsApp depende da automação externa.

Somente a chave pública do Supabase fica no navegador. As permissões do banco precisam continuar limitadas à inserção. Nunca inclua service keys ou arquivos `.env` no Git. O comportamento de RLS descrito em `conteudos/README.md` vem da configuração original e não é verificado pelo site.

## Hospedagem

Projeto estático compatível com Vercel: sem comando de build, raiz como diretório público. A página de rotina mantém os metadados originais de `aglabs.ia.br`; ajuste canonical e Open Graph se a publicação usar outro domínio. Links para o site institucional são absolutos.
