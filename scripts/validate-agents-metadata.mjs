const expectedFields = new Map([
  ['Project', 'repobeacon'],
  ['Repository', 'rogerchappel/repobeacon'],
  ['Primary maintainer', 'Roger Chappel'],
  ['Default branch', 'main'],
  ['Package manager', 'npm'],
]);

export function validateAgentsMetadata(content) {
  const failures = [];

  if (/\.tmp-stackforge(?:\/|`)/.test(content)) {
    failures.push('AGENTS.md must not reference a .tmp-stackforge path');
  }

  for (const [field, expected] of expectedFields) {
    const match = content.match(new RegExp(`^- ${field}: \\x60([^\\x60]*)\\x60$`, 'm'));
    if (!match?.[1]) {
      failures.push(`AGENTS.md must declare a non-empty ${field} field`);
    } else if (match[1] !== expected) {
      failures.push(`AGENTS.md ${field} must be ${expected}`);
    }
  }

  if (!content.includes('Branch from the latest `main` before editing.')) {
    failures.push('AGENTS.md branch policy must name the main branch');
  }
  if (!content.includes('Repo: rogerchappel/repobeacon')) {
    failures.push('AGENTS.md Review Pack must name rogerchappel/repobeacon');
  }

  return failures;
}
