import type { Metadata } from 'next';

import { PublicFooter } from '@/components/layout/PublicFooter';
import { PublicHeader } from '@/components/layout/PublicHeader';
import { MaterialIcon } from '@/components/ui/MaterialIcon';

export const metadata: Metadata = {
  title: 'Beacon Advisory – Services & Capabilities',
  description:
    'Strategic consulting, technology solutions, executive advisory, and corporate concierge services for complex organisational challenges.',
};

const capabilities = [
  {
    icon: 'psychology',
    title: 'Strategic Consulting',
    description: 'Executive-level advisory for complex organisational challenges. From digital transformation roadmaps to operational excellence programs.',
    features: [
      'Business process improvement & optimisation',
      'Digital transformation strategy & execution',
      'Change management & stakeholder engagement',
      'Operational excellence programs',
    ],
  },
  {
    icon: 'code',
    title: 'Technology Solutions',
    description: 'Custom application development and technology platform implementation. From concept to deployment, building solutions that solve real business problems.',
    features: [
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
    features: [
      'Technology strategy & roadmap development',
      'Operational excellence & process improvement',
      'Digital transformation planning & execution',
      'Strategic program oversight & governance',
    ],
  },
  {
    icon: 'concierge',
    title: 'Corporate Concierge',
    description: 'Handling important initiatives that don\'t align with anyone\'s primary role. Engage, execute, and hand over—allowing your high performers to focus on what they do best.',
    features: [
      'Executive dashboard development (Power BI, Tableau, custom)',
      'Unique projects & short-term secondments',
      'Crisis response & uncharted territory navigation',
      'Vendor selection & contract negotiation',
      'Board & executive presentations',
      'Business case development & ROI analysis',
    ],
  },
] as const;

export default function FeaturesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PublicHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-[#f8f9fb] border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-6 py-20 md:py-24">
            <div className="max-w-4xl space-y-6">
              <p className="text-xs font-semibold tracking-[0.3em] uppercase text-[#5d89a9]">
                Beacon Advisory
              </p>
              <h1 className="text-3xl md:text-5xl font-semibold text-[#2B4162] leading-tight">
                Services & Capabilities
              </h1>
              <p className="text-lg text-[#465164] leading-relaxed">
                Practical senior advisory and execution support across business transformation, digital initiatives, enterprise improvement and high-stakes special projects.
              </p>
            </div>
          </div>
        </section>

        {/* Capabilities */}
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-6 space-y-16">
            {capabilities.map((capability) => (
              <div key={capability.title} className="bg-white border border-[#e6e8ed] rounded-xl p-8 md:p-10">
                <div className="flex items-start gap-6 mb-6">
                  <div className="p-4 rounded-lg bg-[#f4f6fa] flex-shrink-0">
                    <MaterialIcon icon={capability.icon} style={{ fontSize: '40px', color: '#2B4162' }} />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-semibold text-[#2B4162] mb-3">{capability.title}</h2>
                    <p className="text-base text-[#465164] leading-relaxed mb-6">{capability.description}</p>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {capability.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <MaterialIcon icon="check_circle" style={{ fontSize: '18px', color: '#5d89a9', marginTop: '2px', flexShrink: 0 }} />
                          <span className="text-sm text-[#465164]">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-[#2B4162]">
          <div className="max-w-4xl mx-auto px-6 text-center space-y-6 text-white">
            <h2 className="text-3xl font-semibold">Ready to Discuss Your Challenge?</h2>
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
