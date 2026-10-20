import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { render } from '../.prerender/entry-server.js';
import { createPageHandler } from '../server/page.js';

const template = () => readFile(join(process.cwd(), '.prerender/template.html'), 'utf8');
export default createPageHandler({ render, template });
