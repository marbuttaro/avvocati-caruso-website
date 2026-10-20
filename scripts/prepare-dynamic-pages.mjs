import { rm } from 'node:fs/promises';
import { join } from 'node:path';

export async function prepareDynamicPages(directory = 'dist') {
  for (const path of ['index.html', 'news.html', 'news', 'sitemap.xml']) {
    await rm(join(directory, path), { recursive: true, force: true });
  }
}
