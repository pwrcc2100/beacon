// src/app/api/surveys/issue/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { z } from 'zod';

const schema = z.object({
  client_id: z.string().uuid(),
  employee_id: z.string().uuid().optional(),
  ttl_days: z.number().int().min(1).max(30).default(7),
  channel: z.enum(['web', 'sms', 'email']).default('web'),
  base_url: z.string().url().optional()
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { client_id, employee_id, ttl_days, channel, base_url } = schema.parse(body);

    const valid_until = new Date(Date.now() + ttl_days * 864e5).toISOString();
    
    const { data, error } = await supabaseAdmin
      .from('tokens')
      .insert({
        client_id,
        employee_id,
        valid_until,
        channel
      })
      .select('id')
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const DEFAULT_APP_URL = 'https://beacon-mu.vercel.app';

    const envUrl =
      base_url ||
      process.env.NEXT_PUBLIC_APP_URL ||
      process.env.APP_URL ||
      DEFAULT_APP_URL;
    const originHeader = req.headers.get('origin') || undefined;
    const hostHeader = req.headers.get('host');

    const buildBaseUrl = (input?: string | null) => {
      if (!input) return undefined;
      if (input.startsWith('http://') || input.startsWith('https://')) {
        return input.replace(/\/$/, '');
      }
      return `https://${input}`.replace('https://https://', 'https://').replace(/\/$/, '');
    };

    const baseUrl =
      buildBaseUrl(envUrl) ||
      buildBaseUrl(originHeader) ||
      buildBaseUrl(hostHeader) ||
      DEFAULT_APP_URL;
    const url = baseUrl ? `${baseUrl}/survey/${data.id}` : `/survey/${data.id}`;
    
    return NextResponse.json({ token: data.id, url });
  } catch (error) {
    console.error('Token issuance error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

