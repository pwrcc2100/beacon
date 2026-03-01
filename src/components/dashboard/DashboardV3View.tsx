'use client';

import { useMemo } from 'react';
import { ReportDomainBars } from './ReportDomainBars';
import { ReportTeamRiskList } from './ReportTeamRiskList';
import { SparklineMini } from './SparklineMini';
import {
  computeDomainPriority,
  computeParticipationConfidence,
  computeDomainHeatPanel,
  getTopPressureDomains,
  getControlForPressure,
  getRiskLabelShort,
} from '@/lib/executiveLogic';
import { getVisualBand } from '@/lib/visualBand';
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

  const teamsBelow = data.attentionTeams.filter((t) => t.wellbeing < 60).length;
  const totalTeams = data.attentionTeams.length;

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

  const pressureTiles = useMemo(
    () => getTopPressureDomains(domainHeatRows, teamScoresRaw),
    [domainHeatRows, teamScoresRaw]
  );

  const controlTiles = useMemo(
    () => pressureTiles.map((p) => getControlForPressure(p.key, p.pattern)),
    [pressureTiles]
  );

  const overallDelta = useMemo(
    () => computeDelta(data.overallScore, data.previousScore ?? undefined),
    [data.overallScore, data.previousScore]
  );

  const riskLabel = getRiskLabelShort(data.overallScore);
  const sparklinePoints = useMemo(
    () => (data.trendSeries ?? []).map((t) => t.wellbeing),
    [data.trendSeries]
  );

  return (
    <div className="min-h-screen bg-[var(--surface-2)] text-neutral-800">
      <header className="border-b border-[var(--stroke-soft)] px-3 py-2 bg-[var(--surface)]" style={{ boxShadow: 'var(--shadow-soft)' }}>
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <a href="/dashboard" className="text-xs text-neutral-500 hover:text-neutral-700">← Dashboard</a>
          <span className="text-xs font-medium text-neutral-600">Executive Report</span>
          <p className="text-xs text-neutral-500">{data.periodLabel}</p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-3 py-2">
        <div
          className="rounded-lg overflow-hidden border border-[var(--stroke-soft)]"
          style={{
            background: 'radial-gradient(ellipse 120% 70% at 50% -10%, rgba(255,255,255,0.95), transparent 55%), var(--surface)',
            boxShadow: 'var(--shadow-soft)',
          }}
        >
          <div className="px-3 py-2 space-y-2.5">
            {/* ROW 1 — System State Strip (single band) */}
            <section className="flex flex-wrap items-center gap-x-4 gap-y-1.5 py-2 border-b border-[var(--stroke-soft)]">
              <span className="text-2xl font-bold tabular-nums text-neutral-900">{Math.round(data.overallScore)}</span>
              {overallDelta !== 0 && (
                <span className={`text-sm font-semibold tabular-nums ${overallDelta > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                  {overallDelta > 0 ? '↑' : '↓'} {overallDelta > 0 ? '+' : ''}{overallDelta}
                </span>
              )}
              <SparklineMini points={sparklinePoints} />
              <span
                className="text-[10px] font-semibold px-2 py-0.5 rounded-full border border-[var(--stroke-soft)]"
                style={{
                  background: riskLabel === 'Elevated' ? 'var(--grad-risk)' : riskLabel === 'Watch' ? 'var(--grad-warn)' : 'var(--grad-ok)',
                  color: riskLabel === 'Elevated' ? 'white' : riskLabel === 'Watch' ? '#78350f' : '#0c4a6e',
                  boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.35)',
                }}
              >
                {riskLabel}
              </span>
              <span className="text-xs text-neutral-600">
                {teamsBelow}/{totalTeams} below tolerance
              </span>
              <span
                className="text-[10px] font-medium px-2 py-0.5 rounded-full border border-[var(--stroke-soft)]"
                style={{
                  background: participation.level === 'low' ? 'var(--grad-risk)' : participation.level === 'moderate' ? 'var(--grad-warn)' : 'var(--grad-ok)',
                  color: participation.level === 'low' ? 'white' : participation.level === 'moderate' ? '#78350f' : '#0c4a6e',
                  boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.35)',
                }}
              >
                {participation.label}
              </span>
            </section>

            {/* ROW 2 + 3 — Pressure Panel + Controls (tethered) */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {pressureTiles.map((pressure, i) => {
                const band = getVisualBand(pressure.score100);
                const control = controlTiles[i];
                return (
                  <div key={pressure.key} className="flex flex-col gap-1.5">
                    {/* Pressure tile */}
                    <div className="rounded-md border border-[var(--stroke-soft)] bg-[var(--surface-2)] px-2.5 py-2" style={{ boxShadow: '0 1px 3px rgba(15,30,40,0.06)' }}>
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <span className="font-semibold text-sm text-neutral-900">{pressure.label}</span>
                        <span
                          className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full border border-[var(--stroke-soft)]"
                          style={{
                            background: pressure.pattern === 'Systemic' ? 'var(--grad-risk)' : pressure.pattern === 'Persistent' ? 'var(--grad-warn)' : 'var(--grad-ok)',
                            color: pressure.pattern === 'Systemic' ? 'white' : '#0c4a6e',
                            boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.35)',
                          }}
                        >
                          {pressure.pattern}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className="text-lg font-bold tabular-nums text-neutral-800">{Math.round(pressure.score100)}</span>
                        {pressure.delta !== 0 && (
                          <span className={`text-xs font-medium tabular-nums ${pressure.delta > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                            {pressure.delta > 0 ? '↑' : '↓'} {pressure.delta > 0 ? '+' : ''}{pressure.delta}
                          </span>
                        )}
                        <span className="text-[10px] text-neutral-500">
                          {Array.from({ length: Math.min(pressure.persistencePeriods, 3) }, () => '●').join('')}
                          {pressure.persistencePeriods > 0 && ` ${pressure.persistencePeriods}p`}
                        </span>
                      </div>
                      <div className="mt-1 h-1 rounded-full overflow-hidden bg-[var(--bar-track)]">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{ width: `${pressure.breadthPct}%`, background: band.gradientVar }}
                        />
                      </div>
                    </div>
                    {/* Control tile (tethered) */}
                    {control && (
                      <div className="rounded-md border border-[var(--stroke-soft)] bg-[var(--surface)] px-2.5 py-2" style={{ boxShadow: '0 1px 3px rgba(15,30,40,0.06)' }}>
                        <p className="font-semibold text-xs text-neutral-900">{control.leverTitle}</p>
                        <p className="text-[10px] text-neutral-600 mt-0.5">{control.rationale}</p>
                        <ul className="mt-1 space-y-0.5 list-disc list-inside text-[11px] text-neutral-600">
                          {control.steps.map((s, j) => (
                            <li key={j}>{s}</li>
                          ))}
                        </ul>
                        <p className="text-[10px] text-neutral-500 mt-1">{control.impactWindow}</p>
                        <p className="text-[10px] text-neutral-600 mt-0.5">
                          <strong>Success:</strong> {control.successSignal}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </section>

            {/* ROW 4 — Evidence (compact) */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1.5 border-t border-[var(--stroke-soft)]">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 mb-1">Domain breakdown</p>
                <ReportDomainBars scores={data.domainScores} />
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 mb-1">Team risk (top 10)</p>
                <ReportTeamRiskList teams={data.attentionTeams} maxItems={10} />
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
