# Beacon Survey Questions & Flow

## Current Survey Questions (5 Core Questions)

### 1. **Sentiment / Overall**
*"How are you feeling about work this week?"*
- ✅ Good – I'm doing well
- 😐 Okay – Getting by  
- ❌ Not great – I'm struggling

### 2. **Workload / Capacity**
*"How's your workload?"*
- ✅ Manageable
- 😐 Busy but okay
- ❌ Unsustainable

### 3. **Psychological Safety / Voice**
*"Do you feel safe speaking up?"*
- ✅ Comfortable speaking up
- 😐 Sometimes hesitate
- ❌ Don't feel safe raising issues

### 4. **Leadership Support**
*"Do you feel supported by leadership?"*
- ✅ Supported
- 😐 Somewhat supported
- ❌ Not supported

### 5. **Clarity / Direction**
*"Are you clear on what's expected?"*
- ✅ Clear on what's expected
- 😐 Mostly clear
- ❌ Unclear about priorities

---

## Enhanced Survey Flow (NEW)

### **INTRO SCREEN**
**Confidentiality Notice**
> This is a confidential wellbeing check-in. Your responses help us identify systemic issues and improve our workplace culture.
> 
> **How we protect your privacy:**
> - Individual responses are confidential
> - Only aggregated data is shared with leadership
> - If you request support, only your designated contact person will know
> - This is about organisational health, not individual performance
> 
> [Continue to Survey] button

---

### **QUESTIONS 1-5** (Core Survey)
- Standard 3-option questions as above
- Progress indicator (1 of 7, 2 of 7, etc.)

---

### **QUESTION 6: Support Request** (Conditional)
**Trigger:** IF any answer is "struggling" / "not safe" / "not supported" / "unsustainable" / "unclear"

**Screen:**
> "Thank you for sharing. Would you like someone to reach out to offer support?"

- ✅ **Yes, I'd like to be contacted** → Go to Support Options
- ❌ **No thanks, I'm managing** → Go to Comments
- ℹ️ **Tell me more about available support** → Show support info, then ask again

---

### **SUPPORT OPTIONS SCREEN** (If "Yes" selected)
> "Who would you like to connect with?"
> 
> *Select all that apply:*

**Available Contacts:** (Configured per client)
- [ ] HR Team
- [ ] WHS Leader
- [ ] My Direct Manager
- [ ] Senior Leadership
- [ ] EAP (Employee Assistance Program)
- [ ] Union Representative (if applicable)
- [ ] Other (please specify): _______

**How should they contact you?**
- [ ] My work email (pre-filled from employee record)
- [ ] Different email: _______
- [ ] Mobile phone: _______
- [ ] Request anonymous meeting (HR will arrange)

**Preferred timeframe:**
- Within 24 hours
- Within this week
- When convenient

[Continue] button

---

### **QUESTION 7: General Comments** (Always shown)
> "Is there anything else you'd like to share? (Optional)"

[Text area - 500 char limit]

*Your comments are confidential and help us understand the full picture.*

[Continue] button

---

### **RESOURCES SCREEN** (If high-risk scores detected)
**Trigger:** IF any answer is "struggling" / "not safe" / "not supported" / "unsustainable"

**Screen:**
> "Thank you for completing the survey. Remember, you're not alone."
>
> **Immediate Support Available:**

[Button: 📞 Lifeline - 13 11 14] → tel:131114
[Button: 🌐 Beyond Blue - 1300 22 4636] → tel:1300224636  
[Button: 💼 SafeWork Australia] → https://www.safeworkaustralia.gov.au
[Button: 🏥 EAP - 1300 XXX XXX] → tel:client-specific
[Button: 📧 HR Support] → mailto:hr@client.com

*These services are free and confidential.*

[Finish Survey] button

---

### **THANK YOU SCREEN** (Final screen for all users)
> "Thank you for your feedback"
> 
> Your responses help us build a safer, more supportive workplace for everyone.
> 
> **What happens next:**
> - Your individual responses remain confidential
> - Leadership sees only aggregated trends
> - If you requested support, expect contact within your timeframe
> - The next check-in will be sent in 1 week
> 
> **Need immediate help?**
> Contact HR: hr@company.com | 📞 Internal Extension
> 
> [Close] button

---

## Database Schema Updates Needed

### New Fields in `responses_v3` table:
```sql
-- Support request fields
support_requested BOOLEAN DEFAULT FALSE,
support_contacts TEXT[], -- Array of selected contact types
support_contact_method TEXT, -- 'work_email', 'personal_email', 'phone', 'anonymous'
support_contact_value TEXT, -- Email or phone if provided
support_timeframe TEXT, -- '24h', 'this_week', 'flexible'
support_other_details TEXT, -- If 'other' selected

-- Comments
general_comments TEXT,

-- Risk flags (auto-calculated)
high_risk_flag BOOLEAN DEFAULT FALSE,
risk_factors TEXT[], -- e.g., ['safety', 'workload']
```

### New Table: `support_requests`
```sql
CREATE TABLE support_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID REFERENCES clients(id),
  employee_id UUID REFERENCES employees(id),
  response_id UUID REFERENCES responses_v3(id),
  
  contact_types TEXT[], -- ['HR', 'EAP', etc.]
  contact_method TEXT,
  contact_value TEXT,
  preferred_timeframe TEXT,
  
  status TEXT DEFAULT 'pending', -- pending, assigned, contacted, resolved
  assigned_to TEXT,
  assigned_at TIMESTAMPTZ,
  contacted_at TIMESTAMPTZ,
  resolved_at TIMESTAMPTZ,
  resolution_notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## Configuration per Client

Clients can configure:
- Available support contacts (HR, WHS, Managers, EAP, etc.)
- Contact details (phone, email)
- EAP provider details
- Preferred response timeframes
- Custom resource links
- Branding/messaging

---

## Notification Triggers

### For Support Requests:
**Immediate email to:**
- Selected contact person(s)
- Contains: anonymized request details, preferred contact method, timeframe

**Dashboard alert:**
- Shows pending support requests
- Allows assignment and status tracking

### For High-Risk Responses (No support requested):
**Alert to:**
- HR/WHS leadership (aggregated)
- "3 employees flagged high-risk this week, no support requested"
- Allows proactive outreach planning

---

## Analytics Impact

New dashboard widgets:
- **Support Request Rate**: % of respondents requesting help
- **Response Time**: Average time to contact after request
- **Resolution Rate**: % of support requests resolved
- **Resource Usage**: Which support channels are most used
- **Risk Detection**: Early warning system for team wellbeing decline

