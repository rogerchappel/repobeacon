import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { run } from '../src/exec.js';

export function fixtureRoot(): string {
  return mkdtempSync(join(tmpdir(), 'repobeacon-'));
}

export function makeRepo(root: string, name: string): string {
  const repo = join(root, name);
  run('git', ['init', repo], root);
  run('git', ['config', 'user.name', 'Test User'], repo);
  run('git', ['config', 'user.email', 'test@example.com'], repo);
  writeFileSync(join(repo, 'README.md'), `# ${name}\n`);
  run('git', ['add', 'README.md'], repo);
  run('git', ['commit', '-m', 'initial commit'], repo);
  return repo;
}
