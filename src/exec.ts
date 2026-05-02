import { spawnSync } from 'node:child_process';

export type CommandResult = { ok: true; stdout: string } | { ok: false; stdout: string; stderr: string; status: number | null };

export function run(command: string, args: string[], cwd: string): CommandResult {
  const result = spawnSync(command, args, { cwd, encoding: 'utf8' });
  if (result.status === 0) return { ok: true, stdout: result.stdout.trim() };
  return { ok: false, stdout: result.stdout.trim(), stderr: result.stderr.trim(), status: result.status };
}
