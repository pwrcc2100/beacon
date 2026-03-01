'use client';

import { useMemo } from 'react';
import { RiskGauge } from './RiskGauge';
import { computeDelta, getRiskBand } from '@/lib/riskLogic';
import {
  computeDomainPriority,
  computeTeamPriority,
  computeParticipationConfidence,
  computeEscalationSignal,
  getActionTiles,
} from '@/lib/executiveLogic';
import { TalkingPointsStrip } from './TalkingPointsStrip';
import type { TalkingPoint } from './TalkingPointsStrip';
import { ActionTiles } from './ActionTiles';
import type { AttentionTeam } from '@/app/dashboard/dashboardData';
import type { DomainScores } from './DomainBars';
import type { DomainPriorityItem } from '@/lib/executiveLogic';
import type { TeamPriorityItem } from '@/lib/executiveLogic';
import type { ParticipationConfidenceResult, EscalationResult } from '@/lib/executiveLogic';

export type ExecutiveSummaryProps = {
  overallScore: number;
  previousScore?: number | null;
  domainScores: DomainScores;
  previousDomainScores?: Partial<DomainScores> | null;
  participationPercent: number;
  previousParticipationPercent?: number | null;
  attentionTeams: AttentionTeam[];
  trendSeries?: Array<{ wellbeing: number }>;
  periodLabel?: string;
};

function buildTalkingPoints(props: {
  riskBandLabel: string;
  primaryDomain: DomainPriorityItem | null;
  teamsByPriority: TeamPriorityItem[];
  participation: ParticipationConfidenceResult;
}): TalkingPoint[] {
  const { riskBandLabel, primaryDomain, teamsByPriority, participation } = props;
  const points: TalkingPoint[] = [];

  points.push({
    label: 'Position',
    lines: [
      riskBandLabel === 'Low risk'
        ? 'Within acceptable range.'
        : `${riskBandLabel}. Focus on actions below.`,
    ],
  });

  points.push({
    label: 'Concentration',
    lines: primaryDomain
      ? [primaryDomain.label, primaryDomain.whyShort]
      : ['No domain below tolerance.'],
  });

  const teamNames = teamsByPriority.slice(0, 3).map((t) => t.teamName);
  points.push({
    label: 'Teams',
    lines: teamNames.length > 0 ? [teamNames.join(', ')] : ['No teams below threshold.'],
  });

  points.push({
    label: 'Confidence',
    lines: participation.caution
      ? [participation.label, participation.caution]
      : [participation.label],
  });

  return points.slice(0, 4);
}

