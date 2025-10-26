import { MaterialIcon } from '@/components/ui/MaterialIcon';
import { PublicHeader } from '@/components/layout/PublicHeader';

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-white">
      <PublicHeader />

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#2B4162] via-[#5d89a9] to-[#64afac] py-20">
        <div className="max-w-4xl mx-auto px-6 text-center text-white">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">Simple, Transparent Pricing</h1>
          <p className="text-xl leading-relaxed opacity-90">
            Choose the plan that fits your organisation. No hidden fees, no lock-in contracts.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 bg-[#f4f4ee]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Starter Plan */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all">
              <div className="text-center mb-6">
                <MaterialIcon icon="rocket_launch" style={{ fontSize: '48px', color: '#64afac', marginBottom: '12px' }} />
                <h3 className="text-2xl font-bold mb-2" style={{ color: '#2B4162' }}>Starter</h3>
                <p className="text-sm text-[#737A8C] mb-4">Best for small to medium organisations</p>
                <div className="text-4xl font-bold mb-2" style={{ color: '#64afac' }}>$2,500</div>
                <div className="text-sm text-[#737A8C]">AUD per month</div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-2">
                  <MaterialIcon icon="check_circle" style={{ fontSize: '20px', color: '#64afac' }} />
                  <span className="text-sm">Up to 100 active employees</span>
                </div>
                <div className="flex items-start gap-2">
                  <MaterialIcon icon="check_circle" style={{ fontSize: '20px', color: '#64afac' }} />
                  <span className="text-sm">Weekly pulse surveys</span>
                </div>
                <div className="flex items-start gap-2">
                  <MaterialIcon icon="check_circle" style={{ fontSize: '20px', color: '#64afac' }} />
                  <span className="text-sm">Executive dashboard (3 users)</span>
                </div>
                <div className="flex items-start gap-2">
                  <MaterialIcon icon="check_circle" style={{ fontSize: '20px', color: '#64afac' }} />
                  <span className="text-sm">Email & SMS delivery</span>
                </div>
                <div className="flex items-start gap-2">
                  <MaterialIcon icon="check_circle" style={{ fontSize: '20px', color: '#64afac' }} />
                  <span className="text-sm">Basic analytics & reporting</span>
                </div>
                <div className="flex items-start gap-2">
                  <MaterialIcon icon="check_circle" style={{ fontSize: '20px', color: '#64afac' }} />
                  <span className="text-sm">Email support (48hr response)</span>
                </div>
              </div>

              <a 
                href="mailto:hello@beaconeffect.com.au?subject=Starter Plan Enquiry"
                className="block w-full text-center px-6 py-3 rounded-lg font-bold transition-all hover:opacity-90"
                style={{ backgroundColor: '#64afac', color: 'white' }}
              >
                Get Started
              </a>
            </div>

            {/* Professional Plan */}
            <div className="bg-gradient-to-br from-[#2B4162] to-[#5d89a9] rounded-2xl p-8 shadow-xl relative">
              
              <div className="text-center mb-6">
                <MaterialIcon icon="star" style={{ fontSize: '48px', color: '#64afac', marginBottom: '12px' }} />
                <h3 className="text-2xl font-bold mb-2 text-white">Professional</h3>
                <p className="text-sm text-white/80 mb-4">Best for growing organisations</p>
                <div className="text-4xl font-bold mb-2 text-white">$6,500</div>
                <div className="text-sm text-white/80">AUD per month</div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-2">
                  <MaterialIcon icon="check_circle" style={{ fontSize: '20px', color: '#64afac' }} />
                  <span className="text-sm text-white">Up to 500 active employees</span>
                </div>
                <div className="flex items-start gap-2">
                  <MaterialIcon icon="check_circle" style={{ fontSize: '20px', color: '#64afac' }} />
                  <span className="text-sm text-white">Weekly pulse surveys</span>
                </div>
                <div className="flex items-start gap-2">
                  <MaterialIcon icon="check_circle" style={{ fontSize: '20px', color: '#64afac' }} />
                  <span className="text-sm text-white">Executive dashboard (10 users)</span>
                </div>
                <div className="flex items-start gap-2">
                  <MaterialIcon icon="check_circle" style={{ fontSize: '20px', color: '#64afac' }} />
                  <span className="text-sm text-white">Email & SMS delivery</span>
                </div>
                <div className="flex items-start gap-2">
                  <MaterialIcon icon="check_circle" style={{ fontSize: '20px', color: '#64afac' }} />
                  <span className="text-sm text-white">Advanced analytics with drill-downs</span>
                </div>
                <div className="flex items-start gap-2">
                  <MaterialIcon icon="check_circle" style={{ fontSize: '20px', color: '#64afac' }} />
                  <span className="text-sm text-white">Power BI integration</span>
                </div>
                <div className="flex items-start gap-2">
                  <MaterialIcon icon="check_circle" style={{ fontSize: '20px', color: '#64afac' }} />
                  <span className="text-sm text-white">Priority support (24hr response)</span>
                </div>
                <div className="flex items-start gap-2">
                  <MaterialIcon icon="check_circle" style={{ fontSize: '20px', color: '#64afac' }} />
                  <span className="text-sm text-white">Quarterly wellbeing consultation</span>
                </div>
              </div>

              <a 
                href="mailto:hello@beaconeffect.com.au?subject=Professional Plan Enquiry"
                className="block w-full text-center px-6 py-3 rounded-lg font-bold transition-all hover:opacity-90"
                style={{ backgroundColor: '#64afac', color: 'white' }}
              >
                Get Started
              </a>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all">
              <div className="text-center mb-6">
                <MaterialIcon icon="business" style={{ fontSize: '48px', color: '#5d89a9', marginBottom: '12px' }} />
                <h3 className="text-2xl font-bold mb-2" style={{ color: '#2B4162' }}>Enterprise</h3>
                <p className="text-sm text-[#737A8C] mb-4">Best for large organisations</p>
                <div className="text-4xl font-bold mb-2" style={{ color: '#5d89a9' }}>Custom</div>
                <div className="text-sm text-[#737A8C]">Starting at $12,000/mo</div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-2">
                  <MaterialIcon icon="check_circle" style={{ fontSize: '20px', color: '#5d89a9' }} />
                  <span className="text-sm">Unlimited employees</span>
                </div>
                <div className="flex items-start gap-2">
                  <MaterialIcon icon="check_circle" style={{ fontSize: '20px', color: '#5d89a9' }} />
                  <span className="text-sm">Weekly pulse surveys</span>
                </div>
                <div className="flex items-start gap-2">
                  <MaterialIcon icon="check_circle" style={{ fontSize: '20px', color: '#5d89a9' }} />
                  <span className="text-sm">Unlimited dashboard users</span>
                </div>
                <div className="flex items-start gap-2">
                  <MaterialIcon icon="check_circle" style={{ fontSize: '20px', color: '#5d89a9' }} />
                  <span className="text-sm">Full analytics suite</span>
                </div>
                <div className="flex items-start gap-2">
                  <MaterialIcon icon="check_circle" style={{ fontSize: '20px', color: '#5d89a9' }} />
                  <span className="text-sm">API access for HRIS integration</span>
                </div>
                <div className="flex items-start gap-2">
                  <MaterialIcon icon="check_circle" style={{ fontSize: '20px', color: '#5d89a9' }} />
                  <span className="text-sm">Dedicated account manager</span>
                </div>
                <div className="flex items-start gap-2">
                  <MaterialIcon icon="check_circle" style={{ fontSize: '20px', color: '#5d89a9' }} />
                  <span className="text-sm">Monthly strategy sessions</span>
                </div>
                <div className="flex items-start gap-2">
                  <MaterialIcon icon="check_circle" style={{ fontSize: '20px', color: '#5d89a9' }} />
                  <span className="text-sm">Custom branding & white-labeling</span>
                </div>
                <div className="flex items-start gap-2">
                  <MaterialIcon icon="check_circle" style={{ fontSize: '20px', color: '#5d89a9' }} />
                  <span className="text-sm">24/7 priority support</span>
                </div>
              </div>

              <a 
                href="mailto:hello@beaconeffect.com.au?subject=Enterprise Plan Enquiry"
                className="block w-full text-center px-6 py-3 rounded-lg font-bold transition-all hover:opacity-90"
                style={{ backgroundColor: '#5d89a9', color: 'white' }}
              >
                Contact Sales
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Add-Ons */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-8 text-center" style={{ color: '#2B4162' }}>Add-Ons & Extras</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-[#f4f4ee] p-6 rounded-xl">
              <MaterialIcon icon="history" style={{ fontSize: '32px', color: '#64afac', marginBottom: '8px' }} />
              <h3 className="font-bold mb-2" style={{ color: '#2B4162' }}>Historical Data Migration</h3>
              <div className="text-2xl font-bold mb-1" style={{ color: '#64afac' }}>$2,000</div>
              <p className="text-xs text-[#737A8C]">One-time fee</p>
            </div>

            <div className="bg-[#eeefec] p-6 rounded-xl">
              <MaterialIcon icon="quiz" style={{ fontSize: '32px', color: '#5d89a9', marginBottom: '8px' }} />
              <h3 className="font-bold mb-2" style={{ color: '#2B4162' }}>Custom Questions</h3>
              <div className="text-2xl font-bold mb-1" style={{ color: '#5d89a9' }}>$500</div>
              <p className="text-xs text-[#737A8C]">Per question/month</p>
            </div>

            <div className="bg-[#f4f4ee] p-6 rounded-xl">
              <MaterialIcon icon="sms" style={{ fontSize: '32px', color: '#64afac', marginBottom: '8px' }} />
              <h3 className="font-bold mb-2" style={{ color: '#2B4162' }}>Additional SMS</h3>
              <div className="text-2xl font-bold mb-1" style={{ color: '#64afac' }}>$0.08</div>
              <p className="text-xs text-[#737A8C]">Per SMS</p>
            </div>

            <div className="bg-[#eeefec] p-6 rounded-xl">
              <MaterialIcon icon="school" style={{ fontSize: '32px', color: '#5d89a9', marginBottom: '8px' }} />
              <h3 className="font-bold mb-2" style={{ color: '#2B4162' }}>Training Workshops</h3>
              <div className="text-2xl font-bold mb-1" style={{ color: '#5d89a9' }}>$1,500</div>
              <p className="text-xs text-[#737A8C]">Per session</p>
            </div>
          </div>
        </div>
      </section>

      {/* ROI Calculator */}
      <section className="py-16 bg-[#f4f4ee]">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-8 text-center" style={{ color: '#2B4162' }}>Return on Investment</h2>
          
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-xl font-bold mb-4" style={{ color: '#2B4162' }}>Average Cost Savings</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-[#f4f4ee] rounded-lg">
                    <span className="text-sm">Early risk identification</span>
                    <span className="font-bold text-lg" style={{ color: '#64afac' }}>Weekly</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-[#f4f4ee] rounded-lg">
                    <span className="text-sm">Improved systems & culture</span>
                    <span className="font-bold text-lg" style={{ color: '#64afac' }}>Measurable</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-[#f4f4ee] rounded-lg">
                    <span className="text-sm">Annual savings</span>
                    <span className="font-bold text-lg" style={{ color: '#64afac' }}>$10,500 - $17,500</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-4" style={{ color: '#2B4162' }}>Measurable Outcomes</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <MaterialIcon icon="trending_up" style={{ fontSize: '20px', color: '#64afac' }} />
                    <div>
                      <div className="font-bold text-sm">Improved systems</div>
                      <div className="text-xs text-[#737A8C]">better workplace culture</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <MaterialIcon icon="trending_up" style={{ fontSize: '20px', color: '#64afac' }} />
                    <div>
                      <div className="font-bold text-sm">20-30% improvement</div>
                      <div className="text-xs text-[#737A8C]">in engagement scores</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <MaterialIcon icon="speed" style={{ fontSize: '20px', color: '#64afac' }} />
                    <div>
                      <div className="font-bold text-sm">25% faster</div>
                      <div className="text-xs text-[#737A8C]">issue identification vs annual surveys</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <MaterialIcon icon="verified" style={{ fontSize: '20px', color: '#64afac' }} />
                    <div>
                      <div className="font-bold text-sm">Full compliance</div>
                      <div className="text-xs text-[#737A8C]">with psychosocial safety obligations</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <div className="text-center">
                <p className="text-lg font-bold mb-2" style={{ color: '#2B4162' }}>
                  Typical ROI: 3-6 months
                </p>
                <p className="text-sm text-[#737A8C]">
                  Most organisations see positive impact within the first quarter through improved workplace systems, processes, 
                  and culture that contribute to psychological safety.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Implementation Timeline */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-8 text-center" style={{ color: '#2B4162' }}>Implementation Timeline</h2>
          
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ backgroundColor: '#f4f4ee' }}>
                <span className="text-2xl font-bold" style={{ color: '#64afac' }}>1</span>
              </div>
              <h3 className="font-bold mb-2" style={{ color: '#2B4162' }}>Week 1: Setup</h3>
              <p className="text-sm text-[#737A8C]">
                Onboarding call, configure org structure, import employees, set up dashboards
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ backgroundColor: '#eeefec' }}>
                <span className="text-2xl font-bold" style={{ color: '#5d89a9' }}>2</span>
              </div>
              <h3 className="font-bold mb-2" style={{ color: '#2B4162' }}>Week 2: Pilot</h3>
              <p className="text-sm text-[#737A8C]">
                Launch pilot with 20-50 employees, monitor engagement, review initial data
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ backgroundColor: '#f4f4ee' }}>
                <span className="text-2xl font-bold" style={{ color: '#64afac' }}>3</span>
              </div>
              <h3 className="font-bold mb-2" style={{ color: '#2B4162' }}>Week 3: Rollout</h3>
              <p className="text-sm text-[#737A8C]">
                Company-wide launch, train leadership team, establish weekly cadence
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ backgroundColor: '#eeefec' }}>
                <span className="text-2xl font-bold" style={{ color: '#5d89a9' }}>4</span>
              </div>
              <h3 className="font-bold mb-2" style={{ color: '#2B4162' }}>Week 4: Optimize</h3>
              <p className="text-sm text-[#737A8C]">
                Review first month data, identify trends, plan intervention strategies
              </p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-lg font-bold" style={{ color: '#2B4162' }}>
              Total time from contract to full deployment: 3-4 weeks
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-[#eeefec]">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-8 text-center" style={{ color: '#2B4162' }}>Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl">
              <h3 className="font-bold mb-2" style={{ color: '#2B4162' }}>Is there a minimum contract term?</h3>
              <p className="text-sm text-[#737A8C]">
                No lock-in contracts. We offer month-to-month plans. Most clients see value within the first 3 months and continue long-term.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl">
              <h3 className="font-bold mb-2" style={{ color: '#2B4162' }}>Can we try before we buy?</h3>
              <p className="text-sm text-[#737A8C]">
                Yes! We offer a free 2-week trial with up to 50 employees. No credit card required.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl">
              <h3 className="font-bold mb-2" style={{ color: '#2B4162' }}>What if we grow beyond our plan limit?</h3>
              <p className="text-sm text-[#737A8C]">
                We'll automatically upgrade you to the next tier. You'll be notified before any changes to your billing.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl">
              <h3 className="font-bold mb-2" style={{ color: '#2B4162' }}>Do you offer discounts for annual contracts?</h3>
              <p className="text-sm text-[#737A8C]">
                Yes, save 15% with annual prepayment. Contact sales for details.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-[#2B4162] to-[#5d89a9]">
        <div className="max-w-4xl mx-auto px-6 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 opacity-90">
            Discover how systems, processes, and culture contribute to psychological safety.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a 
              href="mailto:hello@beaconeffect.com.au?subject=Beacon Wellbeing Enquiry" 
              className="px-8 py-4 bg-white text-[#2B4162] rounded-lg font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              Get Started
            </a>
            <a 
              href="mailto:hello@beaconeffect.com.au?subject=Pricing Enquiry" 
              className="px-8 py-4 bg-[#64afac] text-white rounded-lg font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              Contact Sales
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#2B4162] py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <MaterialIcon icon="health_and_safety" style={{ fontSize: '24px', color: '#64afac' }} />
                <span className="text-lg font-bold text-white">Beacon</span>
              </div>
              <p className="text-white/70 text-sm">
                Psychosocial wellbeing platform for modern workplaces
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-3">Product</h4>
              <div className="space-y-2 text-sm">
                <a href="/features" className="block text-white/70 hover:text-white transition-colors">Features</a>
                <a href="/pricing" className="block text-white/70 hover:text-white transition-colors">Pricing</a>
                <a href="/dashboard" className="block text-white/70 hover:text-white transition-colors">Demo</a>
              </div>
            </div>
            <div>
              <h4 className="text-white font-bold mb-3">Company</h4>
              <div className="space-y-2 text-sm">
                <a href="/about" className="block text-white/70 hover:text-white transition-colors">About</a>
                <a href="/advisory" className="block text-white/70 hover:text-white transition-colors">Advisory Services</a>
                <a href="/methodology" className="block text-white/70 hover:text-white transition-colors">Methodology</a>
              </div>
            </div>
            <div>
              <h4 className="text-white font-bold mb-3">Contact</h4>
              <div className="space-y-2 text-sm text-white/70">
                <div className="flex items-center gap-2">
                  <MaterialIcon icon="mail" style={{ fontSize: '16px' }} />
                  <a href="mailto:hello@beaconeffect.com.au" className="hover:text-white transition-colors">
                    hello@beaconeffect.com.au
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 mt-8 pt-8 text-center text-white/50 text-sm">
            <p>© 2025 Beacon Effect. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}

