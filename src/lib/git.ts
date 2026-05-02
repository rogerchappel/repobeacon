import { existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fixtureKeyFromRepoName, loadGithubFixtures } from './github.js';
import { deriveBeaconStatus, computeHealthScore } from './score.js';
import { walkDirectories } from './fs.js';
import { daysBetween } from './time.js';
import type { RepoRecord, RepoScanOptions } from '../types.js';

export function scanRepos(options: RepoScanOptions): RepoRecord[] {
  const fixtureMap = loadGithubFixtures(options.fixturePath);
  const directories = walkDirectories(options.roots, options.maxDepth, options.includeHidden);
  const repos: RepoRecord[] = [];
  const seen = new Set<string>();

  for (const directory of directories) {
    const repoRoot = findRepoRoot(directory);
    if (!repoRoot || seen.has(repoRoot)) {
      continue;
    }

    seen.add(repoRoot);
    const name = path.basename(repoRoot);
    const status = readRepoFacts(repoRoot);
    const github = fixtureMap.get(fixtureKeyFromRepoName(name));
    const lastCommitRelativeDays = daysBetween(status.lastCommitDate, options.now);
    const beaconStatus = deriveBeaconStatus(status.dirty, github);
    const healthScore = computeHealthScore({
      dirty: status.dirty,
      ahead: status.ahead,
      behind: status.behind,
      lastCommitDate: status.lastCommitDate,
      github,
      now: options.now
    });

    repos.push({
      name,
      path: repoRoot,
      branch: status.branch,
      dirty: status.dirty,
      ahead: status.ahead,
      behind: status.behind,
      worktreeCount: status.worktreeCount,
      lastCommitSha: status.lastCommitSha,
      lastCommitDate: status.lastCommitDate,
      lastCommitRelativeDays,
      github,
      beaconStatus,
      healthScore
    });
  }

  return repos;
}

export function findRepoRoot(start: string): string | null {
  let current = path.resolve(start);
  while (true) {
    if (existsSync(path.join(current, '.git'))) {
      return current;
    }

    const parent = path.dirname(current);
    if (parent === current) {
      return null;
    }

    current = parent;
  }
}

function readRepoFacts(repoRoot: string) {
  const branch = runGit(repoRoot, ['rev-parse', '--abbrev-ref', 'HEAD']);
  const porcelain = runGit(repoRoot, ['status', '--porcelain']);
  const dirty = porcelain.length > 0;
  const trackingBranch = safeGit(repoRoot, ['rev-parse', '--abbrev-ref', '--symbolic-full-name', '@{u}']);
  let ahead: number | null = null;
  let behind: number | null = null;
  if (trackingBranch.ok) {
    const counts = runGit(repoRoot, ['rev-list', '--left-right', '--count', `${trackingBranch.stdout.trim()}...HEAD`]).split(/\s+/);
    behind = Number.parseInt(counts[0] ?? '0', 10);
    ahead = Number.parseInt(counts[1] ?? '0', 10);
  }

  const lastCommitSha = runGit(repoRoot, ['rev-parse', '--short=12', 'HEAD']);
  const lastCommitDate = runGit(repoRoot, ['log', '-1', '--format=%cI']);
  const worktreeCount = runGit(repoRoot, ['worktree', 'list', '--porcelain'])
    .split('\n')
    .filter((line) => line.startsWith('worktree ')).length;

  return { branch, dirty, ahead, behind, lastCommitSha, lastCommitDate, worktreeCount };
}

function runGit(repoRoot: string, args: string[]): string {
  return execFileSync('git', args, {
    cwd: repoRoot,
    encoding: 'utf8'
  }).trim();
}

function safeGit(repoRoot: string, args: string[]): { ok: true; stdout: string } | { ok: false } {
  try {
    const stdout = execFileSync('git', args, {
      cwd: repoRoot,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe']
    }).trim();
    return { ok: true, stdout };
  } catch {
    return { ok: false };
  }
}
