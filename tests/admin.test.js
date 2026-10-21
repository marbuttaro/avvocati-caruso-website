import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, rm, writeFile, access, cp } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createAdminHandler } from '../server/admin.js';
import { createFileStore, ConflictError } from '../server/news-store.js';
import { authenticated, sessionCookie, allowLogin } from '../server/admin-auth.js';
import { createNewsHandler } from '../server/news.js';
import { createPageHandler } from '../server/page.js';
import { render } from '../.prerender/entry-server.js';
import { readFile } from 'node:fs/promises';
import { load } from 'cheerio';
import { prepareDynamicPages } from '../scripts/prepare-dynamic-pages.mjs';

const env = { ADMIN_USERNAME: 'admin', ADMIN_PASSWORD: 'test-password-only-12345678', ADMIN_SESSION_SECRET: 'test-secret-only-12345678901234567890123456789' };
const epoch = Date.UTC(2026, 9, 20, 12);
async function fixture(t) {
  const dir = await mkdtemp(join(tmpdir(), 'caruso-news-'));
  t.after(() => rm(dir, { recursive: true, force: true }));
  const store = createFileStore(join(dir, 'articles.json'));
  return { file: join(dir, 'articles.json'), store, handler: createAdminHandler({ env, store, now: () => epoch, loginLimit: async () => true }) };
}
async function call(handler, { action = 'articles', method = 'GET', body, cookie, headers = {}, url } = {}) {
  const req = { url: url || `/api/admin?action=${action}`, method, headers: { origin: 'http://localhost:5173', 'content-type': 'application/json', ...(cookie ? { cookie } : {}), ...headers }, ...(body === undefined ? {} : { body }) };
  const res = { writeHead(status, responseHeaders) { this.status = status; this.headers = responseHeaders; }, end(raw) { this.raw = raw || ''; try { this.body = JSON.parse(raw); } catch { /* HTML responses */ } } };
  await handler(req, res);
  return res;
}
const cookie = () => sessionCookie(env, epoch).split(';')[0];

test('unauthenticated writes, forged cookies and cross-origin requests are rejected', async t => {
  const { handler, store } = await fixture(t);
  const before = await store.read();
  for (const method of ['GET', 'POST', 'PATCH', 'DELETE']) assert.equal((await call(handler, { method, body: {} })).status, 401);
  assert.equal((await call(handler, { cookie: `${cookie()}tampered` })).status, 401);
  assert.equal((await call(handler, { cookie: cookie(), method: 'DELETE', body: {}, headers: { origin: 'https://attacker.example' } })).status, 403);
  assert.equal((await call(handler, { action: 'login', method: 'POST', body: {}, headers: { origin: undefined } })).status, 403);
  assert.equal((await call(handler, { cookie: cookie(), method: 'POST', body: {}, headers: { 'content-type': 'text/plain' } })).status, 403);
  assert.deepEqual(await store.read(), before);
});

test('login uses HttpOnly cookies, rejects wrong passwords, expires and rotates credentials', async t => {
  const { handler } = await fixture(t);
  assert.equal((await call(handler, { action: 'login', method: 'POST', body: { username: 'admin', password: 'wrong' } })).status, 401);
  const login = await call(handler, { action: 'login', method: 'POST', body: { username: 'admin', password: env.ADMIN_PASSWORD } });
  assert.equal(login.status, 200);
  assert.match(login.headers['Set-Cookie'], /HttpOnly; SameSite=Strict; Path=\/api\/admin; Max-Age=28800/);
  assert.match(sessionCookie({ ...env, VERCEL: '1' }, epoch), /; Secure$/);
  const req = { headers: { cookie: login.headers['Set-Cookie'].split(';')[0] } };
  assert.equal(authenticated(req, env, epoch), true);
  assert.equal(authenticated(req, env, epoch + 8 * 3600_000), false);
  assert.equal(authenticated(req, { ...env, ADMIN_PASSWORD: 'another-password-123456' }, epoch), false);
  const logout = await call(handler, { action: 'logout', method: 'POST', body: {}, cookie: cookie() });
  assert.match(logout.headers['Set-Cookie'], /Max-Age=0/);
  const disabled = createAdminHandler({ env: {}, loginLimit: async () => true });
  assert.equal((await call(disabled)).status, 503);
});

