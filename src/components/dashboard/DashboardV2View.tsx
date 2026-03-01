'use client';

import { useRouter } from 'next/navigation';
import { RiskGauge } from './RiskGauge';
import { DomainBars, type DomainScores } from './DomainBars';
import { BiCard, BiCardHeader, BiCardTitle, BiCardContent } from '@/components/ui/bi-card';
import { Divider } from '@/components/ui/divider';
import type { ExecutiveInsight } from '@/lib/executiveInsights';

export type DashboardV2Data = {
  overallScore: number;
  previousScore?: number;
  domainScores: DomainScores;
  participationPercent: number;
  trendSeries: { label: string; wellbeing: number }[];
  insights: ExecutiveInsight[];
  period: string;
  periodLabel: string;
};

type DashboardV2ViewProps = {
  data: DashboardV2Data;
  clientId: string;
  exportUrl: string;
};

export function DashboardV2View({ data, clientId, exportUrl }: DashboardV2ViewProps) {
  const router = useRouter();
  const trendChange = data.previousScore != null ? data.overallScore - data.previousScore : null;
  const changeText = trendChange != null
    ? trendChange > 0
      ? `+${trendChange.toFixed(1)}% from last period`
      : `${trendChange.toFixed(1)}% from last period`
    : null;

  const recommendedInsights = data.insights.filter(
    (i) => i.type === 'warning' || i.type === 'attention'
  ).slice(0, 2);
  const whatChangedInsight = data.insights.find((i) => i.type === 'positive' || i.type === 'warning') ?? data.insights[0];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top bar */}
      <header className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-bi-border bg-bi-surface px-4 py-3">
        <div className="flex items-center gap-4">
          <a href="/dashboard" className="text-sm text-bi-textMuted hover:text-bi-text">
            ← Dashboard
          </a>
          <Divider orientation="vertical" className="h-5" />
          <h1 className="text-lg font-semibold text-bi-text">Beacon Index</h1>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={data.period}
            onChange={(e) => {
              const next = new URLSearchParams(window.location.search);
              next.set('period', e.target.value);
              router.push(`/dashboard/v2?${next.toString()}`);
            }}
            className="w-36 rounded-bi-md border border-bi-border bg-bi-surface px-3 py-2 text-sm text-bi-text focus:outline-none focus:ring-2 focus:ring-bi-accent/50"
          >
            <option value="week">Last 7 days</option>
            <option value="month">Last 30 days</option>
            <option value="quarter">Last quarter</option>
            <option value="all">All time</option>
          </select>
          <a
            href={exportUrl}
            className="inline-flex items-center justify-center rounded-bi-md border border-bi-border bg-bi-surface-alt px-3 py-2 text-sm font-medium text-bi-text hover:bg-bi-border"
          >
            Export
          </a>
        </div>
      </header>

      <main className="flex-1 p-6">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Main layout: left = gauge, right = domain + insights */}
          <div className="grid gap-6 lg:grid-cols-[auto_1fr]">
            <BiCard className="p-6 lg:min-w-[240px]">
              <BiCardContent className="p-0 flex flex-col items-center">
                <RiskGauge score={data.overallScore} animate />
                {changeText && (
                  <p className="mt-3 text-xs text-bi-textMuted">{changeText}</p>
                )}
                <p className="mt-2 text-xs text-bi-textMuted">
                  {Math.round(data.participationPercent)}% participation
                </p>
              </BiCardContent>
            </BiCard>

            <div className="space-y-6">
              <BiCard className="p-6">
                <BiCardHeader className="p-0 pb-4">
                  <BiCardTitle className="text-base">Domain breakdown</BiCardTitle>
                </BiCardHeader>
                <BiCardContent className="p-0">
                  <DomainBars scores={data.domainScores} />
                </BiCardContent>
              </BiCard>

              <div className="grid gap-4 sm:grid-cols-2">
                <BiCard className="p-4">
                  <BiCardHeader className="p-0 pb-2">
                    <BiCardTitle className="text-sm font-medium">What changed this week</BiCardTitle>
                  </BiCardHeader>
                  <BiCardContent className="p-0">
                    {whatChangedInsight ? (
                      <p className="text-sm text-bi-textMuted">{whatChangedInsight.text}</p>
                    ) : (
                      <p className="text-sm text-bi-textMuted">
                        Complete another pulse to see week-over-week changes.
                      </p>
                    )}
                  </BiCardContent>
                </BiCard>

                <BiCard className="p-4">
                  <BiCardHeader className="p-0 pb-2">
                    <BiCardTitle className="text-sm font-medium">Recommended actions</BiCardTitle>
                  </BiCardHeader>
                  <BiCardContent className="p-0">
                    {recommendedInsights.length > 0 ? (
                      <ul className="space-y-2 text-sm text-bi-textMuted">
                        {recommendedInsights.map((insight, i) => (
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
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
