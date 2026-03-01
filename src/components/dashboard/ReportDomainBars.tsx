'use client';

import type { DomainScores } from './DomainBars';

const DOMAINS: { key: keyof DomainScores; label: string }[] = [
  { key: 'experience', label: 'Experience' },
  { key: 'workload', label: 'Workload & Resourcing' },
  { key: 'safety', label: 'Psychological Safety' },
  { key: 'leadership', label: 'Leadership & Support' },
  { key: 'clarity', label: 'Clarity & Direction' },
];

function barColor(percent: number): string {
  if (percent >= 70) return '#0d7d4c';
  if (percent >= 50) return '#b45309';
  return '#c53030';
}

export interface ReportDomainBarsProps {
  scores: DomainScores;
}

export function ReportDomainBars({ scores }: ReportDomainBarsProps) {
  return (
    <div className="w-full space-y-0.5">
      {DOMAINS.map(({ key, label }) => {
        const value = scores[key];
        const percent = Math.max(0, Math.min(100, typeof value === 'number' ? value * 20 : 0));
        return (
          <div key={key} className="flex items-center gap-3 h-6">
            <div className="w-32 flex-shrink-0 text-xs text-neutral-600">{label}</div>
            <div className="flex-1 min-w-0 h-1.5 rounded-full bg-neutral-200 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${percent}%`, backgroundColor: barColor(percent) }}
              />
            </div>
            <div className="w-6 text-right text-xs font-medium tabular-nums text-neutral-800">
              {Math.round(percent)}
            </div>
          </div>
        );
      })}
    </div>
  );
}
