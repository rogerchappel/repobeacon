# Orchestration

repobeacon was built as a direct implementation wave: scaffold, implement core modules, add renderers, test with fixtures, publish, and protect `main`.

## Workstreams

1. **Foundation**: npm package, TypeScript config, README, PRD.
2. **Core scan**: filesystem discovery and Git command collection.
3. **Metadata**: explicit JSON fixtures only, keyed by repo name or full name.
4. **Render**: terminal, JSON, and static HTML outputs.
5. **Quality**: tests, smoke fixtures, validation script, CI.
6. **Release boundary**: push public GitHub repo and apply branch protection.

## Safety controls

- No hidden network calls.
- Scanner uses read-only Git commands.
- Output files are opt-in via `--output`.
- Fixture parsing is explicit via `--github-fixtures`.