test('login throttling blocks repeated attempts and resets the time window', async t => {
  const { store } = await fixture(t);
  const limited = createAdminHandler({ env, store, now: () => epoch, loginLimit: async () => false });
  const result = await call(limited, { action: 'login', method: 'POST', body: {} });
  assert.equal(result.status, 429); assert.equal(result.headers['Retry-After'], '900');
  const req = { headers: {}, socket: { remoteAddress: 'test-rate-limit' } };
  for (let i = 0; i < 8; i++) assert.equal(await allowLogin(req, env, epoch), true);
  assert.equal(await allowLogin(req, env, epoch), false);
  assert.equal(await allowLogin(req, env, epoch + 900_000), true);
});

test('complete CRUD persists title and plain text, preserves existing articles and never reuses IDs', async t => {
  const { handler, store, file } = await fixture(t);
  let current = await call(handler, { cookie: cookie() });
  const original = structuredClone(current.body.articles);
  const created = await call(handler, { cookie: cookie(), method: 'POST', body: { revision: current.body.revision, title: 'Una nuova decisione', content: 'Primo paragrafo.\n\nSecondo paragrafo.\nUn altro rigo.' } });
  assert.equal(created.status, 201);
  assert.equal(created.body.article.id, 4); // /news/3 is a legacy redirect.
  assert.equal(created.body.article.date, '20/10/2026');
  assert.deepEqual(created.body.articles.slice(1), original);
  assert.deepEqual((await createFileStore(file).read()).data.articles, created.body.articles);
  const updated = await call(handler, { cookie: cookie(), method: 'PATCH', body: { revision: created.body.revision, id: 4, title: 'Titolo aggiornato', content: '<script>alert(1)</script>\n\nSolo testo.' } });
  assert.equal(updated.status, 200);
  assert.equal((await store.read()).data.articles[0].content, '<script>alert(1)</script>\n\nSolo testo.');
  const publicNews = await call(createNewsHandler({ store }));
  assert.equal(publicNews.status, 200); assert.equal(publicNews.body.articles[0].title, 'Titolo aggiornato');
  assert.equal(publicNews.body.revision, undefined);
  const removed = await call(handler, { cookie: cookie(), method: 'DELETE', body: { revision: updated.body.revision, id: 4 } });
  assert.equal(removed.status, 200); assert.deepEqual(removed.body.articles, original);
  current = await call(handler, { cookie: cookie(), method: 'POST', body: { revision: removed.body.revision, title: 'Altro articolo', content: 'Testo.' } });
  assert.equal(current.body.article.id, 5);
});

test('invalid fields, oversized bodies, missing articles and stale edits cannot change the JSON', async t => {
  const { handler, store } = await fixture(t);
  const initial = await store.read();
  for (const fields of [{ title: '', content: 'Testo' }, { title: 'Titolo', content: ' ' }, { title: 'Riga\nNuova riga', content: 'Testo' }, { title: 'a'.repeat(241), content: 'Testo' }]) {
    assert.equal((await call(handler, { method: 'POST', cookie: cookie(), body: { revision: initial.revision, ...fields } })).status, 400);
  }
  assert.equal((await call(handler, { method: 'POST', cookie: cookie(), body: 'broken json' })).status, 400);
  assert.equal((await call(handler, { method: 'POST', cookie: cookie(), body: {}, headers: { 'content-length': '300000' } })).status, 413);
  assert.equal((await call(handler, { method: 'PATCH', cookie: cookie(), body: { revision: initial.revision, id: 999, title: 'Titolo', content: 'Testo' } })).status, 404);
  assert.equal((await call(handler, { method: 'DELETE', cookie: cookie(), body: { revision: 'stale', id: 1 } })).status, 409);
  assert.deepEqual(await store.read(), initial);
  const results = await Promise.allSettled([store.write({ ...initial.data, nextId: 10 }, initial.revision), store.write({ ...initial.data, nextId: 20 }, initial.revision)]);
  assert.equal(results.filter(result => result.status === 'fulfilled').length, 1);
  assert.ok(results.find(result => result.status === 'rejected').reason instanceof ConflictError);
});

