const DAY_MS = 24 * 60 * 60 * 1000;

export function daysBetween(isoDate: string, now = new Date()): number {
  const then = new Date(isoDate).getTime();
  if (Number.isNaN(then)) {
    return Number.MAX_SAFE_INTEGER;
  }

  return Math.max(0, Math.floor((now.getTime() - then) / DAY_MS));
}

export function relativeDaysLabel(days: number): string {
  if (days === 0) {
    return 'today';
  }

  if (days === 1) {
    return '1d ago';
  }

  return `${days}d ago`;
}
