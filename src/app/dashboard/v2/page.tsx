export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { cookies } from 'next/headers';
import { supabaseAdmin } from '@/lib/supabase';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { getPeriodStartDate } from '@/lib/dateUtils';
import { calculateWellbeingPercent } from '@/components/dashboard/scoreTheme';
import { DashboardDesignV2Client } from './DashboardDesignV2Client';

async function getV2Data(clientId: string, period?: string) {
  const startDate = period ? getPeriodStartDate(period) : undefined;

  let query = supabaseAdmin
    .from('responses_v3')
    .select('submitted_at, sentiment_5, clarity_5, workload_5, safety_5, leadership_5')
    .eq('client_id', clientId)
    .order('submitted_at', { ascending: true });

  if (startDate) {
    query = query.gte('submitted_at', startDate.toISOString());
  }

  const { data: responses } = await query;

  if (!responses?.length) {
    return {
      overallScore: 0,
      domainScores: {
        experience: 0,
        workload: 0,
        safety: 0,
        leadership: 0,
        clarity: 0,
      },
    };
  }

  const byWeek: Record<string, { n: number; s: number; c: number; w: number; sa: number; l: number }> = {};
  for (const r of responses) {
    const submittedAt = r.submitted_at;
    if (!submittedAt) continue;
    const d = new Date(submittedAt);
    const day = d.getUTCDay() || 7;
    const monday = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() - (day - 1)));
    const key = monday.toISOString().slice(0, 10);
    if (!byWeek[key]) byWeek[key] = { n: 0, s: 0, c: 0, w: 0, sa: 0, l: 0 };
    const b = byWeek[key];
    b.n += 1;
    b.s += Number(r.sentiment_5 ?? 0);
    b.c += Number(r.clarity_5 ?? 0);
    b.w += Number(r.workload_5 ?? 0);
    b.sa += Number(r.safety_5 ?? 0);
    b.l += Number(r.leadership_5 ?? 0);
  }

  const sortedWeeks = Object.keys(byWeek).sort();
  const latestKey = sortedWeeks[sortedWeeks.length - 1];
  const bucket = latestKey ? byWeek[latestKey] : null;

  if (!bucket || bucket.n === 0) {
    return {
      overallScore: 0,
      domainScores: {
        experience: 0,
        workload: 0,
        safety: 0,
        leadership: 0,
        clarity: 0,
      },
    };
  }

  const sentiment_avg = bucket.s / bucket.n;
  const clarity_avg = bucket.c / bucket.n;
  const workload_avg = bucket.w / bucket.n;
  const safety_avg = bucket.sa / bucket.n;
  const leadership_avg = bucket.l / bucket.n;

  const overallScore =
    calculateWellbeingPercent({
      sentiment: sentiment_avg,
      workload: workload_avg,
      safety: safety_avg,
      leadership: leadership_avg,
      clarity: clarity_avg,
    }) ?? 0;

  return {
    overallScore,
    domainScores: {
      experience: sentiment_avg,
      workload: workload_avg,
      safety: safety_avg,
      leadership: leadership_avg,
      clarity: clarity_avg,
    },
  };
}

export default async function DashboardV2Page({
  searchParams,
}: {
  searchParams?: { [k: string]: string | string[] | undefined };
}) {
  const period = (searchParams?.period as string | undefined) || 'all';
  const urlClient = (searchParams?.client as string | undefined) || undefined;
  const clientId = urlClient || (process.env.NEXT_PUBLIC_DASHBOARD_CLIENT_ID ?? '');

  const requiredToken = process.env.ADMIN_DASH_TOKEN;
  if (requiredToken) {
    const cookieToken = cookies().get('dash')?.value;
    if (cookieToken !== requiredToken) {
      const qp = new URLSearchParams();
      if (clientId) qp.set('client', clientId);
      const redirectTo = qp.toString() ? `/dashboard/v2?${qp.toString()}` : '/dashboard/v2';
      return (
        <main className="p-6">
          <div className="max-w-md mx-auto bg-white rounded-lg p-4 shadow-sm border border-black/5">
            <h1 className="text-xl font-semibold text-[var(--text-primary)] mb-2">Admin Sign‑In</h1>
            <p className="text-sm text-[var(--text-muted)] mb-3">Enter the dashboard access token.</p>
            <form action="/api/dash-login" method="post" className="space-y-2">
              <input type="password" name="password" placeholder="Access token" className="w-full border rounded px-3 py-2" required />
              <input type="hidden" name="redirect" value={redirectTo} />
              <button type="submit" className="px-3 py-2 bg-[var(--navy)] text-white rounded">Sign In</button>
            </form>
          </div>
        </main>
      );
    }
  }

  if (!clientId) {
    return (
      <DashboardShell
        sidebar={
          <div className="space-y-2">
            <div className="text-xs uppercase tracking-wide text-[var(--text-muted)] mb-2">Navigation</div>
            <a href="/dashboard" className="block px-3 py-2 rounded bg-black/5 font-medium">Overview (current)</a>
            <a href="/dashboard/v2" className="block px-3 py-2 rounded hover:bg-black/5">Design v2</a>
          </div>
        }
      >
        <div className="max-w-6xl mx-auto space-y-6">
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Dashboard v2</h1>
          <p className="text-[var(--text-muted)]">Set NEXT_PUBLIC_DASHBOARD_CLIENT_ID in your environment to view data.</p>
        </div>
      </DashboardShell>
    );
  }

  const data = await getV2Data(clientId, period !== 'all' ? period : undefined);

  const Sidebar = (
    <div className="space-y-2">
      <div className="text-xs uppercase tracking-wide text-[var(--text-muted)] mb-2">Navigation</div>
      <a href="/dashboard" className="block px-3 py-2 rounded hover:bg-black/5">Overview (current)</a>
      <a href="/dashboard/v2" className="block px-3 py-2 rounded bg-black/5 font-medium">Design v2</a>
      <div className="pt-4 border-t border-black/10">
        <a href="/dashboard" className="text-sm text-[var(--text-muted)] hover:underline">← Back to current dashboard</a>
      </div>
    </div>
  );

  return (
    <DashboardShell sidebar={Sidebar}>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Beacon Index · Design v2</h1>
          <span className="text-sm text-[var(--text-muted)]">Compare with current dashboard</span>
        </div>
        <DashboardDesignV2Client data={data} />
      </div>
    </DashboardShell>
  );
}
