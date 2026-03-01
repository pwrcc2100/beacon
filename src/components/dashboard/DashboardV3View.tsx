'use client';

import { useMemo } from 'react';
import { ReportGauge } from './ReportGauge';
import { ReportDomainBars } from './ReportDomainBars';
import { ReportTeamRiskList } from './ReportTeamRiskList';
import { getScoreInterpretation } from '@/lib/dashboardConstants';
import {
  computePrimaryFocusSystemic,
  computeDomainPriority,
  computeParticipationConfidence,
  getSystemicDomainCount,
  buildExposureVerdict,
  computeDomainHeatPanel,
  getDecisionGuidance,
} from '@/lib/executiveLogic';
import type { AttentionTeam } from '@/app/dashboard/dashboardData';
import type { DomainScores } from './DomainBars';
import type { RiskThresholds } from '@/lib/config/defaultThresholds';
import { computeDelta } from '@/lib/riskLogic';

export type DashboardV3Data = {
  overallScore: number;
  previousScore?: number | null;
  domainScores: DomainScores;
  previousDomainScores?: Partial<DomainScores> | null;
  participationPercent: number;
  previousParticipationPercent?: number | null;
  attentionTeams: AttentionTeam[];
  trendSeries?: Array<{ wellbeing: number }>;
  periodLabel: string;
  risk_thresholds?: RiskThresholds | null;
};

type DashboardV3ViewProps = {
  data: DashboardV3Data;
  clientId: string;
};

