'use client';

import { useMemo } from 'react';
import { getScoreStatusLabel } from '@/lib/dashboardConstants';
import { getVisualBand } from '@/lib/visualBand';
import type { AttentionTeam } from '@/app/dashboard/dashboardData';

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
        const band = getVisualBand(percent);
        const shortLabel = status.replace(' risk', '');
        return (
          <li key={team.id} className="flex items-center gap-2 py-1.5 border-b border-[var(--stroke-soft)] last:border-0">
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-neutral-800 truncate" title={team.displayName ?? team.name}>
                {team.displayName ?? team.name}
              </p>
            </div>
            <div
              className="flex-1 min-w-[60px] h-1.5 rounded-full overflow-hidden"
              style={{ background: 'var(--bar-track)' }}
            >
              <div
                className="h-full rounded-full relative transition-all overflow-hidden"
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
            <div className="w-8 text-right text-xs font-semibold tabular-nums text-neutral-800">{score}</div>
            <span
              className="text-[10px] font-medium px-2 py-0.5 rounded-full border border-[var(--stroke-soft)]"
              style={{
                background: band.gradientVar,
                color: band.band === 'risk' ? 'white' : band.band === 'warn' ? '#78350f' : '#0c4a6e',
                boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.35)',
              }}
            >
              {shortLabel}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
