export const dynamic = 'force-dynamic';
export const revalidate = 0;
import { cookies } from 'next/headers';
import { supabaseAdmin } from '@/lib/supabase';
import { Kpi } from '@/components/charts/Kpi';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, THead, TBody, TR, TH, TD } from '@/components/ui/table';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { OverviewDonut } from '@/components/charts/OverviewDonut';
import { TrendCard } from '@/components/charts/TrendCard';

type WellbeingRow = {
  wk: string;
  sentiment_avg: number;
  clarity_avg: number;
  workload_avg: number;
  safety_avg: number;
  leadership_avg: number;
};

async function getData(clientId: string){
  const { data: trends } = await supabaseAdmin
    .from('wellbeing_responses')
    .select('wk, sentiment_avg, clarity_avg, workload_avg, safety_avg, leadership_avg')
    .eq('client_id', clientId)
    .order('wk', { ascending: true });

  // Fallback: if MV is empty/not refreshed, compute trends directly from raw responses
  let computedTrends = trends as any[] | null;
  if (!computedTrends || computedTrends.length === 0) {
    const { data: direct } = await supabaseAdmin
      .from('responses_v3')
      .select('submitted_at, sentiment_5, clarity_5, workload_5, safety_5, leadership_5')
      .eq('client_id', clientId)
      .order('submitted_at', { ascending: true });
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

  const { data: recent } = await supabaseAdmin
    .from('responses_v3')
    .select('submitted_at, workload_5, safety_5, clarity_5, sentiment_5, leadership_5')
    .eq('client_id', clientId)
    .order('submitted_at', { ascending: false })
    .limit(20);

  return { trends: (computedTrends ?? trends ?? []) as WellbeingRow[], recent: recent ?? [] };
}

export default async function Dashboard({ searchParams }:{ searchParams?: { [k:string]: string | string[] | undefined } }){
  const urlClient = (searchParams?.client as string | undefined) || undefined;
  const from = (searchParams?.from as string | undefined) || '';
  const to = (searchParams?.to as string | undefined) || '';
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
      <main className="p-6">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl font-bold mb-2 text-[var(--text-primary)]">Dashboard</h1>
          <p className="text-[var(--text-muted)]">Set NEXT_PUBLIC_DASHBOARD_CLIENT_ID in your environment to view data.</p>
        </div>
      </main>
    );
  }

  const { trends, recent } = await getData(clientId);

  const toSeries = (key: keyof WellbeingRow, color: string, title: string) => ({
    title,
    color,
    data: trends.map(t => ({ wk: new Date(t.wk).toLocaleDateString(undefined,{ month:'short', day:'numeric'}), value: Number(t[key]) }))
  });

  const series = [
    toSeries('sentiment_avg', '#64afac', 'Sentiment'),
    toSeries('clarity_avg',   '#5d89a9', 'Clarity'),
    toSeries('workload_avg',  '#ea9999', 'Workload'),
    toSeries('safety_avg',    '#2B4162', 'Safety'),
    toSeries('leadership_avg','#A7D6A2', 'Leadership')
  ];

  const last = (k:keyof WellbeingRow)=> (trends.length ? Number(trends[trends.length-1][k]) : undefined);
  const prev = (k:keyof WellbeingRow)=> (trends.length>1 ? Number(trends[trends.length-2][k]) : undefined);
  const delta = (k:keyof WellbeingRow)=>{
    const a = last(k), b = prev(k); if(a===undefined||b===undefined) return undefined; return Number((a-b).toFixed(2));
  };

  const Sidebar = (
    <div className="space-y-2">
      <div className="text-xs uppercase tracking-wide text-[var(--text-muted)] mb-2">Navigation</div>
      <a href="/dashboard" className="block px-3 py-2 rounded hover:bg-black/5">Overview</a>
      <a href="/dashboard?tab=teams" className="block px-3 py-2 rounded hover:bg-black/5">Teams</a>
      <a href="/dashboard?tab=managers" className="block px-3 py-2 rounded hover:bg-black/5">Managers</a>
      <a href="/dashboard?tab=export" className="block px-3 py-2 rounded hover:bg-black/5">Export</a>
    </div>
  );

  return (
    <DashboardShell sidebar={Sidebar}>
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Executive Dashboard</h1>
          <p className="text-[var(--text-muted)]">Client: {clientId}</p>
          <div className="mt-3 flex items-center gap-2">
            <form action={`/api/download`} method="get" className="flex items-center gap-2">
              <input type="hidden" name="client_id" value={clientId} />
              <label className="text-sm text-[var(--text-muted)]">From</label>
              <input type="date" name="from" defaultValue={from} className="border rounded px-2 py-1 text-sm" />
              <label className="text-sm text-[var(--text-muted)]">To</label>
              <input type="date" name="to" defaultValue={to} className="border rounded px-2 py-1 text-sm" />
              <button
                className="px-3 py-2 bg-[var(--navy)] text-white rounded disabled:opacity-50"
                disabled={recent.length === 0}
              >
                Download CSV
              </button>
            </form>
            {process.env.ADMIN_DASH_TOKEN && (
              <form action={`/api/demo/seed`} method="post" className="ml-2">
                <input type="hidden" name="client_id" value={clientId} />
                <button className="px-3 py-2 bg-[var(--icon-okay)] text-white rounded">Generate Demo Data</button>
              </form>
            )}
          </div>
          {recent.length === 0 && (
            <div className="text-sm text-[var(--text-muted)] mt-2">No responses yet</div>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <Kpi label="Sentiment" value={last('sentiment_avg')} delta={delta('sentiment_avg')} color="#64afac"/>
          <Kpi label="Clarity" value={last('clarity_avg')} delta={delta('clarity_avg')} color="#5d89a9"/>
          <Kpi label="Workload" value={last('workload_avg')} delta={delta('workload_avg')} color="#ea9999"/>
          <Kpi label="Safety" value={last('safety_avg')} delta={delta('safety_avg')} color="#2B4162"/>
          <Kpi label="Leadership" value={last('leadership_avg')} delta={delta('leadership_avg')} color="#A7D6A2"/>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader><div className="text-lg font-semibold text-[var(--text-primary)]">Overview</div></CardHeader>
            <CardContent>
              <OverviewDonut data={[
                { label:'Sentiment',  value: last('sentiment_avg')   ?? 0, color:'#64afac' },
                { label:'Clarity',    value: last('clarity_avg')     ?? 0, color:'#5d89a9' },
                { label:'Workload',   value: last('workload_avg')    ?? 0, color:'#ea9999' },
                { label:'Safety',     value: last('safety_avg')      ?? 0, color:'#2B4162' },
                { label:'Leadership', value: last('leadership_avg')  ?? 0, color:'#A7D6A2' }
              ]}/>
            </CardContent>
          </Card>
          {series.map(s => (
            <TrendCard key={s.title} title={s.title} data={s.data} color={s.color}/>
          ))}
        </div>

        <Card>
          <CardHeader>
            <div className="text-lg font-semibold text-[var(--text-primary)]">Recent Responses</div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <THead>
                  <TR>
                    <TH>Submitted</TH>
                    <TH>Sentiment</TH>
                    <TH>Clarity</TH>
                    <TH>Workload</TH>
                    <TH>Safety</TH>
                    <TH>Leadership</TH>
                  </TR>
                </THead>
                <TBody>
                  {recent.map((r:any, i:number)=> (
                    <TR key={i}>
                      <TD>{new Date(r.submitted_at).toLocaleString()}</TD>
                      <TD>{r.sentiment_5}</TD>
                      <TD>{r.clarity_5}</TD>
                      <TD>{r.workload_5}</TD>
                      <TD>{r.safety_5}</TD>
                      <TD>{r.leadership_5}</TD>
                    </TR>
                  ))}
                </TBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}