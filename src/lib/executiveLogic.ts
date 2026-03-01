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

// ——— Primary Focus: systemic criteria & reason flags ———

const BELOW_TOLERANCE = 60;
const PARTICIPATION_NOT_LOW = 50;

export type PrimaryFocusType = 'systemic' | 'emerging' | 'focus';

export type ReasonFlag = {
  id: string;
  label: string;
  icon: 'trend' | 'lowest' | 'teams' | 'periods' | 'variance';
};

export type PrimaryFocusResult = {
  domain: DomainPriorityItem;
  type: PrimaryFocusType;
  /** e.g. "3 consecutive periods" */
  persistenceLabel: string | null;
  /** e.g. "5 teams below tolerance" */
  breadthLabel: string | null;
  reasonFlags: ReasonFlag[];
};

/**
 * Systemic Risk: score < 60 for 2 consecutive periods AND (30%+ teams or 3+ teams) below 60 AND participation >= 50%.
 * Emerging Signal: single-period drop (current < 60, declined).
 * Selection: 1) Systemic domains, 2) largest sustained decline, 3) lowest score.
 */
export function computePrimaryFocusSystemic(params: {
  domainScoresCurrent: Record<string, number | undefined>;
  domainScoresPrevious?: Record<string, number | undefined> | null;
  teamScores: number[];
  participationPercent: number;
  trendSeries?: Array<{ wellbeing: number }>;
}): PrimaryFocusResult | null {
  const { domainScoresCurrent, domainScoresPrevious, teamScores, participationPercent } = params;
  const totalTeams = teamScores.length;
  const teamsBelow60 = teamScores.filter((s) => s < BELOW_TOLERANCE).length;
  const participationNotLow = participationPercent >= PARTICIPATION_NOT_LOW;

  const domainsWithScores: (DomainPriorityItem & { prev100: number })[] = DOMAIN_KEYS.map((key) => {
    const score100 = to100(domainScoresCurrent[key]);
    const prev100 = to100(domainScoresPrevious?.[key]);
    const delta = computeDelta(score100, prev100);
    const severity = score100 < 70 ? clamp((70 - score100) / 70, 0, 1) : 0;
    const trend = delta < 0 ? clamp(-delta / 20, 0, 1) : 0;
    const priorityScore = 0.55 * severity + 0.35 * trend;
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
      prev100,
    };
  });

  const twoPeriodsBelow60 = (d: { score100: number; prev100: number }) =>
    d.score100 < BELOW_TOLERANCE && d.prev100 < BELOW_TOLERANCE;
  const breadthOk = totalTeams === 0 || teamsBelow60 >= 3 || teamsBelow60 / totalTeams >= 0.3;

  // 1) Systemic: all three conditions
  const systemic = domainsWithScores.filter(
    (d) => twoPeriodsBelow60(d) && breadthOk && participationNotLow
  );
  if (systemic.length > 0) {
    systemic.sort((a, b) => a.score100 - b.score100);
    const d = systemic[0];
    const persistenceCount = 2; // we only have 2 periods
    const persistenceLabel = `${persistenceCount} consecutive periods below 60`;
    const breadthLabel = teamsBelow60 > 0 ? `${teamsBelow60} teams below tolerance` : null;
    const domain: DomainPriorityItem = { ...d, prev100: undefined } as DomainPriorityItem;
    return {
      domain,
      type: 'systemic',
      persistenceLabel,
      breadthLabel,
      reasonFlags: getPrimaryFocusReasonFlags(domain, domainsWithScores, teamsBelow60, totalTeams, teamScores, true),
    };
  }

  // 2) Emerging: single period drop (current < 60, declined) or largest decline
  const withDecline = domainsWithScores.filter((d) => d.score100 < 70 && d.delta < 0);
  if (withDecline.length > 0) {
    withDecline.sort((a, b) => a.delta - b.delta); // most negative first
    const d = withDecline[0];
    const domain: DomainPriorityItem = { ...d, prev100: undefined } as DomainPriorityItem;
    const isEmerging = d.score100 < BELOW_TOLERANCE;
    return {
      domain,
      type: isEmerging ? 'emerging' : 'focus',
      persistenceLabel: null,
      breadthLabel: teamsBelow60 > 0 ? `${teamsBelow60} teams below tolerance` : null,
      reasonFlags: getPrimaryFocusReasonFlags(domain, domainsWithScores, teamsBelow60, totalTeams, teamScores, false),
    };
  }

  // 3) Lowest domain score
  const sorted = [...domainsWithScores].sort((a, b) => a.score100 - b.score100);
  const lowest = sorted[0];
  if (!lowest) return null;
  const domain: DomainPriorityItem = { ...lowest, prev100: undefined } as DomainPriorityItem;
  return {
    domain,
    type: 'focus',
    persistenceLabel: null,
    breadthLabel: teamsBelow60 > 0 ? `${teamsBelow60} teams below tolerance` : null,
    reasonFlags: getPrimaryFocusReasonFlags(domain, domainsWithScores, teamsBelow60, totalTeams, teamScores, false),
  };
}

