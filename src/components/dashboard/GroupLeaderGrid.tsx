'use client';

import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { GroupLeaderCard } from './GroupLeaderCard';
import type { TeamSummary } from '@/app/dashboard/group-leader/page';

interface Props {
  teams: TeamSummary[];
  limit?: number;
}

export function GroupLeaderGrid({ teams, limit = 12 }: Props) {
  const [sortMode, setSortMode] = useState<'score' | 'name'>('score');

  const sortedTeams = useMemo(() => {
    const copy = [...teams];
    if (sortMode === 'score') {
      copy.sort((a, b) => (a.indexPercent ?? -1) - (b.indexPercent ?? -1));
    } else {
      copy.sort((a, b) => a.name.localeCompare(b.name));
    }
    return copy.slice(0, limit);
  }, [teams, sortMode, limit]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="inline-flex rounded-md border border-black/10 overflow-hidden">
          <Button
            type="button"
            variant={sortMode === 'score' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setSortMode('score')}
            className="rounded-none"
          >
            Sort by Beacon Index
          </Button>
          <Button
            type="button"
            variant={sortMode === 'name' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setSortMode('name')}
            className="rounded-none"
          >
            Sort A–Z
          </Button>
        </div>
        <div className="text-sm text-[var(--text-muted)]">
          Showing <span className="font-semibold text-[var(--text-primary)]">{sortedTeams.length}</span> teams
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {sortedTeams.map(team => (
          <GroupLeaderCard
            key={team.id}
            teamName={team.displayName}
            indexPercent={team.indexPercent}
            questionScores={team.questionScores}
            historicalPoints={team.trend}
            insight={team.insight}
          />
        ))}
      </div>
    </div>
  );
}
