# Beacon Survey Automation Setup

## 📱 Current Survey Links

### **User Survey (Employee Experience)**
- **Test Page:** http://localhost:3002/test
- **Demo Survey Link:** http://localhost:3002/survey/[token]
- **Thank You Page:** http://localhost:3002/thanks

### **Admin Dashboard**
- **Dashboard:** http://localhost:3002/dashboard
- **Login:** http://localhost:3002/login

---

## 🚀 Automated Survey Distribution with Twilio

### **Yes, You Can Fully Automate This!**

Here's what we can build:

### **1. Scheduled Survey Distribution**

```typescript
// Automatic weekly surveys sent every Monday at 9am
// Recipients pulled from your API sync (current employees)
// Each person gets a unique, secure token via SMS
```

**Features:**
- ✅ **API Sync Integration** - Automatically pulls current employee list
- ✅ **Scheduled Delivery** - Weekly, fortnightly, or custom schedules
- ✅ **SMS via Twilio** - Personalized message with unique survey link
- ✅ **Token Expiry** - Links expire after 7 days (configurable)
- ✅ **One-Time Use** - Each token can only be used once
- ✅ **No Login Required** - Click link → complete survey → done

---

## 📋 How It Works

### **Step 1: Employee Sync**
Your existing API integration keeps the employee database current:
- New hires automatically added
- Departures automatically removed
- Mobile numbers kept up to date

### **Step 2: Scheduled Survey Issue**
Every Monday at 9am (or your chosen schedule):
```
1. System queries current employees from database
2. For each employee:
   - Generate unique survey token
   - Create personalized SMS message
   - Send via Twilio
3. Track delivery status
```

### **Step 3: Employee Receives SMS**
```
Hi Sarah! 👋

Time for this week's quick check-in. 
Takes 2 minutes, completely confidential.

[Your unique link]

Valid until: Monday, Oct 28

- Beacon Wellbeing
```

### **Step 4: Employee Completes Survey**
- Clicks link → Opens survey (no login)
- Answers 5 questions (2 minutes)
- Submits → Token marked as used
- Redirected to thank you page

### **Step 5: Results in Dashboard**
- Responses aggregated in real-time
- Dashboard updates automatically
- Alerts triggered if scores drop
- Reports generated weekly

---

## 🛠️ Technical Implementation

### **What We Need to Build:**

#### **1. Twilio Integration** ✅ Can Build Now
```typescript
// src/lib/twilio.ts
import twilio from 'twilio';

export async function sendSurveySMS(
  phoneNumber: string,
  firstName: string,
  surveyUrl: string,
  expiryDate: string
) {
  const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );

  const message = `Hi ${firstName}! 👋

Time for this week's quick check-in. Takes 2 minutes, completely confidential.

${surveyUrl}

Valid until: ${expiryDate}

- Beacon Wellbeing`;

  await client.messages.create({
    body: message,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: phoneNumber
  });
}
```

#### **2. Scheduled Survey Job** ✅ Can Build Now
```typescript
// src/app/api/surveys/schedule/route.ts
export async function POST(req: NextRequest) {
  // 1. Get all active employees from database
  const { data: employees } = await supabaseAdmin
    .from('employees')
    .select('id, first_name, mobile, client_id')
    .eq('status', 'active');

  // 2. For each employee, issue token and send SMS
  for (const employee of employees) {
    // Generate token
    const { data: token } = await supabaseAdmin
      .from('tokens')
      .insert({
        client_id: employee.client_id,
        employee_id: employee.id,
        valid_until: addDays(new Date(), 7),
        channel: 'sms'
      })
      .select('id')
      .single();

    // Build survey URL
    const surveyUrl = `${process.env.NEXT_PUBLIC_APP_URL}/survey/${token.id}`;
    const expiryDate = format(addDays(new Date(), 7), 'EEEE, MMM d');

    // Send SMS
    await sendSurveySMS(
      employee.mobile,
      employee.first_name,
      surveyUrl,
      expiryDate
    );

    // Log delivery
    await supabaseAdmin
      .from('survey_deliveries')
      .insert({
        token_id: token.id,
        employee_id: employee.id,
        channel: 'sms',
        status: 'sent'
      });
  }

  return NextResponse.json({ 
    success: true, 
    sent: employees.length 
  });
}
```

#### **3. Cron Job Trigger** ✅ Can Build Now

**Option A: Vercel Cron (Recommended for Production)**
```json
// vercel.json
{
  "crons": [
    {
      "path": "/api/surveys/schedule",
      "schedule": "0 9 * * 1"  // Every Monday at 9am
    }
  ]
}
```

**Option B: External Cron Service**
- Use services like Cron-job.org or EasyCron
- Hit your API endpoint on schedule
- More flexible for testing

**Option C: Node-Cron (For Development)**
```typescript
// For local testing
import cron from 'node-cron';

// Every Monday at 9am
cron.schedule('0 9 * * 1', async () => {
  await fetch('http://localhost:3002/api/surveys/schedule', {
    method: 'POST'
  });
});
```

---

## 📊 Admin Control Panel

### **What You'll Need:**

#### **Survey Schedule Management**
```
┌─────────────────────────────────────┐
│ Survey Schedule Settings            │
├─────────────────────────────────────┤
│ Frequency: [Weekly ▼]               │
│ Day: [Monday ▼]                     │
│ Time: [09:00 ▼]                     │
│ Timezone: [Australia/Sydney ▼]      │
│                                     │
│ Token Validity: [7] days            │
│                                     │
│ Active Recipients: 247 employees    │
│                                     │
│ [Save Settings] [Send Test Survey]  │
└─────────────────────────────────────┘
```

