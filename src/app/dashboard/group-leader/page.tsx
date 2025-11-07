import { cookies } from 'next/headers';
import { supabaseAdmin } from '@/lib/supabase';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { GroupLeaderCard } from '@/components/dashboard/GroupLeaderCard';
import { getPeriodStartDate } from '@/lib/dateUtils';
import {
  calculateWellbeingPercent,
  scoreToPercent,
} from '@/components/dashboard/scoreTheme';
import { getScoreStatus } from '@/components/dashboard/scoreTheme';
import { GroupLeaderFilters } from '@/components/dashboard/GroupLeaderFilters';

type SearchParams = {
  [key: string]: string | string[] | undefined;
};

type TeamSummary = {
  id: string;
  name: string;
  departmentName?: string;
  questionScores: Record<'sentiment' | 'clarity' | 'workload' | 'safety' | 'leadership', number | undefined>;
  wellbeingPercent?: number;
  trend: number[];
  responseCount: number;
};

function getStartDate(period?: string, mode?: 'historical' | 'live') {
  if (mode === 'live') {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  }
  return period && period !== 'all' ? getPeriodStartDate(period) : undefined;
}

async function getTeamSummaries(
  clientId: string,
  period?: string,
  mode?: 'historical' | 'live',
  divisionId?: string,
  departmentId?: string,
) {
  const startDate = getStartDate(period, mode);

  const { data: teamsData } = await supabaseAdmin
    .from('teams')
    .select(`
      team_id,
      team_name,
      department_id,
      departments!inner(
        department_name,
        division_id,
        divisions!inner(client_id)
      )
    `)
    .eq('departments.divisions.client_id', clientId)
    .eq('active', true)
    .order('team_name');

  if (!teamsData) {
    return [] as TeamSummary[];
  }

  const filteredTeams = teamsData.filter(team => {
    if (departmentId) {
      return team.department_id === departmentId;
    }
    if (divisionId) {
      const divisionMatch = Array.isArray((team as any).departments)
        ? (team as any).departments.some((dept: any) => dept?.division_id === divisionId)
        : (team as any).departments?.division_id === divisionId;
      return divisionMatch;
    }
    return true;
  });

  const teamIds = filteredTeams.map(team => team.team_id);
  if (teamIds.length === 0) {
    return [] as TeamSummary[];
  }

  let responsesQuery = supabaseAdmin
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
    .in('employees.team_id', teamIds);

  if (startDate) {
    responsesQuery = responsesQuery.gte('submitted_at', startDate.toISOString());
  }

  const { data: responses } = await responsesQuery;

  type WeeklyBucket = {
    count: number;
    sentiment: number;
    workload: number;
    safety: number;
    leadership: number;
    clarity: number;
  };

  const summaryMap = new Map<string, {
    count: number;
    sentiment: number;
    workload: number;
    safety: number;
    leadership: number;
    clarity: number;
    weekly: Map<string, WeeklyBucket>;
  }>();

  filteredTeams.forEach(team => {
    summaryMap.set(team.team_id, {
      count: 0,
      sentiment: 0,
      workload: 0,
      safety: 0,
      leadership: 0,
      clarity: 0,
      weekly: new Map<string, WeeklyBucket>(),
    });
  });

  (responses ?? []).forEach(response => {
    const employeeData = Array.isArray(response.employees)
      ? (response.employees[0] as { team_id?: string })
      : (response.employees as { team_id?: string });
    const teamId = employeeData?.team_id as string | undefined;
    if (!teamId) return;
    const summary = summaryMap.get(teamId);
    if (!summary) return;

    summary.count += 1;
    summary.sentiment += Number(response.sentiment_5 ?? 0);
    summary.workload += Number(response.workload_5 ?? 0);
    summary.safety += Number(response.safety_5 ?? 0);
    summary.leadership += Number(response.leadership_5 ?? 0);
    summary.clarity += Number(response.clarity_5 ?? 0);

    if (response.submitted_at) {
      const d = new Date(response.submitted_at);
      const day = d.getUTCDay() || 7;
      const monday = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() - (day - 1)));
      const key = monday.toISOString().slice(0, 10);
      const bucket = summary.weekly.get(key) ?? {
        count: 0,
        sentiment: 0,
        workload: 0,
        safety: 0,
        leadership: 0,
        clarity: 0,
      };
      bucket.count += 1;
      bucket.sentiment += Number(response.sentiment_5 ?? 0);
      bucket.workload += Number(response.workload_5 ?? 0);
      bucket.safety += Number(response.safety_5 ?? 0);
      bucket.leadership += Number(response.leadership_5 ?? 0);
      bucket.clarity += Number(response.clarity_5 ?? 0);
      summary.weekly.set(key, bucket);
    }
  });

  // Deduplicate teams by team_id to prevent duplicate cards
  const uniqueTeamsMap = new Map<string, any>();
  filteredTeams.forEach(team => {
    if (!uniqueTeamsMap.has(team.team_id)) {
      uniqueTeamsMap.set(team.team_id, team);
    }
  });

  const summaries: TeamSummary[] = Array.from(uniqueTeamsMap.values()).map(team => {
    const summary = summaryMap.get(team.team_id)!;

    const sentimentAvg = summary.count ? summary.sentiment / summary.count : undefined;
    const workloadAvg = summary.count ? summary.workload / summary.count : undefined;
    const safetyAvg = summary.count ? summary.safety / summary.count : undefined;
    const leadershipAvg = summary.count ? summary.leadership / summary.count : undefined;
    const clarityAvg = summary.count ? summary.clarity / summary.count : undefined;

    const wellbeingPercent = summary.count > 0
      ? calculateWellbeingPercent({
          sentiment: sentimentAvg,
          workload: workloadAvg,
          safety: safetyAvg,
          leadership: leadershipAvg,
          clarity: clarityAvg,
        })
      : undefined;

    const weeklyPoints = Array.from(summary.weekly.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([, bucket]) => {
        if (bucket.count === 0) return 0;
        return (
          ((bucket.sentiment / bucket.count) * 0.25 +
            (bucket.workload / bucket.count) * 0.25 +
            (bucket.safety / bucket.count) * 0.2 +
            (bucket.leadership / bucket.count) * 0.2 +
            (bucket.clarity / bucket.count) * 0.1) * 20
        );
      })
      .slice(-6);

    const getDepartmentName = () => {
      const deptData: any = (team as any).departments;
      if (Array.isArray(deptData)) {
        return deptData[0]?.department_name;
      }
      return deptData?.department_name;
    };

    return {
      id: team.team_id,
      name: team.team_name,
      departmentName: getDepartmentName(),
      questionScores: {
        sentiment: sentimentAvg,
        clarity: clarityAvg,
        workload: workloadAvg,
        safety: safetyAvg,
        leadership: leadershipAvg,
      },
      wellbeingPercent,
      trend: weeklyPoints,
      responseCount: summary.count,
    };
  });

  return summaries.sort((a, b) => {
    const aValue = a.wellbeingPercent ?? 101;
    const bValue = b.wellbeingPercent ?? 101;
    return aValue - bValue;
  });
}

