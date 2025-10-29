# Support Path Implementation Summary

## ✅ Implementation Complete

The Support Path workflow has been fully implemented according to the specification in `SURVEY_QUESTIONS.md`. This provides a comprehensive support system for respondents who indicate struggling in their survey responses.

## What Was Implemented

### 1. Support Path Components

Created four new React components:

- **`SupportPath.tsx`** - Main orchestrator that manages the flow between screens
- **`SupportRequestScreen.tsx`** - Initial prompt asking if user wants support
- **`SupportOptionsScreen.tsx`** - Detailed form for selecting contacts and preferences
- **`CrisisResourcesScreen.tsx`** - Emergency resources and contact buttons

### 2. SurveyForm Integration

Updated `SurveyForm.tsx` to:
- Automatically detect high-risk responses (value = 3 on any question)
- Track risk factors (workload, safety, support, overall)
- Show Support Path when high-risk is detected
- Submit support request data along with survey responses

### 3. API & Database Updates

#### API Route (`src/app/api/responses/route.ts`)
- Added support for support request fields in request validation
- Fields include: `support_requested`, `support_contacts`, `support_contact_method`, `support_contact_value`, `support_timeframe`, `support_other_details`, `high_risk_flag`, `risk_factors`

#### Database Schema (`database-schema-support-path.sql`)
- Migrations to add support fields to `responses_v3` table
- New `support_requests` table for tracking support workflows
- Automatic trigger to create support request records when `support_requested = true`
- Indexes for performance and RLS policies

## How It Works

### Trigger Logic

Support Path is triggered when **any** response is high-risk (value = 3):
- **Workload**: "Unsustainable"
- **Safety**: "Don't feel safe raising issues"  
- **Leadership**: "Not supported"
- **Sentiment**: "Not great – I'm struggling"

### User Flow

1. User completes all 5 survey questions
2. If any high-risk responses detected:
   - Show "Support Available" screen
   - Present Support Request prompt
3. User chooses to request support or skip
4. If requesting:
   - Select who to contact (HR, WHS, Manager, EAP, etc.)
   - Choose contact method (email, phone, anonymous)
   - Select preferred timeframe
5. Show Crisis Resources (always shown for high-risk)
   - Clickable buttons for emergency services
   - Lifeline, Beyond Blue, SafeWork Australia, EAP, HR
6. Submit survey with support data included

## Configuration

The `SupportOptionsScreen` currently includes these default contacts:
- HR Team
- WHS Leader  
- My Direct Manager
- Senior Leadership
- EAP (Employee Assistance Program)
- Union Representative
- Other

**Note**: These are configurable per client. To customize for a specific client, modify the `availableContacts` array in `SupportOptionsScreen.tsx`.

## Database Migration Required

⚠️ **Important**: You must run the database migration before deploying:

```bash
# In your Supabase SQL editor, run:
database-schema-support-path.sql
```

This will:
1. Add support fields to `responses_v3` table
2. Create `support_requests` table
3. Add indexes for performance
4. Create trigger for automatic support request creation

## Future Enhancements

Potential improvements:
1. Client-specific support contact configuration from database
2. Dashboard views for tracking support requests
3. Email notifications to selected contacts
4. Support request workflow management (assign, contact, resolve)
5. Analytics on support request rates and outcomes

## Testing

To test the Support Path:

1. Complete survey with all "good" responses → No support path shown
2. Complete survey with any "struggling" (3) response → Support path shown
3. Select different support options and verify data is captured
4. Check database for `support_requested` flag and `support_requests` table entries

## Files Created/Modified

### New Files
- `src/components/survey/SupportPath.tsx`
- `src/components/survey/SupportRequestScreen.tsx`
- `src/components/survey/SupportOptionsScreen.tsx`
- `src/components/survey/CrisisResourcesScreen.tsx`
- `database-schema-support-path.sql`
- `SUPPORT_PATH_IMPLEMENTATION.md` (this file)

### Modified Files
- `src/components/survey/SurveyForm.tsx`
- `src/app/api/responses/route.ts`
- `SURVEY_QUESTION_UPDATE.md`

## Status

✅ All components created and integrated  
✅ Database schema migration ready  
✅ API updated to handle support fields  
✅ High-risk detection logic implemented  
✅ Full Support Path workflow functional  
✅ Linting passed with no errors

Ready for deployment after running database migration.


