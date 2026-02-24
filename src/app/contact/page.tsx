import type { Metadata } from 'next';

import { PublicFooter } from '@/components/layout/PublicFooter';
import { PublicHeader } from '@/components/layout/PublicHeader';
import { MaterialIcon } from '@/components/ui/MaterialIcon';

export const metadata: Metadata = {
  title: 'Contact Beacon Advisory',
  description:
    'Contact Beacon Advisory for senior advisory support across transformation, digital initiatives, enterprise improvement and high-stakes executive projects.',
};

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PublicHeader />

      <main className="flex-1">
        <section className="bg-[#f8f9fb] border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-6 py-16 md:py-20 space-y-6">
            <div className="space-y-3">
              <p className="text-xs font-semibold tracking-[0.3em] uppercase text-[#5d89a9]">
                Contact
              </p>
              <h1 className="text-3xl md:text-4xl font-semibold text-[#2B4162] leading-tight">
                Get in Touch
              </h1>
            </div>
            <div className="space-y-4 text-base md:text-lg text-[#465164] leading-relaxed">
              <p>
                If you’re facing a complex transformation, digital initiative, enterprise improvement challenge or a high-stakes special project, Beacon Advisory can help bring clarity, discipline and
                momentum.
              </p>
              <p>
                I work directly with senior leaders and executive teams across a wide range of organisations. If you’d like to discuss an upcoming initiative or explore whether Beacon Advisory is the
                right fit, please reach out.
              </p>
            </div>
            <div className="space-y-4 rounded-xl border border-[#e6e8ed] bg-white p-6 shadow-sm">
              <h2 className="text-sm font-semibold tracking-wide uppercase text-[#5d89a9]">Contact</h2>
              <div className="flex flex-col gap-3 text-sm text-[#2B4162]">
                <a
                  href="mailto:hello@beaconeffect.com.au"
                  className="inline-flex items-center gap-2 hover:text-[#1b2740] transition-colors font-semibold"
                >
                  <MaterialIcon icon="mail" style={{ fontSize: '18px' }} />
                  hello@beaconeffect.com.au
                </a>
                <a
                  href="https://www.linkedin.com/in/peta-wilson-4769361"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 hover:text-[#1b2740] transition-colors font-semibold"
                >
                  <MaterialIcon icon="person" style={{ fontSize: '18px' }} />
                  LinkedIn
                </a>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
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
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}


