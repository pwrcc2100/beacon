export const dynamic = 'force-dynamic';
export const revalidate = 0;
import { cookies } from 'next/headers';
import { supabaseAdmin } from '@/lib/supabase';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { PrintButton } from '@/components/ui/PrintButton';
import { Button } from '@/components/ui/button';
import { EnhancedOrganisationFilterClient } from '@/components/dashboard/EnhancedOrganisationFilterClient';
import { TimePeriodFilter } from '@/components/dashboard/TimePeriodFilter';
import { DataModeToggleClient } from './DataModeToggleClient';
import nextDynamic from 'next/dynamic';
import { DemoQRCode } from '@/components/dashboard/DemoQRCode';
import { getPeriodStartDate } from '@/lib/dateUtils';
import DemoDashboardClient from './DemoDashboardClient';
import ExecutiveOverviewOptionA from '@/components/dashboard/ExecutiveOverview-OptionA';
import { generateExecutiveInsights } from '@/lib/executiveInsights';
import { calculateWellbeingPercent } from '@/components/dashboard/scoreTheme';

const AdminTools = nextDynamic(() => import('@/components/dashboard/AdminTools').then(m => ({ default: m.AdminTools })), { ssr: false });

type WellbeingRow = {
  wk: string;
  sentiment_avg: number;
  clarity_avg: number;
  workload_avg: number;
  safety_avg: number;
  leadership_avg: number;
};

type ResponseRow = {
  submitted_at: string;
  employee_id: string | null;
  sentiment_5: number | null;
  clarity_5: number | null;
  workload_5: number | null;
  safety_5: number | null;
  leadership_5: number | null;
  employees: {
    division_id: string | null;
    department_id: string | null;
    team_id: string | null;
  } | null;
};

type OrgFilter = {
  divisionId?: string;
  departmentId?: string;
  teamId?: string;
  selectedDepartments?: string[];
};

function applyResponseFilters<T extends { employees?: any }>(query: any, { divisionId, departmentId, teamId, selectedDepartments }: OrgFilter) {
  if (teamId) {
    return query.eq('employees.team_id', teamId);
  }
  if (selectedDepartments && selectedDepartments.length > 0) {
    return query.in('employees.department_id', selectedDepartments);
  }
  if (departmentId) {
    return query.eq('employees.department_id', departmentId);
  }
  if (divisionId) {
    return query.eq('employees.division_id', divisionId);
  }
  return query;
}

function applyEmployeeFilters(query: any, { divisionId, departmentId, teamId, selectedDepartments }: OrgFilter) {
  if (teamId) {
    return query.eq('team_id', teamId);
  }
  if (selectedDepartments && selectedDepartments.length > 0) {
    return query.in('department_id', selectedDepartments);
  }
  if (departmentId) {
    return query.eq('department_id', departmentId);
  }
  if (divisionId) {
    return query.eq('division_id', divisionId);
  }
  return query;
}

