import { spawnSync } from 'node:child_process';

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

const pack = spawnSync('npm', ['pack', '--dry-run', '--json'], {
  encoding: 'utf8',
  stdio: ['ignore', 'pipe', 'pipe']
});

if (pack.status !== 0) {
  process.stderr.write(pack.stderr);
  process.exit(pack.status ?? 1);
}

const [{ files = [] } = {}] = JSON.parse(pack.stdout);
const packedPaths = new Set(files.map((file) => file.path));
const missing = requiredFiles.filter((file) => !packedPaths.has(file));

if (missing.length > 0) {
  console.error(`Missing required package files: ${missing.join(', ')}`);
  process.exit(1);
}

console.log(`Package manifest verified with ${packedPaths.size} files.`);
