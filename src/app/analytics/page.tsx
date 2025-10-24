export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { supabaseAdmin } from '@/lib/supabase';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { LeadIndicators } from '@/components/analytics/LeadIndicators';
import { CorrelationInsights } from '@/components/analytics/CorrelationInsights';
import { TrendComparison } from '@/components/analytics/TrendComparison';
import { RiskSignals } from '@/components/analytics/RiskSignals';

async function getAnalyticsData(clientId: string) {
  // Get all responses
  const { data: responses } = await supabaseAdmin
    .from('responses_v3')
    .select('*')
    .eq('client_id', clientId)
    .order('submitted_at', { ascending: true });

  // Get weekly aggregates
  const { data: weeklyTrends } = await supabaseAdmin
    .from('wellbeing_responses')
    .select('*')
    .eq('client_id', clientId)
    .order('wk', { ascending: true });

  return {
    responses: responses || [],
    weeklyTrends: weeklyTrends || []
  };
}

export default async function AnalyticsPage() {
  const clientId = process.env.NEXT_PUBLIC_DASHBOARD_CLIENT_ID ?? '';
  
  if (!clientId) {
    return (
      <main className="p-6">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl font-bold mb-2">Advanced Analytics</h1>
          <p className="text-muted-foreground">Set NEXT_PUBLIC_DASHBOARD_CLIENT_ID to view analytics.</p>
        </div>
      </main>
    );
  }

  const data = await getAnalyticsData(clientId);

  const Sidebar = (
    <div className="space-y-2">
      <div className="text-xs uppercase tracking-wide text-muted-foreground mb-2">Navigation</div>
      <a href="/dashboard" className="block px-3 py-2 rounded hover:bg-black/5">Overview</a>
      <a href="/dashboard/trends" className="block px-3 py-2 rounded hover:bg-black/5">Trends</a>
      <a href="/analytics" className="block px-3 py-2 rounded bg-black/5 font-medium">Analytics</a>
      <a href="/methodology" className="block px-3 py-2 rounded hover:bg-black/5">Methodology</a>
    </div>
  );

  return (
    <DashboardShell sidebar={Sidebar}>
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Predictive Analytics</h1>
          <p className="text-sm text-muted-foreground">Understanding what drives wellbeing and identifying early warning signals</p>
        </div>

        {/* Lead Indicators */}
        <LeadIndicators responses={data.responses} />

        {/* Correlation Insights */}
        <CorrelationInsights responses={data.responses} />

        {/* Trend Comparison */}
        <TrendComparison weeklyTrends={data.weeklyTrends} />

        {/* Risk Signals */}
        <RiskSignals responses={data.responses} />
      </div>
    </DashboardShell>
  );
}

