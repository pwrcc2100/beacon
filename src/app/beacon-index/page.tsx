import { MaterialIcon } from '@/components/ui/MaterialIcon';
import { BeaconIndexMobileNav } from '@/components/layout/BeaconIndexMobileNav';

export default function BeaconIndexPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
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
              <div className="hidden sm:flex items-center gap-2">
                <MaterialIcon icon="health_and_safety" style={{ fontSize: '32px', color: '#2A8C8A' }} />
                <span className="text-xl font-bold" style={{ color: '#0B1B2B' }}>Beacon Index</span>
              </div>
              <BeaconIndexMobileNav variant="dark" />
            </div>
          </div>
        </div>
      </header>

      {/* Hero — governance tone + scorecard (from beacon-index.vercel.app) */}
      <section className="py-16 md:py-24 bg-[#F6FAFA] border-b border-[#E0E5E8]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-[1.2fr_0.8fr] gap-10 md:gap-14 items-center">
            <div>
              <p className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide mb-4 border border-[#2A8C8A]/30 bg-[#2A8C8A]/10 text-[#0B1220]">
                Serious governance instrument · Early strain detection
              </p>
              <h1 className="font-serif text-3xl md:text-4xl lg:text-[2.75rem] font-semibold text-[#0B1B2B] leading-tight mb-4" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
                Psychosocial risk is a governance responsibility — not a sentiment metric.
              </h1>
              <p className="text-lg text-[#2E4057] max-w-[38ch] mb-8 leading-relaxed">
                Beacon Index makes psychosocial risk visible at system level, with calibrated domains, defensible thresholds, and trend oversight designed for WHS governance.
              </p>
              <div className="flex flex-wrap gap-3">
                <a href="#methodology" className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-[#2F6F7E] text-white font-semibold text-sm hover:opacity-90 transition-opacity">
                  Methodology
                </a>
                <a href="#governance" className="inline-flex items-center justify-center px-6 py-3 rounded-lg border border-[#D7E0E8] text-[#2F6F7E] font-semibold text-sm hover:border-[#2F6F7E] hover:bg-[#2F6F7E]/5 transition-colors">
                  Governance calibration
                </a>
                <a href="#pilot" className="inline-flex items-center justify-center px-6 py-3 rounded-lg border border-[#D7E0E8] text-[#2F6F7E] font-semibold text-sm hover:border-[#2F6F7E] hover:bg-[#2F6F7E]/5 transition-colors">
                  Pilot overview
                </a>
                <a href="/survey/test-demo" className="inline-flex items-center justify-center px-6 py-3 rounded-lg border border-[#2A8C8A] text-[#2A8C8A] font-semibold text-sm hover:bg-[#2A8C8A]/10 transition-colors">
                  Try Survey
                </a>
              </div>
            </div>
            <div className="flex justify-center md:justify-end">
              <div className="bg-white border border-[#E0E5E8] border-t-4 border-t-[#2F6F7E] rounded-xl p-8 shadow-sm text-center min-w-[280px] max-w-[320px]">
                <div className="text-[11px] font-bold tracking-widest text-[#5b6670] uppercase mb-4">Beacon Index Score</div>
                <div className="text-6xl font-bold text-[#0B1B2B] leading-none mb-4" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>74</div>
                <div className="h-0.5 w-12 bg-[#2A8C8A] rounded-full mx-auto mb-4 opacity-85" />
                <div className="text-sm text-[#2E4057] space-y-1">
                  <p><strong>Status:</strong> Within risk tolerance</p>
                  <p><strong>Trend:</strong> <span className="font-semibold text-[#0B1B2B]">↑ 1.2%</span></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Visibility Gap (from governance site) */}
      <section id="visibility" className="py-16 md:py-20 bg-[#f4f7f6]">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="font-serif text-3xl font-semibold text-[#0B1B2B] mb-6" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
            The Visibility Gap
          </h2>
          <p className="text-[17px] text-[#2E4057] mb-4 leading-relaxed">
            Most organisations detect psychosocial risk after escalation — through complaints, conflict, attrition, or claims.
          </p>
          <p className="text-[17px] text-[#2E4057] mb-4 leading-relaxed">
            WHS expectations require ongoing identification, monitoring, and response. Reactive detection undermines duty of care and exposes organisations to regulatory scrutiny.
          </p>
          <p className="text-[17px] text-[#2E4057] leading-relaxed">
            Beacon Index provides structured, continuous visibility suitable for governance reporting — closing the gap between obligation and operational reality.
          </p>
        </div>
      </section>

      {/* See It in 60 Seconds (from governance site) */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6 flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
          <div className="flex-1">
            <h2 className="font-serif text-3xl font-semibold text-[#0B1B2B] mb-6" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
              See It in 60 Seconds
            </h2>
            <p className="text-[17px] text-[#2E4057] mb-4 leading-relaxed">
              Beacon Index is intentionally simple at the point of interaction. Five calibrated system-level questions. Mobile-first. Typically completed in under one minute.
            </p>
            <p className="text-[17px] text-[#2E4057] mb-4 leading-relaxed">
              In executive briefings, leaders scan a QR code, complete the questions live, and immediately view the composite governance score within the calibrated risk bands.
            </p>
            <p className="text-[17px] text-[#2E4057] mb-4 leading-relaxed">
              The simplicity at the surface contrasts with the modelling beneath — weighted domain scoring, stability logic, de-identification thresholds, and escalation triggers are applied automatically.
            </p>
            <p className="text-sm italic text-[#5a6b6b] mt-4">
              Designed for governance validation — not employee sentiment tracking.
            </p>
          </div>
          <div className="flex-shrink-0 w-full lg:w-[320px] bg-white border border-[#E0E5E8] rounded-xl p-8 shadow-sm border-t-4 border-t-[#2f7f7b] text-center">
            <p className="text-xs font-semibold tracking-wider text-[#2f7f7b] uppercase mb-3">Live governance demonstration</p>
            <h3 className="font-serif text-xl font-semibold text-[#0B1B2B] mb-2" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>Scan → Respond → View</h3>
            <p className="text-[15px] text-[#2E4057]">Composite score appears instantly within calibrated risk bands.</p>
            <div className="h-1 w-14 bg-gradient-to-r from-[#2f7f7b] to-[#6db4b0] rounded-full mx-auto mt-4" />
          </div>
        </div>
      </section>

      {/* Why Organisations Choose Beacon Index (from main app) */}
      <section className="py-16 bg-[#f4f7f6]">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-12 text-center" style={{ color: '#0B1B2B' }}>
            Why Organisations Choose Beacon Index
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center bg-white p-8 rounded-xl border border-[#E0E5E8]">
              <div className="inline-flex p-4 rounded-full mb-4 bg-[#2A8C8A]/10">
                <MaterialIcon icon="speed" style={{ fontSize: '48px', color: '#2A8C8A' }} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-[#0B1B2B]">Early Detection</h3>
              <p className="text-[#2E4057] text-sm leading-relaxed">
                Weekly pulse checks identify issues within weeks. Understand how systems, processes, and culture impact psychological safety.
              </p>
            </div>
            <div className="text-center bg-white p-8 rounded-xl border border-[#E0E5E8]">
              <div className="inline-flex p-4 rounded-full mb-4 bg-[#2A8C8A]/10">
                <MaterialIcon icon="psychology" style={{ fontSize: '48px', color: '#2A8C8A' }} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-[#0B1B2B]">Evidence-Based</h3>
              <p className="text-[#2E4057] text-sm leading-relaxed">
                Built on validated research from Google, Harvard, and leading institutions. Measures workplace systems and culture effectiveness.
              </p>
            </div>
            <div className="text-center bg-white p-8 rounded-xl border border-[#E0E5E8]">
              <div className="inline-flex p-4 rounded-full mb-4 bg-[#2A8C8A]/10">
                <MaterialIcon icon="gavel" style={{ fontSize: '48px', color: '#2A8C8A' }} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-[#0B1B2B]">Compliance Ready</h3>
              <p className="text-[#2E4057] text-sm leading-relaxed">
                Meet psychosocial safety obligations with documented evidence of how workplace systems, processes, and culture support psychological safety.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Methodology (in brief) — from governance site */}
      <section id="methodology" className="py-16 md:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="font-serif text-3xl font-semibold text-[#0B1B2B] mb-10" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
            Methodology (in brief)
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="border border-[#D7E0E8] p-6 bg-white rounded-lg">
              <h3 className="font-serif text-lg font-semibold text-[#0B1B2B] mb-4" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>Domains & Weighting</h3>
              <ul className="text-[15px] text-[#2E4057] space-y-2 pl-5 list-disc">
                <li>Five calibrated ISO 45003-aligned domains</li>
                <li>Weighted composite scoring (0–100)</li>
                <li>System-level conditions, not individual sentiment</li>
              </ul>
            </div>
            <div className="border border-[#D7E0E8] p-6 bg-white rounded-lg">
              <h3 className="font-serif text-lg font-semibold text-[#0B1B2B] mb-4" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>De-identification & Anonymity</h3>
              <ul className="text-[15px] text-[#2E4057] space-y-2 pl-5 list-disc">
                <li>Team-level aggregation minimum thresholds</li>
                <li>Individual responses not identifiable</li>
                <li>Threshold protections maintained across reporting cycles</li>
              </ul>
            </div>
            <div className="border border-[#D7E0E8] p-6 bg-white rounded-lg">
              <h3 className="font-serif text-lg font-semibold text-[#0B1B2B] mb-4" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>Trend Modelling & Stability</h3>
              <ul className="text-[15px] text-[#2E4057] space-y-2 pl-5 list-disc">
                <li>Multi-cycle trend analysis prioritised</li>
                <li>Single-week volatility smoothed</li>
                <li>Sustained movement signals governance significance</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Governance Risk Bands — from governance site */}
      <section id="governance" className="py-16 md:py-20 bg-[#f4f7f6]">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="font-serif text-3xl font-semibold text-[#0B1B2B] mb-6" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
            Governance Risk Bands (Default)
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-[#0B1B2B]">
                  <th className="text-left py-3 px-4 font-semibold text-[15px]">Score Band</th>
                  <th className="text-left py-3 px-4 font-semibold text-[15px]">Classification</th>
                  <th className="text-left py-3 px-4 font-semibold text-[15px]">Governance Response</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                <tr className="border-b border-[#D7E0E8] border-l-4 border-l-[#2F6F7E]">
                  <td className="py-3 px-4 font-semibold font-serif text-[15px]">≥ 80</td>
                  <td className="py-3 px-4 text-[15px]">Low risk</td>
                  <td className="py-3 px-4 text-[15px]">Standard monitoring</td>
                </tr>
                <tr className="border-b border-[#D7E0E8] border-l-4 border-l-[#4C6A88]">
                  <td className="py-3 px-4 font-semibold font-serif text-[15px]">70–79</td>
                  <td className="py-3 px-4 text-[15px]">Within tolerance</td>
                  <td className="py-3 px-4 text-[15px]">Trend review</td>
                </tr>
                <tr className="border-b border-[#D7E0E8] border-l-4 border-l-[#A87B2F]">
                  <td className="py-3 px-4 font-semibold font-serif text-[15px]">60–69</td>
                  <td className="py-3 px-4 text-[15px]">Emerging risk</td>
                  <td className="py-3 px-4 text-[15px]">Targeted review</td>
                </tr>
                <tr className="border-b border-[#D7E0E8] border-l-4 border-l-[#8A3A3A]">
                  <td className="py-3 px-4 font-semibold font-serif text-[15px]">&lt; 60</td>
                  <td className="py-3 px-4 text-[15px]">Elevated risk</td>
                  <td className="py-3 px-4 text-[15px]">Structured intervention</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-sm text-[#2E4057] mt-4 leading-relaxed">
            Default thresholds are evidence-calibrated. Organisations can adjust tolerance bands within defined governance parameters. Core domain weighting remains fixed.
          </p>
        </div>
      </section>

      {/* Explore Beacon Index — from main app */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-8 text-center" style={{ color: '#0B1B2B' }}>
            Explore Beacon Index
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <a href="/beacon-index/features" className="bg-[#F6FAFA] border-2 border-transparent hover:border-[#2A8C8A] p-6 rounded-xl transition-all hover:shadow-md">
              <MaterialIcon icon="star" style={{ fontSize: '48px', color: '#2A8C8A', marginBottom: '12px' }} />
              <h3 className="font-bold mb-2 text-[#0B1B2B]">Features</h3>
              <p className="text-sm text-[#2E4057]">See all platform capabilities</p>
            </a>
            <a href="/beacon-index/about" className="bg-[#F6FAFA] border-2 border-transparent hover:border-[#2A8C8A] p-6 rounded-xl transition-all hover:shadow-md">
              <MaterialIcon icon="info" style={{ fontSize: '48px', color: '#2A8C8A', marginBottom: '12px' }} />
              <h3 className="font-bold mb-2 text-[#0B1B2B]">About</h3>
              <p className="text-sm text-[#2E4057]">Research & methodology</p>
            </a>
            <a href="/survey/test-demo" className="bg-[#F6FAFA] border-2 border-transparent hover:border-[#2A8C8A] p-6 rounded-xl transition-all hover:shadow-md">
              <MaterialIcon icon="quiz" style={{ fontSize: '48px', color: '#2A8C8A', marginBottom: '12px' }} />
              <h3 className="font-bold mb-2 text-[#0B1B2B]">Try Survey</h3>
              <p className="text-sm text-[#2E4057]">Experience the 2-minute survey</p>
            </a>
          </div>
        </div>
      </section>

      {/* How It Works — from main app */}
      <section className="py-16 bg-[#f4f7f6]">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-12 text-center" style={{ color: '#0B1B2B' }}>
            How It Works
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-xl border border-[#E0E5E8]">
              <div className="text-3xl font-bold mb-3 text-[#2A8C8A]">1</div>
              <h3 className="font-bold mb-2 text-[#0B1B2B]">Weekly Survey</h3>
              <p className="text-sm text-[#2E4057]">Employees receive a 60-second survey via SMS or email. Five simple questions.</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-[#E0E5E8]">
              <div className="text-3xl font-bold mb-3 text-[#2A8C8A]">2</div>
              <h3 className="font-bold mb-2 text-[#0B1B2B]">Real-Time Data</h3>
              <p className="text-sm text-[#2E4057]">Responses flow into your dashboard instantly. See trends as they emerge.</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-[#E0E5E8]">
              <div className="text-3xl font-bold mb-3 text-[#2A8C8A]">3</div>
              <h3 className="font-bold mb-2 text-[#0B1B2B]">AI Insights</h3>
              <p className="text-sm text-[#2E4057]">Automated summaries highlight what needs attention and which teams need support.</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-[#E0E5E8]">
              <div className="text-3xl font-bold mb-3 text-[#2A8C8A]">4</div>
              <h3 className="font-bold mb-2 text-[#0B1B2B]">Take Action</h3>
              <p className="text-sm text-[#2E4057]">Intervene early with targeted support. Track impact over time.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pilot — from governance site */}
      <section id="pilot" className="py-16 md:py-20 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="font-serif text-3xl font-semibold text-[#0B1B2B] mb-6" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
            Pilot (Governance Validation)
          </h2>
          <p className="text-[17px] text-[#2E4057] mb-4">
            <strong>This is a governance validation pilot — not a software trial.</strong>
          </p>
          <ul className="text-[16px] text-[#2E4057] space-y-2 pl-6 list-disc mb-8">
            <li>6–8 weeks</li>
            <li>Baseline deployment + calibration workshop</li>
            <li>Weekly reporting cycles with trend review</li>
            <li>Escalation logic validation</li>
            <li>Board-ready summary and recommendations</li>
          </ul>
          <a href="#contact" className="inline-flex items-center justify-center px-8 py-3 rounded-lg bg-[#2F6F7E] text-white font-semibold hover:opacity-90 transition-opacity">
            Request pilot pack
          </a>
        </div>
      </section>

      {/* Testimonial — from main app */}
      <section className="py-16 bg-[#f4f7f6]">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold mb-8" style={{ color: '#0B1B2B' }}>Trusted by Forward-Thinking Organisations</h2>
          <div className="bg-white p-8 rounded-2xl border-2 border-[#2A8C8A]/30 shadow-sm">
            <MaterialIcon icon="format_quote" style={{ fontSize: '40px', color: '#2A8C8A', marginBottom: '16px' }} />
            <p className="text-lg italic text-[#2E2E38] mb-4 leading-relaxed">
              &ldquo;After implementing Beacon, we identified a department with declining Beacon Index scores within 3 weeks. The insights helped us redesign our processes and systems to better support psychological safety. Beacon helped us create a workplace culture where employees feel valued and supported.&rdquo;
            </p>
            <p className="text-sm font-bold text-[#0B1B2B]">— HR Director</p>
            <p className="text-sm text-[#2E4057]">Technology Company, 500 employees</p>
          </div>
        </div>
      </section>

      {/* Contact — from governance site */}
      <section id="contact" className="py-16 bg-[#F3F7FB] border-t border-[#D7E0E8] text-center">
        <div className="max-w-2xl mx-auto px-6">
          <h3 className="font-serif text-xl font-semibold text-[#0B1B2B] mb-4" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
            Contact
          </h3>
          <p className="text-[17px] text-[#2E4057] mb-2">
            Request the executive pack, pilot overview, or methodology summary.
          </p>
          <a href="mailto:hello@beaconeffect.com.au" className="text-[#2F6F7E] font-semibold hover:underline">
            hello@beaconeffect.com.au
          </a>
          <div className="mt-8">
            <a href="mailto:hello@beaconeffect.com.au?subject=Beacon%20Index%20Executive%20Overview" className="inline-flex items-center justify-center px-8 py-3 rounded-lg bg-[#2F6F7E] text-white font-semibold hover:opacity-90 transition-opacity">
              Request Executive Overview
            </a>
          </div>
        </div>
      </section>

      {/* Footer — governance style */}
      <footer className="bg-[#0B1B2B] py-12 text-center">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-lg text-[#D7E0E8] mb-6">
            Structured data. Early signals. Defensible governance insight.
          </p>
          <a href="#contact" className="inline-flex items-center justify-center px-8 py-3 rounded-lg bg-[#2F6F7E] text-white font-semibold hover:opacity-90 transition-opacity">
            Request Executive Overview
          </a>
          <p className="mt-8 text-sm text-[#D7E0E8]/80">© Beacon Effect</p>
        </div>
      </footer>
    </main>
  );
}
