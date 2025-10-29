'use client';
import { MaterialIcon } from '@/components/ui/MaterialIcon';

export default function OnePagerPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Print Header */}
      <div className="max-w-5xl mx-auto px-8 py-12">
        {/* Header - Print Only */}
        <div className="print:block hidden mb-8 pb-4 border-b-2" style={{ borderColor: '#2B4162' }}>
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <MaterialIcon icon="health_and_safety" style={{ fontSize: '40px', color: '#64afac' }} />
                <h1 className="text-4xl font-bold" style={{ color: '#2B4162' }}>Beacon</h1>
              </div>
              <p className="text-sm text-[#737A8C]">Psychosocial Wellbeing Platform</p>
            </div>
            <div className="text-right text-xs text-[#737A8C]">
              <p>hello@beaconwellbeing.com.au</p>
              <p>1300 BEACON (232 266)</p>
              <p>www.beaconwellbeing.com.au</p>
            </div>
          </div>
        </div>

        {/* Screen Header */}
        <div className="print:hidden mb-8">
          <div className="flex justify-between items-center">
            <a href="/" className="flex items-center gap-3">
              <MaterialIcon icon="health_and_safety" style={{ fontSize: '40px', color: '#64afac' }} />
              <div>
                <h1 className="text-3xl font-bold" style={{ color: '#2B4162' }}>Beacon</h1>
                <p className="text-sm text-[#737A8C]">Executive Summary</p>
              </div>
            </a>
            <button 
              onClick={() => window.print()}
              className="px-6 py-3 rounded-lg font-bold text-white transition-all hover:opacity-90 print:hidden"
              style={{ backgroundColor: '#64afac' }}
            >
              <MaterialIcon icon="print" style={{ fontSize: '20px', marginRight: '8px' }} />
              Print / Save PDF
            </button>
          </div>
        </div>

        {/* Title */}
        <div className="mb-8 text-center">
          <h2 className="text-4xl font-bold mb-3" style={{ color: '#2B4162' }}>
            Early Detection for Workplace Wellbeing
          </h2>
          <p className="text-xl text-[#737A8C]">
            A validated psychosocial pulse survey for proactive risk management
          </p>
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="text-center p-4 rounded-lg" style={{ backgroundColor: '#f4f4ee' }}>
            <div className="text-3xl font-bold mb-1" style={{ color: '#64afac' }}>60s</div>
            <div className="text-xs text-[#737A8C]">Survey time</div>
          </div>
          <div className="text-center p-4 rounded-lg" style={{ backgroundColor: '#eeefec' }}>
            <div className="text-3xl font-bold mb-1" style={{ color: '#5d89a9' }}>70-85%</div>
            <div className="text-xs text-[#737A8C]">Response rate</div>
          </div>
          <div className="text-center p-4 rounded-lg" style={{ backgroundColor: '#f4f4ee' }}>
            <div className="text-3xl font-bold mb-1" style={{ color: '#64afac' }}>10-15%</div>
            <div className="text-xs text-[#737A8C]">Turnover reduction</div>
          </div>
          <div className="text-center p-4 rounded-lg" style={{ backgroundColor: '#eeefec' }}>
            <div className="text-3xl font-bold mb-1" style={{ color: '#5d89a9' }}>3-6 mo</div>
            <div className="text-xs text-[#737A8C]">Typical ROI</div>
          </div>
        </div>

        {/* The Challenge */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold mb-4 flex items-center gap-2" style={{ color: '#2B4162' }}>
            <MaterialIcon icon="warning" style={{ fontSize: '28px', color: '#ea9999' }} />
            The Challenge
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg border" style={{ borderColor: '#ea9999', backgroundColor: '#fff' }}>
              <ul className="space-y-2 text-sm text-[#737A8C]">
                <li>• 1 in 5 employees experience work-related stress</li>
                <li>• Annual surveys detect problems too late</li>
                <li>• Generic questions miss psychosocial risks</li>
                <li>• Burnout costs $3,500 per resignation</li>
              </ul>
            </div>
            <div className="p-4 rounded-lg border" style={{ borderColor: '#ea9999', backgroundColor: '#fff' }}>
              <ul className="space-y-2 text-sm text-[#737A8C]">
                <li>• Legal liability for psychosocial hazards</li>
                <li>• Low participation rates (30-40%)</li>
                <li>• Results take months to analyze</li>
                <li>• Productivity loss from disengaged teams</li>
              </ul>
            </div>
          </div>
        </div>

        {/* The Solution */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold mb-4 flex items-center gap-2" style={{ color: '#2B4162' }}>
            <MaterialIcon icon="lightbulb" style={{ fontSize: '28px', color: '#64afac' }} />
            The Beacon Solution
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg" style={{ backgroundColor: '#f4f4ee' }}>
              <MaterialIcon icon="speed" style={{ fontSize: '32px', color: '#64afac', marginBottom: '8px' }} />
              <h4 className="font-bold mb-2 text-sm" style={{ color: '#2B4162' }}>Early Detection</h4>
              <p className="text-xs text-[#737A8C]">Weekly 60-second pulse checks spot issues within weeks, not years.</p>
            </div>
            <div className="p-4 rounded-lg" style={{ backgroundColor: '#eeefec' }}>
              <MaterialIcon icon="psychology" style={{ fontSize: '32px', color: '#5d89a9', marginBottom: '8px' }} />
              <h4 className="font-bold mb-2 text-sm" style={{ color: '#2B4162' }}>Evidence-Based</h4>
              <p className="text-xs text-[#737A8C]">Built on validated research measuring actual predictors of burnout.</p>
            </div>
            <div className="p-4 rounded-lg" style={{ backgroundColor: '#f4f4ee' }}>
              <MaterialIcon icon="security" style={{ fontSize: '32px', color: '#64afac', marginBottom: '8px' }} />
              <h4 className="font-bold mb-2 text-sm" style={{ color: '#2B4162' }}>Privacy First</h4>
              <p className="text-xs text-[#737A8C]">Completely anonymous responses encourage honest feedback.</p>
            </div>
          </div>
        </div>

        {/* 5 Dimensions */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold mb-4" style={{ color: '#2B4162' }}>5 Evidence-Based Dimensions</h3>
          <div className="grid grid-cols-5 gap-3">
            <div className="text-center p-3 rounded-lg" style={{ backgroundColor: '#f4f4ee' }}>
              <MaterialIcon icon="sentiment_satisfied" style={{ fontSize: '32px', color: '#64afac', marginBottom: '4px' }} />
              <div className="font-bold text-xs mb-1" style={{ color: '#2B4162' }}>Sentiment</div>
              <div className="text-xs text-[#737A8C]">25%</div>
            </div>
            <div className="text-center p-3 rounded-lg" style={{ backgroundColor: '#eeefec' }}>
              <MaterialIcon icon="work_history" style={{ fontSize: '32px', color: '#ea9999', marginBottom: '4px' }} />
              <div className="font-bold text-xs mb-1" style={{ color: '#2B4162' }}>Workload</div>
              <div className="text-xs text-[#737A8C]">25%</div>
            </div>
            <div className="text-center p-3 rounded-lg" style={{ backgroundColor: '#f4f4ee' }}>
              <MaterialIcon icon="diversity_3" style={{ fontSize: '32px', color: '#5d89a9', marginBottom: '4px' }} />
              <div className="font-bold text-xs mb-1" style={{ color: '#2B4162' }}>Safety</div>
              <div className="text-xs text-[#737A8C]">20%</div>
            </div>
            <div className="text-center p-3 rounded-lg" style={{ backgroundColor: '#eeefec' }}>
              <MaterialIcon icon="supervisor_account" style={{ fontSize: '32px', color: '#64afac', marginBottom: '4px' }} />
              <div className="font-bold text-xs mb-1" style={{ color: '#2B4162' }}>Leadership</div>
              <div className="text-xs text-[#737A8C]">20%</div>
            </div>
            <div className="text-center p-3 rounded-lg" style={{ backgroundColor: '#f4f4ee' }}>
              <MaterialIcon icon="assignment" style={{ fontSize: '32px', color: '#5d89a9', marginBottom: '4px' }} />
              <div className="font-bold text-xs mb-1" style={{ color: '#2B4162' }}>Clarity</div>
              <div className="text-xs text-[#737A8C]">10%</div>
            </div>
          </div>
        </div>

        {/* Key Features */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold mb-4" style={{ color: '#2B4162' }}>Key Features</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-bold mb-2 text-sm" style={{ color: '#2B4162' }}>For Employees</h4>
              <ul className="space-y-1 text-xs text-[#737A8C]">
                <li>• 60-second weekly surveys via SMS/email</li>
                <li>• No login required—one-click access</li>
                <li>• Complete anonymity guaranteed</li>
                <li>• Conditional support pathways</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-2 text-sm" style={{ color: '#2B4162' }}>For Leaders</h4>
              <ul className="space-y-1 text-xs text-[#737A8C]">
                <li>• Real-time executive dashboard</li>
                <li>• Drill-down by division/department/team</li>
                <li>• AI-powered insights and alerts</li>
                <li>• Trend analysis over time</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-2 text-sm" style={{ color: '#2B4162' }}>For HR & Safety</h4>
              <ul className="space-y-1 text-xs text-[#737A8C]">
                <li>• Compliance reporting (NSW WHS, ISO 45003)</li>
                <li>• Advanced analytics and benchmarking</li>
                <li>• CSV export for Power BI/Excel</li>
                <li>• HRIS integration via API</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-2 text-sm" style={{ color: '#2B4162' }}>Security & Privacy</h4>
              <ul className="space-y-1 text-xs text-[#737A8C]">
                <li>• AES-256 encryption at rest</li>
                <li>• Australian data centres (AWS Sydney)</li>
                <li>• ISO 27001 certified infrastructure</li>
                <li>• Privacy Act compliant</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Research Foundation */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold mb-4" style={{ color: '#2B4162' }}>Research Foundation</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg" style={{ backgroundColor: '#f4f4ee' }}>
              <h4 className="font-bold mb-3 text-sm" style={{ color: '#2B4162' }}>Compliance Standards</h4>
              <ul className="space-y-1 text-xs text-[#737A8C]">
                <li>• <strong>Work Health & Safety Act</strong> (psychosocial hazards)</li>
                <li>• <strong>ISO 45003</strong> (Psychological health and safety at work)</li>
                <li>• <strong>Safe Work Australia</strong> guidelines</li>
                <li>• <strong>Model WHS Regulations</strong> for psychosocial risks</li>
              </ul>
            </div>
            <div className="p-4 rounded-lg" style={{ backgroundColor: '#eeefec' }}>
              <h4 className="font-bold mb-3 text-sm" style={{ color: '#2B4162' }}>Academic Research</h4>
              <ul className="space-y-1 text-xs text-[#737A8C]">
                <li>• <strong>Amy Edmondson</strong> (Harvard) - Psychological Safety</li>
                <li>• <strong>Karasek & Theorell</strong> - Job Demand-Control-Support</li>
                <li>• <strong>Christina Maslach</strong> - Burnout & Wellbeing</li>
                <li>• <strong>Google's Project Aristotle</strong> - Team Effectiveness</li>
              </ul>
            </div>
          </div>
        </div>

        {/* ROI */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold mb-4" style={{ color: '#2B4162' }}>Return on Investment</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg" style={{ backgroundColor: '#f4f4ee' }}>
              <h4 className="font-bold mb-3 text-sm" style={{ color: '#2B4162' }}>Average Cost Savings</h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#737A8C]">Prevented resignations/year:</span>
                  <span className="font-bold" style={{ color: '#64afac' }}>3-5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#737A8C]">Cost per resignation:</span>
                  <span className="font-bold" style={{ color: '#64afac' }}>$3,500</span>
                </div>
                <div className="flex justify-between border-t pt-2" style={{ borderColor: '#64afac' }}>
                  <span className="font-bold" style={{ color: '#2B4162' }}>Annual savings:</span>
                  <span className="font-bold" style={{ color: '#64afac' }}>$10,500-$17,500</span>
                </div>
              </div>
            </div>
            <div className="p-4 rounded-lg" style={{ backgroundColor: '#eeefec' }}>
              <h4 className="font-bold mb-3 text-sm" style={{ color: '#2B4162' }}>Measurable Outcomes</h4>
              <ul className="space-y-2 text-xs text-[#737A8C]">
                <li>• 10-15% reduction in voluntary turnover</li>
                <li>• 20-30% improvement in engagement</li>
                <li>• 25% faster issue identification</li>
                <li>• Full compliance with safety obligations</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Implementation */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold mb-4" style={{ color: '#2B4162' }}>Implementation Timeline</h3>
          <div className="grid grid-cols-4 gap-3">
            <div className="text-center p-3 rounded-lg" style={{ backgroundColor: '#f4f4ee' }}>
              <div className="text-2xl font-bold mb-1" style={{ color: '#64afac' }}>Week 1</div>
              <div className="text-xs text-[#737A8C]">Setup & Configuration</div>
            </div>
            <div className="text-center p-3 rounded-lg" style={{ backgroundColor: '#eeefec' }}>
              <div className="text-2xl font-bold mb-1" style={{ color: '#5d89a9' }}>Week 2</div>
              <div className="text-xs text-[#737A8C]">Pilot Launch</div>
            </div>
            <div className="text-center p-3 rounded-lg" style={{ backgroundColor: '#f4f4ee' }}>
              <div className="text-2xl font-bold mb-1" style={{ color: '#64afac' }}>Week 3</div>
              <div className="text-xs text-[#737A8C]">Full Rollout</div>
            </div>
            <div className="text-center p-3 rounded-lg" style={{ backgroundColor: '#eeefec' }}>
              <div className="text-2xl font-bold mb-1" style={{ color: '#5d89a9' }}>Week 4</div>
              <div className="text-xs text-[#737A8C]">Review & Optimize</div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center p-6 rounded-lg print:hidden" style={{ backgroundColor: '#2B4162' }}>
          <h3 className="text-2xl font-bold mb-3 text-white">Ready to Get Started?</h3>
          <p className="text-white/90 mb-4">Start your free 2-week trial with up to 50 employees.</p>
          <div className="flex gap-4 justify-center">
            <a 
              href="mailto:hello@beaconwellbeing.com.au?subject=Free Trial Request"
              className="px-6 py-3 bg-white rounded-lg font-bold transition-all hover:opacity-90"
              style={{ color: '#2B4162' }}
            >
              Start Free Trial
            </a>
            <a 
              href="/pricing"
              className="px-6 py-3 rounded-lg font-bold text-white border-2 border-white/30 hover:bg-white/10 transition-all"
            >
              View Full Pricing
            </a>
          </div>
        </div>

        {/* Print Footer */}
        <div className="hidden print:block mt-8 pt-4 border-t text-center text-xs text-[#737A8C]">
          <p>© 2025 Beacon Wellbeing Platform | hello@beaconwellbeing.com.au | 1300 BEACON (232 266)</p>
          <p className="mt-1">www.beaconwellbeing.com.au</p>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx>{`
        @media print {
          @page {
            size: A4;
            margin: 1.5cm;
          }
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
        }
      `}</style>
    </main>
  );
}

