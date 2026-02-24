import type { Metadata } from 'next';
import Image from 'next/image';

import { PublicFooter } from '@/components/layout/PublicFooter';
import { PublicHeader } from '@/components/layout/PublicHeader';

const paragraphs = [
  'Beacon Advisory delivers practical senior advisory and execution support across business transformation, digital initiatives, enterprise improvement and high-stakes special projects, drawing on a proven ability to unpack complexity, create clarity and deliver solutions across any area of the business.',
  'Founded on more than three decades of real-world experience leading transformation, operational improvement, technology initiatives and executive-level special projects within complex organisations, Beacon Advisory brings a rare combination of strategic insight, disciplined delivery and hands-on execution capability.',
  'Clients engage Beacon Advisory when they need structure, clarity and momentum — particularly for initiatives that are cross-functional, ambiguous, politically sensitive or simply too complex to hand to traditional consulting teams.',
  'Through a practical and evidence-informed approach, Beacon Advisory helps leaders make better decisions, accelerate delivery and achieve meaningful organisational outcomes.',
] as const;

export const metadata: Metadata = {
  title: 'About Beacon Advisory',
  description:
    'Beacon Advisory is a specialist senior advisory practice led by Peta Wilson, delivering clarity, structure and disciplined execution for complex organisational challenges.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PublicHeader />

      <main className="flex-1">
        <section className="bg-[#f8f9fb] border-b border-gray-200">
          <div className="max-w-5xl mx-auto px-6 py-16 md:py-20">
            <div className="flex flex-col md:flex-row md:items-start gap-8 md:gap-10">
              <div className="flex-shrink-0 mx-auto md:mx-0">
                <Image
                  src="/peta-wilson.png"
                  alt="Peta Wilson"
                  width={280}
                  height={280}
                  className="rounded-xl object-cover aspect-square w-[240px] h-[240px] md:w-[280px] md:h-[280px]"
                  priority
                />
              </div>
              <div className="flex-1 min-w-0 space-y-6">
                <div className="space-y-3">
                  <p className="text-xs font-semibold tracking-[0.3em] uppercase text-[#5d89a9]">
                    About Beacon Advisory
                  </p>
                  <h1 className="text-3xl md:text-4xl font-semibold text-[#2B4162] leading-tight">
                    Practical senior advisory and execution support for complex organisational challenges.
                  </h1>
                </div>
                <div className="space-y-6 text-base md:text-lg text-[#465164] leading-relaxed">
                  {paragraphs.map((text) => (
                    <p key={text}>{text}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}