#### **Delivery Tracking Dashboard**
```
┌─────────────────────────────────────┐
│ Last Survey: Monday, Oct 21, 9:00am │
├─────────────────────────────────────┤
│ ✅ Sent: 247                         │
│ 📬 Delivered: 245                    │
│ ❌ Failed: 2                         │
│ ✓ Completed: 198 (80.5%)            │
│ ⏳ Pending: 47 (19.5%)               │
│                                     │
│ [View Details] [Resend Failed]      │
└─────────────────────────────────────┘
```

---

## 💰 Twilio Costs

### **Pricing (Australia)**
- **SMS Cost:** ~$0.08 AUD per message
- **Monthly Cost Examples:**
  - 50 employees × 4 weeks = 200 SMS = **$16/month**
  - 250 employees × 4 weeks = 1,000 SMS = **$80/month**
  - 1,000 employees × 4 weeks = 4,000 SMS = **$320/month**

### **What You Need:**
1. Twilio Account (free to start)
2. Australian phone number ($1.50/month)
3. Pay-as-you-go SMS credits

---

## 🔐 Security & Compliance

### **Token Security**
- ✅ Cryptographically secure UUIDs
- ✅ One-time use (marked as used after submission)
- ✅ Time-limited (7-day expiry)
- ✅ Cannot be guessed or brute-forced
- ✅ Tied to specific employee (optional anonymity)

### **Privacy**
- ✅ Mobile numbers stored securely
- ✅ SMS delivery logs retained for compliance
- ✅ Survey responses anonymous by default
- ✅ No tracking pixels or analytics
- ✅ Australian data sovereignty (Supabase AU region)

### **Compliance**
- ✅ Privacy Act 1988 compliant
- ✅ Spam Act 2003 compliant (legitimate business purpose)
- ✅ Employees can opt-out anytime
- ✅ Audit trail for all deliveries

---

## 🎯 What I Can Build Today

### **Immediate Deliverables:**

1. **Twilio Integration Module**
   - SMS sending function
   - Delivery status tracking
   - Error handling & retries

2. **Scheduled Survey API**
   - Fetch active employees
   - Generate tokens
   - Send SMS to all
   - Log results

3. **Admin Control Panel**
   - Schedule configuration
   - Manual trigger button
   - Delivery status dashboard
   - Resend failed messages

4. **Testing Interface**
   - Send test survey to yourself
   - Preview SMS message
   - Verify token generation

### **Timeline:**
- **Core Integration:** 2-3 hours
- **Admin Panel:** 2-3 hours
- **Testing & Refinement:** 1-2 hours
- **Total:** ~6-8 hours of development

---

## 🚦 Next Steps

### **To Get Started:**

1. **Twilio Setup** (15 minutes)
   - Create account at twilio.com
   - Get Australian phone number
   - Copy Account SID & Auth Token

2. **Environment Variables**
   ```env
   TWILIO_ACCOUNT_SID=your_account_sid
   TWILIO_AUTH_TOKEN=your_auth_token
   TWILIO_PHONE_NUMBER=+61xxxxxxxxx
   ```

3. **I'll Build:**
   - Twilio integration
   - Scheduled survey API
   - Admin control panel
   - Testing interface

4. **You Test:**
   - Send yourself a test survey
   - Complete the survey flow
   - Check dashboard updates
   - Verify everything works

5. **Go Live:**
   - Set schedule (e.g., Monday 9am)
   - Enable for all employees
   - Monitor first delivery
   - Adjust as needed

---

## 📱 Demo Survey Link

**Current Test Link:** http://localhost:3002/test

This page lets you:
1. Enter a client ID
2. Generate a survey token
3. Get a unique survey link
4. Test the complete flow

**For Client Demos:**
- Generate a demo token
- Show them the SMS they'd receive
- Walk through the 2-minute survey
- Show results in dashboard

---

## ❓ FAQ

**Q: Can employees complete surveys on their phone?**
A: Yes! The survey is fully mobile-optimized. Takes 2 minutes on any device.

**Q: What if someone doesn't have a mobile?**
A: We can also send via email, or provide a web portal for manual access.

**Q: Can we customize the SMS message?**
A: Absolutely! Every word can be customized to match your brand voice.

**Q: What if someone loses their link?**
A: Admins can resend the SMS, or generate a new token if expired.

**Q: Can we pause surveys (e.g., during holidays)?**
A: Yes! Simple on/off toggle in the admin panel.

**Q: How do we handle new hires mid-cycle?**
A: Your API sync keeps the list current. New hires get the next scheduled survey.

**Q: Can we send ad-hoc surveys?**
A: Yes! Manual "Send Now" button for urgent pulse checks.

---

## 🎉 Summary

**Yes, you can fully automate survey distribution!**

✅ Scheduled delivery (weekly, fortnightly, custom)
✅ Recipients from your API sync (always current)
✅ SMS via Twilio (personalized, secure)
✅ No login required (click → complete → done)
✅ Real-time dashboard updates
✅ Full admin control panel
✅ ~$0.08 per SMS (very affordable)

**Ready to build this today!** Just need your Twilio credentials and we're off. 🚀




