import { basename } from 'node:path';
import { run } from './exec.js';
import type { RepoBeacon } from './types.js';

function git(repo: string, args: string[]): string {
  const result = run('git', args, repo);
  return result.ok ? result.stdout : '';
}

function parseAheadBehind(value: string): { ahead: number; behind: number } {
  const [ahead = '0', behind = '0'] = value.split('\t');
  return { ahead: Number(ahead) || 0, behind: Number(behind) || 0 };
}

export function collectGit(repo: string): RepoBeacon {
  const branch = git(repo, ['branch', '--show-current']) || 'detached';
  const dirty = git(repo, ['status', '--porcelain']).length > 0;
  const upstream = git(repo, ['rev-parse', '--abbrev-ref', '--symbolic-full-name', '@{u}']);
  const aheadBehind = upstream ? parseAheadBehind(git(repo, ['rev-list', '--left-right', '--count', `${upstream}...HEAD`])) : { ahead: 0, behind: 0 };
  const lastCommit = git(repo, ['log', '-1', '--pretty=%h %s']) || 'no commits';
  const lastCommitDate = git(repo, ['log', '-1', '--pretty=%cI']) || '';
  const worktreeRaw = git(repo, ['worktree', 'list', '--porcelain']);
  const worktreeCount = worktreeRaw.split('\n').filter((line) => line.startsWith('worktree ')).length || 1;
  return { name: basename(repo), path: repo, branch, dirty, ...aheadBehind, lastCommit, lastCommitDate, worktreeCount };
}
