/**
 * Shared dashboard data fetching for /dashboard and /dashboard/v2.
 */
import { supabaseAdmin } from '@/lib/supabase';
import { getPeriodStartDate } from '@/lib/dateUtils';

export type WellbeingRow = {
  wk: string;
  sentiment_avg: number;
  clarity_avg: number;
  workload_avg: number;
  safety_avg: number;
  leadership_avg: number;
};

export type ResponseRow = {
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

export type OrgFilter = {
  divisionId?: string;
  departmentId?: string;
  teamId?: string;
  selectedDepartments?: string[];
};

function applyResponseFilters<T extends { employees?: any }>(
  query: any,
  { divisionId, departmentId, teamId, selectedDepartments }: OrgFilter
) {
  if (teamId) return query.eq('employees.team_id', teamId);
  if (selectedDepartments?.length) return query.in('employees.department_id', selectedDepartments);
  if (departmentId) return query.eq('employees.department_id', departmentId);
  if (divisionId) return query.eq('employees.division_id', divisionId);
  return query;
}

function applyEmployeeFilters(
  query: any,
  { divisionId, departmentId, teamId, selectedDepartments }: OrgFilter
) {
  if (teamId) return query.eq('team_id', teamId);
  if (selectedDepartments?.length) return query.in('department_id', selectedDepartments);
  if (departmentId) return query.eq('department_id', departmentId);
  if (divisionId) return query.eq('division_id', divisionId);
  return query;
}

export async function getData(
  clientId: string,
  opts: {
    period?: string;
    mode?: 'historical' | 'live';
    divisionId?: string;
    departmentId?: string;
    teamId?: string;
    selectedDepartments?: string[];
  }
) {
  let startDate: Date | undefined;
  if (opts.mode === 'live') {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    startDate = today;
  } else {
    startDate = opts.period ? getPeriodStartDate(opts.period) : undefined;
  }

  const baseSelect = `
    submitted_at, employee_id, sentiment_5, clarity_5, workload_5, safety_5, leadership_5,
    employees!inner(division_id, department_id, team_id)
  `;
  let responsesQuery = supabaseAdmin
    .from('responses_v3')
    .select(baseSelect)
    .eq('client_id', clientId)
    .order('submitted_at', { ascending: true });
  if (startDate) responsesQuery = responsesQuery.gte('submitted_at', startDate.toISOString());
  responsesQuery = applyResponseFilters(responsesQuery, opts);

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
        ? { division_id: employee.division_id ?? null, department_id: employee.department_id ?? null, team_id: employee.team_id ?? null }
        : { division_id: null, department_id: null, team_id: null },
    };
  });

  const trends: WellbeingRow[] = (() => {
    if (!normalizedResponses.length) return [];
    const byWeek: Record<string, { n: number; s: number; c: number; w: number; sa: number; l: number }> = {};
    for (const r of normalizedResponses) {
      const submittedAt = r.submitted_at;
      if (!submittedAt) continue;
      const d = new Date(submittedAt);
      const day = d.getUTCDay() || 7;
      const monday = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() - (day - 1)));
      const key = monday.toISOString().slice(0, 10);
      if (!byWeek[key]) byWeek[key] = { n: 0, s: 0, c: 0, w: 0, sa: 0, l: 0 };
      const b = byWeek[key];
      b.n += 1;
      b.s += Number(r.sentiment_5 || 0);
      b.c += Number(r.clarity_5 || 0);
      b.w += Number(r.workload_5 || 0);
      b.sa += Number(r.safety_5 || 0);
      b.l += Number(r.leadership_5 || 0);
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
    const ids = new Set<string>();
    for (const r of normalizedResponses) {
      if (r.employee_id) ids.add(r.employee_id);
    }
    return ids.size;
  })();

  let employeeCountQuery = supabaseAdmin
    .from('employees')
    .select('id', { count: 'exact', head: true })
    .eq('client_id', clientId)
    .eq('active', true);
  employeeCountQuery = applyEmployeeFilters(employeeCountQuery, opts);
  const { count: employeesTotal } = await employeeCountQuery;

  return {
    trends,
    recent,
    responseRate: { responded: uniqueResponders, total: employeesTotal ?? uniqueResponders },
  };
}

