import type { RepoBeacon } from './types.js';

export function summarize(repos: RepoBeacon[]) {
  return {
    total: repos.length,
    dirty: repos.filter((repo) => repo.dirty).length,
    behind: repos.filter((repo) => repo.behind > 0).length,
    ciFailing: repos.filter((repo) => repo.github?.ci === 'failing').length,
    openIssues: repos.reduce((sum, repo) => sum + (repo.github?.openIssues ?? 0), 0)
  };
}
