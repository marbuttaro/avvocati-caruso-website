import news from './news.json' with { type: 'json' };

// Initial content for local development and static builds. Live news use the API.
export const newsItems = news.articles;
