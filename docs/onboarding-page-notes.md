# New Client Onboarding Page Requirements

Client requested features and questions to cover when building the onboarding flow.

## Purpose
Create an onboarding page that collects all information required to configure a new client, including API integrations, organisational hierarchy, branding, and survey/dashboard preferences.

## Information to capture
- **API access**: credentials or connection details for any systems we integrate with (HRIS, Identity, etc.).
- **Hierarchy definition**:
  - Provide a downloadable CSV/Excel template matching our schema (divisions → departments → teams → employees).
  - Allow clients to upload the completed template so it can be validated and imported to Supabase.
- **Branding**:
  - Primary/secondary colours, font, logo uploads, dashboard imagery.
  - Where branding elements should appear (survey, dashboard, emails).
- **Dashboard configuration**:
  - Which dashboard modules they need (executive, group leader, analytics).
  - Any bespoke KPIs or charts.
- **Survey configuration**:
  - Question set selection (default vs customised).
  - Additional or replacement questions, language options, high-risk support flow requirements.
- **Cadence & delivery preferences**:
  - Survey frequency and launch dates.
  - Reminder schedule, reporting cadence, stakeholder distribution list.
- **Support & notifications**:
  - Escalation contacts, support email, alert thresholds.
- **Other client-specific requirements**:
  - Data retention/consent notes, authentication method, compliance statements.

## Next steps
- Design the onboarding page UX with sections for each category above.
- Add template download (CSV/Excel) and upload validation pipeline feeding Supabase.
- Persist entries so client can save progress and return later.
- Surface a “Readiness checklist” summary before onboarding completes.

*Notes created from user request on 2025-11-12.*
