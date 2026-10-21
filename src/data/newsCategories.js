import initialNews from './news.json' with { type: 'json' };

export const normalizeCategory = value => value.trim().replace(/\s+/g, ' ');
export const categoryKey = value => normalizeCategory(value).toLocaleLowerCase('it');

export function newsCategories(data) {
  const categories = new Map();
  for (const value of [
    ...initialNews.articles.map(article => article.category),
    ...(data.categories || []),
    ...data.articles.map(article => article.category),
  ]) {
    if (typeof value !== 'string' || !value.trim()) continue;
    const key = categoryKey(value);
    if (!categories.has(key)) categories.set(key, normalizeCategory(value));
  }
  return [...categories.values()].sort((a, b) => a.localeCompare(b, 'it'));
}
