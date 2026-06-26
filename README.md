# repobeacon

`repobeacon` is a terminal-first repo radar for people juggling lots of small repositories.
It scans local git repos, blends in fixture-backed GitHub health, and can emit a static HTML dashboard for a profile page or weekly maintenance ritual.

Inspired by the repo-health dashboard category represented by `steipete/RepoBar`, but built as an original local-first CLI/static-dashboard tool.

## What it does

- scans one or more roots for git repositories
- reports branch, dirty state, ahead/behind, last commit, and worktree count
- merges fixture-backed GitHub metadata for CI, issues, and releases
- renders a terminal table, JSON payload, and static HTML dashboard
- stays local-first: no auto-pull, no background sync, no OAuth flow in v0.1

## Install

```sh
npm install
npm run build
npm link
```

Or run it directly during development:

```sh
npm run build
node dist/cli.js --help
```

## Quick start

```sh
repobeacon \
  --root ~/Developer \
  --github-fixture fixtures/github/sample.json \
  --html ./artifacts/dashboard.html \
  --json-out ./artifacts/report.json
```

Example table output:

```text
name       branch  dirty  ahead  behind  worktrees  ci       release  score
alpha-app  main    no     1      1       2          passing  v1.4.0   86
beta-lib   main    yes    -      -       1          failing  v0.8.2   41
```

## CLI options

- `-r, --root <path>`: scan one or more roots
- `--max-depth <number>`: recursion depth for directory walking
- `--include-hidden`: include dot-directories while scanning
- `--github-fixture <file>`: load GitHub health from a local JSON fixture
- `--format <table|json|html>`: choose stdout renderer
- `--html <file>`: also write the HTML dashboard to disk
- `--json-out <file>`: also write the JSON report to disk
- `--sort <health|recent|name>`: choose sort order
- `--limit <number>`: cap rendered rows
- `--title <title>`: customize dashboard title

## Fixtures, not live auth

v0.1 deliberately uses fixture-backed GitHub metadata. That keeps the tool deterministic, testable, and safe to run offline.

If you later add a fixture refresher, document it to consume `REPOBEACON_GITHUB_TOKEN` from the environment. Do not commit tokens, bake them into fixtures, or make live network access the default path.

See [docs/github-fixture.md](docs/github-fixture.md) for the supported fixture
shape and refresh guidance.

## Development

```sh
npm test
npm run check
npm run build
npm run smoke
npm run release:readiness
npm run package:smoke
npm run release:check
bash scripts/validate.sh
```

`release:readiness` validates repository metadata, package contents, package
smoke coverage, and CI placeholder cleanup. `release:check` runs type checking,
tests, build, the fixture-backed smoke script, and a dry-run package check so
the release artifact can be reviewed before publishing.

## Project docs

- [docs/PRD.md](docs/PRD.md)
- [docs/TASKS.md](docs/TASKS.md)
- [docs/ORCHESTRATION.md](docs/ORCHESTRATION.md)
- [docs/github-fixture.md](docs/github-fixture.md)
- [ROADMAP.md](ROADMAP.md)
- [CHANGELOG.md](CHANGELOG.md)

## Limitations

- v0.1 does not authenticate to GitHub or refresh remote metadata by itself.
- Scores are intended for triage, not as a substitute for reviewing CI logs,
  security alerts, or release notes.
- Generated dashboards can reveal repository names and branch state; review the
  HTML and JSON artifacts before publishing them.

## License

MIT
