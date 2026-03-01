'use client';

import { getVisualBand } from '@/lib/visualBand';
import type { DomainScores } from './DomainBars';

const DOMAINS: { key: keyof DomainScores; label: string }[] = [
  { key: 'experience', label: 'Experience' },
  { key: 'workload', label: 'Workload & Resourcing' },
  { key: 'safety', label: 'Psychological Safety' },
  { key: 'leadership', label: 'Leadership & Support' },
  { key: 'clarity', label: 'Clarity & Direction' },
];

export interface ReportDomainBarsProps {
  scores: DomainScores;
}

export function ReportDomainBars({ scores }: ReportDomainBarsProps) {
  return (
    <div className="w-full space-y-0.5">
      {DOMAINS.map(({ key, label }) => {
        const value = scores[key];
        const percent = Math.max(0, Math.min(100, typeof value === 'number' ? value * 20 : 0));
        const band = getVisualBand(percent);
        return (
          <div key={key} className="flex items-center gap-3 h-6">
            <div className="w-32 flex-shrink-0 text-xs text-neutral-600">{label}</div>
            <div
              className="flex-1 min-w-0 h-1.5 rounded-full overflow-hidden"
              style={{ background: 'var(--bar-track)' }}
            >
              <div
                className="h-full rounded-full relative transition-all duration-500 overflow-hidden"
                style={{ width: `${percent}%`, background: band.gradientVar }}
              >
                <span
                  className="absolute inset-0 rounded-full pointer-events-none"
                  style={{
                    background: 'linear-gradient(to bottom, rgba(255,255,255,0.45), rgba(255,255,255,0))',
                    mixBlendMode: 'overlay',
                  }}
                  aria-hidden
                />
              </div>
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
