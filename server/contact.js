import { createHash } from 'node:crypto';

const MAX_BODY_BYTES = 20_000;
const EMAIL = /^[^\s<>@,;]+@[^\s<>@,;]+\.[^\s<>@,;]+$/;
const FAILURE = 'La richiesta non è stata confermata. Riprova tra poco oppure chiama lo studio al numero 081 3032399.';

function reply(res, status, body, headers = {}) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...headers });
  res.end(JSON.stringify(body));
}

async function readBody(req) {
  if (Number(req.headers['content-length']) > MAX_BODY_BYTES) throw new Error('too_large');
  if (req.body !== undefined) {
    const raw = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    if (Buffer.byteLength(raw) > MAX_BODY_BYTES) throw new Error('too_large');
    return JSON.parse(raw);
  }
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += Buffer.byteLength(chunk);
    if (size > MAX_BODY_BYTES) throw new Error('too_large');
    chunks.push(Buffer.from(chunk));
  }
  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}

function validAppointment(date, time, now) {
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(date) || !/^(?:09|1[0-7]):(?:00|30)$|^18:00$/.test(time)) return false;
  const [day, month, year] = date.split('/').map(Number);
  const parsed = new Date(Date.UTC(year, month - 1, day));
  if (parsed.getUTCFullYear() !== year || parsed.getUTCMonth() !== month - 1 || parsed.getUTCDate() !== day) return false;
  if ([0, 6].includes(parsed.getUTCDay())) return false;
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Rome', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
  }).formatToParts(now).map(({ type, value }) => [type, value]));
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}T${time}` >
    `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}`;
}

export function createContactHandler({ env = process.env, send = fetch, now = () => new Date() } = {}) {
  return async function contact(req, res) {
    if (req.method !== 'POST') return reply(res, 405, { error: 'Metodo non consentito.' }, { Allow: 'POST' });
    const allowedOrigins = new Set(['https://carusoavvocati.it', 'https://www.carusoavvocati.it', 'https://sito-web-six.vercel.app']);
    if (env.VERCEL_URL) allowedOrigins.add(`https://${env.VERCEL_URL}`);
    if (env.VERCEL_BRANCH_URL) allowedOrigins.add(`https://${env.VERCEL_BRANCH_URL}`);
    const origin = req.headers.origin;
    const localOrigin = env.NODE_ENV !== 'production' && /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin || '');
    if ((origin && !allowedOrigins.has(origin) && !localOrigin) || req.headers['sec-fetch-site'] === 'cross-site') {
      return reply(res, 403, { error: FAILURE });
    }
    if (!/^application\/json(?:;|$)/i.test(req.headers['content-type'] || '')) {
      return reply(res, 415, { error: FAILURE });
    }

    let body;
    try { body = await readBody(req); } catch (error) {
      return reply(res, error.message === 'too_large' ? 413 : 400, { error: 'La richiesta non è leggibile. Ricarica la pagina e riprova.' });
    }
    if (!body || typeof body !== 'object' || Array.isArray(body)) return reply(res, 400, { error: FAILURE });
    if (body.website) return reply(res, 200, { ok: true });
    const field = (name) => typeof body[name] === 'string' ? body[name].trim() : '';
    const type = field('type');
    const firstName = field('firstName');
    const lastName = field('lastName');
    const email = field('email');
    const message = field('message');
    const date = field('date');
    const time = field('time');
    if (!['contact', 'appointment'].includes(type) || !/^[\da-f-]{36}$/i.test(field('requestId'))) {
      return reply(res, 400, { error: 'Ricarica la pagina e riprova a inviare la richiesta.' });
    }
    if (!firstName || !lastName || firstName.length > 100 || lastName.length > 100 || /[\r\n]/.test(firstName + lastName)) {
      return reply(res, 400, { error: 'Inserisci nome e cognome, fino a 100 caratteri ciascuno.' });
    }
    if (email.length > 254 || !EMAIL.test(email)) return reply(res, 400, { error: 'Inserisci un indirizzo email come nome@esempio.it.' });
    if (type === 'contact' && (!message || message.length > 5000)) {
      return reply(res, 400, { error: 'Scrivi un messaggio di massimo 5.000 caratteri.' });
    }
    if (type === 'appointment' && !validAppointment(date, time, now())) {
      return reply(res, 400, { error: 'Scegli una data e un orario futuri, dal lunedì al venerdì tra le 09:00 e le 18:00.' });
    }
    const { RESEND_API_KEY: key, RESEND_FROM_EMAIL: from, CONTACT_TO_EMAIL: to } = env;
    if (!key || !from || !to || !EMAIL.test(to)) {
      console.error('Contact email configuration is missing or invalid.');
      return reply(res, 503, { error: FAILURE });
    }
    const payload = {
      from, to: [to], reply_to: email,
      subject: type === 'appointment' ? 'Richiesta di appuntamento dal sito — Caruso Avvocati' : 'Richiesta di contatto dal sito — Caruso Avvocati',
      text: [
        `Nome: ${firstName} ${lastName}`, `Email: ${email}`, '',
        ...(type === 'appointment'
          ? [`Data richiesta: ${date}`, `Ora richiesta: ${time} (Europe/Rome)`, '', 'Appuntamento da confermare con il richiedente.']
          : ['Messaggio:', message]),
      ].join('\n'),
    };
    const digest = createHash('sha256').update(JSON.stringify(payload)).digest('hex');
    try {
      const result = await send('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json', 'Idempotency-Key': `contact/${field('requestId')}/${digest}` },
        body: JSON.stringify(payload), signal: AbortSignal.timeout(15_000),
      });
      const data = await result.json();
      if (!result.ok || !data.id) {
        // Do not log email content, addresses, or credentials.
        console.error('Contact email provider rejected request:', result.status);
        return reply(res, result.status === 429 ? 429 : 502, { error: FAILURE });
      }
      return reply(res, 200, { ok: true });
    } catch {
      console.error('Contact email provider request failed.');
      return reply(res, 502, { error: FAILURE });
    }
  };
}
