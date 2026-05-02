export type BeaconStatus = 'passing' | 'failing' | 'mixed' | 'unknown';

export type RepoScanOptions = {
  roots: string[];
  maxDepth: number;
  includeHidden: boolean;
  fixturePath?: string;
  now?: Date;
};

export type GitRemoteTracking = {
  remote: string | null;
  ahead: number | null;
  behind: number | null;
};

export type RepoRecord = {
  name: string;
  path: string;
  branch: string;
  dirty: boolean;
  ahead: number | null;
  behind: number | null;
  worktreeCount: number;
  lastCommitSha: string;
  lastCommitDate: string;
  lastCommitRelativeDays: number;
  github?: GithubRepoFixture;
  beaconStatus: BeaconStatus;
  healthScore: number;
};

export type GithubRepoFixture = {
  repo: string;
  defaultBranch?: string;
  ci?: {
    status: BeaconStatus;
    workflow?: string;
    updatedAt?: string;
  };
  issues?: {
    open: number;
    urgent?: number;
  };
  release?: {
    latestTag?: string;
    publishedAt?: string;
  };
  stars?: number;
  watchers?: number;
  profileNote?: string;
};

export type GithubFixtureFile = {
  generatedAt?: string;
  repos: GithubRepoFixture[];
};

export type OutputFormat = 'table' | 'json' | 'html';

export type CliOptions = {
  roots: string[];
  maxDepth: number;
  includeHidden: boolean;
  fixturePath?: string;
  format: OutputFormat;
  htmlPath?: string;
  jsonPath?: string;
  sortBy: 'health' | 'recent' | 'name';
  limit?: number;
  profileTitle: string;
};
