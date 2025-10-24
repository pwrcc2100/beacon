import { MaterialIcon } from '@/components/ui/MaterialIcon';

export default function PresentationPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#2B4162] via-[#5d89a9] to-[#64afac]">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MaterialIcon icon="health_and_safety" style={{ fontSize: '32px', color: '#64afac' }} />
            <h1 className="text-2xl font-bold" style={{ color: '#2B4162' }}>Beacon</h1>
          </div>
          <a 
            href="mailto:hello@beaconwellbeing.com.au" 
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-white transition-all hover:scale-105"
            style={{ backgroundColor: '#64afac' }}
          >
            <MaterialIcon icon="mail" style={{ fontSize: '20px' }} />
            <span className="font-medium">Contact Us</span>
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 py-16 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur text-white text-sm font-medium mb-6">
          <MaterialIcon icon="verified" style={{ fontSize: '20px' }} />
          <span>Psychosocial Wellbeing Platform</span>
        </div>
        
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
          Early Detection for<br />Workplace Wellbeing
        </h1>
        
        <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
          A validated psychosocial pulse survey covering the key predictors of work stress, 
          clarity, voice, and support — designed for early detection and rapid response.
        </p>

        <div className="flex flex-wrap gap-4 justify-center">
          <a 
            href="#materials" 
            className="px-8 py-4 bg-white text-[#2B4162] rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105"
          >
            Download Materials
          </a>
          <a 
            href="/dashboard" 
            className="px-8 py-4 bg-white/10 backdrop-blur text-white rounded-lg font-semibold text-lg border-2 border-white/30 hover:bg-white/20 transition-all"
          >
            View Demo Dashboard
          </a>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white/10 backdrop-blur rounded-xl p-6 text-center border border-white/20">
            <div className="text-4xl font-bold text-white mb-2">60s</div>
            <div className="text-white/80 text-sm">Survey completion time</div>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-xl p-6 text-center border border-white/20">
            <div className="text-4xl font-bold text-white mb-2">5</div>
            <div className="text-white/80 text-sm">Evidence-based dimensions</div>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-xl p-6 text-center border border-white/20">
            <div className="text-4xl font-bold text-white mb-2">70-85%</div>
            <div className="text-white/80 text-sm">Typical response rate</div>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-xl p-6 text-center border border-white/20">
            <div className="text-4xl font-bold text-white mb-2">10-15%</div>
            <div className="text-white/80 text-sm">Reduction in turnover</div>
          </div>
        </div>
      </section>

      {/* Materials Section */}
      <section id="materials" className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4" style={{ color: '#2B4162' }}>
              Presentation Materials
            </h2>
            <p className="text-xl" style={{ color: '#737A8C' }}>
              Download everything you need to understand and present Beacon
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Client Proposal */}
            <div className="bg-gradient-to-br from-[#f4f4ee] to-white rounded-xl p-8 border-2 hover:shadow-xl transition-all" style={{ borderColor: '#64afac' }}>
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 rounded-lg" style={{ backgroundColor: '#64afac' }}>
                  <MaterialIcon icon="description" style={{ fontSize: '32px', color: 'white' }} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2" style={{ color: '#2B4162' }}>
                    Client Proposal
                  </h3>
                  <p className="text-sm" style={{ color: '#737A8C' }}>
                    Complete proposal with pricing, features, ROI, and implementation timeline
                  </p>
                </div>
              </div>
              
              <div className="space-y-2 mb-6 text-sm" style={{ color: '#737A8C' }}>
                <div className="flex items-center gap-2">
                  <MaterialIcon icon="check_circle" style={{ fontSize: '16px', color: '#64afac' }} />
                  <span>Executive summary</span>
                </div>
                <div className="flex items-center gap-2">
                  <MaterialIcon icon="check_circle" style={{ fontSize: '16px', color: '#64afac' }} />
                  <span>3 pricing tiers</span>
                </div>
                <div className="flex items-center gap-2">
                  <MaterialIcon icon="check_circle" style={{ fontSize: '16px', color: '#64afac' }} />
                  <span>Implementation guide</span>
                </div>
                <div className="flex items-center gap-2">
                  <MaterialIcon icon="check_circle" style={{ fontSize: '16px', color: '#64afac' }} />
                  <span>Case studies & ROI</span>
                </div>
              </div>

              <div className="flex gap-3">
                <a 
                  href="/api/download-pdf?doc=proposal" 
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-white font-medium transition-all hover:opacity-90"
                  style={{ backgroundColor: '#64afac' }}
                >
                  <MaterialIcon icon="download" style={{ fontSize: '20px' }} />
                  <span>Download HTML</span>
                </a>
                <a 
                  href="/BEACON_CLIENT_PROPOSAL.md" 
                  download
                  className="px-4 py-3 rounded-lg border-2 font-medium transition-all hover:bg-gray-50"
                  style={{ borderColor: '#64afac', color: '#64afac' }}
                  title="Download Markdown"
                >
                  <MaterialIcon icon="content_copy" style={{ fontSize: '20px' }} />
                </a>
              </div>
            </div>

            {/* Email Templates */}
            <div className="bg-gradient-to-br from-[#eeefec] to-white rounded-xl p-8 border-2 hover:shadow-xl transition-all" style={{ borderColor: '#5d89a9' }}>
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 rounded-lg" style={{ backgroundColor: '#5d89a9' }}>
                  <MaterialIcon icon="mail" style={{ fontSize: '32px', color: 'white' }} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2" style={{ color: '#2B4162' }}>
                    Email Templates
                  </h3>
                  <p className="text-sm" style={{ color: '#737A8C' }}>
                    13 ready-to-use templates for client outreach and engagement
                  </p>
                </div>
              </div>
              
              <div className="space-y-2 mb-6 text-sm" style={{ color: '#737A8C' }}>
                <div className="flex items-center gap-2">
                  <MaterialIcon icon="check_circle" style={{ fontSize: '16px', color: '#5d89a9' }} />
                  <span>Cold outreach templates</span>
                </div>
                <div className="flex items-center gap-2">
                  <MaterialIcon icon="check_circle" style={{ fontSize: '16px', color: '#5d89a9' }} />
                  <span>Trial & onboarding emails</span>
                </div>
                <div className="flex items-center gap-2">
                  <MaterialIcon icon="check_circle" style={{ fontSize: '16px', color: '#5d89a9' }} />
                  <span>Follow-up sequences</span>
                </div>
                <div className="flex items-center gap-2">
                  <MaterialIcon icon="check_circle" style={{ fontSize: '16px', color: '#5d89a9' }} />
                  <span>Employee communications</span>
                </div>
              </div>

              <div className="flex gap-3">
                <a 
                  href="/api/download-pdf?doc=emails" 
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-white font-medium transition-all hover:opacity-90"
                  style={{ backgroundColor: '#5d89a9' }}
                >
                  <MaterialIcon icon="download" style={{ fontSize: '20px' }} />
                  <span>Download HTML</span>
                </a>
                <a 
                  href="/EMAIL_TEMPLATES.md" 
                  download
                  className="px-4 py-3 rounded-lg border-2 font-medium transition-all hover:bg-gray-50"
                  style={{ borderColor: '#5d89a9', color: '#5d89a9' }}
                  title="Download Markdown"
                >
                  <MaterialIcon icon="content_copy" style={{ fontSize: '20px' }} />
                </a>
              </div>
            </div>

            {/* Client Summary */}
            <div className="bg-gradient-to-br from-[#f4f4ee] to-white rounded-xl p-8 border-2 hover:shadow-xl transition-all" style={{ borderColor: '#64afac' }}>
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 rounded-lg" style={{ backgroundColor: '#64afac' }}>
                  <MaterialIcon icon="summarize" style={{ fontSize: '32px', color: 'white' }} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2" style={{ color: '#2B4162' }}>
                    Platform Summary
                  </h3>
                  <p className="text-sm" style={{ color: '#737A8C' }}>
                    Technical overview, methodology, and implementation details
                  </p>
                </div>
              </div>
              
              <div className="space-y-2 mb-6 text-sm" style={{ color: '#737A8C' }}>
                <div className="flex items-center gap-2">
                  <MaterialIcon icon="check_circle" style={{ fontSize: '16px', color: '#64afac' }} />
                  <span>Technical architecture</span>
                </div>
                <div className="flex items-center gap-2">
                  <MaterialIcon icon="check_circle" style={{ fontSize: '16px', color: '#64afac' }} />
                  <span>Research foundation</span>
                </div>
                <div className="flex items-center gap-2">
                  <MaterialIcon icon="check_circle" style={{ fontSize: '16px', color: '#64afac' }} />
                  <span>Security & compliance</span>
                </div>
                <div className="flex items-center gap-2">
                  <MaterialIcon icon="check_circle" style={{ fontSize: '16px', color: '#64afac' }} />
                  <span>Dashboard features</span>
                </div>
              </div>

              <div className="flex gap-3">
                <a 
                  href="/api/download-pdf?doc=summary" 
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-white font-medium transition-all hover:opacity-90"
                  style={{ backgroundColor: '#64afac' }}
                >
                  <MaterialIcon icon="download" style={{ fontSize: '20px' }} />
                  <span>Download HTML</span>
                </a>
                <a 
                  href="/BEACON_CLIENT_SUMMARY.md" 
                  download
                  className="px-4 py-3 rounded-lg border-2 font-medium transition-all hover:bg-gray-50"
                  style={{ borderColor: '#64afac', color: '#64afac' }}
                  title="Download Markdown"
                >
                  <MaterialIcon icon="content_copy" style={{ fontSize: '20px' }} />
                </a>
              </div>
            </div>

            {/* Survey Questions */}
            <div className="bg-gradient-to-br from-[#eeefec] to-white rounded-xl p-8 border-2 hover:shadow-xl transition-all" style={{ borderColor: '#5d89a9' }}>
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 rounded-lg" style={{ backgroundColor: '#5d89a9' }}>
                  <MaterialIcon icon="quiz" style={{ fontSize: '32px', color: 'white' }} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2" style={{ color: '#2B4162' }}>
                    Survey Questions
                  </h3>
                  <p className="text-sm" style={{ color: '#737A8C' }}>
                    All survey questions, workflow logic, and response pathways
                  </p>
                </div>
              </div>
              
              <div className="space-y-2 mb-6 text-sm" style={{ color: '#737A8C' }}>
                <div className="flex items-center gap-2">
                  <MaterialIcon icon="check_circle" style={{ fontSize: '16px', color: '#5d89a9' }} />
                  <span>5 core questions</span>
                </div>
                <div className="flex items-center gap-2">
                  <MaterialIcon icon="check_circle" style={{ fontSize: '16px', color: '#5d89a9' }} />
                  <span>Conditional workflows</span>
                </div>
                <div className="flex items-center gap-2">
                  <MaterialIcon icon="check_circle" style={{ fontSize: '16px', color: '#5d89a9' }} />
                  <span>Support pathways</span>
                </div>
                <div className="flex items-center gap-2">
                  <MaterialIcon icon="check_circle" style={{ fontSize: '16px', color: '#5d89a9' }} />
                  <span>Crisis resources</span>
                </div>
              </div>

              <div className="flex gap-3">
                <a 
                  href="/api/download-pdf?doc=questions" 
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-white font-medium transition-all hover:opacity-90"
                  style={{ backgroundColor: '#5d89a9' }}
                >
                  <MaterialIcon icon="download" style={{ fontSize: '20px' }} />
                  <span>Download HTML</span>
                </a>
                <a 
                  href="/SURVEY_QUESTIONS.md" 
                  download
                  className="px-4 py-3 rounded-lg border-2 font-medium transition-all hover:bg-gray-50"
                  style={{ borderColor: '#5d89a9', color: '#5d89a9' }}
                  title="Download Markdown"
                >
                  <MaterialIcon icon="content_copy" style={{ fontSize: '20px' }} />
                </a>
              </div>
            </div>
          </div>

          {/* Download All */}
          <div className="mt-8 text-center">
            <a 
              href="/presentation-pdfs/HOW_TO_CONVERT_TO_PDF.txt" 
              download
              className="inline-flex items-center gap-3 px-8 py-4 rounded-lg text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105"
              style={{ backgroundColor: '#2B4162' }}
            >
              <MaterialIcon icon="info" style={{ fontSize: '24px' }} />
              <span>View PDF Conversion Instructions</span>
            </a>
            <p className="mt-3 text-sm" style={{ color: '#737A8C' }}>
              HTML files are ready - convert to PDF using your browser or online tool
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gradient-to-br from-[#f4f4ee] to-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12" style={{ color: '#2B4162' }}>
            Why Beacon?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex p-4 rounded-full mb-4" style={{ backgroundColor: '#f4f4ee' }}>
                <MaterialIcon icon="speed" style={{ fontSize: '48px', color: '#64afac' }} />
              </div>
              <h3 className="text-xl font-bold mb-2" style={{ color: '#2B4162' }}>Early Detection</h3>
              <p style={{ color: '#737A8C' }}>
                Spot team issues within weeks, not years. Weekly pulse checks provide real-time visibility.
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex p-4 rounded-full mb-4" style={{ backgroundColor: '#eeefec' }}>
                <MaterialIcon icon="psychology" style={{ fontSize: '48px', color: '#5d89a9' }} />
              </div>
              <h3 className="text-xl font-bold mb-2" style={{ color: '#2B4162' }}>Evidence-Based</h3>
              <p style={{ color: '#737A8C' }}>
                Built on validated psychosocial research. Measures what actually predicts burnout and turnover.
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex p-4 rounded-full mb-4" style={{ backgroundColor: '#f4f4ee' }}>
                <MaterialIcon icon="security" style={{ fontSize: '48px', color: '#64afac' }} />
              </div>
              <h3 className="text-xl font-bold mb-2" style={{ color: '#2B4162' }}>Privacy First</h3>
              <p style={{ color: '#737A8C' }}>
                Completely anonymous responses. Only aggregated data visible to leadership teams.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-[#2B4162] to-[#5d89a9] py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Transform Your Workplace?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Start your free 2-week trial with up to 50 employees. No credit card required.
          </p>
          
          <div className="flex flex-wrap gap-4 justify-center">
            <a 
              href="mailto:hello@beaconwellbeing.com.au?subject=Trial Request" 
              className="px-8 py-4 bg-white text-[#2B4162] rounded-lg font-bold text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              Start Free Trial
            </a>
            <a 
              href="https://calendly.com/beacon/demo" 
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-white/10 backdrop-blur text-white rounded-lg font-bold text-lg border-2 border-white/30 hover:bg-white/20 transition-all"
            >
              Book a Demo
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#2B4162] py-8">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <MaterialIcon icon="health_and_safety" style={{ fontSize: '24px', color: '#64afac' }} />
                <span className="text-xl font-bold text-white">Beacon</span>
              </div>
              <p className="text-white/70 text-sm">
                Psychosocial wellbeing platform for modern workplaces
              </p>
            </div>

            <div>
              <h4 className="text-white font-bold mb-3">Resources</h4>
              <div className="space-y-2 text-sm">
                <a href="#materials" className="block text-white/70 hover:text-white transition-colors">
                  Download Materials
                </a>
                <a href="/dashboard" className="block text-white/70 hover:text-white transition-colors">
                  Demo Dashboard
                </a>
                <a href="/methodology" className="block text-white/70 hover:text-white transition-colors">
                  Methodology
                </a>
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
                  <span>1300 BEACON (232 266)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-6 text-center text-white/50 text-sm">
            <p>© 2025 Beacon Wellbeing Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}

