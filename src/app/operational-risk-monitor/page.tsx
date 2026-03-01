export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { getPeriodStartDate } from '@/lib/dateUtils';
import { calculateWellbeingPercent } from '@/components/dashboard/scoreTheme';
import {
  getData,
  getOrgStructure,
  getAttentionTeams,
  type WellbeingRow,
  type AttentionTeam,
} from '@/app/dashboard/dashboardData';
import { getClientConfig } from '@/lib/config/getClientConfig';
import { defaultThresholds } from '@/lib/config/defaultThresholds';
import { OperationalRiskMonitorView } from '@/components/operational-risk/OperationalRiskMonitorView';

export default async function OperationalRiskMonitorPage({
  searchParams,
}: {
  searchParams?: { [k: string]: string | string[] | undefined };
}) {
  const period = (searchParams?.period as string | undefined) || 'month';
  const divisionId = (searchParams?.division_id as string | undefined) || undefined;
  const urlClient = (searchParams?.client as string | undefined) || undefined;
  const clientId = urlClient || (process.env.NEXT_PUBLIC_DASHBOARD_CLIENT_ID ?? '');

  if (!clientId) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-neutral-100">
        <div className="rounded-lg bg-white p-6 max-w-md text-center border border-neutral-200">
          <h1 className="text-lg font-semibold text-neutral-900 mb-2">Operational Risk Monitor</h1>
          <p className="text-sm text-neutral-600">
            Set NEXT_PUBLIC_DASHBOARD_CLIENT_ID to view data.
          </p>
          <a href="/dashboard" className="mt-4 inline-block text-sm text-neutral-700 underline">← Dashboard</a>
        </div>
      </div>
    );
  }

  let trends: WellbeingRow[] = [];
  let responseRate = { responded: 0, total: 0 };
  let attentionTeams: AttentionTeam[] = [];
  let errorMessage: string | null = null;
  let riskThresholds = defaultThresholds;

  try {
    const orgResult = await getOrgStructure(clientId);
    const { departments, teams } = orgResult;
    const eligibleTeams = divisionId ? teams.filter((t) => t.division_id === divisionId) : teams;

    riskThresholds = await getClientConfig(clientId);

    const dataResult = await getData(clientId, {
      period: period !== 'all' ? period : undefined,
      mode: 'historical',
      divisionId: divisionId ?? undefined,
    });
    trends = dataResult.trends;
    responseRate = dataResult.responseRate;

    const startDateForFilters = period && period !== 'all' ? getPeriodStartDate(period) : undefined;
    attentionTeams = await getAttentionTeams(
      clientId,
      startDateForFilters,
      eligibleTeams,
      departments,
      orgResult.divisions
    );
  } catch (err) {
    errorMessage = err instanceof Error ? err.message : 'Failed to load data';
  }

  const latestRow = trends.length ? trends[trends.length - 1] : undefined;
  const previousRow = trends.length > 1 ? trends[trends.length - 2] : undefined;

  const trendSeries = trends.slice(-12).map((t: WellbeingRow) => ({
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

  const domainTrendSeries = trends.slice(-12).map((t: WellbeingRow) => ({
    period: new Date(t.wk).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    experience: typeof t.sentiment_avg === 'number' ? Math.round(t.sentiment_avg * 20) : 0,
    workload: typeof t.workload_avg === 'number' ? Math.round(t.workload_avg * 20) : 0,
    safety: typeof t.safety_avg === 'number' ? Math.round(t.safety_avg * 20) : 0,
    leadership: typeof t.leadership_avg === 'number' ? Math.round(t.leadership_avg * 20) : 0,
    clarity: typeof t.clarity_avg === 'number' ? Math.round(t.clarity_avg * 20) : 0,
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

  const previousDomainScores =
    previousRow != null
      ? {
          experience: previousRow.sentiment_avg,
          workload: previousRow.workload_avg,
          safety: previousRow.safety_avg,
          leadership: previousRow.leadership_avg,
          clarity: previousRow.clarity_avg,
        }
      : null;

  const lastUpdated = new Date().toISOString();

  if (errorMessage) {
    return (
      <div className="min-h-screen bg-neutral-100 flex items-center justify-center p-6">
        <div className="rounded-lg bg-white p-6 border border-neutral-200 text-center">
          <p className="text-neutral-700">{errorMessage}</p>
          <a href="/dashboard" className="mt-4 inline-block text-sm text-neutral-600 underline">← Dashboard</a>
        </div>
      </div>
    );
  }

  if (trends.length === 0) {
    return (
      <div className="min-h-screen bg-neutral-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-lg border border-neutral-200 p-8 max-w-md text-center">
          <p className="font-medium text-neutral-900 mb-1">No data yet</p>
          <p className="text-sm text-neutral-600 mb-6">Complete the pulse to populate the risk monitor.</p>
          <a href="/dashboard" className="text-sm text-neutral-600 underline">← Dashboard</a>
        </div>
      </div>
    );
  }

  return (
    <OperationalRiskMonitorView
      data={{
        overallScore: overallScore ?? 0,
        previousScore: previousScore ?? null,
        domainScores,
        previousDomainScores,
        participationPercent,
        attentionTeams,
        trendSeries,
        domainTrendSeries,
        riskThresholds,
        lastUpdated,
      }}
    />
  );
}
