import { createHash, createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import { get, put } from '@vercel/blob';

const COOKIE = 'caruso_admin';
const LIFETIME = 8 * 60 * 60;
const localAttempts = new Map();
const hash = value => createHash('sha256').update(value).digest();
const equal = (a, b) => timingSafeEqual(hash(a), hash(b));
const sign = (value, env) => createHmac('sha256', env.ADMIN_SESSION_SECRET).update(value).digest('base64url');
export const configured = env => Boolean(env.ADMIN_USERNAME && env.ADMIN_PASSWORD?.length >= 16 && env.ADMIN_SESSION_SECRET?.length >= 32);
export const validCredentials = (body, env) => equal(String(body.username || ''), env.ADMIN_USERNAME) && equal(String(body.password || ''), env.ADMIN_PASSWORD);

export function sessionCookie(env, now = Date.now()) {
  const payload = Buffer.from(JSON.stringify({ exp: Math.floor(now / 1000) + LIFETIME, v: sign(env.ADMIN_PASSWORD, env), nonce: randomBytes(16).toString('hex') })).toString('base64url');
  return `${COOKIE}=${payload}.${sign(payload, env)}; HttpOnly; SameSite=Strict; Path=/api/admin; Max-Age=${LIFETIME}${env.VERCEL ? '; Secure' : ''}`;
}
export function clearCookie(env) {
  return `${COOKIE}=; HttpOnly; SameSite=Strict; Path=/api/admin; Max-Age=0${env.VERCEL ? '; Secure' : ''}`;
}
export function authenticated(req, env, now = Date.now()) {
  try {
    const token = req.headers.cookie?.split(';').map(item => item.trim()).find(item => item.startsWith(`${COOKIE}=`))?.slice(COOKIE.length + 1);
    if (!token || token.length > 2000) return false;
    const [payload, signature, extra] = token.split('.');
    if (!payload || !signature || extra || !equal(signature, sign(payload, env))) return false;
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString());
    return data.exp > Math.floor(now / 1000) && equal(data.v, sign(env.ADMIN_PASSWORD, env));
  } catch { return false; }
}

// Count attempts before verifying credentials. Production limits survive cold starts.
export async function allowLogin(req, env, now = Date.now()) {
  const address = env.VERCEL ? req.headers['x-vercel-forwarded-for'] || req.headers['x-real-ip'] || 'unknown' : req.socket?.remoteAddress || 'local';
  const key = sign(`login:${address}`, env);
  const bucket = Math.floor(now / 900_000);
  if (!env.VERCEL) {
    for (const [id, value] of localAttempts) if (value.bucket !== bucket) localAttempts.delete(id);
    const count = (localAttempts.get(key)?.count || 0) + 1;
    localAttempts.set(key, { bucket, count });
    return count <= 8;
  }
  const options = { access: 'private', ...(env.BLOB_READ_WRITE_TOKEN ? { token: env.BLOB_READ_WRITE_TOKEN } : { storeId: env.BLOB_STORE_ID }) };
  const pathname = `auth/${key}.json`;
  const result = await get(pathname, { ...options, useCache: false });
  const previous = result ? await new Response(result.stream).json() : null;
  const count = previous?.bucket === bucket ? previous.count + 1 : 1;
  if (count > 8) return false;
  try {
    await put(pathname, JSON.stringify({ bucket, count }), {
      ...options, addRandomSuffix: false, allowOverwrite: Boolean(result),
      ...(result ? { ifMatch: result.blob.etag } : {}), contentType: 'application/json', cacheControlMaxAge: 60,
    });
    return true;
  } catch (error) {
    if (['BlobPreconditionFailedError', 'BlobAlreadyExistsError'].includes(error.constructor.name)) return false;
    throw error;
  }
}
