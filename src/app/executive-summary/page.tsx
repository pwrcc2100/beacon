export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { cookies } from 'next/headers';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { PrintButton } from '@/components/ui/PrintButton';
import { ControlRoomLayout } from '@/components/layout/ControlRoomLayout';
import { getData } from '../dashboard/dashboardData';
import { calculateWellbeingPercent } from '@/components/dashboard/scoreTheme';
import ExecutiveSummaryContent from './components/ExecutiveSummaryContent';

export default async function ExecutiveSummaryPage({ 
  searchParams 
}: { 
  searchParams?: { [k: string]: string | string[] | undefined } 
}) {
  const urlClient = (searchParams?.client as string | undefined) || undefined;
  const period = (searchParams?.period as string | undefined) || 'all';
  const mode = (searchParams?.mode as 'historical' | 'live' | undefined) || 'historical';

  const clientId = urlClient || (process.env.NEXT_PUBLIC_DASHBOARD_CLIENT_ID ?? '');

  // Auth check
  const requiredToken = process.env.ADMIN_DASH_TOKEN;
  if (requiredToken) {
    const cookieToken = cookies().get('dash')?.value;
    if (cookieToken !== requiredToken) {
      const qp = new URLSearchParams();
      if (clientId) qp.set('client', clientId);
      const redirectTo = qp.toString() ? `/executive-summary?${qp.toString()}` : '/executive-summary';
      return (
        <main className="p-6">
          <div className="max-w-md mx-auto bg-white rounded-lg p-4 shadow-sm border border-black/5">
            <h1 className="text-xl font-semibold text-[var(--text-primary)] mb-2">Admin Sign‑In</h1>
            <p className="text-sm text-[var(--text-muted)] mb-3">Enter the dashboard access token.</p>
            <form action="/api/dash-login" method="post" className="space-y-2">
              <input type="password" name="password" placeholder="Access token" className="w-full border rounded px-3 py-2" required />
              <input type="hidden" name="redirect" value={redirectTo} />
              <button className="px-3 py-2 bg-[var(--navy)] text-white rounded">Sign In</button>
            </form>
          </div>
        </main>
      );
    }
  }

  // No client ID
  if (!clientId) {
    const NoClientSidebar = (
      <div className="space-y-2">
        <div className="text-xs uppercase tracking-wide text-[var(--text-muted)] mb-2">Navigation</div>
        <a href="/dashboard-control-room" className="block px-3 py-2 rounded hover:bg-black/5">Control Room</a>
        <a href="/executive-summary" className="block px-3 py-2 rounded bg-black/5 font-medium">Executive Summary</a>
        <a href="/dashboard/group-leader" className="block px-3 py-2 rounded hover:bg-black/5">Group Leader View</a>
        <a href="/methodology" className="block px-3 py-2 rounded hover:bg-black/5">Methodology</a>
      </div>
    );
    return (
      <DashboardShell sidebar={NoClientSidebar}>
        <ControlRoomLayout title="Executive Summary" subtitle="Monthly Client Report">
          <p className="text-zinc-400">Set NEXT_PUBLIC_DASHBOARD_CLIENT_ID in your environment to view data.</p>
        </ControlRoomLayout>
      </DashboardShell>
    );
  }

  // Fetch data
  const { trends, recent } = await getData(clientId, {
    period: period !== 'all' ? period : undefined,
    mode,
  });

  // Calculate scores
  const hasRealData = trends.length > 0 || recent.length > 0;
  const latestRow = trends.length ? trends[trends.length - 1] : undefined;

  const questionScores = hasRealData
    ? {
        sentiment: latestRow?.sentiment_avg ?? 0,
        clarity: latestRow?.clarity_avg ?? 0,
        workload: latestRow?.workload_avg ?? 0,
        safety: latestRow?.safety_avg ?? 0,
        leadership: latestRow?.leadership_avg ?? 0,
      } as const
    : { sentiment: 1.25, clarity: 3.75, workload: 4.4, safety: 2.25, leadership: 3.1 } as const;

  const domainScores = {
    experience: Math.round(questionScores.sentiment * 20),
    workload: Math.round(questionScores.workload * 20),
    safety: Math.round(questionScores.safety * 20),
    leadership: Math.round(questionScores.leadership * 20),
    clarity: Math.round(questionScores.clarity * 20),
  };

  const Sidebar = (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="text-xs uppercase tracking-wide text-[var(--text-muted)] mb-2">Navigation</div>
        <a href="/dashboard-control-room" className="block px-3 py-2 rounded hover:bg-black/5">Control Room</a>
        <a href="/executive-summary" className="block px-3 py-2 rounded bg-black/5 font-medium">Executive Summary</a>
        <a href="/dashboard/group-leader" className="block px-3 py-2 rounded hover:bg-black/5">Group Leader View</a>
        <a href="/methodology" className="block px-3 py-2 rounded hover:bg-black/5">Methodology</a>
      </div>
    </div>
  );

  return (
    <DashboardShell sidebar={Sidebar}>
      <ControlRoomLayout 
        title="Executive Summary" 
        subtitle="Monthly Client Report"
        actions={<PrintButton />}
      >
        <ExecutiveSummaryContent domainScores={domainScores} />
      </ControlRoomLayout>
    </DashboardShell>
  );
}
