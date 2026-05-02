import test from 'node:test';
import assert from 'node:assert/strict';
import { renderTable } from '../src/renderers/table.js';
import { renderJson } from '../src/renderers/json.js';
import { renderHtml } from '../src/renderers/html.js';
import type { RepoRecord } from '../src/types.js';

const repos: RepoRecord[] = [{
  name: 'alpha-app',
  path: '/tmp/alpha-app',
  branch: 'main',
  dirty: false,
  ahead: 1,
  behind: 0,
  worktreeCount: 2,
  lastCommitSha: 'abc123',
  lastCommitDate: '2026-05-01T00:00:00Z',
  lastCommitRelativeDays: 1,
  beaconStatus: 'passing',
  healthScore: 91,
  github: {
    repo: 'alpha-app',
    ci: { status: 'passing' },
    issues: { open: 2 },
    release: { latestTag: 'v1.0.0', publishedAt: '2026-04-20T00:00:00Z' }
  }
}];

test('table renderer includes the key columns', () => {
  const table = renderTable(repos);
  assert.match(table, /alpha-app/);
  assert.match(table, /ahead\/behind/);
  assert.match(table, /91/);
});

test('json renderer emits repoCount and repos', () => {
  const parsed = JSON.parse(renderJson(repos));
  assert.equal(parsed.repoCount, 1);
  assert.equal(parsed.repos[0].name, 'alpha-app');
});

test('html renderer creates a branded dashboard', () => {
  const html = renderHtml(repos, 'Beacon Board');
  assert.match(html, /Beacon Board/);
  assert.match(html, /Strongest beacon/);
  assert.match(html, /alpha-app/);
});
