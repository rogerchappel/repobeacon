import { readFileSync } from 'node:fs';
import path from 'node:path';
import type { GithubFixtureFile, GithubRepoFixture } from '../types.js';

export function loadGithubFixtures(fixturePath?: string): Map<string, GithubRepoFixture> {
  if (!fixturePath) {
    return new Map();
  }

  const resolvedPath = path.resolve(fixturePath);
  const raw = readFileSync(resolvedPath, 'utf8');
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch (error) {
    const detail = error instanceof Error ? `: ${error.message}` : '';
    throw new Error(`Invalid GitHub fixture at ${resolvedPath}: expected valid JSON${detail}`);
  }

  assertGithubFixtureFile(parsed, resolvedPath);
  const fixtures = new Map<string, GithubRepoFixture>();
  for (const repo of parsed.repos) {
    const key = fixtureKey(repo.repo);
    if (fixtures.has(key)) {
      throw new Error(`Invalid GitHub fixture at ${resolvedPath}: duplicate repository identity "${repo.repo}"`);
    }
    fixtures.set(key, repo);
  }
  return fixtures;
}

export function fixtureKey(value: string): string {
  return value.trim().replace(/\\/g, '/').replace(/^github\.com\//i, '').replace(/\.git$/i, '').toLowerCase();
}

export function githubSlugFromRemote(remoteUrl: string | null): string | null {
  if (!remoteUrl) {
    return null;
  }

  const match = remoteUrl.match(/github\.com[/:]([^/]+\/[^/]+?)(?:\.git)?$/i);
  return match?.[1] ? fixtureKey(match[1]) : null;
}

function assertGithubFixtureFile(value: unknown, fixturePath: string): asserts value is GithubFixtureFile {
  if (!isRecord(value) || !Array.isArray(value.repos)) {
    throw new Error(
      `Invalid GitHub fixture at ${fixturePath}: expected an object with a "repos" array`
    );
  }

  value.repos.forEach((repo, index) => {
    if (!isRecord(repo) || typeof repo.repo !== 'string' || repo.repo.trim() === '') {
      throw new Error(
        `Invalid GitHub fixture at ${fixturePath}: expected repos[${index}].repo to be a non-empty string`
      );
    }
  });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
