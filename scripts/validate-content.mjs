import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const matrix = JSON.parse(await readFile(new URL('src/data/site-matrix.json', root), 'utf8'));
const expected = matrix.categories.flatMap((category) => category.guides.map((guide) => ({ ...guide, category: category.id })));
const contentDir = new URL('src/content/guides/', root);
let files = [];
try { files = (await readdir(contentDir)).filter((file) => file.endsWith('.mdx')).sort(); } catch {}

const allowEmpty = process.argv.includes('--allow-empty');
if (allowEmpty && files.length === 0) {
  console.log('Content collection empty at scaffolding checkpoint; matrix remains valid.');
  process.exit(0);
}

assert.equal(files.length, 16, `expected 16 MDX guide entries, found ${files.length}`);
const records = [];
for (const file of files) {
  const source = await readFile(new URL(file, contentDir), 'utf8');
  const frontmatter = source.match(/^---\n([\s\S]*?)\n---/)?.[1];
  assert.ok(frontmatter, `${file}: missing frontmatter`);
  const publicBody = source.slice(source.indexOf('\n---', 4) + 4);
  const field = (name) => frontmatter.match(new RegExp(`^${name}:\\s*(.+)$`, 'm'))?.[1]?.trim();
  const id = field('id');
  const related = (field('relatedGuides')?.match(/^\[(.*)\]$/)?.[1] ?? '').split(',').map((item) => item.trim()).filter(Boolean);
  const sourceRecords = [...frontmatter.matchAll(/^\s+- \{ id: ([A-Z][A-Z0-9-]*)\b([^\n]*)\}$/gm)];
  const sourceIds = sourceRecords.map((match) => match[1]);
  const refs = [...source.matchAll(/<SourceRef id="([A-Z][A-Z0-9-]*)"\s*\/>/g)].map((match) => match[1]);
  assert.ok(sourceIds.length > 0, `${file}: at least one source is required`);
  assert.equal(new Set(sourceIds).size, sourceIds.length, `${file}: duplicate source IDs`);
  assert.ok(refs.every((ref) => sourceIds.includes(ref)), `${file}: unresolved SourceRef`);
  assert.deepEqual(new Set(refs), new Set(sourceIds), `${file}: orphan source without SourceRef`);
  assert.ok(sourceRecords.every((match) => match[2].includes('verificationStatus: Discovery Only')), `${file}: source status was upgraded without claim-level evidence`);
  assert.equal(field('verificationStatus'), 'Needs Verification', `${file}: unsupported verification status`);
  assert.doesNotMatch(source, /Lorem ipsum|TODO|TBD|Coming Soon|redeem code|redemption code/i, `${file}: prohibited placeholder or codes content`);
  assert.doesNotMatch(publicBody, /Needs Verification|Topics awaiting verification|What this first edition can establish|supplied research|this edition does not prescribe|still require exact source verification|no claim-level source|Verified Sources|Sources for Verification/i, `${file}: production-style source language must not appear in public copy`);
  records.push({ file, id, slug: field('slug'), category: field('category'), priority: Number(field('priority')), related });
}

assert.equal(new Set(records.map(({ id }) => id)).size, 16, 'guide IDs must be unique');
assert.equal(new Set(records.map(({ slug }) => slug)).size, 16, 'guide slugs must be unique');
const ids = new Set(records.map(({ id }) => id));
for (const record of records) {
  const planned = expected.find(({ id }) => id === record.id);
  assert.ok(planned, `${record.file}: unknown guide ID ${record.id}`);
  assert.equal(record.slug, planned.slug, `${record.file}: slug differs from matrix`);
  assert.equal(record.category, planned.category, `${record.file}: category differs from matrix`);
  assert.equal(record.priority, planned.priority, `${record.file}: priority differs from matrix`);
  assert.ok(record.related.every((id) => ids.has(id) && id !== record.id), `${record.file}: invalid related guide`);
}

console.log('16 guide entries valid: matrix, relationships, citations, no orphan sources, and all sources remain Discovery Only');
