'use client';

import { useMemo } from 'react';
import { RiskGauge } from './RiskGauge';
import {
  getRiskBand,
  getParticipationConfidence,
  computeDelta,
  identifyDomainsAtRiskWithDelta,
  identifyDomainsAtRisk,
  identifyTeamsRequiringAttention,
  deriveBehaviourShifts,
  computeEscalationSignal,
  type DomainAtRisk,
  type TeamRequiringAttention,
  type BehaviourShift,
  type EscalationSignal,
} from '@/lib/riskLogic';
import type { AttentionTeam } from '@/app/dashboard/dashboardData';
import type { DomainScores } from './DomainBars';

export type ExecutiveSummaryProps = {
  /** Composite org score 0–100 */
  overallScore: number;
  /** Previous period composite (optional) */
  previousScore?: number | null;
  /** Domain scores 0–5 scale */
  domainScores: DomainScores;
  /** Previous period domain scores (optional) */
  previousDomainScores?: Partial<DomainScores> | null;
  /** Participation % 0–100 */
  participationPercent: number;
  /** Team list (wellbeing 0–100, optional previousScore per team) */
  attentionTeams: AttentionTeam[];
  /** For escalation: period-over-period series */
  trendSeries?: Array<{ wellbeing: number }>;
  /** Period label for copy */
  periodLabel?: string;
};

function buildSpeakingScript(props: {
  riskBandLabel: string;
  domainsAtRisk: DomainAtRisk[];
  teamsAtRisk: TeamRequiringAttention[];
  participationConfidenceLabel: string;
  participationTone: string;
  behaviourShifts: BehaviourShift[];
}): string[] {
  const {
    riskBandLabel,
    domainsAtRisk,
    teamsAtRisk,
    participationConfidenceLabel,
    participationTone,
    behaviourShifts,
  } = props;

  const lines: string[] = [];

  const exposure = riskBandLabel === 'Low risk'
    ? 'Current exposure is within acceptable range.'
    : `We are in a ${riskBandLabel.toLowerCase()} position; focus on the areas below.`;
  lines.push(exposure);

  if (domainsAtRisk.length > 0) {
    const domainNames = domainsAtRisk.map((d) => d.label).join(' and ');
    lines.push(`Concentration of strain: ${domainNames}.`);
  }
  if (teamsAtRisk.length > 0) {
    const teamNames = teamsAtRisk.map((t) => t.teamName).join(', ');
    lines.push(`Teams to prioritise: ${teamNames}.`);
  }

  if (participationTone !== 'calm') {
    lines.push(
      `Interpretation caution: ${participationConfidenceLabel.toLowerCase()} — participation below target may mask underlying strain.`
    );
  }

  if (behaviourShifts.length > 0) {
    const shifts = behaviourShifts.map((s) => s.title).join('; ');
    lines.push(`This period, trial: ${shifts}.`);
  }

  return lines.slice(0, 6);
}

