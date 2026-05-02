import { readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

export function discoverRepos(root: string, depth = 2): string[] {
  const repos = new Set<string>();
  const visit = (dir: string, remaining: number) => {
    let entries;
    try { entries = readdirSync(dir, { withFileTypes: true }); } catch { return; }
    if (entries.some((entry) => entry.name === '.git')) {
      repos.add(dir);
      return;
    }
    if (remaining <= 0) return;
    for (const entry of entries) {
      if (!entry.isDirectory() || entry.name === 'node_modules' || entry.name === '.git') continue;
      const next = join(dir, entry.name);
      try { if (statSync(next).isDirectory()) visit(next, remaining - 1); } catch { /* ignore unreadable */ }
    }
  };
  visit(root, depth);
  return [...repos].sort((a, b) => a.localeCompare(b));
}