async function getData(
  clientId: string,
  {
    period,
    mode,
    divisionId,
    departmentId,
    teamId,
    selectedDepartments,
  }: {
    period?: string;
    mode?: 'historical' | 'live';
    divisionId?: string;
    departmentId?: string;
    teamId?: string;
    selectedDepartments?: string[];
  }
) {
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

  const baseSelect = `
    submitted_at,
    employee_id,
    sentiment_5,
    clarity_5,
    workload_5,
    safety_5,
    leadership_5,
    employees!inner(
      division_id,
      department_id,
      team_id
    )
  `;

  let responsesQuery = supabaseAdmin
    .from('responses_v3')
    .select(baseSelect)
    .eq('client_id', clientId)
    .order('submitted_at', { ascending: true });
  
  if (startDate) {
    responsesQuery = responsesQuery.gte('submitted_at', startDate.toISOString());
  }

  responsesQuery = applyResponseFilters(responsesQuery, { divisionId, departmentId, teamId, selectedDepartments });

  const { data: responses } = await responsesQuery;

  const normalizedResponses: ResponseRow[] = (responses ?? []).map((r: any) => {
    const employee = Array.isArray(r.employees) ? r.employees[0] : r.employees;
    return {
      submitted_at: r.submitted_at as string,
      employee_id: r.employee_id ?? null,
      sentiment_5: r.sentiment_5 ?? null,
      clarity_5: r.clarity_5 ?? null,
      workload_5: r.workload_5 ?? null,
      safety_5: r.safety_5 ?? null,
      leadership_5: r.leadership_5 ?? null,
      employees: employee
        ? {
            division_id: employee.division_id ?? null,
            department_id: employee.department_id ?? null,
            team_id: employee.team_id ?? null,
          }
        : {
            division_id: null,
            department_id: null,
            team_id: null,
          },
    };
  });

  const trends = (() => {
    if (!normalizedResponses.length) return [] as WellbeingRow[];
    const byWeek: Record<string, { n:number; s:number; c:number; w:number; sa:number; l:number }> = {};
    for (const r of normalizedResponses) {
      const submittedAt = r.submitted_at;
      if (!submittedAt) continue;
      const d = new Date(submittedAt);
      const day = d.getUTCDay() || 7;
      const monday = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() - (day - 1)));
      const key = monday.toISOString().slice(0, 10);
      if (!byWeek[key]) {
        byWeek[key] = { n: 0, s: 0, c: 0, w: 0, sa: 0, l: 0 };
      }
      const bucket = byWeek[key];
      bucket.n += 1;
      bucket.s += Number(r.sentiment_5 || 0);
      bucket.c += Number(r.clarity_5 || 0);
      bucket.w += Number(r.workload_5 || 0);
      bucket.sa += Number(r.safety_5 || 0);
      bucket.l += Number(r.leadership_5 || 0);
    }
    return Object.keys(byWeek)
      .sort()
      .map((key) => {
        const bucket = byWeek[key];
        return {
          wk: new Date(key + 'T00:00:00.000Z').toISOString(),
          sentiment_avg: bucket.s / bucket.n,
          clarity_avg: bucket.c / bucket.n,
          workload_avg: bucket.w / bucket.n,
          safety_avg: bucket.sa / bucket.n,
          leadership_avg: bucket.l / bucket.n,
        };
      });
  })();

  const recent = normalizedResponses.slice(-20).reverse();

  const uniqueResponders = (() => {
    if (!normalizedResponses.length) return 0;
    const ids = new Set<string>();
    for (const r of normalizedResponses) {
      if (r.employee_id) {
        ids.add(r.employee_id);
      }
    }
    return ids.size;
  })();

  let employeeCountQuery = supabaseAdmin
    .from('employees')
    .select('id', { count: 'exact', head: true })
    .eq('client_id', clientId)
    .eq('active', true);
  
  employeeCountQuery = applyEmployeeFilters(employeeCountQuery, { divisionId, departmentId, teamId, selectedDepartments });

  const { count: employeesTotal } = await employeeCountQuery;

  return {
    trends: trends as WellbeingRow[],
    recent: recent as ResponseRow[],
    responseRate: {
      responded: uniqueResponders,
      total: employeesTotal ?? uniqueResponders
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
        wellbeing_score:
          (
            (agg.sentiment_sum / agg.count) * 0.25 +
            (agg.workload_sum / agg.count) * 0.25 +
            (agg.leadership_sum / agg.count) * 0.20 +
            (agg.safety_sum / agg.count) * 0.20 +
            (agg.clarity_sum / agg.count) * 0.10
          ) * 20
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
        wellbeing_score:
          (
            (agg.sentiment_sum / agg.count) * 0.25 +
            (agg.workload_sum / agg.count) * 0.25 +
            (agg.leadership_sum / agg.count) * 0.20 +
            (agg.safety_sum / agg.count) * 0.20 +
            (agg.clarity_sum / agg.count) * 0.10
          ) * 20
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
        wellbeing_score:
          (
            (agg.sentiment_sum / agg.count) * 0.25 +
            (agg.workload_sum / agg.count) * 0.25 +
            (agg.leadership_sum / agg.count) * 0.20 +
            (agg.safety_sum / agg.count) * 0.20 +
            (agg.clarity_sum / agg.count) * 0.10
          ) * 20
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
    
    if (!divisions || divisions.length === 0) {
      return { data: [], currentLevel, nextLevel, hierarchyLevels: ['division', 'department', 'team'] };
    }
    
    const divisionIds = divisions.map(d => d.division_id);
    
    // Get employee counts for each division
    const { data: employeeCounts } = await supabaseAdmin
      .from('employees')
      .select('division_id')
      .eq('client_id', clientId)
      .in('division_id', divisionIds)
      .eq('active', true);
    
    const employeeCountByDivision: Record<string, number> = {};
    (employeeCounts || []).forEach((emp: any) => {
      employeeCountByDivision[emp.division_id] = (employeeCountByDivision[emp.division_id] || 0) + 1;
    });
    
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
        leadership_sum: 0,
        total_employees: employeeCountByDivision[div.division_id] || 0
      };
    });
    
    (responses || []).forEach((r: any) => {
      const divId = r.employees?.division_id;
      if (divId && aggregates[divId]) {
        aggregates[divId].count += 1;
        aggregates[divId].sentiment_sum += r.sentiment_5 || 0;
        aggregates[divId].clarity_sum += r.clarity_5 || 0;
        aggregates[divId].workload_sum += r.workload_5 || 0;
        aggregates[divId].safety_sum += r.safety_5 || 0;
        aggregates[divId].leadership_sum += r.leadership_5 || 0;
      }
    });
    
    const data = Object.values(aggregates)
      .filter((agg: any) => agg.count > 0)
      .map((agg: any) => ({
        id: agg.id,
        name: agg.name,
        response_count: agg.count,
        total_employees: agg.total_employees,
        sentiment_avg: agg.sentiment_sum / agg.count,
        clarity_avg: agg.clarity_sum / agg.count,
        workload_avg: agg.workload_sum / agg.count,
        safety_avg: agg.safety_sum / agg.count,
        leadership_avg: agg.leadership_sum / agg.count,
        wellbeing_score:
          (
            (agg.sentiment_sum / agg.count) * 0.25 +
            (agg.workload_sum / agg.count) * 0.25 +
            (agg.leadership_sum / agg.count) * 0.20 +
            (agg.safety_sum / agg.count) * 0.20 +
            (agg.clarity_sum / agg.count) * 0.10
          ) * 20
      }));
    
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
          <a href="/dashboard/dash-login" className="text-primary hover:underline text-sm">Admin Login</a>
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

  const { trends, recent, responseRate } = await getData(clientId, {
    period: period !== 'all' ? period : undefined,
    mode,
    divisionId,
    departmentId,
    teamId,
    selectedDepartments,
  });
  const hierarchyData = await getHierarchyData(clientId, divisionId, departmentId, teamId, selectedDepartments, period !== 'all' ? period : undefined, mode);
  
  // Fetch org structure for filter
  const { data: divisionsRaw } = await supabaseAdmin
    .from('divisions')
    .select('division_id, division_name')
    .eq('client_id', clientId)
    .eq('active', true)
    .order('division_name');
  
  const divisions = (divisionsRaw ?? []).map(div => ({
    division_id: div.division_id,
    division_name: div.division_name,
  }));

  const divisionLookup = new Map(divisions.map(div => [div.division_id, div.division_name]));

  const { data: departmentsData } = await supabaseAdmin
    .from('departments')
    .select(`
      department_id,
      department_name,
      division_id,
      divisions!inner(division_name, client_id)
    `)
    .eq('divisions.client_id', clientId)
    .eq('active', true)
    .order('department_name');

  const departments = (departmentsData ?? []).map(dept => {
    const divisionRel = Array.isArray(dept.divisions) ? dept.divisions[0] : dept.divisions;
    const divisionName = divisionRel?.division_name ?? divisionLookup.get(dept.division_id) ?? '';
    return {
      department_id: dept.department_id,
      department_name: dept.department_name,
      division_id: dept.division_id,
      division_name: divisionName,
      display_name: divisionName ? `${dept.department_name} · ${divisionName}` : dept.department_name,
    };
  });

  const departmentLookup = new Map(departments.map(dept => [dept.department_id, dept]));

  const { data: teamsData } = await supabaseAdmin
    .from('teams')
    .select(`
      team_id,
      team_name,
      department_id,
      departments!inner(
        department_name,
        division_id,
        divisions!inner(division_name, client_id)
      )
    `)
    .eq('departments.divisions.client_id', clientId)
    .eq('active', true)
    .order('team_name');

  const teams = (teamsData ?? []).map(team => {
    const departmentRel = Array.isArray(team.departments) ? team.departments[0] : team.departments;
    const divisionRelRaw = departmentRel?.divisions;
    const divisionRel = Array.isArray(divisionRelRaw) ? divisionRelRaw[0] : divisionRelRaw;
    const department = departmentLookup.get(team.department_id);
    const departmentName = department?.department_name ?? departmentRel?.department_name ?? '';
    const divisionId = department?.division_id ?? departmentRel?.division_id ?? '';
    const divisionName = department?.division_name
      ?? (divisionRel && typeof divisionRel.division_name === 'string' ? divisionRel.division_name : undefined)
      ?? divisionLookup.get(divisionId)
      ?? '';

    return {
      team_id: team.team_id,
      team_name: team.team_name,
      department_id: team.department_id,
      department_name: departmentName,
      division_id: divisionId,
      division_name: divisionName,
      display_name: departmentName && divisionName
        ? `${team.team_name} · ${departmentName} / ${divisionName}`
        : team.team_name,
    };
  });

  const startDateForFilters = (() => {
    if (mode === 'live') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return today;
    }
    if (period && period !== 'all') {
      return getPeriodStartDate(period);
    }
    return undefined;
  })();

  const latestRow = trends.length ? trends[trends.length - 1] : undefined;
  const previousRow = trends.length > 1 ? trends[trends.length - 2] : undefined;

  const trendSeries = trends.map(t => ({
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

  const overallScore = latestRow
    ? calculateWellbeingPercent({
        sentiment: latestRow.sentiment_avg,
        workload: latestRow.workload_avg,
        safety: latestRow.safety_avg,
        leadership: latestRow.leadership_avg,
        clarity: latestRow.clarity_avg,
      })
    : undefined;

  const previousScore = previousRow
    ? calculateWellbeingPercent({
        sentiment: previousRow.sentiment_avg,
        workload: previousRow.workload_avg,
        safety: previousRow.safety_avg,
        leadership: previousRow.leadership_avg,
        clarity: previousRow.clarity_avg,
      })
    : undefined;

  const participationPercent = responseRate.total > 0
    ? (responseRate.responded / responseRate.total) * 100
    : 0;

  const tableData = hierarchyData.currentLevel === 'team' ? [] : (hierarchyData.data ?? []);
  const tableTitle = hierarchyData.currentLevel === 'division'
    ? 'Departments'
    : hierarchyData.currentLevel === 'department'
    ? 'Teams'
    : 'Divisions';

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

  const departmentsById = new Map(departments.map(dept => [dept.department_id, dept]));
  const divisionsById = new Map((divisions ?? []).map(div => [div.division_id, div]));

  let attentionTeams: {
    id: string;
    name: string;
    displayName?: string;
    divisionName?: string;
    departmentName?: string;
    wellbeing: number;
  }[] = [];
  
  console.log('🔍 TEAM DEBUG - eligibleTeams:', eligibleTeams.length, '| totalTeams:', teams.length);
  
  if (eligibleTeams.length > 0) {
    const teamIds = eligibleTeams.map(team => team.team_id);

    console.log('📋 Querying for employees in', teamIds.length, 'teams');

    // Step 1: Ensure there are active employees in these teams
    const { data: teamEmployees } = await supabaseAdmin
      .from('employees')
      .select('id')
      .eq('client_id', clientId)
      .in('team_id', teamIds)
      .eq('active', true)
      .limit(1);

    console.log('👥 Found', teamEmployees?.length || 0, 'employees in teams (sample check)');

    if (!teamEmployees || teamEmployees.length === 0) {
      console.log('❌ NO EMPLOYEES FOUND - attentionTeams will be empty');
      attentionTeams = [];
    } else {
      // Step 2: Get responses for these teams via server-side join
      let responsesQuery = supabaseAdmin
        .from('responses_v3')
        .select('sentiment_5, clarity_5, workload_5, safety_5, leadership_5, employee_id, employees!inner(team_id)')
        .eq('client_id', clientId)
        .in('employees.team_id', teamIds);

      if (startDateForFilters) {
        responsesQuery = responsesQuery.gte('submitted_at', startDateForFilters.toISOString());
      }

      const { data: teamResponses } = await responsesQuery.limit(10000);

      console.log('📊 Found', teamResponses?.length || 0, 'responses for those employees');
      
      if (teamResponses && teamResponses.length > 0) {
        console.log('Sample response employee_ids:', teamResponses.slice(0, 3).map((r: any) => r.employee_id));
        console.log('Sample response team_ids:', teamResponses.slice(0, 3).map((r: any) => r.employees?.team_id));
      }

      // Step 3: Aggregate by team
      const aggregates: Record<string, {
        count: number;
        sentiment: number;
        clarity: number;
        workload: number;
        safety: number;
        leadership: number;
      }> = {};

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
          const suffixParts: string[] = [];
          if (division?.division_name) suffixParts.push(division.division_name);
          if (dept?.department_name) suffixParts.push(dept.department_name);

          return {
            id,
            name: baseName,
            displayName: suffixParts.length ? `${baseName} · ${suffixParts.join(' / ')}` : baseName,
            divisionName: division?.division_name,
            departmentName: dept?.department_name,
            wellbeing:
              ((agg.sentiment / agg.count) * 0.25 +
                (agg.workload / agg.count) * 0.25 +
                (agg.safety / agg.count) * 0.2 +
                (agg.leadership / agg.count) * 0.2 +
                (agg.clarity / agg.count) * 0.1) * 20,
          };
        });
      
      console.log('✅ attentionTeams calculated:', attentionTeams.length, 'teams with data');
    }
  }
  
  const demoAttentionTeams = getDemoAttentionTeams();
  if (demoAttentionTeams.length > 0) {
    attentionTeams = demoAttentionTeams;
  }
  
  console.log('🎯 FINAL attentionTeams count:', attentionTeams.length);

  const executiveInsights = generateExecutiveInsights(trends, {
    data: tableData,
    currentLevel: hierarchyData.currentLevel,
  });

  const Sidebar = (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="text-xs uppercase tracking-wide text-[var(--text-muted)] mb-2">Navigation</div>
        <a href="/dashboard" className="block px-3 py-2 rounded bg-black/5 font-medium">Overview</a>
        <a href="/dashboard/trends" className="block px-3 py-2 rounded hover:bg-black/5">Trends</a>
        <a href="/dashboard/group-leader" className="block px-3 py-2 rounded hover:bg-black/5">Group Leader View</a>
        <a href="/analytics" className="block px-3 py-2 rounded hover:bg-black/5">Advanced Analytics</a>
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
      
      {/* Admin Tools & QR Code Generator */}
      <div className="pt-4 border-t border-black/10">
        <AdminTools clientId={clientId} />
        <div className="mt-4">
          <DemoQRCode clientId={clientId} compact={true} />
        </div>
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
              <h1 className="text-3xl font-bold text-[var(--navy)] mb-2">Beacon Index Report</h1>
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
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">Beacon Index Dashboard</h1>
              <p className="text-sm text-[var(--text-muted)]">
                Whole of business | Last updated: {reportDate} | {responseRate.responded} responses out of {responseRate.total} team members ({Math.round(participationPercent)}% response rate)
              </p>
            </div>
          </div>
        </div>

        {trends.length === 0 && recent.length === 0 ? (
          <DemoDashboardClient />
        ) : (
          <ExecutiveOverviewOptionA
            overallScore={overallScore}
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
        )}

        <section className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm p-6 space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-[var(--text-primary)]">New Client Onboarding Checklist</h2>
            <p className="text-sm text-[var(--text-muted)]">
              Use this intake workflow with prospective clients to capture every configuration detail before go-live. It
              mirrors the admin onboarding form so you can demo the process directly from this dashboard.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-[var(--text-primary)]">
            <ul className="space-y-2 list-disc list-inside">
              <li>Company &amp; primary contact information</li>
              <li>Integrations/API credentials (HRIS, identity, payroll)</li>
              <li>Hierarchy upload (divisions → departments → teams → employees)</li>
              <li>Branding assets, colours, and logo placements</li>
              <li>Dashboard modules &amp; customised survey questions</li>
            </ul>
            <ul className="space-y-2 list-disc list-inside">
              <li>Survey cadence, reminder schedule, and reporting recipients</li>
              <li>High-risk support workflow approvals</li>
              <li>Compliance notes &amp; data-retention expectations</li>
              <li>ISO 27001 alignment confidence: Beacon’s controls map to Annex A; we extend them to bespoke integrations using the form below.</li>
              <li>Optional attachments for brand kits or legacy survey mappings</li>
            </ul>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <a href="/admin/onboarding" target="_blank" rel="noopener noreferrer">
                Open onboarding intake form
              </a>
            </Button>
            <Button asChild variant="outline">
              <a href="/templates/hierarchy-template.csv" download>
                Download hierarchy template
              </a>
            </Button>
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}

function getDemoAttentionTeams() {
  return [
    { id: 'demo-a', name: 'Team A', displayName: 'Team A', divisionName: 'Sydney Metro', departmentName: 'Education', wellbeing: 25 },
    { id: 'demo-b', name: 'Team B', displayName: 'Team B', divisionName: 'Sydney Metro', departmentName: 'Residential', wellbeing: 31 },
    { id: 'demo-c', name: 'Team C', displayName: 'Team C', divisionName: 'Regional', departmentName: 'Education', wellbeing: 37 },
    { id: 'demo-d', name: 'Team D', displayName: 'Team D', divisionName: 'Regional', departmentName: 'Health', wellbeing: 44 },
    { id: 'demo-e', name: 'Team E', displayName: 'Team E', divisionName: 'Regional', departmentName: 'Residential', wellbeing: 52 },
    { id: 'demo-f', name: 'Team F', displayName: 'Team F', divisionName: 'QLD', departmentName: 'Health', wellbeing: 58 },
    { id: 'demo-g', name: 'Team G', displayName: 'Team G', divisionName: 'QLD', departmentName: 'Residential', wellbeing: 62 },
    { id: 'demo-h', name: 'Team H', displayName: 'Team H', divisionName: 'QLD', departmentName: 'Education', wellbeing: 68 },
    { id: 'demo-i', name: 'Team I', displayName: 'Team I', divisionName: 'Sydney Metro', departmentName: 'Health', wellbeing: 72 },
    { id: 'demo-j', name: 'Team J', displayName: 'Team J', divisionName: 'Sydney Metro', departmentName: 'Corporate', wellbeing: 78 },
    { id: 'demo-k', name: 'Team K', displayName: 'Team K', divisionName: 'Regional', departmentName: 'Corporate', wellbeing: 84 },
    { id: 'demo-l', name: 'Team L', displayName: 'Team L', divisionName: 'QLD', departmentName: 'Innovation', wellbeing: 90 },
  ];
}