import { cookies } from 'next/headers';
import { supabaseAdmin } from '@/lib/supabase';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { getPeriodStartDate } from '@/lib/dateUtils';
import {
  calculateWellbeingPercent,
} from '@/components/dashboard/scoreTheme';
import { getScoreStatus } from '@/components/dashboard/scoreTheme';
import { DemoQRCode } from '@/components/dashboard/DemoQRCode';
import { GroupLeaderGrid } from '@/components/dashboard/GroupLeaderGrid';

type SearchParams = {
  [key: string]: string | string[] | undefined;
};

export type TeamSummary = {
  id: string;
  name: string;
  displayName: string;
  divisionName?: string;
  departmentName?: string;
  questionScores: Record<'sentiment' | 'clarity' | 'workload' | 'safety' | 'leadership', number | undefined>;
  wellbeingPercent?: number;
  trend: number[];
  responseCount: number;
  insight: string;
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
        divisions!inner(client_id, division_name)
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
      const dept = Array.isArray(team.departments) ? team.departments[0] : team.departments;
      return dept?.division_id === divisionId;
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
    const employees = Array.isArray(response.employees) ? response.employees[0] : response.employees;
    const teamId = employees?.team_id as string | undefined;
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

  const summaries: TeamSummary[] = filteredTeams.map(team => {
    const summary = summaryMap.get(team.team_id)!;
    const avg = (field: 'sentiment' | 'workload' | 'safety' | 'leadership' | 'clarity') => 
      (summary.count > 0 ? summary[field] / summary.count : undefined);

    const wellbeingPercent = summary.count > 0
      ? calculateWellbeingPercent({
          sentiment: summary.sentiment / summary.count,
          workload: summary.workload / summary.count,
          safety: summary.safety / summary.count,
          leadership: summary.leadership / summary.count,
          clarity: summary.clarity / summary.count,
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

    const dept = Array.isArray(team.departments) ? team.departments[0] : team.departments;
    const division = dept ? (Array.isArray(dept.divisions) ? dept.divisions[0] : dept?.divisions) : undefined;

    const suffixParts: string[] = [];
    if (division?.division_name) suffixParts.push(division.division_name);
    if (dept?.department_name) suffixParts.push(dept.department_name);

    return {
      id: team.team_id,
      name: team.team_name,
      displayName: suffixParts.length ? `${team.team_name} · ${suffixParts.join(' / ')}` : team.team_name,
      departmentName: dept?.department_name ?? undefined,
      divisionName: division?.division_name ?? undefined,
      questionScores: {
        sentiment: avg('sentiment'),
        clarity: avg('clarity'),
        workload: avg('workload'),
        safety: avg('safety'),
        leadership: avg('leadership'),
      },
      wellbeingPercent,
      trend: weeklyPoints,
      responseCount: summary.count,
      insight: 'Focus on celebrating wins and checking in with the team lead.',
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

  const teamSummaries = getDemoTeamSummaries();

  const Sidebar = (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="text-xs uppercase tracking-wide text-[var(--text-muted)] mb-2">Navigation</div>
        <a href="/dashboard" className="block px-3 py-2 rounded hover:bg-black/5">Overview</a>
        <a href="/dashboard/trends" className="block px-3 py-2 rounded hover:bg-black/5">Trends</a>
        <a href="/dashboard/group-leader" className="block px-3 py-2 rounded bg-black/5 font-medium">Group Leader View</a>
        <a href="/analytics" className="block px-3 py-2 rounded hover:bg-black/5">Advanced Analytics</a>
        <a href="/methodology" className="block px-3 py-2 rounded hover:bg-black/5">Methodology</a>
      </div>
      
      {/* Compact QR Code Generator in Sidebar */}
      <div className="pt-4 border-t border-black/10">
        <DemoQRCode clientId={clientId} compact={true} />
      </div>
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

        {teamSummaries.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[#CBD5E1] bg-[#F8FAFF] p-6 text-sm text-[var(--text-muted)]">
            No team responses yet for this selection. Generate demo data or adjust the division/department filter.
          </div>
        ) : (
          <GroupLeaderGrid teams={teamSummaries} />
        )}
      </div>
    </DashboardShell>
  );
}

function getDemoTeamSummaries(): TeamSummary[] {
  return [
    {
      id: 'demo-team-a',
      name: 'Team A',
      displayName: 'Team A · Sydney Metro / Education',
      divisionName: 'Sydney Metro',
      departmentName: 'Education',
      wellbeingPercent: 25,
      responseCount: 42,
      insight: 'Escalate to regional HR partner. Introduce weekly workload review with the team lead.',
      questionScores: {
        sentiment: 1.4,
        clarity: 2.3,
        workload: 1.5,
        safety: 1.7,
        leadership: 2.1,
      },
      trend: [35, 33, 30, 28, 26, 25],
    },
    {
      id: 'demo-team-b',
      name: 'Team B',
      displayName: 'Team B · Sydney Metro / Residential',
      divisionName: 'Sydney Metro',
      departmentName: 'Residential',
      wellbeingPercent: 42,
      responseCount: 57,
      insight: 'Workload feedback is trending down. Review roster adjustments and buddy support.',
      questionScores: {
        sentiment: 2.6,
        clarity: 3.0,
        workload: 2.4,
        safety: 2.7,
        leadership: 2.5,
      },
      trend: [52, 48, 46, 45, 43, 42],
    },
    {
      id: 'demo-team-c',
      name: 'Team C',
      displayName: 'Team C · Regional / Health',
      divisionName: 'Regional',
      departmentName: 'Health',
      wellbeingPercent: 68,
      responseCount: 63,
      insight: 'Solid improvement in safety scores after tool-box refresh. Maintain fortnightly pulse checks.',
      questionScores: {
        sentiment: 3.6,
        clarity: 3.2,
        workload: 2.9,
        safety: 3.4,
        leadership: 3.6,
      },
      trend: [54, 58, 60, 63, 66, 68],
    },
    {
      id: 'demo-team-d',
      name: 'Team D',
      displayName: 'Team D · Regional / Education',
      divisionName: 'Regional',
      departmentName: 'Education',
      wellbeingPercent: 57,
      responseCount: 51,
      insight: 'Mentoring program launched last month. Monitor clarity and leadership scores for uplift.',
      questionScores: {
        sentiment: 2.8,
        clarity: 3.2,
        workload: 2.6,
        safety: 3.0,
        leadership: 2.4,
      },
      trend: [49, 51, 52, 53, 55, 57],
    },
    {
      id: 'demo-team-e',
      name: 'Team E',
      displayName: 'Team E · QLD / Residential',
      divisionName: 'QLD',
      departmentName: 'Residential',
      wellbeingPercent: 74,
      responseCount: 46,
      insight: 'Coaching conversations improved clarity; next focus is balancing rosters across shifts.',
      questionScores: {
        sentiment: 3.8,
        clarity: 3.4,
        workload: 3.1,
        safety: 3.6,
        leadership: 3.3,
      },
      trend: [60, 64, 68, 70, 72, 74],
    },
    {
      id: 'demo-team-f',
      name: 'Team F',
      displayName: 'Team F · QLD / Health',
      divisionName: 'QLD',
      departmentName: 'Health',
      wellbeingPercent: 86,
      responseCount: 55,
      insight: 'Model site for recognition program. Capture learnings to share with Sydney Metro teams.',
      questionScores: {
        sentiment: 4.4,
        clarity: 4.2,
        workload: 3.8,
        safety: 4.4,
        leadership: 4.5,
      },
      trend: [76, 78, 80, 82, 85, 86],
    },
  ];
}


