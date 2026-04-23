import type { Metadata } from 'next';
import Image from 'next/image';

import { PublicFooter } from '@/components/layout/PublicFooter';
import { PublicHeader } from '@/components/layout/PublicHeader';
import { ContactForm } from '@/components/marketing/ContactForm';

export const metadata: Metadata = {
  title: 'Beacon Advisory',
  description:
    'Project-based operational support — scoped, delivered and embedded in your business.',
};

const navy = '#1B2B4B';
const gold = '#C9A84C';
const offWhite = '#F4F1EC';
const body = '#333333';

const LINKEDIN = 'https://www.linkedin.com/in/peta-wilson-4769361';

function BeaconTile({ title, text }: { readonly title: string; readonly text: string }) {
  return (
    <div
      className="bg-white rounded-lg p-6 md:p-7 pl-6 shadow-sm border border-black/[0.06]"
      style={{
        backgroundColor: '#ffffff',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.06)',
        borderLeftWidth: 4,
        borderLeftColor: gold,
      }}
    >
      <h3 className="text-lg font-semibold mb-3" style={{ color: navy }}>
        {title}
      </h3>
      <p className="text-sm md:text-base leading-relaxed" style={{ color: body }}>
        {text}
      </p>
    </div>
  );
}

const whyWorkWithMeTiles = [
  {
    title: 'Front end rigour',
    text: 'Significant investment in discovery and definition — clear objectives, reverse brief, genuine stakeholder engagement on their terms. No solution is recommended before the current state is properly understood. Skip this phase and the implementation will struggle, regardless of how good the solution is.',
  },
  {
    title: 'Challenges the status quo',
    text: "I don't just validate what people think they need. I ask the uncomfortable questions, pressure test assumptions, and recommend what's appropriate to satisfy the original brief.",
  },
  {
    title: 'Bridges business and technology',
    text: 'Translates between business need and technology solution in both directions — understanding what the business actually needs before touching a tool, and what technology can realistically deliver before investing in it.',
  },
  {
    title: 'Sequenced to readiness',
    text: "Recommendations are prioritised based not just on what's needed, but on what the business has the capacity and maturity to absorb. The right initiative at the wrong time creates more problems than it solves.",
  },
  {
    title: 'Hands-on, not advisory',
    text: "I don't just tell you what to do. I own the work, stay close until it's properly embedded, and hand it over with the team running it — not just a report sitting in a folder.",
  },
] as const;

const whatTiles = [
  {
    title: "A system that should exist but doesn't.",
    text: 'You know you need it. Finding the right one, configuring it for how you actually operate and embedding it into your business is not feasible with current resources.',
  },
  {
    title: 'Processes not documented.',
    text: 'Documented, accessible processes are what allow a business to operate consistently, scale effectively and reduce reliance on key individuals. If it only works when the right person is in the room — it\'s a risk.',
  },
  {
    title: 'A project without an owner.',
    text: 'Important enough to matter, complex enough to warrant dedicated focus.',
  },
  {
    title: "Operations that haven't kept pace with growth.",
    text: 'The business has grown. Time to make sure the systems, reporting and processes behind it are built for where you are now.',
  },
  {
    title: 'AI that actually fits your business.',
    text: 'Every business needs a different approach to AI. I help you cut through the hype and find what actually works for yours — avoiding expensive mistakes and adopting AI in a way that genuinely suits and strengthens the business.',
  },
] as const;

const steps = [
  {
    n: '01',
    title: 'Understand',
    body: "What's needed, who the stakeholders are, what success looks like. No assumptions, no solutions before the problem is defined.",
  },
  {
    n: '02',
    title: 'Define',
    body: 'Current state mapped, gaps identified, scope locked. A clear picture of where things are before deciding where they need to go.',
  },
  {
    n: '03',
    title: 'Recommend',
    body: 'A practical, prioritised approach — specific to this business, sequenced to what can be absorbed or delivered.',
  },
  {
    n: '04',
    title: 'Deliver — optional',
    body: 'Own the execution end to end, or hand over a plan that can be implemented internally. Available for ongoing support.',
  },
] as const;

const aboutCallouts = [
  'HammerTech Technology Excellence Award 2024 (AU/NZ)',
  'Certified Scrum Product Owner',
  'Certificate in Business Analysis — Lumify Work (BABOK)',
] as const;

