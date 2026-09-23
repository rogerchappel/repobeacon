# GitHub Fixture Contract

`repobeacon` reads GitHub health from a local JSON fixture instead of calling the
GitHub API. This keeps smoke tests deterministic and lets maintainers publish a
dashboard without granting the CLI live credentials.

## Shape

The fixture root must contain a `repos` array. Each entry's required `repo`
field should be the case-insensitive GitHub `owner/repository` slug from the
repository's `origin` remote:

```json
{
  "repos": [
    {
      "repo": "example/alpha-app",
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
  ]
}
```

The `repo` field is required and must be a non-empty string. HTTPS and SSH
GitHub origin URLs resolve to the same slug. Duplicate normalized fixture
identities are rejected with the fixture path and conflicting identity.

For compatibility, a basename such as `alpha-app` still matches when exactly
one scanned repository has that basename. If multiple scanned repositories
share a basename, basename-only entries are ignored for all of them; use an
`owner/repository` entry for each repository instead. This prevents one entry
from silently supplying GitHub health to unrelated repositories.

All other entry fields are optional. Repositories missing from the fixture
still render with local git facts and a lower confidence score. Invalid JSON
or a fixture with the wrong root shape reports the fixture path and expected
shape.

## Refresh Guidance

If you maintain an external refresher script, keep it outside the committed
fixture flow unless it is fully deterministic. Read credentials from
`REPOBEACON_GITHUB_TOKEN`, write the JSON fixture to disk, review it for private
repository names, and then run:

```sh
repobeacon --root ~/Developer --github-fixture fixtures/github/sample.json
```

Do not commit tokens, raw API responses, or private issue titles.
