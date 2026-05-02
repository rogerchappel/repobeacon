import { renderHtml, renderJson, renderTable } from './renderers/index.js';
import type { RenderFormat, RepoBeacon } from './types.js';

export function render(repos: RepoBeacon[], format: RenderFormat): string {
  if (format === 'json') return renderJson(repos);
  if (format === 'html') return renderHtml(repos);
  return renderTable(repos);
}
