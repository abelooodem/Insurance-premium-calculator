export function formatETB(amount: number): string {
  const rounded = Math.round(amount * 100) / 100;
  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Math.abs(rounded));
  return `${rounded < 0 ? '-' : ''}Birr ${formatted}`;
}

export function formatNumber(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatPercent(rate: number): string {
  // rate expressed as a fraction, e.g. 0.015 -> "1.5%"
  const pct = rate * 100;
  const decimals = Number.isInteger(pct) ? 0 : pct < 1 ? 3 : 2;
  return `${pct.toFixed(decimals)}%`;
}

export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
