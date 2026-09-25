// Confere o <head> de cada página de material antes de publicar.
// Uma página copiada de outra levou tags quebradas para onze materiais
// (descrição e og:* sem atributo, com o texto do pack de game), e o direct
// passou a mandar link sem título nem prévia. Sem dependências: `node scripts/checar-paginas.mjs`.
import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";

const SITE = "https://conteudo.aglabs.ia.br";
const redirects = new Set(
  (JSON.parse(readFileSync("vercel.json", "utf8")).redirects ?? []).map((r) => r.source),
);
const home = readFileSync("index.html", "utf8");
const erros = [];

const meta = (head, attr, nome) =>
  head.match(new RegExp(`<meta ${attr}="${nome}" content="([^"]*)"`))?.[1];

for (const slug of readdirSync("conteudos")) {
  const arquivo = `conteudos/${slug}/index.html`;
  if (!existsSync(arquivo)) continue;
  const head = readFileSync(arquivo, "utf8").split("</head>")[0];
  const falha = (msg) => erros.push(`${arquivo}: ${msg}`);

  for (const tag of head.match(/<meta\b[^>]*>/g) ?? []) {
    if (!/^<meta\s+(name|property|charset|http-equiv)=/.test(tag) ||
        /^<meta\s+property="(?!og:|article:|twitter:)/.test(tag)) {
      falha(`tag quebrada ${tag.slice(0, 80)}`);
    }
  }
  if (!/<title>[^<]+<\/title>/.test(head)) falha("sem <title>");
  for (const [attr, nome] of [
    ["name", "description"], ["property", "og:title"], ["property", "og:description"],
    ["property", "og:url"], ["property", "og:image"], ["name", "twitter:card"],
  ]) {
    if (!meta(head, attr, nome)) falha(`sem ${nome}`);
  }
  const url = `${SITE}/conteudos/${slug}`;
  if (!head.includes(`<link rel="canonical" href="${url}">`)) falha(`canônica diferente de ${url}`);
  if (meta(head, "property", "og:url") !== url) falha(`og:url diferente de ${url}`);

  const imagem = meta(head, "property", "og:image") ?? "";
  if (imagem.startsWith(`${SITE}/`)) {
    const local = imagem.slice(SITE.length + 1);
    if (!existsSync(local)) falha(`og:image aponta para ${local}, que não existe`);
    else if (statSync(local).size > 300 * 1024) falha(`${local} passa de 300 KB; o WhatsApp não mostra a prévia`);
  }
  if (!redirects.has(`/${slug}`)) falha(`sem o atalho /${slug} em vercel.json`);
  if (!home.includes(`/conteudos/${slug}`)) falha("fora do catálogo do index.html");
}

if (erros.length) {
  console.error(erros.join("\n"));
  process.exit(1);
}
console.log("Páginas de material conferidas.");
