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
  return new Map(parsed.repos.map((repo) => [repo.repo.toLowerCase(), repo]));
}

export function fixtureKeyFromRepoName(name: string): string {
  return name.toLowerCase();
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
