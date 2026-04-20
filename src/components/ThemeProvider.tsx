'use client';

import * as React from 'react';

import { isMarketingLightPath } from '@/lib/marketingLightPaths';

type Theme = 'light' | 'dark';

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = React.createContext<ThemeContextValue | null>(null);

const STORAGE_KEY = 'beacon-theme';

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'dark';
  const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
  if (stored === 'light' || stored === 'dark') return stored;
  if (window.matchMedia?.('(prefers-color-scheme: light)').matches) return 'light';
  return 'dark';
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = React.useState<Theme>('dark');

  const syncFromPath = React.useCallback((pathname: string | null) => {
    if (isMarketingLightPath(pathname)) {
      setThemeState('light');
      document.documentElement.classList.remove('dark');
      return;
    }
    const t = getInitialTheme();
    setThemeState(t);
    document.documentElement.classList.toggle('dark', t === 'dark');
  }, []);

  /**
   * Do not use `usePathname()` here — it can suspend and (depending on boundary placement)
   * blank the entire app. Layout inline script + this mount sync covers `/` and `/about`.
   * After client-side nav, a full reload or visiting other routes re-syncs theme on next mount.
   */
  React.useEffect(() => {
    syncFromPath(window.location.pathname);
  }, [syncFromPath]);

  const setTheme = React.useCallback((t: Theme) => {
    setThemeState(t);
    document.documentElement.classList.toggle('dark', t === 'dark');
    localStorage.setItem(STORAGE_KEY, t);
  }, []);

  const toggleTheme = React.useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }, [theme, setTheme]);

  const value = React.useMemo(
    () => ({ theme, setTheme, toggleTheme }),
    [theme, setTheme, toggleTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = React.useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