test('live HTML and sitemap reflect CRUD immediately, escape text, and return 404 after deletion', async t => {
  const { handler, store } = await fixture(t);
  const initial = await store.read();
  const created = await call(handler, { cookie: cookie(), method: 'POST', body: { revision: initial.revision, title: 'Sentenza <nuova>', content: '<script>alert(1)</script>\n\nTesto con $& e $`.' } });
  const pageHandler = createPageHandler({ render, store, template: () => readFile('.prerender/template.html', 'utf8'), env });
  let result = await call(pageHandler, { url: '/api/page?path=/news/4' });
  assert.equal(result.status, 200);
  let $ = load(result.raw);
  assert.equal($('h1').text(), 'Sentenza <nuova>');
  assert.equal($('main script').length, 0);
  assert.match($('main').text(), /<script>alert\(1\)<\/script>/);
  assert.equal($('meta[name="robots"]').attr('content'), 'index, follow, max-image-preview:large');
  assert.equal(JSON.parse($('#news-data').text())[0].id, 4);
  assert.match((await call(pageHandler, { url: '/api/page?path=/' })).raw, /Sentenza &lt;nuova&gt;/);
  assert.match((await call(pageHandler, { url: '/api/page?path=/news' })).raw, /Sentenza &lt;nuova&gt;/);
  assert.match((await call(pageHandler, { url: '/api/page?path=/sitemap.xml' })).raw, /https:\/\/carusoavvocati.it\/news\/4/);
  await call(handler, { cookie: cookie(), method: 'DELETE', body: { id: 4, revision: created.body.revision } });
  result = await call(pageHandler, { url: '/api/page?path=/news/4' });
  assert.equal(result.status, 404);
  $ = load(result.raw); assert.match($('meta[name="robots"]').attr('content'), /noindex/);
  assert.doesNotMatch((await call(pageHandler, { url: '/api/page?path=/sitemap.xml' })).raw, /\/news\/4/);
});

test('storage failures return 503 without publishing or restoring deleted seed content', async () => {
  const store = { read: async () => { throw new Error('offline'); } };
  assert.equal((await call(createNewsHandler({ store }))).status, 503);
  const handler = createAdminHandler({ env, store, now: () => epoch });
  assert.equal((await call(handler, { cookie: cookie() })).status, 503);
});

test('Vercel output routes all news to live rendering and keeps institutional pages static', async t => {
  const directory = await mkdtemp(join(tmpdir(), 'caruso-output-'));
  t.after(() => rm(directory, { recursive: true, force: true }));
  await mkdir(join(directory, 'news'));
  for (const path of ['index.html', 'news.html', 'news/1.html', 'sitemap.xml', 'team.html', 'admin.html']) {
    await writeFile(join(directory, path), 'snapshot');
  }
  await prepareDynamicPages(directory);
  for (const path of ['index.html', 'news.html', 'news/1.html', 'sitemap.xml']) await assert.rejects(access(join(directory, path)));
  for (const path of ['team.html', 'admin.html']) await access(join(directory, path));
});

test('the deployed SSR bundle renders without relying on traced node_modules exports', async t => {
  const directory = await mkdtemp(join(tmpdir(), 'caruso-runtime-'));
  t.after(() => rm(directory, { recursive: true, force: true }));
  await cp('.prerender', directory, { recursive: true });
  const url = pathToFileURL(join(directory, 'entry-server.js')).href;
  const html = execFileSync(process.execPath, ['--input-type=module', '-e', 'const {render} = await import(process.argv[1]); process.stdout.write(render("/news", []));', url], { encoding: 'utf8', cwd: directory });
  assert.match(html, /Notizie e approfondimenti giuridici/);
});

