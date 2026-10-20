import { useEffect, useState } from 'react';
import { newsItems } from './newsData.js';

import { NewsContext } from './news-context.js';

export function NewsProvider({ children, initialNews = newsItems }) {
  const [articles, setArticles] = useState(initialNews);
  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/news', { signal: controller.signal, cache: 'no-store' })
      .then(response => response.ok ? response.json() : Promise.reject())
      .then(data => setArticles(data.articles))
      .catch(() => {}); // Keep server-rendered content if temporarily offline.
    return () => controller.abort();
  }, []);
  return <NewsContext.Provider value={articles}>{children}</NewsContext.Provider>;
}
