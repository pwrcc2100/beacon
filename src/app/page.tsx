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

const whatTiles = [
  {
    title: "The system that should exist but doesn't.",
    body: 'You know you need it. Finding the right one, configuring it for how you actually operate and embedding it into your business.',
  },
  {
    title: "The process nobody's written down.",
    body: "It lives in someone's head. Getting it documented means the business can grow, scale and operate consistently — not just when that person is in the room.",
  },
  {
    title: 'The project without an owner.',
    body: 'Important enough to matter, complex enough to warrant dedicated focus.',
  },
  {
    title: "The operations that haven't kept pace with your growth.",
    body: 'The business has grown. Time to make sure the systems, reporting and processes behind it are built for where you are now.',
  },
  {
    title: 'AI that actually fits your business.',
    body: 'Every business needs a different approach to AI. I help you identify what will actually work for yours — solutions that complement how you operate.',
  },
] as const;

const steps = [
  {
    n: '1',
    title: 'Start a conversation',
    body: "Tell me what's on your mind — no brief required, just a conversation.",
  },
  {
    n: '2',
    title: 'We define it together',
    body: "Not every challenge arrives fully formed. I'll work with you to understand what's actually needed and translate it into a clear scope of work.",
  },
  {
    n: '3',
    title: 'I deliver it',
    body: "I own it start to finish and make sure it's properly embedded before I hand it over.",
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
      className="beacon-marketing min-h-[100dvh] min-h-screen flex flex-col bg-white text-[#333333]"
      style={{
        colorScheme: 'light',
        /* Inline so content stays visible if Tailwind fails or html.dark paints a dark body behind transparent layers */
        backgroundColor: '#ffffff',
        color: '#333333',
        minHeight: '100dvh',
      }}
      data-marketing-root
    >
      <PublicHeader />

      <main className="flex-1">
        {/* SECTION 1 — HERO */}
        <section
          className="w-full px-4 sm:px-6 py-12 md:py-16 lg:py-14 min-h-0"
          style={{ backgroundColor: navy }}
        >
          <div className="max-w-4xl mx-auto text-center lg:text-left">
            <h1
              className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.5rem] font-bold leading-tight tracking-tight"
              style={{ color: '#ffffff' }}
            >
              The operations partner businesses call when something important needs to get done —{' '}
              <span style={{ color: gold }}>so you can finally exhale.</span>
            </h1>
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

        {/* SECTION 2 — WHO IT'S FOR */}
        <section
          id="whos-it-for"
          className="scroll-mt-24 py-14 md:py-16 lg:py-20 px-4 sm:px-6"
          style={{ backgroundColor: offWhite }}
        >
          <p
            className="text-center text-base md:text-lg leading-relaxed max-w-[700px] mx-auto"
            style={{ color: body }}
          >
            You&apos;re running a business — managing the team, serving clients, keeping everything moving. The
            operational stuff that needs sorting, building or fixing keeps getting pushed down the list because
            there&apos;s no one to own it. That&apos;s where Beacon Advisory comes in.
          </p>
        </section>

        {/* SECTION 3 — WHAT I WORK ON */}
        <section
          id="what-i-work-on"
          className="scroll-mt-24 py-14 md:py-16 lg:py-20 px-4 sm:px-6 bg-white"
          style={{ backgroundColor: '#ffffff' }}
        >
          <div className="max-w-5xl mx-auto">
            <p
              className="text-xs font-semibold tracking-[0.2em] uppercase mb-2"
              style={{ color: gold }}
            >
              WHAT I WORK ON
            </p>
            <h2 className="text-2xl md:text-3xl font-bold mb-10 md:mb-12" style={{ color: navy }}>
              What I work on
            </h2>
            <div className="grid sm:grid-cols-2 gap-5 md:gap-6">
              {whatTiles.map((tile) => (
                <div
                  key={tile.title}
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
                    {tile.title}
                  </h3>
                  <p className="text-sm md:text-base leading-relaxed" style={{ color: body }}>
                    {tile.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 4 — HOW IT WORKS */}
        <section
          id="how-it-works"
          className="scroll-mt-24 py-14 md:py-16 lg:py-20 px-4 sm:px-6"
          style={{ backgroundColor: navy }}
        >
          <div className="max-w-5xl mx-auto">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-2" style={{ color: gold }}>
              HOW IT WORKS
            </p>
            <h2 className="text-2xl md:text-3xl font-bold mb-10 md:mb-14" style={{ color: '#ffffff' }}>
              How it works
            </h2>
            <div className="grid md:grid-cols-3 gap-10 md:gap-8">
              {steps.map((step) => (
                <div key={step.n} className="text-center md:text-left">
                  <div
                    className="mx-auto md:mx-0 w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold mb-4"
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
          </div>
        </section>

        {/* SECTION 5 — WHY BEACON ADVISORY */}
        <section
          id="about-peta"
          className="scroll-mt-24 py-14 md:py-16 lg:py-20 px-4 sm:px-6"
          style={{ backgroundColor: offWhite }}
        >
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-10 md:gap-12 md:items-start">
              <div className="beacon-portrait-wrap">
                <Image
                  src="/peta-wilson.png"
                  alt="Peta Wilson — professional portrait, smiling, wearing a white sleeveless top against a soft navy background"
                  width={480}
                  height={600}
                  sizes="(max-width: 768px) 90vw, 400px"
                  className="beacon-portrait-img"
                  priority
                />
              </div>
              <div className="space-y-6">
                <div>
                  <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-2" style={{ color: gold }}>
                    ABOUT PETA
                  </p>
                  <h2 className="text-2xl md:text-3xl font-bold" style={{ color: navy }}>
                    Why Beacon Advisory
                  </h2>
                </div>
                <div className="space-y-4 text-base md:text-lg leading-relaxed" style={{ color: body }}>
                  <p>
                    Most businesses reach a point where the operational side can&apos;t keep up — the systems are
                    patchy, the processes live in people&apos;s heads, and the projects that would actually move things
                    forward keep getting deferred because nobody has time to own them.
                  </p>
                  <p>
                    I&apos;ve spent 20 years solving exactly that — most of it inside a construction business that grew
                    from 120 people to more than 900. Every function. Every stage of growth. Building the
                    infrastructure that let the business keep moving.
                  </p>
                  <p>
                    I know what it takes to make things work in a real business, not just on paper. That&apos;s what I
                    bring to yours.
                  </p>
                </div>
                <div className="flex flex-col gap-3 max-w-xl">
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
            </div>
          </div>
        </section>

        {/* SECTION 6 — CONTACT */}
        <section
          id="contact"
          className="scroll-mt-24 py-14 md:py-20 px-4 sm:px-6 bg-white pb-20"
          style={{ backgroundColor: '#ffffff' }}
        >
          <div className="max-w-5xl mx-auto">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-2" style={{ color: gold }}>
              GET IN TOUCH
            </p>
            <h2 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: navy }}>
              Let&apos;s talk.
            </h2>
            <p className="text-base mb-8 md:mb-10" style={{ color: body }}>
              No agenda, no brief required.
            </p>

            <ContactForm />

            <div className="beacon-inline-links">
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
