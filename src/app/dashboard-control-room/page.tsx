export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { cookies } from 'next/headers';
import { supabaseAdmin } from '@/lib/supabase';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { PrintButton } from '@/components/ui/PrintButton';
import { Button } from '@/components/ui/button';
import { EnhancedOrganisationFilterClient } from '@/components/dashboard/EnhancedOrganisationFilterClient';
import { TimePeriodFilter } from '@/components/dashboard/TimePeriodFilter';
import { DataModeToggleClient } from '../dashboard/DataModeToggleClient';
import nextDynamic from 'next/dynamic';
import { DemoQRCode } from '@/components/dashboard/DemoQRCode';
import { getPeriodStartDate } from '@/lib/dateUtils';
import { calculateWellbeingPercent } from '@/components/dashboard/scoreTheme';
import { evaluateBeaconSignals } from '@/lib/beaconSignals';
import { getData, getHierarchyData, getOrgStructure } from '../dashboard/dashboardData';
import ControlRoomDashboard from './components/ControlRoomDashboard';
import { ControlRoomLayout } from '@/components/layout/ControlRoomLayout';

const AdminTools = nextDynamic(() => import('@/components/dashboard/AdminTools').then(m => ({ default: m.AdminTools })), { ssr: false });

export default async function ControlRoomPage({ 
  searchParams 
}: { 
  searchParams?: { [k: string]: string | string[] | undefined } 
}) {
  const urlClient = (searchParams?.client as string | undefined) || undefined;
  const from = (searchParams?.from as string | undefined) || '';
  const to = (searchParams?.to as string | undefined) || '';
  const period = (searchParams?.period as string | undefined) || 'all';
  const mode = (searchParams?.mode as 'historical' | 'live' | undefined) || 'historical';
  const divisionId = (searchParams?.division_id as string | undefined) || undefined;
  const departmentId = (searchParams?.department_id as string | undefined) || undefined;
  const teamId = (searchParams?.team_id as string | undefined) || undefined;
  const selectedDeptsParam = searchParams?.selected_departments;
  const selectedDepartments = Array.isArray(selectedDeptsParam)
    ? selectedDeptsParam
    : selectedDeptsParam
      ? [selectedDeptsParam as string]
      : undefined;

  const clientId = urlClient || (process.env.NEXT_PUBLIC_DASHBOARD_CLIENT_ID ?? '');

  // Auth check
  const requiredToken = process.env.ADMIN_DASH_TOKEN;
  if (requiredToken) {
    const cookieToken = cookies().get('dash')?.value;
    if (cookieToken !== requiredToken) {
      const qp = new URLSearchParams();
      if (clientId) qp.set('client', clientId);
      if (from) qp.set('from', from);
      if (to) qp.set('to', to);
      const redirectTo = qp.toString() ? `/dashboard-control-room?${qp.toString()}` : '/dashboard-control-room';
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
        <a href="/dashboard-control-room" className="block px-3 py-2 rounded bg-black/5 font-medium">Control Room</a>
        <a href="/executive-summary" className="block px-3 py-2 rounded hover:bg-black/5">Executive Summary</a>
        <a href="/dashboard/group-leader" className="block px-3 py-2 rounded hover:bg-black/5">Group Leader View</a>
        <a href="/methodology" className="block px-3 py-2 rounded hover:bg-black/5">Methodology</a>
      </div>
    );
    return (
      <DashboardShell sidebar={NoClientSidebar}>
        <ControlRoomLayout title="Control Room Dashboard" subtitle="Organisational Psychosocial Risk Intelligence">
          <p className="text-zinc-400">Set NEXT_PUBLIC_DASHBOARD_CLIENT_ID in your environment to view data.</p>
        </ControlRoomLayout>
      </DashboardShell>
    );
  }

  // Fetch data using existing functions
  const { trends, recent, responseRate } = await getData(clientId, {
    period: period !== 'all' ? period : undefined,
    mode,
    divisionId,
    departmentId,
    teamId,
    selectedDepartments,
  });

  const hierarchyData = await getHierarchyData(
    clientId,
    divisionId,
    departmentId,
    teamId,
    selectedDepartments,
    period !== 'all' ? period : undefined,
    mode
  );

  const { divisions, departments, teams } = await getOrgStructure(clientId);

  // Build lookup maps
  const departmentsById = new Map(departments.map(dept => [dept.department_id, dept]));
  const divisionsById = new Map(divisions.map(div => [div.division_id, div]));

  // Calculate score and trend data; use demo values when no real data (so control room always looks populated)
  const hasRealData = trends.length > 0 || recent.length > 0;
  const latestRow = trends.length ? trends[trends.length - 1] : undefined;
  const previousRow = trends.length > 1 ? trends[trends.length - 2] : undefined;

  const questionScores = hasRealData
    ? {
        sentiment: latestRow?.sentiment_avg ?? 0,
        clarity: latestRow?.clarity_avg ?? 0,
        workload: latestRow?.workload_avg ?? 0,
        safety: latestRow?.safety_avg ?? 0,
        leadership: latestRow?.leadership_avg ?? 0,
      } as const
    : { sentiment: 1.25, clarity: 3.75, workload: 4.4, safety: 2.25, leadership: 3.1 } as const;

  const overallScore = hasRealData && latestRow
    ? calculateWellbeingPercent({
        sentiment: latestRow.sentiment_avg,
        workload: latestRow.workload_avg,
        safety: latestRow.safety_avg,
        leadership: latestRow.leadership_avg,
        clarity: latestRow.clarity_avg,
      })
    : hasRealData ? 0 : 68.2;

  const previousScore = hasRealData && previousRow
    ? calculateWellbeingPercent({
        sentiment: previousRow.sentiment_avg,
        workload: previousRow.workload_avg,
        safety: previousRow.safety_avg,
        leadership: previousRow.leadership_avg,
        clarity: previousRow.clarity_avg,
      })
    : hasRealData ? undefined : 74;

  const trendData = hasRealData
    ? trends.map(t =>
        calculateWellbeingPercent({
          sentiment: t.sentiment_avg,
          workload: t.workload_avg,
          safety: t.safety_avg,
          leadership: t.leadership_avg,
          clarity: t.clarity_avg,
        }) ?? 0
      )
    : [74, 72, 70, 69, 68, 68.2];

  const participationPercent = responseRate.total > 0 ? (responseRate.responded / responseRate.total) * 100 : (hasRealData ? 0 : 74);
  const beaconSignals = evaluateBeaconSignals({
    overallScore: overallScore ?? 0,
    questionScores,
    trends,
  });

  // Get attention teams (sorted by wellbeing) with per-team domain scores for heatmap
  let attentionTeams: Array<{
    id: string;
    name: string;
    displayName?: string;
    divisionName?: string;
    departmentName?: string;
    wellbeing: number;
    domainScores?: { sentiment: number; clarity: number; workload: number; safety: number; leadership: number };
  }> = [];

  let eligibleTeams = teams;
  if (teamId) {
    eligibleTeams = teams.filter(team => team.team_id === teamId);
  } else if (selectedDepartments && selectedDepartments.length > 0) {
    const selectedSet = new Set(selectedDepartments);
    eligibleTeams = teams.filter(team => selectedSet.has(team.department_id));
  } else if (departmentId) {
    eligibleTeams = teams.filter(team => team.department_id === departmentId);
  } else if (divisionId) {
    const divisionDeptSet = new Set(
      departments
        .filter(dept => dept.division_id === divisionId)
        .map(dept => dept.department_id)
    );
    eligibleTeams = teams.filter(team => divisionDeptSet.has(team.department_id));
  }

  if (eligibleTeams.length > 0) {
    const teamIds = eligibleTeams.map(team => team.team_id);
    let teamResponsesQuery = supabaseAdmin
      .from('responses_v3')
      .select('sentiment_5, clarity_5, workload_5, safety_5, leadership_5, submitted_at, employees!inner(team_id)')
      .eq('client_id', clientId)
      .in('employees.team_id', teamIds);

    // Apply period and mode filters (same as getData) so heatmap aligns with filters
    const startDate = (() => {
      if (mode === 'live') {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return today;
      }
      return period && period !== 'all' ? getPeriodStartDate(period) : undefined;
    })();
    if (startDate) {
      teamResponsesQuery = teamResponsesQuery.gte('submitted_at', startDate.toISOString());
    }

    const { data: teamResponses } = await teamResponsesQuery.limit(10000);

    if (teamResponses && teamResponses.length > 0) {
      // Aggregate by team
      const aggregates: Record<
        string,
        {
          count: number;
          sentiment: number;
          clarity: number;
          workload: number;
          safety: number;
          leadership: number;
        }
      > = {};

      teamIds.forEach(id => {
        aggregates[id] = {
          count: 0,
          sentiment: 0,
          clarity: 0,
          workload: 0,
          safety: 0,
          leadership: 0,
        };
      });

      const teamInfoMap = new Map(eligibleTeams.map(team => [team.team_id, team]));

      (teamResponses ?? []).forEach((response: any) => {
        const teamKey = response.employees?.team_id;
        if (teamKey && aggregates[teamKey]) {
          aggregates[teamKey].count += 1;
          aggregates[teamKey].sentiment += Number(response.sentiment_5 ?? 0);
          aggregates[teamKey].clarity += Number(response.clarity_5 ?? 0);
          aggregates[teamKey].workload += Number(response.workload_5 ?? 0);
          aggregates[teamKey].safety += Number(response.safety_5 ?? 0);
          aggregates[teamKey].leadership += Number(response.leadership_5 ?? 0);
        }
      });

      attentionTeams = Object.entries(aggregates)
        .filter(([, agg]) => agg.count > 0)
        .map(([id, agg]) => {
          const meta = teamInfoMap.get(id);
          const dept = meta ? departmentsById.get(meta.department_id) : undefined;
          const division = dept ? divisionsById.get(dept.division_id) : undefined;
          const baseName = meta?.display_name ?? meta?.team_name ?? 'Team';
          const n = agg.count;
          const domainScores = {
            sentiment: agg.sentiment / n,
            clarity: agg.clarity / n,
            workload: agg.workload / n,
            safety: agg.safety / n,
            leadership: agg.leadership / n,
          };

          return {
            id,
            name: baseName,
            displayName: baseName,
            divisionName: division?.division_name,
            departmentName: dept?.department_name,
            wellbeing: calculateWellbeingPercent(domainScores) ?? 0,
            domainScores,
          };
        });
    }

    // Use demo data if no real data
    if (attentionTeams.length === 0) {
      attentionTeams = getDemoAttentionTeams();
    }

    // Sort by wellbeing (lowest first - those needing attention)
    attentionTeams = attentionTeams.sort((a, b) => a.wellbeing - b.wellbeing);
  } else {
    // No eligible teams - use demo data so control room always shows content
    attentionTeams = getDemoAttentionTeams();
  }

  const Sidebar = (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="text-xs uppercase tracking-wide text-[var(--text-muted)] mb-2">Navigation</div>
        <a href="/dashboard-control-room" className="block px-3 py-2 rounded bg-black/5 font-medium">Control Room</a>
        <a href="/executive-summary" className="block px-3 py-2 rounded hover:bg-black/5">Executive Summary</a>
        <a href="/dashboard/group-leader" className="block px-3 py-2 rounded hover:bg-black/5">Group Leader View</a>
        <a href="/methodology" className="block px-3 py-2 rounded hover:bg-black/5">Methodology</a>
      </div>

      {/* Filters Section */}
      <div className="pt-4 border-t border-black/10 space-y-3">
        <div className="text-xs uppercase tracking-wide text-[var(--text-muted)] mb-2">Filters</div>

        <div className="space-y-2">
          <div className="text-xs font-medium text-[var(--text-muted)]">Organization</div>
          <EnhancedOrganisationFilterClient
            clientId={clientId}
            period={period}
            mode={mode}
            currentDivisionId={divisionId}
            currentDepartmentId={departmentId}
            currentTeamId={teamId}
            selectedDepartments={selectedDepartments || []}
            divisions={divisions || []}
            departments={departments || []}
            teams={teams || []}
          />
        </div>

        <div className="space-y-2">
          <div className="text-xs font-medium text-[var(--text-muted)]">Time Period</div>
          <TimePeriodFilter
            clientId={clientId}
            currentPeriod={period}
            mode={mode}
            divisionId={divisionId}
            departmentId={departmentId}
            teamId={teamId}
          />
        </div>

        <div className="space-y-2">
          <div className="text-xs font-medium text-[var(--text-muted)]">Data Mode</div>
          <DataModeToggleClient
            clientId={clientId}
            currentMode={mode}
            period={period}
            divisionId={divisionId}
            departmentId={departmentId}
            teamId={teamId}
          />
        </div>
      </div>

      {/* Actions Section */}
      <div className="pt-4 border-t border-black/10 space-y-2">
        <div className="text-xs uppercase tracking-wide text-[var(--text-muted)] mb-2">Actions</div>
        <PrintButton />
        <form action={`/api/download`} method="get" className="w-full">
          <input type="hidden" name="client_id" value={clientId} />
          <Button type="submit" variant="outline" size="sm" className="w-full" disabled={recent.length === 0}>
            Download CSV
          </Button>
        </form>
      </div>

      {/* Admin & QR */}
      <div className="pt-4 border-t border-black/10">
        <AdminTools clientId={clientId} />
        <div className="mt-4">
          <DemoQRCode clientId={clientId} compact={true} />
        </div>
      </div>
    </div>
  );

  return (
    <DashboardShell sidebar={Sidebar}>
      <ControlRoomLayout
        title="Beacon Index Control Room"
        subtitle="Organisational Psychosocial Risk Intelligence"
        headerExtra={`${responseRate.responded} responses • ${Math.round(participationPercent)}% participation`}
      >
        <ControlRoomDashboard
          overallScore={overallScore ?? 0}
          previousScore={previousScore}
          trendData={trendData}
          questionScores={questionScores}
          beaconSignals={beaconSignals}
          participationRate={participationPercent}
          teams={attentionTeams.slice(0, 20)}
          responseCount={responseRate.responded}
          totalEmployees={responseRate.total}
        />
      </ControlRoomLayout>
    </DashboardShell>
  );
}

