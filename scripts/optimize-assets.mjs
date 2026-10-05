import sharp from 'sharp';
import { mkdir, writeFile } from 'node:fs/promises';

const files = ['dove-siamo.png', 'foto.png', 'studio-bg.jpg', 'footer-bg.jpg',
  ...['giuseppe-caruso', 'alfredo-caruso', 'erika-ferone', 'adriano-caruso', 'francesco-conte'].map(name => `prof-${name}.jpg`),
  ...['penale', 'civile', 'commerciale', 'compliance', 'navigazione'].map(name => `services/${name}.png`)];
await mkdir('public/optimized', { recursive: true });
await mkdir('public/social', { recursive: true });
const images = {};
let optimizedBytes = 0;
for (const file of files) {
  const original = `public/assets/${file}`;
  const metadata = await sharp(original).metadata();
  const widths = [...new Set([Math.min(400, metadata.width), Math.min(640, metadata.width), Math.min(1280, metadata.width)])];
  const variants = [];
  for (const width of widths) {
    const path = `/optimized/${file.replace(/\//g, '-').replace(/\.[^.]+$/, '')}-${width}.webp`;
    const info = await sharp(original).rotate().resize({ width, withoutEnlargement: true }).webp({ quality: 80 }).toFile(`public${path}`);
    variants.push({ path, width: info.width, height: info.height, bytes: info.size });
  }
  const largest = variants.at(-1);
  images[`/assets/${file}`] = { src: largest.path, srcSet: variants.map(item => `${item.path} ${item.width}w`).join(', '), width: largest.width, height: largest.height };
  optimizedBytes += largest.bytes;
}
await writeFile('src/data/imageVariants.json', JSON.stringify(images, null, 2) + '\n');
for (const size of [96, 180, 192, 512]) {
  await sharp('public/favicon.svg').resize(size, size).png().toFile(size === 180 ? 'public/apple-touch-icon.png' : `public/favicon-${size}.png`);
}
const logo = await sharp('public/assets/logo-completo.svg', { density: 200 }).resize(690, 240, { fit: 'inside' }).png().toBuffer({ resolveWithObject: true });
const card = Buffer.from(`<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg"><rect width="1200" height="630" fill="#10202C"/><path d="M100 425H1100" stroke="#E98D47" stroke-width="2"/><text x="600" y="490" text-anchor="middle" font-family="sans-serif" font-size="34" fill="#F6F3ED">Studio legale a Pozzuoli</text><text x="600" y="547" text-anchor="middle" font-family="sans-serif" font-size="23" fill="#F6F3ED">Dal 1988 · carusoavvocati.it</text></svg>`);
await sharp(card).composite([{ input: logo.data, top: 115, left: Math.round((1200 - logo.info.width) / 2) }]).png().toFile('public/social/caruso-avvocati.png');
await sharp('public/favicon.svg').resize(512, 512).png().toFile('public/social/logo-caruso.png');
console.log(`Optimized ${files.length} image sources; largest WebP variants total ${Math.round(optimizedBytes / 1024)} KiB.`);