test('metadata survives edits, accepts clearing, and categories persist and reuse canonical names', async t => {
  const { handler, store, file } = await fixture(t);
  const initial = await call(handler, { cookie: cookie() });
  assert.deepEqual(initial.body.categories, ['Diritto penale', 'Diritto societario']);
  const original = initial.body.articles[0];
  const preserved = await call(handler, { cookie: cookie(), method: 'PATCH', body: {
    revision: initial.body.revision, id: original.id, title: original.title, content: original.content,
  } });
  for (const key of ['subtitle', 'court', 'category']) assert.equal(preserved.body.article[key], original[key]);
  const created = await call(handler, { cookie: cookie(), method: 'POST', body: {
    revision: preserved.body.revision, title: 'Nuova sentenza', content: 'Testo della sentenza.',
    subtitle: '  Sottotitolo della sentenza  ', court: '  Corte di Cassazione  ', category: '  Diritto   amministrativo  ',
  } });
  assert.equal(created.status, 201);
  assert.equal(created.body.article.subtitle, 'Sottotitolo della sentenza');
  assert.equal(created.body.article.court, 'Corte di Cassazione');
  assert.equal(created.body.article.category, 'Diritto amministrativo');
  assert.equal(created.body.article.description, 'Sottotitolo della sentenza');
  const reused = await call(handler, { cookie: cookie(), method: 'PATCH', body: {
    revision: created.body.revision, id: created.body.article.id, title: 'Nuova sentenza', content: 'Testo aggiornato.',
    category: 'diritto AMMINISTRATIVO',
  } });
  assert.equal(reused.body.article.category, 'Diritto amministrativo');
  assert.equal(reused.body.categories.filter(value => /amministrativo/i.test(value)).length, 1);
  assert.equal(reused.body.article.court, 'Corte di Cassazione');
  const cleared = await call(handler, { cookie: cookie(), method: 'PATCH', body: {
    revision: reused.body.revision, id: created.body.article.id, title: 'Nuova sentenza', content: 'Testo aggiornato.',
    subtitle: '', court: '', category: '',
  } });
  for (const key of ['subtitle', 'court', 'category']) assert.equal(cleared.body.article[key], '');
  const removed = await call(handler, { cookie: cookie(), method: 'DELETE', body: {
    revision: cleared.body.revision, id: created.body.article.id,
  } });
  assert.ok(removed.body.categories.includes('Diritto amministrativo'));
  assert.deepEqual((await createFileStore(file).read()).data.categories, removed.body.categories);
  assert.deepEqual((await store.read()).data.articles[0].subtitle, original.subtitle);
});

test('invalid metadata cannot change articles or create categories', async t => {
  const { handler, store } = await fixture(t);
  const initial = await store.read();
  for (const [key, limit] of [['subtitle', 1000], ['court', 300], ['category', 100]]) {
    for (const value of [null, 12, {}, [], 'prima\nseconda', 'prima\rseconda', 'x'.repeat(limit + 1)]) {
      const result = await call(handler, { cookie: cookie(), method: 'POST', body: {
        revision: initial.revision, title: 'Titolo', content: 'Testo', [key]: value,
      } });
      assert.equal(result.status, 400, `${key}: ${JSON.stringify(value)}`);
    }
  }
  assert.deepEqual(await store.read(), initial);
});

test('public pages render metadata safely and expose the category in SEO', async t => {
  const { handler, store } = await fixture(t);
  const initial = await store.read();
  const created = await call(handler, { cookie: cookie(), method: 'POST', body: {
    revision: initial.revision, title: 'Decisione recente', content: 'Testo pubblico.',
    subtitle: 'Sottotitolo <script>alert(1)</script>', court: 'Ente <img src=x onerror=alert(1)>', category: 'Diritto <nuovo>',
  } });
  assert.equal(created.status, 201);
  const pageHandler = createPageHandler({ render, store, template: () => readFile('.prerender/template.html', 'utf8'), env });
  const page = await call(pageHandler, { url: '/api/page?path=/news/4' });
  const $ = load(page.raw);
  assert.equal($('.single-news-subtitle').text(), created.body.article.subtitle);
  assert.equal($('.single-news-category').text(), created.body.article.category);
  assert.equal($('.single-news-court').text(), `Ente emittente: ${created.body.article.court}`);
  assert.equal($('.news-article-main script, .news-article-main img').length, 0);
  assert.equal($('meta[property="article:section"]').attr('content'), created.body.article.category);
  const home = load((await call(pageHandler, { url: '/api/page?path=/' })).raw);
  assert.ok(home('.news-v5-category').toArray().some(el => home(el).text() === created.body.article.category));
  assert.ok(home('.news-v5-court').toArray().some(el => home(el).text() === created.body.article.court));
  const index = load((await call(pageHandler, { url: '/api/page?path=/news' })).raw);
  assert.ok(index('.news-index-entry').first().text().includes(created.body.article.subtitle));
});
