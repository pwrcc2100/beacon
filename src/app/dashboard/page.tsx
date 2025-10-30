export const dynamic = 'force-dynamic';
export const revalidate = 0;
import { cookies } from 'next/headers';
import { supabaseAdmin } from '@/lib/supabase';
import { Kpi } from '@/components/charts/Kpi';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { WellbeingScore } from '@/components/charts/WellbeingScore';
import { WellbeingGauge } from '@/components/charts/WellbeingGauge';
import { TrendCard } from '@/components/charts/TrendCard';
import { PillChart } from '@/components/charts/PillChart';
import { ExecutiveSummary } from '@/components/charts/ExecutiveSummary';
import { ParticipationCard } from '@/components/charts/ParticipationCard';
import { PrintButton } from '@/components/ui/PrintButton';
import { StatusCards } from '@/components/dashboard/StatusCards';
import { MoodDistribution } from '@/components/dashboard/MoodDistribution';
import { TeamStatus } from '@/components/dashboard/TeamStatus';
import { QuoteBanner } from '@/components/dashboard/QuoteBanner';
import { EnhancedOrganisationFilterClient } from '@/components/dashboard/EnhancedOrganisationFilterClient';
import { TeamsAttentionChartWrapper } from '@/components/dashboard/TeamsAttentionChartWrapper';
import { TimePeriodFilter } from '@/components/dashboard/TimePeriodFilter';
import { DataModeToggleClient } from './DataModeToggleClient';
import { GenerateDemoDataButton } from '@/components/dashboard/GenerateDemoDataButton';
import { SetupHierarchyButton } from '@/components/dashboard/SetupHierarchyButton';
import { DemoQRCode } from '@/components/dashboard/DemoQRCode';
import { getPeriodStartDate } from '@/lib/dateUtils';
import DemoDashboardClient from './DemoDashboardClient';

type WellbeingRow = {
  wk: string;
  sentiment_avg: number;
  clarity_avg: number;
  workload_avg: number;
  safety_avg: number;
  leadership_avg: number;
};

async function getData(clientId: string, period?: string, mode?: 'historical' | 'live'){
  // Calculate date range based on period
  let startDate: Date | undefined;
  
  if (mode === 'live') {
    // Live mode: only show data from today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    startDate = today;
  } else {
    // Historical mode: use period filter
    startDate = period ? getPeriodStartDate(period) : undefined;
  }

  let trendsQuery = supabaseAdmin
    .from('wellbeing_responses')
    .select('wk, sentiment_avg, clarity_avg, workload_avg, safety_avg, leadership_avg')
    .eq('client_id', clientId)
    .order('wk', { ascending: true });
  
  if (startDate) {
    trendsQuery = trendsQuery.gte('wk', startDate.toISOString());
  }
  
  const { data: trends } = await trendsQuery;

  // Fallback: if MV is empty/not refreshed, compute trends directly from raw responses
  let computedTrends = trends as any[] | null;
  if (!computedTrends || computedTrends.length === 0) {
    let directQuery = supabaseAdmin
      .from('responses_v3')
      .select('submitted_at, sentiment_5, clarity_5, workload_5, safety_5, leadership_5')
      .eq('client_id', clientId)
      .order('submitted_at', { ascending: true });
    
    if (startDate) {
      directQuery = directQuery.gte('submitted_at', startDate.toISOString());
    }
    
    const { data: direct } = await directQuery;
    if (direct && direct.length) {
      // Group by week in JS
      const byWeek: Record<string, { n:number; s:number; c:number; w:number; sa:number; l:number }> = {};
      for (const r of direct as any[]) {
        const d = new Date(r.submitted_at);
        // ISO week start (Mon) approximation: get Monday of that week
        const day = d.getDay() || 7; // 1..7
        const monday = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() - (day-1)));
        const key = monday.toISOString().slice(0,10);
        if (!byWeek[key]) byWeek[key] = { n:0, s:0, c:0, w:0, sa:0, l:0 };
        const b = byWeek[key];
        b.n += 1;
        b.s += Number(r.sentiment_5 || 0);
        b.c += Number(r.clarity_5 || 0);
        b.w += Number(r.workload_5 || 0);
        b.sa += Number(r.safety_5 || 0);
        b.l += Number(r.leadership_5 || 0);
      }
      const keys = Object.keys(byWeek).sort();
      computedTrends = keys.map(k => {
        const b = byWeek[k];
        return {
          wk: new Date(k + 'T00:00:00.000Z').toISOString(),
          sentiment_avg: b.s / b.n,
          clarity_avg: b.c / b.n,
          workload_avg: b.w / b.n,
          safety_avg: b.sa / b.n,
          leadership_avg: b.l / b.n,
        };
      });
    }
  }

  let recentQuery = supabaseAdmin
    .from('responses_v3')
    .select('submitted_at, workload_5, safety_5, clarity_5, sentiment_5, leadership_5')
    .eq('client_id', clientId)
    .order('submitted_at', { ascending: false })
    .limit(20);
  
  if (startDate) {
    recentQuery = recentQuery.gte('submitted_at', startDate.toISOString());
  }
  
  const { data: recent } = await recentQuery;

  // Get response rate: count responses vs tokens issued in period
  let tokensQuery = supabaseAdmin
    .from('tokens')
    .select('id, status')
    .eq('client_id', clientId);
  
  let responsesCountQuery = supabaseAdmin
    .from('responses_v3')
    .select('id', { count: 'exact', head: true })
    .eq('client_id', clientId);
  
  if (startDate) {
    tokensQuery = tokensQuery.gte('created_at', startDate.toISOString());
    responsesCountQuery = responsesCountQuery.gte('submitted_at', startDate.toISOString());
  }
  
  const { data: tokens } = await tokensQuery;
  const { count: responsesCount } = await responsesCountQuery;

  return { 
    trends: (computedTrends ?? trends ?? []) as WellbeingRow[], 
    recent: recent ?? [],
    responseRate: {
      responded: responsesCount ?? 0,
      total: tokens?.length ?? 0
    }
  };
}

