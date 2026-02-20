import type { Metadata } from 'next';

import { PublicFooter } from '@/components/layout/PublicFooter';
import { PublicHeader } from '@/components/layout/PublicHeader';
import { MaterialIcon } from '@/components/ui/MaterialIcon';

export const metadata: Metadata = {
  title: 'Beacon Advisory – Engagement Models',
  description:
    'Flexible engagement models for senior advisory and execution support. Project-based, retainer, and advisory partnership options.',
};

export default function PricingPage() {
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
                Engagement Models
              </h1>
              <p className="text-lg text-[#465164] leading-relaxed">
                Flexible engagement options designed to meet your organisation's needs. From project-based initiatives to ongoing advisory partnerships, we work with you to deliver the right level of support.
              </p>
            </div>
          </div>
        </section>

        {/* Engagement Models */}
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-8">
              {/* Project-Based */}
              <div className="bg-white border border-[#e6e8ed] rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-lg bg-[#f4f6fa]">
                    <MaterialIcon icon="schedule" style={{ fontSize: '32px', color: '#2B4162' }} />
                  </div>
                  <h2 className="text-xl font-semibold text-[#2B4162]">Project-Based</h2>
                </div>
                <p className="text-base text-[#465164] leading-relaxed mb-6">
                  Fixed-scope engagements with defined deliverables and timelines. Ideal for specific initiatives or transformation programs.
                </p>
                <div className="space-y-2 mb-6">
                  <div className="flex items-start gap-2">
                    <MaterialIcon icon="check_circle" style={{ fontSize: '18px', color: '#5d89a9', marginTop: '2px' }} />
                    <span className="text-sm text-[#465164]"><strong>Duration:</strong> 3-12 months</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MaterialIcon icon="check_circle" style={{ fontSize: '18px', color: '#5d89a9', marginTop: '2px' }} />
                    <span className="text-sm text-[#465164]"><strong>Best for:</strong> Defined projects with clear outcomes</span>
                  </div>
                </div>
                <a
                  href="mailto:hello@beaconeffect.com.au?subject=Project-Based Engagement Enquiry"
                  className="block w-full text-center px-6 py-3 rounded-lg font-semibold text-sm bg-[#2B4162] text-white hover:bg-[#23334c] transition-colors"
                >
                  Discuss Your Project
                </a>
              </div>

              {/* Retainer */}
              <div className="bg-white border-2 border-[#5d89a9] rounded-xl p-8 shadow-md relative">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold text-white bg-[#5d89a9]">
                  MOST POPULAR
                </div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-lg bg-[#f4f6fa]">
                    <MaterialIcon icon="autorenew" style={{ fontSize: '32px', color: '#2B4162' }} />
                  </div>
                  <h2 className="text-xl font-semibold text-[#2B4162]">Retainer</h2>
                </div>
                <p className="text-base text-[#465164] leading-relaxed mb-6">
                  Ongoing advisory relationship with flexible scope. Regular strategic guidance and support as your business evolves.
                </p>
                <div className="space-y-2 mb-6">
                  <div className="flex items-start gap-2">
                    <MaterialIcon icon="check_circle" style={{ fontSize: '18px', color: '#5d89a9', marginTop: '2px' }} />
                    <span className="text-sm text-[#465164]"><strong>Duration:</strong> 6-24 months</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MaterialIcon icon="check_circle" style={{ fontSize: '18px', color: '#5d89a9', marginTop: '2px' }} />
                    <span className="text-sm text-[#465164]"><strong>Best for:</strong> Continuous improvement & strategic guidance</span>
                  </div>
                </div>
                <a
                  href="mailto:hello@beaconeffect.com.au?subject=Retainer Engagement Enquiry"
                  className="block w-full text-center px-6 py-3 rounded-lg font-semibold text-sm bg-[#5d89a9] text-white hover:bg-[#4a6f8a] transition-colors"
                >
                  Discuss Retainer Options
                </a>
              </div>

              {/* Advisory Partnership */}
              <div className="bg-white border border-[#e6e8ed] rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-lg bg-[#f4f6fa]">
                    <MaterialIcon icon="handshake" style={{ fontSize: '32px', color: '#2B4162' }} />
                  </div>
                  <h2 className="text-xl font-semibold text-[#2B4162]">Advisory Partnership</h2>
                </div>
                <p className="text-base text-[#465164] leading-relaxed mb-6">
                  Embedded advisory support for your leadership team. Regular strategic guidance without taking on line management responsibilities.
                </p>
                <div className="space-y-2 mb-6">
                  <div className="flex items-start gap-2">
                    <MaterialIcon icon="check_circle" style={{ fontSize: '18px', color: '#5d89a9', marginTop: '2px' }} />
                    <span className="text-sm text-[#465164]"><strong>Duration:</strong> 6-18 months</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MaterialIcon icon="check_circle" style={{ fontSize: '18px', color: '#5d89a9', marginTop: '2px' }} />
                    <span className="text-sm text-[#465164]"><strong>Best for:</strong> Major transformations & strategic programs</span>
                  </div>
                </div>
                <a
                  href="mailto:hello@beaconeffect.com.au?subject=Advisory Partnership Enquiry"
                  className="block w-full text-center px-6 py-3 rounded-lg font-semibold text-sm bg-[#2B4162] text-white hover:bg-[#23334c] transition-colors"
                >
                  Discuss Partnership
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-[#2B4162]">
          <div className="max-w-4xl mx-auto px-6 text-center space-y-6 text-white">
            <h2 className="text-3xl font-semibold">Let's Discuss Your Needs</h2>
            <p className="text-base text-white/80 leading-relaxed">
              Every engagement is tailored to your specific challenges and objectives. Let's explore which model works best for your organisation.
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
