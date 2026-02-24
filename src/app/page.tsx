import type { Metadata } from 'next';

import { PublicHeader } from '@/components/layout/PublicHeader';
import { PublicFooter } from '@/components/layout/PublicFooter';
import { MaterialIcon } from '@/components/ui/MaterialIcon';

export const metadata: Metadata = {
  title: 'Beacon Advisory',
  description:
    'Beacon Advisory provides practical senior advisory and execution support across business transformation, digital initiatives, enterprise improvement and high-stakes special projects.',
};

const areasOfExpertise = [
  { icon: 'business', title: 'Business Improvement', description: 'Process optimisation, lean methodologies, continuous improvement' },
  { icon: 'devices', title: 'Digital Transformation', description: 'Technology strategy, system modernization, cloud migration' },
  { icon: 'analytics', title: 'Data & Analytics', description: 'Business intelligence, reporting, data-driven decision making' },
  { icon: 'groups', title: 'Change Management', description: 'Stakeholder engagement, training, adoption strategies' },
  { icon: 'construction', title: 'Construction Tech', description: 'Industry-specific solutions, safety systems, project management' },
  { icon: 'shield', title: 'Compliance & Risk', description: 'Regulatory compliance, risk management, audit preparation' },
] as const;

const testimonials = [
  {
    quote: 'Exceptional leadership in driving digital transformation initiatives. Demonstrated strategic thinking and ability to deliver complex technology projects on time and within budget.',
    author: 'Senior Executive',
    role: 'Richard Crookes Constructions',
  },
  {
    quote: 'Outstanding ability to translate complex technical concepts into actionable business strategies. A trusted advisor who consistently delivers results.',
    author: 'Technology Partner',
    role: 'Industry Consultant',
  },
  {
    quote: 'Innovative approach to problem-solving and deep expertise in business process improvement. Instrumental in driving operational excellence across the organisation.',
    author: 'Operations Director',
    role: 'Construction Industry',
  },
  {
    quote: 'Recognized industry leader with proven track record in technology excellence. Award-winning contributions to innovation and digital transformation.',
    author: 'HammerTech',
    role: 'Technology Excellence Award 2024',
  },
] as const;

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PublicHeader />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-[#f8f9fb]">
          <div className="max-w-5xl mx-auto px-6 py-24">
            <div className="space-y-6 text-center md:text-left">
              <p className="text-xs font-semibold tracking-[0.3em] uppercase text-[#5d89a9]">
                Beacon Advisory
              </p>
              <h1 className="text-3xl md:text-5xl font-semibold text-[#2B4162] leading-tight">
                Practical advisory solutions that improve performance, reduce risk & provide insights to enable informed decisions.
              </h1>
              <p className="text-lg md:text-xl text-[#465164] leading-relaxed max-w-3xl">
                Beacon Advisory provides senior advisory and execution support for organisations navigating complex
                transformation, digital initiatives, enterprise improvement and high-stakes special projects. Our work
                brings clarity, structure and delivery discipline to executive initiatives that demand practical
                leadership and results.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                <a
                  href="mailto:hello@beaconeffect.com.au"
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-[#2B4162] px-6 py-3 text-sm font-semibold text-white hover:bg-[#23334c] transition-colors"
                >
                  <MaterialIcon icon="mail" style={{ fontSize: '18px' }} />
                  Start a Conversation
                </a>
                <a
                  href="https://www.linkedin.com/in/peta-wilson-4769361"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-md border border-[#2B4162] px-6 py-3 text-sm font-semibold text-[#2B4162] hover:bg-[#f1f3f7] transition-colors"
                >
                  <MaterialIcon icon="person" style={{ fontSize: '18px' }} />
                  Connect on LinkedIn
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Recognition & Awards */}
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-2xl font-semibold text-[#2B4162] mb-8">Recognition & Awards</h2>
            <p className="text-sm text-[#465164] mb-8">Industry-recognized expertise in technology and business transformation</p>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="border border-[#e6e8ed] rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <MaterialIcon icon="emoji_events" style={{ fontSize: '32px', color: '#5d89a9' }} />
                  <h3 className="text-lg font-semibold text-[#2B4162]">HammerTech Award</h3>
                </div>
                <p className="text-sm text-[#465164] mb-2">Technology Excellence</p>
                <p className="text-xs text-[#737A8C]">Australia & New Zealand 2024</p>
              </div>
              <div className="border border-[#e6e8ed] rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <MaterialIcon icon="verified" style={{ fontSize: '32px', color: '#5d89a9' }} />
                  <h3 className="text-lg font-semibold text-[#2B4162]">Head of Business Improvement</h3>
                </div>
                <p className="text-sm text-[#465164] mb-2">RCC (Richard Crookes Constructions)</p>
                <p className="text-xs text-[#737A8C]">Leading digital transformation initiatives</p>
              </div>
              <div className="border border-[#e6e8ed] rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <MaterialIcon icon="campaign" style={{ fontSize: '32px', color: '#5d89a9' }} />
                  <h3 className="text-lg font-semibold text-[#2B4162]">Industry Thought Leader</h3>
                </div>
                <p className="text-sm text-[#465164] mb-2">Featured by multiple consultants</p>
                <p className="text-xs text-[#737A8C]">Interviews on technology & innovation</p>
              </div>
            </div>
          </div>
        </section>

        {/* Advisory Services */}
        <section id="advisory" className="py-20 bg-[#f8f9fb] scroll-mt-20">
          <div className="max-w-6xl mx-auto px-6 space-y-12">
            <h2 className="text-2xl font-semibold text-[#2B4162]">Advisory Services</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {areasOfExpertise.map((area) => (
                <div key={area.title} className="bg-white border border-[#e6e8ed] rounded-xl p-6">
                  <div className="flex justify-center mb-4">
                    <MaterialIcon icon={area.icon} style={{ fontSize: '48px', color: '#6B9AC4' }} />
                  </div>
                  <h3 className="text-xl font-semibold text-[#2B4162] text-center mb-3">
                    {area.title}
                  </h3>
                  <p className="text-[#6B7C93] text-center leading-relaxed">
                    {area.description}
                  </p>
                </div>
              ))}
            </div>
            <p className="text-base text-[#465164] leading-relaxed max-w-4xl">
              Let Beacon Advisory handle the important initiatives that don't align with anyone's primary role. We take a tactical approach—engage, execute, and hand over—allowing your high performers to focus on what they do best. Don't dilute your team's effectiveness by assigning critical projects outside their core expertise simply because they're capable. Let them excel in their roles while we deliver the initiatives that matter.
            </p>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 bg-white border-y border-[#e6e8ed]">
          <div className="max-w-6xl mx-auto px-6 space-y-8">
            <h2 className="text-2xl font-semibold text-[#2B4162]">Testimonials</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {testimonials.map((testimonial, idx) => (
                <div key={idx} className="bg-[#f8f9fb] border border-[#e6e8ed] rounded-xl p-6 shadow-sm">
                  <MaterialIcon icon="format_quote" style={{ fontSize: '28px', color: '#5d89a9', marginBottom: '12px' }} />
                  <p className="text-sm text-[#465164] italic leading-relaxed mb-4">"{testimonial.quote}"</p>
                  <div className="text-xs font-semibold text-[#2B4162]">{testimonial.author}</div>
                  <div className="text-xs text-[#586273]">{testimonial.role}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-[#2B4162]">
          <div className="max-w-4xl mx-auto px-6 text-center space-y-6 text-white">
            <h2 className="text-3xl font-semibold">Let's Discuss Your Challenge</h2>
            <p className="text-base text-white/80 leading-relaxed">
              Whether you need strategic advice, technology solutions, or interim leadership—let's explore how we can help your organisation succeed.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="mailto:hello@beaconeffect.com.au"
                className="inline-flex items-center justify-center gap-2 rounded-md bg-white px-6 py-3 text-sm font-semibold text-[#2B4162] hover:bg-[#f1f3f7] transition-colors"
              >
                <MaterialIcon icon="mail" style={{ fontSize: '18px' }} />
                Schedule Consultation
              </a>
              <a
                href="https://www.linkedin.com/in/peta-wilson-4769361"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-md border border-white px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
              >
                <MaterialIcon icon="person" style={{ fontSize: '18px' }} />
                Connect on LinkedIn
              </a>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
