'use client';

import { PARTICIPATION_WARNING_THRESHOLD } from '@/lib/dashboardConstants';

export type ParticipationCardProps = {
  participationPercent: number;
  previousParticipationPercent?: number | null;
};

export function ParticipationCard({
  participationPercent,
  previousParticipationPercent,
}: ParticipationCardProps) {
  const trend =
    previousParticipationPercent != null
      ? participationPercent - previousParticipationPercent
      : null;
  const showWarning = participationPercent < PARTICIPATION_WARNING_THRESHOLD;

  return (
    <div className="rounded-bi-lg border border-bi-border bg-bi-surface-elevated p-5 shadow-bi-soft ring-1 ring-inset ring-bi-borderInner">
      <p className="text-xs font-medium uppercase tracking-wider text-bi-textMuted">
        Participation rate
      </p>
      <p className="mt-2 text-3xl font-semibold tabular-nums text-bi-text">
        {Math.round(participationPercent)}%
      </p>
      {trend != null && (
        <p className="mt-1 text-sm text-bi-textMuted">
          {trend >= 0 ? '+' : ''}
          {trend.toFixed(1)}% vs previous period
        </p>
      )}
      {showWarning && (
        <span
          className="mt-3 inline-block rounded-bi-sm px-2 py-1 text-xs font-medium"
          style={{
            background: 'var(--bi-warning)',
            color: 'var(--bi-bg)',
          }}
        >
          Below target
        </span>
      )}
    </div>
  );
}
