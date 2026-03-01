/**
 * Centralised risk and participation config for the Executive Layer.
 * Beacon Index bands and escalation heuristics (trajectory only, not legal prediction).
 */

export const RISK_BANDS = {
  low: { min: 80, label: 'Low risk', tone: 'calm' as const },
  withinTolerance: { min: 70, label: 'Within tolerance', tone: 'calm' as const },
  emerging: { min: 60, label: 'Emerging strain', tone: 'cautious' as const },
  elevated: { min: 0, label: 'Elevated risk', tone: 'urgent' as const },
} as const;

export const PARTICIPATION_CONFIDENCE = {
  high: { min: 70, label: 'High confidence', tone: 'calm' as const },
  moderate: { min: 50, label: 'Moderate confidence', tone: 'cautious' as const },
  low: { min: 0, label: 'Low confidence', tone: 'urgent' as const },
} as const;

/** Score below this: team "requires attention" (elevated or emerging). */
export const TEAM_ATTENTION_THRESHOLD = 60;

/** Psychological safety domain score below this is critical for escalation heuristic. */
export const PSYCH_SAFETY_CRITICAL = 50;

/** Number of consecutive period-over-period declines to flag escalation. */
export const CONSECUTIVE_DECLINES_THRESHOLD = 3;

/** Variance across teams: std dev above this suggests uneven exposure. */
export const VARIANCE_HIGH_THRESHOLD = 12;

/** Simple range heuristic: max team score − min team score above this suggests spread. */
export const RANGE_HIGH_THRESHOLD = 30;

export type RiskBandKey = keyof typeof RISK_BANDS;
export type ParticipationConfidenceKey = keyof typeof PARTICIPATION_CONFIDENCE;
