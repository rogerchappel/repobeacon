import type { RepoRecord } from '../types.js';

export function renderJson(repos: RepoRecord[]): string {
  return JSON.stringify({
    generatedAt: new Date().toISOString(),
    repoCount: repos.length,
    repos
  }, null, 2);
}
