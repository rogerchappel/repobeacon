import { readFileSync } from 'node:fs';
import path from 'node:path';
import type { GithubFixtureFile, GithubRepoFixture } from '../types.js';

export function loadGithubFixtures(fixturePath?: string): Map<string, GithubRepoFixture> {
  if (!fixturePath) {
    return new Map();
  }

  const raw = readFileSync(path.resolve(fixturePath), 'utf8');
  const parsed = JSON.parse(raw) as GithubFixtureFile;
  return new Map(parsed.repos.map((repo) => [repo.repo.toLowerCase(), repo]));
}

export function fixtureKeyFromRepoName(name: string): string {
  return name.toLowerCase();
}
