'use client';

const TRACK_BG = '#1a2632';

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
  if (percent >= 70) return '#3b82f6';
  if (percent >= 50) return '#f97316';
  return '#eab308';
}

export function DomainBarsV2({ scores }: { scores: DomainScores }) {
  return (
    <div className="space-y-4">
      {DOMAINS.map(({ key, label }) => {
        const value = scores[key];
        const percent = Math.max(0, Math.min(100, typeof value === 'number' ? value * 20 : 0));
        const color = barColor(percent);
        return (
          <div key={key} className="flex items-center gap-4">
            <div className="w-48 flex-shrink-0 text-sm font-medium text-slate-300">
              {label}
            </div>
            <div
              className="flex-1 h-6 rounded-full overflow-hidden"
              style={{ background: TRACK_BG }}
            >
              <div
                className="h-full rounded-full transition-all duration-700 ease-out"
                style={{
                  width: `${percent}%`,
                  background: color,
                }}
              />
            </div>
            <div className="w-12 flex-shrink-0 text-right text-sm font-semibold tabular-nums text-slate-200">
              {Math.round(percent)}%
            </div>
          </div>
        );
      })}
    </div>
  );
}
