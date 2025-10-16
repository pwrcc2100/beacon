import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
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
        }
      },
      borderRadius: { 
        beacon: 'var(--radius)' 
      }
    },
  },
  plugins: [],
}
export default config

