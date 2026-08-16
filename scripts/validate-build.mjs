import assert from 'node:assert/strict';
import { access, readFile, readdir } from 'node:fs/promises';
import { relative, sep } from 'node:path';

const dist = new URL('../dist/', import.meta.url);
const walk = async (directory) => {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map((entry) => entry.isDirectory() ? walk(new URL(`${entry.name}/`, directory)) : [new URL(entry.name, directory)]));
  return nested.flat();
};

const files = (await walk(dist)).filter((url) => url.pathname.endsWith('.html'));
assert.equal(files.length, 22, `expected 22 emitted HTML pages, found ${files.length}`);
const titles = new Set();
const descriptions = new Set();
let linkCount = 0;

for (const file of files) {
  const html = await readFile(file, 'utf8');
  const filePath = file.pathname.split(sep).join('/');
  const relativePath = relative(dist.pathname, file.pathname).split(sep).join('/');
  const pagePath = relativePath === 'index.html' ? '/' : relativePath === '404.html' ? '/404.html' : `/${relativePath.replace(/index\.html$/, '')}`;
  assert.match(html, /<html lang="en"/, `${relativePath}: missing English language`);
  assert.equal((html.match(/<h1(?:\s[^>]*)?>/g) ?? []).length, 1, `${relativePath}: expected one H1`);
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
  const description = html.match(/<meta name="description" content="([^"]+)"/)?.[1];
  assert.ok(title, `${relativePath}: missing title`);
  assert.ok(description, `${relativePath}: missing description`);
  assert.ok(!titles.has(title), `${relativePath}: duplicate title ${title}`);
  assert.ok(!descriptions.has(description), `${relativePath}: duplicate description`);
  titles.add(title);
  descriptions.add(description);

  const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]));
  for (const match of html.matchAll(/<a\b([^>]*?)href="([^"]+)"([^>]*)>/g)) {
    const [, before, href, after] = match;
    if (/^(mailto:|tel:|javascript:)/.test(href)) continue;
    const target = new URL(href, `https://local.invalid${pagePath}`);
    if (target.hostname !== 'local.invalid') {
      assert.match(`${before}${after}`, /target="_blank"/, `${relativePath}: external link must open safely`);
      assert.match(`${before}${after}`, /rel="noopener noreferrer"/, `${relativePath}: external link missing safe rel`);
      continue;
    }
    const outputPath = target.pathname.endsWith('/') ? `${target.pathname}index.html` : target.pathname;
    const targetFile = new URL(`.${outputPath}`, dist);
    await access(targetFile).catch(() => assert.fail(`${filePath}: broken internal link ${href}`));
    if (target.hash) {
      const targetHtml = target.pathname === new URL(`https://local.invalid${pagePath}`).pathname ? html : await readFile(targetFile, 'utf8');
      const targetIds = targetHtml === html ? ids : new Set([...targetHtml.matchAll(/\sid="([^"]+)"/g)].map((item) => item[1]));
      assert.ok(targetIds.has(decodeURIComponent(target.hash.slice(1))), `${relativePath}: unresolved fragment ${href}`);
    }
    linkCount += 1;
  }
}

console.log(`22 pages valid: unique SEO, one H1 each, and ${linkCount} internal links resolve`);
