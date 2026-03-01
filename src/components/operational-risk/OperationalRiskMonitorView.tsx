'use client';

import { useMemo } from 'react';
import { SparklineMini } from '@/components/dashboard/SparklineMini';
import { getControlForPressure } from '@/lib/executiveLogic';
import type { PressurePattern } from '@/lib/executiveLogic';
import {
  buildDomainRiskTable,
  shouldShowLeverRecommendations,
  getTriggeredLeverRows,
  type DomainRiskRow,
  type DomainRiskPattern,
} from '@/lib/operationalRiskLogic';
import type { RiskThresholds } from '@/lib/config/defaultThresholds';
import type { AttentionTeam } from '@/app/dashboard/dashboardData';
import { computeDelta } from '@/lib/riskLogic';
import { getScoreStatusLabel } from '@/lib/dashboardConstants';

const DOMAIN_KEYS = ['experience', 'workload', 'safety', 'leadership', 'clarity'] as const;

function mapToPressurePattern(p: DomainRiskPattern): PressurePattern {
  if (p === 'Systemic decline') return 'Systemic';
  if (p === 'Localised persistent') return 'Persistent';
  if (p === 'Emerging deterioration') return 'Emerging';
  if (p === 'Volatile') return 'Volatile';
  return 'Localised';
}

function getRiskBandLabel(score: number): 'Low' | 'Watch' | 'Elevated' {
  if (score >= 80) return 'Low';
  if (score >= 70) return 'Watch';
  return 'Elevated';
}

function getParticipationLabel(pct: number): 'Low' | 'Moderate' | 'High' {
  if (pct >= 70) return 'High';
  if (pct >= 50) return 'Moderate';
  return 'Low';
}

export type OperationalRiskMonitorData = {
  overallScore: number;
  previousScore?: number | null;
  domainScores: Record<string, number>;
  previousDomainScores: Record<string, number> | null;
  participationPercent: number;
  attentionTeams: AttentionTeam[];
  trendSeries: Array<{ wellbeing: number }>;
  domainTrendSeries: Array<{
    period: string;
    experience: number;
    workload: number;
    safety: number;
    leadership: number;
    clarity: number;
  }>;
  riskThresholds: RiskThresholds;
  lastUpdated: string;
};

type Props = { data: OperationalRiskMonitorData };

