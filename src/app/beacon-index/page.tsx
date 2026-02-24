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

      {/* Hero — credible governance + human warmth */}
      <section className="py-16 md:py-24 bg-[#F2F7F5] border-b border-[#D7E5E0]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-[1.2fr_0.8fr] gap-10 md:gap-14 items-center">
            <div>
              <p className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide mb-4 border border-[#2A8C8A]/30 bg-[#2A8C8A]/10 text-[#0B1220]">
                Governance-grade · Built for people
              </p>
              <h1 className="font-serif text-3xl md:text-4xl lg:text-[2.75rem] font-semibold text-[#0B1B2B] leading-tight mb-4" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
                See what&apos;s really going on — before it becomes a problem.
              </h1>
              <p className="text-lg text-[#2E4057] max-w-[42ch] mb-8 leading-relaxed">
                Beacon Index makes psychosocial risk visible at system level: calibrated, defensible, and designed so leaders can act early. Serious about compliance — and about the people behind the numbers.
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

      {/* The Visibility Gap */}
      <section id="visibility" className="py-16 md:py-20 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="font-serif text-3xl font-semibold text-[#0B1B2B] mb-6" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
            The visibility gap
          </h2>
          <p className="text-[17px] text-[#2E4057] mb-4 leading-relaxed">
            Most organisations only see psychosocial risk after it shows up as complaints, conflict, or people leaving. That&apos;s hard on everyone — and it&apos;s not enough for modern WHS expectations.
          </p>
          <p className="text-[17px] text-[#2E4057] mb-4 leading-relaxed">
            Ongoing identification, monitoring, and response aren&apos;t just compliance boxes to tick. They&apos;re how you close the gap between &ldquo;we care&rdquo; and &ldquo;we know what&apos;s going on.&rdquo;
          </p>
          <p className="text-[17px] text-[#2E4057] leading-relaxed">
            Beacon Index gives you structured, continuous visibility you can report on — and act on — with confidence.
          </p>
        </div>
      </section>

      {/* See It in 60 Seconds */}
      <section className="py-16 md:py-20 bg-[#f6f9f7]">
        <div className="max-w-6xl mx-auto px-6 flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
          <div className="flex-1">
            <h2 className="font-serif text-3xl font-semibold text-[#0B1B2B] mb-6" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
              See it in 60 seconds
            </h2>
            <p className="text-[17px] text-[#2E4057] mb-4 leading-relaxed">
              We kept it simple on purpose: five calibrated questions, mobile-first, usually done in under a minute. Less burden for your people; a clear picture for your leaders.
            </p>
            <p className="text-[17px] text-[#2E4057] mb-4 leading-relaxed">
              In executive briefings, leaders can scan a QR code, complete the questions live, and see the composite score and risk band straight away. The heavy lifting — weighted domains, stability logic, de-identification, escalation triggers — happens behind the scenes.
            </p>
            <p className="text-[17px] text-[#2E4057] mb-4 leading-relaxed">
              So you get governance-grade validation without turning the survey into a chore.
            </p>
            <p className="text-sm italic text-[#5a6b6b] mt-4">
              Built for governance — designed with people in mind.
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

      {/* Why Organisations Choose Beacon Index */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-4 text-center" style={{ color: '#0B1B2B' }}>
            Why organisations choose Beacon Index
          </h2>
          <p className="text-center text-[17px] text-[#2E4057] max-w-2xl mx-auto mb-12 leading-relaxed">
            Stay compliant and create workplaces where people can speak up and get support — with evidence, not guesswork.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center bg-white p-8 rounded-xl border border-[#E0E5E8]">
              <div className="inline-flex p-4 rounded-full mb-4 bg-[#2A8C8A]/10">
                <MaterialIcon icon="speed" style={{ fontSize: '48px', color: '#2A8C8A' }} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-[#0B1B2B]">Early detection</h3>
              <p className="text-[#2E4057] text-sm leading-relaxed">
                Weekly pulse checks surface issues within weeks — so you can respond before they escalate. See how systems, processes, and culture are really landing.
              </p>
            </div>
            <div className="text-center bg-white p-8 rounded-xl border border-[#E0E5E8]">
              <div className="inline-flex p-4 rounded-full mb-4 bg-[#2A8C8A]/10">
                <MaterialIcon icon="psychology" style={{ fontSize: '48px', color: '#2A8C8A' }} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-[#0B1B2B]">Evidence-based</h3>
              <p className="text-[#2E4057] text-sm leading-relaxed">
                Built on validated research from Google, Harvard, and leading institutions — so your numbers stand up and your people feel heard.
              </p>
            </div>
            <div className="text-center bg-white p-8 rounded-xl border border-[#E0E5E8]">
              <div className="inline-flex p-4 rounded-full mb-4 bg-[#2A8C8A]/10">
                <MaterialIcon icon="gavel" style={{ fontSize: '48px', color: '#2A8C8A' }} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-[#0B1B2B]">Compliance-ready</h3>
              <p className="text-[#2E4057] text-sm leading-relaxed">
                Meet psychosocial safety obligations with clear, documented evidence — and show how your workplace supports people, not just policies.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Methodology (in brief) */}
      <section id="methodology" className="py-16 md:py-20 bg-[#f6f9f7]">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="font-serif text-3xl font-semibold text-[#0B1B2B] mb-10" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
            Methodology in brief
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

      {/* Governance Risk Bands */}
      <section id="governance" className="py-16 md:py-20 bg-white">
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

      {/* Explore Beacon Index — card layout (consulting-style) */}
      <section className="py-16 bg-[#f6f9f7]">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-4 text-center" style={{ color: '#0B1B2B' }}>
            Explore Beacon Index
          </h2>
          <p className="text-center text-[#2E4057] mb-10 max-w-2xl mx-auto">
            Dig into methodology, platform capabilities, or try the survey yourself.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <a href="/beacon-index/features" className="group block bg-white rounded-xl border border-[#E0E5E8] overflow-hidden shadow-sm hover:shadow-md hover:border-[#2A8C8A]/40 transition-all duration-200">
              <div className="p-6 pb-4">
                <h3 className="font-bold text-lg text-[#0B1B2B] mb-2 group-hover:text-[#2F6F7E] transition-colors">Features</h3>
                <p className="text-sm text-[#2E4057] leading-relaxed mb-4">
                  See how Beacon Index surfaces early signals: dashboards, risk bands, trend reporting, and leader-ready insights — all designed for governance and action.
                </p>
                <p className="text-xs font-medium text-[#2A8C8A]">Platform · 3 min read</p>
              </div>
              <div className="h-32 bg-gradient-to-br from-[#2A8C8A]/20 via-[#2F6F7E]/15 to-[#0B1B2B]/10 flex items-center justify-center">
                <MaterialIcon icon="dashboard" style={{ fontSize: '48px', color: 'rgba(42, 140, 138, 0.5)' }} />
              </div>
            </a>
            <a href="/beacon-index/about" className="group block bg-white rounded-xl border border-[#E0E5E8] overflow-hidden shadow-sm hover:shadow-md hover:border-[#2A8C8A]/40 transition-all duration-200">
              <div className="p-6 pb-4">
                <h3 className="font-bold text-lg text-[#0B1B2B] mb-2 group-hover:text-[#2F6F7E] transition-colors">About</h3>
                <p className="text-sm text-[#2E4057] leading-relaxed mb-4">
                  Built on leading research from Harvard, Google, and WHS standards. Understand the science behind the five domains and how we keep people at the centre.
                </p>
                <p className="text-xs font-medium text-[#2A8C8A]">Research · 5 min read</p>
              </div>
              <div className="h-32 bg-gradient-to-br from-[#5d89a9]/20 via-[#64afac]/15 to-[#0B1B2B]/10 flex items-center justify-center">
                <MaterialIcon icon="auto_stories" style={{ fontSize: '48px', color: 'rgba(93, 137, 169, 0.5)' }} />
              </div>
            </a>
            <a href="/survey/test-demo" className="group block bg-white rounded-xl border border-[#E0E5E8] overflow-hidden shadow-sm hover:shadow-md hover:border-[#2A8C8A]/40 transition-all duration-200">
              <div className="p-6 pb-4">
                <h3 className="font-bold text-lg text-[#0B1B2B] mb-2 group-hover:text-[#2F6F7E] transition-colors">Try the survey</h3>
                <p className="text-sm text-[#2E4057] leading-relaxed mb-4">
                  Experience the same five questions your people see: quick, mobile-friendly, and calibrated for system-level psychosocial risk. See your score in under 60 seconds.
                </p>
                <p className="text-xs font-medium text-[#2A8C8A]">Experience · 2 min</p>
              </div>
              <div className="h-32 bg-gradient-to-br from-[#2F6F7E]/25 via-[#2A8C8A]/15 to-[#0B1B2B]/10 flex items-center justify-center">
                <MaterialIcon icon="touch_app" style={{ fontSize: '48px', color: 'rgba(47, 111, 126, 0.5)' }} />
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-12 text-center" style={{ color: '#0B1B2B' }}>
            How it works
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

      {/* Pilot */}
      <section id="pilot" className="py-16 md:py-20 bg-[#f6f9f7]">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="font-serif text-3xl font-semibold text-[#0B1B2B] mb-6" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
            Run a pilot with us
          </h2>
          <p className="text-[17px] text-[#2E4057] mb-4">
            We run a <strong>governance validation pilot</strong> — not a generic software trial. You get real data, real calibration, and a path to board-ready reporting.
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

      {/* Testimonial */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold mb-8" style={{ color: '#0B1B2B' }}>Trusted by forward-thinking organisations</h2>
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

      {/* Contact */}
      <section id="contact" className="py-16 bg-[#F2F7F5] border-t border-[#D7E5E0] text-center">
        <div className="max-w-2xl mx-auto px-6">
          <h3 className="font-serif text-xl font-semibold text-[#0B1B2B] mb-4" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
            Get in touch
          </h3>
          <p className="text-[17px] text-[#2E4057] mb-2">
            We&apos;d love to hear from you. Request the executive pack, pilot overview, or methodology summary — or just say hello.
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
            Early signals. Clear picture. Governance that cares about people.
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
