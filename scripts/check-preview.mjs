import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const port = process.env.PREVIEW_PORT || '4321';
const origin = `http://127.0.0.1:${port}`;
const matrix = JSON.parse(await readFile(new URL('../src/data/site-matrix.json', import.meta.url), 'utf8'));
const routes = [
  '/',
  ...matrix.categories.map((category) => `/${category.slug}/`),
  ...matrix.categories.flatMap((category) => category.guides.map((guide) => `/${category.slug}/${guide.slug}/`)),
];

for (const route of routes) {
  const response = await fetch(`${origin}${route}`);
  assert.equal(response.status, 200, `${route} must return 200`);
  assert.match(response.headers.get('content-type') ?? '', /text\/html/, `${route} must return HTML`);
  assert.match(await response.text(), /<main id="main-content">/, `${route} must return the production page`);
}

for (const route of ['/robots.txt', '/sitemap-index.xml', '/sitemap-0.xml']) {
  const response = await fetch(`${origin}${route}`);
  assert.equal(response.status, 200, `${route} must return 200`);
  assert.ok((await response.text()).length > 20, `${route} must not be empty`);
}

const home = await fetch(`${origin}/`).then((response) => response.text());
const assetPath = home.match(/(?:href|src)="(\/_astro\/[^"]+)"/)?.[1];
assert.ok(assetPath, 'homepage must reference a built static asset');
assert.equal((await fetch(`${origin}${assetPath}`)).status, 200, 'built static asset must return 200');

const slashResponse = await fetch(`${origin}/guides`, { redirect: 'manual' });
assert.equal(slashResponse.status, 404, '/guides without its configured trailing slash must not duplicate /guides/');

const missing = await fetch(`${origin}/definitely-not-a-real-page/`);
assert.equal(missing.status, 404, 'unknown path must return 404');
assert.match(await missing.text(), /Page not found/);

console.log(`Production preview audit passed: ${routes.length} content routes, robots, sitemaps, asset, strict trailing slashes, and custom 404`);
