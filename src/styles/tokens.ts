/**
 * Beacon Index design tokens — light theme (beaconindex.com.au).
 * Soft off-white/grey, cards with subtle shadows and borders.
 * Colour reserved for risk (badges, key bars). High legibility.
 */

export const tokens = {
  // ——— Background (page = lowest) ———
  /** Page: soft off-white / grey */
  bg: '#f4f5f7',
  bgGradientStart: '#f8f9fb',
  bgGradientEnd: '#f4f5f7',

  // ——— Surfaces (3 levels: page < section < card) ———
  /** Section: grouped areas (mid) */
  surfaceSection: '#eef0f3',
  /** Card: white / highest elevation */
  surfaceCard: '#ffffff',
  /** Hover, alternate row */
  surfaceAlt: '#f8f9fb',

  surface: '#ffffff',
  surfaceElevated: '#ffffff',

  // ——— Text ———
  text: '#1a1d23',
  textMuted: '#5c6370',
  textSubtle: '#8b929e',

  // ——— Borders (soft, minimal) ———
  borderSeparator: '#e5e8ec',
  borderFocus: 'rgba(43, 111, 126, 0.4)',
  border: '#e0e3e8',
  borderSubtle: '#eaedf0',

  // Semantic — colour only for risk (badges, bars)
  accent: '#2f6f7e',
  accent2: '#3d8a9a',
  success: '#0d7d4c',
  warning: '#b45309',
  danger: '#c53030',
  risk: '#c53030',

  // Chart / score (readable on light)
  gaugeTrack: '#e5e8ec',
  gaugeFillStart: '#0d7d4c',
  gaugeFillMid: '#b45309',
  gaugeFillEnd: '#c53030',
  barTrack: '#e5e8ec',
  barGood: '#0d7d4c',
  barWatch: '#b45309',
  barAlert: '#c53030',

  // Spacing (8px rhythm)
  space: {
    0: 0,
    1: 4,
    2: 8,
    3: 12,
    4: 16,
    5: 20,
    6: 24,
    8: 32,
    10: 40,
    12: 48,
    16: 64,
  },

  // Typography
  type: {
    overline: { fontSize: 11, fontWeight: 600, lineHeight: 1.4, letterSpacing: '0.08em' },
    h1: { fontSize: 24, fontWeight: 600, lineHeight: 1.3 },
    h2: { fontSize: 20, fontWeight: 600, lineHeight: 1.4 },
    h3: { fontSize: 18, fontWeight: 600, lineHeight: 1.4 },
    label: { fontSize: 14, fontWeight: 500, lineHeight: 1.5 },
    body: { fontSize: 15, fontWeight: 400, lineHeight: 1.6 },
    bodySmall: { fontSize: 14, fontWeight: 400, lineHeight: 1.55 },
    caption: { fontSize: 12, fontWeight: 400, lineHeight: 1.45 },
  },

  radius: { sm: 6, md: 10, lg: 12, xl: 16 },

  // Shadows — subtle, soft (light theme)
  shadow: {
    sm: '0 1px 2px rgba(0,0,0,0.06)',
    soft: '0 2px 8px rgba(0,0,0,0.08)',
    md: '0 4px 16px rgba(0,0,0,0.1)',
    lg: '0 8px 24px rgba(0,0,0,0.12)',
  },
} as const;

export type Tokens = typeof tokens;
