'use client';

import { useMemo } from 'react';
import { ReportDomainBars } from './ReportDomainBars';
import { SparklineMini } from './SparklineMini';
import {
  computeDomainHeatPanel,
  getTopPressureDomains,
  getControlForPressure,
  getSystemicDomainCount,
  getExecutiveVerdictSentence,
  getWhatToSayTomorrow,
  getWhatChangedThisPeriod,
} from '@/lib/executiveLogic';
import { getVisualBand } from '@/lib/visualBand';
import { getScoreStatusLabel } from '@/lib/dashboardConstants';
import type { AttentionTeam } from '@/app/dashboard/dashboardData';
import type { DomainScores } from './DomainBars';
import type { RiskThresholds } from '@/lib/config/defaultThresholds';
import { computeDelta } from '@/lib/riskLogic';

const PARTICIPATION_CAVEAT_THRESHOLD = 70;

export type DashboardV4Data = {
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

type DashboardV4ViewProps = {
  data: DashboardV4Data;
  clientId: string;
};

function truncate(str: string, maxLen: number): string {
  if (str.length <= maxLen) return str;
  return str.slice(0, maxLen - 1).trim() + '…';
}

export function DashboardV4View({ data, clientId }: DashboardV4ViewProps) {
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
    () =>
      (() => {
        const r = Math.max(0, Math.min(100, data.participationPercent));
        if (r >= 70) return { label: 'High confidence', level: 'high' as const };
        if (r >= 50) return { label: 'Moderate confidence', level: 'moderate' as const };
        return { label: 'Low confidence', level: 'low' as const };
      })(),
    [data.participationPercent]
  );

  const teamsBelow = data.attentionTeams.filter((t) => t.wellbeing < 60).length;
  const totalTeams = data.attentionTeams.length;
  const systemicDomainCount = useMemo(
    () => getSystemicDomainCount(currentDomains, data.previousDomainScores ?? undefined),
    [currentDomains, data.previousDomainScores]
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

  const verdictSentence = useMemo(
    () => getExecutiveVerdictSentence(systemicDomainCount, totalTeams),
    [systemicDomainCount, totalTeams]
  );

  const sparklinePoints = useMemo(
    () => (data.trendSeries ?? []).map((t) => t.wellbeing),
    [data.trendSeries]
  );

  const showConfidenceCaveat = data.participationPercent < PARTICIPATION_CAVEAT_THRESHOLD;

  const topTeams = useMemo(() => {
    const copy = [...data.attentionTeams];
    copy.sort((a, b) => a.wellbeing - b.wellbeing);
    return copy.slice(0, 8);
  }, [data.attentionTeams]);

  const whatChanged = useMemo(
    () => getWhatChangedThisPeriod(domainHeatRows, data.previousDomainScores ?? undefined),
    [domainHeatRows, data.previousDomainScores]
  );

  return (
    <div className="min-h-screen bg-[var(--surface-2)] text-neutral-800">
      <header className="border-b border-[var(--stroke-soft)] px-3 py-2 bg-[var(--surface)]" style={{ boxShadow: 'var(--shadow-soft)' }}>
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <a href="/dashboard" className="text-xs text-neutral-500 hover:text-neutral-700">← Dashboard</a>
          <span className="text-xs font-medium text-neutral-600">Boardroom · Executive Instrument</span>
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
          <div className="px-3 py-2.5 space-y-2.5">
            {/* SECTION 1 — Executive Verdict */}
            <section className="pb-2 border-b border-[var(--stroke-soft)]">
              <p className="text-sm font-semibold text-neutral-900 leading-snug">{verdictSentence}</p>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2">
                <span className="text-xl font-bold tabular-nums text-neutral-900">{Math.round(data.overallScore)}</span>
                {overallDelta !== 0 && (
                  <span className={`text-sm font-semibold tabular-nums ${overallDelta > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                    {overallDelta > 0 ? '↑' : '↓'} {overallDelta > 0 ? '+' : ''}{overallDelta}
                  </span>
                )}
                <SparklineMini points={sparklinePoints} />
                {showConfidenceCaveat && (
                  <span className="text-[10px] text-amber-700 font-medium">
                    Low participation — interpret with caution.
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {pressureTiles.slice(0, 2).map((p) => (
                  <span
                    key={p.key}
                    className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-[var(--stroke-soft)]"
                    style={{
                      background: p.pattern === 'Systemic' ? 'var(--grad-risk)' : p.pattern === 'Persistent' ? 'var(--grad-warn)' : 'var(--grad-ok)',
                      color: p.pattern === 'Systemic' ? 'white' : '#0c4a6e',
                      boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.35)',
                    }}
                  >
                    {p.label} · {p.pattern}
                  </span>
                ))}
              </div>
            </section>

            {/* SECTION 2 — Pressure & Concentration (two-column) */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="rounded-md border border-[var(--stroke-soft)] bg-[var(--surface-2)] p-2" style={{ boxShadow: '0 1px 3px rgba(15,30,40,0.06)' }}>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">Pressure map</p>
                {pressureTiles.map((p) => {
                  const band = getVisualBand(p.score100);
                  return (
                    <div key={p.key} className="flex flex-wrap items-center gap-x-2 gap-y-1 py-1.5 border-b border-[var(--stroke-soft)] last:border-0">
                      <span className="font-medium text-xs text-neutral-900">{p.label}</span>
                      <span className="text-sm font-bold tabular-nums">{Math.round(p.score100)}</span>
                      {p.delta !== 0 && (
                        <span className={`text-[10px] font-medium tabular-nums ${p.delta > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                          {p.delta > 0 ? '↑' : '↓'} {p.delta > 0 ? '+' : ''}{p.delta}
                        </span>
                      )}
                      <span className="text-[10px] text-neutral-500">
                        {Array.from({ length: Math.min(p.persistencePeriods, 3) }, () => '●').join('')}
                      </span>
                      <span
                        className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full border border-[var(--stroke-soft)]"
                        style={{
                          background: p.pattern === 'Systemic' ? 'var(--grad-risk)' : p.pattern === 'Persistent' ? 'var(--grad-warn)' : 'var(--grad-ok)',
                          color: p.pattern === 'Systemic' ? 'white' : '#0c4a6e',
                          boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.35)',
                        }}
                      >
                        {p.pattern}
                      </span>
                      <div className="w-full h-0.5 rounded-full bg-[var(--bar-track)] overflow-hidden mt-0.5">
                        <div className="h-full rounded-full" style={{ width: `${p.breadthPct}%`, background: band.gradientVar }} />
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="rounded-md border border-[var(--stroke-soft)] bg-[var(--surface-2)] p-2" style={{ boxShadow: '0 1px 3px rgba(15,30,40,0.06)' }}>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">Team concentration</p>
                <ul className="space-y-1 list-none p-0 m-0">
                  {topTeams.map((team) => {
                    const score = Math.round(team.wellbeing);
                    const percent = Math.max(0, Math.min(100, team.wellbeing));
                    const status = getScoreStatusLabel(score);
                    const band = getVisualBand(percent);
                    const label = truncate(team.displayName ?? team.name, 28);
                    return (
                      <li key={team.id} className="flex items-center gap-2 py-1">
                        <span className="flex-1 min-w-0 text-[11px] text-neutral-800 truncate" title={team.displayName ?? team.name}>
                          {label}
                        </span>
                        <div className="flex-1 min-w-[48px] h-1 rounded-full bg-[var(--bar-track)] overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{ width: `${percent}%`, background: band.gradientVar }}
                          />
                        </div>
                        <span className="text-[10px] font-semibold tabular-nums w-6 text-right">{score}</span>
                        <span
                          className="text-[9px] font-medium px-1.5 py-0.5 rounded-full border border-[var(--stroke-soft)]"
                          style={{
                            background: band.gradientVar,
                            color: band.band === 'risk' ? 'white' : band.band === 'warn' ? '#78350f' : '#0c4a6e',
                            boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.35)',
                          }}
                        >
                          {status.replace(' risk', '')}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </section>

            {/* SECTION 3 — Decision Levers (2 max) */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {controlTiles.slice(0, 2).map((ctrl, i) => (
                <div
                  key={i}
                  className="rounded-md border border-[var(--stroke-soft)] bg-[var(--surface)] p-2.5"
                  style={{ boxShadow: '0 1px 3px rgba(15,30,40,0.06)' }}
                >
                  <p className="font-semibold text-sm text-neutral-900">{ctrl.leverTitle}</p>
                  <p className="text-[10px] text-neutral-500 mt-0.5">
                    {teamsBelow} team{teamsBelow === 1 ? '' : 's'} in scope
                  </p>
                  <p className="text-xs text-neutral-700 mt-1 italic">
                    “{getWhatToSayTomorrow(pressureTiles[i]?.label ?? 'this area', pressureTiles[i]?.pattern ?? 'Emerging', teamsBelow)}”
                  </p>
                  <ul className="mt-1.5 space-y-0.5 list-disc list-inside text-[11px] text-neutral-600">
                    {ctrl.steps.slice(0, 3).map((s, j) => (
                      <li key={j}>{s}</li>
                    ))}
                  </ul>
                  <p className="text-[10px] text-neutral-600 mt-1.5">
                    <strong>Success looks like:</strong> {ctrl.successSignal}
                  </p>
                </div>
              ))}
            </section>

            {/* SECTION 4 — Supporting Evidence (collapsed) */}
            <details className="group">
              <summary className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 cursor-pointer list-none py-1">
                Supporting evidence
              </summary>
              <div className="pt-2 space-y-2 border-t border-[var(--stroke-soft)] mt-1">
                <p className="text-[11px] text-neutral-600">{whatChanged}</p>
                <ReportDomainBars scores={data.domainScores} />
              </div>
            </details>
          </div>
        </div>
      </main>
    </div>
  );
}
