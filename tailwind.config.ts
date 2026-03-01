import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ["class"],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        beacon: {
          good: '#64afac',
          okay: '#5d89a9',
          attn: '#ea9999',
          bg: { 
            good: '#f4f4ee', 
            okay: '#eeefec', 
            attn: '#f6f2ef' 
          },
          text: { 
            primary: '#2E2E38', 
            muted: '#737A8C' 
          },
          navy: '#2B4162', 
          sage: '#A7D6A2'
        },
        /* Beacon Index app (dashboard/survey) — premium marketing aesthetic */
        bi: {
          bg: 'var(--bi-bg)',
          surfaceSection: 'var(--bi-surface-section)',
          surfaceCard: 'var(--bi-surface-card)',
          surface: 'var(--bi-surface)',
          surfaceElevated: 'var(--bi-surface-elevated)',
          surfaceAlt: 'var(--bi-surface-alt)',
          text: 'var(--bi-text)',
          textMuted: 'var(--bi-text-muted)',
          textSubtle: 'var(--bi-text-subtle)',
          borderSeparator: 'var(--bi-border-separator)',
          borderFocus: 'var(--bi-border-focus)',
          border: 'var(--bi-border)',
          borderSubtle: 'var(--bi-border-subtle)',
          borderInner: 'var(--bi-border-inner)',
          accent: 'var(--bi-accent)',
          accent2: 'var(--bi-accent2)',
          success: 'var(--bi-success)',
          warning: 'var(--bi-warning)',
          danger: 'var(--bi-danger)',
          risk: 'var(--bi-risk)',
        }
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        beacon: 'var(--radius)',
        'bi-sm': '6px',
        'bi-md': '10px',
        'bi-lg': '12px',
        'bi-xl': '16px',
      },
      boxShadow: {
        'bi-sm': 'var(--bi-shadow-sm)',
        'bi-soft': 'var(--bi-shadow-soft)',
        'bi-md': 'var(--bi-shadow-md)',
        'bi-lg': 'var(--bi-shadow-lg)',
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
}
export default config