export function ExecutiveSummary({
  overallScore,
  previousScore,
  domainScores,
  previousDomainScores,
  participationPercent,
  attentionTeams,
  trendSeries,
  periodLabel = 'this period',
}: ExecutiveSummaryProps) {
  const score100 = Math.max(0, Math.min(100, overallScore));
  const delta = useMemo(() => computeDelta(score100, previousScore ?? undefined), [score100, previousScore]);
  const riskBand = useMemo(() => getRiskBand(score100), [score100]);
  const participationConfidence = useMemo(
    () => getParticipationConfidence(participationPercent),
    [participationPercent]
  );

  const domainsAtRisk = useMemo(() => {
    const current = {
      experience: domainScores.experience,
      workload: domainScores.workload,
      safety: domainScores.safety,
      leadership: domainScores.leadership,
      clarity: domainScores.clarity,
    };
    return previousDomainScores
      ? identifyDomainsAtRiskWithDelta(current, previousDomainScores)
      : identifyDomainsAtRisk(domainScores).map((d) => ({ ...d, delta: 0 }));
  }, [domainScores, previousDomainScores]);

  const teamsAtRisk = useMemo(() => {
    const teamScores = attentionTeams.map((t) => ({
      teamId: t.id,
      teamName: t.displayName ?? t.name,
      score: t.wellbeing,
      previousScore: (t as AttentionTeam & { previousScore?: number }).previousScore ?? null,
      participationPercent: t.participationPercent ?? null,
    }));
    return identifyTeamsRequiringAttention(teamScores);
  }, [attentionTeams]);

  const behaviourShifts = useMemo(() => deriveBehaviourShifts(domainsAtRisk), [domainsAtRisk]);

  const escalation = useMemo(
    (): EscalationSignal =>
      computeEscalationSignal({
        trendSeries,
        domainScores: { safety: domainScores.safety },
        teamScores: attentionTeams.map((t) => t.wellbeing),
      }),
    [trendSeries, domainScores.safety, attentionTeams]
  );

  const speakingLines = useMemo(
    () =>
      buildSpeakingScript({
        riskBandLabel: riskBand.label,
        domainsAtRisk,
        teamsAtRisk,
        participationConfidenceLabel: participationConfidence.label,
        participationTone: participationConfidence.tone,
        behaviourShifts,
      }),
    [riskBand.label, domainsAtRisk, teamsAtRisk, participationConfidence, behaviourShifts]
  );

  const teamsRequiringAttentionCount = attentionTeams.filter((t) => t.wellbeing < 60).length;
  const domainsAtRiskCount = domainsAtRisk.filter((d) => d.score100 < 70).length;

  const hasLimitedSignal =
    participationConfidence.key === 'low' && attentionTeams.length < 3;

  return (
    <section className="rounded-bi-lg bg-bi-surfaceSection p-6 md:p-8 shadow-bi-soft border border-bi-borderSubtle">
      <h2 className="text-xl font-semibold text-bi-text tracking-tight mb-6">
        Executive Summary
      </h2>

      {/* A) Executive Risk Snapshot row */}
      <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-6 md:gap-8 items-start mb-8">
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
            <p className="text-lg font-semibold text-bi-text">{participationConfidence.label}</p>
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

      {/* B) Leadership Focus — This Period */}
      <div className="rounded-bi-lg bg-bi-surfaceCard border border-bi-borderSubtle p-5 shadow-bi-sm mb-6">
        <h3 className="text-base font-semibold text-bi-text mb-4">Leadership focus — this period</h3>

        {domainsAtRisk.length > 0 && (
          <div className="mb-4">
            <p className="text-sm text-bi-textMuted mb-2">Domains at risk</p>
            <ul className="space-y-2">
              {domainsAtRisk.map((d) => (
                <li key={d.key} className="flex flex-wrap items-center gap-2 text-sm">
                  <span className="font-medium text-bi-text">{d.label}</span>
                  <span className="tabular-nums text-bi-textMuted">{Math.round(d.score100)}</span>
                  {d.delta !== 0 && (
                    <span
                      className={
                        d.delta > 0 ? 'text-bi-success' : 'text-bi-danger'
                      }
                    >
                      {d.delta > 0 ? '+' : ''}{d.delta}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {teamsAtRisk.length > 0 ? (
          <div className="mb-4">
            <p className="text-sm text-bi-textMuted mb-2">Teams requiring attention</p>
            <ul className="space-y-2">
              {teamsAtRisk.map((t) => (
                <li key={t.teamId} className="flex flex-wrap items-center gap-2 text-sm">
                  <span className="font-medium text-bi-text truncate max-w-[200px]" title={t.teamName}>
                    {t.teamName}
                  </span>
                  <span className="tabular-nums text-bi-textMuted">{Math.round(t.score)}</span>
                  {t.delta !== 0 && (
                    <span className={t.delta > 0 ? 'text-bi-success' : 'text-bi-danger'}>
                      {t.delta > 0 ? '+' : ''}{t.delta}
                    </span>
                  )}
                  {t.participationPercent != null && (
                    <span className="text-bi-textMuted">{t.participationPercent}% part.</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          attentionTeams.length === 0 && (
            <p className="text-sm text-bi-textMuted mb-4">No team-level data for this scope.</p>
          )
        )}

        {(participationConfidence.key === 'moderate' || participationConfidence.key === 'low') && (
          <p className="text-sm text-bi-textMuted border-t border-bi-borderSeparator pt-3 mt-3">
            Interpretation caution: participation below target may mask underlying strain.
          </p>
        )}
      </div>

      {/* C) What to say tomorrow */}
      <div className="rounded-bi-lg bg-bi-surfaceCard border border-bi-borderSubtle p-5 shadow-bi-sm mb-6">
        <h3 className="text-base font-semibold text-bi-text mb-3">What to say tomorrow</h3>
        <div className="space-y-2">
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
      </div>

      {/* D) What to change this week — Behaviour Shifts */}
      <div className="rounded-bi-lg bg-bi-surfaceCard border border-bi-borderSubtle p-5 shadow-bi-sm mb-6">
        <h3 className="text-base font-semibold text-bi-text mb-3">What to change this week</h3>
        <ul className="space-y-4">
          {behaviourShifts.map((shift, i) => (
            <li key={i}>
              <p className="font-medium text-bi-text text-sm">{shift.title}</p>
              <ul className="list-disc list-inside text-sm text-bi-textMuted mt-1 space-y-0.5">
                <li>{shift.steps[0]}</li>
                <li>{shift.steps[1]}</li>
              </ul>
              <p className="text-xs text-bi-textSubtle mt-1">{shift.timeframe}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* E) Escalation signal */}
      <div className="rounded-bi-lg bg-bi-surfaceCard border border-bi-borderSubtle p-5 shadow-bi-sm">
        <h3 className="text-base font-semibold text-bi-text mb-2">Escalation signal</h3>
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span
            className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
              escalation.level === 'High'
                ? 'bg-bi-danger/20 text-bi-danger'
                : escalation.level === 'Moderate'
                  ? 'bg-bi-warning/20 text-bi-warning'
                  : 'bg-bi-surfaceAlt text-bi-textMuted'
            }`}
          >
            {escalation.level}
          </span>
          {escalation.reasons.length > 0 && (
            <ul className="text-sm text-bi-textMuted list-disc list-inside">
              {escalation.reasons.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          )}
        </div>
        <p className="text-xs text-bi-textSubtle">
          Trajectory signal only — not a prediction of incidents or claims.
        </p>
      </div>
    </section>
  );
}