export default async function GroupLeaderDashboard({ searchParams }: { searchParams?: SearchParams }) {
  const period = (searchParams?.period as string | undefined) || 'all';
  const mode = (searchParams?.mode as 'historical' | 'live' | undefined) || 'historical';
  const divisionId = searchParams?.division_id as string | undefined;
  const departmentId = searchParams?.department_id as string | undefined;
  const clientId = (searchParams?.client as string | undefined) || process.env.NEXT_PUBLIC_DASHBOARD_CLIENT_ID || '';

  const requiredToken = process.env.ADMIN_DASH_TOKEN;
  if (requiredToken) {
    const cookieToken = cookies().get('dash')?.value;
    if (cookieToken !== requiredToken) {
      const qp = new URLSearchParams();
      if (clientId) qp.set('client', clientId);
      qp.set('redirect', '/dashboard/group-leader');
      return (
        <main className="p-6">
          <div className="max-w-md mx-auto bg-white rounded-lg p-4 shadow-sm border border-black/5">
            <h1 className="text-xl font-semibold text-[var(--text-primary)] mb-2">Admin Sign‑In</h1>
            <p className="text-sm text-[var(--text-muted)] mb-3">Enter the dashboard access token.</p>
            <form action="/api/dash-login" method="post" className="space-y-2">
              <input type="password" name="password" placeholder="Access token" className="w-full border rounded px-3 py-2" required />
              <input type="hidden" name="redirect" value="/dashboard/group-leader" />
              <button className="px-3 py-2 bg-[var(--navy)] text-white rounded">Sign In</button>
            </form>
          </div>
        </main>
      );
    }
  }

  if (!clientId) {
    return (
      <main className="p-8">
        <h1 className="text-2xl font-semibold">Client ID missing</h1>
        <p className="text-muted-foreground mt-2">Set NEXT_PUBLIC_DASHBOARD_CLIENT_ID to view the dashboard.</p>
      </main>
    );
  }

  const teamSummaries = await getTeamSummaries(clientId, period, mode, divisionId, departmentId);

  // Fetch divisions and departments for filters
  const { data: divisions } = await supabaseAdmin
    .from('divisions')
    .select('division_id, division_name')
    .eq('client_id', clientId)
    .eq('active', true)
    .order('division_name');

  const { data: departments } = await supabaseAdmin
    .from('departments')
    .select('department_id, department_name, division_id')
    .eq('active', true)
    .order('department_name');

  const Sidebar = (
    <div className="space-y-2">
      <div className="text-xs uppercase tracking-wide text-[var(--text-muted)] mb-2">Navigation</div>
      <a href={`/dashboard?client=${clientId}`} className="block px-3 py-2 rounded hover:bg-black/5">Overview</a>
      <a href={`/dashboard/trends?client=${clientId}`} className="block px-3 py-2 rounded hover:bg-black/5">Trends</a>
      <a href={`/dashboard/group-leader?client=${clientId}`} className="block px-3 py-2 rounded bg-black/5 font-medium">Group Leader View</a>
      <a href="/analytics" className="block px-3 py-2 rounded hover:bg-black/5">Advanced Analytics</a>
      <a href="/methodology" className="block px-3 py-2 rounded hover:bg-black/5">Methodology</a>
    </div>
  );

  return (
    <DashboardShell sidebar={Sidebar}>
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <div className="text-lg font-semibold text-[var(--text-muted)] uppercase tracking-widest">Example</div>
            <div className="text-3xl md:text-4xl font-black text-[var(--text-primary)] leading-tight">Group Leader Dashboard</div>
            <p className="text-sm text-[var(--text-muted)] mt-2">Whole of department | period: {period === 'all' ? 'All time' : period}</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
            <span className="inline-flex items-center gap-2">
              <span className="h-3 w-3 rounded-full" style={{ backgroundColor: getScoreStatus(80).color }} /> Thriving
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-3 w-3 rounded-full" style={{ backgroundColor: getScoreStatus(55).color }} /> Ones to Watch
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-3 w-3 rounded-full" style={{ backgroundColor: getScoreStatus(25).color }} /> High Alert
            </span>
          </div>
        </div>

        {/* Hierarchy Filters */}
        <GroupLeaderFilters
          clientId={clientId}
          period={period}
          mode={mode}
          currentDivisionId={divisionId}
          currentDepartmentId={departmentId}
          divisions={divisions || []}
          departments={departments || []}
        />

        {teamSummaries.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[#CBD5E1] bg-[#F8FAFF] p-6 text-sm text-[var(--text-muted)]">
            No team responses yet for this selection. Generate demo data or adjust the division/department filter.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {teamSummaries.map(team => (
              <GroupLeaderCard
                key={team.id}
                teamName={team.name}
                wellbeingPercent={team.wellbeingPercent}
                questionScores={team.questionScores}
                historicalPoints={team.trend}
              />
            ))}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}


