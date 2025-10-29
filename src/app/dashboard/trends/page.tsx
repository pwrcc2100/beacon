export const dynamic = 'force-dynamic';
export const revalidate = 0;
import { cookies } from 'next/headers';
import { supabaseAdmin } from '@/lib/supabase';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { TrendCard } from '@/components/charts/TrendCard';
import { WellbeingGauge } from '@/components/charts/WellbeingGauge';

type WellbeingRow = {
  wk: string;
  sentiment_avg: number;
  clarity_avg: number;
  workload_avg: number;
  safety_avg: number;
  leadership_avg: number;
};

async function getData(clientId: string, period: 'week' | 'month' | 'quarter' = 'month'){
  const now = new Date();
  let startDate: Date;
  
  if (period === 'week') {
    startDate = new Date(now.getTime() - 28 * 24 * 60 * 60 * 1000); // 4 weeks
  } else if (period === 'month') {
    startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000); // ~1 month
  } else {
    startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000); // ~3 months (quarter)
  }

  let trendsQuery = supabaseAdmin
    .from('wellbeing_responses')
    .select('wk, sentiment_avg, clarity_avg, workload_avg, safety_avg, leadership_avg')
    .eq('client_id', clientId)
    .gte('wk', startDate.toISOString())
    .order('wk', { ascending: true });
  
  const { data: trends } = await trendsQuery;

  // Fallback if materialized view is empty
  let computedTrends: WellbeingRow[] | undefined;
  if (!trends || trends.length === 0) {
    const { data: rawResponses } = await supabaseAdmin
      .from('responses_v3')
      .select('submitted_at, workload_5, safety_5, clarity_5, sentiment_5, leadership_5')
      .eq('client_id', clientId)
      .gte('submitted_at', startDate.toISOString())
      .order('submitted_at', { ascending: true });

    if (rawResponses && rawResponses.length > 0) {
      const weeklyData: { [key: string]: { count: number; sentiment_sum: number; clarity_sum: number; workload_sum: number; safety_sum: number; leadership_sum: number; } } = {};

      rawResponses.forEach(r => {
        const week = new Date(r.submitted_at).toISOString().substring(0, 10);
        if (!weeklyData[week]) {
          weeklyData[week] = { count: 0, sentiment_sum: 0, clarity_sum: 0, workload_sum: 0, safety_sum: 0, leadership_sum: 0 };
        }
        weeklyData[week].count++;
        weeklyData[week].sentiment_sum += r.sentiment_5;
        weeklyData[week].clarity_sum += r.clarity_5;
        weeklyData[week].workload_sum += r.workload_5;
        weeklyData[week].safety_sum += r.safety_5;
        weeklyData[week].leadership_sum += r.leadership_5;
      });

      computedTrends = Object.keys(weeklyData).sort().map(wk => ({
        wk,
        sentiment_avg: weeklyData[wk].sentiment_sum / weeklyData[wk].count,
        clarity_avg: weeklyData[wk].clarity_sum / weeklyData[wk].count,
        workload_avg: weeklyData[wk].workload_sum / weeklyData[wk].count,
        safety_avg: weeklyData[wk].safety_sum / weeklyData[wk].count,
        leadership_avg: weeklyData[wk].leadership_sum / weeklyData[wk].count,
      }));
    }
  }

  return { 
    trends: (computedTrends ?? trends ?? []) as WellbeingRow[]
  };
}

