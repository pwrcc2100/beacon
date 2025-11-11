'use client';

import { SCORE_COLORS, getScoreStatus, scoreToPercent } from './scoreTheme';

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
  wellbeingPercent?: number;
  questionScores: QuestionScores;
  historicalPoints: number[];
  insight: string;
};

function Sparkline({ points, color }: { points: number[]; color: string }) {
  if (points.length === 0) {
    return <div className="text-xs text-muted-foreground">No trend data yet</div>;
  }

  const padding = 6;
  const width = 180;
  const height = 70;
  const max = Math.max(...points, 100);
  const min = Math.min(...points, 0);
  const range = max - min || 1;
  const step = points.length > 1 ? (width - padding * 2) / (points.length - 1) : 0;

  const path = points
    .map((value, index) => {
      const x = padding + index * step;
      const y = height - padding - ((value - min) / range) * (height - padding * 2);
      return `${index === 0 ? 'M' : 'L'}${x},${y}`;
    })
    .join(' ');

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-20">
      <path d={`M${padding},${height - padding} L${width - padding},${height - padding}`} stroke="#E2E8F0" strokeWidth={1.5} fill="none" />
      <path d={path} stroke={color} strokeWidth={2.5} fill="none" strokeLinecap="round" />
      {points.map((value, index) => {
        const x = padding + index * step;
        const y = height - padding - ((value - min) / range) * (height - padding * 2);
        return (
          <circle key={index} cx={x} cy={y} r={3} fill="#fff" stroke={color} strokeWidth={1.5} />
        );
      })}
    </svg>
  );
}

export function GroupLeaderCard({ teamName, wellbeingPercent, questionScores, historicalPoints, insight }: GroupLeaderCardProps) {
  const wellbeingStatus = getScoreStatus(wellbeingPercent ?? 0);

  return (
    <div className="flex flex-col gap-6 rounded-[28px] border border-[#E2E8F0] bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs uppercase tracking-wide text-[var(--text-muted)] font-semibold">Team</div>
          <div className="text-xl font-semibold text-[var(--text-primary)]">{teamName}</div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span
            className="h-10 w-10 rounded-full border border-black/10 shadow-sm"
            style={{ backgroundColor: wellbeingStatus.color ?? SCORE_COLORS.neutral }}
            aria-label={`${teamName} wellbeing status`}
          />
          {wellbeingPercent !== undefined && (
            <span className="text-xs font-semibold text-[var(--text-muted)]">{Math.round(wellbeingPercent)}%</span>
          )}
        </div>
      </div>

      <div>
        <h3 className="text-base font-semibold text-[var(--text-primary)] mb-4">Current Sentiment</h3>
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
                    style={{ width: `${percent}%`, backgroundColor: status.color, transition: 'width 0.3s ease' }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="space-y-2">
        <div className="text-xs uppercase tracking-wide text-[var(--text-muted)]">Historical Wellbeing Score</div>
        <Sparkline points={historicalPoints} color={wellbeingStatus.color ?? SCORE_COLORS.thriving} />
      </div>

      <div className="rounded-[18px] border border-dashed border-[#CBD5E1] bg-[#F8FAFF] px-4 py-3 text-sm text-[var(--text-muted)]">
        <span className="font-medium text-[var(--text-primary)]">Insight:</span> {insight}
      </div>
    </div>
  );
}


