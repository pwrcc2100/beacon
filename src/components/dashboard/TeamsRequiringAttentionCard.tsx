'use client';

import { RISK_THRESHOLD } from '@/lib/dashboardConstants';

export type TeamsRequiringAttentionCardProps = {
  count: number;
};

export function TeamsRequiringAttentionCard({ count }: TeamsRequiringAttentionCardProps) {
  return (
    <div className="rounded-bi-lg border border-bi-border bg-bi-surface-elevated p-5 shadow-bi-soft ring-1 ring-inset ring-bi-borderInner">
      <p className="text-xs font-medium uppercase tracking-wider text-bi-textMuted">
        Teams requiring attention
      </p>
      <p className="mt-2 text-3xl font-semibold tabular-nums text-bi-text">
        {count}
      </p>
      <p className="mt-1 text-sm text-bi-textMuted">
        Below calibrated risk tolerance
      </p>
    </div>
  );
}
