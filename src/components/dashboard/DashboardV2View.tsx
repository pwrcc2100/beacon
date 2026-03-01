'use client';

import { ExecutiveSummary } from './ExecutiveSummary';
import { DomainBars, type DomainScores } from './DomainBars';
import { FilterBar, type Level1Option } from './FilterBar';
import { TeamRiskGrid } from './TeamRiskGrid';
import { BiCard, BiCardHeader, BiCardTitle, BiCardContent } from '@/components/ui/bi-card';
import type { ExecutiveInsight } from '@/lib/executiveInsights';
import type { AttentionTeam } from '@/app/dashboard/dashboardData';

export type DashboardV2Data = {
  overallScore: number;
  previousScore?: number | null;
  domainScores: DomainScores;
  previousDomainScores?: Partial<DomainScores> | null;
  participationPercent: number;
  previousParticipationPercent?: number | null;
  teamsRequiringAttentionCount: number;
  trendSeries: { label: string; wellbeing: number }[];
  insights: ExecutiveInsight[];
  attentionTeams: AttentionTeam[];
  period: string;
  periodLabel: string;
  level1Label: string;
  level1Options: Level1Option[];
  currentLevel1Id: string | null;
};

type DashboardV2ViewProps = {
  data: DashboardV2Data;
  clientId: string;
  exportUrl: string;
};

const PERIOD_OPTIONS = [
  { value: 'week', label: 'Last 7 days' },
  { value: 'month', label: 'Last 30 days' },
  { value: 'quarter', label: 'Last quarter' },
  { value: 'all', label: 'All time' },
];

export function DashboardV2View({ data, clientId, exportUrl }: DashboardV2ViewProps) {
  const whatChanged = data.insights.find((i) => i.type === 'positive' || i.type === 'warning') ?? data.insights[0];
  const recommended = data.insights.filter((i) => i.type === 'warning' || i.type === 'attention').slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top bar: product name, filters, export — section surface */}
      <header className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-4 bg-bi-surfaceSection border-b border-bi-borderSubtle px-4 py-3 shadow-bi-sm">
        <div className="flex items-center gap-4">
          <a href="/dashboard" className="bi-label text-bi-textMuted hover:text-bi-text">
            ← Dashboard
          </a>
          <span className="text-bi-textSubtle" aria-hidden>|</span>
          <h1 className="text-lg font-semibold text-bi-text">Beacon Index</h1>
        </div>
        <div className="flex items-center gap-4">
          <FilterBar
            level1Label={data.level1Label}
            level1Options={data.level1Options}
            currentLevel1Id={data.currentLevel1Id}
            periodOptions={PERIOD_OPTIONS}
            currentPeriod={data.period}
            preserveParams={['client']}
          />
          <a
            href={exportUrl}
            className="rounded-bi-md border border-bi-borderSubtle bg-bi-surfaceCard px-3 py-2 bi-label text-bi-text hover:bg-bi-surfaceAlt focus:outline-none focus:ring-2 focus:ring-bi-borderFocus"
          >
            Export
          </a>
        </div>
      </header>

      <main className="flex-1 p-6 md:p-8">
        <div className="max-w-5xl mx-auto space-y-10">
          {/* 1. Executive Summary — decision instrument (primary focus) */}
          <ExecutiveSummary
            overallScore={data.overallScore}
            previousScore={data.previousScore ?? null}
            domainScores={data.domainScores}
            previousDomainScores={data.previousDomainScores ?? null}
            participationPercent={data.participationPercent}
            attentionTeams={data.attentionTeams}
            trendSeries={data.trendSeries}
            periodLabel={data.periodLabel}
          />

          {/* 2. Supporting evidence: Domain breakdown (1/3) + What changed / Actions (2/3) */}
          <section className="rounded-bi-lg bg-bi-surfaceSection p-5 md:p-6 shadow-bi-soft border border-bi-borderSubtle">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Left: Domain breakdown — 1/3 */}
              <div className="md:col-span-1">
                <p className="text-sm text-bi-textMuted mb-3">Domain breakdown</p>
                <div className="rounded-bi-lg bg-bi-surfaceCard border border-bi-borderSubtle p-4 shadow-bi-sm">
                  <DomainBars scores={data.domainScores} compact />
                </div>
              </div>
              {/* Right: Recommendations stacked — 2/3 */}
              <div className="md:col-span-2 flex flex-col gap-4">
                <BiCard className="rounded-bi-lg bg-bi-surfaceCard border border-bi-borderSubtle shadow-bi-sm overflow-hidden flex-1">
                  <BiCardHeader className="pb-2">
                    <BiCardTitle className="text-base font-semibold text-bi-text">
                      What changed this period
                    </BiCardTitle>
                  </BiCardHeader>
                  <BiCardContent>
                    <p className="bi-body-muted leading-relaxed">
                      {whatChanged ? whatChanged.text : 'Complete another pulse to see period-over-period changes.'}
                    </p>
                    <p className="mt-2 text-xs text-bi-textSubtle">
                      For leadership focus and behaviour shifts, see Executive Summary above.
                    </p>
                  </BiCardContent>
                </BiCard>
                <BiCard className="rounded-bi-lg bg-bi-surfaceCard border border-bi-borderSubtle shadow-bi-sm overflow-hidden flex-1">
                  <BiCardHeader className="pb-2">
                    <BiCardTitle className="text-base font-semibold text-bi-text">
                      Recommended actions
                    </BiCardTitle>
                  </BiCardHeader>
                  <BiCardContent>
                    {recommended.length > 0 ? (
                      <ul className="space-y-2 bi-body-muted leading-relaxed">
                        {recommended.map((insight, i) => (
                          <li key={i}>{insight.text}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="bi-body-muted">
                        No additional actions beyond the behaviour shifts in Executive Summary.
                      </p>
                    )}
                  </BiCardContent>
                </BiCard>
              </div>
            </div>
          </section>

          {/* 3. Team-level detail — section + card */}
          <section className="rounded-bi-lg bg-bi-surfaceSection p-5 md:p-6 shadow-bi-soft border border-bi-borderSubtle">
            <h2 className="text-xl font-semibold text-bi-text tracking-tight mb-4">
              Index score breakdown by team
            </h2>
            <div className="rounded-bi-lg bg-bi-surfaceCard border border-bi-borderSubtle shadow-bi-sm overflow-hidden">
              <TeamRiskGrid teams={data.attentionTeams} />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
