#!/usr/bin/env node
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { scanRepos } from './lib/git.js';
import { sortRepos } from './lib/sort.js';
import { renderHtml } from './renderers/html.js';
import { renderJson } from './renderers/json.js';
import { renderTable } from './renderers/table.js';
import type { CliOptions } from './types.js';

export function parseArgs(argv: string[]): CliOptions {
  const options: CliOptions = {
    roots: [process.cwd()],
    maxDepth: 3,
    includeHidden: false,
    format: 'table',
    sortBy: 'health',
    profileTitle: 'repobeacon dashboard'
  };

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    switch (token) {
      case '--root':
      case '-r':
        options.roots.push(mustValue(argv, ++index, token));
        break;
      case '--max-depth':
        options.maxDepth = Number.parseInt(mustValue(argv, ++index, token), 10);
        break;
      case '--include-hidden':
        options.includeHidden = true;
        break;
      case '--github-fixture':
        options.fixturePath = mustValue(argv, ++index, token);
        break;
      case '--format':
        options.format = mustValue(argv, ++index, token) as CliOptions['format'];
        break;
      case '--html':
        options.htmlPath = mustValue(argv, ++index, token);
        break;
      case '--json-out':
        options.jsonPath = mustValue(argv, ++index, token);
        break;
      case '--sort':
        options.sortBy = mustValue(argv, ++index, token) as CliOptions['sortBy'];
        break;
      case '--limit':
        options.limit = Number.parseInt(mustValue(argv, ++index, token), 10);
        break;
      case '--title':
        options.profileTitle = mustValue(argv, ++index, token);
        break;
      case '--help':
      case '-h':
        printHelp();
        process.exit(0);
      default:
        throw new Error(`Unknown argument: ${token}`);
    }
  }

  if (options.roots[0] === process.cwd() && options.roots.length > 1) {
    options.roots.shift();
  }

  return options;
}

export function run(argv: string[]): { stdout: string; html?: string; json?: string } {
  const options = parseArgs(argv);
  const repos = sortRepos(scanRepos(options), options.sortBy);
  const limited = options.limit ? repos.slice(0, options.limit) : repos;
  const table = renderTable(limited);
  const json = renderJson(limited);
  const html = renderHtml(limited, options.profileTitle);

  if (options.htmlPath) {
    writeArtifact(options.htmlPath, html);
  }

  if (options.jsonPath) {
    writeArtifact(options.jsonPath, json);
  }

  switch (options.format) {
    case 'json':
      return { stdout: json, html, json };
    case 'html':
      return { stdout: html, html, json };
    case 'table':
    default:
      return { stdout: table, html, json };
  }
}

function writeArtifact(filePath: string, contents: string): void {
  const target = path.resolve(filePath);
  mkdirSync(path.dirname(target), { recursive: true });
  writeFileSync(target, contents, 'utf8');
}

function mustValue(argv: string[], index: number, flag: string): string {
  const value = argv[index];
  if (!value) {
    throw new Error(`Missing value for ${flag}`);
  }

  return value;
}

function printHelp(): void {
  console.log(`repobeacon\n\nUsage:\n  repobeacon [options]\n\nOptions:\n  -r, --root <path>           scan one or more project roots\n      --max-depth <number>    recursion depth (default: 3)\n      --include-hidden        include dot-directories while scanning\n      --github-fixture <file> load GitHub health from a local fixture JSON file\n      --format <table|json|html> stdout format (default: table)\n      --html <file>           also write a static dashboard HTML file\n      --json-out <file>       also write JSON output to disk\n      --sort <health|recent|name> sorting strategy\n      --limit <number>        limit rows in the rendered output\n      --title <title>         dashboard title\n  -h, --help                  show help\n\nNotes:\n  - live GitHub auth is intentionally out of scope for v0.1\n  - set REPOBEACON_GITHUB_TOKEN later only when you wire your own fixture refresher\n`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  try {
    const result = run(process.argv.slice(2));
    console.log(result.stdout);
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}
