import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, symlinkSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import os from 'node:os';
import path from 'node:path';
import { mkdtempSync } from 'node:fs';
import { isMainEntrypoint, run } from '../src/cli.js';
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

test('cli rejects invalid numeric and enum options before scanning', () => {
  assert.throws(
    () => run(['--max-depth', '0']),
    /--max-depth must be a positive integer/
  );
  assert.throws(
    () => run(['--limit', 'many']),
    /--limit must be a positive integer/
  );
  assert.throws(
    () => run(['--format', 'yaml']),
    /--format must be one of: table, json, html/
  );
  assert.throws(
    () => run(['--sort', 'stars']),
    /--sort must be one of: health, recent, name/
  );
});

test('entrypoint detection accepts direct and symlinked npm-bin paths', () => {
  const workspace = mkdtempSync(path.join(os.tmpdir(), 'repobeacon-entrypoint-'));
  const entrypoint = path.join(workspace, 'cli.js');
  const binPath = path.join(workspace, 'repobeacon');
  writeFileSync(entrypoint, '#!/usr/bin/env node\n');
  symlinkSync(entrypoint, binPath);

  const moduleUrl = pathToFileURL(entrypoint).href;
  assert.equal(isMainEntrypoint(moduleUrl, entrypoint), true);
  assert.equal(isMainEntrypoint(moduleUrl, binPath), true);
  assert.equal(isMainEntrypoint(moduleUrl, path.join(workspace, 'other.js')), false);
  assert.equal(isMainEntrypoint(moduleUrl, undefined), false);
});
