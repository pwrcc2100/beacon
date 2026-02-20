import type { Metadata } from 'next';

import { PublicFooter } from '@/components/layout/PublicFooter';
import { PublicHeader } from '@/components/layout/PublicHeader';
import { MaterialIcon } from '@/components/ui/MaterialIcon';

export const metadata: Metadata = {
  title: 'Beacon Advisory – Services',
  description:
    'Senior advisory and hands-on execution support for complex executive initiatives, including business transformation, digital initiatives and enterprise improvement.',
};

const advisoryServices = [
  {
    icon: 'psychology',
    title: 'Strategic Consulting',
    description: 'Executive-level advisory for complex organisational challenges. From digital transformation roadmaps to operational excellence programs.',
    items: [
      'Business process improvement & optimisation',
      'Digital transformation strategy & execution',
      'Change management & stakeholder engagement',
      'Operational excellence programs',
    ],
  },
  {
    icon: 'code',
    title: 'Technology Solutions',
    description: 'Custom application development and technology platform implementation. From concept to deployment, building solutions that solve real business problems. We take a tactical approach: engage, execute, and hand over—without distracting your high performers from their core responsibilities.',
    items: [
      'Technology platform installation & implementation',
      'Custom web & mobile application development',
      'System integration & API development',
      'Data analytics & business intelligence',
      'Technology vendor selection & implementation',
    ],
  },
  {
    icon: 'lightbulb',
    title: 'Executive Advisory',
    description: 'Strategic guidance for senior leaders navigating complex decisions. Expert advice on technology, operations, and transformation—without stepping into line management roles.',
    items: [
      'Technology strategy & roadmap development',
      'Operational excellence & process improvement',
      'Digital transformation planning & execution',
      'Strategic program oversight & governance',
    ],
  },
  {
    icon: 'concierge',
    title: 'Corporate Concierge',
    description: 'Let Beacon Advisory handle the important initiatives that don\'t align with anyone\'s primary role. We take a tactical approach—engage, execute, and hand over—allowing your high performers to focus on what they do best. Don\'t dilute your team\'s effectiveness by assigning critical projects outside their core expertise simply because they\'re capable. Let them excel in their roles while we deliver the initiatives that matter.',
    items: [
      'Executive dashboard development (Power BI, Tableau, custom) providing real-time KPI tracking & insights for leadership decision making',
      'Unique projects & short-term secondments',
      'Crisis response & uncharted territory navigation',
      'Vendor selection & contract negotiation',
      'Board & executive presentations',
      'Business case development & ROI analysis',
    ],
  },
] as const;

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

export default function AdvisoryPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PublicHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-[#f8f9fb] border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-6 py-20 md:py-24">
            <div className="max-w-4xl space-y-6">
              <div className="flex items-center gap-3">
                <MaterialIcon icon="psychology" style={{ fontSize: '32px', color: '#2B4162' }} />
                <p className="text-xs font-semibold tracking-[0.3em] uppercase text-[#5d89a9]">
                  Beacon Advisory
                </p>
              </div>
              <h1 className="text-3xl md:text-5xl font-semibold text-[#2B4162] leading-tight">
                Corporate Concierge for Senior Engagements & Technology Solutions
              </h1>
              <p className="text-lg text-[#465164] leading-relaxed">
                Strategic advisory services combining deep expertise in business improvement, technology implementation, and organisational transformation. From executive-level consulting to custom application development—your trusted partner for complex business challenges.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                <a
                  href="mailto:hello@beaconeffect.com.au"
                  className="inline-flex items-center gap-2 rounded-md bg-[#2B4162] px-5 py-3 text-sm font-semibold text-white hover:bg-[#23334c] transition-colors"
                >
                  <MaterialIcon icon="mail" style={{ fontSize: '18px' }} />
                  Schedule Consultation
                </a>
                <a
                  href="https://www.linkedin.com/in/peta-wilson-4769361"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-md border border-[#2B4162] px-5 py-3 text-sm font-semibold text-[#2B4162] hover:bg-[#f1f3f7] transition-colors"
                >
                  <MaterialIcon icon="person" style={{ fontSize: '18px' }} />
                  View LinkedIn Profile
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
        <section className="py-20 bg-[#f8f9fb]">
          <div className="max-w-6xl mx-auto px-6 space-y-12">
            <h2 className="text-2xl font-semibold text-[#2B4162]">Advisory Services</h2>
            
            {/* Areas of Expertise - Immediately beneath Advisory Services heading */}
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

            {/* Service Details */}
            <div className="space-y-16">
              {advisoryServices.map((service) => (
                <div key={service.title} className="bg-white border border-[#e6e8ed] rounded-xl p-8">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="p-3 rounded-lg bg-[#f4f6fa]">
                      <MaterialIcon icon={service.icon} style={{ fontSize: '32px', color: '#2B4162' }} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-[#2B4162] mb-3">{service.title}</h3>
                      <p className="text-base text-[#465164] leading-relaxed mb-4">{service.description}</p>
                      <ul className="space-y-2">
                        {service.items.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-[#465164]">
                            <MaterialIcon icon="check_circle" style={{ fontSize: '18px', color: '#5d89a9', marginTop: '2px' }} />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 bg-[#f8f9fb] border-y border-[#e6e8ed]">
          <div className="max-w-6xl mx-auto px-6 space-y-8">
            <h2 className="text-2xl font-semibold text-[#2B4162]">Testimonials</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {testimonials.map((testimonial, idx) => (
                <div key={idx} className="bg-white border border-[#e6e8ed] rounded-xl p-6 shadow-sm">
                  <MaterialIcon icon="format_quote" style={{ fontSize: '28px', color: '#5d89a9', marginBottom: '12px' }} />
                  <p className="text-sm text-[#465164] italic leading-relaxed mb-4">"{testimonial.quote}"</p>
                  <div className="text-xs font-semibold text-[#2B4162]">{testimonial.author}</div>
                  <div className="text-xs text-[#586273]">{testimonial.role}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
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
