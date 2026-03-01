'use client';

import { useMemo } from 'react';
import { ReportGauge } from './ReportGauge';
import { ReportDomainBars } from './ReportDomainBars';
import { ReportTeamRiskList } from './ReportTeamRiskList';
import { getScoreInterpretation, getScoreStatusLabel } from '@/lib/dashboardConstants';
import {
  computePrimaryFocusSystemic,
  computeDomainPriority,
  computeTeamPriority,
  computeParticipationConfidence,
  getActionTiles,
  buildExecutiveRiskStatement,
} from '@/lib/executiveLogic';
import type { AttentionTeam } from '@/app/dashboard/dashboardData';
import type { DomainScores } from './DomainBars';
import type { ReasonFlag } from '@/lib/executiveLogic';

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
};

type DashboardV3ViewProps = {
  data: DashboardV3Data;
  clientId: string;
};

function ReasonFlagPill({ flag }: { flag: ReasonFlag }) {
  const iconMap = {
    trend: '↓',
    lowest: '◆',
    teams: '👥',
    periods: '↻',
    variance: 'σ',
  };
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-neutral-200/80 px-2 py-0.5 text-[11px] font-medium text-neutral-700">
      <span className="opacity-70" aria-hidden>{iconMap[flag.icon]}</span>
      {flag.label}
    </span>
  );
}

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

  const teamScoresForPriority = useMemo(
    () =>
      data.attentionTeams.map((t) => ({
        teamId: t.id,
        teamName: t.displayName ?? t.name,
        score: t.wellbeing,
        previousScore: (t as AttentionTeam & { previousScore?: number }).previousScore ?? null,
        participationPercent: t.participationPercent ?? null,
      })),
    [data.attentionTeams]
  );
  const teamsByPriority = useMemo(() => computeTeamPriority(teamScoresForPriority), [teamScoresForPriority]);

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

  const primaryForActions = primaryFocus?.domain ?? domainPriority.primaryDomain;
  const secondaryForActions = domainPriority.domainsRanked.find((d) => d.key !== primaryForActions?.key) ?? domainPriority.secondaryDomain;
  const actionTiles = useMemo(
    () => getActionTiles(primaryForActions, secondaryForActions ?? null),
    [primaryForActions, secondaryForActions]
  );

  const riskBandLabel = useMemo(() => getScoreStatusLabel(data.overallScore), [data.overallScore]);

  const teamsRequiringAttentionCount = data.attentionTeams.filter((t) => t.wellbeing < 60).length;
  const domainsAtRiskCount = domainPriority.domainsRanked.filter((d) => d.score100 < 70).length;

  const executiveRiskStatement = useMemo(() => {
    const label = primaryFocus?.domain?.label ?? domainPriority.primaryDomain?.label ?? 'overall wellbeing';
    const trendDirection =
      (primaryFocus?.domain?.delta ?? 0) < 0 ? 'declining' : (primaryFocus?.domain?.delta ?? 0) > 0 ? 'improving' : 'stable';
    return buildExecutiveRiskStatement({
      riskBandLabel,
      primaryDomainLabel: label,
      teamsBelow60: teamsRequiringAttentionCount,
      trendDirection,
    });
  }, [riskBandLabel, primaryFocus?.domain?.label, primaryFocus?.domain?.delta, domainPriority.primaryDomain?.label, teamsRequiringAttentionCount]);

  const interpretation = getScoreInterpretation(data.overallScore);

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

      {/* Single unified executive canvas */}
      <main className="max-w-5xl mx-auto px-4 py-3">
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
          <div className="p-3 md:p-4 space-y-3">
            {/* ROW 1: Executive Snapshot — gauge + 3 metrics in one tight row, ~25–30vh max */}
            <div
              className="flex flex-row items-center justify-between gap-3 py-2 border-b border-neutral-100 min-h-0 max-h-[30vh]"
              style={{ paddingTop: '0.4rem', paddingBottom: '0.4rem' }}
            >
              <div className="flex flex-row items-center gap-3 flex-shrink-0">
                <ReportGauge score={data.overallScore} animate size={72} />
                <p className="text-sm text-neutral-600 max-w-[200px] leading-tight hidden sm:block">
                  {interpretation}
                </p>
              </div>
              <div className="grid grid-cols-3 gap-2 flex-shrink-0">
                <div className="bg-neutral-50 rounded-lg px-2 py-2 text-center">
                  <p className="text-lg font-semibold text-neutral-900 tabular-nums">{teamsRequiringAttentionCount}</p>
                  <p className="text-[10px] text-neutral-500">Teams</p>
                </div>
                <div className="bg-neutral-50 rounded-lg px-2 py-2 text-center">
                  <p className="text-lg font-semibold text-neutral-900 tabular-nums">{domainsAtRiskCount}</p>
                  <p className="text-[10px] text-neutral-500">Domains</p>
                </div>
                <div className="bg-neutral-50 rounded-lg px-2 py-2 text-center">
                  <p className="text-sm font-semibold text-neutral-900">{participation.label}</p>
                  <p className="text-[10px] text-neutral-500">{Math.round(data.participationPercent)}%</p>
                </div>
              </div>
            </div>

            {/* ROW 2: Primary Focus — domain, score, trend, badge, reason flags */}
            <div className="bg-neutral-50 rounded-lg px-4 py-3 border-l-4 border-neutral-400">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">Primary focus</p>
              {primaryFocus ? (
                <>
                  <div className="flex flex-wrap items-baseline gap-2">
                    <p className="text-xl md:text-2xl font-bold text-neutral-900 tracking-tight">
                      {primaryFocus.domain.label}
                    </p>
                    {primaryFocus.type === 'systemic' && (
                      <span className="rounded bg-red-100 text-red-800 text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5">
                        Systemic risk
                      </span>
                    )}
                    {primaryFocus.type === 'emerging' && (
                      <span className="rounded bg-amber-100 text-amber-800 text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5">
                        Emerging signal
                      </span>
                    )}
                    {primaryFocus.domain.score100 < 60 && primaryFocus.type !== 'systemic' && primaryFocus.type !== 'emerging' && (
                      <span className="rounded bg-amber-100 text-amber-800 text-[10px] font-semibold px-1.5 py-0.5">
                        Below tolerance
                      </span>
                    )}
                  </div>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-bold text-neutral-900 tabular-nums">
                      {Math.round(primaryFocus.domain.score100)}
                    </span>
                    {primaryFocus.domain.delta !== 0 && (
                      <span
                        className={`text-sm font-semibold tabular-nums ${
                          primaryFocus.domain.delta > 0 ? 'text-emerald-600' : 'text-red-600'
                        }`}
                      >
                        {primaryFocus.domain.delta > 0 ? '↑' : '↓'} {primaryFocus.domain.delta > 0 ? '+' : ''}{primaryFocus.domain.delta}
                      </span>
                    )}
                  </div>
                  {(primaryFocus.persistenceLabel || primaryFocus.breadthLabel) && (
                    <p className="text-xs text-neutral-600 mt-1">
                      {[primaryFocus.persistenceLabel, primaryFocus.breadthLabel].filter(Boolean).join(' · ')}
                    </p>
                  )}
                  {primaryFocus.reasonFlags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {primaryFocus.reasonFlags.map((f) => (
                        <ReasonFlagPill key={f.id} flag={f} />
                      ))}
                    </div>
                  )}
                </>
              ) : domainPriority.primaryDomain ? (
                <>
                  <p className="text-xl font-bold text-neutral-900">{domainPriority.primaryDomain.label}</p>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-bold tabular-nums">{Math.round(domainPriority.primaryDomain.score100)}</span>
                    {domainPriority.primaryDomain.delta !== 0 && (
                      <span className={domainPriority.primaryDomain.delta > 0 ? 'text-emerald-600' : 'text-red-600'}>
                        {domainPriority.primaryDomain.delta > 0 ? '+' : ''}{domainPriority.primaryDomain.delta}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-neutral-600 mt-1">{domainPriority.primaryDomain.whyShort}</p>
                </>
              ) : (
                <p className="text-neutral-600 font-medium">No domain below tolerance.</p>
              )}
            </div>

            {/* Executive Risk Statement — single line under Primary Focus */}
            <p className="text-sm font-medium text-neutral-700 leading-snug">
              {executiveRiskStatement}
            </p>

            {/* ROW 3: Two ActionTiles side by side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {actionTiles.map((tile, i) => (
                <div key={i} className="rounded-lg border border-neutral-200 bg-neutral-50/50 px-4 py-3">
                  <p className="font-semibold text-neutral-900 text-base">{tile.title}</p>
                  <ul className="mt-2 space-y-1 text-sm text-neutral-600 list-disc list-inside">
                    <li>{tile.steps[0]}</li>
                    <li>{tile.steps[1]}</li>
                  </ul>
                  <p className="mt-2 text-[11px] text-neutral-500">
                    <span className="font-medium text-neutral-600">Success:</span> {tile.successCue}
                  </p>
                  <p className="mt-0.5 text-[10px] text-neutral-400">{tile.timeframe}</p>
                </div>
              ))}
            </div>

            {/* ROW 4: Supporting evidence — domain left, team list right */}
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
