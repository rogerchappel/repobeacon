# Contributing

Thanks for helping improve repobeacon. Please keep the project local-first and safe by default.

## Development loop

1. Install dependencies with `npm install`.
2. Run `bash scripts/validate.sh` before opening a PR.
3. Add fixture-backed tests for scanner or renderer changes.

## Design principles

- Prefer read-only Git commands.
- Require explicit flags for files, fixtures, and future network providers.
- Keep terminal output compact and dashboard output portable.
