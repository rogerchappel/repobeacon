#!/usr/bin/env bash
set -euo pipefail
ROOT="$(mktemp -d)"
REPO="$ROOT/clean-repo"
git init "$REPO" >/dev/null
git -C "$REPO" config user.name "Smoke Test"
git -C "$REPO" config user.email "smoke@example.com"
echo '# clean-repo' > "$REPO/README.md"
git -C "$REPO" add README.md
git -C "$REPO" commit -m 'initial commit' >/dev/null
node dist/src/cli.js scan "$ROOT" --github-fixtures tests/fixtures/github.json --format table | grep 'clean-repo' >/dev/null
node dist/src/cli.js scan "$ROOT" --github-fixtures tests/fixtures/github.json --format json | grep '"total": 1' >/dev/null
node dist/src/cli.js scan "$ROOT" --github-fixtures tests/fixtures/github.json --format html --output "$ROOT/dashboard.html"
test -s "$ROOT/dashboard.html"
echo "smoke ok"
