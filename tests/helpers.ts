import { execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';

export function createFixtureWorkspace(): { root: string; alpha: string; beta: string } {
  const root = mkdtempSync(path.join(os.tmpdir(), 'repobeacon-'));
  const supportRoot = mkdtempSync(path.join(os.tmpdir(), 'repobeacon-support-'));
  const alpha = createRepo(root, supportRoot, 'alpha-app', {
    commitDate: '2026-04-30T00:00:00Z',
    dirty: false,
    withRemote: true,
    ahead: 2,
    behind: 1,
    extraWorktree: true
  });
  const beta = createRepo(root, supportRoot, 'beta-lib', {
    commitDate: '2025-11-01T00:00:00Z',
    dirty: true,
    withRemote: false,
    ahead: null,
    behind: null,
    extraWorktree: false
  });
  return { root, alpha, beta };
}

type RepoOptions = {
  commitDate: string;
  dirty: boolean;
  withRemote: boolean;
  ahead: number | null;
  behind: number | null;
  extraWorktree: boolean;
};

function createRepo(root: string, supportRoot: string, name: string, options: RepoOptions): string {
  const repo = path.join(root, name);
  mkdirSync(repo, { recursive: true });
  run('git', ['init', '-b', 'main'], repo);
  run('git', ['config', 'user.name', 'repobeacon'], repo);
  run('git', ['config', 'user.email', 'repobeacon@example.test'], repo);
  writeFileSync(path.join(repo, 'README.md'), `# ${name}\n`, 'utf8');
  commitAll(repo, options.commitDate, 'chore: seed repo');

  if (options.withRemote) {
    const bare = path.join(supportRoot, `${name}.remote.git`);
    run('git', ['init', '--bare', bare], supportRoot);
    run('git', ['remote', 'add', 'origin', bare], repo);
    run('git', ['push', '-u', 'origin', 'HEAD:main'], repo);
    run('git', ['symbolic-ref', 'HEAD', 'refs/heads/main'], bare);

    if (options.behind) {
      const clone = path.join(supportRoot, `${name}-clone`);
      run('git', ['clone', bare, clone], supportRoot);
      run('git', ['config', 'user.name', 'repobeacon'], clone);
      run('git', ['config', 'user.email', 'repobeacon@example.test'], clone);
      writeFileSync(path.join(clone, 'remote.txt'), 'remote change\n', 'utf8');
      commitAll(clone, '2026-05-01T00:00:00Z', 'chore: remote change');
      run('git', ['push', 'origin', 'HEAD:main'], clone);
      run('git', ['fetch', 'origin'], repo);
    }

    if (options.ahead) {
      writeFileSync(path.join(repo, 'local.txt'), 'local change\n', 'utf8');
      commitAll(repo, '2026-05-02T00:00:00Z', 'chore: local change');
    }
  }

  if (options.extraWorktree) {
    const worktreePath = path.join(supportRoot, `${name}-wt`);
    run('git', ['worktree', 'add', '-b', 'feature/demo', worktreePath, 'HEAD'], repo);
  }

  if (options.dirty) {
    writeFileSync(path.join(repo, 'dirty.txt'), 'dirty\n', 'utf8');
  }

  return repo;
}

function commitAll(repo: string, date: string, message: string): void {
  run('git', ['add', '.'], repo);
  run('git', ['commit', '-m', message], repo, {
    GIT_AUTHOR_DATE: date,
    GIT_COMMITTER_DATE: date
  });
}

function run(bin: string, args: string[], cwd: string, env: Record<string, string> = {}): string {
  return execFileSync(bin, args, {
    cwd,
    encoding: 'utf8',
    env: {
      ...process.env,
      ...env
    }
  }).trim();
}
