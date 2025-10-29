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
      return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
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

    // Write response (exclude raw token string from insert)
    const { token: _token, ...responseFields } = parsed.data as any;
    const { error: insErr } = await supabaseAdmin.from('responses_v3').insert({
      token_id: tok.id,
      client_id: tok.client_id,
      employee_id: tok.employee_id,
      ...responseFields
    });

    if (insErr) {
      return NextResponse.json({ error: insErr.message }, { status: 500 });
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
