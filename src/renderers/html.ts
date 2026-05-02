import type { RepoBeacon } from '../types.js';

function escapeHtml(value: string): string {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
}

function statusClass(repo: RepoBeacon): string {
  if (repo.dirty || repo.behind > 0 || repo.github?.ci === 'failing') return 'warn';
  if (repo.github?.ci === 'passing') return 'good';
  return 'calm';
}

export function renderHtml(repos: RepoBeacon[]): string {
  const rows = repos.map((repo) => `<tr class="${statusClass(repo)}"><td>${escapeHtml(repo.name)}</td><td>${escapeHtml(repo.branch)}</td><td>${repo.dirty ? 'dirty' : 'clean'}</td><td>${repo.ahead}/${repo.behind}</td><td>${repo.worktreeCount}</td><td>${repo.github?.ci ?? 'n/a'}</td><td>${repo.github?.openIssues ?? 'n/a'}</td><td>${escapeHtml(repo.github?.latestRelease ?? 'n/a')}</td><td>${escapeHtml(repo.lastCommit)}</td></tr>`).join('\n');
  return `<!doctype html>
<html lang="en">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>repobeacon dashboard</title>
<style>
:root{color-scheme:dark;background:#09111f;color:#edf6ff;font-family:Inter,ui-sans-serif,system-ui,sans-serif}body{margin:0;padding:32px;background:radial-gradient(circle at top,#12325f,#09111f 55%)}main{max-width:1180px;margin:auto}h1{font-size:42px;margin:0}.tagline{color:#9fb3c8}.cards{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin:24px 0}.card{background:#0f1d33;border:1px solid #254467;border-radius:16px;padding:16px}.card strong{font-size:28px}table{width:100%;border-collapse:collapse;background:#0d182b;border:1px solid #223d5f;border-radius:16px;overflow:hidden}th,td{text-align:left;padding:11px 12px;border-bottom:1px solid #1c3350}th{color:#b7c9dd;font-size:12px;text-transform:uppercase;letter-spacing:.08em}.good{--accent:#4ade80}.warn{--accent:#fbbf24}.calm{--accent:#60a5fa}tr{border-left:4px solid var(--accent)}footer{margin-top:22px;color:#8aa0b8;font-size:13px}@media(max-width:800px){.cards{grid-template-columns:1fr}body{padding:16px}table{font-size:12px}}
</style>
<main>
<h1>repobeacon</h1>
<p class="tagline">A local-first lighthouse sweep over ${repos.length} repositories.</p>
<section class="cards"><div class="card"><span>Dirty</span><br><strong>${repos.filter((repo) => repo.dirty).length}</strong></div><div class="card"><span>Behind</span><br><strong>${repos.filter((repo) => repo.behind > 0).length}</strong></div><div class="card"><span>CI failing</span><br><strong>${repos.filter((repo) => repo.github?.ci === 'failing').length}</strong></div></section>
<table><thead><tr><th>Repo</th><th>Branch</th><th>State</th><th>A/B</th><th>Worktrees</th><th>CI</th><th>Issues</th><th>Release</th><th>Last commit</th></tr></thead><tbody>${rows}</tbody></table>
<footer>Generated locally. No network calls, no auto-sync.</footer>
</main>
</html>`;
}
