import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

const notifyEmail = process.env.ADMIN_ONBOARDING_NOTIFY;
const resendApiKey = process.env.RESEND_API_KEY;

async function sendNotification(payload: any, requestId: number) {
  if (!notifyEmail || !resendApiKey) return;
  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: 'Beacon Onboarding <notifications@beacon.effect>',
        to: notifyEmail,
        subject: `New client onboarding request (#${requestId})`,
        text: JSON.stringify(payload, null, 2),
      }),
    });
  } catch (error) {
    console.warn('Failed to send notification email', error);
  }
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

    if (data?.id) {
      await sendNotification(body, data.id);
    }

    return NextResponse.json({ ok: true, id: data?.id ?? null });
  } catch (err) {
    console.error('Onboarding submission error', err);
    return NextResponse.json({ error: 'Invalid submission.' }, { status: 400 });
  }
}
