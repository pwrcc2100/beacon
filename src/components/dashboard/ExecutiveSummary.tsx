'use client';

import { useMemo, useState, useCallback } from 'react';
import { RiskGauge } from './RiskGauge';
import { computeDelta, getRiskBand } from '@/lib/riskLogic';
import type { BehaviourShift } from '@/lib/riskLogic';
import {
  computeDomainPriority,
  computeTeamPriority,
  computeParticipationConfidence,
  computeEscalationSignal,
  getActionTiles,
} from '@/lib/executiveLogic';
import { ExecutiveFocusStrip } from './ExecutiveFocusStrip';
import { ActionTiles } from './ActionTiles';
import type { AttentionTeam } from '@/app/dashboard/dashboardData';
import type { DomainScores } from './DomainBars';

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

function buildSpeakingScript(props: {
  riskBandLabel: string;
  domainsAtRisk: { label: string }[];
  teamsAtRisk: { teamName: string }[];
  participationConfidenceLabel: string;
  participationTone: string;
  behaviourShifts: BehaviourShift[];
}): string[] {
  const lines: string[] = [];
  const exposure =
    props.riskBandLabel === 'Low risk'
      ? 'Current exposure is within acceptable range.'
      : `We are in a ${props.riskBandLabel.toLowerCase()} position; focus on the areas below.`;
  lines.push(exposure);
  if (props.domainsAtRisk.length > 0) {
    const names = props.domainsAtRisk.map((d) => d.label).join(' and ');
    lines.push(`Concentration of strain: ${names}.`);
  }
  if (props.teamsAtRisk.length > 0) {
    const names = props.teamsAtRisk.map((t) => t.teamName).join(', ');
    lines.push(`Teams to prioritise: ${names}.`);
  }
  if (props.participationTone !== 'calm') {
    lines.push(
      `Interpretation caution: ${props.participationConfidenceLabel.toLowerCase()} — participation below target may mask underlying strain.`
    );
  }
  if (props.behaviourShifts.length > 0) {
    const shifts = props.behaviourShifts.map((s) => s.title).join('; ');
    lines.push(`This period, trial: ${shifts}.`);
  }
  return lines.slice(0, 5);
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
  periodLabel = 'this period',
}: ExecutiveSummaryProps) {
  const [scriptOpen, setScriptOpen] = useState(false);

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

  const behaviourShiftsForScript: BehaviourShift[] = useMemo(
    () =>
      actionTiles.map((t) => ({
        title: t.title,
        steps: t.steps,
        timeframe: t.timeframe,
      })),
    [actionTiles]
  );

  const speakingLines = useMemo(
    () =>
      buildSpeakingScript({
        riskBandLabel: riskBand.label,
        domainsAtRisk: domainPriority.domainsRanked.filter((d) => d.score100 < 70).slice(0, 2),
        teamsAtRisk: teamsByPriority.slice(0, 3),
        participationConfidenceLabel: participation.label,
        participationTone: participation.level === 'high' ? 'calm' : 'cautious',
        behaviourShifts: behaviourShiftsForScript,
      }),
    [riskBand.label, domainPriority.domainsRanked, teamsByPriority, participation, behaviourShiftsForScript]
  );

  const handleCopyScript = useCallback(() => {
    const text = speakingLines.join('\n');
    void navigator.clipboard.writeText(text);
  }, [speakingLines]);

  const teamsRequiringAttentionCount = attentionTeams.filter((t) => t.wellbeing < 60).length;
  const domainsAtRiskCount = domainPriority.domainsRanked.filter((d) => d.score100 < 70).length;
  const hasLimitedSignal = participation.level === 'low' && attentionTeams.length < 3;

  return (
    <section className="rounded-bi-lg bg-bi-surfaceSection p-6 md:p-8 shadow-bi-soft border border-bi-borderSubtle">
      <h2 className="text-xl font-semibold text-bi-text tracking-tight mb-6">
        Executive Summary
      </h2>

      {/* Risk Snapshot row: gauge + callouts */}
      <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-6 md:gap-8 items-start mb-6">
        <div className="flex flex-col items-center md:items-start">
          <RiskGauge score={overallScore} animate size={88} />
          <div className="mt-2 flex items-center gap-2 flex-wrap justify-center md:justify-start">
            {previousScore != null && (
              <span
                className={`text-sm font-medium tabular-nums ${
                  delta > 0 ? 'text-bi-success' : delta < 0 ? 'text-bi-danger' : 'text-bi-textMuted'
                }`}
              >
                {delta > 0 ? '+' : ''}{delta} vs previous
              </span>
            )}
            <span className="text-sm text-bi-textMuted">{riskBand.label}</span>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="rounded-bi-lg bg-bi-surfaceCard border border-bi-borderSubtle p-4 shadow-bi-sm">
            <p className="text-2xl md:text-3xl font-semibold tabular-nums text-bi-text">
              {teamsRequiringAttentionCount}
            </p>
            <p className="text-sm text-bi-textMuted mt-1">Teams requiring attention</p>
          </div>
          <div className="rounded-bi-lg bg-bi-surfaceCard border border-bi-borderSubtle p-4 shadow-bi-sm">
            <p className="text-2xl md:text-3xl font-semibold tabular-nums text-bi-text">
              {domainsAtRiskCount}
            </p>
            <p className="text-sm text-bi-textMuted mt-1">Domains at risk</p>
          </div>
          <div className="rounded-bi-lg bg-bi-surfaceCard border border-bi-borderSubtle p-4 shadow-bi-sm col-span-2 md:col-span-1">
            <p className="text-lg font-semibold text-bi-text">{participation.label}</p>
            <p className="text-sm text-bi-textMuted mt-1">{Math.round(participationPercent)}% participation</p>
          </div>
        </div>
      </div>

      {hasLimitedSignal && (
        <div className="rounded-bi-md bg-bi-warning/10 border border-bi-warning/30 px-4 py-3 mb-6">
          <p className="text-sm text-bi-text">
            Limited signal — small sample and low participation. Interpret with caution.
          </p>
        </div>
      )}

      {/* Executive Focus Strip — 4 tiles */}
      <div className="mb-6">
        <ExecutiveFocusStrip
          primaryDomain={domainPriority.primaryDomain}
          teamsByPriority={teamsByPriority}
          participation={participation}
          escalation={escalation}
        />
        <p className="text-xs text-bi-textSubtle mt-3">
          Trajectory signal only — not a prediction of incidents or claims.
        </p>
      </div>

      {/* What to say tomorrow — collapsible, Copy script */}
      <div className="rounded-bi-lg bg-bi-surfaceCard border border-bi-borderSubtle shadow-bi-sm mb-6 overflow-hidden">
        <button
          type="button"
          onClick={() => setScriptOpen(!scriptOpen)}
          className="w-full flex items-center justify-between p-4 text-left hover:bg-bi-surfaceAlt/50 transition-colors"
        >
          <h3 className="text-base font-semibold text-bi-text">What to say tomorrow</h3>
          <span className="text-sm text-bi-textMuted">{scriptOpen ? 'Hide' : 'View'}</span>
        </button>
        {scriptOpen && (
          <div className="px-4 pb-4 pt-0 border-t border-bi-borderSeparator">
            <div className="space-y-2 mt-3">
              {speakingLines.length > 0 ? (
                speakingLines.map((line, i) => (
                  <p key={i} className="text-sm text-bi-text leading-relaxed">
                    {line}
                  </p>
                ))
              ) : (
                <p className="text-sm text-bi-textMuted">Insufficient data to generate a script.</p>
              )}
            </div>
            <button
              type="button"
              onClick={handleCopyScript}
              className="mt-3 rounded-bi-md border border-bi-borderSubtle bg-bi-surfaceAlt px-3 py-2 text-sm font-medium text-bi-text hover:bg-bi-surfaceAlt/80"
            >
              Copy script
            </button>
          </div>
        )}
      </div>

      {/* What to change this week — 2 Action Tiles */}
      <div className="mb-6">
        <h3 className="text-base font-semibold text-bi-text mb-3">What to change this week</h3>
        <ActionTiles tiles={actionTiles} />
      </div>
    </section>
  );
}
