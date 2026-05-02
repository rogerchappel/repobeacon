# repobeacon Orchestration

## Build summary

This repository was scaffolded with StackForge and then filled in as a single-repo MVP build.

## Workstreams

1. **Foundation** — package metadata, TypeScript build, CLI entrypoint
2. **Scanning** — recursive directory walk plus git fact extraction
3. **Scoring** — combine local git state with fixture-backed GitHub health
4. **Rendering** — terminal table, JSON report, static HTML dashboard
5. **Verification** — unit tests, smoke script, validation script, pack dry-run
6. **Release** — publish `rogerchappel/repobeacon`, set metadata, protect `main`

## Constraints carried through implementation

- use isolated worktrees; never modify established main checkouts directly
- no hidden network activity
- no auto-pull or auto-sync default behavior
- no live OAuth flow in v0.1
- attribution only to the category inspiration; no copying of UI/docs/code

## Release handoff requirements

- GitHub repo: `rogerchappel/repobeacon`
- default branch: `main`
- useful description and topics
- branch protection applied with `protect-github-main.sh`
