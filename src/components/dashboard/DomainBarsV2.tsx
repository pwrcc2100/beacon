'use client';

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

function barColor(percent: number, isLight: boolean): string {
  if (percent >= 70) return isLight ? '#2A8C8A' : '#3b82f6';
  if (percent >= 50) return isLight ? '#2F6F7E' : '#f97316';
  return isLight ? '#2B4162' : '#eab308';
}

export function DomainBarsV2({ scores, variant = 'light' }: { scores: DomainScores; variant?: 'light' | 'dark' }) {
  const isLight = variant === 'light';
  const trackBg = isLight ? '#E8ECF0' : '#1a2632';
  const labelColor = isLight ? '#2E4057' : '#94a3b8';
  const valueColor = isLight ? '#0B1B2B' : '#e2e8f0';

  return (
    <div className="space-y-4">
      {DOMAINS.map(({ key, label }) => {
        const value = scores[key];
        const percent = Math.max(0, Math.min(100, typeof value === 'number' ? value * 20 : 0));
        const color = barColor(percent, isLight);
        return (
          <div key={key} className="flex items-center gap-4">
            <div className="w-48 flex-shrink-0 text-sm font-medium" style={{ color: labelColor }}>
              {label}
            </div>
            <div
              className="flex-1 h-6 rounded-full overflow-hidden"
              style={{ background: trackBg }}
            >
              <div
                className="h-full rounded-full transition-all duration-700 ease-out"
                style={{
                  width: `${percent}%`,
                  background: color,
                }}
              />
            </div>
            <div className="w-12 flex-shrink-0 text-right text-sm font-semibold tabular-nums" style={{ color: valueColor }}>
              {Math.round(percent)}%
            </div>
          </div>
        );
      })}
    </div>
  );
}
