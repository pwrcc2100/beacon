'use client';

export type TeamsRequiringAttentionCardProps = {
  count: number;
};

export function TeamsRequiringAttentionCard({ count }: TeamsRequiringAttentionCardProps) {
  return (
    <div className="rounded-bi-lg bg-bi-surfaceCard border border-bi-borderSubtle p-5 shadow-bi-sm">
      <p className="text-4xl md:text-5xl font-semibold tabular-nums text-bi-text leading-none">
        {count}
      </p>
      <p className="mt-2 text-sm text-bi-textMuted">Teams requiring attention</p>
      <p className="mt-1 text-sm text-bi-textMuted">Below calibrated risk tolerance</p>
    </div>
  );
}