export function DashboardV3View({ data, clientId }: DashboardV3ViewProps) {
  const currentDomains = useMemo(
    () => ({
      experience: data.domainScores.experience,
      workload: data.domainScores.workload,
      safety: data.domainScores.safety,
      leadership: data.domainScores.leadership,
      clarity: data.domainScores.clarity,
    }),
    [data.domainScores]
  );

  const domainPriority = useMemo(
    () => computeDomainPriority(currentDomains, data.previousDomainScores ?? undefined),
    [currentDomains, data.previousDomainScores]
  );

  const teamScoresRaw = useMemo(
    () => data.attentionTeams.map((t) => t.wellbeing),
    [data.attentionTeams]
  );

  const primaryFocus = useMemo(
    () =>
      computePrimaryFocusSystemic({
        domainScoresCurrent: currentDomains,
        domainScoresPrevious: data.previousDomainScores ?? undefined,
        teamScores: teamScoresRaw,
        participationPercent: data.participationPercent,
        trendSeries: data.trendSeries,
      }),
    [currentDomains, data.previousDomainScores, teamScoresRaw, data.participationPercent, data.trendSeries]
  );

  const participationDelta = useMemo(
    () =>
      data.previousParticipationPercent != null
        ? data.participationPercent - data.previousParticipationPercent
        : 0,
    [data.participationPercent, data.previousParticipationPercent]
  );
  const participation = useMemo(
    () => computeParticipationConfidence(data.participationPercent, participationDelta),
    [data.participationPercent, participationDelta]
  );

  const teamsRequiringAttentionCount = data.attentionTeams.filter((t) => t.wellbeing < 60).length;
  const totalTeams = data.attentionTeams.length;

  const systemicDomainCount = useMemo(
    () => getSystemicDomainCount(currentDomains, data.previousDomainScores ?? undefined),
    [currentDomains, data.previousDomainScores]
  );

  const exposureVerdict = useMemo(
    () =>
      buildExposureVerdict({
        systemicDomainCount,
        totalTeams,
        participationLabel: participation.label,
      }),
    [systemicDomainCount, totalTeams, participation.label]
  );

  const domainHeatRows = useMemo(
    () =>
      computeDomainHeatPanel({
        domainScoresCurrent: currentDomains,
        domainScoresPrevious: data.previousDomainScores ?? undefined,
        teamScores: teamScoresRaw,
        participationLevel: participation.level,
      }),
    [currentDomains, data.previousDomainScores, teamScoresRaw, participation.level]
  );

  const primaryForGuidance = primaryFocus?.domain ?? domainPriority.primaryDomain;
  const secondaryForGuidance =
    domainPriority.domainsRanked.find((d) => d.key !== primaryForGuidance?.key) ?? domainPriority.secondaryDomain;
  const decisionGuidance = useMemo(
    () => getDecisionGuidance(primaryForGuidance, secondaryForGuidance ?? null, teamsRequiringAttentionCount),
    [primaryForGuidance, secondaryForGuidance, teamsRequiringAttentionCount]
  );

  const interpretation = getScoreInterpretation(data.overallScore);
  const overallDelta = useMemo(
    () => computeDelta(data.overallScore, data.previousScore ?? undefined),
    [data.overallScore, data.previousScore]
  );

  return (
    <div className="min-h-screen bg-neutral-100 text-neutral-800">
      <header className="bg-white border-b border-neutral-200 px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/dashboard" className="text-sm text-neutral-500 hover:text-neutral-700">← Dashboard</a>
            <span className="text-neutral-300">|</span>
            <h1 className="text-base font-semibold text-neutral-900">Beacon Index</h1>
            <span className="text-sm text-neutral-500">· Executive Report</span>
          </div>
          <p className="text-sm text-neutral-500">{data.periodLabel}</p>
        </div>
      </header>

      {/* 3-layer decision hierarchy: Exposure → Concentration → Action */}
      <main className="max-w-5xl mx-auto px-4 py-3">
        <div
          className="rounded-xl shadow-sm border border-neutral-200 overflow-hidden"
          style={{
            background: 'radial-gradient(ellipse 120% 70% at 50% -10%, rgba(255,255,255,0.95), transparent 55%), var(--surface)',
          }}
        >
          <div className="p-3 md:p-4 space-y-4">
            {/* Layer 1 – Exposure Snapshot (stacked, minimal white space) */}
            <section className="space-y-2 border-b border-neutral-100 pb-3">
              <div className="flex items-center gap-3">
                <ReportGauge score={data.overallScore} animate size={80} />
                <div className="flex flex-col gap-0.5">
                  {overallDelta !== 0 && (
                    <span
                      className={`text-sm font-semibold tabular-nums ${
                        overallDelta > 0 ? 'text-emerald-600' : 'text-red-600'
                      }`}
                    >
                      {overallDelta > 0 ? '↑' : '↓'} {overallDelta > 0 ? '+' : ''}{overallDelta} vs last period
                    </span>
                  )}
                  <p className="text-sm text-neutral-600">{interpretation}</p>
                </div>
              </div>
              <p className="text-sm font-medium text-neutral-800 leading-snug">{exposureVerdict}</p>
              <p className="text-xs text-neutral-500">
                Participation: {participation.label} ({Math.round(data.participationPercent)}%)
              </p>
            </section>

            {/* Layer 2 – Risk Concentration Panel (domain heat) */}
            <section>
              <h2 className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 mb-2">
                Risk concentration
              </h2>
              <div className="space-y-1">
                {domainHeatRows.map((row) => (
                  <div
                    key={row.key}
                    className={`flex flex-wrap items-center gap-x-3 gap-y-1 rounded-md px-3 py-2 text-sm ${
                      row.isSystemic ? 'bg-red-50 border border-red-200' : 'bg-neutral-50 border border-neutral-100'
                    }`}
                  >
                    <span className="font-medium text-neutral-900 min-w-[140px]">{row.label}</span>
                    <span className="tabular-nums font-semibold text-neutral-800">{Math.round(row.score100)}</span>
                    <span className="flex items-center gap-1">
                      {row.delta !== 0 && (
                        <span
                          className={`tabular-nums text-xs font-medium ${
                            row.delta > 0 ? 'text-emerald-600' : 'text-red-600'
                          }`}
                        >
                          {row.delta > 0 ? '↑' : '↓'} {row.delta > 0 ? '+' : ''}{row.delta}
                        </span>
                      )}
                      {row.consecutivePeriodsBelow60 > 0 && (
                        <span className="text-[10px] text-neutral-500">
                          ({row.consecutivePeriodsBelow60} period{row.consecutivePeriodsBelow60 === 1 ? '' : 's'} &lt;60)
                        </span>
                      )}
                    </span>
                    <span className="text-xs text-neutral-600">
                      {row.teamsBelow60}/{row.totalTeams} teams below tolerance
                      {row.totalTeams > 0
                        ? ` (${Math.round((row.teamsBelow60 / row.totalTeams) * 100)}%)`
                        : ''}
                    </span>
                    <span
                      className={`text-[10px] font-medium ${
                        row.participationLevel === 'high'
                          ? 'text-emerald-600'
                          : row.participationLevel === 'moderate'
                            ? 'text-amber-600'
                            : 'text-red-600'
                      }`}
                    >
                      {row.participationLevel} confidence
                    </span>
                    {row.isSystemic && (
                      <span
                        className="rounded-full text-[10px] font-semibold px-1.5 py-0.5 border border-[var(--stroke-soft)]"
                        style={{
                          background: 'var(--grad-risk)',
                          color: 'white',
                          boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.35)',
                        }}
                      >
                        Systemic
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Layer 3 – Decision Guidance (1–2 high-leverage actions) */}
            <section>
              <h2 className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 mb-2">
                Decision guidance
              </h2>
              <div className="space-y-3">
                {decisionGuidance.map((item, i) => (
                  <div
                    key={i}
                    className="rounded-lg border border-neutral-200 bg-neutral-50/50 px-4 py-3 space-y-2"
                  >
                    <p className="font-semibold text-neutral-900">{item.title}</p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-neutral-600">
                      <span><strong className="text-neutral-700">Scope:</strong> {item.scope}</span>
                      <span><strong className="text-neutral-700">Time:</strong> {item.timeHorizon}</span>
                    </div>
                    <p className="text-xs text-neutral-600">
                      <strong className="text-neutral-700">Success signal:</strong> {item.successSignal}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Supporting evidence */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-2 border-t border-neutral-100">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 mb-2">Domain breakdown</p>
                <ReportDomainBars scores={data.domainScores} />
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 mb-2">Team risk list</p>
                <ReportTeamRiskList teams={data.attentionTeams} maxItems={8} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
