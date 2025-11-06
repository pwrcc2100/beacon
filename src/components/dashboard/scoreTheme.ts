export const SCORE_THRESHOLDS = {
  thriving: 70,
  watch: 40,
} as const;

export const SCORE_COLORS = {
  thriving: '#1A936F',
  watch: '#F4A259',
  alert: '#E63946',
  neutral: '#94A3B8',
} as const;

export const SCORE_BACKGROUNDS = {
  thriving: '#E6F4EA',
  watch: '#FFF4E6',
  alert: '#FDEAE7',
  neutral: '#F1F5F9',
} as const;

export type ScoreCategory = 'thriving' | 'watch' | 'alert' | 'unknown';

function clampPercent(value: number) {
  if (Number.isNaN(value)) return undefined;
  if (!Number.isFinite(value)) return undefined;
  return Math.max(0, Math.min(100, value));
}

export function scoreToPercent(value?: number | null, scale: 'hundred' | 'five' = 'hundred') {
  if (value === undefined || value === null) {
    return undefined;
  }

  const numeric = Number(value);
  if (Number.isNaN(numeric)) {
    return undefined;
  }

  const percent = scale === 'five' ? numeric * 20 : numeric;
  return clampPercent(percent);
}

export function getScoreStatus(percent?: number | null) {
  const value = percent ?? undefined;

  if (value === undefined || Number.isNaN(value)) {
    return {
      category: 'unknown' as ScoreCategory,
      label: 'No data',
      color: SCORE_COLORS.neutral,
      background: SCORE_BACKGROUNDS.neutral,
    };
  }

  if (value >= SCORE_THRESHOLDS.thriving) {
    return {
      category: 'thriving' as ScoreCategory,
      label: 'Thriving',
      color: SCORE_COLORS.thriving,
      background: SCORE_BACKGROUNDS.thriving,
    };
  }

  if (value >= SCORE_THRESHOLDS.watch) {
    return {
      category: 'watch' as ScoreCategory,
      label: 'Ones to Watch',
      color: SCORE_COLORS.watch,
      background: SCORE_BACKGROUNDS.watch,
    };
  }

  return {
    category: 'alert' as ScoreCategory,
    label: 'High Alert',
    color: SCORE_COLORS.alert,
    background: SCORE_BACKGROUNDS.alert,
  };
}

export function formatPercent(value?: number | null) {
  const percent = value ?? undefined;
  if (percent === undefined || Number.isNaN(percent)) {
    return '—';
  }
  return `${Math.round(percent)}%`;
}

export function calculateWellbeingPercent({
  sentiment,
  workload,
  safety,
  leadership,
  clarity,
}: {
  sentiment?: number;
  workload?: number;
  safety?: number;
  leadership?: number;
  clarity?: number;
}) {
  const inputs = [sentiment, workload, safety, leadership, clarity];
  if (inputs.some(value => value === undefined || value === null)) {
    return undefined;
  }

  const weighted =
    sentiment! * 0.25 +
    workload! * 0.25 +
    safety! * 0.2 +
    leadership! * 0.2 +
    clarity! * 0.1;

  return clampPercent(weighted * 20);
}


