/**
 * Operational Risk Monitor — pattern and table logic.
 * Uses risk_thresholds from client_config (no hardcoded values).
 */

import type { RiskThresholds, SystemicThresholds } from '@/lib/config/defaultThresholds';

export type DomainRiskPattern =
  | 'Systemic decline'
  | 'Localised persistent'
  | 'Emerging deterioration'
  | 'Volatile'
  | 'Stable';

export type DomainRiskRow = {
  domainKey: string;
  domainLabel: string;
  score: number;
  delta: number;
  teamsBelow: number;
  totalTeams: number;
  persistence: number;
  pattern: DomainRiskPattern;
  status: 'elevated' | 'watch' | 'low';
};

const DOMAIN_LABELS: Record<string, string> = {
  experience: 'Experience',
  workload: 'Workload & Resourcing',
  safety: 'Psychological Safety',
  leadership: 'Leadership & Support',
  clarity: 'Clarity & Direction',
};

function getSystemicThresholds(thresholds: RiskThresholds): SystemicThresholds {
  const d = thresholds?.systemic;
  return d ?? { minConsecutive: 2, minTeamsPct: 30 };
}

function getVolatilityThreshold(thresholds: RiskThresholds): number {
  return thresholds?.volatilityThreshold ?? 10;
}

function getBelowTolerance(thresholds: RiskThresholds): number {
  return thresholds?.below_tolerance ?? 60;
}

/**
 * Rule-based pattern assignment from spec.
 */
export function assignDomainPattern(
  row: {
    score: number;
    delta: number;
    persistence: number;
    teamsBelow: number;
    totalTeams: number;
  },
  thresholds: RiskThresholds
): DomainRiskPattern {
  const sys = getSystemicThresholds(thresholds);
  const belowTolerance = getBelowTolerance(thresholds);
  const vol = getVolatilityThreshold(thresholds);
  const breadthPct = row.totalTeams > 0 ? (row.teamsBelow / row.totalTeams) * 100 : 0;

  if (breadthPct >= sys.minTeamsPct && row.persistence >= sys.minConsecutive) return 'Systemic decline';
  if (breadthPct < sys.minTeamsPct && row.persistence >= sys.minConsecutive) return 'Localised persistent';
  if (row.delta <= -10 && row.persistence === 1) return 'Emerging deterioration';
  if (Math.abs(row.delta) > vol && row.persistence === 0) return 'Volatile';
  return 'Stable';
}

export function getStatus(score: number, thresholds: RiskThresholds): 'elevated' | 'watch' | 'low' {
  const below = getBelowTolerance(thresholds);
  if (score < below) return 'elevated';
  if (score < 70) return 'watch';
  return 'low';
}

/**
 * Build domain risk table rows and sort: Systemic decline → Emerging deterioration → score ascending.
 */
export function buildDomainRiskTable(
  domainScores: Record<string, number>,
  previousDomainScores: Record<string, number> | null | undefined,
  teamScores: number[],
  thresholds: RiskThresholds
): DomainRiskRow[] {
  const belowTolerance = getBelowTolerance(thresholds);
  const totalTeams = teamScores.length;
  const teamsBelow = teamScores.filter((s) => s < (thresholds.team_attention ?? 60)).length;

  const rows: DomainRiskRow[] = Object.entries(DOMAIN_LABELS).map(([key, label]) => {
    const raw = domainScores[key];
    const prevRaw = previousDomainScores?.[key];
    const score = typeof raw === 'number' && Number.isFinite(raw) ? Math.round(raw * 20) : 0;
    const prevScore = typeof prevRaw === 'number' && Number.isFinite(prevRaw) ? Math.round(prevRaw * 20) : null;
    const delta = prevScore != null ? score - prevScore : 0;
    const currentBelow = score < belowTolerance;
    const prevBelow = prevScore != null && prevScore < belowTolerance;
    const persistence = currentBelow && prevBelow ? 2 : currentBelow ? 1 : 0;

    const pattern = assignDomainPattern(
      { score, delta, persistence, teamsBelow, totalTeams },
      thresholds
    );
    const status = getStatus(score, thresholds);

    return {
      domainKey: key,
      domainLabel: label,
      score: Math.max(0, Math.min(100, score)),
      delta,
      teamsBelow,
      totalTeams,
      persistence,
      pattern,
      status,
    };
  });

  const patternOrder = (p: DomainRiskPattern) => {
    if (p === 'Systemic decline') return 3;
    if (p === 'Emerging deterioration') return 2;
    return 1;
  };
  rows.sort((a, b) => {
    const pa = patternOrder(a.pattern);
    const pb = patternOrder(b.pattern);
    if (pa !== pb) return pb - pa;
    return a.score - b.score;
  });

  return rows;
}

/** Whether to show lever recommendations (Section 4). */
export function shouldShowLeverRecommendations(
  rows: DomainRiskRow[],
  thresholds: RiskThresholds
): boolean {
  const sys = getSystemicThresholds(thresholds);
  for (const r of rows) {
    if (r.pattern === 'Systemic decline') return true;
    const breadthPct = r.totalTeams > 0 ? (r.teamsBelow / r.totalTeams) * 100 : 0;
    if (breadthPct >= sys.minTeamsPct && r.delta <= -10) return true;
  }
  return false;
}

/** Rows that trigger a lever recommendation (for Section 4). */
export function getTriggeredLeverRows(rows: DomainRiskRow[], thresholds: RiskThresholds): DomainRiskRow[] {
  const sys = getSystemicThresholds(thresholds);
  return rows.filter((r) => {
    if (r.pattern === 'Systemic decline') return true;
    const breadthPct = r.totalTeams > 0 ? (r.teamsBelow / r.totalTeams) * 100 : 0;
    return breadthPct >= sys.minTeamsPct && r.delta <= -10;
  });
}
