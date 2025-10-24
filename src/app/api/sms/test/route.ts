import { NextRequest, NextResponse } from 'next/server';
import { sendTestSMS, validateTwilioConfig } from '@/lib/twilio';
import { z } from 'zod';

const schema = z.object({
  phoneNumber: z.string().regex(/^\+61\d{9}$/, 'Must be Australian mobile number (+61xxxxxxxxx)')
});

export async function POST(req: NextRequest) {
  try {
    // Validate Twilio config first
    const configCheck = validateTwilioConfig();
    if (!configCheck.valid) {
      return NextResponse.json({ 
        error: configCheck.message,
        missing: configCheck.missing 
      }, { status: 400 });
    }

    const body = await req.json();
    const { phoneNumber } = schema.parse(body);

    // Send test SMS
    const result = await sendTestSMS(phoneNumber);

    if (result.success) {
      return NextResponse.json({
        success: true,
        messageId: result.messageId,
        status: result.status,
        message: 'Test SMS sent successfully!'
      });
    } else {
      return NextResponse.json({
        success: false,
        error: result.error
      }, { status: 500 });
    }

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: 'Invalid phone number format',
        details: error.errors
      }, { status: 400 });
    }

    console.error('SMS API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}

export async function GET() {
  // Return Twilio configuration status
  const configCheck = validateTwilioConfig();
  
  return NextResponse.json({
    twilioConfigured: configCheck.valid,
    message: configCheck.message,
    missing: configCheck.missing || []
  });
}
