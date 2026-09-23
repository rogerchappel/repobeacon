#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT="$ROOT/.tmp/local-dashboard-demo"
WORKSPACE="$(mktemp -d "${TMPDIR:-/tmp}/repobeacon-dashboard-demo.XXXXXX")"
PROJECTS="$WORKSPACE/projects"

cd "$ROOT"
rm -rf "$OUT"
mkdir -p "$OUT" "$PROJECTS/alpha-app" "$PROJECTS/beta-lib"

for repo in alpha-app beta-lib; do
  git -C "$PROJECTS/$repo" init -q
  git -C "$PROJECTS/$repo" config user.email "demo@example.com"
  git -C "$PROJECTS/$repo" config user.name "Demo Maintainer"
  printf '# %s\n' "$repo" >"$PROJECTS/$repo/README.md"
  git -C "$PROJECTS/$repo" add README.md
  git -C "$PROJECTS/$repo" commit -q -m "Initial demo commit"
done

printf 'local edit\n' >>"$PROJECTS/beta-lib/README.md"

npm run build >/dev/null

node dist/cli.js \
  --root "$PROJECTS" \
  --max-depth 2 \
  --github-fixture fixtures/github/sample.json \
  --html "$OUT/dashboard.html" \
  --json-out "$OUT/report.json" \
  --sort health \
  --title "Local OSS Radar" | tee "$OUT/table.txt"

test -s "$OUT/dashboard.html"
test -s "$OUT/report.json"
grep -q "alpha-app" "$OUT/table.txt"
grep -q "beta-lib" "$OUT/report.json"
grep -q "Local OSS Radar" "$OUT/dashboard.html"

printf 'Demo wrote:\n'
printf '  %s\n' "$OUT/table.txt"
printf '  %s\n' "$OUT/report.json"
printf '  %s\n' "$OUT/dashboard.html"
printf 'Scratch repos were created under %s\n' "$PROJECTS"
