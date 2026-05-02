import { readFileSync } from 'node:fs';
import type { GitHubMetadata, RepoBeacon } from './types.js';

type FixtureFile = Record<string, GitHubMetadata> | { repos: Record<string, GitHubMetadata> };

export function loadGitHubFixtures(file?: string): Map<string, GitHubMetadata> {
  if (!file) return new Map();
  const parsed = JSON.parse(readFileSync(file, 'utf8')) as FixtureFile;
  const repos = 'repos' in parsed ? parsed.repos : parsed;
  return new Map(Object.entries(repos));
}

export function attachGitHubMetadata(repos: RepoBeacon[], fixtures: Map<string, GitHubMetadata>): RepoBeacon[] {
  return repos.map((repo) => {
    const metadata = fixtures.get(repo.name) ?? [...fixtures.entries()].find(([key]) => key.endsWith(`/${repo.name}`))?.[1];
    return metadata ? { ...repo, github: metadata } : repo;
  });
}
