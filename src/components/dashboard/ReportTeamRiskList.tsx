'use client';

import { useMemo } from 'react';
import { getScoreStatusLabel } from '@/lib/dashboardConstants';
import type { AttentionTeam } from '@/app/dashboard/dashboardData';

function barColor(percent: number): string {
  if (percent >= 70) return '#0d7d4c';
  if (percent >= 50) return '#b45309';
  return '#c53030';
}

export interface ReportTeamRiskListProps {
  teams: AttentionTeam[];
  maxItems?: number;
}

export function ReportTeamRiskList({ teams, maxItems = 10 }: ReportTeamRiskListProps) {
  const sorted = useMemo(() => {
    const copy = [...teams];
    copy.sort((a, b) => a.wellbeing - b.wellbeing);
    return copy.slice(0, maxItems);
  }, [teams, maxItems]);

  if (sorted.length === 0) {
    return <p className="text-sm text-neutral-500 py-4">No team data.</p>;
  }

  return (
    <ul className="space-y-2 list-none p-0 m-0">
      {sorted.map((team) => {
        const score = Math.round(team.wellbeing);
        const percent = Math.max(0, Math.min(100, team.wellbeing));
        const status = getScoreStatusLabel(score);
        return (
          <li key={team.id} className="flex items-center gap-3 py-2 border-b border-neutral-100 last:border-0">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-neutral-800 truncate" title={team.displayName ?? team.name}>
                {team.displayName ?? team.name}
              </p>
            </div>
            <div className="flex-1 min-w-[80px] h-2 rounded-full bg-neutral-200 overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${percent}%`, backgroundColor: barColor(percent) }}
              />
            </div>
            <div className="w-10 text-right text-sm font-semibold tabular-nums text-neutral-800">{score}</div>
            <span
              className={`text-[10px] font-medium px-2 py-0.5 rounded ${
                status === 'Elevated risk'
                  ? 'bg-red-100 text-red-800'
                  : status === 'Emerging risk'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-neutral-100 text-neutral-600'
              }`}
            >
              {status.replace(' risk', '')}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
