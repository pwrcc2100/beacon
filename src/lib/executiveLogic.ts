/**
 * Executive-layer priority scoring for glanceable, directive UI.
 * Uses severity + trend + spread to rank domains and teams.
 */

import { TEAM_ATTENTION_THRESHOLD } from './riskConfig';
import {
  CONSECUTIVE_DECLINES_THRESHOLD,
  PSYCH_SAFETY_CRITICAL,
  RANGE_HIGH_THRESHOLD,
} from './riskConfig';
import { computeDelta } from './riskLogic';

const DOMAIN_KEYS = ['experience', 'workload', 'safety', 'leadership', 'clarity'] as const;
const DOMAIN_LABELS: Record<(typeof DOMAIN_KEYS)[number], string> = {
  experience: 'Experience',
  workload: 'Workload & Resourcing',
  safety: 'Psychological Safety',
  leadership: 'Leadership & Support',
  clarity: 'Clarity & Direction',
};

function clamp(x: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, x));
}

/** Score 0–5 → 0–100 */
function to100(raw: number | undefined): number {
  if (raw == null || !Number.isFinite(raw)) return 0;
  return clamp(raw * 20, 0, 100);
}

export type DomainPriorityItem = {
  key: (typeof DOMAIN_KEYS)[number];
  label: string;
  score100: number;
  delta: number;
  priorityScore: number;
  whyShort: string;
};

export type DomainPriorityResult = {
  primaryDomain: DomainPriorityItem | null;
  secondaryDomain: DomainPriorityItem | null;
  domainsRanked: DomainPriorityItem[];
};

/**
 * priorityScore = 0.55*severity + 0.35*trend + 0.10*spread
 * severity = clamp((70 - score)/70, 0, 1) when score < 70
 * trend = clamp((-delta)/20, 0, 1) when delta < 0
 */
export function computeDomainPriority(
  domainScoresCurrent: Record<string, number | undefined>,
  domainScoresPrevious?: Record<string, number | undefined> | null,
  spreadByDomain?: Record<string, number> | null
): DomainPriorityResult {
  const items: DomainPriorityItem[] = DOMAIN_KEYS.map((key) => {
    const score100 = to100(domainScoresCurrent[key]);
    const prev100 = to100(domainScoresPrevious?.[key]);
    const delta = computeDelta(score100, prev100);
    const severity = score100 < 70 ? clamp((70 - score100) / 70, 0, 1) : 0;
    const trend = delta < 0 ? clamp(-delta / 20, 0, 1) : 0;
    const spread = spreadByDomain?.[key] != null ? clamp(spreadByDomain[key] / 30, 0, 1) : 0;
    const priorityScore = 0.55 * severity + 0.35 * trend + 0.1 * spread;

    let whyShort = '';
    if (score100 < 70 && delta < 0) whyShort = 'Below tolerance and declining';
    else if (score100 < 70) whyShort = 'Below tolerance';
    else if (delta < 0) whyShort = 'Declining';

    return {
      key,
      label: DOMAIN_LABELS[key],
      score100,
      delta,
      priorityScore,
      whyShort: whyShort || 'Monitor',
    };
  });

  items.sort((a, b) => b.priorityScore - a.priorityScore);
  const atRisk = items.filter((d) => d.score100 < 70);
  const primaryDomain = atRisk.length > 0 ? atRisk[0] : items[0] ?? null;
  const secondaryDomain = atRisk.length > 1 ? atRisk[1] : items[1] ?? null;

  return {
    primaryDomain,
    secondaryDomain,
    domainsRanked: items,
  };
}

export type TeamPriorityItem = {
  teamId: string;
  teamName: string;
  score: number;
  delta: number;
  priorityScore: number;
  participationPercent: number | undefined;
};

/**
 * Teams below 60: teamPriority = 0.6*severity + 0.4*trend
 * severity = (60 - score)/60, trend = clamp((-delta)/20, 0, 1)
 */
export function computeTeamPriority(
  teamScores: Array<{
    teamId: string;
    teamName: string;
    score: number;
    previousScore?: number | null;
    participationPercent?: number | null;
  }>
): TeamPriorityItem[] {
  const below = teamScores.filter((t) => t.score < TEAM_ATTENTION_THRESHOLD);
  const withPriority = below.map((t) => {
    const delta = computeDelta(t.score, t.previousScore);
    const severity = (60 - t.score) / 60;
    const trend = delta < 0 ? clamp(-delta / 20, 0, 1) : 0;
    const priorityScore = 0.6 * severity + 0.4 * trend;
    return {
      teamId: t.teamId,
      teamName: t.teamName,
      score: t.score,
      delta,
      priorityScore,
      participationPercent: t.participationPercent ?? undefined,
    };
  });
  withPriority.sort((a, b) => b.priorityScore - a.priorityScore);
  return withPriority.slice(0, 5);
}

export type ParticipationConfidenceResult = {
  label: 'High confidence' | 'Moderate confidence' | 'Low confidence';
  level: 'high' | 'moderate' | 'low';
  rate: number;
  delta: number;
  caution: string | null;
};

