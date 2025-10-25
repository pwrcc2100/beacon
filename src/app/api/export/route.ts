import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(req: NextRequest){
  const { searchParams } = new URL(req.url);
  const clientId = searchParams.get('client_id');
  if(!clientId){
    return new NextResponse('client_id is required', { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from('responses_v3')
    .select('submitted_at, sentiment_3, sentiment_5, clarity_3, clarity_5, workload_3, workload_5, safety_3, safety_5, leadership_3, leadership_5, comment_text')
    .eq('client_id', clientId)
    .order('submitted_at', { ascending: false })
    .limit(1000);

  if(error){
    return new NextResponse(error.message, { status: 500 });
  }

  const headers = ['submitted_at','sentiment_3','sentiment_5','clarity_3','clarity_5','workload_3','workload_5','safety_3','safety_5','leadership_3','leadership_5','comment_text'];
  const rows = (data ?? []).map((r:any)=> headers.map(h => {
    const v = r[h];
    if(v == null) return '';
    const s = String(v).replace(/"/g, '""');
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


