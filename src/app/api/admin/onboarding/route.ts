import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

let resendClient: any = null;
const notifyEmail = process.env.ADMIN_ONBOARDING_NOTIFY;

async function getResendClient() {
  if (!process.env.RESEND_API_KEY) return null;
  if (resendClient) return resendClient;
  const mod = await import('resend').catch(() => null);
  if (!mod) return null;
  const { Resend } = mod as typeof import('resend');
  resendClient = new Resend(process.env.RESEND_API_KEY!);
  return resendClient;
}

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get('content-type') ?? '';
    let body: any;

    if (contentType.includes('application/json')) {
      body = await req.json();
    } else {
      const formData = await req.formData();
      body = Object.fromEntries(formData.entries());
    }

    const { data, error } = await supabaseAdmin
      .from('onboarding_requests')
      .insert({ payload: body })
      .select('id')
      .single();

    if (error) {
      console.error('Supabase insert failed', error);
      return NextResponse.json({ error: 'Failed to save request.' }, { status: 500 });
    }

    const resend = await getResendClient();
    if (resend && notifyEmail) {
      try {
        await resend.emails.send({
          from: 'Beacon Onboarding <notifications@beacon.effect>',
          to: notifyEmail,
          subject: `New client onboarding request (#${data.id})`,
          text: JSON.stringify(body, null, 2),
        });
      } catch (mailError) {
        console.warn('Failed to send notification email', mailError);
      }
    }

    return NextResponse.json({ ok: true, id: data.id });
  } catch (err) {
    console.error('Onboarding submission error', err);
    return NextResponse.json({ error: 'Invalid submission.' }, { status: 400 });
  }
}
