import { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { getPage, renderSeoHead, breadcrumbs } from './site.js';
import { useNews } from '../data/news-context.js';

export function Seo() {
  const { pathname } = useLocation();
  const newsItems = useNews();
  useEffect(() => {
    const template = document.createElement('template');
    template.innerHTML = renderSeoHead(getPage(pathname, newsItems));
    document.head.querySelectorAll('[data-seo]').forEach(node => node.remove());
    document.head.append(template.content);
  }, [pathname, newsItems]);
  return null;
}

export function Breadcrumbs() {
  const { pathname } = useLocation();
  const newsItems = useNews();
  const page = getPage(pathname, newsItems);
  if (page.noindex || page.path === '/') return null;
  return <nav aria-label="Percorso di navigazione" className="breadcrumbs container visually-hidden"><ol>
    {breadcrumbs(page).map((item, index, trail) => <li key={item.path}>
      {index === trail.length - 1 ? <span aria-current="page">{item.label}</span> : <Link to={item.path}>{item.label}</Link>}
    </li>)}
  </ol></nav>;
}
