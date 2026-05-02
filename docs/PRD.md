# repobeacon PRD

## Problem

Maintainers with many small OSS repos need a fast, trustworthy view of local Git health without accidentally mutating projects or hitting the network.

## Audience

- OSS maintainers running agent-generated project waves.
- Developers who keep many local checkouts under one directory.
- Release shepherds who want static status artifacts for async review.

## Goals

1. Scan a projects directory for Git repositories.
2. Report branch, dirty state, ahead/behind, last commit, and worktree count.
3. Merge explicitly supplied fixture-backed GitHub metadata for CI, issues, and releases.
4. Render terminal table, JSON, and static HTML dashboard.
5. Stay local-first: no hidden network, no auto-sync, no writes to repos.

## Non-goals

- Native menu bar UI.
- Background daemon or live polling.
- OAuth, tokens, or automatic GitHub API calls in v1.
- Automatic pull, push, checkout, or cleanup.

## Inspiration and originality

Inspired by the category represented by `steipete/RepoBar`. repobeacon is an original CLI/static-dashboard product and intentionally avoids copying RepoBar naming, UI, screenshots, docs, code, or implementation.

## Success criteria

- CLI scans fixture repos in smoke tests.
- Renderers are covered by tests.
- Dashboard is a single portable HTML file.
- README clearly documents safety behavior.
