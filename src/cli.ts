#!/usr/bin/env node
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { Command } from 'commander';
import { render } from './render.js';
import { scan } from './scan.js';
import { sortRepos } from './sort.js';
import type { RenderFormat, SortMode } from './types.js';

const program = new Command();

program
  .name('repobeacon')
  .description('Local-first repo radar for Git projects')
  .version('0.1.0');

program.command('scan')
  .argument('[projectsDir]', 'directory containing Git repositories', process.cwd())
  .option('-f, --format <format>', 'table, json, or html', 'table')
  .option('-o, --output <file>', 'write output to a file')
  .option('--github-fixtures <file>', 'fixture JSON with CI, issue, and release metadata')
  .option('--depth <number>', 'directory traversal depth', '2')
  .option('--sort <mode>', 'name, dirty, activity, or issues', 'name')
  .action((projectsDir: string, options: { format: string; output?: string; githubFixtures?: string; depth: string; sort: string }) => {
    const format = options.format as RenderFormat;
    const sort = options.sort as SortMode;
    if (!['table', 'json', 'html'].includes(format)) throw new Error(`Unsupported format: ${options.format}`);
    if (!['name', 'dirty', 'activity', 'issues'].includes(sort)) throw new Error(`Unsupported sort: ${options.sort}`);
    const root = resolve(projectsDir);
    const repos = sortRepos(scan(root, { depth: Number(options.depth), githubFixtures: options.githubFixtures }), sort);
    const output = render(repos, format);
    if (options.output) {
      const file = resolve(options.output);
      mkdirSync(dirname(file), { recursive: true });
      writeFileSync(file, output + '\n');
    } else {
      process.stdout.write(output + '\n');
    }
  });

program.parse();
