import { MaterialIcon } from '@/components/ui/MaterialIcon';
import { PublicHeader } from '@/components/layout/PublicHeader';

export default function FeaturesPage() {
  return (
    <main className="min-h-screen bg-white">
      <PublicHeader />

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#2B4162] via-[#5d89a9] to-[#64afac] py-20">
        <div className="max-w-4xl mx-auto px-6 text-center text-white">
          <h1 className="text-5xl font-bold mb-6">Features Built for Real Organisations</h1>
          <p className="text-xl leading-relaxed opacity-90">
            Everything you need to monitor, understand, and improve workplace wellbeing—from 
            the employee experience to executive dashboards.
          </p>
        </div>
      </section>

      {/* For Employees */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center gap-4 mb-8">
            <MaterialIcon icon="person" style={{ fontSize: '48px', color: '#64afac' }} />
            <h2 className="text-3xl font-bold" style={{ color: '#2B4162' }}>For Employees</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-[#f4f4ee] to-white p-6 rounded-xl border-2" style={{ borderColor: '#64afac' }}>
              <MaterialIcon icon="schedule" style={{ fontSize: '40px', color: '#64afac', marginBottom: '16px' }} />
              <h3 className="text-xl font-bold mb-3" style={{ color: '#2B4162' }}>60-Second Surveys</h3>
              <p className="text-[#737A8C] mb-4">
                Quick, weekly pulse checks that take less than a minute. Five simple questions about mood, 
                workload, safety, support, and clarity.
              </p>
              <ul className="space-y-2 text-sm text-[#737A8C]">
                <li className="flex items-start gap-2">
                  <MaterialIcon icon="check_circle" style={{ fontSize: '16px', color: '#64afac' }} />
                  <span>Delivered via SMS or email</span>
                </li>
                <li className="flex items-start gap-2">
                  <MaterialIcon icon="check_circle" style={{ fontSize: '16px', color: '#64afac' }} />
                  <span>No login required—one-click access</span>
                </li>
                <li className="flex items-start gap-2">
                  <MaterialIcon icon="check_circle" style={{ fontSize: '16px', color: '#64afac' }} />
                  <span>Mobile-optimised interface</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-[#eeefec] to-white p-6 rounded-xl border-2" style={{ borderColor: '#5d89a9' }}>
              <MaterialIcon icon="security" style={{ fontSize: '40px', color: '#5d89a9', marginBottom: '16px' }} />
              <h3 className="text-xl font-bold mb-3" style={{ color: '#2B4162' }}>Complete Anonymity</h3>
              <p className="text-[#737A8C] mb-4">
                Your responses are completely anonymous. No identifying information is collected or stored, 
                encouraging honest feedback.
              </p>
              <ul className="space-y-2 text-sm text-[#737A8C]">
                <li className="flex items-start gap-2">
                  <MaterialIcon icon="check_circle" style={{ fontSize: '16px', color: '#5d89a9' }} />
                  <span>Single-use survey tokens</span>
                </li>
                <li className="flex items-start gap-2">
                  <MaterialIcon icon="check_circle" style={{ fontSize: '16px', color: '#5d89a9' }} />
                  <span>No tracking or analytics</span>
                </li>
                <li className="flex items-start gap-2">
                  <MaterialIcon icon="check_circle" style={{ fontSize: '16px', color: '#5d89a9' }} />
                  <span>Leadership sees aggregated data only</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-[#f4f4ee] to-white p-6 rounded-xl border-2" style={{ borderColor: '#64afac' }}>
              <MaterialIcon icon="psychology" style={{ fontSize: '40px', color: '#64afac', marginBottom: '16px' }} />
              <h3 className="text-xl font-bold mb-3" style={{ color: '#2B4162' }}>Evidence-Based Questions</h3>
              <p className="text-[#737A8C] mb-4">
                Questions designed by psychologists based on validated research. Measures what actually predicts 
                burnout, turnover, and workplace stress.
              </p>
              <ul className="space-y-2 text-sm text-[#737A8C]">
                <li className="flex items-start gap-2">
                  <MaterialIcon icon="check_circle" style={{ fontSize: '16px', color: '#64afac' }} />
                  <span>Based on Job Demand-Control-Support model</span>
                </li>
                <li className="flex items-start gap-2">
                  <MaterialIcon icon="check_circle" style={{ fontSize: '16px', color: '#64afac' }} />
                  <span>Aligned with Psychological Safety research</span>
                </li>
                <li className="flex items-start gap-2">
                  <MaterialIcon icon="check_circle" style={{ fontSize: '16px', color: '#64afac' }} />
                  <span>Covers all psychosocial risk factors</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-[#eeefec] to-white p-6 rounded-xl border-2" style={{ borderColor: '#5d89a9' }}>
              <MaterialIcon icon="support" style={{ fontSize: '40px', color: '#5d89a9', marginBottom: '16px' }} />
              <h3 className="text-xl font-bold mb-3" style={{ color: '#2B4162' }}>Conditional Support Pathways</h3>
              <p className="text-[#737A8C] mb-4">
                If someone indicates they're struggling, Beacon automatically provides resources, support options, 
                and crisis contacts.
              </p>
              <ul className="space-y-2 text-sm text-[#737A8C]">
                <li className="flex items-start gap-2">
                  <MaterialIcon icon="check_circle" style={{ fontSize: '16px', color: '#5d89a9' }} />
                  <span>Immediate help for urgent concerns</span>
                </li>
                <li className="flex items-start gap-2">
                  <MaterialIcon icon="check_circle" style={{ fontSize: '16px', color: '#5d89a9' }} />
                  <span>EAP and counseling contact info</span>
                </li>
                <li className="flex items-start gap-2">
                  <MaterialIcon icon="check_circle" style={{ fontSize: '16px', color: '#5d89a9' }} />
                  <span>Option to flag for manager follow-up</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* For Leaders */}
      <section className="py-16 bg-[#f4f4ee]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center gap-4 mb-8">
            <MaterialIcon icon="supervisor_account" style={{ fontSize: '48px', color: '#5d89a9' }} />
            <h2 className="text-3xl font-bold" style={{ color: '#2B4162' }}>For Leaders & Executives</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <MaterialIcon icon="dashboard" style={{ fontSize: '40px', color: '#64afac', marginBottom: '12px' }} />
              <h3 className="text-lg font-bold mb-2" style={{ color: '#2B4162' }}>Real-Time Dashboard</h3>
              <p className="text-sm text-[#737A8C]">
                Executive dashboard with overall wellbeing score, trend analysis, and drill-down by division, 
                department, and team.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <MaterialIcon icon="trending_up" style={{ fontSize: '40px', color: '#64afac', marginBottom: '12px' }} />
              <h3 className="text-lg font-bold mb-2" style={{ color: '#2B4162' }}>Trend Analysis</h3>
              <p className="text-sm text-[#737A8C]">
                Track changes over time (weekly, monthly, quarterly). See which teams are improving and which 
                need attention.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <MaterialIcon icon="insights" style={{ fontSize: '40px', color: '#64afac', marginBottom: '12px' }} />
              <h3 className="text-lg font-bold mb-2" style={{ color: '#2B4162' }}>AI-Powered Insights</h3>
              <p className="text-sm text-[#737A8C]">
                Automated summaries highlighting what needs attention, comparative insights, and early warning 
                signals for at-risk teams.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <MaterialIcon icon="filter_list" style={{ fontSize: '40px', color: '#5d89a9', marginBottom: '12px' }} />
              <h3 className="text-lg font-bold mb-2" style={{ color: '#2B4162' }}>Hierarchical Drill-Down</h3>
              <p className="text-sm text-[#737A8C]">
                View data by whole organisation, division, department, team, or project. Click to drill deeper 
                into problem areas.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <MaterialIcon icon="warning" style={{ fontSize: '40px', color: '#5d89a9', marginBottom: '12px' }} />
              <h3 className="text-lg font-bold mb-2" style={{ color: '#2B4162' }}>Automated Alerts</h3>
              <p className="text-sm text-[#737A8C]">
                Get notified when wellbeing scores drop below thresholds or when response rates indicate 
                engagement issues.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <MaterialIcon icon="download" style={{ fontSize: '40px', color: '#5d89a9', marginBottom: '12px' }} />
              <h3 className="text-lg font-bold mb-2" style={{ color: '#2B4162' }}>Export & Reporting</h3>
              <p className="text-sm text-[#737A8C]">
                Download data as CSV for analysis in Excel or Power BI. Print-optimised reports for board 
                presentations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* For HR & Safety Teams */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center gap-4 mb-8">
            <MaterialIcon icon="admin_panel_settings" style={{ fontSize: '48px', color: '#64afac' }} />
            <h2 className="text-3xl font-bold" style={{ color: '#2B4162' }}>For HR & Safety Teams</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-[#f4f4ee] to-white p-6 rounded-xl border-2" style={{ borderColor: '#64afac' }}>
              <MaterialIcon icon="gavel" style={{ fontSize: '40px', color: '#64afac', marginBottom: '16px' }} />
              <h3 className="text-xl font-bold mb-3" style={{ color: '#2B4162' }}>Compliance Reporting</h3>
              <p className="text-[#737A8C] mb-4">
                Meet psychosocial safety obligations with documented evidence of systematic monitoring, risk 
                identification, and intervention tracking.
              </p>
              <ul className="space-y-2 text-sm text-[#737A8C]">
                <li className="flex items-start gap-2">
                  <MaterialIcon icon="check_circle" style={{ fontSize: '16px', color: '#64afac' }} />
                  <span>Aligned with NSW WHS framework</span>
                </li>
                <li className="flex items-start gap-2">
                  <MaterialIcon icon="check_circle" style={{ fontSize: '16px', color: '#64afac' }} />
                  <span>ISO 45003 compliant methodology</span>
                </li>
                <li className="flex items-start gap-2">
                  <MaterialIcon icon="check_circle" style={{ fontSize: '16px', color: '#64afac' }} />
                  <span>Audit-ready documentation</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-[#eeefec] to-white p-6 rounded-xl border-2" style={{ borderColor: '#5d89a9' }}>
              <MaterialIcon icon="assessment" style={{ fontSize: '40px', color: '#5d89a9', marginBottom: '16px' }} />
              <h3 className="text-xl font-bold mb-3" style={{ color: '#2B4162' }}>Advanced Analytics</h3>
              <p className="text-[#737A8C] mb-4">
                Statistical process control charts, correlation matrices, distribution histograms, and predictive 
                analytics for proactive intervention.
              </p>
              <ul className="space-y-2 text-sm text-[#737A8C]">
                <li className="flex items-start gap-2">
                  <MaterialIcon icon="check_circle" style={{ fontSize: '16px', color: '#5d89a9' }} />
                  <span>Control limits for abnormal variation</span>
                </li>
                <li className="flex items-start gap-2">
                  <MaterialIcon icon="check_circle" style={{ fontSize: '16px', color: '#5d89a9' }} />
                  <span>Response distribution analysis</span>
                </li>
                <li className="flex items-start gap-2">
                  <MaterialIcon icon="check_circle" style={{ fontSize: '16px', color: '#5d89a9' }} />
                  <span>Individual trajectory tracking</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-[#f4f4ee] to-white p-6 rounded-xl border-2" style={{ borderColor: '#64afac' }}>
              <MaterialIcon icon="group" style={{ fontSize: '40px', color: '#64afac', marginBottom: '16px' }} />
              <h3 className="text-xl font-bold mb-3" style={{ color: '#2B4162' }}>Employee Management</h3>
              <p className="text-[#737A8C] mb-4">
                Manage employee lists, organisational structure, and survey distribution. Live Connection ensures 
                current staff and nominated groups only, with automatic updates and role-based access.
              </p>
              <ul className="space-y-2 text-sm text-[#737A8C]">
                <li className="flex items-start gap-2">
                  <MaterialIcon icon="check_circle" style={{ fontSize: '16px', color: '#64afac' }} />
                  <span>CSV import/export</span>
                </li>
                <li className="flex items-start gap-2">
                  <MaterialIcon icon="check_circle" style={{ fontSize: '16px', color: '#64afac' }} />
                  <span>API integration with HRIS</span>
                </li>
                <li className="flex items-start gap-2">
                  <MaterialIcon icon="check_circle" style={{ fontSize: '16px', color: '#64afac' }} />
                  <span>Automatic onboarding/offboarding</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-[#eeefec] to-white p-6 rounded-xl border-2" style={{ borderColor: '#5d89a9' }}>
              <MaterialIcon icon="calendar_month" style={{ fontSize: '40px', color: '#5d89a9', marginBottom: '16px' }} />
              <h3 className="text-xl font-bold mb-3" style={{ color: '#2B4162' }}>Flexible Scheduling</h3>
              <p className="text-[#737A8C] mb-4">
                Configure survey frequency, delivery times, and reminder schedules. Support for multiple time zones 
                and shift workers.
              </p>
              <ul className="space-y-2 text-sm text-[#737A8C]">
                <li className="flex items-start gap-2">
                  <MaterialIcon icon="check_circle" style={{ fontSize: '16px', color: '#5d89a9' }} />
                  <span>Weekly, fortnightly, or monthly cadence</span>
                </li>
                <li className="flex items-start gap-2">
                  <MaterialIcon icon="check_circle" style={{ fontSize: '16px', color: '#5d89a9' }} />
                  <span>Timezone-aware delivery</span>
                </li>
                <li className="flex items-start gap-2">
                  <MaterialIcon icon="check_circle" style={{ fontSize: '16px', color: '#5d89a9' }} />
                  <span>Automated reminders</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Security & Privacy */}
      <section className="py-16 bg-[#eeefec]">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-8 text-center" style={{ color: '#2B4162' }}>Security & Privacy</h2>
          
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl text-center shadow-sm">
              <MaterialIcon icon="lock" style={{ fontSize: '48px', color: '#64afac', marginBottom: '12px' }} />
              <h3 className="font-bold mb-2" style={{ color: '#2B4162' }}>Encrypted</h3>
              <p className="text-sm text-[#737A8C]">AES-256 at rest, TLS 1.3 in transit</p>
            </div>

            <div className="bg-white p-6 rounded-xl text-center shadow-sm">
              <MaterialIcon icon="cloud" style={{ fontSize: '48px', color: '#5d89a9', marginBottom: '12px' }} />
              <h3 className="font-bold mb-2" style={{ color: '#2B4162' }}>Australian Data</h3>
              <p className="text-sm text-[#737A8C]">Hosted in AWS Sydney data centers</p>
            </div>

            <div className="bg-white p-6 rounded-xl text-center shadow-sm">
              <MaterialIcon icon="verified_user" style={{ fontSize: '48px', color: '#64afac', marginBottom: '12px' }} />
              <h3 className="font-bold mb-2" style={{ color: '#2B4162' }}>ISO 27001</h3>
              <p className="text-sm text-[#737A8C]">Certified infrastructure</p>
            </div>

            <div className="bg-white p-6 rounded-xl text-center shadow-sm">
              <MaterialIcon icon="privacy_tip" style={{ fontSize: '48px', color: '#5d89a9', marginBottom: '12px' }} />
              <h3 className="font-bold mb-2" style={{ color: '#2B4162' }}>Privacy Act</h3>
              <p className="text-sm text-[#737A8C]">Fully compliant</p>
            </div>
          </div>
        </div>
      </section>

      {/* Integration */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-8 text-center" style={{ color: '#2B4162' }}>Integrations</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-[#f4f4ee] to-white p-6 rounded-xl border" style={{ borderColor: '#64afac' }}>
              <MaterialIcon icon="business" style={{ fontSize: '40px', color: '#64afac', marginBottom: '12px' }} />
              <h3 className="text-lg font-bold mb-2" style={{ color: '#2B4162' }}>HRIS Systems</h3>
              <p className="text-sm text-[#737A8C] mb-3">
                Connect with BambooHR, Workday, SAP SuccessFactors, and more via API.
              </p>
            </div>

            <div className="bg-gradient-to-br from-[#eeefec] to-white p-6 rounded-xl border" style={{ borderColor: '#5d89a9' }}>
              <MaterialIcon icon="email" style={{ fontSize: '40px', color: '#5d89a9', marginBottom: '12px' }} />
              <h3 className="text-lg font-bold mb-2" style={{ color: '#2B4162' }}>Communication</h3>
              <p className="text-sm text-[#737A8C] mb-3">
                SMS via Twilio, email via SendGrid, or integrate with Microsoft Teams/Slack.
              </p>
            </div>

            <div className="bg-gradient-to-br from-[#f4f4ee] to-white p-6 rounded-xl border" style={{ borderColor: '#64afac' }}>
              <MaterialIcon icon="analytics" style={{ fontSize: '40px', color: '#64afac', marginBottom: '12px' }} />
              <h3 className="text-lg font-bold mb-2" style={{ color: '#2B4162' }}>BI Tools</h3>
              <p className="text-sm text-[#737A8C] mb-3">
                Export to Power BI, Tableau, Looker Studio for custom analysis and reporting.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-[#2B4162] to-[#5d89a9]">
        <div className="max-w-4xl mx-auto px-6 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">See Beacon in Action</h2>
          <p className="text-xl mb-8 opacity-90">
            Try our interactive demo dashboard or start your free trial today.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a 
              href="/dashboard" 
              className="px-8 py-4 bg-white text-[#2B4162] rounded-lg font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              View Demo
            </a>
            <a 
              href="/pricing" 
              className="px-8 py-4 bg-[#64afac] text-white rounded-lg font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              See Pricing
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#2B4162] py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <MaterialIcon icon="health_and_safety" style={{ fontSize: '24px', color: '#64afac' }} />
                <span className="text-lg font-bold text-white">Beacon</span>
              </div>
              <p className="text-white/70 text-sm">
                Psychosocial wellbeing platform for modern workplaces
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-3">Product</h4>
              <div className="space-y-2 text-sm">
                <a href="/features" className="block text-white/70 hover:text-white transition-colors">Features</a>
                <a href="/pricing" className="block text-white/70 hover:text-white transition-colors">Pricing</a>
                <a href="/dashboard" className="block text-white/70 hover:text-white transition-colors">Demo</a>
              </div>
            </div>
            <div>
              <h4 className="text-white font-bold mb-3">Company</h4>
              <div className="space-y-2 text-sm">
                <a href="/about" className="block text-white/70 hover:text-white transition-colors">About</a>
                <a href="/advisory" className="block text-white/70 hover:text-white transition-colors">Advisory Services</a>
                <a href="/methodology" className="block text-white/70 hover:text-white transition-colors">Methodology</a>
              </div>
            </div>
            <div>
              <h4 className="text-white font-bold mb-3">Contact</h4>
              <div className="space-y-2 text-sm text-white/70">
                <div className="flex items-center gap-2">
                  <MaterialIcon icon="mail" style={{ fontSize: '16px' }} />
                  <a href="mailto:hello@beaconwellbeing.com.au" className="hover:text-white transition-colors">
                    hello@beaconwellbeing.com.au
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <MaterialIcon icon="phone" style={{ fontSize: '16px' }} />
                  <span>1300 BEACON</span>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 mt-8 pt-8 text-center text-white/50 text-sm">
            <p>© 2025 Beacon Wellbeing Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}



