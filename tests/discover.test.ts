import test from 'node:test';
import assert from 'node:assert/strict';
import { discoverRepos } from '../src/discover.js';
import { fixtureRoot, makeRepo } from './helpers.js';

test('discovers git repositories below root', () => {
  const root = fixtureRoot();
  makeRepo(root, 'clean-repo');
  assert.equal(discoverRepos(root, 1).length, 1);
});
