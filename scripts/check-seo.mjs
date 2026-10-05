import assert from 'node:assert/strict';
import { load } from 'cheerio';
import { pages, SITE_URL } from '../src/seo/site.js';

const base = process.argv[2] || SITE_URL;
for (const page of pages) {
  const response = await fetch(base + page.path, { redirect: 'manual' });
  assert.equal(response.status, 200, page.path);
  assert.doesNotMatch(response.headers.get('x-robots-tag') || '', /noindex/, page.path);
  const $ = load(await response.text());
  assert.equal($('title').text(), page.title, page.path);
  assert.equal($('link[rel="canonical"]').attr('href'), SITE_URL + page.path, page.path);
  assert.equal($('h1').length, 1, page.path);
  assert.doesNotMatch($('meta[name="robots"]').attr('content'), /noindex/, page.path);
  JSON.parse($('script[type="application/ld+json"]').text());
  console.log(`200 + metadata + HTML + JSON-LD: ${page.path}`);
}
const sitemap = await fetch(`${base}/sitemap.xml`);
assert.equal(sitemap.status, 200);
assert.match(sitemap.headers.get('content-type'), /xml/);
const xml = load(await sitemap.text(), { xmlMode: true });
assert.deepEqual(xml('url > loc').map((_, el) => xml(el).text()).get(), pages.map(page => SITE_URL + page.path));
const robots = await fetch(`${base}/robots.txt`);
assert.equal(robots.status, 200);
assert.match(await robots.text(), /Sitemap: https:\/\/carusoavvocati.it\/sitemap.xml/);
for (const path of ['/pagina-che-non-esiste-seo-check', '/news/999', '/missing-file.jpg']) {
  assert.equal((await fetch(base + path)).status, 404, path);
}
const duplicate = await fetch(`${base}/news/3`, { redirect: 'manual' });
assert.ok([301, 308].includes(duplicate.status));
assert.equal(new URL(duplicate.headers.get('location'), base).pathname, '/news/1');
const api = await fetch(`${base}/api/contact`);
assert.equal(api.status, 405, 'Contact endpoint remains available');
console.log(`Verified ${pages.length} pages, sitemap, robots, duplicate redirect, HTTP 404s and contact endpoint.`);
