// src/app/api/responses/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabaseAdmin } from '@/lib/supabase';
import { rlSubmit } from '@/lib/rateLimit';

const schema = z.object({
  token: z.string().uuid(),
  sentiment_3: z.number().int().min(1).max(3),
  sentiment_5: z.number().int().min(1).max(5),
  clarity_3: z.number().int().min(1).max(3),
  clarity_5: z.number().int().min(1).max(5),
  workload_3: z.number().int().min(1).max(3),
  workload_5: z.number().int().min(1).max(5),
  safety_3: z.number().int().min(1).max(3),
  safety_5: z.number().int().min(1).max(5),
  leadership_3: z.number().int().min(1).max(3),
  leadership_5: z.number().int().min(1).max(5),
  // Support path fields
  support_requested: z.boolean().optional(),
  support_contacts: z.array(z.string()).optional(),
  support_contact_method: z.string().optional(),
  support_contact_value: z.string().optional(),
  support_timeframe: z.string().optional(),
  support_other_details: z.string().optional(),
  high_risk_flag: z.boolean().optional(),
  risk_factors: z.array(z.string()).optional(),
  meta: z.record(z.any()).optional()
});

export async function POST(req: NextRequest) {
  try {
    // Rate limiting (optional - skip if Redis not configured)
    if (process.env.UPSTASH_REDIS_REST_URL) {
      const ip = req.ip ?? req.headers.get('x-forwarded-for') ?? 'anon';
      const { success } = await rlSubmit.limit(ip);
      
      if (!success) {
        return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
      }
    }

    const body = await req.json();
    const parsed = schema.safeParse(body);
    
    if (!parsed.success) {
      const msg = parsed.error.errors.map(e => e.message).join('; ') || 'Invalid request';
      return NextResponse.json({ error: 'validation_error', details: msg }, { status: 400 });
    }

    // Validate token
    const { data: tok, error: tokErr } = await supabaseAdmin
      .from('tokens')
      .select('*')
      .eq('id', parsed.data.token)
      .single();

    if (tokErr || !tok || tok.status !== 'issued' || new Date(tok.valid_until) < new Date()) {
      return NextResponse.json({ error: 'invalid_or_expired_token' }, { status: 400 });
    }

    // Build insert payload: only include defined values (avoid sending undefined to DB)
    const { token: _token, ...rest } = parsed.data;
    const payload: Record<string, unknown> = {
      token_id: tok.id,
      client_id: tok.client_id,
      employee_id: tok.employee_id,
      sentiment_3: rest.sentiment_3,
      sentiment_5: rest.sentiment_5,
      clarity_3: rest.clarity_3,
      clarity_5: rest.clarity_5,
      workload_3: rest.workload_3,
      workload_5: rest.workload_5,
      safety_3: rest.safety_3,
      safety_5: rest.safety_5,
      leadership_3: rest.leadership_3,
      leadership_5: rest.leadership_5,
      support_requested: rest.support_requested ?? false,
      high_risk_flag: rest.high_risk_flag ?? false,
      risk_factors: rest.risk_factors ?? [],
      meta: rest.meta ?? {}
    };
    if (rest.support_contacts != null && Array.isArray(rest.support_contacts)) payload.support_contacts = rest.support_contacts;
    if (rest.support_contact_method != null && rest.support_contact_method !== '') payload.support_contact_method = rest.support_contact_method;
    if (rest.support_contact_value != null && rest.support_contact_value !== '') payload.support_contact_value = rest.support_contact_value;
    if (rest.support_timeframe != null && rest.support_timeframe !== '') payload.support_timeframe = rest.support_timeframe;
    if (rest.support_other_details != null && rest.support_other_details !== '') payload.support_other_details = rest.support_other_details;

    const { error: insErr } = await supabaseAdmin.from('responses_v3').insert(payload);

    if (insErr) {
      console.error('responses_v3 insert error:', insErr);
      return NextResponse.json({ error: 'save_failed', details: insErr.message }, { status: 500 });
    }

    // Consume token
    await supabaseAdmin
      .from('tokens')
      .update({ status: 'consumed', consumed_at: new Date().toISOString() })
      .eq('id', tok.id);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Response submission error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
