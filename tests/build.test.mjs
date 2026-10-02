import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = fileURLToPath(new URL('..', import.meta.url));

test('failed compilation preserves the existing dist output', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'repobeacon-build-test-'));
  const output = join(directory, 'dist');
  const wrapper = join(directory, 'build.mjs');
  try {
    await mkdir(output);
    await writeFile(join(output, 'previous.js'), 'keep me');
    await writeFile(wrapper, (await readFile(join(root, 'scripts/build.mjs'), 'utf8')).replace(
      "const root = fileURLToPath(new URL('..', import.meta.url));",
      `const root = ${JSON.stringify(root)};`,
    ).replace('const output = join(root, \'dist\');', `const output = ${JSON.stringify(output)};`).replace(
      "join(root, 'tsconfig.build.json')", "join(root, 'tsconfig.build.json') + '.missing'",
    ));
    const result = spawnSync(process.execPath, [wrapper], { cwd: root, encoding: 'utf8' });
    assert.notEqual(result.status, 0);
    assert.equal(await readFile(join(output, 'previous.js'), 'utf8'), 'keep me');
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
