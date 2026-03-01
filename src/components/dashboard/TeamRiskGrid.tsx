'use client';

import { useMemo, useState } from 'react';
import { tokens } from '@/styles/tokens';
import { getScoreStatusLabel, isBelowRiskThreshold } from '@/lib/dashboardConstants';
import type { AttentionTeam } from '@/app/dashboard/dashboardData';

function barColor(percent: number): string {
  if (percent >= 70) return tokens.barGood;
  if (percent >= 50) return tokens.barWatch;
  return tokens.barAlert;
}

export type TeamRiskGridProps = {
  teams: AttentionTeam[];
};

export function TeamRiskGrid({ teams }: TeamRiskGridProps) {
  const [sortBestFirst, setSortBestFirst] = useState(false);
  const [onlyRequiringAttention, setOnlyRequiringAttention] = useState(false);

  const filtered = useMemo(() => {
    if (!onlyRequiringAttention) return teams;
    return teams.filter((t) => isBelowRiskThreshold(t.wellbeing));
  }, [teams, onlyRequiringAttention]);

  const sorted = useMemo(() => {
    const copy = [...filtered];
    copy.sort((a, b) => (sortBestFirst ? b.wellbeing - a.wellbeing : a.wellbeing - b.wellbeing));
    return copy;
  }, [filtered, sortBestFirst]);

  const badgeClass = (status: string) =>
    status === 'Elevated risk'
      ? 'bg-bi-danger text-white'
      : status === 'Emerging risk'
        ? 'bg-bi-warning text-white'
        : 'bg-bi-surfaceAlt text-bi-textMuted';

  if (teams.length === 0) {
    return (
      <p className="bi-body-muted py-8 text-center">
        No team data for the selected filters.
      </p>
    );
  }

  if (filtered.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="bi-body-muted">No teams requiring attention for the selected filters.</p>
        <button
          type="button"
          onClick={() => setOnlyRequiringAttention(false)}
          className="mt-2 bi-label text-bi-accent hover:underline"
        >
          Show all teams
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Controls: sort + filter — fixed above scroll */}
      <div className="flex flex-wrap items-center gap-4 p-4 md:p-5 border-b border-bi-borderSeparator shrink-0">
        <div className="flex items-center gap-2">
          <span className="bi-caption text-bi-textMuted">Sort:</span>
          <button
            type="button"
            onClick={() => setSortBestFirst(!sortBestFirst)}
            className="rounded-bi-md border border-bi-borderSubtle bg-bi-surfaceAlt/50 px-3 py-1.5 bi-caption font-medium text-bi-text hover:bg-bi-surfaceAlt focus:outline-none focus:ring-2 focus:ring-bi-borderFocus"
          >
            {sortBestFirst ? 'Best first' : 'Worst first'}
          </button>
        </div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={onlyRequiringAttention}
            onChange={(e) => setOnlyRequiringAttention(e.target.checked)}
            className="rounded border-bi-borderSubtle text-bi-accent focus:ring-bi-borderFocus"
          />
          <span className="bi-caption text-bi-textMuted">Show only teams requiring attention</span>
        </label>
      </div>

      {/* Scrollable list of team row cards */}
      <div className="overflow-y-auto min-h-0 flex-1" style={{ maxHeight: '420px' }}>
        <ul className="space-y-3 list-none p-4 md:p-5 m-0">
        {sorted.map((team) => {
          const score = Math.round(team.wellbeing);
          const percent = Math.max(0, Math.min(100, team.wellbeing));
          const status = getScoreStatusLabel(score);
          const belowRisk = isBelowRiskThreshold(score);
          const displayName = team.displayName ?? team.name;

          return (
            <li
              key={team.id}
              className={`rounded-bi-lg border border-bi-borderSubtle bg-bi-surfaceCard p-4 md:p-5 shadow-bi-sm transition-colors ${
                belowRisk ? 'border-l-4 border-l-bi-risk' : ''
              }`}
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
                {/* Team name — single line, truncate, full name on hover */}
                <div className="min-w-0 md:w-44 flex-shrink-0">
                  <span
                    className="block bi-body font-medium text-bi-text truncate"
                    title={displayName}
                  >
                    {displayName}
                  </span>
                </div>

                {/* Pill bar (same behaviour as Domain Breakdown) — full width on mobile */}
                <div
                  className="flex-1 min-w-0 h-2 rounded-full overflow-hidden"
                  style={{ background: tokens.barTrack }}
                >
                  <div
                    className="h-full rounded-full transition-all duration-500 ease-out"
                    style={{
                      width: `${percent}%`,
                      background: barColor(percent),
                    }}
                  />
                </div>

                {/* Score + badge + participation + trend */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 flex-shrink-0">
                  <span className="tabular-nums font-semibold text-bi-text text-sm w-10 text-right">
                    {score}
                  </span>
                  <span
                    className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide ${badgeClass(status)}`}
                  >
                    {status.replace(' risk', '')}
                  </span>
                  <span className="bi-caption text-bi-textMuted tabular-nums">
                    {team.participationPercent != null ? `${team.participationPercent}%` : '—'} part.
                  </span>
                  <span className="bi-caption text-bi-textSubtle" aria-hidden>
                    —
                  </span>
                </div>
              </div>
            </li>
          );
        })}
        </ul>
      </div>
    </div>
  );
}
