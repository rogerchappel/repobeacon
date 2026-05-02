export function truncateMiddle(value: string, max = 9): string {
  if (value.length <= max) {
    return value;
  }

  return `${value.slice(0, 4)}…${value.slice(-4)}`;
}

export function pad(value: string, width: number): string {
  return value.padEnd(width, ' ');
}
