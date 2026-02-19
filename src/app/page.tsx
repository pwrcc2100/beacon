import type { Metadata } from 'next';

import { PublicHeader } from '@/components/layout/PublicHeader';
import { PublicFooter } from '@/components/layout/PublicFooter';
import { MaterialIcon } from '@/components/ui/MaterialIcon';

export const metadata: Metadata = {
  title: 'Beacon Advisory',
  description:
    'Beacon Advisory provides practical senior advisory and execution support across business transformation, digital initiatives, enterprise improvement and high-stakes special projects.',
};

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PublicHeader />

      <main className="flex-1">
        {/* Areas of Expertise Section */}
        <section className="bg-[#e8e9e5] py-20">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-[#2B4162] text-center mb-16">
              Areas of Expertise
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Business Improvement */}
              <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-center mb-4">
                  <MaterialIcon icon="business" style={{ fontSize: '48px', color: '#6B9AC4' }} />
                </div>
                <h3 className="text-xl font-semibold text-[#2B4162] text-center mb-3">
                  Business Improvement
                </h3>
                <p className="text-[#6B7C93] text-center leading-relaxed">
                  Process optimisation, lean methodologies, continuous improvement
                </p>
              </div>

              {/* Digital Transformation */}
              <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-center mb-4">
                  <MaterialIcon icon="devices" style={{ fontSize: '48px', color: '#6B9AC4' }} />
                </div>
                <h3 className="text-xl font-semibold text-[#2B4162] text-center mb-3">
                  Digital Transformation
                </h3>
                <p className="text-[#6B7C93] text-center leading-relaxed">
                  Technology strategy, system modernization, cloud migration
                </p>
              </div>

              {/* Data & Analytics */}
              <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-center mb-4">
                  <MaterialIcon icon="analytics" style={{ fontSize: '48px', color: '#6B9AC4' }} />
                </div>
                <h3 className="text-xl font-semibold text-[#2B4162] text-center mb-3">
                  Data & Analytics
                </h3>
                <p className="text-[#6B7C93] text-center leading-relaxed">
                  Business intelligence, reporting, data-driven decision making
                </p>
              </div>

              {/* Change Management */}
              <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-center mb-4">
                  <MaterialIcon icon="groups" style={{ fontSize: '48px', color: '#6B9AC4' }} />
                </div>
                <h3 className="text-xl font-semibold text-[#2B4162] text-center mb-3">
                  Change Management
                </h3>
                <p className="text-[#6B7C93] text-center leading-relaxed">
                  Stakeholder engagement, training, adoption strategies
                </p>
              </div>

              {/* Construction Tech */}
              <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-center mb-4">
                  <MaterialIcon icon="construction" style={{ fontSize: '48px', color: '#6B9AC4' }} />
                </div>
                <h3 className="text-xl font-semibold text-[#2B4162] text-center mb-3">
                  Construction Tech
                </h3>
                <p className="text-[#6B7C93] text-center leading-relaxed">
                  Industry-specific solutions, safety systems, project management
                </p>
              </div>

              {/* Compliance & Risk */}
              <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-center mb-4">
                  <MaterialIcon icon="shield" style={{ fontSize: '48px', color: '#6B9AC4' }} />
                </div>
                <h3 className="text-xl font-semibold text-[#2B4162] text-center mb-3">
                  Compliance & Risk
                </h3>
                <p className="text-[#6B7C93] text-center leading-relaxed">
                  Regulatory compliance, risk management, audit preparation
                </p>
              </div>
            </div>
          </div>
        </section>

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

        <section className="py-24">
          <div className="max-w-5xl mx-auto px-6">
            <div className="bg-white border border-[#e6e8ed] rounded-2xl shadow-sm p-8 md:p-10">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-[#f4f6fa]">
                  <MaterialIcon icon="psychology" style={{ fontSize: '32px', color: '#2B4162' }} />
                </div>
                <div className="space-y-3">
                  <h2 className="text-2xl font-semibold text-[#2B4162]">Beacon Advisory</h2>
                  <p className="text-base text-[#465164] leading-relaxed">
                    Hands-on advisory and execution support for complex programs, digital transformation and
                    organisational change.
                  </p>
                  <a
                    href="/advisory"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-[#2B4162] hover:text-[#1b2740] transition-colors"
                  >
                    Learn more about our work
                    <MaterialIcon icon="arrow_forward" style={{ fontSize: '18px' }} />
                  </a>
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
