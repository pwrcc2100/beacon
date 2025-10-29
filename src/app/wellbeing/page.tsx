import { MaterialIcon } from '@/components/ui/MaterialIcon';

export default function WellbeingPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <a href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <MaterialIcon icon="auto_awesome" style={{ fontSize: '32px', color: '#2B4162' }} />
              <div>
                <div className="text-sm text-[#737A8C]">Beacon Effect</div>
                <div className="text-xs text-[#737A8C]">← Back to home</div>
              </div>
            </a>
            <div className="flex items-center gap-2">
              <MaterialIcon icon="health_and_safety" style={{ fontSize: '32px', color: '#64afac' }} />
              <span className="text-xl font-bold" style={{ color: '#2B4162' }}>Beacon Wellbeing</span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#2B4162] via-[#5d89a9] to-[#64afac] py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Early Detection for Workplace Wellbeing
              </h1>
              <p className="text-xl mb-8 opacity-90 leading-relaxed">
                A validated psychosocial pulse survey covering the key predictors of work stress, 
                clarity, voice, and support — designed for early detection and rapid response.
              </p>
              <div className="flex gap-4 flex-wrap">
                <a 
                  href="mailto:hello@beaconeffect.com.au?subject=Beacon Wellbeing Enquiry" 
                  className="px-8 py-4 bg-white text-[#2B4162] rounded-lg font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105"
                >
                  Get Started
                </a>
                <a 
                  href="/survey/test-demo" 
                  className="px-8 py-4 bg-white/10 backdrop-blur border-2 border-white/30 text-white rounded-lg font-bold hover:bg-white/20 transition-all"
                >
                  Try Survey
                </a>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="bg-white/10 backdrop-blur rounded-2xl p-8 border border-white/20">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <MaterialIcon icon="schedule" style={{ fontSize: '48px', color: '#64afac' }} />
                    <div>
                      <div className="text-3xl font-bold text-white">60s</div>
                      <div className="text-white/80 text-sm">Survey time</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <MaterialIcon icon="trending_up" style={{ fontSize: '48px', color: '#64afac' }} />
                    <div>
                      <div className="text-3xl font-bold text-white">70-85%</div>
                      <div className="text-white/80 text-sm">Response rate</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <MaterialIcon icon="savings" style={{ fontSize: '48px', color: '#64afac' }} />
                    <div>
                      <div className="text-3xl font-bold text-white">Improved</div>
                      <div className="text-white/80 text-sm">Workplace culture</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Cards */}
      <section className="py-16 bg-[#f4f4ee]">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-8 text-center" style={{ color: '#2B4162' }}>
            Explore Beacon Wellbeing
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <a href="/wellbeing/features" className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-all hover:scale-105 border-2 border-transparent hover:border-[#64afac]">
              <MaterialIcon icon="star" style={{ fontSize: '48px', color: '#64afac', marginBottom: '12px' }} />
              <h3 className="font-bold mb-2" style={{ color: '#2B4162' }}>Features</h3>
              <p className="text-sm text-[#737A8C]">See all platform capabilities</p>
            </a>

            <a href="/wellbeing/pricing" className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-all hover:scale-105 border-2 border-transparent hover:border-[#64afac]">
              <MaterialIcon icon="payments" style={{ fontSize: '48px', color: '#5d89a9', marginBottom: '12px' }} />
              <h3 className="font-bold mb-2" style={{ color: '#2B4162' }}>Pricing</h3>
              <p className="text-sm text-[#737A8C]">Plans and ROI calculator</p>
            </a>

            <a href="/wellbeing/about" className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-all hover:scale-105 border-2 border-transparent hover:border-[#64afac]">
              <MaterialIcon icon="info" style={{ fontSize: '48px', color: '#64afac', marginBottom: '12px' }} />
              <h3 className="font-bold mb-2" style={{ color: '#2B4162' }}>About</h3>
              <p className="text-sm text-[#737A8C]">Research & methodology</p>
            </a>

            <a href="/survey/test-demo" className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-all hover:scale-105 border-2 border-transparent hover:border-[#64afac]">
              <MaterialIcon icon="quiz" style={{ fontSize: '48px', color: '#5d89a9', marginBottom: '12px' }} />
              <h3 className="font-bold mb-2" style={{ color: '#2B4162' }}>Try Survey</h3>
              <p className="text-sm text-[#737A8C]">Experience the 2-minute survey</p>
            </a>
          </div>
        </div>
      </section>

      {/* Key Benefits */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold mb-12 text-center" style={{ color: '#2B4162' }}>
            Why Organisations Choose Beacon Wellbeing
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex p-4 rounded-full mb-4" style={{ backgroundColor: '#f4f4ee' }}>
                <MaterialIcon icon="speed" style={{ fontSize: '56px', color: '#64afac' }} />
              </div>
              <h3 className="text-xl font-bold mb-3" style={{ color: '#2B4162' }}>Early Detection</h3>
              <p className="text-[#737A8C]">
                Weekly pulse checks identify issues within weeks. Understand how systems, processes, and culture impact psychological safety.
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex p-4 rounded-full mb-4" style={{ backgroundColor: '#eeefec' }}>
                <MaterialIcon icon="psychology" style={{ fontSize: '56px', color: '#5d89a9' }} />
              </div>
              <h3 className="text-xl font-bold mb-3" style={{ color: '#2B4162' }}>Evidence-Based</h3>
              <p className="text-[#737A8C]">
                Built on validated research from Google, Harvard, and leading institutions. Measures workplace systems and culture effectiveness.
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex p-4 rounded-full mb-4" style={{ backgroundColor: '#f4f4ee' }}>
                <MaterialIcon icon="gavel" style={{ fontSize: '56px', color: '#64afac' }} />
              </div>
              <h3 className="text-xl font-bold mb-3" style={{ color: '#2B4162' }}>Compliance Ready</h3>
              <p className="text-[#737A8C]">
                Meet psychosocial safety obligations with documented evidence of how workplace systems, processes, and culture support psychological safety.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-[#f4f4ee]">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold mb-12 text-center" style={{ color: '#2B4162' }}>
            How It Works
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="text-3xl font-bold mb-3" style={{ color: '#64afac' }}>1</div>
              <h3 className="font-bold mb-2" style={{ color: '#2B4162' }}>Weekly Survey</h3>
              <p className="text-sm text-[#737A8C]">
                Employees receive a 60-second survey via SMS or email. Five simple questions.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="text-3xl font-bold mb-3" style={{ color: '#5d89a9' }}>2</div>
              <h3 className="font-bold mb-2" style={{ color: '#2B4162' }}>Real-Time Data</h3>
              <p className="text-sm text-[#737A8C]">
                Responses flow into your dashboard instantly. See trends as they emerge.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="text-3xl font-bold mb-3" style={{ color: '#64afac' }}>3</div>
              <h3 className="font-bold mb-2" style={{ color: '#2B4162' }}>AI Insights</h3>
              <p className="text-sm text-[#737A8C]">
                Automated summaries highlight what needs attention and which teams need support.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="text-3xl font-bold mb-3" style={{ color: '#5d89a9' }}>4</div>
              <h3 className="font-bold mb-2" style={{ color: '#2B4162' }}>Take Action</h3>
              <p className="text-sm text-[#737A8C]">
                Intervene early with targeted support. Track impact over time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-8" style={{ color: '#2B4162' }}>Trusted by Forward-Thinking Organisations</h2>
          <div className="bg-gradient-to-br from-[#f4f4ee] to-white p-8 rounded-2xl border-2" style={{ borderColor: '#64afac' }}>
            <MaterialIcon icon="format_quote" style={{ fontSize: '48px', color: '#64afac', marginBottom: '16px' }} />
            <p className="text-lg italic mb-4" style={{ color: '#2E2E38' }}>
              "After implementing Beacon, we identified a department with declining wellbeing scores within 3 weeks. 
              The insights helped us redesign our processes and systems to better support psychological safety. Beacon 
              helped us create a workplace culture where employees feel valued and supported."
            </p>
            <div className="text-sm font-bold" style={{ color: '#2B4162' }}>— HR Director</div>
            <div className="text-sm text-[#737A8C]">Technology Company, 500 employees</div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-[#2B4162] to-[#5d89a9]">
        <div className="max-w-4xl mx-auto px-6 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">Ready to Transform Your Workplace?</h2>
          <p className="text-xl mb-8 opacity-90">
            Discover how systems, processes, and culture contribute to psychological safety in your organisation.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a 
              href="mailto:hello@beaconeffect.com.au?subject=Beacon Wellbeing Enquiry" 
              className="px-8 py-4 bg-white text-[#2B4162] rounded-lg font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              Get Started
            </a>
            <a 
              href="/wellbeing/about" 
              className="px-8 py-4 bg-white/10 backdrop-blur text-white rounded-lg font-bold border-2 border-white/30 hover:bg-white/20 transition-all"
            >
              Learn More
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
                <span className="text-lg font-bold text-white">Beacon Wellbeing</span>
              </div>
              <p className="text-white/70 text-sm">
                Part of Beacon Effect
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-3">Product</h4>
              <div className="space-y-2 text-sm">
                <a href="/wellbeing/features" className="block text-white/70 hover:text-white transition-colors">Features</a>
                <a href="/wellbeing/pricing" className="block text-white/70 hover:text-white transition-colors">Pricing</a>
                <a href="/survey/test-demo" className="block text-white/70 hover:text-white transition-colors">Try Survey</a>
                <a href="/dashboard" className="block text-white/70 hover:text-white transition-colors">Dashboard Demo</a>
              </div>
            </div>
            <div>
              <h4 className="text-white font-bold mb-3">Company</h4>
              <div className="space-y-2 text-sm">
                <a href="/wellbeing/about" className="block text-white/70 hover:text-white transition-colors">About</a>
                <a href="/methodology" className="block text-white/70 hover:text-white transition-colors">Methodology</a>
                <a href="/" className="block text-white/70 hover:text-white transition-colors">Beacon Effect</a>
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


