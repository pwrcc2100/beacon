import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(req: NextRequest){
  const { searchParams } = new URL(req.url);
  let clientId = searchParams.get('client_id') || process.env.NEXT_PUBLIC_DASHBOARD_CLIENT_ID || '';
  const from = searchParams.get('from'); // YYYY-MM-DD
  const to = searchParams.get('to');     // YYYY-MM-DD
  if(!clientId){
    return new NextResponse('client_id is required', { status: 400 });
  }

  let query = supabaseAdmin
    .from('responses_v3')
    .select('submitted_at, sentiment_3, sentiment_5, clarity_3, clarity_5, workload_3, workload_5, safety_3, safety_5, leadership_3, leadership_5, comment_text')
    .eq('client_id', clientId);

  // Apply optional date filters (inclusive)
  if (from) {
    // start of day in UTC
    const fromIso = new Date(from + 'T00:00:00.000Z').toISOString();
    query = query.gte('submitted_at', fromIso);
  }
  if (to) {
    // end of day in UTC
    const toIso = new Date(to + 'T23:59:59.999Z').toISOString();
    query = query.lte('submitted_at', toIso);
  }

  const { data, error } = await query
    .order('submitted_at', { ascending: false })
    .limit(1000);

  if(error){
    return new NextResponse(error.message, { status: 500 });
  }

  const headers = ['submitted_at','sentiment_3','sentiment_5','clarity_3','clarity_5','workload_3','workload_5','safety_3','safety_5','leadership_3','leadership_5','comment_text'];
  const rows = (data ?? []).map((r:any)=> headers.map(h => {
    const v = r[h];
    if(v == null) return '';
    // Use regex replace for broad Node targets (instead of String.replaceAll)
    const s = String(v).replace(/"/g,'""');
    return s.includes(',') || s.includes('"') || s.includes('\n') ? `"${s}` + '"' : s;
  }).join(','));
  const csv = [headers.join(','), ...rows].join('\n');

  return new NextResponse(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="responses.csv"'
    }
  });
}


