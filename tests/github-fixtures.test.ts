import test from 'node:test';
import assert from 'node:assert/strict';
import { attachGitHubMetadata, loadGitHubFixtures } from '../src/github-fixtures.js';

test('loads and attaches github fixture metadata', () => {
  const fixtures = loadGitHubFixtures('tests/fixtures/github.json');
  const [repo] = attachGitHubMetadata([{ name: 'clean-repo', path: '/x', branch: 'main', dirty: false, ahead: 0, behind: 0, lastCommit: 'abc', lastCommitDate: '', worktreeCount: 1 }], fixtures);
  assert.equal(repo.github?.ci, 'passing');
  assert.equal(repo.github?.openIssues, 2);
});
