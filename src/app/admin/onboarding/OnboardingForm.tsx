'use client';

import { useState } from 'react';
import { MaterialIcon } from '@/components/ui/MaterialIcon';

function readFileAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      resolve(base64 ?? '');
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export function OnboardingForm() {
  const [submitting, setSubmitting] = useState(false);
  const [successId, setSuccessId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setSuccessId(null);
    setError(null);

    const formData = new FormData(event.currentTarget);

    const hierarchyFile = formData.get('hierarchyFile') as File | null;
    const brandingFile = formData.get('brandingFile') as File | null;

    let hierarchyUpload: any = null;
    let brandingUpload: any = null;

    try {
      if (hierarchyFile && hierarchyFile.size > 0) {
        hierarchyUpload = {
          name: hierarchyFile.name,
          size: hierarchyFile.size,
          base64: await readFileAsBase64(hierarchyFile)
        };
      }
      if (brandingFile && brandingFile.size > 0) {
        brandingUpload = {
          name: brandingFile.name,
          size: brandingFile.size,
          base64: await readFileAsBase64(brandingFile)
        };
      }
    } catch (fileError) {
      console.error(fileError);
      setError('Unable to read uploaded files. Please try again.');
      setSubmitting(false);
      return;
    }

    const payload = {
      company: formData.get('company') ?? '',
      primaryContact: {
        name: formData.get('primaryContactName') ?? '',
        email: formData.get('primaryContactEmail') ?? '',
        phone: formData.get('primaryContactPhone') ?? ''
      },
      expectedGoLive: formData.get('expectedGoLive') ?? '',
      apiDetails: formData.get('apiDetails') ?? '',
      integrations: formData.getAll('integrations'),
      hierarchy: {
        notes: formData.get('hierarchyNotes') ?? '',
        upload: hierarchyUpload,
      },
      branding: {
        primaryColor: formData.get('primaryColor') ?? '',
        secondaryColor: formData.get('secondaryColor') ?? '',
        fontFamily: formData.get('fontFamily') ?? '',
        logoUrl: formData.get('logoUrl') ?? '',
        upload: brandingUpload,
      },
      dashboards: formData.getAll('dashboards'),
      survey: {
        questionSet: formData.get('questionSet') ?? 'standard',
        customQuestions: formData.get('customQuestions') ?? '',
        languages: formData.getAll('languages'),
        highRiskProcess: formData.get('highRiskProcess') ?? '',
      },
      cadence: {
        surveyFrequency: formData.get('surveyFrequency') ?? '',
        launchDate: formData.get('launchDate') ?? '',
        reminderSchedule: formData.get('reminderSchedule') ?? '',
        distributionList: formData.get('distributionList') ?? '',
      },
      compliance: formData.get('complianceNotes') ?? '',
      additionalNotes: formData.get('additionalNotes') ?? '',
      createdAt: new Date().toISOString(),
    };

    try {
      const response = await fetch('/api/admin/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || 'Submission failed');
      }

      const result = await response.json();
      setSuccessId(result.id ?? null);
      event.currentTarget.reset();
    } catch (submissionError: any) {
      console.error(submissionError);
      setError(submissionError.message || 'Unexpected error during submission.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="bg-white rounded-2xl shadow-sm border border-[#e2e8f0] p-8">
      <div className="flex items-start gap-3 mb-6">
        <MaterialIcon icon="pending_actions" style={{ fontSize: '28px', color: '#64afac' }} />
        <div>
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">New Client Intake Form</h2>
          <p className="text-sm text-[var(--text-muted)]">
            Complete this checklist with the client. Required fields are marked with *. A copy of the request will be
            saved internally and forwarded to the onboarding team for action.
          </p>
        </div>
      </div>

      <form className="space-y-10" onSubmit={handleSubmit}>
        {/* Company Overview */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <MaterialIcon icon="apartment" style={{ fontSize: '22px', color: '#2B4162' }} />
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">Company overview</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-[var(--text-primary)]">Organisation name *</label>
              <input
                name="company"
                required
                className="mt-1 w-full rounded-lg border border-[#e2e8f0] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#64afac]"
                placeholder="Beacon Health"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-[var(--text-primary)]">Expected go-live date</label>
              <input
                type="date"
                name="expectedGoLive"
                className="mt-1 w-full rounded-lg border border-[#e2e8f0] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#64afac]"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-[var(--text-primary)]">Primary contact *</label>
              <input
                name="primaryContactName"
                required
                className="mt-1 w-full rounded-lg border border-[#e2e8f0] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#64afac]"
                placeholder="Jordan Smith"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-[var(--text-primary)]">Contact email *</label>
              <input
                type="email"
                name="primaryContactEmail"
                required
                className="mt-1 w-full rounded-lg border border-[#e2e8f0] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#64afac]"
                placeholder="jordan@example.com"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-[var(--text-primary)]">Contact phone</label>
              <input
                name="primaryContactPhone"
                className="mt-1 w-full rounded-lg border border-[#e2e8f0] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#64afac]"
                placeholder="+61 400 000 000"
              />
            </div>
          </div>
        </section>

        {/* API & Integrations */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <MaterialIcon icon="hub" style={{ fontSize: '22px', color: '#2B4162' }} />
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">Integrations & API access</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <fieldset className="border border-[#e2e8f0] rounded-lg p-4">
              <legend className="px-2 text-xs uppercase tracking-wide text-[var(--text-muted)]">Systems to connect</legend>
              <label className="flex items-center gap-2 text-sm text-[var(--text-primary)]">
                <input type="checkbox" name="integrations" value="Workday" className="rounded" /> Workday
              </label>
              <label className="flex items-center gap-2 text-sm text-[var(--text-primary)]">
                <input type="checkbox" name="integrations" value="SAP SuccessFactors" className="rounded" /> SAP SuccessFactors
              </label>
              <label className="flex items-center gap-2 text-sm text-[var(--text-primary)]">
                <input type="checkbox" name="integrations" value="Microsoft Entra" className="rounded" /> Microsoft Entra / Azure AD
              </label>
              <label className="flex items-center gap-2 text-sm text-[var(--text-primary)]">
                <input type="checkbox" name="integrations" value="Payroll" className="rounded" /> Payroll export
              </label>
              <label className="flex items-center gap-2 text-sm text-[var(--text-primary)]">
                <input type="checkbox" name="integrations" value="Other" className="rounded" /> Other (detail below)
              </label>
            </fieldset>
            <div>
              <label className="text-sm font-medium text-[var(--text-primary)]">API credentials / connection notes</label>
              <textarea
                name="apiDetails"
                rows={6}
                className="mt-1 w-full rounded-lg border border-[#e2e8f0] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#64afac]"
                placeholder="Provide endpoints, authentication method, requester account name, or attach a file below"
              />
            </div>
          </div>
        </section>

        {/* Hierarchy */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <MaterialIcon icon="account_tree" style={{ fontSize: '22px', color: '#2B4162' }} />
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">Hierarchy structure</h3>
          </div>
          <p className="text-sm text-[var(--text-muted)]">
            Download the template, populate divisions → departments → teams → employees, then upload the completed file.
            We will validate and import to Supabase automatically.
          </p>
          <div className="grid md:grid-cols-2 gap-4 items-end">
            <a
              href="/templates/hierarchy-template.csv"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[#64afac] text-[#64afac] hover:bg-[#64afac]/10 transition-all"
              download
            >
              <MaterialIcon icon="download" style={{ fontSize: '20px' }} />
              Download hierarchy template
            </a>
            <div>
              <label className="text-sm font-medium text-[var(--text-primary)]">Upload completed hierarchy</label>
              <input
                type="file"
                name="hierarchyFile"
                accept=".csv,.xlsx,.xls"
                className="mt-1 w-full rounded-lg border border-dashed border-[#e2e8f0] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#64afac]"
              />
            </div>
          </div>
          <textarea
            name="hierarchyNotes"
            rows={3}
            className="w-full rounded-lg border border-[#e2e8f0] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#64afac]"
            placeholder="Additional hierarchy notes, e.g. contractor rules, nested teams, naming conventions"
          />
        </section>

        {/* Branding */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <MaterialIcon icon="palette" style={{ fontSize: '22px', color: '#2B4162' }} />
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">Branding</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-[var(--text-primary)]">Primary colour</label>
              <input
                type="text"
                name="primaryColor"
                placeholder="#1A936F"
                className="mt-1 w-full rounded-lg border border-[#e2e8f0] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#64afac]"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-[var(--text-primary)]">Secondary colour</label>
              <input
                type="text"
                name="secondaryColor"
                placeholder="#64AFAc"
                className="mt-1 w-full rounded-lg border border-[#e2e8f0] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#64afac]"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-[var(--text-primary)]">Preferred font family</label>
              <input
                type="text"
                name="fontFamily"
                placeholder="Inter, sans-serif"
                className="mt-1 w-full rounded-lg border border-[#e2e8f0] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#64afac]"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-[var(--text-primary)]">Logo / brand kit upload</label>
              <input
                type="file"
                name="brandingFile"
                accept=".png,.jpg,.jpeg,.svg,.pdf,.zip"
                className="mt-1 w-full rounded-lg border border-dashed border-[#e2e8f0] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#64afac]"
              />
            </div>
          </div>
          <input
            type="url"
            name="logoUrl"
            placeholder="Link to branding guidelines or intranet"
            className="w-full rounded-lg border border-[#e2e8f0] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#64afac]"
          />
        </section>

        {/* Dashboard modules */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <MaterialIcon icon="dashboard_customize" style={{ fontSize: '22px', color: '#2B4162' }} />
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">Dashboards required</h3>
          </div>
          <div className="grid md:grid-cols-3 gap-4 text-sm text-[var(--text-primary)]">
            {['Executive Overview', 'Group Leader View', 'Live Analytics', 'Survey Administration', 'Download Portal', 'External API'].map(name => (
              <label key={name} className="flex items-center gap-2 rounded-lg border border-[#e2e8f0] px-3 py-2 hover:border-[#64afac] transition-colors">
                <input type="checkbox" name="dashboards" value={name} className="rounded" />
                {name}
              </label>
            ))}
          </div>
        </section>

        {/* Survey setup */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <MaterialIcon icon="quiz" style={{ fontSize: '22px', color: '#2B4162' }} />
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">Survey configuration</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="text-xs uppercase tracking-wide text-[var(--text-muted)]">Question set</div>
              <label className="flex items-center gap-2 text-sm text-[var(--text-primary)]">
                <input type="radio" name="questionSet" value="standard" defaultChecked className="rounded" /> Use Beacon standard 5 questions
              </label>
              <label className="flex items-center gap-2 text-sm text-[var(--text-primary)]">
                <input type="radio" name="questionSet" value="custom" className="rounded" /> Custom question set (outline below)
              </label>
              <textarea
                name="customQuestions"
                rows={4}
                className="w-full rounded-lg border border-[#e2e8f0] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#64afac]"
                placeholder="Add custom or replacement questions here"
              />
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-[var(--text-primary)]">Languages required</label>
                <div className="grid grid-cols-2 gap-2 text-sm text-[var(--text-primary)]">
                  {['English', 'Spanish', 'French', 'Mandarin', 'Hindi', 'Other'].map(language => (
                    <label key={language} className="flex items-center gap-2">
                      <input type="checkbox" name="languages" value={language} className="rounded" />
                      {language}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-[var(--text-primary)]">High-risk support workflow</label>
                <textarea
                  name="highRiskProcess"
                  rows={3}
                  className="w-full rounded-lg border border-[#e2e8f0] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#64afac]"
                  placeholder="Escalation contacts, expected response SLAs, wellbeing partners"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Cadence */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <MaterialIcon icon="schedule" style={{ fontSize: '22px', color: '#2B4162' }} />
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">Survey cadence & reporting</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-[var(--text-primary)]">Survey frequency</label>
              <select
                name="surveyFrequency"
                className="mt-1 w-full rounded-lg border border-[#e2e8f0] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#64afac]"
              >
                <option value="">Select frequency</option>
                <option value="weekly">Weekly</option>
                <option value="fortnightly">Fortnightly</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-[var(--text-primary)]">Survey launch date</label>
              <input
                type="date"
                name="launchDate"
                className="mt-1 w-full rounded-lg border border-[#e2e8f0] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#64afac]"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-[var(--text-primary)]">Reminder cadence / close date</label>
              <input
                name="reminderSchedule"
                className="mt-1 w-full rounded-lg border border-[#e2e8f0] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#64afac]"
                placeholder="e.g. Reminder after 2 days, close after 5 days"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-[var(--text-primary)]">Reporting distribution list</label>
              <textarea
                name="distributionList"
                rows={3}
                className="mt-1 w-full rounded-lg border border-[#e2e8f0] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#64afac]"
                placeholder="Emails / roles who should receive dashboards and summary reports"
              />
            </div>
          </div>
        </section>

        {/* Compliance & notes */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <MaterialIcon icon="gavel" style={{ fontSize: '22px', color: '#2B4162' }} />
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">Compliance & additional notes</h3>
          </div>
          <textarea
            name="complianceNotes"
            rows={3}
            className="w-full rounded-lg border border-[#e2e8f0] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#64afac]"
            placeholder="Data retention, consent, security or legal requirements"
          />
          <textarea
            name="additionalNotes"
            rows={4}
            className="w-full rounded-lg border border-[#e2e8f0] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#64afac]"
            placeholder="Anything else we should know before the onboarding call"
          />
        </section>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <strong>Error:</strong> {error}
          </div>
        )}
        {successId && (
          <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            ✅ Onboarding request saved. Reference ID <strong>#{successId}</strong>. We will be in touch shortly.
          </div>
        )}

        <div className="flex items-center justify-end gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 rounded-lg bg-[#2B4162] px-5 py-2 text-white font-semibold hover:bg-[#23334c] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <MaterialIcon icon={submitting ? 'hourglass_top' : 'send'} style={{ fontSize: '20px' }} />
            {submitting ? 'Submitting...' : 'Submit onboarding request'}
          </button>
        </div>
      </form>
    </section>
  );
}
