'use client';

import { RiskGauge } from './RiskGauge';
import { DomainBars, type DomainScores } from './DomainBars';
import { FilterBar, type Level1Option } from './FilterBar';
import { ParticipationCard } from './ParticipationCard';
import { TeamsRequiringAttentionCard } from './TeamsRequiringAttentionCard';
import { TeamIndexBreakdown } from './TeamIndexBreakdown';
import { BiCard, BiCardHeader, BiCardTitle, BiCardContent } from '@/components/ui/bi-card';
import type { ExecutiveInsight } from '@/lib/executiveInsights';
import type { AttentionTeam } from '@/app/dashboard/dashboardData';

export type DashboardV2Data = {
  overallScore: number;
  previousScore?: number;
  domainScores: DomainScores;
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
      {/* Top bar: product name, filters, export */}
      <header className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-4 border-b border-bi-border bg-bi-surface px-4 py-3">
        <div className="flex items-center gap-4">
          <a href="/dashboard" className="text-sm text-bi-textMuted hover:text-bi-text">
            ← Dashboard
          </a>
          <span className="text-bi-borderSubtle">|</span>
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
            className="rounded-bi-md border border-bi-border bg-bi-surface-alt px-3 py-2 text-sm font-medium text-bi-text hover:bg-bi-border"
          >
            Export
          </a>
        </div>
      </header>

      <main className="flex-1 p-6">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* 1. Executive Summary Row */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-bi-lg border border-bi-border bg-bi-surface-elevated p-6 shadow-bi-soft ring-1 ring-inset ring-bi-borderInner flex flex-col items-center justify-center">
              <p className="text-xs font-medium uppercase tracking-wider text-bi-textMuted w-full text-center">
                Composite Beacon Index score
              </p>
              <RiskGauge score={data.overallScore} animate />
            </div>
            <ParticipationCard
              participationPercent={data.participationPercent}
              previousParticipationPercent={data.previousParticipationPercent}
            />
            <TeamsRequiringAttentionCard count={data.teamsRequiringAttentionCount} />
          </section>

          {/* 2. System breakdown — Domain breakdown */}
          <section>
            <h2 className="text-lg font-bold text-bi-text mb-4">
              Current domain breakdown
            </h2>
            <BiCard className="rounded-bi-lg border border-bi-border bg-bi-surface-elevated shadow-bi-soft ring-1 ring-inset ring-bi-borderInner p-6">
              <BiCardContent className="p-0">
                <DomainBars scores={data.domainScores} />
              </BiCardContent>
            </BiCard>
          </section>

          {/* 3. Insight & action section */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <BiCard className="rounded-bi-lg border border-bi-border bg-bi-surface shadow-bi-soft overflow-hidden">
              <BiCardHeader className="pb-2">
                <BiCardTitle className="text-base font-bold text-bi-text">
                  What changed this week
                </BiCardTitle>
              </BiCardHeader>
              <BiCardContent>
                <p className="text-sm text-bi-textMuted leading-relaxed">
                  {whatChanged ? whatChanged.text : 'Complete another pulse to see week-over-week changes.'}
                </p>
              </BiCardContent>
            </BiCard>
            <BiCard className="rounded-bi-lg border border-bi-border bg-bi-surface shadow-bi-soft overflow-hidden">
              <BiCardHeader className="pb-2">
                <BiCardTitle className="text-base font-bold text-bi-text">
                  Recommended actions
                </BiCardTitle>
              </BiCardHeader>
              <BiCardContent>
                {recommended.length > 0 ? (
                  <ul className="space-y-2 text-sm text-bi-textMuted leading-relaxed">
                    {recommended.map((insight, i) => (
                      <li key={i}>{insight.text}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-bi-textMuted">
                    No specific actions right now. Keep monitoring your next pulse.
                  </p>
                )}
              </BiCardContent>
            </BiCard>
          </section>

          {/* 4. Team-level detail */}
          <section>
            <h2 className="text-lg font-bold text-bi-text mb-4">
              Index score breakdown by team
            </h2>
            <BiCard className="rounded-bi-lg border border-bi-border bg-bi-surface shadow-bi-soft overflow-hidden">
              <BiCardContent className="p-0">
                <TeamIndexBreakdown teams={data.attentionTeams} />
              </BiCardContent>
            </BiCard>
          </section>
        </div>
      </main>
    </div>
  );
}
