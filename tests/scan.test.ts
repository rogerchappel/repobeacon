import test from 'node:test';
import assert from 'node:assert/strict';
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { scan } from '../src/scan.js';
import { fixtureRoot, makeRepo } from './helpers.js';

test('scans git repo and reports dirty state', () => {
  const root = fixtureRoot();
  const repo = makeRepo(root, 'dirty-repo');
  writeFileSync(join(repo, 'note.txt'), 'untracked');
  const [beacon] = scan(root, { depth: 1, githubFixtures: 'tests/fixtures/github.json' });
  assert.equal(beacon.name, 'dirty-repo');
  assert.equal(beacon.dirty, true);
  assert.equal(beacon.github?.ci, 'failing');
});
