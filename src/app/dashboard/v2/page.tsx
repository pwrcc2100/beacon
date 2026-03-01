export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { cookies } from 'next/headers';
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
import { DashboardV2View } from '@/components/dashboard/DashboardV2View';
import { DashboardV2Empty, DashboardV2Error } from '@/components/dashboard/DashboardV2States';

function getPeriodLabel(period: string): string {
  switch (period) {
    case 'week': return 'Last 7 days';
    case 'month': return 'Last 30 days';
    case 'quarter': return 'Last quarter';
    default: return 'All time';
  }
}

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
        <main className="beacon-app min-h-screen flex items-center justify-center p-6">
          <div className="w-full max-w-sm rounded-bi-lg border border-bi-border bg-bi-surface p-6 shadow-bi-md">
            <h1 className="text-lg font-semibold text-bi-text mb-2">Sign in</h1>
            <p className="text-sm text-bi-textMuted mb-4">Enter the dashboard access token.</p>
            <form action="/api/dash-login" method="post" className="space-y-3">
              <input
                type="password"
                name="password"
                placeholder="Access token"
                className="w-full rounded-bi-md border border-bi-border bg-bi-surface-alt px-3 py-2 text-sm text-bi-text placeholder:text-bi-textSubtle focus:outline-none focus:ring-2 focus:ring-bi-accent/50"
                required
              />
              <input type="hidden" name="redirect" value={redirectTo} />
              <button
                type="submit"
                className="w-full rounded-bi-md bg-bi-accent px-3 py-2 text-sm font-medium text-white hover:opacity-90"
              >
                Sign in
              </button>
            </form>
          </div>
        </main>
      );
    }
  }

  if (!clientId) {
    return (
      <div className="beacon-app min-h-screen flex flex-col items-center justify-center p-6">
        <div className="rounded-bi-lg border border-bi-border bg-bi-surface p-6 max-w-md text-center">
          <h1 className="text-lg font-semibold text-bi-text mb-2">Dashboard</h1>
          <p className="text-sm text-bi-textMuted">
            Set NEXT_PUBLIC_DASHBOARD_CLIENT_ID in your environment to view data.
          </p>
          <a href="/dashboard" className="mt-4 inline-block text-sm text-bi-accent hover:underline">
            ← Back to dashboard
          </a>
        </div>
      </div>
    );
  }

  let trends: WellbeingRow[] = [];
  let recent: unknown[] = [];
  let responseRate = { responded: 0, total: 0 };
  let hierarchyData: { data: unknown[]; currentLevel: string } = { data: [], currentLevel: 'top' };
  let executiveInsights: ReturnType<typeof generateExecutiveInsights> = [];
  let errorMessage: string | null = null;

  try {
    const [dataResult, hierarchyResult, orgResult] = await Promise.all([
      getData(clientId, {
        period: period !== 'all' ? period : undefined,
        mode,
      }),
      getHierarchyData(clientId, undefined, undefined, undefined, undefined, period !== 'all' ? period : undefined, mode),
      getOrgStructure(clientId),
    ]);
    trends = dataResult.trends;
    recent = dataResult.recent;
    responseRate = dataResult.responseRate;
    hierarchyData = hierarchyResult as typeof hierarchyData;
    const { divisions, departments, teams } = orgResult;
    const startDateForFilters =
      mode === 'live'
        ? (() => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; })()
        : period && period !== 'all' ? getPeriodStartDate(period) : undefined;
    await getAttentionTeams(clientId, startDateForFilters, teams, departments, divisions);
    const tableData = hierarchyData.currentLevel === 'team' ? [] : (hierarchyData.data ?? []);
    executiveInsights = generateExecutiveInsights(trends, { data: tableData, currentLevel: hierarchyData.currentLevel });
  } catch (err) {
    errorMessage = err instanceof Error ? err.message : 'Failed to load dashboard';
  }

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
  }));

  const questionScores = {
    sentiment: latestRow?.sentiment_avg ?? 0,
    clarity: latestRow?.clarity_avg ?? 0,
    workload: latestRow?.workload_avg ?? 0,
    safety: latestRow?.safety_avg ?? 0,
    leadership: latestRow?.leadership_avg ?? 0,
  };

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

  const domainScores = {
    experience: questionScores.sentiment,
    workload: questionScores.workload,
    safety: questionScores.safety,
    leadership: questionScores.leadership,
    clarity: questionScores.clarity,
  };

  const exportUrl = `/api/download?client_id=${encodeURIComponent(clientId)}`;

  if (errorMessage) {
    return (
      <div className="beacon-app min-h-screen">
        <DashboardV2Error message={errorMessage} />
      </div>
    );
  }

  if (trends.length === 0 && recent.length === 0) {
    return (
      <div className="beacon-app min-h-screen">
        <DashboardV2Empty />
      </div>
    );
  }

  return (
    <div className="beacon-app min-h-screen">
      <DashboardV2View
        data={{
          overallScore: overallScore ?? 0,
          previousScore,
          domainScores,
          participationPercent,
          trendSeries,
          insights: executiveInsights,
          period,
          periodLabel: getPeriodLabel(period),
        }}
        clientId={clientId}
        exportUrl={exportUrl}
      />
    </div>
  );
}
