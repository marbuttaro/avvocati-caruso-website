import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { load } from 'cheerio';
import { pages, SITE_URL, SITE_NAME, getPage, renderSeoHead } from '../src/seo/site.js';
import { professionals } from '../src/data/professionals.js';

const readPage = path => load(readFileSync(path === '/' ? 'dist/index.html' : `dist${path}.html`, 'utf8'));
const paths = new Set(pages.map(page => page.path));

test('all sitemap pages contain unique metadata and real content before JavaScript', () => {
  const titles = new Set(), descriptions = new Set();
  for (const page of pages) {
    const $ = readPage(page.path);
    assert.equal($('html').attr('lang'), 'it', page.path);
    assert.equal($('title').length, 1, page.path);
    assert.equal($('title').text(), page.title);
    assert.ok(!titles.has(page.title)); titles.add(page.title);
    assert.ok(!descriptions.has(page.description)); descriptions.add(page.description);
    assert.equal($('meta[name="description"]').length, 1);
    assert.equal($('meta[name="description"]').attr('content'), page.description);
    assert.equal($('link[rel="canonical"]').length, 1);
    assert.equal($('link[rel="canonical"]').attr('href'), SITE_URL + page.path);
    assert.doesNotMatch($('meta[name="robots"]').attr('content'), /noindex/);
    assert.equal($('h1').length, 1, page.path);
    assert.ok($('main').text().trim().length > 200, page.path);
    assert.equal($('meta[property="og:site_name"]').attr('content'), SITE_NAME);
    assert.equal($('meta[property="og:url"]').attr('content'), SITE_URL + page.path);
    assert.equal($('meta[name="twitter:card"]').attr('content'), 'summary_large_image');
    assert.ok(existsSync('dist' + new URL($('meta[property="og:image"]').attr('content')).pathname));
  }
});

test('JSON-LD describes the actual site, studio, breadcrumbs, people and signed articles', () => {
  for (const page of pages) {
    const $ = readPage(page.path);
    assert.equal($('script[type="application/ld+json"]').length, 1);
    const graph = JSON.parse($('script[type="application/ld+json"]').text())['@graph'];
    assert.equal(graph.find(node => node['@type'] === 'WebSite').name, SITE_NAME);
    const business = graph.find(node => node['@type'] === 'LegalService');
    assert.equal(business.address.addressLocality, 'Pozzuoli');
    assert.equal(business.telephone, '+390813032399');
    assert.equal(business.aggregateRating, undefined);
    if (page.path !== '/') {
      const trail = graph.find(node => node['@type'] === 'BreadcrumbList').itemListElement;
      assert.equal(trail.at(-1).item, SITE_URL + page.path);
      assert.deepEqual(trail.map(item => item.position), trail.map((_, i) => i + 1));
    }
    if (page.article) {
      const article = graph.find(node => node['@type'] === 'BlogPosting');
      assert.ok(article.author.name && article.datePublished);
      assert.equal(article.mainEntityOfPage['@id'], SITE_URL + page.path + '#webpage');
      assert.match(article.author.url, /\/team#/);
      assert.equal($('time').first().attr('datetime'), article.datePublished);
    }
  }
  const team = readPage('/team');
  for (const person of professionals) assert.ok(team('main').text().includes(person.bio[0]), person.name);
});

test('sitemap and robots reference exactly the canonical indexable URLs', () => {
  const $ = load(readFileSync('dist/sitemap.xml', 'utf8'), { xmlMode: true });
  const urls = $('url > loc').map((_, el) => $(el).text()).get();
  assert.deepEqual(urls, pages.map(page => SITE_URL + page.path));
  assert.equal(new Set(urls).size, urls.length);
  assert.ok(!urls.some(url => /\/news\/3|\/404|\/api\/|\/privacy|\/cookies/.test(url)));
  const robots = readFileSync('dist/robots.txt', 'utf8');
  assert.match(robots, /Sitemap: https:\/\/carusoavvocati.it\/sitemap.xml/);
  assert.doesNotMatch(robots, /Disallow: \/\s*$/m);
});

test('all internal links, fragments, scripts and images resolve to real build resources', () => {
  for (const page of pages) {
    const $ = readPage(page.path);
    for (const el of $('a[href], img[src], script[src], link[rel="stylesheet"]').toArray()) {
      const attr = el.name === 'a' || el.name === 'link' ? 'href' : 'src';
      const raw = $(el).attr(attr);
      if (!raw || /^(mailto:|tel:|https?:)/.test(raw)) continue;
      const url = new URL(raw, SITE_URL + page.path);
      if (el.name === 'a') {
        assert.ok(paths.has(url.pathname), `${page.path}: broken link ${raw}`);
        if (url.hash) assert.ok(readPage(url.pathname)(`[id="${decodeURIComponent(url.hash.slice(1))}"]`).length, `${page.path}: missing fragment ${raw}`);
      } else assert.ok(existsSync(`dist${decodeURIComponent(url.pathname)}`), `${page.path}: missing asset ${raw}`);
    }
    for (const img of $('img').toArray()) assert.notEqual($(img).attr('alt'), undefined, page.path);
  }
});

test('unknown routes are noindex and the hosting config preserves real 404s', () => {
  const $ = readPage('/404');
  assert.match($('meta[name="robots"]').attr('content'), /noindex/);
  assert.equal($('link[rel="canonical"]').length, 0);
  assert.equal($('script[type="application/ld+json"]').length, 0);
  assert.match($('h1').text(), /Pagina non trovata/);
  assert.equal(getPage('/news/999').noindex, true);
  const config = JSON.parse(readFileSync('vercel.json', 'utf8'));
  assert.equal(config.rewrites, undefined);
  assert.equal(config.cleanUrls, true);
  assert.ok(config.redirects.some(rule => rule.source === '/news/3' && rule.destination === '/news/1' && rule.permanent));
});

test('head serialization escapes metadata and cannot inject script markup', () => {
  const html = renderSeoHead({ ...getPage('/'), title: '<script>alert(1)</script>', description: '" onload="alert(1)' });
  assert.ok(!html.includes('<script>alert(1)</script>'));
  const $ = load(html);
  assert.equal($('title').text(), '<script>alert(1)</script>');
  assert.equal($('[onload]').length, 0);
});
