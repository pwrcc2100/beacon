import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabaseAdmin } from '@/lib/supabase';

function randInt(min:number, max:number){
  return Math.floor(Math.random()*(max-min+1))+min;
}

export async function POST(req: NextRequest){
  // Protect with admin token - check header first, then cookie
  const headerToken = req.headers.get('authorization')?.replace('Bearer ','') || '';
  const cookieToken = (await cookies()).get('dash')?.value || '';
  const token = headerToken || cookieToken;
  
  if (process.env.ADMIN_DASH_TOKEN && token !== process.env.ADMIN_DASH_TOKEN) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const { client_id } = await req.json().catch(()=>({} as any));
  const clientId = client_id || process.env.NEXT_PUBLIC_DASHBOARD_CLIENT_ID;
  if (!clientId) return NextResponse.json({ error: 'client_id required' }, { status: 400 });

  const now = new Date();
  const rows:any[] = [];
  for (let i=0;i<50;i++){
    const d = new Date(now.getTime() - randInt(0, 60)*86400000);
    const s3 = randInt(1,3) as 1|2|3;
    const c3 = randInt(1,3) as 1|2|3;
    const w3 = randInt(1,3) as 1|2|3;
    const sa3 = randInt(1,3) as 1|2|3;
    const l3 = randInt(1,3) as 1|2|3;
    const map = (v:number)=> v===1?5 : v===2?3 : 1;
    rows.push({
      token_id: crypto.randomUUID(),
      client_id: clientId,
      employee_id: null,
      sentiment_3: s3, sentiment_5: map(s3),
      clarity_3: c3,   clarity_5: map(c3),
      workload_3: w3,  workload_5: map(w3),
      safety_3: sa3,   safety_5: map(sa3),
      leadership_3: l3, leadership_5: map(l3),
      comment_text: null,
      submitted_at: d.toISOString(),
      source: 'demo_seed'
    });
  }

  const { error } = await supabaseAdmin.from('responses_v3').insert(rows);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok:true, inserted: rows.length });
}


