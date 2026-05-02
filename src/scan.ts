import { discoverRepos } from './discover.js';
import { collectGit } from './git.js';
import { attachGitHubMetadata, loadGitHubFixtures } from './github-fixtures.js';
import type { RepoBeacon, ScanOptions } from './types.js';

export function scan(root: string, options: ScanOptions): RepoBeacon[] {
  const repos = discoverRepos(root, options.depth).map(collectGit);
  return attachGitHubMetadata(repos, loadGitHubFixtures(options.githubFixtures));
}
