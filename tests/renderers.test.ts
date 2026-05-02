import test from 'node:test';
import assert from 'node:assert/strict';
import { renderHtml, renderJson, renderTable } from '../src/renderers/index.js';
import type { RepoBeacon } from '../src/types.js';

const repo: RepoBeacon = { name: 'clean-repo', path: '/tmp/clean-repo', branch: 'main', dirty: false, ahead: 1, behind: 0, lastCommit: 'abc initial', lastCommitDate: '2026-01-01T00:00:00Z', worktreeCount: 1, github: { ci: 'passing', openIssues: 2, latestRelease: 'v1.0.0' } };

test('renders terminal table', () => {
  assert.match(renderTable([repo]), /clean-repo/);
});

test('renders json with summary', () => {
  const parsed = JSON.parse(renderJson([repo]));
  assert.equal(parsed.summary.total, 1);
});

test('renders static html dashboard', () => {
  assert.match(renderHtml([repo]), /<!doctype html>/);
  assert.match(renderHtml([repo]), /No network calls/);
});
