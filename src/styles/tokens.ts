/**
 * Beacon Index app design tokens.
 * Dark-to-midnight palette, premium/calm/high-trust.
 * Use for charts and any JS-driven styling; prefer CSS vars / Tailwind for layout.
 */

export const tokens = {
  // Surfaces (layered depth — not flat black)
  bg: '#0d1117',
  bgGradientStart: '#111920',
  surface: '#161b22',
  surfaceElevated: '#1c2128',
  surfaceAlt: '#21262d',

  // Text
  text: '#e6edf3',
  textMuted: '#8b949e',
  textSubtle: '#6e7681',

  // Borders (subtle, 1px)
  border: '#30363d',
  borderSubtle: '#21262d',
  borderInner: 'rgba(255,255,255,0.04)',

  // Semantic — restrained; strong red/orange only for risk
  accent: '#6b9bd1',
  accent2: '#8badd4',
  success: '#3fb950',
  warning: '#d29922',
  danger: '#f85149',
  risk: '#e85d4a',

  // Chart / score (consistent with surfaces)
  gaugeTrack: '#21262d',
  gaugeFillStart: '#3fb950',
  gaugeFillMid: '#d29922',
  gaugeFillEnd: '#f85149',
  barTrack: '#21262d',
  barGood: '#3fb950',
  barWatch: '#d29922',
  barAlert: '#f85149',

  // Spacing (8px grid)
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
  },

  // Type scale
  type: {
    h1: { fontSize: 24, fontWeight: 600, lineHeight: 1.3 },
    h2: { fontSize: 20, fontWeight: 600, lineHeight: 1.4 },
    h3: { fontSize: 16, fontWeight: 600, lineHeight: 1.4 },
    body: { fontSize: 14, fontWeight: 400, lineHeight: 1.5 },
    caption: { fontSize: 12, fontWeight: 400, lineHeight: 1.4 },
  },

  // Radii
  radius: {
    sm: 6,
    md: 8,
    lg: 12,
    xl: 16,
  },

  // Shadows (soft, layered depth)
  shadow: {
    sm: '0 1px 2px rgba(0,0,0,0.2)',
    soft: '0 2px 8px rgba(0,0,0,0.25)',
    md: '0 4px 12px rgba(0,0,0,0.28)',
    lg: '0 8px 24px rgba(0,0,0,0.32)',
  },
} as const;

export type Tokens = typeof tokens;
