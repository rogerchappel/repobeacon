import test from 'node:test';
import assert from 'node:assert/strict';
import { sortRepos } from '../src/sort.js';
import type { RepoBeacon } from '../src/types.js';

const base: RepoBeacon = { name: 'a', path: '/a', branch: 'main', dirty: false, ahead: 0, behind: 0, lastCommit: 'x', lastCommitDate: '2026-01-01T00:00:00Z', worktreeCount: 1 };

test('sorts dirty repositories first', () => {
  const repos = [base, { ...base, name: 'b', dirty: true }];
  assert.equal(sortRepos(repos, 'dirty')[0].name, 'b');
});

test('sorts by issue count', () => {
  const repos = [{ ...base, name: 'a', github: { openIssues: 1 } }, { ...base, name: 'b', github: { openIssues: 9 } }];
  assert.equal(sortRepos(repos, 'issues')[0].name, 'b');
});
