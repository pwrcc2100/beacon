const pillars = [
  {
    title: "Manage & Comply",
    description:
      "Stay ahead of SafeWork and ISO 45003 obligations with live evidence of consultation, monitoring, and psychosocial controls.",
  },
  {
    title: "Implement & Report",
    description:
      "Embed a repeatable workflow for consultation, early issue detection, and continuous improvement across every site and team.",
  },
  {
    title: "Proactively Manage",
    description:
      "Surface stress, workload, and conflict risks before they escalate so leaders can focus on the conditions that matter most.",
  },
];

const howItWorks = [
  {
    title: "Visibility of Risk Indicators",
    copy: "Beacon highlights psychosocial risk indicators and trend shifts so leaders can respond sooner and reduce incidents.",
  },
  {
    title: "Simple Feedback Channel",
    copy: "Employees share how they feel each week via SMS or web in seconds, creating a trusted rhythm for candid feedback.",
  },
  {
    title: "Beyond Traditional Metrics",
    copy: "Goes further than lag indicators such as LTIFR by tracking sentiment, safety, and workload pressure in real time.",
  },
  {
    title: "Trusted Communication",
    copy: "A single, reliable channel that encourages conversation and connects people to support when they need it most.",
  },
];

const questions = [
  {
    title: "Workload & Pressure",
    copy: "Detects spikes in job demand and resourcing pressure before they impact safety or delivery.",
  },
  {
    title: "Support & Communication",
    copy: "Reveals whether teams feel backed by leaders and can raise issues without barriers.",
  },
  {
    title: "Clarity & Planning",
    copy: "Identifies breakdowns in planning, sequencing, and role clarity that create rework.",
  },
  {
    title: "Team Climate & Respect",
    copy: "Captures cues of psychological safety, respect, and interpersonal trust across teams.",
  },
  {
    title: "General Wellbeing / Sentiment",
    copy: "Quickly signals how people feel about work this week, highlighting recovery or decline.",
  },
];

const indexPipeline = [
  "Raw responses are captured weekly via SMS and secure web links.",
  "Responses are cleaned, de-identified, and validated against anonymity thresholds.",
  "Weighted scoring is applied across the five domains to produce a signal-sensitive index.",
  "Trend analysis powers dashboards that highlight movement, hotspots, and outliers.",
  "Leaders see a 0–100% Beacon Index for every team and the overall organisation.",
];

const leaderInsights = [
  "Which teams are under pressure or stabilising.",
  "Where communication or support is breaking down.",
  "Whether planning, sequencing, or clarity are causing friction.",
  "Patterns of recovery or decline week-to-week.",
  "If actions, initiatives, or interventions are working.",
  "How psychosocial risk is trending across sites and divisions.",
];

const businessBenefits = [
  {
    title: "Lower Psychosocial Risk",
    copy: "Track early signals and respond quickly to meet ISO 45003 expectations.",
  },
  {
    title: "Improved Productivity",
    copy: "Reduce delays linked to confusion, rework, and misaligned workloads.",
  },
  {
    title: "Higher Team Stability",
    copy: "Spot burnout and conflict earlier to prevent churn and disengagement.",
  },
  {
    title: "Better Leadership Decisions",
    copy: "Move from anecdote to evidence with live data on conditions and impact.",
  },
  {
    title: "Early Warning System",
    copy: "Measure trend shifts so you can intervene before issues escalate.",
  },
];

const supportTriggers = [
  { label: "Sentiment", trigger: `"Not great – I'm struggling"` },
  { label: "Workload", trigger: `"Unsustainable"` },
  { label: "Safety", trigger: `"Don't feel safe raising issues"` },
  { label: "Support", trigger: `"Not supported"` },
];

const stakeholderGrid = [
  {
    role: "General Managers & Operations",
    points: [
      "Fewer surprises and more stable teams.",
      "Early identification of emerging operational risk.",
      "Reduced friction across delivery programs.",
      "Better reliability on major projects.",
    ],
  },
  {
    role: "People & Culture / HR",
    points: [
      "Detect burnout, conflict, and workload strain early.",
      "Reduce turnover with targeted, timely action.",
      "Data-backed coaching for leaders and managers.",
    ],
  },
  {
    role: "Safety & Risk Leaders",
    points: [
      "Strengthen safety behaviours and reporting.",
      "Demonstrate psychosocial consultation and monitoring.",
      "Reduce exposure to psychosocial risk claims.",
    ],
  },
  {
    role: "Quality & Delivery",
    points: [
      "Fewer errors caused by miscommunication.",
      "Stronger coordination across teams and sites.",
      "Consistent delivery backed by clear planning signals.",
    ],
  },
];

