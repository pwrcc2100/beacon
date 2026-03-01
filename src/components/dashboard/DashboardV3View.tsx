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

function buildTalkingPoints(props: {
  riskBandLabel: string;
  primaryDomain: { label: string; whyShort: string } | null;
  teamNames: string[];
  participationLabel: string;
  participationCaution: string | null;
}): TalkingPoint[] {
  const { riskBandLabel, primaryDomain, teamNames, participationLabel, participationCaution } = props;
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
      lines: [teamNames.length > 0 ? teamNames.slice(0, 3).join(', ') : 'No teams below threshold.'],
    },
    {
      label: 'Confidence',
      lines: participationCaution ? [participationLabel, participationCaution] : [participationLabel],
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
      {/* Minimal header */}
      <header className="bg-white border-b border-neutral-200 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="/dashboard" className="text-sm text-neutral-500 hover:text-neutral-700">
              ← Dashboard
            </a>
            <span className="text-neutral-300">|</span>
            <h1 className="text-lg font-semibold text-neutral-900">Beacon Index</h1>
            <span className="text-sm text-neutral-500">· Executive Report</span>
          </div>
          <p className="text-sm text-neutral-500">{data.periodLabel}</p>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10 space-y-16">
        {/* Section 1 — Executive Snapshot (Hero) */}
        <section
          className="bg-white rounded-none shadow-sm overflow-hidden"
          style={{ minHeight: '35vh' }}
        >
          <div className="p-10 md:p-14 flex flex-col md:flex-row md:items-center md:justify-between gap-10">
            <div className="flex flex-col items-center md:items-start">
              <ReportGauge score={data.overallScore} animate size={100} />
              <p className="mt-6 text-base text-neutral-600 max-w-sm text-center md:text-left">
                {interpretation}
              </p>
            </div>
            <div className="grid grid-cols-3 gap-4 md:gap-6 flex-shrink-0">
              <div className="bg-neutral-50 rounded-lg p-4 text-center">
                <p className="text-2xl font-semibold text-neutral-900 tabular-nums">{teamsRequiringAttentionCount}</p>
                <p className="text-xs text-neutral-500 mt-1">Teams requiring attention</p>
              </div>
              <div className="bg-neutral-50 rounded-lg p-4 text-center">
                <p className="text-2xl font-semibold text-neutral-900 tabular-nums">{domainsAtRiskCount}</p>
                <p className="text-xs text-neutral-500 mt-1">Domains at risk</p>
              </div>
              <div className="bg-neutral-50 rounded-lg p-4 text-center">
                <p className="text-xl font-semibold text-neutral-900">{participation.label}</p>
                <p className="text-xs text-neutral-500 mt-1">{Math.round(data.participationPercent)}% participation</p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2 — Leadership Focus */}
        <section className="space-y-6">
          <h2 className="text-xl font-semibold text-neutral-900 tracking-tight">Leadership focus</h2>
          <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 mb-3">Primary focus</p>
            {domainPriority.primaryDomain ? (
              <>
                <p className="text-xl font-semibold text-neutral-900">{domainPriority.primaryDomain.label}</p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-3xl font-bold text-neutral-900 tabular-nums">
                    {Math.round(domainPriority.primaryDomain.score100)}
                  </span>
                  {domainPriority.primaryDomain.delta !== 0 && (
                    <span
                      className={`text-sm font-medium tabular-nums ${
                        domainPriority.primaryDomain.delta > 0 ? 'text-emerald-600' : 'text-red-600'
                      }`}
                    >
                      {domainPriority.primaryDomain.delta > 0 ? '+' : ''}{domainPriority.primaryDomain.delta}
                    </span>
                  )}
                </div>
                <p className="text-sm text-neutral-600 mt-1">{domainPriority.primaryDomain.whyShort}</p>
              </>
            ) : (
              <p className="text-neutral-600">No domain below tolerance.</p>
            )}
          </div>

          <div>
            <div className="flex justify-end mb-2">
              <button
                type="button"
                onClick={handleCopyTalkingPoints}
                className="text-xs font-medium text-neutral-500 hover:text-neutral-700 px-2 py-1 rounded"
              >
                Copy talking points
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {talkingPoints.map((p, i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm border border-neutral-100 p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 mb-2">
                    {p.label}
                  </p>
                  <p className="text-sm text-neutral-800 leading-snug">{p.lines[0]}</p>
                  {p.lines[1] && <p className="text-sm text-neutral-500 leading-snug mt-1">{p.lines[1]}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 3 — Leadership Actions */}
        <section className="space-y-6">
          <h2 className="text-xl font-semibold text-neutral-900 tracking-tight">Leadership actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {actionTiles.map((tile, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm border border-neutral-100 p-6">
                <p className="font-semibold text-neutral-900 text-lg">{tile.title}</p>
                <ul className="mt-4 space-y-2 text-sm text-neutral-600 list-disc list-inside">
                  <li>{tile.steps[0]}</li>
                  <li>{tile.steps[1]}</li>
                </ul>
                <p className="mt-4 text-xs text-neutral-500">
                  <span className="font-medium text-neutral-600">Success cue:</span> {tile.successCue}
                </p>
                <p className="mt-1 text-xs text-neutral-400">{tile.timeframe}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 4 — Supporting Evidence */}
        <section className="space-y-8">
          <h2 className="text-xl font-semibold text-neutral-900 tracking-tight">Supporting evidence</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-sm border border-neutral-100 p-6">
              <p className="text-sm font-medium text-neutral-500 mb-4">Domain breakdown</p>
              <ReportDomainBars scores={data.domainScores} />
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-neutral-100 p-6">
              <p className="text-sm font-medium text-neutral-500 mb-4">Team risk list</p>
              <ReportTeamRiskList teams={data.attentionTeams} />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
