import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const requiredFiles = [
  'dist/cli.js',
  'dist/index.js',
  'fixtures/github/sample.json',
  'docs/github-fixture.md',
  'README.md',
  'LICENSE',
  'SECURITY.md',
  'CHANGELOG.md'
];

const packDirectory = mkdtempSync(path.join(os.tmpdir(), 'repobeacon-pack-'));
const installDirectory = mkdtempSync(path.join(os.tmpdir(), 'repobeacon-install-'));

const run = (command, args, options = {}) => spawnSync(command, args, {
  encoding: 'utf8',
  stdio: ['ignore', 'pipe', 'pipe'],
  ...options
});

const pack = run('npm', ['pack', '--json', '--pack-destination', packDirectory]);

if (pack.status !== 0) {
  process.stderr.write(pack.stderr);
  process.exit(pack.status ?? 1);
}

const [{ files = [], filename } = {}] = JSON.parse(pack.stdout);
const packedPaths = new Set(files.map((file) => file.path));
const missing = requiredFiles.filter((file) => !packedPaths.has(file));

if (missing.length > 0) {
  console.error(`Missing required package files: ${missing.join(', ')}`);
  process.exit(1);
}

try {
  const tarball = path.join(packDirectory, filename);
  const npmCache = path.join(installDirectory, '.npm-cache');
  const env = { ...process.env, npm_config_cache: npmCache };
  const install = run('npm', ['install', '--ignore-scripts', tarball], {
    cwd: installDirectory,
    env
  });
  if (install.status !== 0) {
    process.stderr.write(install.stderr);
    process.exit(install.status ?? 1);
  }

  const installedManifest = JSON.parse(readFileSync(path.join(installDirectory, 'node_modules/repobeacon/package.json'), 'utf8'));
  const binName = Object.keys(installedManifest.bin ?? {})[0];
  const installedBin = path.join(installDirectory, 'node_modules', '.bin', binName);
  const binHelp = run(installedBin, ['--help'], { cwd: installDirectory, env });
  const directHelp = run(process.execPath, [path.join(installDirectory, 'node_modules/repobeacon/dist/cli.js'), '--help'], {
    cwd: installDirectory,
    env
  });

  for (const [label, result] of [['installed bin', binHelp], ['direct entrypoint', directHelp]]) {
    if (result.status !== 0 || !result.stdout.includes('Usage:') || !result.stdout.includes('Options:')) {
      process.stderr.write(`${label} did not print help successfully.\n${result.stderr}${result.stdout}`);
      process.exit(result.status || 1);
    }
  }

  console.log(`Package manifest verified with ${packedPaths.size} files; installed bin and direct entrypoint printed help.`);
} finally {
  rmSync(packDirectory, { recursive: true, force: true });
  rmSync(installDirectory, { recursive: true, force: true });
}
