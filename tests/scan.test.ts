import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { scanRepos } from '../src/lib/git.js';
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import { createFixtureWorkspace } from './helpers.js';
import { loadGithubFixtures } from '../src/lib/github.js';

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

test('scanRepos resolves duplicate basenames by GitHub owner/repository identity', () => {
  const firstWorkspace = createFixtureWorkspace();
  const secondWorkspace = createFixtureWorkspace();
  execFileSync('git', ['remote', 'set-url', 'origin', 'git@github.com:team-one/alpha-app.git'], {
    cwd: firstWorkspace.alpha
  });
  execFileSync('git', ['remote', 'set-url', 'origin', 'https://github.com/team-two/alpha-app.git'], {
    cwd: secondWorkspace.alpha
  });

  const fixturePath = path.join(firstWorkspace.root, 'duplicate-basename-fixture.json');
  writeFileSync(fixturePath, JSON.stringify({
    repos: [
      { repo: 'team-one/alpha-app', issues: { open: 1 } },
      { repo: 'team-two/alpha-app', issues: { open: 2 } },
      { repo: 'alpha-app', issues: { open: 99 } }
    ]
  }), 'utf8');

  const repos = scanRepos({
    roots: [firstWorkspace.root, secondWorkspace.root],
    maxDepth: 2,
    includeHidden: false,
    fixturePath,
    now: new Date('2026-05-02T00:00:00Z')
  });
  const duplicateRepos = repos.filter((repo) => repo.name === 'alpha-app');

  assert.equal(duplicateRepos.length, 2);
  assert.equal(duplicateRepos.find((repo) => repo.path === firstWorkspace.alpha)?.github?.issues?.open, 1);
  assert.equal(duplicateRepos.find((repo) => repo.path === secondWorkspace.alpha)?.github?.issues?.open, 2);
  assert.ok(duplicateRepos.every((repo) => repo.github?.issues?.open !== 99));
});

test('the documented fixture example maps alpha-app health to a scanned repository', () => {
  const docs = readFileSync(path.resolve('docs/github-fixture.md'), 'utf8');
  const documentedJson = docs.match(/```json\n([\s\S]*?)\n```/)?.[1];
  assert.ok(documentedJson, 'expected a JSON example in docs/github-fixture.md');

  const fixturePath = path.join(mkdtempSync(path.join(os.tmpdir(), 'repobeacon-docs-')), 'fixture.json');
  writeFileSync(fixturePath, documentedJson, 'utf8');
  const workspace = createFixtureWorkspace();
  const repos = scanRepos({
    roots: [workspace.root],
    maxDepth: 2,
    includeHidden: false,
    fixturePath,
    now: new Date('2026-05-02T00:00:00Z')
  });

  assert.equal(repos.find((repo) => repo.name === 'alpha-app')?.github?.ci?.status, 'passing');
});

test('loadGithubFixtures reports actionable errors for malformed and wrong-shaped fixtures', () => {
  const directory = mkdtempSync(path.join(os.tmpdir(), 'repobeacon-invalid-fixture-'));
  const malformedPath = path.join(directory, 'malformed.json');
  writeFileSync(malformedPath, '{"repos":', 'utf8');
  assert.throws(
    () => loadGithubFixtures(malformedPath),
    new RegExp(`Invalid GitHub fixture at .*malformed\\.json: expected valid JSON`)
  );

  const wrongShapePath = path.join(directory, 'wrong-shape.json');
  writeFileSync(wrongShapePath, '{"repos":{"alpha-app":{}}}', 'utf8');
  assert.throws(
    () => loadGithubFixtures(wrongShapePath),
    new RegExp(`Invalid GitHub fixture at .*wrong-shape\\.json: expected an object with a "repos" array`)
  );
});
