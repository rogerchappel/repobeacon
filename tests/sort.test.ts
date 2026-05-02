import test from 'node:test';
import assert from 'node:assert/strict';
import { sortRepos } from '../src/lib/sort.js';
import type { RepoRecord } from '../src/types.js';

const repos: RepoRecord[] = [
  { name: 'b', path: '/b', branch: 'main', dirty: false, ahead: 0, behind: 0, worktreeCount: 1, lastCommitSha: '111', lastCommitDate: '2026-05-01T00:00:00Z', lastCommitRelativeDays: 1, beaconStatus: 'passing', healthScore: 88 },
  { name: 'a', path: '/a', branch: 'main', dirty: true, ahead: 0, behind: 2, worktreeCount: 1, lastCommitSha: '222', lastCommitDate: '2026-04-01T00:00:00Z', lastCommitRelativeDays: 31, beaconStatus: 'failing', healthScore: 44 },
  { name: 'c', path: '/c', branch: 'main', dirty: false, ahead: 1, behind: 0, worktreeCount: 2, lastCommitSha: '333', lastCommitDate: '2026-05-02T00:00:00Z', lastCommitRelativeDays: 0, beaconStatus: 'unknown', healthScore: 77 }
];

test('sortRepos sorts by health by default semantics', () => {
  assert.deepEqual(sortRepos(repos, 'health').map((repo) => repo.name), ['b', 'c', 'a']);
});

test('sortRepos sorts by recent and by name', () => {
  assert.deepEqual(sortRepos(repos, 'recent').map((repo) => repo.name), ['c', 'b', 'a']);
  assert.deepEqual(sortRepos(repos, 'name').map((repo) => repo.name), ['a', 'b', 'c']);
});
