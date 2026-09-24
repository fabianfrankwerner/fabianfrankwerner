export const THEME = {
  bg: '#0a0e1a',
  surface: '#111a2e',
  surfaceAlt: '#0d1526',
  border: '#1e2a44',
  starterBorder: '#2a3a5f',

  text: '#e8eefc',
  textMuted: '#93a1bd',
  textFaint: '#5a6884',

  accent: '#38bdf8',
  accentSoft: '#7dd3fc',
  accentDim: '#1e3a5f',

  // Bars
  barLow: '#4f46e5',
  barHigh: '#22d3ee',
  barNeutral: '#3b82f6',
  barStroke: '#ffffff2e',

  // States
  compare: '#f59e0b',
  active: '#fbbf24',
  swap: '#f97316',
  found: '#34d399',
  pivot: '#a78bfa',
  pivotActive: '#d8b4fe',
  heap: '#a78bfa',
  ghost: '#2c3a55',
  sorted: '#34d399',
  done: '#10b981',

  // Type
  danger: '#f87171',

  mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, "Cascadia Mono", monospace',
  sans: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
} as const;

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
}

function rgbToHex(r: number, g: number, b: number): string {
  return `#${[r, g, b]
    .map(v => Math.round(v).toString(16).padStart(2, '0'))
    .join('')}`;
}

export function lerpColor(a: string, b: string, t: number): string {
  const ca = hexToRgb(a);
  const cb = hexToRgb(b);
  const t01 = Math.max(0, Math.min(1, t));
  return rgbToHex(
    ca[0] + (cb[0] - ca[0]) * t01,
    ca[1] + (cb[1] - ca[1]) * t01,
    ca[2] + (cb[2] - ca[2]) * t01,
  );
}

/** Color for a bar proportional to its value. */
export function valueColor(v: number, maxValue: number): string {
  const t = maxValue > 1 ? (v - 1) / (maxValue - 1) : 1;
  return lerpColor(THEME.barLow, THEME.barHigh, t);
}