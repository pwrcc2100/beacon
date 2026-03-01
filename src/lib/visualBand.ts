/**
 * Maps a 0–100 score to a visual band for gradients and badges.
 * Consistent band-to-gradient mapping: ok (≥80), 70–79 ok, warn (60–69), risk (<60).
 */

export type VisualBand = 'ok' | 'warn' | 'risk';

export type GetVisualBandResult = {
  label: string;
  band: VisualBand;
  gradientVar: string;
  textClass: string;
};

const BANDS: Record<VisualBand, { label: string; gradientVar: string; textClass: string }> = {
  ok: {
    label: 'Low risk',
    gradientVar: 'var(--grad-ok)',
    textClass: 'text-[#0c4a6e]',
  },
  warn: {
    label: 'Emerging risk',
    gradientVar: 'var(--grad-warn)',
    textClass: 'text-[#78350f]',
  },
  risk: {
    label: 'Elevated risk',
    gradientVar: 'var(--grad-risk)',
    textClass: 'text-white',
  },
};

/**
 * Returns { label, gradientVar, textClass } for the score band.
 * >= 80 => ok; 70–79 => ok; 60–69 => warn; < 60 => risk.
 */
export function getVisualBand(score: number): GetVisualBandResult {
  const value = Math.max(0, Math.min(100, score));
  let band: VisualBand;
  if (value >= 80) band = 'ok';
  else if (value >= 70) band = 'ok';
  else if (value >= 60) band = 'warn';
  else band = 'risk';

  const config = BANDS[band];
  const label =
    value >= 80 ? 'Low risk' : value >= 70 ? 'Within tolerance' : value >= 60 ? 'Emerging risk' : 'Elevated risk';
  return {
    label,
    band,
    gradientVar: config.gradientVar,
    textClass: config.textClass,
  };
}
