import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import test from 'node:test';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

test('build validator audits every emitted page and internal link', async () => {
  const { stdout } = await execFileAsync(process.execPath, ['scripts/validate-build.mjs']);
  assert.match(stdout, /22 pages valid/);
  assert.match(stdout, /internal links resolve/);
});
