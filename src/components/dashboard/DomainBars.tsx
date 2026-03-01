'use client';

import { tokens } from '@/styles/tokens';

const DOMAINS: { key: keyof DomainScores; label: string }[] = [
  { key: 'experience', label: 'Experience' },
  { key: 'workload', label: 'Workload & Resourcing' },
  { key: 'safety', label: 'Psychological Safety' },
  { key: 'leadership', label: 'Leadership & Support' },
  { key: 'clarity', label: 'Clarity & Direction' },
];

export type DomainScores = {
  experience: number;
  workload: number;
  safety: number;
  leadership: number;
  clarity: number;
};

function barColor(percent: number): string {
  if (percent >= 70) return tokens.barGood;
  if (percent >= 50) return tokens.barWatch;
  return tokens.barAlert;
}

export interface DomainBarsProps {
  scores: DomainScores;
  /** Compact single-line rows (~44–52px); default true */
  compact?: boolean;
}

export function DomainBars({ scores, compact = true }: DomainBarsProps) {
  return (
    <div className="w-full">
      {/* One line per domain: label | bar | score */}
      <div className={compact ? 'space-y-0' : 'space-y-4'}>
        {DOMAINS.map(({ key, label }) => {
          const value = scores[key];
          const percent = Math.max(0, Math.min(100, typeof value === 'number' ? value * 20 : 0));
          const color = barColor(percent);
          return (
            <div
              key={key}
              className={`flex items-center gap-3 ${compact ? 'h-11 min-h-[44px] py-1.5' : ''}`}
            >
              <div
                className={`flex-shrink-0 bi-label text-bi-textMuted ${compact ? 'w-36 text-[13px]' : 'w-40'}`}
              >
                {label}
              </div>
              <div
                className="flex-1 min-w-0 rounded-bi-sm overflow-hidden"
                style={{ background: tokens.barTrack, height: compact ? 8 : 20 }}
              >
                <div
                  className="h-full rounded-bi-sm transition-all duration-500 ease-out"
                  style={{
                    width: `${percent}%`,
                    background: color,
                  }}
                />
              </div>
              <div
                className={`flex-shrink-0 text-right tabular-nums font-medium text-bi-text ${compact ? 'w-10 text-sm' : 'w-10 bi-label'}`}
              >
                {Math.round(percent)}
              </div>
            </div>
          );
        })}
      </div>
      {/* Small threshold legend (no extra vertical space) */}
      <p
        className="mt-2 bi-caption text-bi-textSubtle"
        title="Score bands: ≥70 low risk, 50–69 watch, &lt;50 elevated"
      >
        ≥70 low · 50–69 watch · &lt;50 elevated
      </p>
    </div>
  );
}