export default function HomePage() {
  return (
    <div
      className="beacon-marketing bg-white text-[#333333]"
      style={{
        colorScheme: 'light',
        /* Inline so content stays visible if Tailwind fails or html.dark paints a dark body behind transparent layers */
        backgroundColor: '#ffffff',
        color: '#333333',
      }}
      data-marketing-root
    >
      <PublicHeader />

      <main>
        {/* SECTION 1 — HERO */}
        <section
          className="w-full px-4 sm:px-6 py-8 md:py-10 lg:py-9 min-h-0"
          style={{ backgroundColor: navy }}
        >
          <div className="max-w-4xl mx-auto text-center lg:text-left">
            <h1
              className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.5rem] font-bold leading-tight tracking-tight"
              style={{ color: '#ffffff' }}
            >
              I&apos;m the person businesses call when something important needs to happen.
            </h1>
            <p
              className="mt-3 text-lg sm:text-xl md:text-2xl max-w-2xl mx-auto lg:mx-0 leading-snug"
              style={{ color: '#ffffff' }}
            >
              When there&apos;s no obvious home for it, or it sits outside current teams&apos; remit.
            </p>
            <p
              className="mt-4 md:mt-5 text-base sm:text-lg max-w-2xl mx-auto lg:mx-0"
              style={{ color: '#ffffff' }}
            >
              Project-based operational support — scoped, delivered and embedded in your business.
            </p>
            <div className="mt-6 md:mt-8">
              <a
                href="#contact"
                className="inline-flex items-center justify-center rounded-md px-6 py-3 text-sm font-semibold transition-opacity hover:opacity-90"
                style={{ backgroundColor: gold, color: navy }}
              >
                Start a conversation
              </a>
            </div>
          </div>
        </section>

        {/* SECTION 2 — WHEN TO CALL ME IN */}
        <section
          id="when-to-call-me-in"
          className="scroll-mt-20 py-9 md:py-10 lg:py-12 px-4 sm:px-6"
          style={{ backgroundColor: offWhite }}
        >
          <div className="max-w-5xl mx-auto">
            <p
              className="text-xs font-semibold tracking-[0.2em] uppercase mb-2"
              style={{ color: gold }}
            >
              WHEN TO CALL ME IN
            </p>
            <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8" style={{ color: navy }}>
              When to call me in
            </h2>
            <div className="grid sm:grid-cols-2 gap-5 md:gap-6">
              {whatTiles.slice(0, 4).map((tile) => (
                <BeaconTile key={tile.title} title={tile.title} text={tile.text} />
              ))}
            </div>
            <div className="mt-5 md:mt-6 w-full max-w-5xl mx-auto">
              <BeaconTile title={whatTiles[4].title} text={whatTiles[4].text} />
            </div>
          </div>
        </section>

        {/* SECTION 3 — WHY WORK WITH ME */}
        <section
          id="why-work-with-me"
          className="scroll-mt-20 py-9 md:py-10 lg:py-12 px-4 sm:px-6 bg-white"
          style={{ backgroundColor: '#ffffff' }}
        >
          <div className="max-w-5xl mx-auto">
            <p
              className="text-xs font-semibold tracking-[0.2em] uppercase mb-2"
              style={{ color: gold }}
            >
              WHY WORK WITH ME
            </p>
            <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8" style={{ color: navy }}>
              Why work with me
            </h2>
            <div className="grid md:grid-cols-3 gap-5 md:gap-6">
              {whyWorkWithMeTiles.slice(0, 3).map((tile) => (
                <BeaconTile key={tile.title} title={tile.title} text={tile.text} />
              ))}
            </div>
            <div className="mt-5 md:mt-6 w-full md:w-2/3 md:mx-auto grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6">
              {whyWorkWithMeTiles.slice(3).map((tile) => (
                <BeaconTile key={tile.title} title={tile.title} text={tile.text} />
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 4 — ABOUT PETA */}
        <section
          id="about-peta"
          className="scroll-mt-20 py-9 md:py-10 lg:py-12 px-4 sm:px-6 bg-white"
          style={{ backgroundColor: '#ffffff' }}
        >
          <div className="max-w-5xl mx-auto">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-2" style={{ color: gold }}>
              ABOUT PETA
            </p>
            <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8" style={{ color: navy }}>
              Why Beacon Advisory
            </h2>
            <div className="beacon-about-bio flow-root">
              <div className="beacon-portrait-wrap beacon-about-float">
                <Image
                  src="/peta-wilson.png"
                  alt="Peta Wilson — professional portrait, smiling, wearing a white sleeveless top against a soft navy background"
                  width={600}
                  height={600}
                  sizes="(max-width: 639px) 200px, 250px"
                  className="beacon-portrait-img beacon-portrait-img--about-square"
                  priority
                />
              </div>
              <div className="space-y-4 text-base md:text-lg leading-relaxed beacon-about-prose" style={{ color: body }}>
                <p>
                  I&apos;m the person businesses call when something important needs to happen and there&apos;s no
                  obvious home for it — an operations partner working behind the scenes, so leadership can focus on the
                  front.
                </p>
                <p>
                  I spent 16 years inside Richard Crookes Constructions as it grew from 120 people to more than 900 —
                  building the systems, processes and infrastructure that kept pace with that growth across every
                  function. I understand how construction businesses operate, what the operational pressures look like
                  from the inside, and how to design solutions that actually work in a fast-moving environment where
                  delivery is always the priority.
                </p>
                <p>
                  I now work independently through Beacon Advisory, coming into businesses to assess what&apos;s
                  actually happening, design practical solutions and implement them — underpinned by a BABOK-qualified
                  approach to requirements analysis, ensuring solutions are designed around what&apos;s actually needed,
                  not just what&apos;s initially presented.
                </p>
                <p>
                  Previous engagements have spanned software selection and implementation, systems integration, process
                  design, workforce planning, reporting infrastructure, communications platforms, project delivery and
                  office relocations — across industries, business sizes and functions.
                </p>
                <p>
                  I don&apos;t just advise — I do the work, stay close until it&apos;s embedded, and hand it over
                  properly. So you can finally exhale.
                </p>
              </div>
            </div>
            <div className="mt-8 flex w-full flex-col gap-3 beacon-about-credentials">
              {aboutCallouts.map((label) => (
                <div
                  key={label}
                  className="rounded-md px-4 py-3 text-sm font-semibold leading-snug"
                  style={{ backgroundColor: `${gold}22`, color: navy, border: `1px solid ${gold}55` }}
                >
                  {label}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 5 — HOW I WORK */}
        <section
          id="how-it-works"
          className="scroll-mt-20 py-9 md:py-10 lg:py-12 px-4 sm:px-6"
          style={{ backgroundColor: navy }}
        >
          <div className="max-w-5xl mx-auto">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-2" style={{ color: gold }}>
              HOW I WORK
            </p>
            <h2 className="text-2xl md:text-3xl font-bold mb-7 md:mb-9" style={{ color: '#ffffff' }}>
              How I Work
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-7">
              {steps.map((step) => (
                <div key={step.n} className="text-center md:text-left">
                  <div
                    className="mx-auto md:mx-0 w-12 h-12 rounded-full flex items-center justify-center text-base font-bold mb-4"
                    style={{ backgroundColor: gold, color: navy }}
                  >
                    {step.n}
                  </div>
                  <h3 className="text-lg font-semibold mb-2" style={{ color: '#ffffff' }}>
                    {step.title}
                  </h3>
                  <p className="text-sm md:text-base leading-relaxed" style={{ color: 'rgba(255,255,255,0.85)' }}>
                    {step.body}
                  </p>
                </div>
              ))}
            </div>
            <p
              className="mt-7 md:mt-8 text-sm md:text-base leading-relaxed text-center md:text-left italic"
              style={{ color: 'rgba(255,255,255,0.9)' }}
            >
              Stages 1–3 deliver a clear, evidence-based picture of current state and a prioritised roadmap. Stage 4
              can be scoped separately or taken on internally.
            </p>
          </div>
        </section>

        {/* SECTION 6 — CONTACT */}
        <section
          id="contact"
          className="scroll-mt-20 py-9 md:py-10 lg:py-12 px-4 sm:px-6 bg-white"
          style={{ backgroundColor: '#ffffff' }}
        >
          <div className="max-w-5xl mx-auto flex flex-col items-center text-center">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-2" style={{ color: gold }}>
              GET IN TOUCH
            </p>
            <h2 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: navy }}>
              Let&apos;s talk.
            </h2>
            <p className="text-base mb-6 md:mb-7 max-w-2xl" style={{ color: body }}>
              No agenda, no brief required.
            </p>

            <div className="beacon-contact-form-wrap w-full max-w-4xl md:max-w-none md:w-[min(100%,42rem)] lg:w-[min(100%,48rem)]">
              <ContactForm />
            </div>

            <div className="beacon-inline-links w-full max-w-4xl md:max-w-none md:w-[min(100%,42rem)] lg:w-[min(100%,48rem)] justify-center sm:justify-center">
              <a href="mailto:peta@beaconeffect.com.au">peta@beaconeffect.com.au</a>
              <span className="hidden sm:inline text-[#333333]/35" aria-hidden>
                ·
              </span>
              <a href={LINKEDIN} target="_blank" rel="noopener noreferrer">
                LinkedIn
              </a>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
