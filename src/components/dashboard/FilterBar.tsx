'use client';

import { useRouter, usePathname } from 'next/navigation';

export type Level1Option = { value: string; label: string };

export type FilterBarProps = {
  /** Label for Level 1 hierarchy (e.g. "Division", "Region", "Project") */
  level1Label: string;
  level1Options: Level1Option[];
  currentLevel1Id: string | null;
  periodOptions: { value: string; label: string }[];
  currentPeriod: string;
  /** Optional: preserve other query params when updating filters */
  preserveParams?: string[];
};

export function FilterBar({
  level1Label,
  level1Options,
  currentLevel1Id,
  periodOptions,
  currentPeriod,
  preserveParams = [],
}: FilterBarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const updateFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
    preserveParams.forEach((p) => {
      const v = params.get(p);
      if (v) params.set(p, v);
    });
    if (value && value !== 'all') params.set(key, value);
    else params.delete(key);
    const q = params.toString();
    router.push(q ? `${pathname}?${q}` : pathname);
  };

  return (
    <div className="flex flex-wrap items-center gap-4">
      <div className="flex items-center gap-2">
        <label className="bi-label text-bi-textMuted whitespace-nowrap">
          {level1Label}
        </label>
        <select
          value={currentLevel1Id ?? 'all'}
          onChange={(e) => updateFilter('division_id', e.target.value === 'all' ? null : e.target.value)}
          className="min-w-[140px] rounded-bi-md border border-bi-borderSubtle bg-bi-surfaceCard px-3 py-2 bi-label text-bi-text focus:outline-none focus:ring-2 focus:ring-bi-borderFocus"
        >
          <option value="all">All</option>
          {level1Options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
      <div className="flex items-center gap-2">
        <label className="bi-label text-bi-textMuted whitespace-nowrap">
          Period
        </label>
        <select
          value={currentPeriod}
          onChange={(e) => updateFilter('period', e.target.value)}
          className="min-w-[140px] rounded-bi-md border border-bi-borderSubtle bg-bi-surfaceCard px-3 py-2 bi-label text-bi-text focus:outline-none focus:ring-2 focus:ring-bi-borderFocus"
        >
          {periodOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
