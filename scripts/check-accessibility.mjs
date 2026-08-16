import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');
const css = `${await read('src/styles/global.css')}\n${await read('src/styles/navigation.css')}\n${await read('src/styles/accessibility.css')}`;
const token = (name) => [...css.matchAll(new RegExp(`--${name}:\\s*(#[0-9a-f]{6})`, 'gi'))].at(-1)?.[1].slice(1);
const luminance = (hex) => {
  const channels = hex.match(/../g).map((value) => Number.parseInt(value, 16) / 255).map((value) => value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4);
  return .2126 * channels[0] + .7152 * channels[1] + .0722 * channels[2];
};
const contrast = (foreground, background) => {
  const values = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
  return (values[0] + .05) / (values[1] + .05);
};

for (const [foreground, background, label] of [
  [token('ink'), token('sand'), 'body text'],
  [token('muted'), token('sand'), 'muted text'],
  [token('rust'), token('sand'), 'rust accent text'],
  [token('amber'), token('paper'), 'verification text'],
  ['ffffff', token('rust'), 'primary button text'],
]) assert.ok(contrast(foreground, background) >= 4.5, `${label} contrast is below 4.5:1`);

assert.match(css, /:focus-visible/);
assert.match(css, /prefers-reduced-motion\s*:\s*reduce/);
const table = await read('src/components/DataTable.astro');
assert.match(table, /<caption>/);
assert.match(table, /class="table-scroll" tabindex="0"/);

const walk = async (directory) => (await Promise.all((await readdir(directory, { withFileTypes: true })).map((entry) => entry.isDirectory() ? walk(new URL(`${entry.name}/`, directory)) : [new URL(entry.name, directory)]))).flat();
const pages = (await walk(new URL('../dist/', import.meta.url))).filter((file) => file.pathname.endsWith('.html'));
assert.equal(pages.length, 22);
for (const page of pages) {
  const html = await readFile(page, 'utf8');
  const levels = [...html.matchAll(/<h([1-6])(?:\s[^>]*)?>/g)].map((match) => Number(match[1]));
  assert.equal(levels.filter((level) => level === 1).length, 1, `${page.pathname}: expected one H1`);
  for (let index = 1; index < levels.length; index += 1) assert.ok(levels[index] <= levels[index - 1] + 1, `${page.pathname}: heading level jumps from H${levels[index - 1]} to H${levels[index]}`);
}

console.log('Accessibility audit passed: contrast, headings on 22 pages, focus, reduced motion, and responsive table safeguards');
