import { MaterialIcon } from '@/components/ui/MaterialIcon';
import { BeaconIndexMobileNav } from '@/components/layout/BeaconIndexMobileNav';

export default function BeaconIndexV2Page() {
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
            <div className="flex items-center gap-3">
              <a href="/beacon-index" className="hidden sm:inline text-sm text-[#2F6F7E] hover:underline">
                Current version
              </a>
              <div className="flex items-center gap-2">
                <MaterialIcon icon="health_and_safety" style={{ fontSize: '32px', color: '#2A8C8A' }} />
                <span className="text-xl font-bold text-[#0B1B2B]">Beacon Index</span>
                <span className="text-xs font-medium text-[#737A8C] bg-[#f0f4f2] px-2 py-0.5 rounded">V2</span>
              </div>
              <BeaconIndexMobileNav variant="dark" />
            </div>
          </div>
        </div>
      </header>

      {/* Hero: Beacon brings data and insights */}
      <section className="py-16 md:py-20 bg-[#F2F7F5] border-b border-[#D7E5E0]">
        <div className="max-w-6xl mx-auto px-6">
          <h1 className="text-3xl md:text-4xl font-bold text-[#0B1B2B] mb-12 text-center" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
            Beacon brings data and insights that help your business
          </h1>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 border border-[#E0E5E8] shadow-sm">
              <h2 className="text-lg font-bold text-[#2F6F7E] mb-3">Manage & comply</h2>
              <p className="text-[#2E4057] text-sm leading-relaxed">
                Meet Safe Work and ISO 45003 psychosocial safety requirements with clear evidence and ongoing monitoring.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-[#E0E5E8] shadow-sm">
              <h2 className="text-lg font-bold text-[#2F6F7E] mb-3">Implement & report</h2>
              <p className="text-[#2E4057] text-sm leading-relaxed">
                Psychosocial consultation, early issue detection, and continuous improvement — with reporting that fits your governance.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-[#E0E5E8] shadow-sm">
              <h2 className="text-lg font-bold text-[#2F6F7E] mb-3">Proactively manage</h2>
              <p className="text-[#2E4057] text-sm leading-relaxed">
                Address psychosocial risk including stress, workload, and conflict before they escalate — so people and teams can thrive.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How does it do this? */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-[#0B1B2B] mb-10 text-center" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
            How does it do this?
          </h2>
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="flex gap-4 p-5 rounded-xl bg-[#f6f9f7] border-l-4 border-[#2A8C8A]">
              <div className="flex-shrink-0">
                <MaterialIcon icon="visibility" style={{ fontSize: '28px', color: '#2A8C8A' }} />
              </div>
              <div>
                <h3 className="font-bold text-[#0B1B2B] mb-1">Visibility of risk indicators</h3>
                <p className="text-sm text-[#2E4057] leading-relaxed">Enables early response and helps reduce incidents before they become serious.</p>
              </div>
            </div>
            <div className="flex gap-4 p-5 rounded-xl bg-[#f6f9f7] border-l-4 border-[#2A8C8A]">
              <div className="flex-shrink-0">
                <MaterialIcon icon="forum" style={{ fontSize: '28px', color: '#2A8C8A' }} />
              </div>
              <div>
                <h3 className="font-bold text-[#0B1B2B] mb-1">Simple feedback channel</h3>
                <p className="text-sm text-[#2E4057] leading-relaxed">A simple, consistent way for people to share how they&apos;re feeling and seek support when they need it.</p>
              </div>
            </div>
            <div className="flex gap-4 p-5 rounded-xl bg-[#f6f9f7] border-l-4 border-[#2A8C8A]">
              <div className="flex-shrink-0">
                <MaterialIcon icon="insights" style={{ fontSize: '28px', color: '#2A8C8A' }} />
              </div>
              <div>
                <h3 className="font-bold text-[#0B1B2B] mb-1">Beyond traditional metrics</h3>
                <p className="text-sm text-[#2E4057] leading-relaxed">Goes beyond lagging safety metrics to capture how people are really experiencing work.</p>
              </div>
            </div>
            <div className="flex gap-4 p-5 rounded-xl bg-[#f6f9f7] border-l-4 border-[#2A8C8A]">
              <div className="flex-shrink-0">
                <MaterialIcon icon="verified_user" style={{ fontSize: '28px', color: '#2A8C8A' }} />
              </div>
              <div>
                <h3 className="font-bold text-[#0B1B2B] mb-1">Trusted communication</h3>
                <p className="text-sm text-[#2E4057] leading-relaxed">An easy-to-use channel for feedback that people trust — private, clear, and actionable.</p>
              </div>
            </div>
          </div>
          <p className="text-center text-[17px] text-[#2E4057] max-w-3xl mx-auto leading-relaxed font-medium">
            Workplaces that embed Beacon into business-as-usual safety practice are set up for greater psychosocial success.
          </p>
        </div>
      </section>

      {/* What is the Beacon Survey? */}
      <section className="py-16 md:py-20 bg-[#f6f9f7]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-[#0B1B2B] mb-6" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
                What is the Beacon survey?
              </h2>
              <ul className="space-y-4 text-[#2E4057] text-[17px] leading-relaxed">
                <li className="flex gap-3">
                  <span className="text-[#2A8C8A] mt-1">•</span>
                  <span>A fast weekly pulse using research-based questions.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#2A8C8A] mt-1">•</span>
                  <span>People respond in seconds via SMS or link — simple options for each question.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#2A8C8A] mt-1">•</span>
                  <span>Questions are designed to detect early stages of psychosocial pressure and workplace conditions.</span>
                </li>
              </ul>
            </div>
            <div className="flex justify-center">
              {/* Simple phone mockup */}
              <div className="w-48 h-80 rounded-3xl border-4 border-[#2F6F7E] bg-white shadow-lg flex flex-col items-center justify-center p-4 gap-4">
                <div className="w-full h-2 rounded-full bg-[#E0E5E8]" />
                <div className="flex flex-col gap-3 flex-1 justify-center">
                  <MaterialIcon icon="thumb_up" style={{ fontSize: '36px', color: '#2A8C8A' }} />
                  <MaterialIcon icon="thumb_down" style={{ fontSize: '36px', color: '#737A8C' }} />
                </div>
                <p className="text-xs text-[#737A8C]">Quick response</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why these 5 questions matter */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-[#0B1B2B] mb-10 text-center" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
            Why these 5 questions matter
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
            <div className="bg-[#f6f9f7] rounded-xl p-5 border border-[#E0E5E8] text-center">
              <div className="inline-flex p-3 rounded-full bg-[#2A8C8A]/15 mb-3">
                <MaterialIcon icon="trending_up" style={{ fontSize: '28px', color: '#2A8C8A' }} />
              </div>
              <h3 className="font-bold text-[#0B1B2B] text-sm mb-2">Workload & pressure</h3>
              <p className="text-xs text-[#2E4057] leading-relaxed">Detects job demand spikes.</p>
            </div>
            <div className="bg-[#f6f9f7] rounded-xl p-5 border border-[#E0E5E8] text-center">
              <div className="inline-flex p-3 rounded-full bg-[#2A8C8A]/15 mb-3">
                <MaterialIcon icon="support" style={{ fontSize: '28px', color: '#2A8C8A' }} />
              </div>
              <h3 className="font-bold text-[#0B1B2B] text-sm mb-2">Support & communication</h3>
              <p className="text-xs text-[#2E4057] leading-relaxed">Shows whether teams feel backed by leaders.</p>
            </div>
            <div className="bg-[#f6f9f7] rounded-xl p-5 border border-[#E0E5E8] text-center">
              <div className="inline-flex p-3 rounded-full bg-[#2A8C8A]/15 mb-3">
                <MaterialIcon icon="explore" style={{ fontSize: '28px', color: '#2A8C8A' }} />
              </div>
              <h3 className="font-bold text-[#0B1B2B] text-sm mb-2">Clarity & planning</h3>
              <p className="text-xs text-[#2E4057] leading-relaxed">Identifies confusion, rework, and coordination issues.</p>
            </div>
            <div className="bg-[#f6f9f7] rounded-xl p-5 border border-[#E0E5E8] text-center">
              <div className="inline-flex p-3 rounded-full bg-[#2A8C8A]/15 mb-3">
                <MaterialIcon icon="groups" style={{ fontSize: '28px', color: '#2A8C8A' }} />
              </div>
              <h3 className="font-bold text-[#0B1B2B] text-sm mb-2">Team climate & respect</h3>
              <p className="text-xs text-[#2E4057] leading-relaxed">Captures psychological safety signals.</p>
            </div>
            <div className="bg-[#f6f9f7] rounded-xl p-5 border border-[#E0E5E8] text-center">
              <div className="inline-flex p-3 rounded-full bg-[#2A8C8A]/15 mb-3">
                <MaterialIcon icon="psychology" style={{ fontSize: '28px', color: '#2A8C8A' }} />
              </div>
              <h3 className="font-bold text-[#0B1B2B] text-sm mb-2">General wellbeing</h3>
              <p className="text-xs text-[#2E4057] leading-relaxed">Quick indicator of how people feel about work this week.</p>
            </div>
          </div>
          <p className="text-center text-sm text-[#737A8C] italic">
            Questions map to ISO 45003 risk factors and evidence-based psychosocial drivers.
          </p>
        </div>
      </section>

      {/* How the Beacon Index is created */}
      <section className="py-16 md:py-20 bg-[#f6f9f7]">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-[#0B1B2B] mb-12 text-center" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
            How the Beacon Index is created
          </h2>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 md:gap-2">
            {[
              { icon: 'assignment', label: 'Raw responses' },
              { icon: 'filter_alt', label: 'Cleaned & de-identified' },
              { icon: 'balance', label: 'Weighted scoring applied' },
              { icon: 'bar_chart', label: 'Dashboard with trend analysis' },
              { icon: 'speed', label: 'Beacon Index (0–100) for teams & organisation' },
            ].map((step, i) => (
              <div key={i} className="flex flex-col md:flex-row items-center gap-2 md:gap-3 flex-1">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-white border-2 border-[#2A8C8A] flex items-center justify-center shadow-sm">
                    <MaterialIcon icon={step.icon} style={{ fontSize: '22px', color: '#2A8C8A' }} />
                  </div>
                  <p className="text-xs font-medium text-[#0B1B2B] text-center max-w-[120px]">{step.label}</p>
                </div>
                {i < 4 && <span className="hidden md:inline text-[#2A8C8A]">→</span>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feedback loop to leaders */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-[#0B1B2B] mb-8 text-center" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
            Feedback loop to leaders
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { icon: 'dashboard', label: 'Real-time dashboard' },
              { icon: 'lightbulb', label: 'Daily/weekly team insights' },
              { icon: 'groups', label: 'Leadership action' },
              { icon: 'assignment', label: 'Survey' },
            ].map((item, i) => (
              <div key={i} className="bg-[#f6f9f7] rounded-xl p-4 border border-[#E0E5E8] text-center">
                <MaterialIcon icon={item.icon} style={{ fontSize: '32px', color: '#2A8C8A', marginBottom: '8px' }} />
                <p className="text-sm font-medium text-[#0B1B2B]">{item.label}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-[#2E4057] text-[15px] leading-relaxed">
            Leaders receive clear insights: hotspots, comments, trends, and week-on-week movement. Early detection means leaders act sooner and target only the areas that need support. Focus on conditions, not individuals.
          </p>
          <div className="mt-6 text-center">
            <div className="inline-flex p-4 rounded-full bg-[#2A8C8A]/15">
              <MaterialIcon icon="volunteer_activism" style={{ fontSize: '36px', color: '#2A8C8A' }} />
            </div>
            <p className="text-sm font-medium text-[#0B1B2B] mt-2">Improved conditions</p>
          </div>
        </div>
      </section>

      {/* What leaders learn + How it drives better results */}
      <section className="py-16 md:py-20 bg-[#f6f9f7]">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-[#0B1B2B] mb-8 text-center" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
            What leaders learn from this
          </h2>
          <ul className="grid md:grid-cols-2 gap-3 max-w-3xl mx-auto mb-12">
            {[
              'Which teams are under pressure',
              'Where communication or support is slipping',
              'Whether planning, sequencing, or role clarity are breaking down',
              'Patterns of recovery or decline week-to-week',
              'Whether actions and initiatives are working',
              'How psychosocial risk is trending across sites',
            ].map((item, i) => (
              <li key={i} className="flex gap-2 text-[#2E4057] text-[15px]">
                <MaterialIcon icon="check_circle" style={{ fontSize: '18px', color: '#2A8C8A', flexShrink: 0 }} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <h2 className="text-2xl font-bold text-[#0B1B2B] mb-6 text-center">
            How this drives better results
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            {[
              { icon: 'shield', title: 'Lower psychosocial risk', sub: 'ISO 45003 alignment' },
              { icon: 'trending_up', title: 'Improved productivity', sub: 'Fewer delays from confusion or rework' },
              { icon: 'balance', title: 'Higher team stability', sub: 'Reduced churn, fewer stressors' },
              { icon: 'psychology', title: 'Better leadership decisions', sub: 'Evidence instead of guesswork' },
              { icon: 'warning', title: 'Early warning system', sub: 'For emerging issues' },
            ].map((card, i) => (
              <div key={i} className="bg-white rounded-xl p-4 border border-[#E0E5E8] shadow-sm text-center">
                <MaterialIcon icon={card.icon} style={{ fontSize: '28px', color: '#2A8C8A', marginBottom: '8px' }} />
                <h3 className="font-bold text-sm text-[#0B1B2B] mb-1">{card.title}</h3>
                <p className="text-xs text-[#2E4057]">{card.sub}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-[15px] text-[#2E4057] max-w-2xl mx-auto leading-relaxed">
            The Beacon Index turns weekly feedback into practical, actionable insights that improve performance, safety, and how people experience work.
          </p>
        </div>
      </section>

      {/* Benefits of embedding + Single tool */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-[#0B1B2B] mb-10 text-center" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
            Benefits of embedding Beacon
          </h2>
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="bg-[#F2F7F5] rounded-xl p-6 border border-[#D7E5E0]">
              <h3 className="text-lg font-bold text-[#2F6F7E] mb-3">Early conversations</h3>
              <p className="text-[#2E4057] text-[15px] leading-relaxed">
                Encourages early and open conversations about issues that impact psychosocial safety — before they become crises.
              </p>
            </div>
            <div className="bg-[#F2F7F5] rounded-xl p-6 border border-[#D7E5E0]">
              <h3 className="text-lg font-bold text-[#2F6F7E] mb-3">Immediate support</h3>
              <p className="text-[#2E4057] text-[15px] leading-relaxed">
                Immediate and discreet support for people flagging psychosocial issues — so no one has to wait to be heard.
              </p>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-[#0B1B2B] mb-6 text-center">
            A single tool solving multiple executive challenges
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { role: 'General Managers / Operations', points: ['Fewer surprises', 'Stabilised teams', 'Early identification of emerging risk', 'Better project reliability'] },
              { role: 'Safety leaders', points: ['Stronger safety behaviours', 'Increased hazard reporting', 'Clear WHS evidence of consultation and monitoring'] },
              { role: 'HR', points: ['Early detection of burnout, conflict, and workload strain', 'Lower turnover', 'Data to support leadership capability'] },
              { role: 'Quality', points: ['Fewer errors', 'Stronger team communication', 'Better consistency in delivery'] },
            ].map((card, i) => (
              <div key={i} className="bg-[#f6f9f7] rounded-xl p-5 border border-[#E0E5E8]">
                <h3 className="font-bold text-[#2F6F7E] text-sm mb-3">{card.role}</h3>
                <ul className="space-y-1.5 text-xs text-[#2E4057]">
                  {card.points.map((p, j) => (
                    <li key={j} className="flex gap-1.5">
                      <span className="text-[#2A8C8A]">•</span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#F2F7F5] border-t border-[#D7E5E0] text-center">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-[#0B1B2B] mb-4">Ready to see what&apos;s really going on?</h2>
          <p className="text-[#2E4057] mb-6">
            Request the executive pack, try the survey, or start a pilot. We&apos;re here to help.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <a href="mailto:hello@beaconeffect.com.au?subject=Beacon%20Index%20Executive%20Overview" className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-[#2F6F7E] text-white font-semibold text-sm hover:opacity-90 transition-opacity">
              Request executive overview
            </a>
            <a href="/survey/test-demo" className="inline-flex items-center justify-center px-6 py-3 rounded-lg border-2 border-[#2F6F7E] text-[#2F6F7E] font-semibold text-sm hover:bg-[#2F6F7E]/5 transition-colors">
              Try the survey
            </a>
          </div>
        </div>
      </section>

      <footer className="bg-[#0B1B2B] py-10 text-center">
        <div className="max-w-6xl mx-auto px-6">
          <a href="/beacon-index" className="text-sm text-[#D7E0E8]/90 hover:text-white underline mb-4 inline-block">← Current version</a>
          <p className="text-[#D7E0E8] text-sm">Beacon Index · Early signals. Clear picture. People at the centre.</p>
          <p className="mt-2 text-xs text-[#D7E0E8]/70">© Beacon Effect</p>
        </div>
      </footer>
    </main>
  );
}
