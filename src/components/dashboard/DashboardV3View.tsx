'use client';

import { useMemo } from 'react';
import { ReportGauge } from './ReportGauge';
import { ReportDomainBars } from './ReportDomainBars';
import { ReportTeamRiskList } from './ReportTeamRiskList';
import { getScoreInterpretation, getScoreStatusLabel } from '@/lib/dashboardConstants';
import {
  computeDomainPriority,
  computeTeamPriority,
  computeParticipationConfidence,
  getActionTiles,
} from '@/lib/executiveLogic';
import type { AttentionTeam } from '@/app/dashboard/dashboardData';
import type { DomainScores } from './DomainBars';
import type { TalkingPoint } from './TalkingPointsStrip';

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

function truncate(str: string, maxLen: number): string {
  if (str.length <= maxLen) return str;
  return str.slice(0, maxLen - 1).trim() + '…';
}

function buildTalkingPoints(props: {
  riskBandLabel: string;
  primaryDomain: { label: string; whyShort: string } | null;
  teamNames: string[];
  participationLabel: string;
  participationCaution: string | null;
}): TalkingPoint[] {
  const { riskBandLabel, primaryDomain, teamNames, participationLabel, participationCaution } = props;
  const teamsLine = teamNames.length > 0
    ? truncate(teamNames.slice(0, 3).map((n) => truncate(n, 18)).join(', '), 42)
    : 'No teams below threshold.';
  const confidenceLine2 = participationCaution ? truncate(participationCaution, 50) : null;
  return [
    {
      label: 'Position',
      lines: [riskBandLabel === 'Low risk' ? 'Within acceptable range.' : `${riskBandLabel}. Focus on actions below.`],
    },
    {
      label: 'Concentration',
      lines: primaryDomain ? [primaryDomain.label, primaryDomain.whyShort] : ['No domain below tolerance.'],
    },
    {
      label: 'Teams',
      lines: [teamsLine],
    },
    {
      label: 'Confidence',
      lines: confidenceLine2 ? [participationLabel, confidenceLine2] : [participationLabel],
    },
  ];
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

  const actionTiles = useMemo(
    () => getActionTiles(domainPriority.primaryDomain, domainPriority.secondaryDomain),
    [domainPriority.primaryDomain, domainPriority.secondaryDomain]
  );

  const riskBandLabel = useMemo(() => getScoreStatusLabel(data.overallScore), [data.overallScore]);

  const talkingPoints = useMemo(
    () =>
      buildTalkingPoints({
        riskBandLabel,
        primaryDomain: domainPriority.primaryDomain,
        teamNames: teamsByPriority.map((t) => t.teamName),
        participationLabel: participation.label,
        participationCaution: participation.caution,
      }),
    [riskBandLabel, domainPriority.primaryDomain, teamsByPriority, participation]
  );

  const interpretation = getScoreInterpretation(data.overallScore);
  const teamsRequiringAttentionCount = data.attentionTeams.filter((t) => t.wellbeing < 60).length;
  const domainsAtRiskCount = domainPriority.domainsRanked.filter((d) => d.score100 < 70).length;

  const handleCopyTalkingPoints = () => {
    const text = talkingPoints.map((p) => `${p.label}\n${p.lines.join('\n')}`).join('\n\n');
    void navigator.clipboard.writeText(text);
  };

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
      <main className="max-w-5xl mx-auto px-4 py-4">
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
          <div className="p-5 md:p-6 space-y-4">
            {/* ROW 1: Gauge left, 3 metric tiles right */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-neutral-100">
              <div className="flex flex-col items-center md:items-start">
                <ReportGauge score={data.overallScore} animate size={92} />
                <p className="mt-3 text-sm text-neutral-600 max-w-xs text-center md:text-left">
                  {interpretation}
                </p>
              </div>
              <div className="grid grid-cols-3 gap-3 flex-shrink-0">
                <div className="bg-neutral-50 rounded-lg px-3 py-3 text-center">
                  <p className="text-xl font-semibold text-neutral-900 tabular-nums">{teamsRequiringAttentionCount}</p>
                  <p className="text-[11px] text-neutral-500 mt-0.5">Teams</p>
                </div>
                <div className="bg-neutral-50 rounded-lg px-3 py-3 text-center">
                  <p className="text-xl font-semibold text-neutral-900 tabular-nums">{domainsAtRiskCount}</p>
                  <p className="text-[11px] text-neutral-500 mt-0.5">Domains</p>
                </div>
                <div className="bg-neutral-50 rounded-lg px-3 py-3 text-center">
                  <p className="text-base font-semibold text-neutral-900">{participation.label}</p>
                  <p className="text-[11px] text-neutral-500 mt-0.5">{Math.round(data.participationPercent)}%</p>
                </div>
              </div>
            </div>

            {/* ROW 2: Primary Focus banner — full width, strong typography */}
            <div className="bg-neutral-50 rounded-lg px-4 py-4 border-l-4 border-neutral-300">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 mb-1">Primary focus</p>
              {domainPriority.primaryDomain ? (
                <>
                  <p className="text-2xl md:text-3xl font-bold text-neutral-900 tracking-tight">
                    {domainPriority.primaryDomain.label}
                  </p>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-3xl font-bold text-neutral-900 tabular-nums">
                      {Math.round(domainPriority.primaryDomain.score100)}
                    </span>
                    {domainPriority.primaryDomain.delta !== 0 && (
                      <span
                        className={`text-base font-semibold tabular-nums ${
                          domainPriority.primaryDomain.delta > 0 ? 'text-emerald-600' : 'text-red-600'
                        }`}
                      >
                        {domainPriority.primaryDomain.delta > 0 ? '+' : ''}{domainPriority.primaryDomain.delta}
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-medium text-neutral-600 mt-1">
                    {domainPriority.primaryDomain.whyShort}
                  </p>
                </>
              ) : (
                <p className="text-neutral-600 font-medium">No domain below tolerance.</p>
              )}
            </div>

            {/* ROW 3: Talking Points — 4 equal-width cards, compact, max 2 lines */}
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">Talking points</span>
              <button
                type="button"
                onClick={handleCopyTalkingPoints}
                className="text-[11px] font-medium text-neutral-500 hover:text-neutral-700"
              >
                Copy
              </button>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
              {talkingPoints.map((p, i) => (
                <div key={i} className="rounded-md bg-neutral-50 border border-neutral-100 px-3 py-2.5 min-h-0">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 mb-1">{p.label}</p>
                  <p className="text-xs text-neutral-800 leading-snug line-clamp-2" title={p.lines[0]}>{p.lines[0]}</p>
                  {p.lines[1] && (
                    <p className="text-[11px] text-neutral-500 leading-snug line-clamp-2 mt-0.5" title={p.lines[1]}>{p.lines[1]}</p>
                  )}
                </div>
              ))}
            </div>

            {/* ROW 4: Two ActionTiles side by side */}
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

            {/* ROW 5: Supporting evidence — domain left, team list right */}
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
