import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { mkdtempSync } from 'node:fs';
import { run } from '../src/cli.js';
import { createFixtureWorkspace } from './helpers.js';

test('cli writes html and json artifacts', () => {
  const workspace = createFixtureWorkspace();
  const outdir = mkdtempSync(path.join(os.tmpdir(), 'repobeacon-out-'));
  const htmlPath = path.join(outdir, 'dashboard.html');
  const jsonPath = path.join(outdir, 'report.json');

  const result = run([
    '--root', workspace.root,
    '--max-depth', '2',
    '--github-fixture', path.resolve('fixtures/github/sample.json'),
    '--html', htmlPath,
    '--json-out', jsonPath,
    '--title', 'Fixture Beacon'
  ]);

  assert.match(result.stdout, /alpha-app/);
  assert.equal(existsSync(htmlPath), true);
  assert.equal(existsSync(jsonPath), true);
  assert.match(readFileSync(htmlPath, 'utf8'), /Fixture Beacon/);
  const parsed = JSON.parse(readFileSync(jsonPath, 'utf8'));
  assert.equal(parsed.repoCount, 2);
});
