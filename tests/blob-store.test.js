import test from 'node:test';
import assert from 'node:assert/strict';
import { BlobPreconditionFailedError } from '@vercel/blob';
import { createBlobStore, ConflictError } from '../server/news-store.js';
import { readBlobDocument } from '../server/blob-document.js';
import { createAdminHandler } from '../server/admin.js';
import { sessionCookie } from '../server/admin-auth.js';
import initialNews from '../src/data/news.json' with { type: 'json' };

const env = { ADMIN_USERNAME: 'test', ADMIN_PASSWORD: 'local-test-password-123456', ADMIN_SESSION_SECRET: 'local-test-secret-12345678901234567890123456789' };

// Model the real Blob/CDN behavior: compressed JSON has a weak ETag,
// while conditional writes require the original strong ETag.
function fixture() {
  let data = structuredClone(initialNews), version = 1;
  const etag = () => `"revision-${version}"`;
  const client = {
    async get(_pathname, options) {
      const revision = options.headers?.['Accept-Encoding'] === 'identity' ? etag() : `W/${etag()}`;
      return { blob: { etag: revision }, stream: new Response(JSON.stringify(data)).body };
    },
    async put(_pathname, raw, options) {
      if (options.ifMatch !== etag()) throw new BlobPreconditionFailedError();
      data = JSON.parse(raw);
      version++;
      return { etag: etag() };
    },
  };
  const store = createBlobStore({}, 'test/articles.json', client);
  const handler = createAdminHandler({ env, store });
  const cookie = sessionCookie(env).split(';')[0];
  async function call(method = 'GET', body) {
    const req = { url: '/api/admin?action=articles', method, body, headers: {
      cookie, origin: 'http://localhost:5173', 'content-type': 'application/json',
    } };
    const res = { writeHead(status) { this.status = status; }, end(raw) { this.body = JSON.parse(raw); } };
    await handler(req, res);
    return res;
  }
  return { store, client, call };
}

test('large JSON read revisions can be used for conditional writes without false conflicts', async () => {
  const { store } = fixture();
  const current = await store.read();
  assert.ok(JSON.stringify(current.data).length > 2000);
  const updated = { ...current.data, nextId: 10 };
  const revision = await store.write(updated, current.revision);
  const reloaded = await store.read();
  assert.equal(revision, reloaded.revision);
  assert.deepEqual(reloaded.data, updated);
});

test('Blob reads bypass the cache and request the original representation', async () => {
  await readBlobDocument('test/articles.json', { access: 'private' }, async (pathname, options) => {
    assert.equal(pathname, 'test/articles.json');
    assert.equal(options.useCache, false);
    assert.equal(options.headers['Accept-Encoding'], 'identity');
    return { blob: { etag: '"original"' }, stream: new Response('{"articles":[]}').body };
  });
});

test('missing or weak storage validators fail closed instead of allowing unconditional overwrites', async () => {
  for (const etag of [undefined, '', 'W/"weak"', 'unquoted']) {
    const client = {
      get: async () => ({ blob: { etag }, stream: new Response('{}').body }),
      put: async () => assert.fail('must not write without a strong validator'),
    };
    const store = createBlobStore({}, 'test/articles.json', client);
    await assert.rejects(store.read(), /strong ETag/);
    await assert.rejects(store.write({}, etag), /strong ETag/);
  }
});

test('Blob precondition failures remain conflicts and concurrent writes cannot overwrite each other', async () => {
  const { store } = fixture();
  const current = await store.read();
  const results = await Promise.allSettled([
    store.write({ ...current.data, nextId: 10 }, current.revision),
    store.write({ ...current.data, nextId: 20 }, current.revision),
  ]);
  assert.equal(results.filter(result => result.status === 'fulfilled').length, 1);
  assert.ok(results.find(result => result.status === 'rejected').reason instanceof ConflictError);
  assert.equal((await store.read()).data.nextId, 10);
});

test('storage outages and missing JSON are not misreported as edit conflicts', async () => {
  const failure = new Error('storage unavailable');
  const store = createBlobStore({}, 'test/articles.json', {
    get: async () => { throw failure; }, put: async () => { throw failure; },
  });
  await assert.rejects(store.read(), error => error === failure);
  await assert.rejects(store.write({}, '"valid"'), error => error === failure);
  const missing = createBlobStore({}, 'test/articles.json', { get: async () => null });
  await assert.rejects(missing.read(), /not been initialized/);
});

test('admin refresh followed by resubmitting the same draft recovers from real conflicts', async () => {
  const { call } = fixture();
  const initial = await call();
  const draft = { title: 'Sicurezza sul lavoro', subtitle: 'Area di rischio', court: 'Corte di Cassazione', category: 'Diritto penale', content: 'Un approfondimento.\n\nSecondo paragrafo.' };
  const other = await call('POST', { revision: initial.body.revision, title: 'Altro articolo', content: 'Testo.' });
  assert.equal(other.status, 201);
  const stale = await call('POST', { ...draft, revision: initial.body.revision });
  assert.equal(stale.status, 409);
  const refresh = await call();
  const saved = await call('POST', { ...draft, revision: refresh.body.revision });
  assert.equal(saved.status, 201);
  for (const [key, value] of Object.entries(draft)) assert.equal(saved.body.article[key], value);
  assert.equal(saved.body.articles.length, initial.body.articles.length + 2);
  const reloaded = await call();
  const edited = await call('PATCH', { ...draft, id: saved.body.article.id, title: 'Titolo modificato', revision: reloaded.body.revision });
  assert.equal(edited.status, 200);
  const deleted = await call('DELETE', { id: saved.body.article.id, revision: edited.body.revision });
  assert.equal(deleted.status, 200);
});

test('a client opened before the fix recovers by refreshing its weak revision', async () => {
  const { call } = fixture();
  const initial = await call();
  const fields = { title: 'Nuovo articolo', content: 'Testo.' };
  const stale = await call('POST', { ...fields, revision: `W/${initial.body.revision}` });
  assert.equal(stale.status, 409);
  const refreshed = await call();
  assert.equal((await call('POST', { ...fields, revision: refreshed.body.revision })).status, 201);
});
