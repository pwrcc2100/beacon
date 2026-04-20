export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { supabaseAdmin } from '@/lib/supabase';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { ControlRoomLayout } from '@/components/layout/ControlRoomLayout';
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
      <a href="/dashboard-control-room" className="block px-3 py-2 rounded hover:bg-black/5">Control Room</a>
      <a href="/executive-summary" className="block px-3 py-2 rounded hover:bg-black/5">Executive Summary</a>
      <a href="/dashboard/group-leader" className="block px-3 py-2 rounded hover:bg-black/5">Group Leader View</a>
      <a href="/methodology" className="block px-3 py-2 rounded hover:bg-black/5">Methodology</a>
    </div>
  );

  return (
    <DashboardShell sidebar={Sidebar}>
      <ControlRoomLayout
        title="Predictive Analytics"
        subtitle="Organisational Psychosocial Risk Intelligence"
        headerExtra="Understanding what drives wellbeing and identifying early warning signals"
      >
        <div className="space-y-6">
          <LeadIndicators responses={data.responses} />
          <CorrelationInsights responses={data.responses} />
          <TrendComparison weeklyTrends={data.weeklyTrends} />
          <RiskSignals responses={data.responses} />
        </div>
      </ControlRoomLayout>
    </DashboardShell>
  );
}