async function getHierarchyData(clientId: string, divisionId?: string, departmentId?: string, teamId?: string, selectedDepartments?: string[], period?: string, mode?: 'historical' | 'live') {
  let startDate: Date | undefined;
  
  if (mode === 'live') {
    // Live mode: only show data from today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    startDate = today;
  } else {
    // Historical mode: use period filter
    startDate = period ? getPeriodStartDate(period) : undefined;
  }

  // Determine current drill-down level
  let currentLevel: string;
  let nextLevel: string | null = null;
  
  if (teamId) {
    currentLevel = 'team';
    // At team level, show individual responses
    let query = supabaseAdmin
      .from('responses_v3')
      .select(`
        submitted_at, 
        sentiment_5, 
        clarity_5, 
        workload_5, 
        safety_5, 
        leadership_5,
        employees!inner(team_id)
      `)
      .eq('client_id', clientId)
      .eq('employees.team_id', teamId);
    
    if (startDate) query = query.gte('submitted_at', startDate.toISOString());
    
    const { data } = await query.order('submitted_at', { ascending: false }).limit(20);
    return { data: data || [], currentLevel, nextLevel, hierarchyLevels: ['division', 'department', 'team'] };
    
  } else if (selectedDepartments && selectedDepartments.length > 0) {
    // Multi-select departments mode
    currentLevel = 'department';
    nextLevel = 'team';
    
    // Get all departments that are selected
    const { data: selectedDepts } = await supabaseAdmin
      .from('departments')
      .select('department_id, department_name')
      .in('department_id', selectedDepartments)
      .eq('active', true);
    
    if (!selectedDepts || selectedDepts.length === 0) {
      return { data: [], currentLevel, nextLevel, hierarchyLevels: ['division', 'department', 'team'] };
    }
    
    // Get teams across selected departments
    const { data: teams } = await supabaseAdmin
      .from('teams')
      .select('team_id, team_name, department_id')
      .in('department_id', selectedDepartments)
      .eq('active', true);
    
    const teamIds = teams?.map(t => t.team_id) || [];
    
    let query = supabaseAdmin
      .from('responses_v3')
      .select(`
        sentiment_5,
        clarity_5,
        workload_5,
        safety_5,
        leadership_5,
        employees!inner(department_id, team_id)
      `)
      .eq('client_id', clientId)
      .in('employees.department_id', selectedDepartments);
    
    if (startDate) query = query.gte('submitted_at', startDate.toISOString());
    
    const { data: responses } = await query;
    
    // Aggregate by department (across selected departments)
    const aggregates: Record<string, any> = {};
    selectedDepts.forEach(dept => {
      aggregates[dept.department_id] = {
        id: dept.department_id,
        name: dept.department_name,
        count: 0,
        sentiment_sum: 0,
        clarity_sum: 0,
        workload_sum: 0,
        safety_sum: 0,
        leadership_sum: 0
      };
    });
    
    (responses || []).forEach((r: any) => {
      const deptId = r.employees?.department_id;
      if (deptId && aggregates[deptId]) {
        aggregates[deptId].count += 1;
        aggregates[deptId].sentiment_sum += r.sentiment_5 || 0;
        aggregates[deptId].clarity_sum += r.clarity_5 || 0;
        aggregates[deptId].workload_sum += r.workload_5 || 0;
        aggregates[deptId].safety_sum += r.safety_5 || 0;
        aggregates[deptId].leadership_sum += r.leadership_5 || 0;
      }
    });
    
    const data = Object.values(aggregates)
      .filter((agg: any) => agg.count > 0)
      .map((agg: any) => ({
        id: agg.id,
        name: agg.name,
        response_count: agg.count,
        sentiment_avg: agg.sentiment_sum / agg.count,
        clarity_avg: agg.clarity_sum / agg.count,
        workload_avg: agg.workload_sum / agg.count,
        safety_avg: agg.safety_sum / agg.count,
        leadership_avg: agg.leadership_sum / agg.count,
        wellbeing_score: ((agg.sentiment_sum / agg.count) * 0.30 + (agg.workload_sum / agg.count) * 0.25 + (agg.leadership_sum / agg.count) * 0.25 + (agg.safety_sum / agg.count) * 0.20) * 20
      }));
    
    return { data, currentLevel, nextLevel, hierarchyLevels: ['division', 'department', 'team'] };
    
  } else if (departmentId) {
    currentLevel = 'department';
    nextLevel = 'team';
    
    // Get teams in this department with aggregated scores
    const { data: teams } = await supabaseAdmin
      .from('teams')
      .select('team_id, team_name')
      .eq('department_id', departmentId)
      .eq('active', true);
    
    if (!teams || teams.length === 0) {
      return { data: [], currentLevel, nextLevel, hierarchyLevels: ['division', 'department', 'team'] };
    }
    
    const teamIds = teams.map(t => t.team_id);
    
    let query = supabaseAdmin
      .from('responses_v3')
      .select(`
        sentiment_5,
        clarity_5,
        workload_5,
        safety_5,
        leadership_5,
        employees!inner(team_id)
      `)
      .eq('client_id', clientId)
      .in('employees.team_id', teamIds);
    
    if (startDate) query = query.gte('submitted_at', startDate.toISOString());
    
    const { data: responses } = await query;
    
    // Aggregate by team
    const aggregates: Record<string, any> = {};
    teams.forEach(team => {
      aggregates[team.team_id] = {
        id: team.team_id,
        name: team.team_name,
        count: 0,
        sentiment_sum: 0,
        clarity_sum: 0,
        workload_sum: 0,
        safety_sum: 0,
        leadership_sum: 0
      };
    });
    
    (responses || []).forEach((r: any) => {
      const teamId = r.employees?.team_id;
      if (teamId && aggregates[teamId]) {
        aggregates[teamId].count += 1;
        aggregates[teamId].sentiment_sum += r.sentiment_5 || 0;
        aggregates[teamId].clarity_sum += r.clarity_5 || 0;
        aggregates[teamId].workload_sum += r.workload_5 || 0;
        aggregates[teamId].safety_sum += r.safety_5 || 0;
        aggregates[teamId].leadership_sum += r.leadership_5 || 0;
      }
    });
    
    const data = Object.values(aggregates)
      .filter((agg: any) => agg.count > 0)
      .map((agg: any) => ({
        id: agg.id,
        name: agg.name,
        response_count: agg.count,
        sentiment_avg: agg.sentiment_sum / agg.count,
        clarity_avg: agg.clarity_sum / agg.count,
        workload_avg: agg.workload_sum / agg.count,
        safety_avg: agg.safety_sum / agg.count,
        leadership_avg: agg.leadership_sum / agg.count,
        wellbeing_score: ((agg.sentiment_sum / agg.count) * 0.30 + (agg.workload_sum / agg.count) * 0.25 + (agg.leadership_sum / agg.count) * 0.25 + (agg.safety_sum / agg.count) * 0.20) * 20
      }));
    
    return { data, currentLevel, nextLevel, hierarchyLevels: ['division', 'department', 'team'] };
    
  } else if (divisionId) {
    currentLevel = 'division';
    nextLevel = 'department';
    
    // Get departments in this division with aggregated scores
    const { data: departments } = await supabaseAdmin
      .from('departments')
      .select('department_id, department_name')
      .eq('division_id', divisionId)
      .eq('active', true);
    
    if (!departments || departments.length === 0) {
      return { data: [], currentLevel, nextLevel, hierarchyLevels: ['division', 'department', 'team'] };
    }
    
    const deptIds = departments.map(d => d.department_id);
    
    let query = supabaseAdmin
      .from('responses_v3')
      .select(`
        sentiment_5,
        clarity_5,
        workload_5,
        safety_5,
        leadership_5,
        employees!inner(department_id)
      `)
      .eq('client_id', clientId)
      .in('employees.department_id', deptIds);
    
    if (startDate) query = query.gte('submitted_at', startDate.toISOString());
    
    const { data: responses } = await query;
    
    // Aggregate by department
    const aggregates: Record<string, any> = {};
    departments.forEach(dept => {
      aggregates[dept.department_id] = {
        id: dept.department_id,
        name: dept.department_name,
        count: 0,
        sentiment_sum: 0,
        clarity_sum: 0,
        workload_sum: 0,
        safety_sum: 0,
        leadership_sum: 0
      };
    });
    
    (responses || []).forEach((r: any) => {
      const deptId = r.employees?.department_id;
      if (deptId && aggregates[deptId]) {
        aggregates[deptId].count += 1;
        aggregates[deptId].sentiment_sum += r.sentiment_5 || 0;
        aggregates[deptId].clarity_sum += r.clarity_5 || 0;
        aggregates[deptId].workload_sum += r.workload_5 || 0;
        aggregates[deptId].safety_sum += r.safety_5 || 0;
        aggregates[deptId].leadership_sum += r.leadership_5 || 0;
      }
    });
    
    const data = Object.values(aggregates)
      .filter((agg: any) => agg.count > 0)
      .map((agg: any) => ({
        id: agg.id,
        name: agg.name,
        response_count: agg.count,
        sentiment_avg: agg.sentiment_sum / agg.count,
        clarity_avg: agg.clarity_sum / agg.count,
        workload_avg: agg.workload_sum / agg.count,
        safety_avg: agg.safety_sum / agg.count,
        leadership_avg: agg.leadership_sum / agg.count,
        wellbeing_score: ((agg.sentiment_sum / agg.count) * 0.30 + (agg.workload_sum / agg.count) * 0.25 + (agg.leadership_sum / agg.count) * 0.25 + (agg.safety_sum / agg.count) * 0.20) * 20
      }));
    
    return { data, currentLevel, nextLevel, hierarchyLevels: ['division', 'department', 'team'] };
    
  } else {
    // Top level - show divisions
    currentLevel = 'top';
    nextLevel = 'division';
    
    const { data: divisions, error: divError } = await supabaseAdmin
      .from('divisions')
      .select('division_id, division_name')
      .eq('client_id', clientId)
      .eq('active', true);
    
    console.log('Divisions query:', { divisions, divError, clientId });
    
    if (!divisions || divisions.length === 0) {
      console.log('No divisions found, returning empty data');
      return { data: [], currentLevel, nextLevel, hierarchyLevels: ['division', 'department', 'team'] };
    }
    
    const divisionIds = divisions.map(d => d.division_id);
    
    let query = supabaseAdmin
      .from('responses_v3')
      .select(`
        sentiment_5,
        clarity_5,
        workload_5,
        safety_5,
        leadership_5,
        employees!inner(division_id)
      `)
      .eq('client_id', clientId)
      .in('employees.division_id', divisionIds);
    
    if (startDate) query = query.gte('submitted_at', startDate.toISOString());
    
    const { data: responses, error: respError } = await query;
    
    console.log('Responses query:', { responseCount: responses?.length, respError, divisionIds });
    
    // Aggregate by division
    const aggregates: Record<string, any> = {};
    divisions.forEach(div => {
      aggregates[div.division_id] = {
        id: div.division_id,
        name: div.division_name,
        count: 0,
        sentiment_sum: 0,
        clarity_sum: 0,
        workload_sum: 0,
        safety_sum: 0,
        leadership_sum: 0
      };
    });
    
    (responses || []).forEach((r: any) => {
      const divId = r.employees?.division_id;
      console.log('Processing response:', { divId, hasEmployees: !!r.employees, aggregateExists: !!aggregates[divId] });
      if (divId && aggregates[divId]) {
        aggregates[divId].count += 1;
        aggregates[divId].sentiment_sum += r.sentiment_5 || 0;
        aggregates[divId].clarity_sum += r.clarity_5 || 0;
        aggregates[divId].workload_sum += r.workload_5 || 0;
        aggregates[divId].safety_sum += r.safety_5 || 0;
        aggregates[divId].leadership_sum += r.leadership_5 || 0;
      }
    });
    
    console.log('Aggregates:', aggregates);
    
    const data = Object.values(aggregates)
      .filter((agg: any) => agg.count > 0)
      .map((agg: any) => ({
        id: agg.id,
        name: agg.name,
        response_count: agg.count,
        sentiment_avg: agg.sentiment_sum / agg.count,
        clarity_avg: agg.clarity_sum / agg.count,
        workload_avg: agg.workload_sum / agg.count,
        safety_avg: agg.safety_sum / agg.count,
        leadership_avg: agg.leadership_sum / agg.count,
        wellbeing_score: ((agg.sentiment_sum / agg.count) * 0.30 + (agg.workload_sum / agg.count) * 0.25 + (agg.leadership_sum / agg.count) * 0.25 + (agg.safety_sum / agg.count) * 0.20) * 20
      }));
    
    console.log('Final data:', data);
    
    return { data, currentLevel, nextLevel, hierarchyLevels: ['division', 'department', 'team'] };
  }
}

