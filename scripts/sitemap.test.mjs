import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { sitemapUrls, renderSitemap } from './gerar-sitemap.mjs';

const SITE = 'https://conteudo.aglabs.ia.br';
const read = (file) => readFileSync(new URL(`../${file}`, import.meta.url), 'utf8');
const locations = () => [...read('sitemap.xml').matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

// Independent oracle: the public catalog, not a second hand-maintained slug list.
test('every indexable catalog guide is present exactly once at its canonical URL', () => {
  const catalog = read('index.html').split('id="catalogo"')[1].split('</section>')[0];
  const paths = [...new Set([...catalog.matchAll(/href="(\/conteudos\/[^"#?]+)"/g)].map((m) => m[1].replace(/\/$/, '')))];
  assert.equal(paths.length, 61, 'current public catalog baseline');
  const urls = locations();
  const missing = [];
  for (const path of paths) {
    const page = read(`${path.slice(1)}/index.html`);
    if (/<meta name="robots" content="[^"]*noindex/.test(page)) continue;
    const canonical = page.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
    assert.equal(canonical, SITE + path);
    if (!urls.includes(canonical)) missing.push(canonical);
    else assert.equal(urls.filter((url) => url === canonical).length, 1);
  }
  assert.deepEqual(missing, [], `missing public canonical URLs: ${missing.join(', ')}`);
});

test('the library landing page has a self canonical', () => {
  assert.match(read('index.html'), /<link rel="canonical" href="https:\/\/conteudo\.aglabs\.ia\.br\/">/);
});

test('generated sitemap is fresh, unique and retains the three public motion subguides', () => {
  const urls = sitemapUrls(new URL('../', import.meta.url).pathname);
  assert.equal(urls.length, 65, '61 catalog guides + 3 linked subguides + home');
  assert.equal(new Set(urls).size, urls.length);
  for (const slug of ['prompts', 'completos', 'claro']) assert.ok(urls.includes(`${SITE}/conteudos/motion/${slug}`));
  assert.deepEqual(locations(), urls);
  assert.equal(read('sitemap.xml'), renderSitemap(urls));
});

const page = (path, body = '', robots = 'index, follow', canonical = SITE + path) =>
  `<head><meta name="robots" content="${robots}"><link rel="canonical" href="${canonical}"></head><body>${body}</body>`;
const link = (path) => `<a href="${path}">Guia</a>`;
function fixture(t, catalog = ['/conteudos/publico/', '/conteudos/publico']) {
  const root = mkdtempSync(join(tmpdir(), 'library-sitemap-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const put = (path, html) => {
    const file = join(root, path === '/' ? 'index.html' : `${path}/index.html`);
    mkdirSync(join(file, '..'), { recursive: true });
    writeFileSync(file, html);
  };
  put('/', page('/', `<section><div id="catalogo"><article>${catalog.map(link).join('')}</article></div></section>`));
  put('conteudos/publico', page('/conteudos/publico'));
  return { root, put };
}

test('source is public catalog, not directories, footer links, or an existing sitemap', (t) => {
  const { root, put } = fixture(t);
  put('conteudos/unlisted', page('/conteudos/unlisted'));
  const home = readFileSync(join(root, 'index.html'), 'utf8');
  writeFileSync(join(root, 'index.html'), home + link('/conteudos/unlisted'));
  writeFileSync(join(root, 'sitemap.xml'), '<loc>https://wrong.example/</loc>');
  assert.deepEqual(sitemapUrls(root), [SITE + '/', SITE + '/conteudos/publico']);
});

test('noindex, private, examples, drafts, packages and external URLs are excluded', (t) => {
  const { root, put } = fixture(t, ['/conteudos/publico', '/conteudos/oculto', '/conteudos/private', '/conteudos/examples', '/conteudos/drafts', '/conteudos/publico/pacote', 'https://other.example/conteudos/publico', '/conteudos/publico?preview=1']);
  put('conteudos/oculto', page('/conteudos/oculto', '', 'noindex, follow'));
  put('conteudos/publico', page('/conteudos/publico', ['/conteudos/publico/child', '/conteudos/unlisted', '/conteudos/publico/drafts', '/conteudos/publico/examples', '/conteudos/publico/hidden'].map(link).join('')));
  put('conteudos/publico/child', page('/conteudos/publico/child'));
  put('conteudos/publico/hidden', page('/conteudos/publico/hidden', '', 'none'));
  assert.deepEqual(sitemapUrls(root), [SITE + '/', SITE + '/conteudos/publico', SITE + '/conteudos/publico/child']);
});

for (const canonical of ['', SITE + '/conteudos/outro', SITE + '/conteudos/publico/', 'https://other.example/conteudos/publico']) {
  test(`refuses non-self canonical ${canonical || '(empty)'}`, (t) => {
    const { root, put } = fixture(t);
    put('conteudos/publico', page('/conteudos/publico', '', 'index, follow', canonical));
    assert.throws(() => sitemapUrls(root), /Expected one self canonical/);
  });
}

test('refuses a missing linked public page instead of publishing a broken URL', (t) => {
  const { root } = fixture(t, ['/conteudos/missing']);
  assert.throws(() => sitemapUrls(root), /Missing public guide/);
});

test('refuses an empty catalog instead of deleting the public sitemap', (t) => {
  const { root } = fixture(t, []);
  assert.throws(() => sitemapUrls(root), /Empty public catalog/);
});
