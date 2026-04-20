import type { WellbeingRow } from '@/app/dashboard/dashboardData';

export type BeaconSignalType =
  | 'Early Pressure'
  | 'Sustained Pressure'
  | 'System Strain';

export type BeaconSignal = {
  type: BeaconSignalType;
  domain: string;
  currentScore: number;
  interpretation: string;
  severity: 'warning' | 'escalation' | 'system';
};

const DOMAIN_CONFIG = [
  { key: 'sentiment_avg', label: 'Experience' },
  { key: 'workload_avg', label: 'Workload & Resourcing' },
  { key: 'safety_avg', label: 'Psychological Safety' },
  { key: 'leadership_avg', label: 'Leadership & Support' },
  { key: 'clarity_avg', label: 'Clarity & Direction' },
] as const;

type DomainScores = {
  sentiment: number;
  clarity: number;
  workload: number;
  safety: number;
  leadership: number;
};

export function evaluateBeaconSignals({
  overallScore,
  questionScores,
  trends,
}: {
  overallScore: number;
  questionScores: DomainScores;
  trends: WellbeingRow[];
}): BeaconSignal[] {
  const signals: BeaconSignal[] = [];

  const currentScores: Record<string, number> = {
    Experience: Math.round((questionScores.sentiment ?? 0) * 20),
    'Workload & Resourcing': Math.round((questionScores.workload ?? 0) * 20),
    'Psychological Safety': Math.round((questionScores.safety ?? 0) * 20),
    'Leadership & Support': Math.round((questionScores.leadership ?? 0) * 20),
    'Clarity & Direction': Math.round((questionScores.clarity ?? 0) * 20),
  };

  for (const [domain, score] of Object.entries(currentScores)) {
    if (score < 60) {
      signals.push({
        type: 'Early Pressure',
        domain,
        currentScore: score,
        interpretation:
          'Work demands may be exceeding available capacity. If sustained, this may influence broader system conditions.',
        severity: 'warning',
      });
    }
  }

  if (trends.length >= 3) {
    const recentPeriods = trends.slice(-3);

    for (const config of DOMAIN_CONFIG) {
      const periodScores = recentPeriods.map((row) =>
        Math.round((Number(row[config.key]) || 0) * 20)
      );
      const isSustained = periodScores.every((score) => score < 65);

      if (isSustained) {
        signals.push({
          type: 'Sustained Pressure',
          domain: config.label,
          currentScore: periodScores[periodScores.length - 1] ?? 0,
          interpretation:
            'Pressure signals have persisted over multiple measurement periods. Leadership attention recommended.',
          severity: 'escalation',
        });
      }
    }
  }

  if (overallScore < 70) {
    signals.push({
      type: 'System Strain',
      domain: 'Organisation',
      currentScore: Math.round(overallScore),
      interpretation:
        'The overall Beacon Index indicates emerging system strain requiring organisational review.',
      severity: 'system',
    });
  }

  const rank: Record<BeaconSignal['severity'], number> = {
    system: 0,
    escalation: 1,
    warning: 2,
  };

  signals.sort((a, b) => rank[a.severity] - rank[b.severity] || a.currentScore - b.currentScore);

  return signals;
}