export function ExecutiveSummary({
  overallScore,
  previousScore,
  domainScores,
  previousDomainScores,
  participationPercent,
  previousParticipationPercent,
  attentionTeams,
  trendSeries,
}: ExecutiveSummaryProps) {
  const score100 = Math.max(0, Math.min(100, overallScore));
  const delta = useMemo(() => computeDelta(score100, previousScore ?? undefined), [score100, previousScore]);
  const riskBand = useMemo(() => getRiskBand(score100), [score100]);

  const currentDomains = useMemo(
    () => ({
      experience: domainScores.experience,
      workload: domainScores.workload,
      safety: domainScores.safety,
      leadership: domainScores.leadership,
      clarity: domainScores.clarity,
    }),
    [domainScores]
  );

  const domainPriority = useMemo(
    () => computeDomainPriority(currentDomains, previousDomainScores ?? undefined),
    [currentDomains, previousDomainScores]
  );

  const teamScoresForPriority = useMemo(
    () =>
      attentionTeams.map((t) => ({
        teamId: t.id,
        teamName: t.displayName ?? t.name,
        score: t.wellbeing,
        previousScore: (t as AttentionTeam & { previousScore?: number }).previousScore ?? null,
        participationPercent: t.participationPercent ?? null,
      })),
    [attentionTeams]
  );
  const teamsByPriority = useMemo(() => computeTeamPriority(teamScoresForPriority), [teamScoresForPriority]);

  const participationDelta = useMemo(
    () => (previousParticipationPercent != null ? participationPercent - previousParticipationPercent : 0),
    [participationPercent, previousParticipationPercent]
  );
  const participation = useMemo(
    () => computeParticipationConfidence(participationPercent, participationDelta),
    [participationPercent, participationDelta]
  );

  const escalation = useMemo(
    () =>
      computeEscalationSignal({
        trendSeries,
        domainScores: { safety: domainScores.safety },
        teamScores: attentionTeams.map((t) => t.wellbeing),
      }),
    [trendSeries, domainScores.safety, attentionTeams]
  );

  const actionTiles = useMemo(
    () => getActionTiles(domainPriority.primaryDomain, domainPriority.secondaryDomain),
    [domainPriority.primaryDomain, domainPriority.secondaryDomain]
  );

  const talkingPoints = useMemo(
    () =>
      buildTalkingPoints({
        riskBandLabel: riskBand.label,
        primaryDomain: domainPriority.primaryDomain,
        teamsByPriority,
        participation,
      }),
    [riskBand.label, domainPriority.primaryDomain, teamsByPriority, participation]
  );

  const teamsRequiringAttentionCount = attentionTeams.filter((t) => t.wellbeing < 60).length;
  const domainsAtRiskCount = domainPriority.domainsRanked.filter((d) => d.score100 < 70).length;
  const hasLimitedSignal = participation.level === 'low' && attentionTeams.length < 3;
  const topTeams = teamsByPriority.slice(0, 3);
  const escalationReasonsShow = escalation.reasons.slice(0, 2);

  return (
    <section className="rounded-bi-lg bg-bi-surfaceSection p-5 md:p-6 shadow-bi-soft border border-bi-borderSubtle max-h-[85vh] overflow-y-auto">
      <h2 className="text-lg font-semibold text-bi-text tracking-tight mb-4">
        Executive Summary
      </h2>

      {/* Snapshot: gauge + callouts — tight */}
      <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-4 md:gap-5 items-start mb-4">
        <div className="flex flex-col items-center md:items-start">
          <RiskGauge score={overallScore} animate size={76} />
          <div className="mt-1.5 flex items-center gap-2 flex-wrap justify-center md:justify-start">
            {previousScore != null && (
              <span
                className={`text-xs font-medium tabular-nums ${
                  delta > 0 ? 'text-bi-success' : delta < 0 ? 'text-bi-danger' : 'text-bi-textMuted'
                }`}
              >
                {delta > 0 ? '+' : ''}{delta}
              </span>
            )}
            <span className="text-xs text-bi-textMuted">{riskBand.label}</span>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-bi-md bg-bi-surfaceCard border border-bi-borderSubtle p-3 shadow-bi-sm">
            <p className="text-xl font-semibold tabular-nums text-bi-text">{teamsRequiringAttentionCount}</p>
            <p className="text-xs text-bi-textMuted mt-0.5">Teams</p>
          </div>
          <div className="rounded-bi-md bg-bi-surfaceCard border border-bi-borderSubtle p-3 shadow-bi-sm">
            <p className="text-xl font-semibold tabular-nums text-bi-text">{domainsAtRiskCount}</p>
            <p className="text-xs text-bi-textMuted mt-0.5">Domains</p>
          </div>
          <div className="rounded-bi-md bg-bi-surfaceCard border border-bi-borderSubtle p-3 shadow-bi-sm">
            <p className="text-sm font-semibold text-bi-text">{participation.label}</p>
            <p className="text-xs text-bi-textMuted mt-0.5">{Math.round(participationPercent)}%</p>
          </div>
        </div>
      </div>

      {hasLimitedSignal && (
        <div className="rounded-bi-md bg-bi-warning/10 border border-bi-warning/30 px-3 py-2 mb-3">
          <p className="text-xs text-bi-text">Limited signal — interpret with caution.</p>
        </div>
      )}

      {/* Tighter 3-tile row: Teams to watch, Participation, Escalation */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        <div className="rounded-bi-md bg-bi-surfaceCard border border-bi-borderSubtle p-3 shadow-bi-sm">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-bi-textMuted mb-1.5">Teams to watch</p>
          <p className="text-lg font-bold tabular-nums text-bi-text">{teamsByPriority.length}</p>
          <div className="mt-1.5 flex flex-wrap gap-1">
            {topTeams.map((t) => (
              <span
                key={t.teamId}
                className="inline-flex items-center gap-1 rounded-full bg-bi-surfaceAlt px-1.5 py-0.5 text-[11px] text-bi-text truncate max-w-[120px]"
                title={t.teamName}
              >
                <span className="truncate">{t.teamName}</span>
                <span className="tabular-nums text-bi-textMuted shrink-0">{Math.round(t.score)}</span>
              </span>
            ))}
          </div>
        </div>
        <div className="rounded-bi-md bg-bi-surfaceCard border border-bi-borderSubtle p-3 shadow-bi-sm">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-bi-textMuted mb-1.5">Participation</p>
          <p className="text-sm font-semibold text-bi-text">{participation.label}</p>
          <div className="mt-1 h-1.5 rounded-full bg-bi-surfaceAlt overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{
                width: `${participation.rate}%`,
                backgroundColor:
                  participation.level === 'high' ? 'var(--bi-success)' : participation.level === 'moderate' ? 'var(--bi-warning)' : 'var(--bi-danger)',
              }}
            />
          </div>
          {participation.caution && <p className="text-[10px] text-bi-textMuted mt-1">{participation.caution}</p>}
        </div>
        <div className="rounded-bi-md bg-bi-surfaceCard border border-bi-borderSubtle p-3 shadow-bi-sm">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-bi-textMuted mb-1.5">Escalation</p>
          <span
            className={`inline-flex rounded-full px-1.5 py-0.5 text-[11px] font-medium ${
              escalation.level === 'High' ? 'bg-bi-danger/20 text-bi-danger' : escalation.level === 'Moderate' ? 'bg-bi-warning/20 text-bi-warning' : 'bg-bi-surfaceAlt text-bi-textMuted'
            }`}
          >
            {escalation.level}
          </span>
          {escalationReasonsShow.length > 0 && (
            <ul className="mt-1 text-[11px] text-bi-textMuted space-y-0.5">
              {escalationReasonsShow.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <p className="text-[10px] text-bi-textSubtle mb-4">
        Trajectory signal only — not a prediction of incidents or claims.
      </p>

      {/* 2-column: Left = Primary Focus + Talking Points | Right = Action Tiles */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
        <div className="flex flex-col gap-4 min-h-0">
          {/* Primary Focus tile — full width of left col */}
          <div className="rounded-bi-lg bg-bi-surfaceCard border border-bi-borderSubtle p-4 shadow-bi-sm">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-bi-textMuted mb-2">Primary focus</p>
            {domainPriority.primaryDomain ? (
              <>
                <p className="text-base font-semibold text-bi-text">{domainPriority.primaryDomain.label}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-xl font-bold tabular-nums text-bi-text">
                    {Math.round(domainPriority.primaryDomain.score100)}
                  </span>
                  {domainPriority.primaryDomain.delta !== 0 && (
                    <span
                      className={`text-xs font-medium tabular-nums ${
                        domainPriority.primaryDomain.delta > 0 ? 'text-bi-success' : 'text-bi-danger'
                      }`}
                    >
                      {domainPriority.primaryDomain.delta > 0 ? '+' : ''}{domainPriority.primaryDomain.delta}
                    </span>
                  )}
                </div>
                <p className="text-xs text-bi-textMuted mt-1">{domainPriority.primaryDomain.whyShort}</p>
              </>
            ) : (
              <p className="text-sm text-bi-textMuted">No domain below tolerance</p>
            )}
          </div>

          {/* Talking Points strip */}
          <div>
            <TalkingPointsStrip points={talkingPoints} />
          </div>
        </div>

        {/* Right: 2 Action Tiles stacked */}
        <div className="flex flex-col gap-3">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-bi-textMuted">What to change this week</p>
          <ActionTiles tiles={actionTiles} stacked />
        </div>
      </div>
    </section>
  );
}
