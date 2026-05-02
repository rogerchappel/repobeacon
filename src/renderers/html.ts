import { relativeDaysLabel } from '../lib/time.js';
import type { RepoRecord } from '../types.js';

export function renderHtml(repos: RepoRecord[], title: string): string {
  const strongest = repos[0];
  const cards = [
    metricCard('Repos', String(repos.length)),
    metricCard('Passing CI', String(repos.filter((repo) => repo.github?.ci?.status === 'passing').length)),
    metricCard('Dirty Trees', String(repos.filter((repo) => repo.dirty).length)),
    metricCard('Needs Attention', String(repos.filter((repo) => repo.healthScore < 70).length))
  ].join('');

  const rows = repos.map((repo) => `
    <tr>
      <td><strong>${escapeHtml(repo.name)}</strong><div class="subtle">${escapeHtml(repo.path)}</div></td>
      <td>${escapeHtml(repo.branch)}</td>
      <td>${repo.dirty ? 'Dirty' : 'Clean'}</td>
      <td>${repo.ahead ?? '-'}↑ / ${repo.behind ?? '-'}↓</td>
      <td>${relativeDaysLabel(repo.lastCommitRelativeDays)}</td>
      <td>${repo.worktreeCount}</td>
      <td><span class="pill ${repo.github?.ci?.status ?? 'unknown'}">${escapeHtml(repo.github?.ci?.status ?? 'unknown')}</span></td>
      <td>${repo.github?.issues?.open ?? '—'}</td>
      <td>${escapeHtml(repo.github?.release?.latestTag ?? '—')}</td>
      <td>${repo.healthScore}</td>
    </tr>`).join('');

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(title)}</title>
  <style>
    :root { color-scheme: dark; --bg:#07111f; --panel:#0f1b2d; --line:#22314b; --text:#e7eef8; --muted:#8ea1ba; --green:#41d392; --yellow:#f5c451; --red:#ff6b7f; }
    body { margin:0; font-family: Inter, ui-sans-serif, system-ui, sans-serif; background:linear-gradient(180deg,#08101a,#0c1727 55%,#111f33); color:var(--text); }
    main { max-width: 1180px; margin: 0 auto; padding: 48px 24px 64px; }
    h1 { font-size: 2.4rem; margin-bottom: 0.4rem; }
    p { color: var(--muted); }
    .cards { display:grid; grid-template-columns:repeat(auto-fit,minmax(180px,1fr)); gap:16px; margin:24px 0 32px; }
    .card, table { background:rgba(15,27,45,0.88); border:1px solid var(--line); border-radius:18px; box-shadow:0 10px 40px rgba(0,0,0,0.18); }
    .card { padding:18px; }
    .metric { font-size:2rem; font-weight:700; margin-top:8px; }
    .hero { display:flex; justify-content:space-between; gap:20px; align-items:end; }
    .feature { padding:18px; background:rgba(11,20,34,0.72); border:1px dashed var(--line); border-radius:18px; }
    table { width:100%; border-collapse:collapse; overflow:hidden; }
    th, td { padding:14px 16px; text-align:left; border-bottom:1px solid var(--line); vertical-align:top; }
    th { color:#aac0dc; font-size:0.85rem; text-transform:uppercase; letter-spacing:0.08em; }
    tr:last-child td { border-bottom:none; }
    .subtle { color:var(--muted); font-size:0.83rem; margin-top:4px; }
    .pill { display:inline-block; padding:4px 10px; border-radius:999px; font-size:0.82rem; }
    .passing { background:rgba(65,211,146,0.16); color:var(--green); }
    .mixed { background:rgba(245,196,81,0.16); color:var(--yellow); }
    .failing { background:rgba(255,107,127,0.16); color:var(--red); }
    .unknown { background:rgba(142,161,186,0.16); color:var(--muted); }
  </style>
</head>
<body>
  <main>
    <section class="hero">
      <div>
        <h1>${escapeHtml(title)}</h1>
        <p>Local-first repo radar for many small OSS projects. Built for fast morning scans, release nudges, and profile-worthy dashboards.</p>
      </div>
      ${strongest ? `<div class="feature"><strong>Strongest beacon:</strong><br/>${escapeHtml(strongest.name)} · score ${strongest.healthScore}<br/><span class="subtle">${escapeHtml(strongest.github?.profileNote ?? 'Healthy enough to show off.')}</span></div>` : ''}
    </section>
    <section class="cards">${cards}</section>
    <table>
      <thead>
        <tr><th>Repo</th><th>Branch</th><th>State</th><th>Sync</th><th>Recent</th><th>Worktrees</th><th>CI</th><th>Issues</th><th>Release</th><th>Score</th></tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  </main>
</body>
</html>`;
}

function metricCard(label: string, value: string): string {
  return `<article class="card"><div class="subtle">${escapeHtml(label)}</div><div class="metric">${escapeHtml(value)}</div></article>`;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}