function getPrimaryFocusReasonFlags(
  primary: DomainPriorityItem,
  allDomains: (DomainPriorityItem & { prev100?: number })[],
  teamsBelow60: number,
  totalTeams: number,
  teamScores: number[],
  isSystemic: boolean
): ReasonFlag[] {
  const flags: ReasonFlag[] = [];
  const isLowest = allDomains.every((d) => d.key === primary.key || d.score100 >= primary.score100);
  const sortedByDelta = [...allDomains].sort((a, b) => a.delta - b.delta);
  const isLargestDecline = sortedByDelta[0]?.key === primary.key && primary.delta < 0;
  const primaryWithPrev = allDomains.find((d) => d.key === primary.key);
  const prev100 = primaryWithPrev?.prev100;
  const twoPeriodsBelow =
    primary.score100 < BELOW_TOLERANCE && prev100 != null && prev100 < BELOW_TOLERANCE;

  if (isLowest) flags.push({ id: 'lowest', label: 'Lowest domain score', icon: 'lowest' });
  if (isLargestDecline) flags.push({ id: 'decline', label: 'Largest decline this period', icon: 'trend' });
  if (teamsBelow60 > 0) flags.push({ id: 'teams', label: `${teamsBelow60} teams below tolerance`, icon: 'teams' });
  if (twoPeriodsBelow || isSystemic) flags.push({ id: 'periods', label: '2 consecutive periods below 60', icon: 'periods' });
  if (teamScores.length >= 2) {
    const range = Math.max(...teamScores) - Math.min(...teamScores);
    if (range > RANGE_HIGH_THRESHOLD) flags.push({ id: 'variance', label: 'High variance across teams', icon: 'variance' });
  }

  return flags.slice(0, 3);
}

/**
 * One-line executive risk statement, e.g. "Elevated risk driven by declining Workload & Resourcing across 5 teams."
 */
export function buildExecutiveRiskStatement(params: {
  riskBandLabel: string;
  primaryDomainLabel: string;
  teamsBelow60: number;
  trendDirection: 'declining' | 'stable' | 'improving';
}): string {
  const { riskBandLabel, primaryDomainLabel, teamsBelow60, trendDirection } = params;
  if (riskBandLabel === 'Low risk' || riskBandLabel === 'Within tolerance') {
    return 'Risk within acceptable range.';
  }
  const driver = trendDirection === 'declining' ? 'declining' : trendDirection === 'improving' ? 'improving' : 'current strain in';
  const teamPhrase = teamsBelow60 > 0 ? ` across ${teamsBelow60} team${teamsBelow60 === 1 ? '' : 's'}` : '';
  return `${riskBandLabel} driven by ${driver} ${primaryDomainLabel}${teamPhrase}.`;
}

// ——— 3-layer hierarchy: Exposure verdict & domain heat panel ———

/** Count domains with score < 60 for 2 consecutive periods (current + previous). */
export function getSystemicDomainCount(
  domainScoresCurrent: Record<string, number | undefined>,
  domainScoresPrevious?: Record<string, number | undefined> | null
): number {
  let count = 0;
  for (const key of DOMAIN_KEYS) {
    const score100 = to100(domainScoresCurrent[key]);
    const prev100 = to100(domainScoresPrevious?.[key]);
    if (score100 < BELOW_TOLERANCE && prev100 < BELOW_TOLERANCE) count++;
  }
  return count;
}

/**
 * One-line exposure verdict, e.g. "Systemic strain detected in 2 domains across 32 teams."
 */
export function buildExposureVerdict(params: {
  systemicDomainCount: number;
  totalTeams: number;
  participationLabel: string;
}): string {
  const { systemicDomainCount, totalTeams, participationLabel } = params;
  if (systemicDomainCount > 0) {
    return `Systemic strain detected in ${systemicDomainCount} domain${systemicDomainCount === 1 ? '' : 's'} across ${totalTeams} teams.`;
  }
  const teamPhrase = totalTeams > 0 ? ` across ${totalTeams} team${totalTeams === 1 ? '' : 's'}` : '';
  return `Exposure within acceptable range${teamPhrase}.`;
}