export async function getHierarchyData(
  clientId: string,
  divisionId?: string,
  departmentId?: string,
  teamId?: string,
  selectedDepartments?: string[],
  period?: string,
  mode?: 'historical' | 'live'
) {
  let startDate: Date | undefined;
  if (mode === 'live') {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    startDate = today;
  } else {
    startDate = period ? getPeriodStartDate(period) : undefined;
  }

  const filter = { divisionId, departmentId, teamId, selectedDepartments };

  if (teamId) {
    let query = supabaseAdmin
      .from('responses_v3')
      .select('submitted_at, sentiment_5, clarity_5, workload_5, safety_5, leadership_5, employees!inner(team_id)')
      .eq('client_id', clientId)
      .eq('employees.team_id', teamId);
    if (startDate) query = query.gte('submitted_at', startDate.toISOString());
    const { data } = await query.order('submitted_at', { ascending: false }).limit(20);
    return { data: data || [], currentLevel: 'team' as const, nextLevel: null, hierarchyLevels: ['division', 'department', 'team'] as const };
  }

  if (selectedDepartments?.length) {
    const { data: selectedDepts } = await supabaseAdmin
      .from('departments')
      .select('department_id, department_name')
      .in('department_id', selectedDepartments)
      .eq('active', true);
    if (!selectedDepts?.length) return { data: [], currentLevel: 'department' as const, nextLevel: 'team' as const, hierarchyLevels: ['division', 'department', 'team'] as const };

    const { data: teams } = await supabaseAdmin
      .from('teams')
      .select('team_id, team_name, department_id')
      .in('department_id', selectedDepartments)
      .eq('active', true);

    let query = supabaseAdmin
      .from('responses_v3')
      .select('sentiment_5, clarity_5, workload_5, safety_5, leadership_5, employees!inner(department_id, team_id)')
      .eq('client_id', clientId)
      .in('employees.department_id', selectedDepartments);
    if (startDate) query = query.gte('submitted_at', startDate.toISOString());
    const { data: responses } = await query;

    const aggregates: Record<string, any> = {};
    selectedDepts.forEach((dept: any) => {
      aggregates[dept.department_id] = { id: dept.department_id, name: dept.department_name, count: 0, sentiment_sum: 0, clarity_sum: 0, workload_sum: 0, safety_sum: 0, leadership_sum: 0 };
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
        wellbeing_score: ((agg.sentiment_sum / agg.count) * 0.25 + (agg.workload_sum / agg.count) * 0.25 + (agg.leadership_sum / agg.count) * 0.2 + (agg.safety_sum / agg.count) * 0.2 + (agg.clarity_sum / agg.count) * 0.1) * 20,
      }));
    return { data, currentLevel: 'department' as const, nextLevel: 'team' as const, hierarchyLevels: ['division', 'department', 'team'] as const };
  }

  if (departmentId) {
    const { data: teams } = await supabaseAdmin.from('teams').select('team_id, team_name').eq('department_id', departmentId).eq('active', true);
    if (!teams?.length) return { data: [], currentLevel: 'department' as const, nextLevel: 'team' as const, hierarchyLevels: ['division', 'department', 'team'] as const };
    const teamIds = teams.map((t: any) => t.team_id);
    let query = supabaseAdmin
      .from('responses_v3')
      .select('sentiment_5, clarity_5, workload_5, safety_5, leadership_5, employees!inner(team_id)')
      .eq('client_id', clientId)
      .in('employees.team_id', teamIds);
    if (startDate) query = query.gte('submitted_at', startDate.toISOString());
    const { data: responses } = await query;
    const aggregates: Record<string, any> = {};
    teams.forEach((team: any) => {
      aggregates[team.team_id] = { id: team.team_id, name: team.team_name, count: 0, sentiment_sum: 0, clarity_sum: 0, workload_sum: 0, safety_sum: 0, leadership_sum: 0 };
    });
    (responses || []).forEach((r: any) => {
      const tid = r.employees?.team_id;
      if (tid && aggregates[tid]) {
        aggregates[tid].count += 1;
        aggregates[tid].sentiment_sum += r.sentiment_5 || 0;
        aggregates[tid].clarity_sum += r.clarity_5 || 0;
        aggregates[tid].workload_sum += r.workload_5 || 0;
        aggregates[tid].safety_sum += r.safety_5 || 0;
        aggregates[tid].leadership_sum += r.leadership_5 || 0;
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
        wellbeing_score: ((agg.sentiment_sum / agg.count) * 0.25 + (agg.workload_sum / agg.count) * 0.25 + (agg.leadership_sum / agg.count) * 0.2 + (agg.safety_sum / agg.count) * 0.2 + (agg.clarity_sum / agg.count) * 0.1) * 20,
      }));
    return { data, currentLevel: 'department' as const, nextLevel: 'team' as const, hierarchyLevels: ['division', 'department', 'team'] as const };
  }

  if (divisionId) {
    const { data: departments } = await supabaseAdmin.from('departments').select('department_id, department_name').eq('division_id', divisionId).eq('active', true);
    if (!departments?.length) return { data: [], currentLevel: 'division' as const, nextLevel: 'department' as const, hierarchyLevels: ['division', 'department', 'team'] as const };
    const deptIds = departments.map((d: any) => d.department_id);
    let query = supabaseAdmin
      .from('responses_v3')
      .select('sentiment_5, clarity_5, workload_5, safety_5, leadership_5, employees!inner(department_id)')
      .eq('client_id', clientId)
      .in('employees.department_id', deptIds);
    if (startDate) query = query.gte('submitted_at', startDate.toISOString());
    const { data: responses } = await query;
    const aggregates: Record<string, any> = {};
    departments.forEach((dept: any) => {
      aggregates[dept.department_id] = { id: dept.department_id, name: dept.department_name, count: 0, sentiment_sum: 0, clarity_sum: 0, workload_sum: 0, safety_sum: 0, leadership_sum: 0 };
    });
    (responses || []).forEach((r: any) => {
      const did = r.employees?.department_id;
      if (did && aggregates[did]) {
        aggregates[did].count += 1;
        aggregates[did].sentiment_sum += r.sentiment_5 || 0;
        aggregates[did].clarity_sum += r.clarity_5 || 0;
        aggregates[did].workload_sum += r.workload_5 || 0;
        aggregates[did].safety_sum += r.safety_5 || 0;
        aggregates[did].leadership_sum += r.leadership_5 || 0;
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
        wellbeing_score: ((agg.sentiment_sum / agg.count) * 0.25 + (agg.workload_sum / agg.count) * 0.25 + (agg.leadership_sum / agg.count) * 0.2 + (agg.safety_sum / agg.count) * 0.2 + (agg.clarity_sum / agg.count) * 0.1) * 20,
      }));
    return { data, currentLevel: 'division' as const, nextLevel: 'department' as const, hierarchyLevels: ['division', 'department', 'team'] as const };
  }

  const { data: divisions } = await supabaseAdmin.from('divisions').select('division_id, division_name').eq('client_id', clientId).eq('active', true);
  if (!divisions?.length) return { data: [], currentLevel: 'top' as const, nextLevel: 'division' as const, hierarchyLevels: ['division', 'department', 'team'] as const };
  const divisionIds = divisions.map((d: any) => d.division_id);
  const { data: employeeCounts } = await supabaseAdmin.from('employees').select('division_id').eq('client_id', clientId).in('division_id', divisionIds).eq('active', true);
  const employeeCountByDivision: Record<string, number> = {};
  (employeeCounts || []).forEach((emp: any) => {
    employeeCountByDivision[emp.division_id] = (employeeCountByDivision[emp.division_id] || 0) + 1;
  });
  let query = supabaseAdmin
    .from('responses_v3')
    .select('sentiment_5, clarity_5, workload_5, safety_5, leadership_5, employees!inner(division_id)')
    .eq('client_id', clientId)
    .in('employees.division_id', divisionIds);
  if (startDate) query = query.gte('submitted_at', startDate.toISOString());
  const { data: responses } = await query;
  const aggregates: Record<string, any> = {};
  divisions.forEach((div: any) => {
    aggregates[div.division_id] = { id: div.division_id, name: div.division_name, count: 0, sentiment_sum: 0, clarity_sum: 0, workload_sum: 0, safety_sum: 0, leadership_sum: 0, total_employees: employeeCountByDivision[div.division_id] || 0 };
  });
  (responses || []).forEach((r: any) => {
    const did = r.employees?.division_id;
    if (did && aggregates[did]) {
      aggregates[did].count += 1;
      aggregates[did].sentiment_sum += r.sentiment_5 || 0;
      aggregates[did].clarity_sum += r.clarity_5 || 0;
      aggregates[did].workload_sum += r.workload_5 || 0;
      aggregates[did].safety_sum += r.safety_5 || 0;
      aggregates[did].leadership_sum += r.leadership_5 || 0;
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
      wellbeing_score: ((agg.sentiment_sum / agg.count) * 0.25 + (agg.workload_sum / agg.count) * 0.25 + (agg.leadership_sum / agg.count) * 0.2 + (agg.safety_sum / agg.count) * 0.2 + (agg.clarity_sum / agg.count) * 0.1) * 20,
    }));
  return { data, currentLevel: 'top' as const, nextLevel: 'division' as const, hierarchyLevels: ['division', 'department', 'team'] as const };
}

