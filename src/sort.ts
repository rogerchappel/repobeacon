import type { RepoBeacon, SortMode } from './types.js';

export function sortRepos(repos: RepoBeacon[], mode: SortMode): RepoBeacon[] {
  const copy = [...repos];
  if (mode === 'dirty') return copy.sort((a, b) => Number(b.dirty) - Number(a.dirty) || a.name.localeCompare(b.name));
  if (mode === 'activity') return copy.sort((a, b) => b.lastCommitDate.localeCompare(a.lastCommitDate));
  if (mode === 'issues') return copy.sort((a, b) => (b.github?.openIssues ?? -1) - (a.github?.openIssues ?? -1));
  return copy.sort((a, b) => a.name.localeCompare(b.name));
}