export default async function TrendsPage({ searchParams }:{ searchParams?: { [k:string]: string | string[] | undefined } }){
  const urlClient = (searchParams?.client as string | undefined) || undefined;
  const period = (searchParams?.period as 'week' | 'month' | 'quarter' | undefined) || 'month';
  const clientId = urlClient || (process.env.NEXT_PUBLIC_DASHBOARD_CLIENT_ID ?? '');

  const requiredToken = process.env.ADMIN_DASH_TOKEN;
  if (requiredToken) {
    const cookieToken = cookies().get('dash')?.value;
    if (cookieToken !== requiredToken) {
      const qp = new URLSearchParams();
      if (clientId) qp.set('client', clientId);
      const redirectTo = qp.toString() ? `/dashboard/trends?${qp.toString()}` : '/dashboard/trends';
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

  if (!clientId) {
    return (
      <main className="p-6">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl font-bold mb-2 text-[var(--text-primary)]">Trends</h1>
          <p className="text-[var(--text-muted)]">Set NEXT_PUBLIC_DASHBOARD_CLIENT_ID in your environment to view data.</p>
        </div>
      </main>
    );
  }

  const { trends } = await getData(clientId, period);

  const toSeries = (key: keyof WellbeingRow, color: string, heading: string, description: string) => ({
    heading,
    description,
    color,
    data: trends.map(t => ({ wk: new Date(t.wk).toLocaleDateString(undefined,{ month:'short', day:'numeric'}), value: Number(t[key]) }))
  });

  const series = [
    toSeries('sentiment_avg', '#64afac', 'Sentiment', 'How are you feeling about work this week?'),
    toSeries('workload_avg',  '#ea9999', 'Workload', 'How\'s your workload?'),
    toSeries('safety_avg',    '#ea9999', 'Safety', 'Do you feel safe speaking up?'),
    toSeries('leadership_avg','#64afac', 'Leadership', 'Do you feel supported by leadership?'),
    toSeries('clarity_avg',   '#5d89a9', 'Clarity', 'Are you clear on what\'s expected?')
  ];

  const last = (k:keyof WellbeingRow)=> (trends.length ? Number(trends[trends.length-1][k]) : undefined);
  const prev = (k:keyof WellbeingRow)=> (trends.length>1 ? Number(trends[trends.length-2][k]) : undefined);

  const Sidebar = (
    <div className="space-y-2">
      <div className="text-xs uppercase tracking-wide text-[var(--text-muted)] mb-2">Navigation</div>
      <a href="/dashboard" className="block px-3 py-2 rounded hover:bg-black/5">Overview</a>
      <a href="/dashboard/trends" className="block px-3 py-2 rounded bg-black/5 font-medium">Trends</a>
      <a href="/analytics" className="block px-3 py-2 rounded hover:bg-black/5">Advanced Analytics</a>
      <a href="/methodology" className="block px-3 py-2 rounded hover:bg-black/5">Methodology</a>
    </div>
  );

  const periodLabel = period === 'week' ? 'Last 4 Weeks' : period === 'month' ? 'Last Month' : 'Last Quarter';

  return (
    <DashboardShell sidebar={Sidebar}>
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Wellbeing Trends</h1>
          <p className="text-sm text-[var(--text-muted)]">Client: {clientId}</p>
        </div>

        {/* Period Filter */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-medium">View:</span>
          <div className="flex gap-1">
            <a href={`/dashboard/trends?client=${clientId}&period=week`}>
              <Button variant={period === 'week' ? 'default' : 'outline'} size="sm">Last 4 Weeks</Button>
            </a>
            <a href={`/dashboard/trends?client=${clientId}&period=month`}>
              <Button variant={period === 'month' ? 'default' : 'outline'} size="sm">Last Month</Button>
            </a>
            <a href={`/dashboard/trends?client=${clientId}&period=quarter`}>
              <Button variant={period === 'quarter' ? 'default' : 'outline'} size="sm">Last Quarter</Button>
            </a>
          </div>
        </div>

        {/* Overall Wellbeing Gauge */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <WellbeingGauge 
              sentiment={last('sentiment_avg')} 
              clarity={last('clarity_avg')}
              workload={last('workload_avg')} 
              leadership={last('leadership_avg')} 
              safety={last('safety_avg')}
              prevScore={prev('sentiment_avg') && prev('clarity_avg') && prev('workload_avg') && prev('leadership_avg') && prev('safety_avg')
                ? ((prev('sentiment_avg')! * 0.25) + (prev('workload_avg')! * 0.25) + (prev('leadership_avg')! * 0.20) + (prev('safety_avg')! * 0.20) + (prev('clarity_avg')! * 0.10)) * 20
                : undefined
              }
            />
          </div>
          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-lg">About {periodLabel}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm text-[var(--text-muted)]">
                  <p>
                    This page shows wellbeing trends over the selected time period, helping you identify patterns and changes in team sentiment.
                  </p>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="flex items-start gap-2">
                      <span className="text-blue-600">💡</span>
                      <div className="text-xs text-blue-900">
                        <strong>Tip:</strong> Look for sudden drops or consistent declines in any measure - these may indicate areas requiring immediate attention.
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Trend Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {series.map(s => (
            <TrendCard key={s.heading} heading={s.heading} description={s.description} data={s.data} color={s.color}/>
          ))}
        </div>

        {trends.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-[var(--text-muted)]">No trend data available for this period yet.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardShell>
  );
}