const onboardingTimeline = [
  {
    phase: "Week 1–2",
    title: "Setup & Configuration",
    details: [
      "Define data integrations, user roles, and hierarchy.",
      "Agree dashboard measures and reporting cadence.",
      "Align communications and change approach.",
    ],
  },
  {
    phase: "Week 3",
    title: "First Pulse & Training",
    details: [
      "Load test data and verify SMS/email delivery.",
      "Train leaders on dashboard use and follow-up playbooks.",
      "Launch communications to staff and supervisors.",
    ],
  },
  {
    phase: "Week 4",
    title: "Review & Optimise",
    details: [
      "Run first Beacon Index pulse and review insights.",
      "Adjust parameters or hierarchy if required.",
      "Plan recognition or incentives to lift engagement.",
    ],
  },
  {
    phase: "Ongoing",
    title: "Guided Support",
    details: [
      "Beacon Advisory provides analytics and leadership coaching.",
      "Scale to new teams and embed into BAU safety practice.",
    ],
  },
];

const pricing = [
  {
    label: "Establishment Fee",
    price: "$7,000",
    description: "Configuration, branding, hierarchy, integrations, and launch readiness.",
  },
  {
    label: "3-Month Pilot",
    price: "$5,000 flat",
    description:
      "Hosting, anonymous check-ins, real-time index dashboards, templates, onboarding, and monthly insights.",
  },
  {
    label: "Beyond Pilot",
    price: "Annual pricing",
    description: "Scaled to organisational size and program complexity with predictable billing.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-24 px-6 pb-24 pt-16 sm:px-10 lg:px-16">
        <section className="rounded-3xl bg-slate-900 px-8 py-16 text-slate-100 shadow-xl sm:px-12 lg:px-16">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl space-y-6">
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-800 px-4 py-1 text-xs uppercase tracking-[0.3em] text-slate-300">
                Beacon Index
              </span>
              <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
                Beacon Psychosocial Safety Solution
              </h1>
              <p className="text-lg text-slate-200 sm:text-xl">
                The Beacon Index enables businesses to mitigate risk, improve wellbeing,
                and measure workplace experience in real time. Because everyone deserves
                a safe and supportive workplace.
              </p>
              <p className="text-base text-slate-300">
                Visible. Measurable. Manageable. Beacon keeps psychosocial safety in sight and
                transforms weekly feedback into action-ready insights.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <a
                href="mailto:peta@beaconeffect.com.au?subject=Beacon%20Index%20Pilot%20Enquiry"
                className="inline-flex items-center justify-center rounded-full bg-sky-400 px-6 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-sky-500/40 transition hover:bg-sky-300"
              >
                Book a demo
              </a>
              <a
                href="#pricing"
                className="inline-flex items-center justify-center rounded-full border border-slate-500 px-6 py-3 text-sm font-semibold text-slate-100 transition hover:border-slate-100"
              >
                View pilot pricing
              </a>
            </div>
          </div>
        </section>

        <section className="space-y-10">
          <header className="space-y-3">
            <h2 className="text-3xl font-semibold text-slate-900">
              Built for organisations serious about psychosocial safety
            </h2>
            <p className="max-w-3xl text-lg text-slate-600">
              Organisations that embed Beacon into business-as-usual safety practice gain the data,
              rhythms, and evidence required for psychosocial success.
            </p>
          </header>
          <div className="grid gap-6 md:grid-cols-3">
            {pillars.map((pillar) => (
              <article
                key={pillar.title}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <h3 className="text-xl font-semibold text-slate-900">{pillar.title}</h3>
                <p className="mt-3 text-base text-slate-600">{pillar.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-12 lg:grid-cols-[1.1fr,0.9fr]">
          <div className="space-y-6">
            <h2 className="text-3xl font-semibold text-slate-900">How Beacon works</h2>
            <p className="text-lg text-slate-600">
              A streamlined weekly pulse turns employee experience into a live psychosocial index
              with immediate support for people who need it.
            </p>
            <div className="space-y-4">
              {howItWorks.map((item) => (
                <div key={item.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
                  <p className="mt-2 text-base text-slate-600">{item.copy}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-900 p-8 text-slate-100 shadow-xl">
            <h3 className="text-2xl font-semibold">What is the Beacon Survey?</h3>
            <p className="mt-4 text-slate-300">
              A fast weekly pulse using research-based questions. Employees respond in seconds via
              SMS or secure link with three simple options. Questions are calibrated to detect early
              stages of psychosocial pressure and workplace conditions.
            </p>
            <div className="mt-6 space-y-4">
              <div className="rounded-xl border border-slate-700/60 bg-slate-800/60 p-4">
                <div className="text-sm font-semibold uppercase tracking-wide text-slate-400">
                  Weekly cadence
                </div>
                <p className="mt-2 text-slate-200">
                  Delivered every week to maintain momentum and surface changes quickly.
                </p>
              </div>
              <div className="rounded-xl border border-slate-700/60 bg-slate-800/60 p-4">
                <div className="text-sm font-semibold uppercase tracking-wide text-slate-400">
                  Three response options
                </div>
                <p className="mt-2 text-slate-200">
                  Simple choices designed to remove friction, minimise survey fatigue, and boost adoption.
                </p>
              </div>
              <div className="rounded-xl border border-slate-700/60 bg-slate-800/60 p-4">
                <div className="text-sm font-semibold uppercase tracking-wide text-slate-400">
                  Evidence-backed domains
                </div>
                <p className="mt-2 text-slate-200">
                  Each question maps to ISO 45003 psychosocial risk factors with clear rationale.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-10">
          <header className="space-y-3">
            <h2 className="text-3xl font-semibold text-slate-900">Why these five questions matter</h2>
            <p className="max-w-3xl text-lg text-slate-600">
              The Beacon Index combines five evidence-based domains that signal emerging psychosocial
              risk while keeping the experience effortless for employees.
            </p>
          </header>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {questions.map((question) => (
              <article
                key={question.title}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <h3 className="text-xl font-semibold text-slate-900">{question.title}</h3>
                <p className="mt-3 text-base text-slate-600">{question.copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-10 shadow-lg">
          <h2 className="text-3xl font-semibold text-slate-900">How the Beacon Index is created</h2>
          <p className="mt-4 max-w-3xl text-lg text-slate-600">
            Beacon transforms raw weekly sentiment into a high-fidelity signal that leaders can trust.
            Every step protects anonymity, ensures integrity, and delivers timely insight.
          </p>
          <ol className="mt-8 space-y-5">
            {indexPipeline.map((step, index) => (
              <li key={step} className="flex gap-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-500 font-semibold text-white">
                  {index + 1}
                </span>
                <p className="text-base text-slate-700">{step}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="grid gap-12 lg:grid-cols-[1fr,1fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-lg">
            <h2 className="text-3xl font-semibold text-slate-900">Feedback loop to leaders</h2>
            <p className="mt-4 text-lg text-slate-600">
              Leaders receive clear insights on hotspots, comments, trends, and week-on-week movement.
              Early detection means action is targeted, timely, and compassionate—centred on conditions,
              not individuals.
            </p>
            <ul className="mt-6 space-y-3 text-base text-slate-700">
              {leaderInsights.map((insight) => (
                <li key={insight} className="flex items-start gap-3">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-sky-500" />
                  <span>{insight}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl bg-slate-900 p-8 text-slate-100 shadow-xl">
            <h2 className="text-3xl font-semibold">Business impact at a glance</h2>
            <p className="mt-4 text-slate-300">
              The Beacon Index turns weekly feedback into actionable insights that improve performance,
              safety, and employee experience.
            </p>
            <ul className="mt-6 space-y-4">
              {businessBenefits.map((benefit) => (
                <li key={benefit.title} className="rounded-2xl border border-slate-700/60 bg-slate-800/60 p-5">
                  <h3 className="text-lg font-semibold text-slate-100">{benefit.title}</h3>
                  <p className="mt-2 text-sm text-slate-300">{benefit.copy}</p>
                </li>
              ))}
            </ul>
            <blockquote className="mt-6 border-l-2 border-sky-400 pl-4 text-sm text-slate-200">
              “Whether you are an employee or employer, it is a better investment to increase happiness at work and in life,
              rather than simply trying to increase measures of success. In the end, happiness leads to success—not the other way around.”
              <span className="mt-3 block text-xs font-semibold uppercase tracking-wide text-slate-400">
                Arthur C. Brooks, Harvard Business School
              </span>
            </blockquote>
          </div>
        </section>

        <section className="rounded-3xl border border-amber-200 bg-amber-50 p-10 shadow-lg">
          <h2 className="text-3xl font-semibold text-amber-900">Immediate support & insight</h2>
          <p className="mt-4 max-w-3xl text-lg text-amber-900/80">
            When someone indicates distress, Beacon’s privacy-first support path activates instantly—giving employees control while
            meeting WHS consultation duties.
          </p>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-amber-200 bg-white p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-amber-900">Example triggers</h3>
              <ul className="mt-4 space-y-3 text-base text-amber-900/80">
                {supportTriggers.map((trigger) => (
                  <li key={trigger.label} className="flex items-center justify-between gap-4 rounded-xl bg-amber-100 px-4 py-3">
                    <span className="font-medium">{trigger.label}</span>
                    <span className="text-sm text-amber-700">{trigger.trigger}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-4 text-base text-amber-900/80">
              <div className="rounded-2xl border border-amber-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-amber-900">Privacy-first</h3>
                <p className="mt-2">
                  Employees choose who contacts them, how, and when. Patterns inform systemic improvements without exposing individuals.
                </p>
              </div>
              <div className="rounded-2xl border border-amber-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-amber-900">Immediate</h3>
                <p className="mt-2">
                  Support pathways trigger automatically when high-risk responses surface, providing rapid care and guidance.
                </p>
              </div>
              <div className="rounded-2xl border border-amber-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-amber-900">Compliance-ready</h3>
                <p className="mt-2">
                  Maintains a full audit trail that demonstrates consultation, response, and review for psychosocial obligations.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-12">
          <header className="space-y-3">
            <h2 className="text-3xl font-semibold text-slate-900">Designed for cross-functional leaders</h2>
            <p className="max-w-3xl text-lg text-slate-600">
              Beacon offers a single source of truth that solves multiple executive challenges simultaneously.
            </p>
          </header>
          <div className="grid gap-6 md:grid-cols-2">
            {stakeholderGrid.map((stakeholder) => (
              <article key={stakeholder.role} className="rounded-3xl border border-slate-200 bg-white p-8 shadow-lg">
                <h3 className="text-xl font-semibold text-slate-900">{stakeholder.role}</h3>
                <ul className="mt-4 space-y-3 text-base text-slate-600">
                  {stakeholder.points.map((point) => (
                    <li key={point} className="flex items-start gap-3">
                      <span className="mt-2 h-2 w-2 rounded-full bg-sky-500" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-10 shadow-lg">
          <h2 className="text-3xl font-semibold text-slate-900">Onboarding roadmap</h2>
          <p className="mt-4 max-w-3xl text-lg text-slate-600">
            A structured four-week launch gives teams confidence while ensuring compliance requirements are covered from day one.
          </p>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {onboardingTimeline.map((item) => (
              <article key={item.phase} className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
                <div className="text-sm font-semibold uppercase tracking-wide text-sky-600">
                  {item.phase}
                </div>
                <h3 className="mt-2 text-xl font-semibold text-slate-900">{item.title}</h3>
                <ul className="mt-4 space-y-2 text-base text-slate-600">
                  {item.details.map((detail) => (
                    <li key={detail} className="flex items-start gap-3">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-sky-500" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section id="pricing" className="rounded-3xl border border-slate-200 bg-white p-10 shadow-lg">
          <h2 className="text-3xl font-semibold text-slate-900">Beacon Index pilot pricing</h2>
          <p className="mt-4 max-w-3xl text-lg text-slate-600">
            One predictable cost—no per-message or usage fees. Annual pricing beyond the pilot is tailored to organisational size and program complexity.
          </p>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {pricing.map((item) => (
              <article key={item.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
                <div className="text-sm font-semibold uppercase tracking-wide text-slate-500">{item.label}</div>
                <div className="mt-2 text-2xl font-semibold text-slate-900">{item.price}</div>
                <p className="mt-3 text-sm text-slate-600">{item.description}</p>
              </article>
            ))}
          </div>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <a
              href="mailto:peta@beaconeffect.com.au?subject=Beacon%20Index%20Pilot%20Enquiry"
              className="inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-slate-700"
            >
              Talk to Beacon Advisory
            </a>
            <a
              href="/MASTER_Beacon%20Pilot%20Information%20Pack%20Dec%204%202025.pptx"
              download="MASTER_Beacon Pilot Information Pack Dec 4 2025.pptx"
              className="inline-flex items-center justify-center rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-900 hover:text-slate-900"
            >
              Download pilot pack
            </a>
          </div>
        </section>

        <section className="rounded-3xl bg-slate-900 px-8 py-12 text-slate-100 shadow-xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-4">
              <h2 className="text-3xl font-semibold">Ready to give every team a safer workweek?</h2>
              <p className="max-w-2xl text-lg text-slate-300">
                Partner with Beacon Advisory to embed the Beacon Index into your WHS practice. Start with a guided pilot,
                gather the evidence you need, and scale with confidence.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <a
                href="mailto:peta@beaconeffect.com.au?subject=Beacon%20Index%20Pilot%20Enquiry"
                className="inline-flex items-center justify-center rounded-full bg-sky-400 px-6 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-sky-500/40 transition hover:bg-sky-300"
              >
                Schedule a pilot discovery call
              </a>
              <a
                href="mailto:peta@beaconeffect.com.au?subject=Beacon%20Index%20Support%20Path%20Question"
                className="inline-flex items-center justify-center rounded-full border border-slate-500 px-6 py-3 text-sm font-semibold text-slate-100 transition hover:border-slate-100"
              >
                Email Beacon Advisory
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