export type DomainHeatRow = {
  key: (typeof DOMAIN_KEYS)[number];
  label: string;
  score100: number;
  delta: number;
  /** Consecutive periods below 60 (we only have 2 periods of data). */
  consecutivePeriodsBelow60: number;
  teamsBelow60: number;
  totalTeams: number;
  /** Participation confidence level for the report. */
  participationLevel: 'high' | 'moderate' | 'low';
  isSystemic: boolean;
};

/**
 * Rows for the Risk Concentration heat panel. Systemic domains first, then by score ascending.
 */
export function computeDomainHeatPanel(params: {
  domainScoresCurrent: Record<string, number | undefined>;
  domainScoresPrevious?: Record<string, number | undefined> | null;
  teamScores: number[];
  participationLevel: 'high' | 'moderate' | 'low';
}): DomainHeatRow[] {
  const { domainScoresCurrent, domainScoresPrevious, teamScores, participationLevel } = params;
  const totalTeams = teamScores.length;
  const teamsBelow60 = teamScores.filter((s) => s < BELOW_TOLERANCE).length;
  const participationNotLow = participationLevel !== 'low';

  const rows: DomainHeatRow[] = DOMAIN_KEYS.map((key) => {
    const score100 = to100(domainScoresCurrent[key]);
    const prev100 = to100(domainScoresPrevious?.[key]);
    const delta = computeDelta(score100, prev100);
    const twoPeriodsBelow = score100 < BELOW_TOLERANCE && prev100 < BELOW_TOLERANCE;
    const breadthOk = totalTeams === 0 || teamsBelow60 >= 3 || teamsBelow60 / totalTeams >= 0.3;
    const isSystemic = twoPeriodsBelow && breadthOk && participationNotLow;
    const consecutivePeriodsBelow60 = twoPeriodsBelow ? 2 : score100 < BELOW_TOLERANCE ? 1 : 0;

    return {
      key,
      label: DOMAIN_LABELS[key],
      score100,
      delta,
      consecutivePeriodsBelow60,
      teamsBelow60,
      totalTeams,
      participationLevel,
      isSystemic,
    };
  });

  rows.sort((a, b) => {
    if (a.isSystemic !== b.isSystemic) return a.isSystemic ? -1 : 1;
    return a.score100 - b.score100;
  });
  return rows;
}

export type DecisionGuidanceItem = {
  title: string;
  scope: string;
  timeHorizon: string;
  successSignal: string;
  domainKey: (typeof DOMAIN_KEYS)[number] | null;
};

/** 1–2 high-leverage behaviour shifts with scope, time horizon, success signal. */
export function getDecisionGuidance(
  primaryDomain: DomainPriorityItem | null,
  secondaryDomain: DomainPriorityItem | null,
  teamsImpactedCount: number
): DecisionGuidanceItem[] {
  const tiles = getActionTiles(primaryDomain, secondaryDomain);
  const scope = teamsImpactedCount > 0 ? `${teamsImpactedCount} team${teamsImpactedCount === 1 ? '' : 's'} impacted` : 'Organisation-wide';
  return tiles.slice(0, 2).map((t) => ({
    title: t.title,
    scope,
    timeHorizon: t.timeframe,
    successSignal: t.successCue,
    domainKey: t.domainKey,
  }));
}

// ——— Cockpit: pattern engine, pressure tiles, control tiles ———

export type PressurePattern = 'Systemic' | 'Persistent' | 'Emerging' | 'Volatile' | 'Localised';

export type PressureTileData = {
  key: (typeof DOMAIN_KEYS)[number];
  label: string;
  pattern: PressurePattern;
  score100: number;
  delta: number;
  persistencePeriods: number;
  breadthPct: number;
  teamsBelow60: number;
  totalTeams: number;
};

function assignPattern(row: DomainHeatRow): PressurePattern {
  if (row.isSystemic) return 'Systemic';
  if (row.consecutivePeriodsBelow60 >= 2) return 'Persistent';
  if (row.score100 < BELOW_TOLERANCE && row.delta < 0) return 'Emerging';
  if (Math.abs(row.delta) >= 12) return 'Volatile';
  if (row.totalTeams > 0 && row.teamsBelow60 / row.totalTeams < 0.2) return 'Localised';
  return row.score100 < 70 ? 'Emerging' : 'Localised';
}

