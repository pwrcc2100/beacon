/**
 * Executive-layer risk logic. Uses riskConfig thresholds.
 * Trajectory and confidence signals only — not legal or incident prediction.
 */

import {
  RISK_BANDS,
  PARTICIPATION_CONFIDENCE,
  TEAM_ATTENTION_THRESHOLD,
  PSYCH_SAFETY_CRITICAL,
  CONSECUTIVE_DECLINES_THRESHOLD,
  RANGE_HIGH_THRESHOLD,
  type RiskBandKey,
  type ParticipationConfidenceKey,
} from './riskConfig';

export type RiskBand = { key: RiskBandKey; label: string; tone: 'calm' | 'cautious' | 'urgent' };
export type ParticipationConfidence = {
  key: ParticipationConfidenceKey;
  label: string;
  tone: 'calm' | 'cautious' | 'urgent';
};

/** Score in 0–100. Returns risk band. */
export function getRiskBand(score: number): RiskBand {
  const s = safeScore(score);
  if (s >= RISK_BANDS.low.min) return { key: 'low', ...RISK_BANDS.low };
  if (s >= RISK_BANDS.withinTolerance.min) return { key: 'withinTolerance', ...RISK_BANDS.withinTolerance };
  if (s >= RISK_BANDS.emerging.min) return { key: 'emerging', ...RISK_BANDS.emerging };
  return { key: 'elevated', ...RISK_BANDS.elevated };
}

/** Participation rate 0–100. Returns confidence band. */
export function getParticipationConfidence(rate: number): ParticipationConfidence {
  const r = safeScore(rate);
  if (r >= PARTICIPATION_CONFIDENCE.high.min)
    return { key: 'high', ...PARTICIPATION_CONFIDENCE.high };
  if (r >= PARTICIPATION_CONFIDENCE.moderate.min)
    return { key: 'moderate', ...PARTICIPATION_CONFIDENCE.moderate };
  return { key: 'low', ...PARTICIPATION_CONFIDENCE.low };
}

export function computeDelta(current: number | undefined | null, previous: number | undefined | null): number {
  const c = current != null && Number.isFinite(current) ? current : null;
  const p = previous != null && Number.isFinite(previous) ? previous : null;
  if (c === null || p === null) return 0;
  return Math.round((c - p) * 10) / 10; // one decimal
}

const DOMAIN_KEYS = ['experience', 'workload', 'safety', 'leadership', 'clarity'] as const;
const DOMAIN_LABELS: Record<(typeof DOMAIN_KEYS)[number], string> = {
  experience: 'Experience',
  workload: 'Workload & Resourcing',
  safety: 'Psychological Safety',
  leadership: 'Leadership & Support',
  clarity: 'Clarity & Direction',
};

export type DomainAtRisk = {
  key: (typeof DOMAIN_KEYS)[number];
  label: string;
  score100: number;
  delta: number;
};

/** Domain scores in 0–5 scale (as in dashboard). Returns top 2 domains at risk (lowest first). */
export function identifyDomainsAtRisk(domainScores: {
  experience?: number;
  workload?: number;
  safety?: number;
  leadership?: number;
  clarity?: number;
}): DomainAtRisk[] {
  const withPercent = DOMAIN_KEYS.map((key) => {
    const raw = domainScores[key];
    const score100 = raw != null && Number.isFinite(raw) ? Math.max(0, Math.min(100, raw * 20)) : 0;
    return { key, label: DOMAIN_LABELS[key], score100 };
  });
  withPercent.sort((a, b) => a.score100 - b.score100);
  return withPercent.slice(0, 2).map((d) => ({ ...d, delta: 0 }));
}

/** With previous domain scores, include deltas. */
export function identifyDomainsAtRiskWithDelta(
  current: Record<string, number | undefined>,
  previous?: Record<string, number | undefined> | null
): DomainAtRisk[] {
  const withPercent = DOMAIN_KEYS.map((key) => {
    const raw = current[key];
    const prevRaw = previous?.[key];
    const score100 = raw != null && Number.isFinite(raw) ? Math.max(0, Math.min(100, raw * 20)) : 0;
    const prev100 = prevRaw != null && Number.isFinite(prevRaw) ? prevRaw * 20 : undefined;
    const delta = computeDelta(score100, prev100);
    return { key, label: DOMAIN_LABELS[key], score100, delta };
  });
  withPercent.sort((a, b) => a.score100 - b.score100);
  return withPercent.slice(0, 2);
}

export type TeamRequiringAttention = {
  teamId: string;
  teamName: string;
  score: number;
  delta: number;
  participationPercent: number | undefined;
};

