import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { scanRepos } from '../src/lib/git.js';
import { createFixtureWorkspace } from './helpers.js';

test('scanRepos captures git facts and fixture-backed GitHub metadata', () => {
  const workspace = createFixtureWorkspace();
  const repos = scanRepos({
    roots: [workspace.root],
    maxDepth: 2,
    includeHidden: false,
    fixturePath: path.resolve('fixtures/github/sample.json'),
    now: new Date('2026-05-02T00:00:00Z')
  });

  assert.equal(repos.length, 2);

  const alpha = repos.find((repo) => repo.name === 'alpha-app');
  assert.ok(alpha);
  assert.equal(alpha.branch, 'main');
  assert.equal(alpha.dirty, false);
  assert.equal(alpha.ahead, 1);
  assert.equal(alpha.behind, 1);
  assert.equal(alpha.worktreeCount, 2);
  assert.equal(alpha.github?.ci?.status, 'passing');
  assert.equal(alpha.github?.release?.latestTag, 'v1.4.0');

  const beta = repos.find((repo) => repo.name === 'beta-lib');
  assert.ok(beta);
  assert.equal(beta.dirty, true);
  assert.equal(beta.ahead, null);
  assert.equal(beta.behind, null);
  assert.equal(beta.github?.ci?.status, 'failing');
  assert.ok(beta.healthScore < alpha.healthScore);
});
