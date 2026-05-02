import { summarize } from '../summary.js';
import type { RepoBeacon } from '../types.js';

export function renderJson(repos: RepoBeacon[]): string {
  return JSON.stringify({ generatedAt: new Date().toISOString(), summary: summarize(repos), repos }, null, 2);
}
