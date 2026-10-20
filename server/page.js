import { getPage, getPages, renderSeoHead, SITE_URL, escapeHtml } from '../src/seo/site.js';
import { createNewsStore } from './news-store.js';

export function createPageHandler({ render, template, env = process.env, store = createNewsStore(env) }) {
  return async (req, res) => {
    if (!['GET', 'HEAD'].includes(req.method)) { res.writeHead(405, { Allow: 'GET, HEAD' }); return res.end(); }
    const url = new URL(req.url, 'http://localhost');
    const path = url.searchParams.get('path') || url.pathname;
    if (path !== '/' && path !== '/news' && path !== '/sitemap.xml' && !/^\/news\/[^/]+$/.test(path)) { res.writeHead(404); return res.end(); }
    try {
      const { data } = await store.read();
      if (path === '/sitemap.xml') {
        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${getPages(data.articles).map(page => `  <url><loc>${escapeHtml(SITE_URL + page.path)}</loc></url>`).join('\n')}\n</urlset>\n`;
        res.writeHead(200, { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'no-store' });
        return res.end(req.method === 'HEAD' ? undefined : sitemap);
      }
      const page = getPage(path, data.articles);
      const seo = renderSeoHead(env.VERCEL_ENV === 'preview' ? { ...page, noindex: true } : page);
      const html = (await template()).replace(/<!--seo:start-->[\s\S]*?<!--seo:end-->/, () => `<!--seo:start-->\n${seo}\n<!--seo:end-->`)
        .replace('<div id="root"></div>', () => `<div id="root">${render(path, data.articles)}</div><script id="news-data" type="application/json">${JSON.stringify(data.articles).replace(/</g, '\\u003c')}</script>`);
      res.writeHead(page.noindex ? 404 : 200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' });
      return res.end(req.method === 'HEAD' ? undefined : html);
    } catch (error) {
      console.error('News rendering failed:', error.constructor.name);
      res.writeHead(503, { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store', 'Retry-After': '30' });
      return res.end('Le news non sono disponibili. Riprova tra poco.');
    }
  };
}
