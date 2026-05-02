import type { RepoBeacon } from '../types.js';

const columns = ['repo', 'branch', 'dirty', 'ahead', 'behind', 'worktrees', 'ci', 'issues', 'release', 'last commit'] as const;

function cell(repo: RepoBeacon, column: (typeof columns)[number]): string {
  if (column === 'repo') return repo.name;
  if (column === 'branch') return repo.branch;
  if (column === 'dirty') return repo.dirty ? 'yes' : 'no';
  if (column === 'ahead') return String(repo.ahead);
  if (column === 'behind') return String(repo.behind);
  if (column === 'worktrees') return String(repo.worktreeCount);
  if (column === 'ci') return repo.github?.ci ?? 'n/a';
  if (column === 'issues') return repo.github?.openIssues == null ? 'n/a' : String(repo.github.openIssues);
  if (column === 'release') return repo.github?.latestRelease ?? 'n/a';
  return repo.lastCommit;
}

export function renderTable(repos: RepoBeacon[]): string {
  const rows = repos.map((repo) => columns.map((column) => cell(repo, column)));
  const widths = columns.map((column, index) => Math.max(column.length, ...rows.map((row) => row[index].length)));
  const format = (row: string[]) => row.map((value, index) => value.padEnd(widths[index])).join('  ');
  return [format([...columns]), format(widths.map((width) => '-'.repeat(width))), ...rows.map(format)].join('\n');
}