/** Demo teams matching reference design - per-domain scores 0-5 (*20 = 0-100 for display) */
function getDemoAttentionTeams() {
  return [
    { id: 'demo-a', name: 'Team A', displayName: 'Team A', divisionName: 'Sydney Metro', departmentName: 'Education', wellbeing: 82, domainScores: { sentiment: 1.0, clarity: 2.5, workload: 4.6, safety: 2.0, leadership: 1.5 } },
    { id: 'demo-b', name: 'Team B', displayName: 'Team B', divisionName: 'Sydney Metro', departmentName: 'Residential', wellbeing: 64, domainScores: { sentiment: 1.5, clarity: 2.0, workload: 2.25, safety: 2.9, leadership: 3.0 } },
    { id: 'demo-c', name: 'Team C', displayName: 'Team C', divisionName: 'Regional', departmentName: 'Education', wellbeing: 58, domainScores: { sentiment: 0.75, clarity: 3.9, workload: 3.0, safety: 1.75, leadership: 2.0 } },
    { id: 'demo-d', name: 'Team D', displayName: 'Team D', divisionName: 'Regional', departmentName: 'Health', wellbeing: 71, domainScores: { sentiment: 1.25, clarity: 1.5, workload: 2.5, safety: 2.25, leadership: 3.2 } },
    { id: 'demo-e', name: 'Team E', displayName: 'Team E', divisionName: 'Regional', departmentName: 'Residential', wellbeing: 75, domainScores: { sentiment: 3.0, clarity: 1.5, workload: 3.75, safety: 3.75, leadership: 3.75 } },
    { id: 'demo-f', name: 'Team F', displayName: 'Team F', divisionName: 'QLD', departmentName: 'Health', wellbeing: 68, domainScores: { sentiment: 2.5, clarity: 2.0, workload: 3.0, safety: 2.9, leadership: 3.0 } },
  ];
}
