import { randomUUID } from 'node:crypto';
import { mkdir, readFile, unlink, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { put, del } from '@vercel/blob';

// Immagini facoltative delle news. In produzione vanno nello store Blob pubblico
// "caruso-news-immagini" (token NEWS_IMAGES_READ_WRITE_TOKEN), separato dallo store
// privato che contiene il JSON degli articoli. In locale restano in .data/news-images.

export const MAX_IMAGE_BYTES = 3_000_000;
export const LOCAL_IMAGE_PREFIX = '/news-images-local/';
const TYPES = { webp: 'image/webp', jpg: 'image/jpeg', png: 'image/png' };

export function imageType(buffer) {
  if (buffer.length > 12 && buffer.toString('ascii', 0, 4) === 'RIFF' && buffer.toString('ascii', 8, 12) === 'WEBP') return 'webp';
  if (buffer.length > 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) return 'jpg';
  if (buffer.length > 8 && buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return 'png';
  return null;
}

export function createLocalImageStore(dir = resolve('.data/news-images')) {
  return {
    async save(buffer, extension) {
      await mkdir(dir, { recursive: true });
      const name = `${randomUUID()}.${extension}`;
      await writeFile(join(dir, name), buffer);
      return `${LOCAL_IMAGE_PREFIX}${name}`;
    },
    owns: url => typeof url === 'string' && new RegExp(`^${LOCAL_IMAGE_PREFIX}[0-9a-f-]{36}\\.(webp|jpg|png)$`).test(url),
    async remove(url) { await unlink(join(dir, url.slice(LOCAL_IMAGE_PREFIX.length))); },
    async read(name) {
      if (!/^[0-9a-f-]{36}\.(webp|jpg|png)$/.test(name)) return null;
      try { return { body: await readFile(join(dir, name)), type: TYPES[name.split('.').pop()] }; }
      catch { return null; }
    },
  };
}

export function createBlobImageStore(env = process.env, client = { put, del }) {
  const token = env.NEWS_IMAGES_READ_WRITE_TOKEN;
  // Token: vercel_blob_rw_<storeId>_<segreto>; gli URL pubblici sono <storeid>.public.blob.vercel-storage.com
  const storeId = token?.split('_')[3]?.toLowerCase();
  const folder = env.VERCEL_ENV === 'preview' ? 'preview' : 'news';
  return {
    async save(buffer, extension) {
      if (!token) throw new Error('NEWS_IMAGES_READ_WRITE_TOKEN is not configured');
      const result = await client.put(`${folder}/${randomUUID()}.${extension}`, buffer, {
        access: 'public', token, contentType: TYPES[extension], addRandomSuffix: false, cacheControlMaxAge: 31_536_000,
      });
      return result.url;
    },
    owns(url) {
      try {
        const parsed = new URL(url);
        return Boolean(storeId) && parsed.protocol === 'https:' && parsed.hostname === `${storeId}.public.blob.vercel-storage.com`
          && /^\/(news|preview)\/[0-9a-f-]{36}\.(webp|jpg|png)$/.test(parsed.pathname) && !parsed.search && !parsed.hash;
      } catch { return false; }
    },
    async remove(url) { await client.del(url, { token }); },
  };
}

export function createImageStore(env = process.env) {
  if (!env.VERCEL) return createLocalImageStore(env.NEWS_IMAGES_DIR || resolve('.data/news-images'));
  return createBlobImageStore(env);
}