/** Teams with score < TEAM_ATTENTION_THRESHOLD (60), sorted worst-first, max 3. */
export function identifyTeamsRequiringAttention(
  teamScores: Array<{
    teamId: string;
    teamName: string;
    score: number;
    previousScore?: number | null;
    participationPercent?: number | null;
  }>
): TeamRequiringAttention[] {
  const filtered = teamScores
    .filter((t) => t.score < TEAM_ATTENTION_THRESHOLD)
    .map((t) => ({
      teamId: t.teamId,
      teamName: t.teamName,
      score: t.score,
      delta: computeDelta(t.score, t.previousScore),
      participationPercent: t.participationPercent ?? undefined,
    }));
  filtered.sort((a, b) => a.score - b.score);
  return filtered.slice(0, 3);
}

export type BehaviourShift = {
  title: string;
  steps: [string, string];
  timeframe: string;
};

const BEHAVIOUR_SHIFT_TEMPLATES: Record<(typeof DOMAIN_KEYS)[number], BehaviourShift> = {
  workload: {
    title: 'Rebalance workload this week',
    steps: [
      'Run a 30-minute capacity check with the team.',
      'Defer or drop one non-critical deliverable.',
    ],
    timeframe: 'Next 7 days',
  },
  safety: {
    title: 'Strengthen speak-up safety',
    steps: [
      "Open next meeting with 'What's getting in the way?'",
      'Close the loop on one issue within 5 days.',
    ],
    timeframe: 'Next 7 days',
  },
  clarity: {
    title: 'Reconfirm priorities in writing',
    steps: [
      'Restate top 3 priorities and success measures.',
      'Clarify ownership and timelines in one message.',
    ],
    timeframe: 'Next 7 days',
  },
  leadership: {
    title: 'Increase visible support',
    steps: [
      'Schedule short 1:1 check-ins with key roles.',
      'Remove one blocker within 72 hours.',
    ],
    timeframe: 'Next 7 days',
  },
  experience: {
    title: 'Fix friction points',
    steps: [
      'Identify the top 1–2 pain points this week.',
      'Make one concrete process change and communicate it.',
    ],
    timeframe: 'Next 7 days',
  },
};

/** Exactly 2 behaviour shifts from the lowest domains at risk. */
export function deriveBehaviourShifts(domainsAtRisk: DomainAtRisk[]): BehaviourShift[] {
  const shifts: BehaviourShift[] = [];
  const used = new Set<string>();
  for (const d of domainsAtRisk) {
    if (shifts.length >= 2) break;
    const t = BEHAVIOUR_SHIFT_TEMPLATES[d.key];
    if (t && !used.has(d.key)) {
      used.add(d.key);
      shifts.push(t);
    }
  }
  if (shifts.length < 2) {
    const fallback = BEHAVIOUR_SHIFT_TEMPLATES.experience;
    while (shifts.length < 2) shifts.push(fallback);
  }
  return shifts.slice(0, 2);
}

export type EscalationLevel = 'Low' | 'Moderate' | 'High';
export type EscalationSignal = { level: EscalationLevel; reasons: string[] };

/**
 * Trajectory signal only — not a prediction of incidents or claims.
 * Uses consecutive declines, psych safety, and team score spread.
 */
export function computeEscalationSignal(data: {
  trendSeries?: Array<{ wellbeing: number }>;
  domainScores?: { safety?: number };
  teamScores?: number[];
}): EscalationSignal {
  const reasons: string[] = [];
  let level: EscalationLevel = 'Low';

  const series = data.trendSeries ?? [];
  if (series.length >= CONSECUTIVE_DECLINES_THRESHOLD) {
    let declines = 0;
    for (let i = series.length - 1; i > 0 && declines < CONSECUTIVE_DECLINES_THRESHOLD; i--) {
      if (series[i].wellbeing < series[i - 1].wellbeing) declines++;
      else break;
    }
    if (declines >= CONSECUTIVE_DECLINES_THRESHOLD) {
      reasons.push(`${CONSECUTIVE_DECLINES_THRESHOLD} consecutive periods of decline`);
      level = 'Moderate';
    }
  }

  const safetyRaw = data.domainScores?.safety;
  const safety100 = safetyRaw != null && Number.isFinite(safetyRaw) ? safetyRaw * 20 : undefined;
  if (safety100 != null && safety100 < PSYCH_SAFETY_CRITICAL) {
    reasons.push('Psychological safety below critical level');
    if (level === 'Low') level = 'Moderate';
    else level = 'High';
  }

  const scores = data.teamScores ?? [];
  if (scores.length >= 2) {
    const min = Math.min(...scores);
    const max = Math.max(...scores);
    if (max - min > RANGE_HIGH_THRESHOLD) {
      reasons.push('Wide spread between highest and lowest team scores');
      if (level === 'Moderate') level = 'High';
      else if (level === 'Low') level = 'Moderate';
    }
  }

  return { level, reasons };
}

function safeScore(n: number): number {
  if (typeof n !== 'number' || !Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(100, n));
}
