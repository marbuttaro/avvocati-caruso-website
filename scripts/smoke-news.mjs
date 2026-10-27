// Opt-in integration smoke test. Writes only a unique private diagnostics blob.
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { randomUUID } from 'node:crypto';
import { once } from 'node:events';
import { readFile } from 'node:fs/promises';
import { loadEnv } from 'vite';
import { put, del } from '@vercel/blob';
import { createBlobStore, ConflictError } from '../server/news-store.js';
import { createAdminHandler } from '../server/admin.js';
import { createNewsHandler } from '../server/news.js';
import { createPageHandler } from '../server/page.js';
import { render } from '../.prerender/entry-server.js';
import initialNews from '../src/data/news.json' with { type: 'json' };

const config = { ...loadEnv('production', process.cwd(), ''), ...process.env };
assert.ok(config.BLOB_READ_WRITE_TOKEN, 'BLOB_READ_WRITE_TOKEN is required for the opt-in smoke test');
const pathname = `diagnostics/news-smoke-${randomUUID()}.json`;
const options = { access: 'private', token: config.BLOB_READ_WRITE_TOKEN };
const auth = {
  ADMIN_USERNAME: 'smoke-test',
  ADMIN_PASSWORD: randomUUID(),
  ADMIN_SESSION_SECRET: randomUUID() + randomUUID(),
};
const store = createBlobStore(config, pathname);
const adminHandler = createAdminHandler({ env: auth, store });
const newsHandler = createNewsHandler({ store });
const pageHandler = createPageHandler({ render, store, env: {}, template: () => readFile('.prerender/template.html', 'utf8') });
let created, server;
try {
  created = await put(pathname, JSON.stringify(initialNews, null, 2), {
    ...options, addRandomSuffix: false, contentType: 'application/json', cacheControlMaxAge: 60,
  });
  server = createServer((req, res) => {
    if (req.url.startsWith('/api/admin')) return adminHandler(req, res);
    if (req.url === '/api/news') return newsHandler(req, res);
    return pageHandler(req, res);
  });
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const origin = `http://127.0.0.1:${server.address().port}`;
  let cookie;
  async function request(method = 'GET', body, action = 'articles', authenticated = true) {
    const response = await fetch(`${origin}/api/admin?action=${action}`, {
      method, headers: { Origin: origin, 'Content-Type': 'application/json', ...(authenticated && cookie ? { Cookie: cookie } : {}) },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    });
    return { status: response.status, headers: response.headers, body: await response.json() };
  }
  const login = await request('POST', { username: auth.ADMIN_USERNAME, password: auth.ADMIN_PASSWORD }, 'login');
  assert.equal(login.status, 200);
  cookie = login.headers.get('set-cookie').split(';')[0];
  assert.equal((await request('GET', undefined, 'articles', false)).status, 401);
  const initial = await request();
  assert.equal(initial.status, 200);
  assert.match(initial.body.revision, /^"[^"]+"$/);
  assert.equal(initial.body.revision, created.etag);
  assert.deepEqual(initial.body.articles, initialNews.articles);

  const draft = { title: 'SMOKE — Sicurezza sul lavoro', subtitle: 'Verifica del sottotitolo',
    court: 'Ente di prova', category: 'Categoria smoke', content: 'Testo di prova con accenti: è, à, ò. '.repeat(200) + '\n\nSecondo paragrafo.' };
  const saved = await request('POST', { ...draft, revision: initial.body.revision });
  assert.equal(saved.status, 201, JSON.stringify(saved.body));
  const id = saved.body.article.id;
  assert.deepEqual(saved.body.articles.slice(1), initialNews.articles);
  const reloaded = await request();
  assert.equal(reloaded.body.revision, saved.body.revision, 'read-after-write validator must match');
  assert.equal(reloaded.body.articles[0].content, draft.content);
  console.log('PASS login, authenticated listing, large article creation, metadata and persistence');

  assert.equal((await request('PATCH', { ...draft, id, revision: initial.body.revision })).status, 409);
  assert.equal((await request('POST', { ...draft, revision: `W/${reloaded.body.revision}` })).status, 409);
  const refreshed = await request();
  const edited = await request('PATCH', { ...draft, id, title: 'SMOKE — Titolo aggiornato', revision: refreshed.body.revision });
  assert.equal(edited.status, 200, JSON.stringify(edited.body));
  const updated = await request('PATCH', { ...draft, id, revision: edited.body.revision, category: 'categoria SMOKE' });
  assert.equal(updated.status, 200);
  assert.equal(updated.body.article.category, 'Categoria smoke');
  console.log('PASS stale revisions, old weak revisions, refresh/resubmit and category reuse');

  const publicNews = await (await fetch(origin + '/api/news')).json();
  assert.equal(publicNews.articles[0].id, id);
  const html = await (await fetch(origin + `/news/${id}`)).text();
  assert.ok(html.includes('Verifica del sottotitolo'));
  assert.ok(html.includes('Ente di prova'));
  const sitemap = await (await fetch(origin + '/sitemap.xml')).text();
  assert.ok(sitemap.includes(`/news/${id}`));
  const latest = await store.read();
  const races = await Promise.allSettled([
    store.write({ ...latest.data, smokeRace: 'first' }, latest.revision),
    store.write({ ...latest.data, smokeRace: 'second' }, latest.revision),
  ]);
  assert.equal(races.filter(result => result.status === 'fulfilled').length, 1);
  assert.ok(races.find(result => result.status === 'rejected').reason instanceof ConflictError);
  console.log('PASS public API, rendered article, sitemap and actual concurrent Blob writes');

  const beforeDelete = await request();
  const deleted = await request('DELETE', { id, revision: beforeDelete.body.revision });
  assert.equal(deleted.status, 200);
  assert.deepEqual(deleted.body.articles, initialNews.articles);
  assert.ok(deleted.body.categories.includes('Categoria smoke'));
  assert.equal((await fetch(origin + `/news/${id}`)).status, 404);
  assert.ok(!(await (await fetch(origin + '/sitemap.xml')).text()).includes(`/news/${id}`));
  await request('POST', {}, 'logout');
  console.log('PASS deletion, category persistence and public 404 after deletion');
} finally {
  if (server) { server.closeAllConnections(); await new Promise(resolve => server.close(resolve)); }
  if (created) {
    // Only this test owns the UUID pathname. No live news are read or written.
    await del(created.url, options);
    console.log('CLEANUP isolated diagnostics blob removed; production articles untouched');
  }
}
