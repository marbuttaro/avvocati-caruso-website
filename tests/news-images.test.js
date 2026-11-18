import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm, readdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createAdminHandler } from '../server/admin.js';
import { createFileStore } from '../server/news-store.js';
import { createLocalImageStore, createBlobImageStore, imageType } from '../server/news-images.js';
import { sessionCookie } from '../server/admin-auth.js';
import { renderSeoHead, getPage } from '../src/seo/site.js';

const env = { ADMIN_USERNAME: 'admin', ADMIN_PASSWORD: 'test-password-only-12345678', ADMIN_SESSION_SECRET: 'test-secret-only-12345678901234567890123456789' };
const epoch = Date.UTC(2026, 10, 18, 12);
const cookie = sessionCookie(env, epoch).split(';')[0];
const webp = Buffer.concat([Buffer.from('RIFF'), Buffer.alloc(4), Buffer.from('WEBPVP8 '), Buffer.alloc(32)]);

async function fixture(t) {
  const dir = await mkdtemp(join(tmpdir(), 'caruso-images-'));
  t.after(() => rm(dir, { recursive: true, force: true }));
  const store = createFileStore(join(dir, 'articles.json'));
  const images = createLocalImageStore(join(dir, 'images'));
  const handler = createAdminHandler({ env, store, images, now: () => epoch, loginLimit: async () => true });
  const call = async (action, method, body, auth = true) => {
    const req = { url: `/api/admin?action=${action}`, method, headers: { origin: 'http://localhost:5173', 'content-type': 'application/json', ...(auth ? { cookie } : {}) }, ...(body ? { body } : {}) };
    const res = { writeHead(status) { this.status = status; }, end(raw) { this.body = JSON.parse(raw); } };
    await handler(req, res);
    return res;
  };
  const files = async () => (await readdir(join(dir, 'images')).catch(() => [])).length;
  return { call, files, store };
}

test('image upload requires login and accepts only real images', async t => {
  const { call, files } = await fixture(t);
  assert.equal((await call('image', 'POST', { data: webp.toString('base64') }, false)).status, 401);
  assert.equal((await call('image', 'POST', { data: Buffer.from('<svg onload=alert(1)>').toString('base64') })).status, 400);
  assert.equal((await call('image', 'POST', { data: 'not base64!' })).status, 400);
  const ok = await call('image', 'POST', { data: webp.toString('base64') });
  assert.equal(ok.status, 201);
  assert.match(ok.body.url, /^\/news-images-local\/[0-9a-f-]{36}\.webp$/);
  assert.equal(await files(), 1);
  assert.equal(imageType(Buffer.from([0xff, 0xd8, 0xff, 0xe0])), 'jpg');
});

test('articles keep the image optional; replaced and deleted images are cleaned up', async t => {
  const { call, files, store } = await fixture(t);
  let { revision } = (await call('articles', 'GET')).body;

  // Senza immagine: tutto come prima
  const plain = await call('articles', 'POST', { title: 'Senza foto', content: 'Uno.\n\nDue.', revision });
  assert.equal(plain.status, 201);
  assert.equal(plain.body.article.image, undefined);
  revision = plain.body.revision;

  // URL esterni o dati non validi vengono rifiutati
  for (const image of [{ url: 'https://evil.example/x.webp', width: 10, height: 10 }, { url: '/news-images-local/x.webp', width: 10, height: 10 }, 'ciao']) {
    assert.equal((await call('articles', 'POST', { title: 'T', content: 'C', image, revision })).status, 400);
  }

  const first = (await call('image', 'POST', { data: webp.toString('base64') })).body.url;
  const created = await call('articles', 'POST', { title: 'Con foto', content: 'Uno.\n\nDue.', image: { url: first, width: 1600, height: 900, alt: ' Tribunale ' }, revision });
  assert.equal(created.status, 201);
  assert.deepEqual(created.body.article.image, { url: first, width: 1600, height: 900, alt: 'Tribunale' });
  revision = created.body.revision;
  const id = created.body.article.id;

  // Modifica senza toccare l'immagine (campo assente): resta
  const kept = await call('articles', 'PATCH', { id, title: 'Con foto 2', content: 'Uno.', revision });
  assert.equal(kept.body.article.image.url, first);
  revision = kept.body.revision;

  // Sostituzione: la vecchia foto viene eliminata
  const second = (await call('image', 'POST', { data: webp.toString('base64') })).body.url;
  assert.equal(await files(), 2);
  const replaced = await call('articles', 'PATCH', { id, title: 'Con foto 2', content: 'Uno.', image: { url: second, width: 800, height: 600, alt: '' }, revision });
  assert.equal(replaced.body.article.image.url, second);
  assert.equal(await files(), 1);
  revision = replaced.body.revision;

  // Rimozione: l'articolo resta, la foto no
  const removed = await call('articles', 'PATCH', { id, title: 'Con foto 2', content: 'Uno.', image: null, revision });
  assert.equal(removed.body.article.image, undefined);
  assert.equal(await files(), 0);
  revision = removed.body.revision;

  // Eliminazione dell'articolo: elimina anche la sua foto
  const third = (await call('image', 'POST', { data: webp.toString('base64') })).body.url;
  revision = (await call('articles', 'PATCH', { id, title: 'Con foto 2', content: 'Uno.', image: { url: third, width: 8, height: 6 }, revision })).body.revision;
  assert.equal((await call('articles', 'DELETE', { id, revision })).status, 200);
  assert.equal(await files(), 0);
  assert.equal((await store.read()).data.articles.some(a => a.id === id), false);
});

test('blob image store accepts only URLs of its own public store', () => {
  const images = createBlobImageStore({ NEWS_IMAGES_READ_WRITE_TOKEN: 'vercel_blob_rw_KavcnzxTQdPCYxne_secret', VERCEL: '1' });
  assert.equal(images.owns('https://kavcnzxtqdpcyxne.public.blob.vercel-storage.com/news/0b9a4a2e-3c1f-4f7e-9b1a-1d2e3f4a5b6c.webp'), true);
  assert.equal(images.owns('https://otherstore.public.blob.vercel-storage.com/news/0b9a4a2e-3c1f-4f7e-9b1a-1d2e3f4a5b6c.webp'), false);
  assert.equal(images.owns('http://kavcnzxtqdpcyxne.public.blob.vercel-storage.com/news/0b9a4a2e-3c1f-4f7e-9b1a-1d2e3f4a5b6c.webp'), false);
  assert.equal(images.owns('https://kavcnzxtqdpcyxne.public.blob.vercel-storage.com/news/articles.json'), false);
});

test('social previews use the article image when present', () => {
  const article = { id: 9, slug: '/news/9', title: 'Titolo', content: 'Testo', date: '18/11/2026' };
  const url = 'https://kavcnzxtqdpcyxne.public.blob.vercel-storage.com/news/0b9a4a2e-3c1f-4f7e-9b1a-1d2e3f4a5b6c.webp';
  const withImage = renderSeoHead(getPage('/news/9', [{ ...article, image: { url, width: 1600, height: 900, alt: '' } }]));
  assert.match(withImage, new RegExp(`property="og:image" content="${url}"`));
  assert.match(withImage, /og:image:type" content="image\/webp"/);
  assert.match(withImage, /og:image:alt" content="Titolo"/);
  const without = renderSeoHead(getPage('/news/9', [article]));
  assert.match(without, /og:image" content="https:\/\/carusoavvocati\.it\/social\/caruso-avvocati\.png"/);
});
