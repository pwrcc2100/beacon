/**
 * Centralised risk and participation thresholds for the dashboard.
 * Use these for filters, badges, and callouts so behaviour is consistent.
 */

import { SCORE_THRESHOLDS } from '@/components/dashboard/scoreTheme';

/** Score below this is "elevated risk"; teams below this count as requiring attention. */
export const RISK_THRESHOLD = SCORE_THRESHOLDS.watch; // 65

/** Participation rate below this shows a warning on the Participation card. */
export const PARTICIPATION_WARNING_THRESHOLD = 40;

/** Status labels for display (governance wording). */
export const SCORE_STATUS_LABELS = {
  low: 'Low risk',
  withinTolerance: 'Within tolerance',
  emerging: 'Emerging risk',
  elevated: 'Elevated risk',
} as const;

export function getScoreStatusLabel(score: number): (typeof SCORE_STATUS_LABELS)[keyof typeof SCORE_STATUS_LABELS] {
  if (score >= 80) return SCORE_STATUS_LABELS.low;
  if (score >= 70) return SCORE_STATUS_LABELS.withinTolerance;
  if (score >= RISK_THRESHOLD) return SCORE_STATUS_LABELS.emerging;
  return SCORE_STATUS_LABELS.elevated;
}

export function isBelowRiskThreshold(score: number): boolean {
  return score < RISK_THRESHOLD;
}

/** One-line interpretation for the composite score (hero / summary). */
export const SCORE_INTERPRETATION: Record<string, string> = {
  [SCORE_STATUS_LABELS.low]: 'Low risk — standard monitoring.',
  [SCORE_STATUS_LABELS.withinTolerance]: 'Within tolerance — trend monitoring recommended.',
  [SCORE_STATUS_LABELS.emerging]: 'Emerging risk — targeted review recommended.',
  [SCORE_STATUS_LABELS.elevated]: 'Elevated risk — monitor and intervene early.',
};

export function getScoreInterpretation(score: number): string {
  return SCORE_INTERPRETATION[getScoreStatusLabel(score)] ?? SCORE_INTERPRETATION[SCORE_STATUS_LABELS.elevated];
}
