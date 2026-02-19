export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { cookies } from 'next/headers';
import { supabaseAdmin } from '@/lib/supabase';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { PrintButton } from '@/components/ui/PrintButton';
import { Button } from '@/components/ui/button';
import { EnhancedOrganisationFilterClient } from '@/components/dashboard/EnhancedOrganisationFilterClient';
import { TimePeriodFilter } from '@/components/dashboard/TimePeriodFilter';
import { DataModeToggleClient } from '../DataModeToggleClient';
import nextDynamic from 'next/dynamic';
import { DemoQRCode } from '@/components/dashboard/DemoQRCode';
import { getPeriodStartDate } from '@/lib/dateUtils';
import ExecutiveOverviewEnhanced from '@/components/dashboard/ExecutiveOverview-Enhanced';
import { generateExecutiveInsights } from '@/lib/executiveInsights';
import { calculateWellbeingPercent } from '@/components/dashboard/scoreTheme';

// Reuse the getData and getHierarchyData functions from parent page
// In a real app, these would be in a shared lib file
import { redirect } from 'next/navigation';

const AdminTools = nextDynamic(() => import('@/components/dashboard/AdminTools').then(m => ({ default: m.AdminTools })), { ssr: false });

export default async function DashboardEnhanced({ searchParams }: { searchParams?: { [k: string]: string | string[] | undefined } }) {
  // For now, redirect to main dashboard with instructions
  // In production, you'd duplicate the getData logic here
  
  const urlClient = (searchParams?.client as string | undefined) || undefined;
  const period = (searchParams?.period as string | undefined) || 'all';
  const mode = (searchParams?.mode as 'historical' | 'live' | undefined) || 'historical';
  const divisionId = (searchParams?.division_id as string | undefined) || undefined;
  const departmentId = (searchParams?.department_id as string | undefined) || undefined;
  const teamId = (searchParams?.team_id as string | undefined) || undefined;
  const clientId = urlClient || (process.env.NEXT_PUBLIC_DASHBOARD_CLIENT_ID ?? '');

  const requiredToken = process.env.ADMIN_DASH_TOKEN;
  if (requiredToken) {
    const cookieToken = cookies().get('dash')?.value;
    if (cookieToken !== requiredToken) {
      redirect('/dashboard');
    }
  }

  if (!clientId) {
    return (
      <DashboardShell sidebar={<div className="text-sm text-slate-600">No client ID configured</div>}>
        <div className="max-w-6xl mx-auto space-y-6">
          <h1 className="text-2xl font-bold">Enhanced Dashboard</h1>
          <p className="text-slate-600">Set NEXT_PUBLIC_DASHBOARD_CLIENT_ID in your environment to view data.</p>
        </div>
      </DashboardShell>
    );
  }

  // Temporary: Show instructions for testing
  return (
    <DashboardShell sidebar={
      <div className="space-y-4">
        <div className="text-xs uppercase tracking-wide text-slate-500 mb-2">Navigation</div>
        <a href="/dashboard" className="block px-3 py-2 rounded hover:bg-black/5">Current Dashboard</a>
        <a href="/dashboard/enhanced" className="block px-3 py-2 rounded bg-black/5 font-medium">Enhanced Dashboard</a>
        <a href="/dashboard/trends" className="block px-3 py-2 rounded hover:bg-black/5">Trends</a>
      </div>
    }>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-lg">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">📸 Enhanced Dashboard (WebinarReady)</h1>
          <p className="text-slate-700 mb-4">
            This is the new enhanced version with:
          </p>
          <ul className="space-y-2 text-sm text-slate-700 list-disc list-inside">
            <li><strong>Executive Summary Panel:</strong> Auto-generates 3 insights (What's changing, Where to focus, What to do next)</li>
            <li><strong>Operational KPIs:</strong> "Overall Risk Signal (Beacon Index)" with compliance-ready tooltips</li>
            <li><strong>Leading Indicators (Drivers):</strong> Driver-based view with Primary/Secondary driver labels</li>
            <li><strong>Triage Bands:</strong> Clear action pathways (&lt;65% High Alert, 65-79% Watch, 80%+ Thriving)</li>
            <li><strong>Share View Mode:</strong> Screenshot-friendly toggle (hides nav, adds footer note)</li>
          </ul>
          
          <div className="mt-6 p-4 bg-white border border-slate-200 rounded">
            <h3 className="font-semibold text-slate-900 mb-2">Integration Instructions:</h3>
            <ol className="space-y-2 text-sm text-slate-700 list-decimal list-inside">
              <li>Copy the data fetching logic from <code className="bg-slate-100 px-1 rounded">/dashboard/page.tsx</code></li>
              <li>Replace <code className="bg-slate-100 px-1 rounded">ExecutiveOverviewOptionA</code> with <code className="bg-slate-100 px-1 rounded">ExecutiveOverviewEnhanced</code></li>
              <li>Pass the <code className="bg-slate-100 px-1 rounded">responseRate</code> prop (needs {`{ responded, total }`} shape)</li>
              <li>Test with demo data to verify all 3 executive summary statements generate correctly</li>
            </ol>
          </div>

          <div className="mt-4 flex gap-3">
            <a 
              href="/dashboard" 
              className="inline-flex items-center px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
            >
              View Current Dashboard
            </a>
            <a 
              href="https://github.com/yourusername/beacon/blob/main/src/components/dashboard/ExecutiveOverview-Enhanced.tsx" 
              className="inline-flex items-center px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              View Component Code →
            </a>
          </div>
        </div>

        {/* Demo of the component with sample data */}
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Component Preview (Sample Data)</h2>
          <ExecutiveOverviewEnhanced
            overallScore={72}
            previousScore={68}
            trendSeries={[
              { label: 'Jan 15', wellbeing: 65, safety: 70 },
              { label: 'Jan 22', wellbeing: 68, safety: 72 },
              { label: 'Jan 29', wellbeing: 72, safety: 74 },
            ]}
            questionScores={{
              sentiment: 3.8,
              clarity: 3.2,
              workload: 3.0,
              safety: 3.5,
              leadership: 3.7,
            }}
            participationRate={68}
            responseRate={{ responded: 245, total: 360 }}
            teams={[
              { id: '1', name: 'Team Alpha', wellbeing: 58, displayName: 'Team Alpha · Sydney' },
              { id: '2', name: 'Team Beta', wellbeing: 72, displayName: 'Team Beta · Melbourne' },
              { id: '3', name: 'Team Gamma', wellbeing: 85, displayName: 'Team Gamma · Brisbane' },
            ]}
            divisions={[]}
            insights={[]}
          />
        </div>
      </div>
    </DashboardShell>
  );
}