export function OperationalRiskMonitorView({ data }: Props) {
  const teamScores = useMemo(() => data.attentionTeams.map((t) => t.wellbeing), [data.attentionTeams]);
  const delta = useMemo(() => computeDelta(data.overallScore, data.previousScore ?? undefined), [data.overallScore, data.previousScore]);

  const domainRows = useMemo(
    () =>
      buildDomainRiskTable(
        data.domainScores,
        data.previousDomainScores,
        teamScores,
        data.riskThresholds
      ),
    [data.domainScores, data.previousDomainScores, teamScores, data.riskThresholds]
  );

  const showLevers = useMemo(
    () => shouldShowLeverRecommendations(domainRows, data.riskThresholds),
    [domainRows, data.riskThresholds]
  );
  const triggeredRows = useMemo(() => getTriggeredLeverRows(domainRows, data.riskThresholds), [domainRows, data.riskThresholds]);

  const topTeams = useMemo(() => {
    const copy = [...data.attentionTeams];
    copy.sort((a, b) => a.wellbeing - b.wellbeing);
    return copy.slice(0, 10);
  }, [data.attentionTeams]);

  const sparklinePoints = useMemo(() => data.trendSeries.map((t) => t.wellbeing), [data.trendSeries]);
  const teamsBelow = data.attentionTeams.filter((t) => t.wellbeing < (data.riskThresholds.team_attention ?? 60)).length;
  const totalTeams = data.attentionTeams.length;
  const riskBand = getRiskBandLabel(data.overallScore);
  const participationLabel = getParticipationLabel(data.participationPercent);
  const lastUpdatedFormatted = new Date(data.lastUpdated).toLocaleString(undefined, {
    dateStyle: 'short',
    timeStyle: 'short',
  });

  return (
    <div className="min-h-screen bg-neutral-100 text-neutral-800">
      <header className="border-b border-neutral-200 bg-white px-3 py-2">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <a href="/dashboard" className="text-xs text-neutral-500 hover:text-neutral-700">← Dashboard</a>
          <h1 className="text-sm font-semibold text-neutral-900">Operational Risk Monitor</h1>
          <span className="text-xs text-neutral-500">Psychosocial exposure</span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-3 py-2 space-y-2">
        {/* SECTION 1 — Index overview */}
        <section className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 py-2 border-b border-neutral-200">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span className="text-3xl font-bold tabular-nums text-neutral-900">{Math.round(data.overallScore)}</span>
            {delta !== 0 && (
              <span className={`text-sm font-semibold tabular-nums ${delta > 0 ? 'text-green-700' : 'text-red-700'}`}>
                {delta > 0 ? '↑' : '↓'} {delta > 0 ? '+' : ''}{delta}
              </span>
            )}
            <SparklineMini points={sparklinePoints} />
            <span className="text-xs font-medium text-neutral-600">{riskBand}</span>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-neutral-600">
            <span>{teamsBelow}/{totalTeams} below tolerance</span>
            <span>{Math.round(data.participationPercent)}% participation · {participationLabel}</span>
            <span>Updated {lastUpdatedFormatted}</span>
          </div>
        </section>

        {/* SECTION 2 — Domain risk table */}
        <section className="border border-neutral-200 rounded-md bg-white overflow-hidden" style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50">
                <th className="py-1.5 px-2 font-semibold text-neutral-700">Domain</th>
                <th className="py-1.5 px-2 font-semibold text-neutral-700 w-14">Score</th>
                <th className="py-1.5 px-2 font-semibold text-neutral-700 w-12">Δ</th>
                <th className="py-1.5 px-2 font-semibold text-neutral-700">Teams below</th>
                <th className="py-1.5 px-2 font-semibold text-neutral-700 w-20">Persistence</th>
                <th className="py-1.5 px-2 font-semibold text-neutral-700">Pattern</th>
                <th className="py-1.5 px-2 font-semibold text-neutral-700 w-20">Status</th>
              </tr>
            </thead>
            <tbody>
              {domainRows.map((row) => (
                <tr key={row.domainKey} className="border-b border-neutral-100 last:border-0">
                  <td className="py-1.5 px-2 font-medium text-neutral-900">{row.domainLabel}</td>
                  <td className="py-1.5 px-2">
                    <div className="flex items-center gap-1.5">
                      <div className="w-10 h-1.5 rounded-full bg-neutral-200 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-neutral-500"
                          style={{ width: `${row.score}%` }}
                        />
                      </div>
                      <span className="tabular-nums text-neutral-800">{row.score}</span>
                    </div>
                  </td>
                  <td className={`py-1.5 px-2 tabular-nums font-medium ${row.delta > 0 ? 'text-green-700' : row.delta < 0 ? 'text-red-700' : 'text-neutral-500'}`}>
                    {row.delta > 0 ? '+' : ''}{row.delta}
                  </td>
                  <td className="py-1.5 px-2 text-neutral-600">{row.teamsBelow} / {row.totalTeams}</td>
                  <td className="py-1.5 px-2">
                    <span className="tabular-nums">{row.persistence}</span>
                    <span className="ml-1 text-neutral-400">{Array.from({ length: Math.min(row.persistence, 3) }, () => '●').join('')}</span>
                  </td>
                  <td className="py-1.5 px-2 text-neutral-700">{row.pattern}</td>
                  <td className="py-1.5 px-2">
                    <span
                      className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
                        row.status === 'elevated' ? 'bg-red-100 text-red-800' : row.status === 'watch' ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {row.status === 'elevated' ? 'Elevated' : row.status === 'watch' ? 'Watch' : 'Low'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* SECTION 3 — Team concentration */}
        <section className="border border-neutral-200 rounded-md bg-white overflow-hidden" style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
          <h2 className="text-xs font-semibold text-neutral-600 px-2 py-1.5 border-b border-neutral-100 bg-neutral-50">Top teams by risk</h2>
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50/80">
                <th className="py-1 px-2 font-semibold text-neutral-700">Team</th>
                <th className="py-1 px-2 font-semibold text-neutral-700 w-24">Domain driver</th>
                <th className="py-1 px-2 font-semibold text-neutral-700 w-20">Score</th>
                <th className="py-1 px-2 font-semibold text-neutral-700 w-12">Δ</th>
                <th className="py-1 px-2 font-semibold text-neutral-700 w-20">Status</th>
              </tr>
            </thead>
            <tbody>
              {topTeams.map((team) => {
                const score = Math.round(team.wellbeing);
                const status = getScoreStatusLabel(score);
                const statusShort = status.replace(' risk', '');
                const isRed = score < 60;
                const isAmber = score >= 60 && score < 70;
                return (
                  <tr key={team.id} className="border-b border-neutral-100 last:border-0">
                    <td className="py-1 px-2 text-neutral-800 truncate max-w-[180px]" title={team.displayName ?? team.name}>{team.displayName ?? team.name}</td>
                    <td className="py-1 px-2 text-neutral-500 text-xs">Composite</td>
                    <td className="py-1 px-2">
                      <div className="flex items-center gap-1.5">
                        <div className="w-12 h-1 rounded-full bg-neutral-200 overflow-hidden">
                          <div className="h-full rounded-full bg-neutral-500" style={{ width: `${team.wellbeing}%` }} />
                        </div>
                        <span className="tabular-nums text-xs">{score}</span>
                      </div>
                    </td>
                    <td className="py-1 px-2 text-neutral-500 text-xs">—</td>
                    <td className="py-1 px-2">
                      {(isRed || isAmber) && (
                        <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${isRed ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'}`}>
                          {statusShort}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>

        {/* SECTION 4 — Lever recommendations (conditional) */}
        {showLevers && triggeredRows.length > 0 && (
          <section className="border border-neutral-200 rounded-md bg-white overflow-hidden" style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
            <h2 className="text-xs font-semibold text-neutral-700 px-2 py-1.5 border-b border-neutral-100 bg-neutral-50">Recommended operational focus</h2>
            <div className="divide-y divide-neutral-100">
              {triggeredRows.map((row) => {
                const control = getControlForPressure(row.domainKey as (typeof DOMAIN_KEYS)[number], mapToPressurePattern(row.pattern));
                const breadthPct = row.totalTeams > 0 ? Math.round((row.teamsBelow / row.totalTeams) * 100) : 0;
                return (
                  <div key={row.domainKey} className="px-2 py-2">
                    <p className="font-semibold text-sm text-neutral-900">{row.domainLabel}</p>
                    <p className="text-xs text-neutral-600 mt-0.5">
                      Triggered by: {breadthPct}% teams below tolerance, {row.persistence} consecutive period{row.persistence === 1 ? '' : 's'}, {row.delta > 0 ? '+' : ''}{row.delta} delta
                    </p>
                    <p className="text-xs font-medium text-neutral-700 mt-1.5">Recommended lever:</p>
                    <ul className="mt-0.5 space-y-0.5 list-disc list-inside text-xs text-neutral-600">
                      {control.steps.slice(0, 3).map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                    <p className="text-xs text-neutral-600 mt-1.5">
                      <strong>Success signal:</strong> {control.successSignal}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* SECTION 5 — Trend context */}
        <section className="border border-neutral-200 rounded-md bg-white overflow-hidden" style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
          <h2 className="text-xs font-semibold text-neutral-600 px-2 py-1.5 border-b border-neutral-100 bg-neutral-50">Domain trend (last 12 periods)</h2>
          <div className="p-2 overflow-x-auto">
            <DomainTrendChart series={data.domainTrendSeries} />
          </div>
        </section>
      </main>
    </div>
  );
}

function DomainTrendChart({
  series,
}: {
  series: Array<{ period: string; experience: number; workload: number; safety: number; leadership: number; clarity: number }>;
}) {
  if (series.length === 0) return <p className="text-xs text-neutral-500">No trend data</p>;
  const periods = series.map((s) => s.period);
  const domains = ['workload', 'safety', 'leadership', 'clarity', 'experience'] as const;
  const colors = ['#64748b', '#475569', '#334155', '#1e293b', '#0f172a'];
  const h = 80;
  const w = Math.max(320, periods.length * 24);
  const pad = { top: 4, right: 4, bottom: 16, left: 28 };
  const xScale = (i: number) => pad.left + (i / (periods.length - 1 || 1)) * (w - pad.left - pad.right);
  const yScale = (v: number) => pad.top + (1 - v / 100) * (h - pad.top - pad.bottom);

  return (
    <svg width={w} height={h + pad.bottom} className="text-neutral-400" aria-hidden>
      {domains.map((key, di) => {
        const points = series.map((s, i) => ({ x: xScale(i), y: yScale(s[key]) }));
        const d = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
        return (
          <path
            key={key}
            d={d}
            fill="none"
            stroke={colors[di]}
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        );
      })}
      {periods.map((_, i) => (
        <text
          key={i}
          x={xScale(i)}
          y={h + 12}
          textAnchor="middle"
          className="fill-neutral-500"
          style={{ fontSize: 9 }}
        >
          {periods[i]}
        </text>
      ))}
    </svg>
  );
}
