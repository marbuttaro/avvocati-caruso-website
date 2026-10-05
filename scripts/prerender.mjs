import { readFile, writeFile, mkdir, rm } from 'node:fs/promises';
import { dirname } from 'node:path';
import { render } from '../.prerender/entry-server.js';
import { pages, getPage, renderSeoHead, SITE_URL, escapeHtml } from '../src/seo/site.js';

const template = await readFile('dist/index.html', 'utf8');
const isPreview = process.env.VERCEL_ENV === 'preview';
for (const page of [...pages, getPage('/404')]) {
  const seo = renderSeoHead(isPreview ? { ...page, noindex: true } : page);
  const html = template.replace(/<!--seo:start-->[\s\S]*?<!--seo:end-->/, `<!--seo:start-->\n${seo}\n<!--seo:end-->`)
    .replace('<div id="root"></div>', `<div id="root">${render(page.path)}</div>`);
  const file = page.path === '/' ? 'dist/index.html' : `dist${page.path}.html`;
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, html);
}
// No guessed lastmod dates: a build timestamp is not a content revision date.
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages.map(page => `  <url><loc>${escapeHtml(SITE_URL + page.path)}</loc></url>`).join('\n')}\n</urlset>\n`;
await writeFile('dist/sitemap.xml', sitemap);
await writeFile('dist/robots.txt', isPreview ? 'User-agent: *\nDisallow: /\n' : `User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${SITE_URL}/sitemap.xml\n`);
await writeFile('dist/site.webmanifest', JSON.stringify({ name: 'Caruso Avvocati', short_name: 'Caruso Avvocati', lang: 'it', start_url: '/', display: 'browser', theme_color: '#1C2E4A', background_color: '#F6F3ED', icons: [{ src: '/favicon-192.png', sizes: '192x192', type: 'image/png' }, { src: '/favicon-512.png', sizes: '512x512', type: 'image/png' }] }, null, 2));
await rm('.prerender', { recursive: true, force: true });
console.log(`Generated ${pages.length} indexable HTML pages, 404, sitemap, robots and web manifest.`);
