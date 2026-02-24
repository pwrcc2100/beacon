'use client';

import { SCORE_COLORS, getScoreStatus, scoreToPercent } from './scoreTheme';

function hexToRgba(hex: string, alpha = 0.65) {
  if (!hex || !hex.startsWith('#') || (hex.length !== 7 && hex.length !== 9)) {
    return hex;
  }
  const value = hex.length === 9 ? hex.slice(1, 7) : hex.slice(1);
  const bigint = parseInt(value, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

const QUESTION_COPY = [
  { key: 'sentiment', label: 'Q1', description: 'How are you feeling about work this week?' },
  { key: 'clarity', label: 'Q2', description: 'How clear are you about your priorities?' },
  { key: 'workload', label: 'Q3', description: 'How manageable is your current workload?' },
  { key: 'safety', label: 'Q4', description: 'How comfortable do you feel speaking up?' },
  { key: 'leadership', label: 'Q5', description: 'How supported do you feel by your immediate leadership?' },
] as const;

type QuestionScores = Record<'sentiment' | 'clarity' | 'workload' | 'safety' | 'leadership', number | undefined>;

type GroupLeaderCardProps = {
  teamName: string;
  indexPercent?: number;
  questionScores: QuestionScores;
  historicalPoints: { label: string; value: number }[];
  insight: string;
};

function Sparkline({ points, color }: { points: { label: string; value: number }[]; color: string }) {
  if (points.length === 0) {
    return <div className="text-xs text-muted-foreground">No trend data yet</div>;
  }

  const padding = 6;
  const width = 220;
  const height = 70;
  const values = points.map(point => point.value);
  const max = Math.max(...values, 100);
  const min = Math.min(...values, 0);
  const range = max - min || 1;
  const step = points.length > 1 ? (width - padding * 2) / (points.length - 1) : 0;

  const path = points
    .map((point, index) => {
      const x = padding + index * step;
      const y = height - padding - ((point.value - min) / range) * (height - padding * 2);
      return `${index === 0 ? 'M' : 'L'}${x},${y}`;
    })
    .join(' ');

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-24">
      <path d={`M${padding},${height - padding} L${width - padding},${height - padding}`} stroke="#E2E8F0" strokeWidth={1.5} fill="none" />
      <path d={path} stroke={color} strokeWidth={2.5} fill="none" strokeLinecap="round" />
      {points.map((point, index) => {
        const x = padding + index * step;
        const y = height - padding - ((point.value - min) / range) * (height - padding * 2);
        return (
          <circle key={index} cx={x} cy={y} r={3} fill="#fff" stroke={color} strokeWidth={1.5}>
            <title>{point.label}</title>
          </circle>
        );
      })}
    </svg>
  );
}

export function GroupLeaderCard({ teamName, indexPercent, questionScores, historicalPoints, insight }: GroupLeaderCardProps) {
  const indexStatus = getScoreStatus(indexPercent ?? 0);
  const indexLabel = indexPercent !== undefined ? `${Math.round(indexPercent)}%` : '—';
  const periodStart = historicalPoints[0]?.label;
  const periodEnd = historicalPoints[historicalPoints.length - 1]?.label;

  return (
    <div className="flex flex-col gap-6 rounded-[28px] border border-[#E2E8F0] bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs uppercase tracking-wide text-[var(--text-muted)] font-semibold">Team</div>
          <div className="text-xl font-semibold text-[var(--text-primary)]">{teamName}</div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <div className="text-xs uppercase tracking-wide text-[var(--text-muted)] font-semibold">Beacon Index</div>
          <div className="relative h-12 w-12">
            <span
              className="absolute inset-0 rounded-full border border-black/10 shadow-sm"
              style={{ backgroundColor: indexStatus.color ?? SCORE_COLORS.neutral }}
              aria-label={`${teamName} Beacon Index status`}
            />
            <span className="absolute inset-0 flex items-center justify-center text-[0.75rem] font-semibold text-white">
              {indexLabel}
            </span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-base font-semibold text-[var(--text-primary)] mb-4">Beacon Index Inputs</h3>
        <div className="space-y-3">
          {QUESTION_COPY.map(({ key, label, description }) => {
            const value = questionScores[key];
            const hasValue = value !== undefined && value !== null;
            const percent = hasValue ? scoreToPercent(value, 'five') ?? 0 : 0;
            const status = getScoreStatus(hasValue ? percent : undefined);

            return (
              <div key={key} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold text-[var(--text-primary)]">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center justify-center rounded-full px-3 py-1 text-white" style={{ backgroundColor: status.color }}>
                      {label}
                    </span>
                    <span className="font-medium text-[var(--text-muted)]">{description}</span>
                  </div>
                  <span className="text-xs font-semibold text-[var(--text-muted)]">
                    {hasValue ? `${Math.round(percent)}%` : '—'}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-[#E2E8F0] overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${percent}%`,
                      backgroundColor: hexToRgba(status.color ?? SCORE_COLORS.neutral, 0.75),
                      transition: 'width 0.3s ease',
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="space-y-2">
        <div className="text-xs uppercase tracking-wide text-[var(--text-muted)]">Historical Index</div>
        <Sparkline points={historicalPoints} color={indexStatus.color ?? SCORE_COLORS.thriving} />
        <div className="flex items-center justify-between text-[0.7rem] text-[var(--text-muted)]">
          <span>{periodStart ? `Start: ${periodStart}` : 'No data'}</span>
          <span>{periodEnd && periodEnd !== periodStart ? `Latest: ${periodEnd}` : periodEnd ? `Latest: ${periodEnd}` : ''}</span>
        </div>
      </div>

      <div className="rounded-[18px] border border-dashed border-[#CBD5E1] bg-[#F8FAFF] px-4 py-3 text-sm text-[var(--text-muted)]">
        <span className="font-medium text-[var(--text-primary)]">Insight:</span> {insight}
      </div>
    </div>
  );
}