export default async function Dashboard({ searchParams }:{ searchParams?: { [k:string]: string | string[] | undefined } }){
  const urlClient = (searchParams?.client as string | undefined) || undefined;
  const from = (searchParams?.from as string | undefined) || '';
  const to = (searchParams?.to as string | undefined) || '';
  const period = (searchParams?.period as string | undefined) || 'all'; // 'week', 'month', 'quarter', 'all'
  const mode = (searchParams?.mode as 'historical' | 'live' | undefined) || 'historical';
  const divisionId = (searchParams?.division_id as string | undefined) || undefined;
  const departmentId = (searchParams?.department_id as string | undefined) || undefined;
  const teamId = (searchParams?.team_id as string | undefined) || undefined;
  // Handle selected_departments as array (can be string or string[])
  const selectedDeptsParam = searchParams?.selected_departments;
  const selectedDepartments = Array.isArray(selectedDeptsParam) 
    ? selectedDeptsParam 
    : selectedDeptsParam 
    ? [selectedDeptsParam as string]
    : undefined;
  const clientId = urlClient || (process.env.NEXT_PUBLIC_DASHBOARD_CLIENT_ID ?? '');

  const requiredToken = process.env.ADMIN_DASH_TOKEN;
  if (requiredToken) {
    const cookieToken = cookies().get('dash')?.value;
    if (cookieToken !== requiredToken) {
      const qp = new URLSearchParams();
      if (clientId) qp.set('client', clientId);
      if (from) qp.set('from', from);
      if (to) qp.set('to', to);
      const redirectTo = qp.toString() ? `/dashboard?${qp.toString()}` : '/dashboard';
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
  if(!clientId) {
    return (
      <DashboardShell sidebar={
        <div className="space-y-2">
          <div className="text-xs uppercase tracking-wide text-[var(--text-muted)] mb-2">Navigation</div>
          <a href="/dashboard" className="block px-3 py-2 rounded bg-black/5 font-medium">Overview</a>
        </div>
      }>
        <div className="max-w-6xl mx-auto space-y-6">
          <div>
            <h1 className="text-2xl font-bold mb-2 text-[var(--text-primary)]">Dashboard</h1>
            <p className="text-[var(--text-muted)] mb-6">Set NEXT_PUBLIC_DASHBOARD_CLIENT_ID in your environment to view data.</p>
          </div>
          
        </div>
      </DashboardShell>
    );
  }

  const { trends, recent, responseRate } = await getData(clientId, period !== 'all' ? period : undefined, mode);
  const hierarchyData = await getHierarchyData(clientId, divisionId, departmentId, teamId, selectedDepartments, period !== 'all' ? period : undefined, mode);
  
  // Fetch org structure for filter
  const { data: divisions } = await supabaseAdmin
    .from('divisions')
    .select('division_id, division_name')
    .eq('client_id', clientId)
    .eq('active', true)
    .order('division_name');
  
  const { data: departmentsData } = await supabaseAdmin
    .from('departments')
    .select(`
      department_id,
      department_name,
      division_id,
      divisions!inner(client_id)
    `)
    .eq('divisions.client_id', clientId)
    .eq('active', true)
    .order('department_name');

  const departments = (departmentsData ?? []).map(dept => ({
    department_id: dept.department_id,
    department_name: dept.department_name,
    division_id: dept.division_id
  }));
  
  const { data: teamsData } = await supabaseAdmin
    .from('teams')
    .select(`
      team_id,
      team_name,
      department_id,
      departments!inner(
        division_id,
        divisions!inner(client_id)
      )
    `)
    .eq('departments.divisions.client_id', clientId)
    .eq('active', true)
    .order('team_name');

  const teams = (teamsData ?? []).map(team => ({
    team_id: team.team_id,
    team_name: team.team_name,
    department_id: team.department_id
  }));

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
  const delta = (k:keyof WellbeingRow)=>{
    const a = last(k), b = prev(k); if(a===undefined||b===undefined) return undefined; return Number((a-b).toFixed(2));
  };

  const Sidebar = (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="text-xs uppercase tracking-wide text-[var(--text-muted)] mb-2">Navigation</div>
        <a href="/dashboard" className="block px-3 py-2 rounded bg-black/5 font-medium">Overview</a>
        <a href="/dashboard/trends" className="block px-3 py-2 rounded hover:bg-black/5">Trends</a>
        <a href="/analytics" className="block px-3 py-2 rounded hover:bg-black/5">Advanced Analytics</a>
        <a href="/methodology" className="block px-3 py-2 rounded hover:bg-black/5">Methodology</a>
      </div>
      
      {/* Compact QR Code Generator in Sidebar */}
      <div className="pt-4 border-t border-black/10">
        <DemoQRCode clientId={clientId} compact={true} />
      </div>
    </div>
  );

  const periodLabel = period === 'week' ? 'Last Week' : period === 'month' ? 'Last Month' : period === 'quarter' ? 'Last Quarter' : 'All Time';
  const reportDate = new Date().toLocaleDateString('en-AU', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <DashboardShell sidebar={Sidebar}>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Print Header - Only visible when printing */}
        <div className="hidden print:block mb-6 pb-4 border-b-2 border-[var(--navy)]">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-[var(--navy)] mb-2">Beacon Wellbeing Report</h1>
              <div className="text-sm text-[var(--text-muted)] space-y-1">
                <p><strong>Client ID:</strong> {clientId}</p>
                <p><strong>Report Period:</strong> {periodLabel}</p>
                <p><strong>Generated:</strong> {reportDate}</p>
              </div>
            </div>
            <div className="text-right text-xs text-[var(--text-muted)]">
              <p>Psychosocial Safety Assessment</p>
              <p>Confidential</p>
            </div>
          </div>
        </div>

        <div className="print:hidden">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">Executive Wellbeing Dashboard</h1>
              <p className="text-sm text-[var(--text-muted)]">
                Whole of business | Last updated: {reportDate} | {responseRate.responded} responses out of {responseRate.total} team members ({Math.round((responseRate.responded / responseRate.total) * 100)}% response rate)
              </p>
            </div>
            {/* Data Mode Toggle */}
            <DataModeToggleClient 
              currentMode={mode}
              clientId={clientId}
              period={period}
              divisionId={divisionId}
              departmentId={departmentId}
              teamId={teamId}
            />
          </div>
          
          <div className="mt-3 flex items-center gap-3 flex-wrap print:hidden">
            {/* Filter Controls */}
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
            
            <div className="border-l h-6"></div>
            
            <TimePeriodFilter
              clientId={clientId}
              currentPeriod={period}
              mode={mode}
              divisionId={divisionId}
              departmentId={departmentId}
              teamId={teamId}
            />
            
            <div className="border-l h-6"></div>
            
            <PrintButton />
            <form action={`/api/download`} method="get" className="flex items-center gap-2">
              <input type="hidden" name="client_id" value={clientId} />
              <Button type="submit" variant="outline" size="sm" disabled={recent.length === 0}>Download CSV</Button>
            </form>
            {process.env.ADMIN_DASH_TOKEN && (
              <>
                <SetupHierarchyButton clientId={clientId} />
                <GenerateDemoDataButton 
                  clientId={clientId} 
                  endpoint="seed" 
                  label="Generate Demo Data" 
                />
                <GenerateDemoDataButton 
                  clientId={clientId} 
                  endpoint="seed-with-departments" 
                  label="Generate 100 Demo Records" 
                />
              </>
            )}
          </div>
        </div>

        {/* Top Quote Banner */}
        <QuoteBanner position="top" />

        {/* Demo Dashboard - Show when no real data */}
        {recent.length === 0 && (
          <DemoDashboardClient />
        )}

        {/* Status Cards */}
        <StatusCards 
          sentiment={last('sentiment_avg')}
          workload={last('workload_avg')}
          safety={last('safety_avg')}
          clarity={last('clarity_avg')}
        />

        {/* Overall Score and Psychological Safety - Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Overall Wellbeing Gauge */}
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

          {/* Psychological Safety Distribution */}
          <MoodDistribution responses={recent} />
        </div>

        {/* Team Status */}
        <TeamStatus responses={recent} />

        {/* Teams Attention Chart */}
        <TeamsAttentionChartWrapper 
          teams={hierarchyData.data.map((d: any) => ({
            name: d.name,
            score: d.wellbeing_score || 0,
            id: d.id
          }))}
          clientId={clientId}
          period={period}
          currentLevel={hierarchyData.currentLevel}
          divisionId={divisionId}
          departmentId={departmentId}
        />

        {/* Key Insights */}
        <ExecutiveSummary trends={trends} hierarchyData={hierarchyData} />

        {/* Bottom Quote Banner */}
        <QuoteBanner position="bottom" />

        <Card>
          <CardHeader>
            <CardTitle>
              {hierarchyData.currentLevel === 'team' ? 'Recent Responses' : 
               hierarchyData.currentLevel === 'department' ? 'Teams' :
               hierarchyData.currentLevel === 'division' ? 'Departments' : 
               'Divisions'}
            </CardTitle>
            {(divisionId || departmentId || teamId) && (
              <div className="text-sm text-muted-foreground mt-1">
                <a href={`/dashboard?client=${clientId}&period=${period}`} className="text-primary hover:underline">← Back to top level</a>
              </div>
            )}
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{hierarchyData.currentLevel === 'team' ? 'Submitted' : (hierarchyData.nextLevel || 'Name').replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</TableHead>
                    {hierarchyData.currentLevel !== 'team' && <TableHead>Overall Wellbeing</TableHead>}
                    <TableHead>Sentiment</TableHead>
                    <TableHead>Clarity</TableHead>
                    <TableHead>Workload</TableHead>
                    <TableHead>Safety</TableHead>
                    <TableHead>Leadership</TableHead>
                    {hierarchyData.currentLevel !== 'team' && <TableHead>Responses</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {hierarchyData.currentLevel === 'team' ? (
                    // Show individual responses at project level
                    hierarchyData.data.map((r:any, i:number)=> {
                      const isHighRisk = (val:number) => val <= 2; // 40% or below
                      return (
                        <TableRow key={i}>
                          <TableCell className="font-medium">{new Date(r.submitted_at).toLocaleDateString()}</TableCell>
                          <TableCell>
                            {isHighRisk(r.sentiment_5) ? (
                              <Badge variant="destructive">{r.sentiment_5}</Badge>
                            ) : (
                              <span className="text-sm">{r.sentiment_5}</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {isHighRisk(r.clarity_5) ? (
                              <Badge variant="destructive">{r.clarity_5}</Badge>
                            ) : (
                              <span className="text-sm">{r.clarity_5}</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {isHighRisk(r.workload_5) ? (
                              <Badge variant="destructive">{r.workload_5}</Badge>
                            ) : (
                              <span className="text-sm">{r.workload_5}</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {isHighRisk(r.safety_5) ? (
                              <Badge variant="destructive">{r.safety_5}</Badge>
                            ) : (
                              <span className="text-sm">{r.safety_5}</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {isHighRisk(r.leadership_5) ? (
                              <Badge variant="destructive">{r.leadership_5}</Badge>
                            ) : (
                              <span className="text-sm">{r.leadership_5}</span>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    // Show aggregated data by hierarchy level
                    hierarchyData.data.map((agg:any, i:number)=> {
                      const isHighRisk = (val:number) => val < 60; // Below 60% is high risk
                      
                      // Build drill-down URL
                      let drillDownUrl = `/dashboard?client=${clientId}&period=${period}`;
                      if (hierarchyData.nextLevel === 'department') {
                        drillDownUrl += `&division_id=${encodeURIComponent(agg.id)}`;
                      } else if (hierarchyData.nextLevel === 'team') {
                        drillDownUrl += `&division_id=${encodeURIComponent(divisionId!)}&department_id=${encodeURIComponent(agg.id)}`;
                      }
                      
                      return (
                        <TableRow key={i} className="hover:bg-muted/50">
                          <TableCell className="font-medium">
                            <a href={drillDownUrl} className="text-primary hover:underline">{agg.name}</a>
                          </TableCell>
                          <TableCell>
                            {isHighRisk(agg.wellbeing_score) ? (
                              <Badge variant="destructive" className="font-bold">
                                {agg.wellbeing_score.toFixed(0)}%
                              </Badge>
                            ) : (
                              <span className="text-sm font-semibold">{agg.wellbeing_score.toFixed(0)}%</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {isHighRisk(agg.sentiment_avg * 20) ? (
                              <Badge variant="destructive">{(agg.sentiment_avg * 20).toFixed(0)}%</Badge>
                            ) : (
                              <span className="text-sm">{(agg.sentiment_avg * 20).toFixed(0)}%</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {isHighRisk(agg.clarity_avg * 20) ? (
                              <Badge variant="destructive">{(agg.clarity_avg * 20).toFixed(0)}%</Badge>
                            ) : (
                              <span className="text-sm">{(agg.clarity_avg * 20).toFixed(0)}%</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {isHighRisk(agg.workload_avg * 20) ? (
                              <Badge variant="destructive">{(agg.workload_avg * 20).toFixed(0)}%</Badge>
                            ) : (
                              <span className="text-sm">{(agg.workload_avg * 20).toFixed(0)}%</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {isHighRisk(agg.safety_avg * 20) ? (
                              <Badge variant="destructive">{(agg.safety_avg * 20).toFixed(0)}%</Badge>
                            ) : (
                              <span className="text-sm">{(agg.safety_avg * 20).toFixed(0)}%</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {isHighRisk(agg.leadership_avg * 20) ? (
                              <Badge variant="destructive">{(agg.leadership_avg * 20).toFixed(0)}%</Badge>
                            ) : (
                              <span className="text-sm">{(agg.leadership_avg * 20).toFixed(0)}%</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right text-muted-foreground text-sm">{agg.response_count}</TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}