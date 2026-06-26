# GitHub Fixture Contract

`repobeacon` reads GitHub health from a local JSON fixture instead of calling the
GitHub API. This keeps smoke tests deterministic and lets maintainers publish a
dashboard without granting the CLI live credentials.

## Shape

The fixture root must contain a `repos` object keyed by repository directory
name:

```json
{
  "repos": {
    "alpha-app": {
      "ci": {
        "status": "passing",
        "url": "https://github.com/example/alpha-app/actions"
      },
      "issues": {
        "open": 3
      },
      "release": {
        "latestTag": "v1.4.0",
        "publishedAt": "2026-05-01T00:00:00.000Z"
      }
    }
  }
}
```

All nested fields are optional. Repositories missing from the fixture still
render with local git facts and a lower confidence score.

## Refresh Guidance

If you maintain an external refresher script, keep it outside the committed
fixture flow unless it is fully deterministic. Read credentials from
`REPOBEACON_GITHUB_TOKEN`, write the JSON fixture to disk, review it for private
repository names, and then run:

```sh
repobeacon --root ~/Developer --github-fixture fixtures/github/sample.json
```

Do not commit tokens, raw API responses, or private issue titles.
