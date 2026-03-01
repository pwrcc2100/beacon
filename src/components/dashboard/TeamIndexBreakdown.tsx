'use client';

import { useMemo, useState } from 'react';
import { getScoreStatusLabel, isBelowRiskThreshold } from '@/lib/dashboardConstants';
import type { AttentionTeam } from '@/app/dashboard/dashboardData';

export type TeamIndexBreakdownProps = {
  teams: AttentionTeam[];
};

export function TeamIndexBreakdown({ teams }: TeamIndexBreakdownProps) {
  const [sortAsc] = useState(true);
  const sorted = useMemo(() => {
    const copy = [...teams];
    copy.sort((a, b) => (sortAsc ? a.wellbeing - b.wellbeing : b.wellbeing - a.wellbeing));
    return copy;
  }, [teams, sortAsc]);

  if (sorted.length === 0) {
    return (
      <p className="text-sm text-bi-textMuted py-6 text-center">
        No team data for the selected filters.
      </p>
    );
  }

  const badgeStyle = (status: string) =>
    status === 'Elevated risk'
      ? { background: 'var(--bi-danger)', color: 'var(--bi-bg)' }
      : status === 'Emerging risk'
        ? { background: 'var(--bi-warning)', color: 'var(--bi-bg)' }
        : { background: 'var(--bi-surface-alt)', color: 'var(--bi-text-muted)' };

  return (
    <>
      <div className="overflow-x-auto -mx-1 md:block hidden">
        <table className="w-full border-collapse min-w-[520px]">
          <thead>
            <tr>
              <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider text-bi-textMuted">
                Team
              </th>
              <th className="text-right py-3 px-4 text-xs font-semibold uppercase tracking-wider text-bi-textMuted">
                Index score
              </th>
              <th className="text-center py-3 px-4 text-xs font-semibold uppercase tracking-wider text-bi-textMuted">
                Status
              </th>
              <th className="text-right py-3 px-4 text-xs font-semibold uppercase tracking-wider text-bi-textMuted">
                Participation
              </th>
              <th className="text-center py-3 px-4 text-xs font-semibold uppercase tracking-wider text-bi-textMuted w-10">
                Trend
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((team) => {
              const score = Math.round(team.wellbeing);
              const status = getScoreStatusLabel(score);
              const belowRisk = isBelowRiskThreshold(score);
              return (
                <tr
                  key={team.id}
                  className={`border-t border-bi-borderSubtle transition-colors ${
                    belowRisk ? 'bg-bi-risk/5' : 'hover:bg-bi-surfaceAlt/50'
                  }`}
                >
                  <td className="py-3 px-4 text-sm font-medium text-bi-text">
                    {team.displayName ?? team.name}
                  </td>
                  <td className="py-3 px-4 text-right text-sm tabular-nums text-bi-text">
                    {score}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="inline-block rounded-bi-sm px-2 py-0.5 text-xs font-medium" style={badgeStyle(status)}>
                      {status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right text-sm text-bi-textMuted tabular-nums">
                    {team.participationPercent != null ? `${team.participationPercent}%` : '—'}
                  </td>
                  <td className="py-3 px-4 text-center text-bi-textMuted">—</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="md:hidden space-y-3">
        {sorted.map((team) => {
          const score = Math.round(team.wellbeing);
          const status = getScoreStatusLabel(score);
          const belowRisk = isBelowRiskThreshold(score);
          return (
            <div
              key={team.id}
              className={`rounded-bi-md border border-bi-borderSubtle p-4 ${
                belowRisk ? 'bg-bi-risk/5' : 'bg-bi-surface-alt/30'
              }`}
            >
              <div className="flex justify-between items-start gap-2">
                <span className="text-sm font-medium text-bi-text">{team.displayName ?? team.name}</span>
                <span className="text-sm tabular-nums text-bi-text font-semibold">{score}</span>
              </div>
              <div className="flex justify-between items-center mt-2 text-xs text-bi-textMuted">
                <span className="rounded-bi-sm px-2 py-0.5 font-medium" style={badgeStyle(status)}>
                  {status}
                </span>
                <span>{team.participationPercent != null ? `${team.participationPercent}% participation` : '—'}</span>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
