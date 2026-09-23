# Changelog

## Unreleased

- Include the sample GitHub fixture in the package allowlist so quickstart
  commands work from the packed artifact.
- Add a package manifest smoke check for required CLI, docs, and fixture files.

## 0.1.0 - 2026-05-02

- initial `repobeacon` MVP
- local git repo scanning across one or more roots
- repo facts: branch, dirty state, ahead/behind, last commit metadata, worktree count
- fixture-backed GitHub health merge for CI, issues, and release freshness
- terminal table, JSON report, and static HTML dashboard renderers
- fixture-backed unit tests and smoke verification
- local-first docs covering optional future token usage without live auth
