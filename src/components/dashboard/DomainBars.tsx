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
}

export function DomainBars({ scores }: DomainBarsProps) {
  return (
    <div className="space-y-4">
      {DOMAINS.map(({ key, label }) => {
        const value = scores[key];
        const percent = Math.max(0, Math.min(100, typeof value === 'number' ? value * 20 : 0));
        const color = barColor(percent);
        return (
          <div key={key} className="flex items-center gap-4">
            <div
              className="w-40 flex-shrink-0 text-sm font-medium"
              style={{ color: tokens.textMuted }}
            >
              {label}
            </div>
            <div
              className="flex-1 h-5 rounded-bi-sm overflow-hidden"
              style={{ background: tokens.barTrack }}
            >
              <div
                className="h-full rounded-bi-sm transition-all duration-600 ease-out"
                style={{
                  width: `${percent}%`,
                  background: color,
                }}
              />
            </div>
            <div
              className="w-10 flex-shrink-0 text-right text-sm font-medium tabular-nums"
              style={{ color: tokens.text }}
            >
              {Math.round(percent)}%
            </div>
          </div>
        );
      })}
    </div>
  );
}
