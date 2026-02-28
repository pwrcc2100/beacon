export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { cookies } from 'next/headers';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { getPeriodStartDate } from '@/lib/dateUtils';
import { calculateWellbeingPercent } from '@/components/dashboard/scoreTheme';
import { generateExecutiveInsights } from '@/lib/executiveInsights';
import {
  getData,
  getHierarchyData,
  getOrgStructure,
  getAttentionTeams,
  type WellbeingRow,
} from '../dashboardData';
import ExecutiveOverviewV2 from '@/components/dashboard/ExecutiveOverviewV2';
import { Button } from '@/components/ui/button';

export default async function DashboardV2Page({
  searchParams,
}: {
  searchParams?: { [k: string]: string | string[] | undefined };
}) {
  const period = (searchParams?.period as string | undefined) || 'all';
  const mode = (searchParams?.mode as 'historical' | 'live' | undefined) || 'historical';
  const urlClient = (searchParams?.client as string | undefined) || undefined;
  const clientId = urlClient || (process.env.NEXT_PUBLIC_DASHBOARD_CLIENT_ID ?? '');

  const requiredToken = process.env.ADMIN_DASH_TOKEN;
  if (requiredToken) {
    const cookieToken = cookies().get('dash')?.value;
    if (cookieToken !== requiredToken) {
      const qp = new URLSearchParams();
      if (clientId) qp.set('client', clientId);
      const redirectTo = qp.toString() ? `/dashboard/v2?${qp.toString()}` : '/dashboard/v2';
      return (
        <main className="p-6">
          <div className="max-w-md mx-auto bg-white rounded-lg p-4 shadow-sm border border-black/5">
            <h1 className="text-xl font-semibold text-[var(--text-primary)] mb-2">Admin Sign‑In</h1>
            <p className="text-sm text-[var(--text-muted)] mb-3">Enter the dashboard access token.</p>
            <form action="/api/dash-login" method="post" className="space-y-2">
              <input type="password" name="password" placeholder="Access token" className="w-full border rounded px-3 py-2" required />
              <input type="hidden" name="redirect" value={redirectTo} />
              <button type="submit" className="px-3 py-2 bg-[var(--navy)] text-white rounded">Sign In</button>
            </form>
          </div>
        </main>
      );
    }
  }

  if (!clientId) {
    return (
      <DashboardShell
        sidebar={
          <div className="space-y-2">
            <div className="text-xs uppercase tracking-wide text-[var(--text-muted)] mb-2">Navigation</div>
            <a href="/dashboard" className="block px-3 py-2 rounded bg-black/5 font-medium">Overview (current)</a>
            <a href="/dashboard/v2" className="block px-3 py-2 rounded hover:bg-black/5">Design v2</a>
          </div>
        }
      >
        <div className="max-w-6xl mx-auto space-y-6">
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Dashboard v2</h1>
          <p className="text-[var(--text-muted)]">Set NEXT_PUBLIC_DASHBOARD_CLIENT_ID in your environment to view data.</p>
        </div>
      </DashboardShell>
    );
  }

  const [{ trends, recent, responseRate }, hierarchyData, { divisions, departments, teams }] = await Promise.all([
    getData(clientId, {
      period: period !== 'all' ? period : undefined,
      mode,
    }),
    getHierarchyData(clientId, undefined, undefined, undefined, undefined, period !== 'all' ? period : undefined, mode),
    getOrgStructure(clientId),
  ]);

  const startDateForFilters =
    mode === 'live'
      ? (() => {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          return today;
        })()
      : period && period !== 'all'
        ? getPeriodStartDate(period)
        : undefined;

  const attentionTeams = await getAttentionTeams(clientId, startDateForFilters, teams, departments, divisions);

  const latestRow = trends.length ? trends[trends.length - 1] : undefined;
  const previousRow = trends.length > 1 ? trends[trends.length - 2] : undefined;

  const trendSeries = trends.map((t: WellbeingRow) => ({
    label: new Date(t.wk).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    wellbeing:
      calculateWellbeingPercent({
        sentiment: t.sentiment_avg,
        workload: t.workload_avg,
        safety: t.safety_avg,
        leadership: t.leadership_avg,
        clarity: t.clarity_avg,
      }) ?? 0,
    safety: (t.safety_avg ?? 0) * 20,
  }));

  const questionScores = {
    sentiment: latestRow?.sentiment_avg ?? 0,
    clarity: latestRow?.clarity_avg ?? 0,
    workload: latestRow?.workload_avg ?? 0,
    safety: latestRow?.safety_avg ?? 0,
    leadership: latestRow?.leadership_avg ?? 0,
  } as const;

  const overallScore =
    latestRow != null
      ? calculateWellbeingPercent({
          sentiment: latestRow.sentiment_avg,
          workload: latestRow.workload_avg,
          safety: latestRow.safety_avg,
          leadership: latestRow.leadership_avg,
          clarity: latestRow.clarity_avg,
        })
      : undefined;

  const previousScore =
    previousRow != null
      ? calculateWellbeingPercent({
          sentiment: previousRow.sentiment_avg,
          workload: previousRow.workload_avg,
          safety: previousRow.safety_avg,
          leadership: previousRow.leadership_avg,
          clarity: previousRow.clarity_avg,
        })
      : undefined;

  const participationPercent = responseRate.total > 0 ? (responseRate.responded / responseRate.total) * 100 : 0;

  const tableData = hierarchyData.currentLevel === 'team' ? [] : (hierarchyData.data ?? []);
  const tableTitle =
    hierarchyData.currentLevel === 'division'
      ? 'Departments'
      : hierarchyData.currentLevel === 'department'
        ? 'Teams'
        : 'Divisions';

  const executiveInsights = generateExecutiveInsights(trends, {
    data: tableData,
    currentLevel: hierarchyData.currentLevel,
  });

  const Sidebar = (
    <div className="space-y-2">
      <div className="text-xs uppercase tracking-wide text-[var(--text-muted)] mb-2">Navigation</div>
      <a href="/dashboard" className="block px-3 py-2 rounded hover:bg-black/5">Overview (current)</a>
      <a href="/dashboard/v2" className="block px-3 py-2 rounded bg-black/5 font-medium">Design v2</a>
      <div className="pt-4 border-t border-black/10">
        <a href="/dashboard" className="text-sm text-[var(--text-muted)] hover:underline">← Back to current dashboard</a>
      </div>
    </div>
  );

  return (
    <DashboardShell sidebar={Sidebar}>
      <div className="min-h-full bg-[#F2F7F5]">
        <div className="max-w-6xl mx-auto space-y-6 p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-[#0B1B2B]">Beacon Index · Design v2</h1>
            <span className="text-sm text-[#2E4057]">All sections in Beacon Index style for comparison</span>
          </div>

          {trends.length === 0 && recent.length === 0 ? (
            <div className="rounded-xl border border-[#E0E5E8] bg-white p-8 text-center shadow-sm">
              <p className="text-[#2E4057]">No response data yet. Complete a survey to see the dashboard.</p>
            </div>
          ) : (
            <>
              <ExecutiveOverviewV2
                overallScore={overallScore ?? 0}
                previousScore={previousScore}
                trendSeries={trendSeries}
                questionScores={questionScores}
                participationRate={participationPercent}
                teams={attentionTeams.slice(0, 12)}
                divisions={tableData as any}
                insights={executiveInsights}
                tableTitle={tableTitle}
                attentionLabel="Which Teams Need Attention"
              />

              <section className="rounded-xl border border-[#E0E5E8] bg-white p-6 space-y-4 shadow-sm border-t-4" style={{ borderTopColor: '#2F6F7E' }}>
                <h2 className="text-xl font-semibold text-[#0B1B2B]">New Client Onboarding Checklist</h2>
                <p className="text-sm text-[#2E4057]">
                  Use this intake workflow with prospective clients to capture every configuration detail before go-live.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button asChild>
                    <a href="/admin/onboarding" target="_blank" rel="noopener noreferrer">
                      Open onboarding intake form
                    </a>
                  </Button>
                  <Button asChild variant="outline" className="border-[#D7E0E8] text-[#2F6F7E] hover:bg-[#2F6F7E]/5">
                    <a href="/templates/hierarchy-template.csv" download>
                      Download hierarchy template
                    </a>
                  </Button>
                </div>
              </section>
            </>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
