import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import test from 'node:test';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

test('content validation requires the complete sixteen-entry collection', async () => {
  const { stdout } = await execFileAsync(process.execPath, ['scripts/validate-content.mjs']);
  assert.match(stdout, /16 guide entries valid/);
  assert.match(stdout, /no orphan sources/);
  assert.match(stdout, /all sources remain Discovery Only/);
});
