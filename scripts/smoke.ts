import { mkdtempSync, readFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import assert from 'node:assert/strict';
import { run } from '../src/cli.js';
import { createFixtureWorkspace } from '../tests/helpers.js';

const workspace = createFixtureWorkspace();
const outdir = mkdtempSync(path.join(os.tmpdir(), 'repobeacon-smoke-'));
const htmlPath = path.join(outdir, 'dashboard.html');
const jsonPath = path.join(outdir, 'report.json');
const result = run([
  '--root', workspace.root,
  '--max-depth', '2',
  '--github-fixture', path.resolve('fixtures/github/sample.json'),
  '--html', htmlPath,
  '--json-out', jsonPath,
  '--sort', 'health',
  '--title', 'Smoke Beacon'
]);

assert.match(result.stdout, /alpha-app/);
assert.match(readFileSync(htmlPath, 'utf8'), /Smoke Beacon/);
const report = JSON.parse(readFileSync(jsonPath, 'utf8'));
assert.equal(report.repoCount, 2);
console.log('repobeacon smoke passed');
