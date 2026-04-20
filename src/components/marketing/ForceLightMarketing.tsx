'use client';

import { useEffect } from 'react';

/**
 * Marketing pages are designed for light mode. Temporarily clear `dark` on <html>
 * and restore previous theme using the same logic as the root layout inline script.
 */
export function ForceLightMarketing() {
  useEffect(() => {
    const html = document.documentElement;
    html.classList.remove('dark');
    html.style.colorScheme = 'light';

    return () => {
      html.style.removeProperty('color-scheme');
      try {
        const t = localStorage.getItem('beacon-theme');
        const shouldDark = !(
          t === 'light' ||
          (t !== 'dark' && typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: light)').matches)
        );
        html.classList.toggle('dark', shouldDark);
      } catch {
        /* ignore */
      }
    };
  }, []);

  return null;
}
