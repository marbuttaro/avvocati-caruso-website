import { createNewsStore } from './news-store.js';
import { reply } from './http.js';
export function createNewsHandler({ env = process.env, store = createNewsStore(env) } = {}) {
  return async (req, res) => {
    if (!['GET', 'HEAD'].includes(req.method)) return reply(res, 405, { error: 'Metodo non consentito.' }, { Allow: 'GET, HEAD' });
    try {
      const { data } = await store.read();
      return reply(res, 200, { articles: data.articles });
    } catch {
      return reply(res, 503, { error: 'Le news non sono disponibili. Riprova tra poco.' });
    }
  };
}
