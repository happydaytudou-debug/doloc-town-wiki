import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import test from 'node:test';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

test('accessibility audit passes contrast, headings, focus, motion, and table safeguards', async () => {
  const { stdout } = await execFileAsync(process.execPath, ['scripts/check-accessibility.mjs']);
  assert.match(stdout, /Accessibility audit passed/);
  assert.match(stdout, /22 pages/);
});
