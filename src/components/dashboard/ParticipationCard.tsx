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
    <div className="rounded-bi-lg bg-bi-surfaceCard border border-bi-borderSubtle p-5 shadow-bi-sm">
      <p className="text-4xl md:text-5xl font-semibold tabular-nums text-bi-text leading-none">
        {Math.round(participationPercent)}%
      </p>
      <p className="mt-2 text-sm text-bi-textMuted">Participation</p>
      {trend != null && (
        <p className="mt-1 text-sm text-bi-textMuted">
          {trend >= 0 ? '+' : ''}
          {trend.toFixed(1)}% vs previous period
        </p>
      )}
      {showWarning && (
        <span className="mt-3 inline-block rounded-bi-sm px-2 py-1 text-xs font-medium bg-bi-warning text-white">
          Below target
        </span>
      )}
    </div>
  );
}
