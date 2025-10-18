export const dynamic = 'force-dynamic';
export const revalidate = 0;
import { supabaseAdmin } from '@/lib/supabase';
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

  const { data: recent } = await supabaseAdmin
    .from('responses_v3')
    .select('submitted_at, workload_5, safety_5, clarity_5, sentiment_5, leadership_5')
    .eq('client_id', clientId)
    .order('submitted_at', { ascending: false })
    .limit(20);

  return { trends: (trends ?? []) as WellbeingRow[], recent: recent ?? [] };
}

export default async function Dashboard(){
  const clientId = process.env.NEXT_PUBLIC_DASHBOARD_CLIENT_ID ?? '';
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

  return (
    <main className="p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Executive Dashboard</h1>
          <p className="text-[var(--text-muted)]">Client: {clientId}</p>
          <form action={`/api/download?client_id=${clientId}`} method="get" className="mt-3">
            <button
              className="px-3 py-2 bg-[var(--navy)] text-white rounded disabled:opacity-50"
              disabled={recent.length === 0}
            >
              Download CSV
            </button>
            {recent.length === 0 && (
              <span className="ml-2 text-sm text-[var(--text-muted)]">No responses yet</span>
            )}
          </form>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {series.map(s => (
            <TrendCard key={s.title} title={s.title} data={s.data} color={s.color}/>
          ))}
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border border-black/5">
          <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-3">Recent Responses</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-[var(--text-muted)]">
                  <th className="py-2 pr-4">Submitted</th>
                  <th className="py-2 pr-4">Sentiment</th>
                  <th className="py-2 pr-4">Clarity</th>
                  <th className="py-2 pr-4">Workload</th>
                  <th className="py-2 pr-4">Safety</th>
                  <th className="py-2 pr-4">Leadership</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((r:any, i:number)=> (
                  <tr key={i} className="border-t border-black/5">
                    <td className="py-2 pr-4">{new Date(r.submitted_at).toLocaleString()}</td>
                    <td className="py-2 pr-4">{r.sentiment_5}</td>
                    <td className="py-2 pr-4">{r.clarity_5}</td>
                    <td className="py-2 pr-4">{r.workload_5}</td>
                    <td className="py-2 pr-4">{r.safety_5}</td>
                    <td className="py-2 pr-4">{r.leadership_5}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}