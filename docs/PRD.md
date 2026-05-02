# repobeacon PRD

## Product

`repobeacon` is Roger's original repo-dashboard and profile-health tool: a local-first CLI that scans many small repositories, highlights git maintenance signals, and exports a static dashboard.

## Problem

Maintaining many small OSS repos gets noisy fast. The friction is not opening one repo; it is remembering which repos are dirty, stale, behind origin, failing CI, or overdue for a release.

## Users

- solo OSS maintainers with many side-project repos
- agent-assisted maintainers who create repos in bursts
- anyone who wants a dashboard without handing over repo access to a hosted service

## Goals for v0.1

- scan one or more filesystem roots for git repositories
- report branch, dirty state, ahead/behind counts, last commit age, and worktree count
- accept fixture-backed GitHub metadata for CI, issues, and releases
- render:
  - terminal table
  - JSON report
  - static HTML dashboard suitable for a local artifact or profile page
- keep the default flow fully local and deterministic

## Non-goals

- native menu bar app
- live OAuth or browser auth
- automatic pull/sync behavior
- background daemons
- mutating remote GitHub state

## Principles

- local-first by default
- safe by default: no hidden network, no auto-sync
- original implementation and presentation
- testable with fixture repos and fixture GitHub metadata

## Success criteria

- maintainer can run one command and see actionable repo health
- output works in the terminal and as a shareable HTML artifact
- fixture-backed tests cover scanning, sorting, rendering, and CLI output
- docs clearly explain the no-live-auth stance for v0.1
