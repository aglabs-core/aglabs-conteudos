# aglabs-conteudos

Páginas de material gratuito da AG LABS — o destino dos CTAs de palavra-chave do Instagram.

Uma pasta por palavra-chave: `conteudos/<palavra-chave>/index.html`.

| palavra-chave | página | post |
|---|---|---|
| `ROTINA` | `/conteudos/rotina` | As 5 rotinas do Claude (F12) |

HTML estático, sem build. `conteudos/README.md` traz o modelo de entrega, o padrão visual e como criar uma página nova.

## Nada de segredo aqui

A única chave no código é a **publishable** do Supabase, feita para rodar no navegador. A tabela `leads_conteudo` tem RLS: essa chave só consegue `INSERT`, e `select`/`update`/`delete` foram revogados de `anon` e `authenticated`.

Service key, token do Replicate e afins ficam no `.env` da pasta de marketing e **nunca** entram neste repositório.
