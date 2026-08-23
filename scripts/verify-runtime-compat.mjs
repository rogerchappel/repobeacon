import { spawnSync } from 'node:child_process';

const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const result = spawnSync(npmCommand, ['test'], {
  encoding: 'utf8',
  env: {
    ...process.env,
    NODE_OPTIONS: [process.env.NODE_OPTIONS, '--throw-deprecation']
      .filter(Boolean)
      .join(' '),
  },
});

process.stdout.write(result.stdout ?? '');
process.stderr.write(result.stderr ?? '');

if (result.error) {
  throw result.error;
}

if (result.status !== 0) {
  process.exit(result.status ?? 1);
}

const output = `${result.stdout ?? ''}\n${result.stderr ?? ''}`;
if (output.includes('DEP0205') || output.includes('module.register() is deprecated')) {
  console.error('Deprecated module.register() loader path detected.');
  process.exit(1);
}