export type DivisionRow = { division_id: string; division_name: string };
export type DepartmentRow = { department_id: string; department_name: string; division_id: string; division_name: string; display_name: string };
export type TeamRow = { team_id: string; team_name: string; department_id: string; department_name: string; division_id: string; division_name: string; display_name: string };

export async function getOrgStructure(clientId: string) {
  const { data: divisionsRaw } = await supabaseAdmin
    .from('divisions')
    .select('division_id, division_name')
    .eq('client_id', clientId)
    .eq('active', true)
    .order('division_name');
  const divisions: DivisionRow[] = (divisionsRaw ?? []).map((div: any) => ({ division_id: div.division_id, division_name: div.division_name }));
  const divisionLookup = new Map(divisions.map((d) => [d.division_id, d.division_name]));

  const { data: departmentsData } = await supabaseAdmin
    .from('departments')
    .select('department_id, department_name, division_id, divisions!inner(division_name, client_id)')
    .eq('divisions.client_id', clientId)
    .eq('active', true)
    .order('department_name');
  const departments: DepartmentRow[] = (departmentsData ?? []).map((dept: any) => {
    const divRel = Array.isArray(dept.divisions) ? dept.divisions[0] : dept.divisions;
    const divisionName = divRel?.division_name ?? divisionLookup.get(dept.division_id) ?? '';
    return {
      department_id: dept.department_id,
      department_name: dept.department_name,
      division_id: dept.division_id,
      division_name: divisionName,
      display_name: divisionName ? `${dept.department_name} · ${divisionName}` : dept.department_name,
    };
  });
  const departmentLookup = new Map(departments.map((d) => [d.department_id, d]));

  const { data: teamsData } = await supabaseAdmin
    .from('teams')
    .select('team_id, team_name, department_id, departments!inner(department_name, division_id, divisions!inner(division_name, client_id))')
    .eq('departments.divisions.client_id', clientId)
    .eq('active', true)
    .order('team_name');
  const teams: TeamRow[] = (teamsData ?? []).map((team: any) => {
    const deptRel = Array.isArray(team.departments) ? team.departments[0] : team.departments;
    const divRelRaw = deptRel?.divisions;
    const divRel = Array.isArray(divRelRaw) ? divRelRaw[0] : divRelRaw;
    const dept = departmentLookup.get(team.department_id);
    const departmentName = dept?.department_name ?? deptRel?.department_name ?? '';
    const divisionId = dept?.division_id ?? deptRel?.division_id ?? '';
    const divisionName = dept?.division_name ?? (typeof divRel?.division_name === 'string' ? divRel?.division_name : undefined) ?? divisionLookup.get(divisionId) ?? '';
    return {
      team_id: team.team_id,
      team_name: team.team_name,
      department_id: team.department_id,
      department_name: departmentName,
      division_id: divisionId,
      division_name: divisionName,
      display_name: departmentName && divisionName ? `${team.team_name} · ${departmentName} / ${divisionName}` : team.team_name,
    };
  });

  return { divisions, departments, teams };
}

