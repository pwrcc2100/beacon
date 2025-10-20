import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

async function sendSms(to:string, body:string){
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_FROM;
  if(!sid || !token || !from) throw new Error('Twilio env missing');
  const url = `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`;
  const params = new URLSearchParams({ To: to, From: from, Body: body });
  const res = await fetch(url, { method:'POST', headers: { 'Authorization': 'Basic ' + Buffer.from(`${sid}:${token}`).toString('base64'), 'Content-Type':'application/x-www-form-urlencoded' }, body: params });
  if(!res.ok){
    const text = await res.text();
    throw new Error(`Twilio error: ${res.status} ${text}`);
  }
}

export async function POST(req: NextRequest){
  // Simple bearer token auth for admin API
  const key = req.headers.get('authorization')?.replace('Bearer ','') || '';
  if ((process.env.ADMIN_API_KEY || '') !== key) return NextResponse.json({ error:'unauthorized' },{ status:401 });

  const { client_id, message } = await req.json();
  if(!client_id) return NextResponse.json({ error:'client_id required' },{ status:400 });

  // 1) fetch employees for client with phone numbers
  // Be tolerant of schemas where the PK is employee_id instead of id
  const { data: employees, error: empErr } = await supabaseAdmin
    .from('employees')
    .select('*')
    .eq('client_id', client_id);
  if(empErr) return NextResponse.json({ error: empErr.message },{ status:500 });

  // 2) issue tokens and send SMS in batches
  let sent = 0; let failed = 0; const errors: string[] = [];
  for(const e of employees || []){
    const empId = (e as any).id ?? (e as any).employee_id;
    const phone: string | null = (e as any).phone ?? null;
    if(!empId || !phone){ failed++; errors.push('missing employee id or phone'); continue; }
    const validUntil = new Date(Date.now()+7*864e5).toISOString();
    const { data, error } = await supabaseAdmin.from('tokens')
      .insert({ client_id, employee_id: empId, valid_until: validUntil, channel: 'sms' })
      .select('id').single();
    if(error){ failed++; errors.push(error.message); continue; }
    const link = `${process.env.NEXT_PUBLIC_APP_URL}/survey/${data!.id}`;
    try{
      await sendSms(phone, message?.includes('{{link}}') ? message.replace('{{link}}', link) : (message || `Your weekly check-in: ${link}`));
      sent++;
    }catch(err:any){ failed++; errors.push(err.message); }
  }

  return NextResponse.json({ ok:true, sent, failed, errors });
}


