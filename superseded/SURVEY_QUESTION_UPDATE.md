# Survey Question Update

## Change Summary

**Question 1 - Sentiment/Overall**

**Old:** "How are you feeling overall about your work situation?"

**New:** "How are you feeling about work this week?"

---

## Support Path Implementation ✅

**NEW:** Support Path workflow triggered by high-risk responses has been fully implemented.

### When Support Path Triggers
Support Path is automatically shown when any response indicates struggling:
- Workload: "Unsustainable"
- Safety: "Don't feel safe raising issues"
- Leadership: "Not supported"
- Sentiment: "Not great – I'm struggling"

### Support Path Flow

1. **Support Request Screen** - Asks "Would you like someone to reach out?"
   - Options: Yes, No, Tell me more
   
2. **Support Options Screen** (shown if "Yes" selected)
   - Who: Select from HR, WHS Leader, Manager, EAP, Union, Other
   - How: Choose contact method (work email, personal email, phone, anonymous meeting)
   - When: Preferred timeframe (24 hours, this week, flexible)
   
3. **Crisis Resources Screen** (shown for all high-risk responses)
   - Lifeline: 13 11 14
   - Beyond Blue: 1300 22 4636
   - SafeWork Australia
   - EAP provider
   - HR contact

4. **Thank You** - Confirms next steps and support timeline

## Files Updated ✅

### New Support Path Components
- ✅ `src/components/survey/SupportPath.tsx` - Main orchestrator component
- ✅ `src/components/survey/SupportRequestScreen.tsx` - Initial support request prompt
- ✅ `src/components/survey/SupportOptionsScreen.tsx` - Contact selection and preferences
- ✅ `src/components/survey/CrisisResourcesScreen.tsx` - Emergency resources display

### Updated Survey Components
- ✅ `src/components/survey/SurveyForm.tsx` - Integrated Support Path with high-risk detection
- ✅ `src/components/survey/Question.tsx`
- ✅ `src/components/survey/MobileSurvey.tsx`
- ✅ `src/app/survey-preview/page.tsx`

### API & Database
- ✅ `src/app/api/responses/route.ts` - Added support request fields to API
- ✅ `database-schema-support-path.sql` - Database migration for support tracking

### Dashboard
- ✅ `src/app/dashboard/page.tsx`
- ✅ `src/app/dashboard/trends/page.tsx`

### Documentation
- ✅ `SURVEY_QUESTIONS.md`
- ✅ `SURVEY_FLOWCHART.md`
- ✅ `BEACON_CLIENT_SUMMARY.md`
- ✅ `marketing-for-gamma/BEACON_CLIENT_SUMMARY.md`
- ✅ `SURVEY_QUESTION_UPDATE.md` (this file)

### Presentation Materials
- ✅ `public/presentation-pdfs/Beacon-Platform-Summary.html`
- ✅ `public/presentation-pdfs/Beacon-Survey-Questions.html`

## Rationale

The new question is:
- More specific: "this week" focuses on recent timeframe
- Shorter and clearer
- Aligns with weekly pulse survey frequency
- Less formal/corporate language

## Response Options (Unchanged)
- ✅ Good – I'm doing well
- 😐 Okay – Getting by
- ❌ Not great – I'm struggling


