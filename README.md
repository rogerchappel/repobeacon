# repobeacon

**repobeacon** is a local-first CLI radar for many small open-source repositories. It scans a projects folder, reads Git state, optionally merges fixture-backed GitHub metadata, and renders a terminal table, JSON, or a static HTML dashboard.

It is inspired by the category represented by `steipete/RepoBar`, but it is not a menu-bar app and does not copy RepoBar's name, UI, screenshots, docs, code, or implementation. repobeacon is an original terminal/static-dashboard tool built for batch maintenance workflows.

## Install

```bash
npm install -g repobeacon
```

Or run from source:

```bash
npm install
npm run build
node dist/src/cli.js scan ~/Developer/my-opensource
```

## Examples

```bash
repobeacon scan ~/Developer/my-opensource
repobeacon scan ~/Developer/my-opensource --format json --github-fixtures tests/fixtures/github.json
repobeacon scan ~/Developer/my-opensource --format html --output beacon.html
repobeacon scan ~/Developer/my-opensource --sort dirty
```

## Safety model

- No hidden network calls.
- No auto-sync, pull, push, or checkout.
- GitHub data is fixture-backed in v1; pass a JSON file explicitly.
- Commands read local Git metadata and write output only when `--output` is provided.

## Output personality

repobeacon shows a compact signal light for each repo: branch, dirt, ahead/behind, last commit, worktrees, CI, issues, and release freshness. It is meant to feel like a lighthouse sweep over a growing OSS harbor.

## Development

```bash
npm test
npm run check
npm run build
npm run smoke
bash scripts/validate.sh
```
