import type { RepoBeacon } from '../types.js';

export function renderJson(repos: RepoBeacon[]): string {
  return JSON.stringify({ generatedAt: new Date().toISOString(), repos }, null, 2);
}
