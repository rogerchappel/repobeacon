import { pad } from '../lib/format.js';
import { relativeDaysLabel } from '../lib/time.js';
import type { RepoRecord } from '../types.js';

export function renderTable(repos: RepoRecord[]): string {
  const headers = ['repo', 'branch', 'dirty', 'ahead/behind', 'last commit', 'worktrees', 'ci', 'issues', 'release', 'score'];
  const rows = repos.map((repo) => [
    repo.name,
    repo.branch,
    repo.dirty ? 'yes' : 'no',
    `${repo.ahead ?? '-'}↑ ${repo.behind ?? '-'}↓`,
    relativeDaysLabel(repo.lastCommitRelativeDays),
    String(repo.worktreeCount),
    repo.github?.ci?.status ?? 'n/a',
    repo.github?.issues ? `${repo.github.issues.open} open` : 'n/a',
    repo.github?.release?.latestTag ?? 'n/a',
    String(repo.healthScore)
  ]);
  const widths = headers.map((header, index) => Math.max(header.length, ...rows.map((row) => row[index].length)));

  const lines = [
    headers.map((header, index) => pad(header, widths[index])).join('  '),
    headers.map((_, index) => '-'.repeat(widths[index])).join('  '),
    ...rows.map((row) => row.map((cell, index) => pad(cell, widths[index])).join('  '))
  ];

  return lines.join('\n');
}
