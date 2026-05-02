export type GitHubMetadata = {
  fullName?: string;
  ci?: 'passing' | 'failing' | 'unknown';
  openIssues?: number;
  latestRelease?: string;
  releaseAgeDays?: number;
};

export type RepoBeacon = {
  name: string;
  path: string;
  branch: string;
  dirty: boolean;
  ahead: number;
  behind: number;
  lastCommit: string;
  lastCommitDate: string;
  worktreeCount: number;
  github?: GitHubMetadata;
};

export type ScanOptions = {
  depth: number;
  githubFixtures?: string;
};

export type RenderFormat = 'table' | 'json' | 'html';
export type SortMode = 'name' | 'dirty' | 'activity' | 'issues';
