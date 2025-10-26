import { MaterialIcon } from '@/components/ui/MaterialIcon';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#2B4162] to-[#5d89a9] sticky top-0 z-50 shadow-lg">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MaterialIcon icon="health_and_safety" style={{ fontSize: '32px', color: '#64afac' }} />
            <div>
              <h1 className="text-xl font-bold text-white">Beacon</h1>
              <p className="text-xs text-white/80">Psychosocial Wellbeing Platform</p>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="/" className="text-white/80 hover:text-white transition-colors text-sm">Home</a>
            <a href="/about" className="text-white font-medium text-sm">About</a>
            <a href="/features" className="text-white/80 hover:text-white transition-colors text-sm">Features</a>
            <a href="/pricing" className="text-white/80 hover:text-white transition-colors text-sm">Pricing</a>
            <a href="/dashboard" className="text-white/80 hover:text-white transition-colors text-sm">Demo</a>
            <a 
              href="mailto:hello@beaconwellbeing.com.au" 
              className="px-4 py-2 bg-[#64afac] text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Contact
            </a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#2B4162] via-[#5d89a9] to-[#64afac] py-20">
        <div className="max-w-4xl mx-auto px-6 text-center text-white">
          <h1 className="text-5xl font-bold mb-6">Early Detection for Workplace Wellbeing</h1>
          <p className="text-xl leading-relaxed opacity-90">
            A validated psychosocial pulse survey covering the key predictors of work stress, 
            clarity, voice, and support — designed for early detection and rapid response.
          </p>
        </div>
      </section>

      {/* The Problem */}
      <section className="py-16 bg-[#f4f4ee]">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-8 text-center" style={{ color: '#2B4162' }}>The Challenge</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <MaterialIcon icon="warning" style={{ fontSize: '48px', color: '#ea9999', marginBottom: '16px' }} />
              <h3 className="text-xl font-bold mb-3" style={{ color: '#2B4162' }}>Traditional Surveys Fall Short</h3>
              <ul className="space-y-2 text-[#737A8C]">
                <li>• Annual surveys detect problems too late</li>
                <li>• Low participation rates (30-40%)</li>
                <li>• Generic questions miss psychosocial risks</li>
                <li>• Results take months to analyze</li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <MaterialIcon icon="trending_down" style={{ fontSize: '48px', color: '#ea9999', marginBottom: '16px' }} />
              <h3 className="text-xl font-bold mb-3" style={{ color: '#2B4162' }}>The Cost of Inaction</h3>
              <ul className="space-y-2 text-[#737A8C]">
                <li>• 1 in 5 employees experience work stress</li>
                <li>• Burnout costs $3,500 per resignation</li>
                <li>• Legal liability for psychosocial hazards</li>
                <li>• Productivity loss from disengaged teams</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* The Solution */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-12 text-center" style={{ color: '#2B4162' }}>How Beacon Helps</h2>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="inline-flex p-4 rounded-full mb-4" style={{ backgroundColor: '#f4f4ee' }}>
                <MaterialIcon icon="speed" style={{ fontSize: '56px', color: '#64afac' }} />
              </div>
              <h3 className="text-xl font-bold mb-3" style={{ color: '#2B4162' }}>Early Detection</h3>
              <p className="text-[#737A8C]">
                Weekly 60-second pulse checks spot issues within weeks, not years. 
                Catch problems before they escalate.
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex p-4 rounded-full mb-4" style={{ backgroundColor: '#eeefec' }}>
                <MaterialIcon icon="psychology" style={{ fontSize: '56px', color: '#5d89a9' }} />
              </div>
              <h3 className="text-xl font-bold mb-3" style={{ color: '#2B4162' }}>Evidence-Based</h3>
              <p className="text-[#737A8C]">
                Built on validated psychosocial research. Measures the actual predictors 
                of burnout, turnover, and stress.
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex p-4 rounded-full mb-4" style={{ backgroundColor: '#f4f4ee' }}>
                <MaterialIcon icon="security" style={{ fontSize: '56px', color: '#64afac' }} />
              </div>
              <h3 className="text-xl font-bold mb-3" style={{ color: '#2B4162' }}>Privacy First</h3>
              <p className="text-[#737A8C]">
                Completely anonymous responses encourage honesty. Only aggregated 
                data visible to leadership.
              </p>
            </div>
          </div>

          {/* 5 Dimensions */}
          <div className="bg-gradient-to-br from-[#f4f4ee] to-white rounded-2xl p-8 border-2" style={{ borderColor: '#64afac' }}>
            <h3 className="text-2xl font-bold mb-6 text-center" style={{ color: '#2B4162' }}>
              5 Evidence-Based Dimensions
            </h3>
            <div className="grid md:grid-cols-5 gap-6">
              <div className="text-center">
                <MaterialIcon icon="sentiment_satisfied" style={{ fontSize: '40px', color: '#64afac', marginBottom: '8px' }} />
                <div className="font-bold text-sm mb-1" style={{ color: '#2B4162' }}>Sentiment</div>
                <div className="text-xs text-[#737A8C]">25% weight</div>
                <div className="text-xs text-[#737A8C] mt-2">Overall mood and wellbeing</div>
              </div>
              <div className="text-center">
                <MaterialIcon icon="work_history" style={{ fontSize: '40px', color: '#ea9999', marginBottom: '8px' }} />
                <div className="font-bold text-sm mb-1" style={{ color: '#2B4162' }}>Workload</div>
                <div className="text-xs text-[#737A8C]">25% weight</div>
                <div className="text-xs text-[#737A8C] mt-2">Manageable capacity</div>
              </div>
              <div className="text-center">
                <MaterialIcon icon="diversity_3" style={{ fontSize: '40px', color: '#5d89a9', marginBottom: '8px' }} />
                <div className="font-bold text-sm mb-1" style={{ color: '#2B4162' }}>Safety</div>
                <div className="text-xs text-[#737A8C]">20% weight</div>
                <div className="text-xs text-[#737A8C] mt-2">Psychological safety</div>
              </div>
              <div className="text-center">
                <MaterialIcon icon="supervisor_account" style={{ fontSize: '40px', color: '#64afac', marginBottom: '8px' }} />
                <div className="font-bold text-sm mb-1" style={{ color: '#2B4162' }}>Leadership</div>
                <div className="text-xs text-[#737A8C]">20% weight</div>
                <div className="text-xs text-[#737A8C] mt-2">Leader support</div>
              </div>
              <div className="text-center">
                <MaterialIcon icon="assignment" style={{ fontSize: '40px', color: '#5d89a9', marginBottom: '8px' }} />
                <div className="font-bold text-sm mb-1" style={{ color: '#2B4162' }}>Clarity</div>
                <div className="text-xs text-[#737A8C]">10% weight</div>
                <div className="text-xs text-[#737A8C] mt-2">Role clarity</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Legal Compliance */}
      <section className="py-16 bg-[#eeefec]">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-8 text-center" style={{ color: '#2B4162' }}>
            Meeting Legal Obligations
          </h2>
          <p className="text-center text-lg text-[#737A8C] mb-12 max-w-3xl mx-auto">
            Beacon helps organisations respond to evolving legal obligations regarding 
            psychosocial safety in the workplace, aligned with NSW WHS framework requirements.
          </p>

          <div className="bg-white rounded-xl p-8 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2" style={{ borderColor: '#5d89a9' }}>
                    <th className="text-left p-4 font-bold" style={{ color: '#2B4162' }}>Legal/Regulatory Need</th>
                    <th className="text-left p-4 font-bold" style={{ color: '#2B4162' }}>How Beacon Helps</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  <tr className="border-b border-gray-100">
                    <td className="p-4 font-medium">Systematic hazard identification</td>
                    <td className="p-4 text-[#737A8C]">
                      Regular check-ins focused on working conditions help flag potential psychosocial 
                      hazards early — before they escalate.
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="p-4 font-medium">Evidence-based prioritisation</td>
                    <td className="p-4 text-[#737A8C]">
                      Analytics highlight which risks are most material and where control efforts should 
                      be focused, ensuring resources are allocated effectively.
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="p-4 font-medium">Control design & feedback loop</td>
                    <td className="p-4 text-[#737A8C]">
                      Leaders gain insight into whether interventions are working, allowing for real-time 
                      adjustments and optimisation.
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="p-4 font-medium">Monitoring and review</td>
                    <td className="p-4 text-[#737A8C]">
                      Ongoing data stream helps track trends, verify controls are holding up, and detect 
                      new or emerging hazards promptly.
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="p-4 font-medium">Transparency & demonstrable diligence</td>
                    <td className="p-4 text-[#737A8C]">
                      Documented data and responses show a proactive, reasonable approach — critical for 
                      regulatory or legal scrutiny.
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 font-medium">Culture of continuous improvement</td>
                    <td className="p-4 text-[#737A8C]">
                      Shifts organisations from reactive firefighting to proactive safety culture where 
                      workplace design is managed—not just individual resilience.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-8 p-6 bg-white rounded-xl border-l-4" style={{ borderColor: '#64afac' }}>
            <p className="text-lg font-medium" style={{ color: '#2B4162' }}>
              "Beacon doesn't just monitor how people feel; it assesses where the system, process, 
              or culture is failing them — exactly what NSW's WHS framework now requires for 
              psychosocial risk management."
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-[#2B4162] to-[#5d89a9]">
        <div className="max-w-4xl mx-auto px-6 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 opacity-90">
            Start your free 2-week trial with up to 50 employees. No credit card required.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a 
              href="/pricing" 
              className="px-8 py-4 bg-white text-[#2B4162] rounded-lg font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              View Pricing
            </a>
            <a 
              href="mailto:hello@beaconwellbeing.com.au?subject=Trial Request" 
              className="px-8 py-4 bg-[#64afac] text-white rounded-lg font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              Request Trial
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



