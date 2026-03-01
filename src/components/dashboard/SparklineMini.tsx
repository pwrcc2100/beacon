'use client';

/** Last 6 points as a minimal sparkline (no axes). */
export function SparklineMini({ points }: { points: number[] }) {
  const slice = points.slice(-6);
  if (slice.length === 0) return null;
  const min = Math.min(...slice);
  const max = Math.max(...slice);
  const range = max - min || 1;
  const w = 64;
  const h = 24;
  const pad = 2;
  const xs = slice.map((_, i) => pad + (i / (slice.length - 1 || 1)) * (w - 2 * pad));
  const ys = slice.map((v) => h - pad - ((v - min) / range) * (h - 2 * pad));
  const d = xs.map((x, i) => `${i === 0 ? 'M' : 'L'} ${x} ${ys[i]}`).join(' ');
  return (
    <svg width={w} height={h} className="flex-shrink-0" aria-hidden>
      <path
        d={d}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-neutral-400"
      />
    </svg>
  );
}
