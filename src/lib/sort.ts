import type { CliOptions, RepoRecord } from '../types.js';

export function sortRepos(repos: RepoRecord[], sortBy: CliOptions['sortBy']): RepoRecord[] {
  const copy = [...repos];

  switch (sortBy) {
    case 'name':
      return copy.sort((a, b) => a.name.localeCompare(b.name));
    case 'recent':
      return copy.sort((a, b) => a.lastCommitRelativeDays - b.lastCommitRelativeDays || a.name.localeCompare(b.name));
    case 'health':
    default:
      return copy.sort((a, b) => b.healthScore - a.healthScore || a.lastCommitRelativeDays - b.lastCommitRelativeDays || a.name.localeCompare(b.name));
  }
}
