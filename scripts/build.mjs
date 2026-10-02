import { mkdtemp, rename, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = fileURLToPath(new URL('..', import.meta.url));
const staging = await mkdtemp(join(tmpdir(), 'repobeacon-build-'));
const output = join(root, 'dist');
const stagedOutput = join(staging, 'dist');
try {
  const result = spawnSync(process.execPath, [
    join(root, 'node_modules/typescript/bin/tsc'), '-p', join(root, 'tsconfig.build.json'), '--outDir', stagedOutput,
  ], { cwd: root, stdio: 'inherit' });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exitCode = result.status ?? 1;
  else {
    const backup = join(staging, 'previous-dist');
    let hadOutput = false;
    try { await rename(output, backup); hadOutput = true; } catch (error) { if (error.code !== 'ENOENT') throw error; }
    try {
      await rename(stagedOutput, output);
      if (hadOutput) await rm(backup, { recursive: true, force: true });
    } catch (error) {
      if (hadOutput) await rename(backup, output);
      throw error;
    }
  }
} finally {
  await rm(staging, { recursive: true, force: true });
}
