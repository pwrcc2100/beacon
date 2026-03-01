'use client';

import { BiCard, BiCardContent } from '@/components/ui/bi-card';
import { Skeleton } from '@/components/ui/skeleton';

export function DashboardV2Loading() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-9 w-32" />
      </div>
      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <BiCard className="p-6">
          <div className="flex flex-col items-center gap-4">
            <Skeleton className="h-40 w-40 rounded-full" />
            <Skeleton className="h-5 w-24" />
          </div>
        </BiCard>
        <div className="space-y-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
      <p className="text-center text-sm text-bi-textMuted">
        Loading your dashboard…
      </p>
    </div>
  );
}

export function DashboardV2Empty() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] px-6 text-center">
      <BiCard className="max-w-md w-full p-8">
        <BiCardContent className="p-0">
          <p className="text-bi-text font-medium mb-1">
            No data yet
          </p>
          <p className="text-sm text-bi-textMuted mb-6">
            Once your team completes the weekly pulse, your composite score and domain breakdown will appear here.
          </p>
          <a
            href="/survey/test-demo"
            className="inline-flex items-center justify-center rounded-bi-md border border-bi-border bg-bi-surface-alt px-4 py-2 text-sm font-medium text-bi-text hover:bg-bi-surface"
          >
            Try a demo survey
          </a>
        </BiCardContent>
      </BiCard>
    </div>
  );
}

export function DashboardV2Error({ message }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] px-6 text-center">
      <BiCard className="max-w-md w-full p-8 border-bi-danger/30">
        <BiCardContent className="p-0">
          <p className="text-bi-text font-medium mb-1">
            Something went wrong
          </p>
          <p className="text-sm text-bi-textMuted mb-6">
            {message || 'We couldn’t load your dashboard. Please try again in a moment.'}
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="inline-flex items-center justify-center rounded-bi-md border border-bi-border bg-bi-surface px-4 py-2 text-sm font-medium text-bi-text hover:bg-bi-surface-alt"
          >
            Try again
          </button>
        </BiCardContent>
      </BiCard>
    </div>
  );
}
