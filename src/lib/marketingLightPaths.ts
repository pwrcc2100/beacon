/** Routes that always use light chrome (marketing site); avoids `html.dark` washing out Tailwind `bg-white` layers. */
export const MARKETING_LIGHT_PATHS = new Set(['/', '/about']);

export function isMarketingLightPath(pathname: string | null): boolean {
  if (!pathname) return false;
  return MARKETING_LIGHT_PATHS.has(pathname);
}
