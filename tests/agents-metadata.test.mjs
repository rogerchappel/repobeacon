import assert from 'node:assert/strict';
import test from 'node:test';
import { validateAgentsMetadata } from '../scripts/validate-agents-metadata.mjs';

const valid = `
- Project: \`repobeacon\`
- Repository: \`rogerchappel/repobeacon\`
- Primary maintainer: \`Roger Chappel\`
- Default branch: \`main\`
- Package manager: \`npm\`
- Branch from the latest \`main\` before editing.
Repo: rogerchappel/repobeacon
`;

test('accepts canonical repobeacon agent metadata', () => {
  assert.deepEqual(validateAgentsMetadata(valid), []);
});

test('rejects stale temporary paths and blank required fields', () => {
  const stale = valid
    .replace('repobeacon`', '.tmp-stackforge/repobeacon`')
    .replace('`rogerchappel/repobeacon`', '``');

  const failures = validateAgentsMetadata(stale);
  assert.ok(failures.some((failure) => failure.includes('.tmp-stackforge')));
  assert.ok(failures.some((failure) => failure.includes('non-empty Repository')));
});
