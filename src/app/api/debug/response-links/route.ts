import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  const clientId = process.env.NEXT_PUBLIC_DASHBOARD_CLIENT_ID;
  if (!clientId) {
    return NextResponse.json({ error: 'No client ID configured' }, { status: 400 });
  }

  const { data: employees } = await supabaseAdmin
    .from('employees')
    .select('id, employee_id, team_id')
    .eq('client_id', clientId)
    .ilike('email', '%demo-balanced-%')
    .limit(10);

  const { data: responses } = await supabaseAdmin
    .from('responses_v3')
    .select('id, employee_id, client_id, submitted_at')
    .eq('client_id', clientId)
    .eq('source', 'demo_seed_balanced')
    .limit(10);

  return NextResponse.json({ employees, responses });
}
