export function reply(res, status, body, headers = {}) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', ...headers });
  res.end(JSON.stringify(body));
}

export async function readBody(req, limit = 220_000) {
  if (Number(req.headers['content-length']) > limit) throw new Error('too_large');
  let raw;
  if (req.body !== undefined) raw = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
  else {
    const chunks = [];
    let bytes = 0;
    for await (const chunk of req) {
      bytes += Buffer.byteLength(chunk);
      if (bytes > limit) throw new Error('too_large');
      chunks.push(Buffer.from(chunk));
    }
    raw = Buffer.concat(chunks).toString('utf8');
  }
  if (Buffer.byteLength(raw) > limit) throw new Error('too_large');
  const body = JSON.parse(raw);
  if (!body || typeof body !== 'object' || Array.isArray(body)) throw new Error('bad_body');
  return body;
}

export function sameOrigin(req, env) {
  const origins = new Set(['https://carusoavvocati.it', 'https://www.carusoavvocati.it', 'https://sito-web-six.vercel.app']);
  for (const host of [env.VERCEL_URL, env.VERCEL_BRANCH_URL, env.VERCEL_PROJECT_PRODUCTION_URL]) if (host) origins.add(`https://${host}`);
  const origin = req.headers.origin;
  const local = !env.VERCEL && /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin || '');
  return req.headers['sec-fetch-site'] !== 'cross-site' && (origins.has(origin) || local);
}
