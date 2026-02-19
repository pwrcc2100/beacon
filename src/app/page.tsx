import { MaterialIcon } from '@/components/ui/MaterialIcon';

export default function BeaconEffectPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MaterialIcon icon="auto_awesome" style={{ fontSize: '40px', color: '#2B4162' }} />
              <div>
                <h1 className="text-2xl font-bold" style={{ color: '#2B4162' }}>Beacon Effect</h1>
                <p className="text-xs text-[#737A8C]">Strategic Solutions for Modern Business</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#2B4162] via-[#5d89a9] to-[#64afac] py-24">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white leading-tight">
              Transform Your Business
            </h1>
            <p className="text-2xl text-white/90 mb-12 leading-relaxed">
              Expert advisory services and innovative technology solutions to help your 
              organisation thrive in a changing world.
            </p>
            <div className="text-white/80 text-lg mb-8">
              Choose your path:
            </div>
          </div>
        </div>
      </section>

      {/* Two Main Services */}
      <section className="py-20 bg-[#f4f4ee]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12">
            
            {/* Beacon Advisory */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 hover:shadow-2xl transition-all hover:scale-105" style={{ borderColor: '#5d89a9' }}>
              <div className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-4 rounded-xl" style={{ backgroundColor: '#eeefec' }}>
                    <MaterialIcon icon="psychology" style={{ fontSize: '56px', color: '#5d89a9' }} />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold" style={{ color: '#2B4162' }}>Beacon Advisory</h2>
                    <p className="text-sm text-[#737A8C]">Strategic Consulting</p>
                  </div>
                </div>

                <p className="text-[#737A8C] mb-6 leading-relaxed">
                  Corporate concierge services for senior engagements and technology solutions. 
                  From strategic consulting to custom application development—your trusted partner 
                  for complex business challenges.
                </p>

                <div className="space-y-3 mb-8">
                  <div className="flex items-start gap-3">
                    <MaterialIcon icon="check_circle" style={{ fontSize: '24px', color: '#5d89a9' }} />
                    <div>
                      <div className="font-bold text-sm" style={{ color: '#2B4162' }}>Strategic Consulting</div>
                      <div className="text-xs text-[#737A8C]">Executive advisory for transformation & improvement</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MaterialIcon icon="code" style={{ fontSize: '24px', color: '#5d89a9' }} />
                    <div>
                      <div className="font-bold text-sm" style={{ color: '#2B4162' }}>Technology Solutions</div>
                      <div className="text-xs text-[#737A8C]">Custom applications & system integration</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MaterialIcon icon="lightbulb" style={{ fontSize: '24px', color: '#5d89a9' }} />
                    <div>
                      <div className="font-bold text-sm" style={{ color: '#2B4162' }}>Executive Advisory</div>
                      <div className="text-xs text-[#737A8C]">Strategic guidance for senior leaders</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MaterialIcon icon="concierge" style={{ fontSize: '24px', color: '#5d89a9' }} />
                    <div>
                      <div className="font-bold text-sm" style={{ color: '#2B4162' }}>Corporate Concierge</div>
                      <div className="text-xs text-[#737A8C]">Trusted advisor for complex challenges</div>
                    </div>
                  </div>
                </div>

                <div className="bg-[#eeefec] rounded-lg p-4 mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <MaterialIcon icon="emoji_events" style={{ fontSize: '24px', color: '#5d89a9' }} />
                    <span className="font-bold text-sm" style={{ color: '#2B4162' }}>Award-Winning Expertise</span>
                  </div>
                  <p className="text-xs text-[#737A8C]">
                    HammerTech Award 2024 • Head of Business Improvement at RCC • 
                    Industry Thought Leader
                  </p>
                </div>

                <a 
                  href="/advisory"
                  className="block w-full py-4 rounded-lg font-bold text-white text-center transition-all hover:opacity-90"
                  style={{ backgroundColor: '#5d89a9' }}
                >
                  Explore Advisory Services
                  <MaterialIcon icon="arrow_forward" style={{ fontSize: '20px', marginLeft: '8px' }} />
                </a>
              </div>
            </div>

            {/* Beacon Wellbeing */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 hover:shadow-2xl transition-all hover:scale-105" style={{ borderColor: '#64afac' }}>
              <div className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-4 rounded-xl" style={{ backgroundColor: '#f4f4ee' }}>
                    <MaterialIcon icon="health_and_safety" style={{ fontSize: '56px', color: '#64afac' }} />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold" style={{ color: '#2B4162' }}>Beacon Wellbeing</h2>
                    <p className="text-sm text-[#737A8C]">Psychosocial Safety Platform</p>
                  </div>
                </div>

                <p className="text-[#737A8C] mb-6 leading-relaxed">
                  Early detection platform for workplace wellbeing. A validated psychosocial pulse 
                  survey covering the key predictors of work stress, clarity, voice, and support—designed 
                  for rapid response.
                </p>

                <div className="space-y-3 mb-8">
                  <div className="flex items-start gap-3">
                    <MaterialIcon icon="speed" style={{ fontSize: '24px', color: '#64afac' }} />
                    <div>
                      <div className="font-bold text-sm" style={{ color: '#2B4162' }}>Early Detection</div>
                      <div className="text-xs text-[#737A8C]">Weekly 60-second pulse checks spot issues fast</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MaterialIcon icon="psychology" style={{ fontSize: '24px', color: '#64afac' }} />
                    <div>
                      <div className="font-bold text-sm" style={{ color: '#2B4162' }}>Evidence-Based</div>
                      <div className="text-xs text-[#737A8C]">Built on validated psychosocial research</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MaterialIcon icon="dashboard" style={{ fontSize: '24px', color: '#64afac' }} />
                    <div>
                      <div className="font-bold text-sm" style={{ color: '#2B4162' }}>Real-Time Insights</div>
                      <div className="text-xs text-[#737A8C]">Executive dashboards with drill-down analytics</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MaterialIcon icon="gavel" style={{ fontSize: '24px', color: '#64afac' }} />
                    <div>
                      <div className="font-bold text-sm" style={{ color: '#2B4162' }}>Compliance Ready</div>
                      <div className="text-xs text-[#737A8C]">Meet psychosocial safety obligations</div>
                    </div>
                  </div>
                </div>

                <div className="bg-[#f4f4ee] rounded-lg p-4 mb-6">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold" style={{ color: '#64afac' }}>60s</div>
                      <div className="text-xs text-[#737A8C]">Survey time</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold" style={{ color: '#64afac' }}>70-85%</div>
                      <div className="text-xs text-[#737A8C]">Response rate</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold" style={{ color: '#64afac' }}>10-15%</div>
                      <div className="text-xs text-[#737A8C]">Turnover ↓</div>
                    </div>
                  </div>
                </div>

                <a 
                  href="/wellbeing"
                  className="block w-full py-4 rounded-lg font-bold text-white text-center transition-all hover:opacity-90"
                  style={{ backgroundColor: '#64afac' }}
                >
                  Explore Wellbeing Platform
                  <MaterialIcon icon="arrow_forward" style={{ fontSize: '20px', marginLeft: '8px' }} />
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* About Beacon Effect */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6" style={{ color: '#2B4162' }}>
            About Beacon Effect
          </h2>
          <p className="text-xl text-[#737A8C] leading-relaxed mb-8">
            Beacon Effect brings together strategic advisory expertise and innovative technology 
            solutions to help organisations navigate complex challenges and create lasting positive change.
          </p>
          <p className="text-lg text-[#737A8C] leading-relaxed">
            Whether you need executive-level consulting, custom technology solutions, or a comprehensive 
            wellbeing platform—we deliver practical, evidence-based solutions that drive real results.
          </p>
        </div>
      </section>

      {/* Our Approach */}
      <section className="py-20 bg-[#eeefec]">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-12 text-center" style={{ color: '#2B4162' }}>
            Our Approach
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl text-center shadow-sm">
              <MaterialIcon icon="insights" style={{ fontSize: '56px', color: '#64afac', marginBottom: '16px' }} />
              <h3 className="text-xl font-bold mb-3" style={{ color: '#2B4162' }}>Evidence-Based</h3>
              <p className="text-sm text-[#737A8C]">
                Every solution is grounded in research, data, and proven methodologies. We don't guess—we know what works.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl text-center shadow-sm">
              <MaterialIcon icon="handshake" style={{ fontSize: '56px', color: '#5d89a9', marginBottom: '16px' }} />
              <h3 className="text-xl font-bold mb-3" style={{ color: '#2B4162' }}>Partnership-Focused</h3>
              <p className="text-sm text-[#737A8C]">
                We work alongside your team as trusted advisors, not just vendors. Your success is our success.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl text-center shadow-sm">
              <MaterialIcon icon="rocket_launch" style={{ fontSize: '56px', color: '#64afac', marginBottom: '16px' }} />
              <h3 className="text-xl font-bold mb-3" style={{ color: '#2B4162' }}>Results-Driven</h3>
              <p className="text-sm text-[#737A8C]">
                We focus on measurable outcomes and tangible ROI. Every engagement is designed to deliver real value.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-[#2B4162] to-[#5d89a9]">
        <div className="max-w-4xl mx-auto px-6 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">Ready to Create Positive Change?</h2>
          <p className="text-xl mb-8 opacity-90">
            Let's discuss how Beacon Effect can help your organisation succeed.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a 
              href="mailto:hello@beaconeffect.com.au?subject=Enquiry"
              className="px-8 py-4 bg-white rounded-lg font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105"
              style={{ color: '#2B4162' }}
            >
              <MaterialIcon icon="mail" style={{ fontSize: '20px', marginRight: '8px' }} />
              Get in Touch
            </a>
            <a 
              href="https://www.linkedin.com/in/peta-wilson-4769361"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-white/10 backdrop-blur text-white rounded-lg font-bold border-2 border-white/30 hover:bg-white/20 transition-all"
            >
              <MaterialIcon icon="person" style={{ fontSize: '20px', marginRight: '8px' }} />
              Connect on LinkedIn
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#2B4162] py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <MaterialIcon icon="auto_awesome" style={{ fontSize: '24px', color: '#64afac' }} />
                <span className="text-lg font-bold text-white">Beacon Effect</span>
              </div>
              <p className="text-white/70 text-sm">
                Strategic solutions for modern business
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-3">Services</h4>
              <div className="space-y-2 text-sm">
                <a href="/advisory" className="block text-white/70 hover:text-white transition-colors">Beacon Advisory</a>
                <a href="/wellbeing" className="block text-white/70 hover:text-white transition-colors">Beacon Wellbeing</a>
              </div>
            </div>
            <div>
              <h4 className="text-white font-bold mb-3">Contact</h4>
              <div className="space-y-2 text-sm text-white/70">
                <div className="flex items-center gap-2">
                  <MaterialIcon icon="mail" style={{ fontSize: '16px' }} />
                  <a href="mailto:hello@beaconeffect.com.au" className="hover:text-white transition-colors">
                    hello@beaconeffect.com.au
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 mt-8 pt-8 text-center text-white/50 text-sm">
            <p>© 2025 Beacon Effect. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
