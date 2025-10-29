import twilio from 'twilio';

// Initialize Twilio client
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export interface SMSMessage {
  phoneNumber: string;
  firstName: string;
  surveyUrl: string;
  expiryDate: string;
  companyName?: string;
}

export async function sendSurveySMS({
  phoneNumber,
  firstName,
  surveyUrl,
  expiryDate,
  companyName = 'Beacon Wellbeing'
}: SMSMessage) {
  try {
    const message = `Hi ${firstName}! 👋

Time for this week's quick check-in. Takes 2 minutes, completely confidential.

${surveyUrl}

Valid until: ${expiryDate}

- ${companyName}`;

    const result = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber
    });

    return {
      success: true,
      messageId: result.sid,
      status: result.status
    };
  } catch (error) {
    console.error('Twilio SMS error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

export async function sendTestSMS(phoneNumber: string) {
  const testUrl = `${process.env.NEXT_PUBLIC_APP_URL}/survey/test-demo`;
  const expiryDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-AU', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });

  return sendSurveySMS({
    phoneNumber,
    firstName: 'Demo User',
    surveyUrl: testUrl,
    expiryDate,
    companyName: 'Beacon Wellbeing (Demo)'
  });
}

// Validate Twilio configuration
export function validateTwilioConfig() {
  const required = [
    'TWILIO_ACCOUNT_SID',
    'TWILIO_AUTH_TOKEN', 
    'TWILIO_PHONE_NUMBER'
  ];

  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    return {
      valid: false,
      missing,
      message: `Missing Twilio environment variables: ${missing.join(', ')}`
    };
  }

  return {
    valid: true,
    message: 'Twilio configuration is valid'
  };
}



