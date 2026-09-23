import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

const root = path.resolve(import.meta.dirname, '..');
const validator = path.join(root, 'scripts', 'validate-release-readiness.mjs');

function validate(mutator) {
  const fixture = fs.mkdtempSync(path.join(os.tmpdir(), 'repobeacon-readiness-'));
  try {
    fs.mkdirSync(path.join(fixture, '.github', 'workflows'), { recursive: true });
    for (const file of ['package.json', 'AGENTS.md']) {
      fs.copyFileSync(path.join(root, file), path.join(fixture, file));
    }
    fs.copyFileSync(
      path.join(root, '.github', 'workflows', 'ci.yml'),
      path.join(fixture, '.github', 'workflows', 'ci.yml'),
    );
    mutator?.(fixture);
    return execFileSync(process.execPath, [validator], { cwd: fixture, encoding: 'utf8' });
  } catch (error) {
    return `${error.stdout ?? ''}${error.stderr ?? ''}`;
  } finally {
    fs.rmSync(fixture, { recursive: true, force: true });
  }
}

test('release readiness accepts the checked-in runtime coverage', () => {
  assert.match(validate(), /Release readiness validation passed/);
});

test('release readiness requires Node 26 coverage', () => {
  const output = validate((fixture) => {
    const workflow = path.join(fixture, '.github', 'workflows', 'ci.yml');
    fs.writeFileSync(workflow, fs.readFileSync(workflow, 'utf8').replace("node-version: '26'", "node-version: '24'"));
  });
  assert.match(output, /CI workflows must test Node 26/);
});

test('release readiness requires the runtime compatibility script and CI invocation', () => {
  const missingScript = validate((fixture) => {
    const packagePath = path.join(fixture, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    delete packageJson.scripts['test:runtime-compat'];
    fs.writeFileSync(packagePath, JSON.stringify(packageJson));
  });
  assert.match(missingScript, /package.json scripts must include test:runtime-compat/);

  const missingInvocation = validate((fixture) => {
    const workflow = path.join(fixture, '.github', 'workflows', 'ci.yml');
    fs.writeFileSync(workflow, fs.readFileSync(workflow, 'utf8').replace('npm run test:runtime-compat', 'npm run release:check'));
  });
  assert.match(missingInvocation, /CI workflows must run npm run test:runtime-compat/);
});
