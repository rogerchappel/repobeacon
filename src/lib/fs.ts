import { readdirSync, statSync } from 'node:fs';
import path from 'node:path';

export function walkDirectories(roots: string[], maxDepth: number, includeHidden: boolean): string[] {
  const results = new Set<string>();

  for (const root of roots) {
    visit(path.resolve(root), 0);
  }

  return [...results];

  function visit(current: string, depth: number): void {
    let stats;
    try {
      stats = statSync(current);
    } catch {
      return;
    }

    if (!stats.isDirectory()) {
      return;
    }

    results.add(current);

    if (depth >= maxDepth) {
      return;
    }

    const entries = safeReadDir(current);
    for (const entry of entries) {
      if (!includeHidden && entry.name.startsWith('.')) {
        continue;
      }

      if (!entry.isDirectory()) {
        continue;
      }

      if (entry.name === 'node_modules' || entry.name === 'dist') {
        continue;
      }

      visit(path.join(current, entry.name), depth + 1);
    }
  }
}

function safeReadDir(current: string) {
  try {
    return readdirSync(current, { withFileTypes: true });
  } catch {
    return [];
  }
}