export type AttentionTeam = {
  id: string;
  name: string;
  displayName?: string;
  divisionName?: string;
  departmentName?: string;
  wellbeing: number;
  /** Response count in period */
  responseCount?: number;
  /** Total employees in team (for participation %) */
  totalEmployees?: number;
  /** Participation % (0–100) when totalEmployees is set */
  participationPercent?: number;
};

export async function getAttentionTeams(
  clientId: string,
  startDate: Date | undefined,
  eligibleTeams: TeamRow[],
  departments: DepartmentRow[],
  divisions: DivisionRow[]
): Promise<AttentionTeam[]> {
  if (eligibleTeams.length === 0) return [];
  const teamIds = eligibleTeams.map((t) => t.team_id);

  const { data: teamEmployees } = await supabaseAdmin
    .from('employees')
    .select('id')
    .eq('client_id', clientId)
    .in('team_id', teamIds)
    .eq('active', true)
    .limit(1);
  if (!teamEmployees?.length) return [];

  let query = supabaseAdmin
    .from('responses_v3')
    .select('sentiment_5, clarity_5, workload_5, safety_5, leadership_5, employees!inner(team_id)')
    .eq('client_id', clientId)
    .in('employees.team_id', teamIds);
  if (startDate) query = query.gte('submitted_at', startDate.toISOString());
  const { data: teamResponses } = await query.limit(10000);

  const aggregates: Record<string, { count: number; sentiment: number; clarity: number; workload: number; safety: number; leadership: number }> = {};
  teamIds.forEach((id) => {
    aggregates[id] = { count: 0, sentiment: 0, clarity: 0, workload: 0, safety: 0, leadership: 0 };
  });
  (teamResponses ?? []).forEach((r: any) => {
    const teamKey = r.employees?.team_id;
    if (teamKey && aggregates[teamKey]) {
      aggregates[teamKey].count += 1;
      aggregates[teamKey].sentiment += Number(r.sentiment_5 ?? 0);
      aggregates[teamKey].clarity += Number(r.clarity_5 ?? 0);
      aggregates[teamKey].workload += Number(r.workload_5 ?? 0);
      aggregates[teamKey].safety += Number(r.safety_5 ?? 0);
      aggregates[teamKey].leadership += Number(r.leadership_5 ?? 0);
    }
  });

  const departmentLookup = new Map(departments.map((d) => [d.department_id, d]));
  const divisionById = new Map(divisions.map((d) => [d.division_id, d]));

  const { data: empCounts } = await supabaseAdmin
    .from('employees')
    .select('team_id')
    .eq('client_id', clientId)
    .in('team_id', teamIds)
    .eq('active', true);
  const totalByTeam: Record<string, number> = {};
  (empCounts || []).forEach((r: any) => {
    const tid = r.team_id;
    if (tid) totalByTeam[tid] = (totalByTeam[tid] || 0) + 1;
  });

  return Object.entries(aggregates)
    .filter(([, agg]) => agg.count > 0)
    .map(([id, agg]) => {
      const meta = eligibleTeams.find((t) => t.team_id === id);
      const dept = meta ? departmentLookup.get(meta.department_id) : undefined;
      const division = meta && dept ? divisionById.get(dept.division_id) : undefined;
      const divisionName = division?.division_name;
      const departmentName = dept?.department_name;
      const baseName = meta?.display_name ?? meta?.team_name ?? 'Team';
      const suffixParts: string[] = [];
      if (divisionName) suffixParts.push(divisionName);
      if (departmentName) suffixParts.push(departmentName);
      const totalEmployees = totalByTeam[id];
      const participationPercent =
        totalEmployees != null && totalEmployees > 0
          ? Math.round((agg.count / totalEmployees) * 100)
          : undefined;
      return {
        id,
        name: baseName,
        displayName: suffixParts.length ? `${baseName} · ${suffixParts.join(' / ')}` : baseName,
        divisionName,
        departmentName,
        wellbeing:
          ((agg.sentiment / agg.count) * 0.25 +
            (agg.workload / agg.count) * 0.25 +
            (agg.safety / agg.count) * 0.2 +
            (agg.leadership / agg.count) * 0.2 +
            (agg.clarity / agg.count) * 0.1) *
          20,
        responseCount: agg.count,
        totalEmployees,
        participationPercent,
      };
    });
}
