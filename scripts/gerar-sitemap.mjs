// Source of publication: articles in #catalogo and their explicitly linked subguides.
// Never discover pages by walking directories (drafts/downloads may live beside guides).
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

export const SITE = 'https://conteudo.aglabs.ia.br';
const tags = (html, name) => [...html.matchAll(new RegExp(`<${name}\\b[^>]*>`, 'gi'))].map(([tag]) =>
  Object.fromEntries([...tag.matchAll(/([\w:-]+)\s*=\s*(["'])(.*?)\2/g)].map((m) => [m[1].toLowerCase(), m[3]])));
const links = (html) => tags(html, 'a').map((tag) => tag.href).filter(Boolean);
const publicPath = (href) => {
  // Only explicit local guide routes, not redirects, query URLs, downloads or examples.
  if (!/^\/conteudos\/[a-z0-9-]+(?:\/[a-z0-9-]+)*\/?$/.test(href)) return null;
  const path = href.replace(/\/$/, '');
  if (path.split('/').some((part) => /^(?:private|privado|examples?|exemplos?|drafts?|rascunhos?|pacote)$/.test(part))) return null;
  return path;
};

export function sitemapUrls(root = '.') {
  const read = (path) => readFileSync(resolve(root, path), 'utf8');
  const home = read('index.html');
  const catalog = home.match(/<div\b[^>]*\bid=["']catalogo["'][^>]*>([\s\S]*?)<\/section>/i)?.[1];
  if (!catalog) throw new Error('Missing public #catalogo');
  const articles = [...catalog.matchAll(/<article\b[^>]*>([\s\S]*?)<\/article>/gi)];
  const queue = [...new Set(articles.flatMap((m) => links(m[1]).map(publicPath).filter(Boolean)))];
  if (!queue.length) throw new Error('Empty public catalog');
  const urls = new Set();
  const visited = new Set();
  const eligible = (html, expected) => {
    const head = html.split(/<\/head>/i)[0];
    const robots = tags(head, 'meta').filter((tag) => /^(robots|googlebot)$/i.test(tag.name ?? '')).map((tag) => tag.content ?? '').join(',');
    if (/\b(noindex|none)\b/i.test(robots)) return false;
    const canonical = tags(head, 'link').filter((tag) => tag.rel?.toLowerCase().split(/\s+/).includes('canonical'));
    if (canonical.length !== 1 || canonical[0].href !== expected) throw new Error(`Expected one self canonical: ${expected}`);
    return true;
  };
  if (!eligible(home, SITE + '/')) throw new Error('Library home must be indexable');
  urls.add(SITE + '/');
  for (const path of queue) {
    if (visited.has(path)) continue;
    visited.add(path);
    const file = `${path.slice(1)}/index.html`;
    if (!existsSync(resolve(root, file))) throw new Error(`Missing public guide: ${path}`);
    const html = read(file);
    if (!eligible(html, SITE + path)) continue;
    urls.add(SITE + path);
    // Follow only subguides of this published guide, never unrelated/unlisted pages.
    for (const href of links(html)) {
      const child = publicPath(href);
      if (child?.startsWith(path + '/')) queue.push(child);
    }
  }
  return [...urls].sort();
}

export function renderSitemap(urls) {
  return '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    + urls.map((url) => `  <url><loc>${url}</loc></url>\n`).join('') + '</urlset>\n';
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const xml = renderSitemap(sitemapUrls());
  if (process.argv.includes('--check')) {
    if (readFileSync('sitemap.xml', 'utf8') !== xml) {
      console.error('sitemap.xml is stale; run node scripts/gerar-sitemap.mjs');
      process.exitCode = 1;
    }
  } else writeFileSync('sitemap.xml', xml);
}
