import { daysBetween } from './time.js';
import type { GithubRepoFixture, RepoRecord } from '../types.js';

export function deriveBeaconStatus(dirty: boolean, github?: GithubRepoFixture): RepoRecord['beaconStatus'] {
  if (github?.ci?.status && github.ci.status !== 'unknown') {
    return github.ci.status;
  }

  if (dirty) {
    return 'mixed';
  }

  return 'unknown';
}

export function computeHealthScore(input: {
  dirty: boolean;
  ahead: number | null;
  behind: number | null;
  lastCommitDate: string;
  github?: GithubRepoFixture;
  now?: Date;
}): number {
  let score = 100;

  if (input.dirty) score -= 12;
  if ((input.behind ?? 0) > 0) score -= Math.min(20, (input.behind ?? 0) * 4);
  if ((input.ahead ?? 0) > 15) score -= 5;

  const staleDays = daysBetween(input.lastCommitDate, input.now);
  if (staleDays > 180) score -= 20;
  else if (staleDays > 90) score -= 10;

  if (input.github?.ci?.status === 'failing') score -= 22;
  if (input.github?.ci?.status === 'mixed') score -= 10;
  if ((input.github?.issues?.urgent ?? 0) > 0) score -= Math.min(20, (input.github?.issues?.urgent ?? 0) * 4);

  const releaseAge = input.github?.release?.publishedAt
    ? daysBetween(input.github.release.publishedAt, input.now)
    : null;
  if (releaseAge !== null && releaseAge > 365) score -= 8;

  return Math.max(0, Math.min(100, score));
}
