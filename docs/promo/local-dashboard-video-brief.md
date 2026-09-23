# Local Dashboard Demo Brief

## Angle

Show `repobeacon` as a local-first repo radar: it scans local git state, blends in reviewed fixture metadata, and writes a static dashboard.

## Demo Path

```sh
bash demo/run-local-dashboard.sh
```

The demo creates two temporary git repositories outside the checkout, uses `fixtures/github/sample.json`, and writes:

- `.tmp/local-dashboard-demo/table.txt`
- `.tmp/local-dashboard-demo/report.json`
- `.tmp/local-dashboard-demo/dashboard.html`

## Shot List

1. Open `fixtures/github/sample.json` and show the CI, issue, release, and profile note fields.
2. Run `bash demo/run-local-dashboard.sh`.
3. Show the terminal table with `alpha-app` and `beta-lib`.
4. Open `.tmp/local-dashboard-demo/report.json` to show the deterministic report payload.
5. Open `.tmp/local-dashboard-demo/dashboard.html` to show the static dashboard Roger can publish or screenshot.

## Guardrails

- Do not claim live GitHub API access; v0.1 consumes reviewed fixtures.
- Do not claim `repobeacon` fixes repository health by itself.
- Keep the pitch on visibility for maintainers juggling many small repos.