/** Top 2 pressure domains by pattern engine (systemic first, then by severity + trend). */
export function getTopPressureDomains(
  domainHeatRows: DomainHeatRow[],
  _teamScores: number[]
): PressureTileData[] {
  const withPattern = domainHeatRows.map((row) => ({
    ...row,
    pattern: assignPattern(row),
    breadthPct: row.totalTeams > 0 ? (row.teamsBelow60 / row.totalTeams) * 100 : 0,
  }));
  const priority = (d: typeof withPattern[0]) => {
    if (d.pattern === 'Systemic') return 100;
    if (d.pattern === 'Persistent') return 85;
    if (d.pattern === 'Emerging') return 70;
    if (d.pattern === 'Volatile') return 55;
    return 40 - d.score100 / 100;
  };
  withPattern.sort((a, b) => priority(b) - priority(a));
  return withPattern.slice(0, 2).map((d) => ({
    key: d.key,
    label: d.label,
    pattern: d.pattern,
    score100: d.score100,
    delta: d.delta,
    persistencePeriods: d.consecutivePeriodsBelow60,
    breadthPct: d.breadthPct,
    teamsBelow60: d.teamsBelow60,
    totalTeams: d.totalTeams,
  }));
}

export type ControlTileData = {
  leverTitle: string;
  rationale: string;
  steps: string[];
  impactWindow: string;
  successSignal: string;
  domainKey: (typeof DOMAIN_KEYS)[number];
};

function rationaleForPattern(pattern: PressurePattern): string {
  switch (pattern) {
    case 'Systemic':
      return 'Triggered by: breadth + persistence + below tolerance';
    case 'Persistent':
      return 'Triggered by: persistence across periods';
    case 'Emerging':
      return 'Triggered by: breadth + decline';
    case 'Volatile':
      return 'Triggered by: high period-on-period change';
    case 'Localised':
      return 'Triggered by: localised strain';
    default:
      return 'Triggered by: strain signal';
  }
}

/** One control tile per pressure domain: lever, rationale, steps, impact, success signal. */
export function getControlForPressure(
  domainKey: (typeof DOMAIN_KEYS)[number],
  pattern: PressurePattern
): ControlTileData {
  const t = ACTION_TEMPLATES[domainKey];
  const steps = [t.steps[0], t.steps[1]].filter(Boolean);
  return {
    leverTitle: t.title,
    rationale: rationaleForPattern(pattern),
    steps,
    impactWindow: t.timeframe,
    successSignal: t.successCue,
    domainKey,
  };
}

/** Risk label for system state: Low / Watch / Elevated */
export function getRiskLabelShort(score: number): 'Low' | 'Watch' | 'Elevated' {
  if (score >= 80) return 'Low';
  if (score >= 70) return 'Watch';
  return 'Elevated';
}

/** One-sentence executive verdict for boardroom. */
export function getExecutiveVerdictSentence(systemicDomainCount: number, totalTeams: number): string {
  if (systemicDomainCount > 0) {
    return `Systemic strain detected in ${systemicDomainCount} domain${systemicDomainCount === 1 ? '' : 's'} across ${totalTeams} teams.`;
  }
  return `Exposure within acceptable range across ${totalTeams} teams.`;
}

/** One short sentence: "What to say tomorrow" for a lever card. */
export function getWhatToSayTomorrow(
  domainLabel: string,
  pattern: PressurePattern,
  teamsImpacted: number
): string {
  if (pattern === 'Systemic') {
    return `We're prioritising ${domainLabel} this week; ${teamsImpacted} teams need support.`;
  }
  if (pattern === 'Persistent') {
    return `We're watching ${domainLabel} and acting in the next 7 days.`;
  }
  return `We're focusing on ${domainLabel} where strain is concentrated.`;
}

/** One-liner: what changed this period (for supporting evidence). */
export function getWhatChangedThisPeriod(
  domainHeatRows: DomainHeatRow[],
  _previousDomainScores?: Record<string, number | undefined> | null
): string {
  const declined = domainHeatRows.filter((d) => d.delta < 0).sort((a, b) => a.delta - b.delta);
  const below60 = domainHeatRows.filter((d) => d.score100 < 60);
  if (declined.length === 0 && below60.length === 0) return 'No material change this period.';
  const parts: string[] = [];
  if (declined.length > 0) {
    const top = declined[0];
    parts.push(`${top.label} down ${Math.abs(top.delta)} pts`);
  }
  if (below60.length > 0) parts.push(`${below60.length} domain${below60.length === 1 ? '' : 's'} below 60`);
  return parts.join('; ') + '.';
}

export { DOMAIN_KEYS, DOMAIN_LABELS };
