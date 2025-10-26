import { MaterialIcon } from '@/components/ui/MaterialIcon';

export default function AdvisoryPage() {
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
              <MaterialIcon icon="psychology" style={{ fontSize: '32px', color: '#5d89a9' }} />
              <span className="text-xl font-bold" style={{ color: '#2B4162' }}>Beacon Advisory</span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#2B4162] via-[#5d89a9] to-[#64afac] py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-4xl">
            <div className="inline-block px-4 py-2 rounded-full bg-white/20 backdrop-blur text-white text-sm font-medium mb-6">
              <MaterialIcon icon="workspace_premium" style={{ fontSize: '20px', marginRight: '8px' }} />
              Beacon Advisory Services
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-white leading-tight">
              Corporate Concierge for Senior Engagements & Technology Solutions
            </h1>
            <p className="text-xl text-white/90 leading-relaxed mb-8">
              Strategic advisory services combining deep expertise in business improvement, technology 
              implementation, and organisational transformation. From executive-level consulting to 
              custom application development—your trusted partner for complex business challenges.
            </p>
            <div className="flex gap-4 flex-wrap">
                <a 
                  href="mailto:hello@beaconeffect.com.au?subject=Advisory Services Enquiry"
                  className="px-8 py-4 bg-white text-[#2B4162] rounded-lg font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105"
                >
                  Schedule Consultation
                </a>
              <a 
                href="https://www.linkedin.com/in/peta-wilson-4769361"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-white/10 backdrop-blur border-2 border-white/30 text-white rounded-lg font-bold hover:bg-white/20 transition-all"
              >
                <MaterialIcon icon="person" style={{ fontSize: '20px', marginRight: '8px' }} />
                View LinkedIn Profile
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Recognition */}
      <section className="py-16 bg-[#f4f4ee]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4" style={{ color: '#2B4162' }}>Recognition & Awards</h2>
            <p className="text-lg text-[#737A8C]">Industry-recognized expertise in technology and business transformation</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg text-center border-2" style={{ borderColor: '#64afac' }}>
              <MaterialIcon icon="emoji_events" style={{ fontSize: '64px', color: '#64afac', marginBottom: '16px' }} />
              <h3 className="text-xl font-bold mb-2" style={{ color: '#2B4162' }}>HammerTech Award</h3>
              <p className="text-sm text-[#737A8C] mb-2">Technology Excellence</p>
              <p className="text-xs text-[#737A8C]">Australia & New Zealand 2024</p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg text-center">
              <MaterialIcon icon="verified" style={{ fontSize: '64px', color: '#5d89a9', marginBottom: '16px' }} />
              <h3 className="text-xl font-bold mb-2" style={{ color: '#2B4162' }}>Head of Business Improvement</h3>
              <p className="text-sm text-[#737A8C] mb-2">RCC (Richard Crookes Constructions)</p>
              <p className="text-xs text-[#737A8C]">Leading digital transformation initiatives</p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg text-center">
              <MaterialIcon icon="campaign" style={{ fontSize: '64px', color: '#64afac', marginBottom: '16px' }} />
              <h3 className="text-xl font-bold mb-2" style={{ color: '#2B4162' }}>Industry Thought Leader</h3>
              <p className="text-sm text-[#737A8C] mb-2">Featured by multiple consultants</p>
              <p className="text-xs text-[#737A8C]">Interviews on technology & innovation</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold mb-12 text-center" style={{ color: '#2B4162' }}>Advisory Services</h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Strategic Consulting */}
            <div className="bg-gradient-to-br from-[#f4f4ee] to-white p-8 rounded-xl border-2" style={{ borderColor: '#64afac' }}>
              <MaterialIcon icon="psychology" style={{ fontSize: '48px', color: '#64afac', marginBottom: '16px' }} />
              <h3 className="text-2xl font-bold mb-4" style={{ color: '#2B4162' }}>Strategic Consulting</h3>
              <p className="text-[#737A8C] mb-4">
                Executive-level advisory for complex organisational challenges. From digital transformation 
                roadmaps to operational excellence programs.
              </p>
              <ul className="space-y-2 text-sm text-[#737A8C]">
                <li className="flex items-start gap-2">
                  <MaterialIcon icon="check_circle" style={{ fontSize: '20px', color: '#64afac' }} />
                  <span>Business process improvement & optimisation</span>
                </li>
                <li className="flex items-start gap-2">
                  <MaterialIcon icon="check_circle" style={{ fontSize: '20px', color: '#64afac' }} />
                  <span>Digital transformation strategy & execution</span>
                </li>
                <li className="flex items-start gap-2">
                  <MaterialIcon icon="check_circle" style={{ fontSize: '20px', color: '#64afac' }} />
                  <span>Change management & stakeholder engagement</span>
                </li>
                <li className="flex items-start gap-2">
                  <MaterialIcon icon="check_circle" style={{ fontSize: '20px', color: '#64afac' }} />
                  <span>Operational excellence programs</span>
                </li>
              </ul>
            </div>

            {/* Technology Solutions */}
            <div className="bg-gradient-to-br from-[#eeefec] to-white p-8 rounded-xl border-2" style={{ borderColor: '#5d89a9' }}>
              <MaterialIcon icon="code" style={{ fontSize: '48px', color: '#5d89a9', marginBottom: '16px' }} />
              <h3 className="text-2xl font-bold mb-4" style={{ color: '#2B4162' }}>Technology Solutions</h3>
              <p className="text-[#737A8C] mb-4">
                Custom application development and technology platform implementation. From concept to deployment, 
                building solutions that solve real business problems. We take a tactical approach: engage, execute, 
                and hand over—without distracting your high performers from their core responsibilities.
              </p>
              <ul className="space-y-2 text-sm text-[#737A8C]">
                <li className="flex items-start gap-2">
                  <MaterialIcon icon="check_circle" style={{ fontSize: '20px', color: '#5d89a9' }} />
                  <span>Technology platform installation & implementation</span>
                </li>
                <li className="flex items-start gap-2">
                  <MaterialIcon icon="check_circle" style={{ fontSize: '20px', color: '#5d89a9' }} />
                  <span>Custom web & mobile application development</span>
                </li>
                <li className="flex items-start gap-2">
                  <MaterialIcon icon="check_circle" style={{ fontSize: '20px', color: '#5d89a9' }} />
                  <span>System integration & API development</span>
                </li>
                <li className="flex items-start gap-2">
                  <MaterialIcon icon="check_circle" style={{ fontSize: '20px', color: '#5d89a9' }} />
                  <span>Data analytics & business intelligence</span>
                </li>
                <li className="flex items-start gap-2">
                  <MaterialIcon icon="check_circle" style={{ fontSize: '20px', color: '#5d89a9' }} />
                  <span>Technology vendor selection & implementation</span>
                </li>
              </ul>
            </div>

            {/* Executive Advisory */}
            <div className="bg-gradient-to-br from-[#f4f4ee] to-white p-8 rounded-xl border-2" style={{ borderColor: '#64afac' }}>
              <MaterialIcon icon="lightbulb" style={{ fontSize: '48px', color: '#64afac', marginBottom: '16px' }} />
              <h3 className="text-2xl font-bold mb-4" style={{ color: '#2B4162' }}>Executive Advisory</h3>
              <p className="text-[#737A8C] mb-4">
                Strategic guidance for senior leaders navigating complex decisions. Expert advice on 
                technology, operations, and transformation—without stepping into line management roles.
              </p>
              <ul className="space-y-2 text-sm text-[#737A8C]">
                <li className="flex items-start gap-2">
                  <MaterialIcon icon="check_circle" style={{ fontSize: '20px', color: '#64afac' }} />
                  <span>Technology strategy & roadmap development</span>
                </li>
                <li className="flex items-start gap-2">
                  <MaterialIcon icon="check_circle" style={{ fontSize: '20px', color: '#64afac' }} />
                  <span>Operational excellence & process improvement</span>
                </li>
                <li className="flex items-start gap-2">
                  <MaterialIcon icon="check_circle" style={{ fontSize: '20px', color: '#64afac' }} />
                  <span>Digital transformation planning & execution</span>
                </li>
                <li className="flex items-start gap-2">
                  <MaterialIcon icon="check_circle" style={{ fontSize: '20px', color: '#64afac' }} />
                  <span>Strategic program oversight & governance</span>
                </li>
              </ul>
            </div>

            {/* Corporate Concierge */}
            <div className="bg-gradient-to-br from-[#eeefec] to-white p-8 rounded-xl border-2" style={{ borderColor: '#5d89a9' }}>
              <MaterialIcon icon="concierge" style={{ fontSize: '48px', color: '#5d89a9', marginBottom: '16px' }} />
              <h3 className="text-2xl font-bold mb-4" style={{ color: '#2B4162' }}>Corporate Concierge</h3>
              <p className="text-[#737A8C] mb-4">
                Let Beacon Advisory handle the important initiatives that don't align with anyone's primary role. 
                We take a tactical approach—engage, execute, and hand over—allowing your high performers to focus 
                on what they do best. Don't dilute your team's effectiveness by assigning critical projects outside 
                their core expertise simply because they're capable. Let them excel in their roles while we deliver 
                the initiatives that matter.
              </p>
              <div className="bg-white/50 rounded-lg p-4 mb-4 border-l-4" style={{ borderColor: '#5d89a9' }}>
                <p className="text-sm italic text-[#737A8C] mb-2">
                  <strong style={{ color: '#2B4162' }}>Broad expertise in delivering unique projects:</strong> If you have 
                  something that needs doing but doesn't fit the R&R of anyone in your organisation—or requires 
                  a short-term secondment into uncharted territory—we can help.
                </p>
                <p className="text-xs text-[#737A8C]">
                  <strong>Past examples:</strong> COVID-19 Response Team leadership (accolades from NSW Health), 
                  office relocation project (sourcing & recommending spaces, design brief creation, change management 
                  templates, communication plans, move day coordination), executive KPI dashboard development for 
                  real-time decision making.
                </p>
              </div>
              <ul className="space-y-2 text-sm text-[#737A8C]">
                <li className="flex items-start gap-2">
                  <MaterialIcon icon="check_circle" style={{ fontSize: '20px', color: '#5d89a9' }} />
                  <span>Executive dashboard development (Power BI, Tableau, custom) providing real-time KPI tracking & insights for leadership decision making</span>
                </li>
                <li className="flex items-start gap-2">
                  <MaterialIcon icon="check_circle" style={{ fontSize: '20px', color: '#5d89a9' }} />
                  <span>Unique projects & short-term secondments</span>
                </li>
                <li className="flex items-start gap-2">
                  <MaterialIcon icon="check_circle" style={{ fontSize: '20px', color: '#5d89a9' }} />
                  <span>Crisis response & uncharted territory navigation</span>
                </li>
                <li className="flex items-start gap-2">
                  <MaterialIcon icon="check_circle" style={{ fontSize: '20px', color: '#5d89a9' }} />
                  <span>Vendor selection & contract negotiation</span>
                </li>
                <li className="flex items-start gap-2">
                  <MaterialIcon icon="check_circle" style={{ fontSize: '20px', color: '#5d89a9' }} />
                  <span>Board & executive presentations</span>
                </li>
                <li className="flex items-start gap-2">
                  <MaterialIcon icon="check_circle" style={{ fontSize: '20px', color: '#5d89a9' }} />
                  <span>Business case development & ROI analysis</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Expertise Areas */}
      <section className="py-16 bg-[#f4f4ee]">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-12 text-center" style={{ color: '#2B4162' }}>Areas of Expertise</h2>
          
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl text-center shadow-sm">
              <MaterialIcon icon="business" style={{ fontSize: '40px', color: '#64afac', marginBottom: '12px' }} />
              <h3 className="font-bold mb-2 text-sm" style={{ color: '#2B4162' }}>Business Improvement</h3>
              <p className="text-xs text-[#737A8C]">Process optimisation, lean methodologies, continuous improvement</p>
            </div>

            <div className="bg-white p-6 rounded-xl text-center shadow-sm">
              <MaterialIcon icon="devices" style={{ fontSize: '40px', color: '#5d89a9', marginBottom: '12px' }} />
              <h3 className="font-bold mb-2 text-sm" style={{ color: '#2B4162' }}>Digital Transformation</h3>
              <p className="text-xs text-[#737A8C]">Technology strategy, system modernization, cloud migration</p>
            </div>

            <div className="bg-white p-6 rounded-xl text-center shadow-sm">
              <MaterialIcon icon="analytics" style={{ fontSize: '40px', color: '#64afac', marginBottom: '12px' }} />
              <h3 className="font-bold mb-2 text-sm" style={{ color: '#2B4162' }}>Data & Analytics</h3>
              <p className="text-xs text-[#737A8C]">Business intelligence, reporting, data-driven decision making</p>
            </div>

            <div className="bg-white p-6 rounded-xl text-center shadow-sm">
              <MaterialIcon icon="groups" style={{ fontSize: '40px', color: '#5d89a9', marginBottom: '12px' }} />
              <h3 className="font-bold mb-2 text-sm" style={{ color: '#2B4162' }}>Change Management</h3>
              <p className="text-xs text-[#737A8C]">Stakeholder engagement, training, adoption strategies</p>
            </div>

            <div className="bg-white p-6 rounded-xl text-center shadow-sm">
              <MaterialIcon icon="construction" style={{ fontSize: '40px', color: '#64afac', marginBottom: '12px' }} />
              <h3 className="font-bold mb-2 text-sm" style={{ color: '#2B4162' }}>Construction Tech</h3>
              <p className="text-xs text-[#737A8C]">Industry-specific solutions, safety systems, project management</p>
            </div>

            <div className="bg-white p-6 rounded-xl text-center shadow-sm">
              <MaterialIcon icon="security" style={{ fontSize: '40px', color: '#64afac', marginBottom: '12px' }} />
              <h3 className="font-bold mb-2 text-sm" style={{ color: '#2B4162' }}>Compliance & Risk</h3>
              <p className="text-xs text-[#737A8C]">Regulatory compliance, risk management, audit preparation</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-12 text-center" style={{ color: '#2B4162' }}>Client & Colleague Testimonials</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-[#f4f4ee] to-white p-8 rounded-xl border-l-4" style={{ borderColor: '#64afac' }}>
              <MaterialIcon icon="format_quote" style={{ fontSize: '40px', color: '#64afac', marginBottom: '16px' }} />
              <p className="text-[#737A8C] italic mb-4 leading-relaxed">
                "Exceptional leadership in driving digital transformation initiatives. Demonstrated strategic 
                thinking and ability to deliver complex technology projects on time and within budget."
              </p>
              <div className="text-sm font-bold" style={{ color: '#2B4162' }}>— Senior Executive</div>
              <div className="text-xs text-[#737A8C]">Richard Crookes Constructions</div>
            </div>

            <div className="bg-gradient-to-br from-[#eeefec] to-white p-8 rounded-xl border-l-4" style={{ borderColor: '#5d89a9' }}>
              <MaterialIcon icon="format_quote" style={{ fontSize: '40px', color: '#5d89a9', marginBottom: '16px' }} />
              <p className="text-[#737A8C] italic mb-4 leading-relaxed">
                "Outstanding ability to translate complex technical concepts into actionable business strategies. 
                A trusted advisor who consistently delivers results."
              </p>
              <div className="text-sm font-bold" style={{ color: '#2B4162' }}>— Technology Partner</div>
              <div className="text-xs text-[#737A8C]">Industry Consultant</div>
            </div>

            <div className="bg-gradient-to-br from-[#f4f4ee] to-white p-8 rounded-xl border-l-4" style={{ borderColor: '#64afac' }}>
              <MaterialIcon icon="format_quote" style={{ fontSize: '40px', color: '#64afac', marginBottom: '16px' }} />
              <p className="text-[#737A8C] italic mb-4 leading-relaxed">
                "Innovative approach to problem-solving and deep expertise in business process improvement. 
                Instrumental in driving operational excellence across the organisation."
              </p>
              <div className="text-sm font-bold" style={{ color: '#2B4162' }}>— Operations Director</div>
              <div className="text-xs text-[#737A8C]">Construction Industry</div>
            </div>

            <div className="bg-gradient-to-br from-[#eeefec] to-white p-8 rounded-xl border-l-4" style={{ borderColor: '#5d89a9' }}>
              <MaterialIcon icon="format_quote" style={{ fontSize: '40px', color: '#5d89a9', marginBottom: '16px' }} />
              <p className="text-[#737A8C] italic mb-4 leading-relaxed">
                "Recognized industry leader with proven track record in technology excellence. Award-winning 
                contributions to innovation and digital transformation."
              </p>
              <div className="text-sm font-bold" style={{ color: '#2B4162' }}>— HammerTech</div>
              <div className="text-xs text-[#737A8C]">Technology Excellence Award 2024</div>
            </div>
          </div>
        </div>
      </section>

      {/* Engagement Models */}
      <section className="py-16 bg-[#eeefec]">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-12 text-center" style={{ color: '#2B4162' }}>Engagement Models</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <MaterialIcon icon="schedule" style={{ fontSize: '48px', color: '#64afac', marginBottom: '16px' }} />
              <h3 className="text-xl font-bold mb-3" style={{ color: '#2B4162' }}>Project-Based</h3>
              <p className="text-sm text-[#737A8C] mb-4">
                Fixed-scope engagements with defined deliverables and timelines. Ideal for specific initiatives 
                or transformation programs.
              </p>
              <div className="text-xs text-[#737A8C]">
                <strong>Duration:</strong> 3-12 months<br/>
                <strong>Best for:</strong> Defined projects with clear outcomes
              </div>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border-2" style={{ borderColor: '#5d89a9' }}>
              <MaterialIcon icon="autorenew" style={{ fontSize: '48px', color: '#5d89a9', marginBottom: '16px' }} />
              <h3 className="text-xl font-bold mb-3" style={{ color: '#2B4162' }}>Retainer</h3>
              <p className="text-sm text-[#737A8C] mb-4">
                Ongoing advisory relationship with flexible scope. Regular strategic guidance and support 
                as your business evolves.
              </p>
              <div className="text-xs text-[#737A8C]">
                <strong>Duration:</strong> 6-24 months<br/>
                <strong>Best for:</strong> Continuous improvement & strategic guidance
              </div>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm">
              <MaterialIcon icon="handshake" style={{ fontSize: '48px', color: '#64afac', marginBottom: '16px' }} />
              <h3 className="text-xl font-bold mb-3" style={{ color: '#2B4162' }}>Advisory Partnership</h3>
              <p className="text-sm text-[#737A8C] mb-4">
                Embedded advisory support for your leadership team. Regular strategic guidance without 
                taking on line management responsibilities.
              </p>
              <div className="text-xs text-[#737A8C]">
                <strong>Duration:</strong> 6-18 months<br/>
                <strong>Best for:</strong> Major transformations & strategic programs
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-[#2B4162] to-[#5d89a9]">
        <div className="max-w-4xl mx-auto px-6 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">Let's Discuss Your Challenge</h2>
          <p className="text-xl mb-8 opacity-90">
            Whether you need strategic advice, technology solutions, or interim leadership—let's explore 
            how we can help your organisation succeed.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a 
              href="mailto:hello@beaconeffect.com.au?subject=Advisory Services Consultation"
              className="px-8 py-4 bg-white text-[#2B4162] rounded-lg font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              Schedule Consultation
            </a>
            <a 
              href="https://www.linkedin.com/in/peta-wilson-4769361"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-white/10 backdrop-blur text-white rounded-lg font-bold border-2 border-white/30 hover:bg-white/20 transition-all"
            >
              Connect on LinkedIn
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
                <MaterialIcon icon="auto_awesome" style={{ fontSize: '24px', color: '#64afac' }} />
                <span className="text-lg font-bold text-white">Beacon Effect</span>
              </div>
              <p className="text-white/70 text-sm">
                Strategic solutions for modern business
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

