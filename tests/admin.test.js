import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
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
