export type RiskThresholds = {
  /** Score below this: team "requires attention". */
  team_attention: number;
  /** Domain score below this: below tolerance / systemic. */
  below_tolerance: number;
  /** Domain score below this: at risk (emerging). */
  domain_at_risk: number;
  /** Psychological safety below this: critical for escalation. */
  psych_safety_critical: number;
  /** Consecutive period-over-period declines to flag escalation. */
  consecutive_declines: number;
  /** Max team score − min above this: high spread. */
  range_high: number;
  /** Std dev above this: high variance. */
  variance_high: number;
};

export const defaultThresholds: RiskThresholds = {
  team_attention: 60,
  below_tolerance: 60,
  domain_at_risk: 70,
  psych_safety_critical: 50,
  consecutive_declines: 3,
  range_high: 30,
  variance_high: 12,
};
