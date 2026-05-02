# repobeacon Tasks

## Completed for MVP

- [x] Scaffold repository with StackForge
- [x] Define MVP scope and orchestration docs
- [x] Implement recursive repo scanning
- [x] Capture git facts: branch, dirty state, ahead/behind, last commit, worktree count
- [x] Load fixture-backed GitHub metadata
- [x] Compute beacon status and health score
- [x] Render terminal table output
- [x] Render JSON output
- [x] Render static HTML dashboard
- [x] Add fixture-backed unit tests
- [x] Add smoke script using fixture repos
- [x] Document optional future token usage without implementing live auth
- [x] Wire package metadata and scripts

## Verification checklist

- [x] `npm test`
- [x] `npm run check`
- [x] `npm run build`
- [x] `npm run smoke`
- [x] `bash scripts/validate.sh`
- [x] real built CLI smoke against fixture repos
- [x] `npm pack --dry-run`

## Next sensible follow-ups

- [ ] add richer HTML styling/themes
- [ ] support config files for saved scan roots
- [ ] add an opt-in fixture refresher command for GitHub data
- [ ] add markdown/profile snippet rendering
