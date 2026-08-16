import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const readJson = async (path) => JSON.parse(await readFile(path, 'utf8'));

test('project exposes the complete local verification workflow', async () => {
  const manifest = await readJson(new URL('../package.json', import.meta.url));
  assert.deepEqual(Object.keys(manifest.scripts).sort(), [
    'build',
    'check',
    'check:a11y',
    'check:preview',
    'dev',
    'preview',
    'test',
    'validate:build',
    'validate:content',
    'verify',
  ]);
});

test('site matrix has the final four categories and sixteen unique guides', async () => {
  const matrix = await readJson(new URL('../src/data/site-matrix.json', import.meta.url));
  assert.deepEqual(
    matrix.categories.map(({ id, slug, guides }) => [id, slug, guides.length]),
    [
      ['guides', 'guides', 3],
      ['farming', 'farming', 6],
      ['characters-items', 'characters-items', 5],
      ['map-quests', 'map-quests', 2],
    ],
  );
  const guides = matrix.categories.flatMap((category) => category.guides);
  assert.equal(guides.length, 16);
  assert.equal(new Set(guides.map(({ id }) => id)).size, 16);
  assert.equal(new Set(guides.map(({ slug }) => slug)).size, 16);
  assert.ok(guides.every(({ verificationStatus }) => verificationStatus === 'Needs Verification'));
});
