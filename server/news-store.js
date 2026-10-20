import { createHash } from 'node:crypto';
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { get, put, BlobPreconditionFailedError } from '@vercel/blob';
import initialNews from '../src/data/news.json' with { type: 'json' };

export class ConflictError extends Error {}
const queues = new Map();
const digest = value => createHash('sha256').update(value).digest('hex');

export function createFileStore(file = resolve('.data/news.json')) {
  async function read() {
    await mkdir(dirname(file), { recursive: true });
    try { await writeFile(file, JSON.stringify(initialNews), { flag: 'wx', mode: 0o600 }); }
    catch (error) { if (error.code !== 'EEXIST') throw error; }
    const raw = await readFile(file, 'utf8');
    return { data: JSON.parse(raw), revision: digest(raw) };
  }
  async function write(data, revision) {
    const pending = (queues.get(file) || Promise.resolve()).catch(() => {}).then(async () => {
      const current = await read();
      if (current.revision !== revision) throw new ConflictError();
      const raw = JSON.stringify(data, null, 2) + '\n';
      const temporary = `${file}.tmp`;
      await writeFile(temporary, raw, { mode: 0o600 });
      await rename(temporary, file);
      return digest(raw);
    });
    queues.set(file, pending);
    return pending;
  }
  return { read, write };
}

export function createBlobStore(env = process.env, pathname = 'news/articles.json') {
  const options = { access: 'private', ...(env.BLOB_READ_WRITE_TOKEN ? { token: env.BLOB_READ_WRITE_TOKEN } : { storeId: env.BLOB_STORE_ID }) };
  return {
    async read() {
      const result = await get(pathname, { ...options, useCache: false });
      if (!result) throw new Error('News JSON has not been initialized');
      return { data: await new Response(result.stream).json(), revision: result.blob.etag };
    },
    async write(data, revision) {
      try {
        const result = await put(pathname, JSON.stringify(data, null, 2) + '\n', {
          ...options, contentType: 'application/json', addRandomSuffix: false,
          allowOverwrite: true, ifMatch: revision, cacheControlMaxAge: 60,
        });
        return result.etag;
      } catch (error) {
        if (error instanceof BlobPreconditionFailedError) throw new ConflictError();
        throw error;
      }
    },
  };
}

export function createNewsStore(env = process.env) {
  // Local development never edits the production store.
  if (!env.VERCEL) return createFileStore(env.NEWS_FILE || resolve('.data/news.json'));
  return createBlobStore(env, env.VERCEL_ENV === 'preview' ? 'preview/articles.json' : 'news/articles.json');
}
