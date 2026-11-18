import { configured, validCredentials, sessionCookie, clearCookie, authenticated, allowLogin } from './admin-auth.js';
import { ConflictError, createNewsStore } from './news-store.js';
import { readBody, reply, sameOrigin } from './http.js';
import { createImageStore, imageType, MAX_IMAGE_BYTES } from './news-images.js';

import { newsCategories, normalizeCategory, categoryKey } from '../src/data/newsCategories.js';

const FAILURE = 'Le modifiche non sono state salvate. Riprova tra poco.';
const conflict = 'Gli articoli sono cambiati. Ricarica l’elenco prima di salvare; il testo che hai scritto resta disponibile.';

function validImage(value, images) {
  if (!value || typeof value !== 'object' || Array.isArray(value) || !images.owns(value.url)) return null;
  const alt = typeof value.alt === 'string' ? value.alt.trim() : '';
  if (alt.length > 300 || /[\r\n]/.test(alt)) return null;
  const size = n => Number.isInteger(n) && n > 0 && n <= 10_000;
  if (!size(value.width) || !size(value.height)) return null;
  return { url: value.url, alt, width: value.width, height: value.height };
}

export function createAdminHandler({ env = process.env, store = createNewsStore(env), images = createImageStore(env), now = () => Date.now(), loginLimit = allowLogin } = {}) {
  return async (req, res) => {
    if (!configured(env)) return reply(res, 503, { error: 'L’accesso amministratore non è configurato. Contatta chi gestisce il sito.' });
    const action = new URL(req.url, 'http://localhost').searchParams.get('action') || 'session';
    if (!['GET', 'POST', 'PATCH', 'DELETE'].includes(req.method)) return reply(res, 405, { error: 'Metodo non consentito.' }, { Allow: 'GET, POST, PATCH, DELETE' });
    if (req.method !== 'GET' && (!sameOrigin(req, env) || !/^application\/json(?:;|$)/i.test(req.headers['content-type'] || ''))) {
      return reply(res, 403, { error: 'La richiesta non è consentita. Ricarica la pagina e riprova.' });
    }
    try {
      if (action === 'login' && req.method === 'POST') {
        if (!await loginLimit(req, env, now())) return reply(res, 429, { error: 'Troppi tentativi di accesso. Riprova tra 15 minuti.' }, { 'Retry-After': '900' });
        const body = await readBody(req, 4000);
        if (!validCredentials(body, env)) return reply(res, 401, { error: 'Nome utente o password non corretti. Verifica le credenziali e riprova.' });
        return reply(res, 200, { authenticated: true }, { 'Set-Cookie': sessionCookie(env, now()) });
      }
      if (!authenticated(req, env, now())) return reply(res, 401, { error: 'La sessione è scaduta. Accedi di nuovo per continuare.' });
      if (action === 'logout' && req.method === 'POST') return reply(res, 200, { authenticated: false }, { 'Set-Cookie': clearCookie(env) });
      if (action === 'session' && req.method === 'GET') return reply(res, 200, { authenticated: true });
      if (action === 'image' && req.method === 'POST') {
        const body = await readBody(req, 4_200_000);
        const buffer = typeof body.data === 'string' && /^[A-Za-z0-9+/]+={0,2}$/.test(body.data) ? Buffer.from(body.data, 'base64') : Buffer.alloc(0);
        const extension = imageType(buffer);
        if (!extension) return reply(res, 400, { error: 'Il file non è un’immagine valida. Usa una foto JPG, PNG o WebP.' });
        if (buffer.length > MAX_IMAGE_BYTES) return reply(res, 413, { error: 'L’immagine è troppo pesante. Usa una foto più leggera.' });
        return reply(res, 201, { url: await images.save(buffer, extension) });
      }
      if (action !== 'articles') return reply(res, 404, { error: 'Richiesta non trovata.' });
      const current = await store.read();
      if (req.method === 'GET') return reply(res, 200, { articles: current.data.articles, categories: newsCategories(current.data), revision: current.revision });
      const body = await readBody(req);
      if (body.revision !== current.revision) return reply(res, 409, { error: conflict });
      const data = structuredClone(current.data);
      data.categories = newsCategories(data);
      let article;
      const removed = [];
      if (req.method === 'POST' || req.method === 'PATCH') {
        const title = typeof body.title === 'string' ? body.title.trim() : '';
        const content = typeof body.content === 'string' ? body.content.replace(/\r\n?/g, '\n').trim() : '';
        if (!title || title.length > 240 || /[\r\n]/.test(title)) return reply(res, 400, { error: 'Scrivi un titolo su una sola riga, fino a 240 caratteri.' });
        if (!content || content.length > 100_000) return reply(res, 400, { error: 'Scrivi il testo dell’articolo, fino a 100.000 caratteri.' });
        const existing = req.method === 'PATCH' ? data.articles.find(item => item.id === body.id) : null;
        if (req.method === 'PATCH' && !existing) return reply(res, 404, { error: 'L’articolo è già stato eliminato. Ricarica l’elenco.' });
        const metadata = {};
        for (const [key, label, limit] of [['subtitle', 'sottotitolo', 1000], ['court', 'ente emittente', 300], ['category', 'categoria', 100]]) {
          const value = body[key] === undefined ? (existing?.[key] || '') : body[key];
          if (typeof value !== 'string' || value.trim().length > limit || /[\r\n]/.test(value)) {
            return reply(res, 400, { error: `Il campo ${label} deve essere un testo su una sola riga, fino a ${limit} caratteri.` });
          }
          metadata[key] = value.trim();
        }
        if (metadata.category) {
          const category = normalizeCategory(metadata.category);
          metadata.category = data.categories.find(value => categoryKey(value) === categoryKey(category)) || category;
          if (!data.categories.includes(metadata.category)) data.categories.push(metadata.category);
          data.categories.sort((a, b) => a.localeCompare(b, 'it'));
        }
        if (body.image) {
          const alt = body.image.alt;
          if (alt !== undefined && (typeof alt !== 'string' || alt.trim().length > 300 || /[\r\n]/.test(alt))) {
            return reply(res, 400, { error: 'Il testo alternativo dell’immagine deve stare su una sola riga, fino a 300 caratteri.' });
          }
          if (!validImage(body.image, images)) return reply(res, 400, { error: 'L’immagine non è valida. Caricala di nuovo.' });
        } else if (body.image !== undefined && body.image !== null) {
          return reply(res, 400, { error: 'L’immagine non è valida. Caricala di nuovo.' });
        }
        const image = body.image === undefined ? existing?.image || null : body.image && validImage(body.image, images);
        const stamp = new Date(now()).toISOString();
        const fields = { title, content, pageTitle: title, seoTitle: `${title} | Caruso Avvocati`, ...metadata, description: (metadata.subtitle || content).replace(/\s+/g, ' ').slice(0, 155), updatedAt: stamp };
        if (image) fields.image = image;
        if (req.method === 'POST') {
          const id = data.nextId++;
          article = { ...fields, id, slug: `/news/${id}`, date: new Intl.DateTimeFormat('it-IT', { timeZone: 'Europe/Rome', day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(now())), createdAt: stamp };
          data.articles.unshift(article);
        } else {
          const index = data.articles.findIndex(item => item.id === body.id);
          if (index < 0) return reply(res, 404, { error: 'L’articolo è già stato eliminato. Ricarica l’elenco.' });
          article = { ...data.articles[index], ...fields };
          if (!image) delete article.image;
          if (existing.image && existing.image.url !== image?.url) removed.push(existing.image.url);
          data.articles[index] = article;
        }
      } else if (req.method === 'DELETE') {
        const index = data.articles.findIndex(item => item.id === body.id);
        if (index < 0) return reply(res, 404, { error: 'L’articolo è già stato eliminato. Ricarica l’elenco.' });
        if (data.articles[index].image) removed.push(data.articles[index].image.url);
        data.articles.splice(index, 1);
      }
      const revision = await store.write(data, current.revision);
      // Dopo il salvataggio: le immagini sostituite o rimosse non servono più. Un errore qui non annulla l'articolo.
      await Promise.all(removed.filter(url => images.owns(url)).map(url => images.remove(url).catch(() => console.error('News image cleanup failed'))));
      return reply(res, req.method === 'POST' ? 201 : 200, { articles: data.articles, categories: data.categories, revision, ...(article ? { article } : {}) });
    } catch (error) {
      if (error instanceof ConflictError) return reply(res, 409, { error: conflict });
      if (error.message === 'too_large') return reply(res, 413, { error: action === 'image' ? 'L’immagine è troppo pesante. Usa una foto più leggera.' : 'Il testo è troppo lungo. Usa al massimo 100.000 caratteri.' });
      if (error instanceof SyntaxError || error.message === 'bad_body') return reply(res, 400, { error: 'La richiesta non è leggibile. Ricarica la pagina e riprova.' });
      console.error('Admin operation failed:', error.constructor.name);
      return reply(res, 503, { error: FAILURE });
    }
  };
}