export function computeParticipationConfidence(
  rate: number,
  delta?: number | null
): ParticipationConfidenceResult {
  const r = clamp(rate, 0, 100);
  const d = delta ?? 0;
  let label: ParticipationConfidenceResult['label'] = 'High confidence';
  let level: ParticipationConfidenceResult['level'] = 'high';
  let caution: string | null = null;

  if (r >= 70) {
    label = 'High confidence';
    level = 'high';
  } else if (r >= 50) {
    label = 'Moderate confidence';
    level = 'moderate';
    caution = 'Participation below target may mask underlying strain.';
  } else {
    label = 'Low confidence';
    level = 'low';
    caution = 'Low participation — interpret results with caution.';
  }

  return { label, level, rate: r, delta: d, caution };
}

export type EscalationResult = {
  score: number; // 0–100
  level: 'Low' | 'Moderate' | 'High';
  reasons: string[];
};

/**
 * Escalation 0–100 score from heuristics; map to Low/Moderate/High.
 * reasons: 2–3 plain-English, max 2 shown in UI (rest in tooltip).
 */
export function computeEscalationSignal(data: {
  trendSeries?: Array<{ wellbeing: number }>;
  domainScores?: { safety?: number };
  teamScores?: number[];
}): EscalationResult {
  let score = 0;
  const reasons: string[] = [];

  const series = data.trendSeries ?? [];
  if (series.length >= CONSECUTIVE_DECLINES_THRESHOLD) {
    let declines = 0;
    for (let i = series.length - 1; i > 0; i--) {
      if (series[i].wellbeing < series[i - 1].wellbeing) declines++;
      else break;
    }
    if (declines >= CONSECUTIVE_DECLINES_THRESHOLD) {
      score += 45;
      reasons.push('Several periods of decline in a row');
    }
  }

  const safety100 = data.domainScores?.safety != null ? to100(data.domainScores.safety) : undefined;
  if (safety100 != null && safety100 < PSYCH_SAFETY_CRITICAL) {
    score += 40;
    reasons.push('Psychological safety below critical level');
  }

  const teamScores = data.teamScores ?? [];
  if (teamScores.length >= 2) {
    const range = Math.max(...teamScores) - Math.min(...teamScores);
    if (range > RANGE_HIGH_THRESHOLD) {
      score += 25;
      reasons.push('Wide spread between team scores');
    }
  }

  score = clamp(score, 0, 100);

  let level: EscalationResult['level'] = 'Low';
  if (score >= 60) level = 'High';
  else if (score >= 30) level = 'Moderate';

  return { score, level, reasons: reasons.slice(0, 3) };
}

export type ActionTileData = {
  title: string;
  steps: [string, string];
  successCue: string;
  timeframe: string;
  domainKey: (typeof DOMAIN_KEYS)[number] | null;
};

const ACTION_TEMPLATES: Record<(typeof DOMAIN_KEYS)[number], Omit<ActionTileData, 'domainKey'>> = {
  workload: {
    title: 'Rebalance workload this week',
    steps: [
      'Run a 30-minute capacity check with the team.',
      'Defer or drop one non-critical deliverable.',
    ],
    successCue: 'Team confirms one item deferred or resourced.',
    timeframe: 'Next 7 days',
  },
  safety: {
    title: 'Strengthen speak-up safety',
    steps: [
      "Open next meeting with 'What's getting in the way?'",
      'Close the loop on one issue within 5 days.',
    ],
    successCue: 'At least one concern raised and acknowledged.',
    timeframe: 'Next 7 days',
  },
  clarity: {
    title: 'Reconfirm priorities in writing',
    steps: [
      'Restate top 3 priorities and success measures.',
      'Clarify ownership and timelines in one message.',
    ],
    successCue: 'Priorities and owners visible to the team.',
    timeframe: 'Next 7 days',
  },
  leadership: {
    title: 'Increase visible support',
    steps: [
      'Schedule short 1:1 check-ins with key roles.',
      'Remove one blocker within 72 hours.',
    ],
    successCue: 'One blocker removed and communicated.',
    timeframe: 'Next 7 days',
  },
  experience: {
    title: 'Fix friction points',
    steps: [
      'Identify the top 1–2 pain points this week.',
      'Make one concrete process change and communicate it.',
    ],
    successCue: 'One process change made and shared.',
    timeframe: 'Next 7 days',
  },
};

/** Exactly 2 action tiles: tile 1 = primary domain, tile 2 = secondary or fallback experience. */
export function getActionTiles(
  primaryDomain: DomainPriorityItem | null,
  secondaryDomain: DomainPriorityItem | null
): ActionTileData[] {
  const tiles: ActionTileData[] = [];
  const primary = primaryDomain?.key ?? 'experience';
  const secondary = secondaryDomain?.key ?? 'experience';
  const t1 = ACTION_TEMPLATES[primary];
  const t2 = primary === secondary ? ACTION_TEMPLATES.experience : ACTION_TEMPLATES[secondary];
  tiles.push({ ...t1, domainKey: primary });
  tiles.push({ ...t2, domainKey: primary === secondary ? null : secondary });
  return tiles.slice(0, 2);
}

export { DOMAIN_KEYS, DOMAIN_LABELS };
