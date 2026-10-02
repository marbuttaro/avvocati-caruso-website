import test from 'node:test';
import assert from 'node:assert/strict';
import { Readable } from 'node:stream';
import { createContactHandler } from '../server/contact.js';

const env = { NODE_ENV: 'production', RESEND_API_KEY: 'test-only', RESEND_FROM_EMAIL: 'Caruso <sito@example.com>', CONTACT_TO_EMAIL: 'studio@example.com' };
const valid = { type: 'contact', firstName: 'Mario', lastName: 'Rossi', email: 'mario@example.com', message: 'Vorrei un primo colloquio.', requestId: '12345678-1234-1234-1234-123456789012' };
const now = () => new Date('2026-10-02T10:00:00Z');

async function request(body = valid, options = {}) {
  const sent = [];
  const send = options.send || (async (url, init) => {
    sent.push({ url, ...init, body: JSON.parse(init.body) });
    return new Response(JSON.stringify({ id: 'email-id' }), { status: 200 });
  });
  const handler = createContactHandler({ env: options.env || env, send, now });
  const req = Readable.from([options.raw ?? JSON.stringify(body)]);
  req.method = options.method || 'POST';
  req.headers = { 'content-type': 'application/json', origin: 'https://carusoavvocati.it', ...options.headers };
  const result = { sent };
  const res = {
    writeHead(status, headers) { result.status = status; result.headers = headers; },
    end(data) { result.body = JSON.parse(data); },
  };
  await handler(req, res);
  return result;
}

test('sends to the configured inbox and replies to the visitor; ignores client recipients', async () => {
  const result = await request({ ...valid, to: 'attacker@example.com', from: 'spoof@example.com' });
  assert.equal(result.status, 200);
  assert.equal(result.body.ok, true);
  assert.deepEqual(result.sent[0].body.to, ['studio@example.com']);
  assert.equal(result.sent[0].body.from, env.RESEND_FROM_EMAIL);
  assert.equal(result.sent[0].body.reply_to, valid.email);
  assert.match(result.sent[0].body.text, /Vorrei un primo colloquio/);
});

test('retries use the same idempotency key; changed content uses a different key', async () => {
  const a = await request();
  const b = await request();
  const c = await request({ ...valid, message: 'Una richiesta diversa.' });
  assert.equal(a.sent[0].headers['Idempotency-Key'], b.sent[0].headers['Idempotency-Key']);
  assert.notEqual(a.sent[0].headers['Idempotency-Key'], c.sent[0].headers['Idempotency-Key']);
});

test('rejects invalid inputs and oversized bodies before contacting Resend', async () => {
  for (const body of [null, [], { ...valid, firstName: '' }, { ...valid, firstName: 'Mario\nBcc: x' }, { ...valid, email: 'a@example.com,b@example.com' }, { ...valid, message: '' }, { ...valid, message: 'a'.repeat(5001) }, { ...valid, requestId: '' }]) {
    const result = await request(body);
    assert.equal(result.status, 400);
    assert.equal(result.sent.length, 0);
  }
  assert.equal((await request(valid, { raw: '{broken' })).status, 400);
  assert.equal((await request(valid, { raw: 'a'.repeat(20_001) })).status, 413);
});

test('rejects cross-site submissions, non-JSON bodies and non-POST methods', async () => {
  for (const options of [{ headers: { origin: 'https://unrelated.example' } }, { headers: { 'sec-fetch-site': 'cross-site' } }]) {
    const result = await request(valid, options);
    assert.equal(result.status, 403);
    assert.equal(result.sent.length, 0);
  }
  assert.equal((await request(valid, { headers: { 'content-type': 'text/plain' } })).status, 415);
  assert.equal((await request(valid, { method: 'GET' })).status, 405);
});

test('honeypot skips delivery', async () => {
  const result = await request({ ...valid, website: 'spam' });
  assert.equal(result.status, 200);
  assert.equal(result.sent.length, 0);
});

test('appointment validates actual dates, Rome time, weekdays and offered slots', async () => {
  for (const [date, time] of [['31/02/2027', '09:00'], ['03/10/2026', '09:00'], ['01/10/2026', '09:00'], ['02/10/2026', '11:30'], ['05/10/2026', '18:30'], ['05/10/2026', '09:15']]) {
    const result = await request({ ...valid, type: 'appointment', date, time });
    assert.equal(result.status, 400, `${date} ${time}`);
    assert.equal(result.sent.length, 0);
  }
  const result = await request({ ...valid, type: 'appointment', date: '05/10/2026', time: '09:30' });
  assert.equal(result.status, 200);
  assert.match(result.sent[0].body.text, /05\/10\/2026/);
  assert.match(result.sent[0].body.text, /da confermare/);
});

test('missing configuration and provider failures never return success or leak provider errors', async () => {
  assert.equal((await request(valid, { env: {} })).status, 503);
  for (const status of [403, 429, 500]) {
    const result = await request(valid, { send: async () => new Response(JSON.stringify({ message: 'sensitive-provider-detail' }), { status }) });
    assert.equal(result.status, status === 429 ? 429 : 502);
    assert.equal(result.body.ok, undefined);
    assert.doesNotMatch(result.body.error, /sensitive-provider-detail/);
  }
  assert.equal((await request(valid, { send: async () => { throw new Error('network'); } })).status, 502);
});
