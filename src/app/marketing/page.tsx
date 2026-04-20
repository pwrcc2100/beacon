'use client';

import { motion } from 'motion/react';
import { 
  ShieldCheck, 
  TrendingUp, 
  BarChart3, 
  Users, 
  CheckCircle2,
  ArrowRight,
  Activity,
  Target,
  Zap
} from 'lucide-react';

export default function MarketingPage() {
  const metrics = [
    { value: '85%', label: 'Average Wellbeing Score', icon: TrendingUp, color: '#2d6785' },
    { value: '92%', label: 'Participation Rate', icon: Users, color: '#2d6785' },
    { value: '3.2x', label: 'ROI Improvement', icon: BarChart3, color: '#d97036' },
    { value: '24/7', label: 'Real-time Monitoring', icon: Activity, color: '#2d6785' },
  ];

  const features = [
    {
      icon: ShieldCheck,
      title: 'Comprehensive Risk Assessment',
      description: 'Track psychological safety, workload, leadership, and clarity across your entire organization with precision.',
      gradient: 'from-[#2d6785]/20 to-transparent',
    },
    {
      icon: Target,
      title: 'Actionable Insights',
      description: 'Get specific recommendations and decision levers tailored to your organization\'s unique pressure points.',
      gradient: 'from-[#d97036]/20 to-transparent',
    },
    {
      icon: Zap,
      title: 'Real-time Monitoring',
      description: 'Stay ahead with continuous monitoring and early warning signals that help you intervene before issues escalate.',
      gradient: 'from-[#b8860b]/20 to-transparent',
    },
  ];

  const benefits = [
    'Reduce workplace stress and burnout',
    'Improve employee retention and engagement',
    'Enable data-driven leadership decisions',
    'Protect your organization\'s reputation',
    'Comply with psychosocial safety regulations',
    'Build a thriving workplace culture',
  ];

  return (
    <div className="min-h-screen bg-[var(--surface-2)]">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-gradient-to-br from-[#2d6785]/10 via-transparent to-[#d97036]/5"
          style={{ background: 'radial-gradient(ellipse 120% 70% at 50% -10%, rgba(45, 103, 133, 0.15), transparent 55%)' }}
        />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#2d6785]/10 border border-[#2d6785]/20 mb-6">
              <ShieldCheck size={16} className="text-[#2d6785]" />
              <span className="text-xs font-bold uppercase tracking-widest text-[#2d6785]">
                Psychosocial Safety Platform
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-[#0B1B2B] mb-6 leading-tight">
              Transform Workplace Wellbeing
              <br />
              <span className="text-[#2d6785]">With Data-Driven Insights</span>
            </h1>
            <p className="text-xl text-[#5c6370] mb-8 max-w-2xl mx-auto leading-relaxed">
              Monitor, measure, and improve psychological safety across your organization. 
              Get real-time insights that help leaders make informed decisions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-[#2d6785] to-[#3d8a9e] text-white font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
              >
                Get Started
                <ArrowRight size={20} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 rounded-xl bg-white border-2 border-[#2d6785] text-[#2d6785] font-semibold hover:bg-[#2d6785]/5 transition-all"
              >
                Request Demo
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Metrics Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, idx) => {
            const Icon = metric.icon;
            return (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="control-room-card p-6 text-center"
              >
                <div className="flex justify-center mb-4">
                  <div 
                    className="p-3 rounded-xl"
                    style={{ backgroundColor: `${metric.color}15` }}
                  >
                    <Icon size={24} style={{ color: metric.color }} />
                  </div>
                </div>
                <div className="metric-value mb-2" style={{ color: metric.color }}>
                  {metric.value}
                </div>
                <div className="metric-label">{metric.label}</div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0B1B2B] mb-4">
            Everything You Need to Protect Your People
          </h2>
          <p className="text-lg text-[#5c6370] max-w-2xl mx-auto">
            Comprehensive tools designed for modern organizations committed to workplace wellbeing
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.15 }}
                className={`control-room-card p-6 bg-gradient-to-br ${feature.gradient} border-l-4`}
                style={{ borderLeftColor: feature.gradient.includes('2d6785') ? '#2d6785' : feature.gradient.includes('d97036') ? '#d97036' : '#b8860b' }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div 
                    className="p-2 rounded-lg"
                    style={{ backgroundColor: feature.gradient.includes('2d6785') ? '#2d6785' : feature.gradient.includes('d97036') ? '#d97036' : '#b8860b' }}
                  >
                    <Icon size={20} className="text-white" />
                  </div>
                  <h3 className="text-lg font-semibold control-room-text-bright">
                    {feature.title}
                  </h3>
                </div>
                <p className="text-sm control-room-text-soft leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-[var(--surface)] py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-[#0B1B2B] mb-6">
                Why Organizations Choose Beacon
              </h2>
              <p className="text-lg text-[#5c6370] mb-8 leading-relaxed">
                Join leading organizations that trust Beacon to monitor and improve workplace 
                psychological safety. Our platform helps you create healthier, more productive teams.
              </p>
              <ul className="space-y-4">
                {benefits.map((benefit, idx) => (
                  <motion.li
                    key={benefit}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle2 size={20} className="text-[#2d6785] flex-shrink-0 mt-0.5" />
                    <span className="text-base control-room-text-bright">{benefit}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="control-room-card p-8"
            >
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <Activity size={20} className="control-room-text-muted" />
                  <h3 className="text-sm font-bold uppercase tracking-widest metric-label">
                    Real-time Dashboard
                  </h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm control-room-text-bright">Overall Wellbeing</span>
                      <span className="text-sm font-bold control-room-text-bright">85</span>
                    </div>
                    <div className="w-full h-2.5 bg-[var(--bar-track)] rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: '85%' }}
                        transition={{ duration: 1, delay: 0.3 }}
                        className="h-full rounded-full bg-gradient-to-r from-[#2d6785] to-[#3d8a9e]"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm control-room-text-bright">Participation Rate</span>
                      <span className="text-sm font-bold control-room-text-bright">92%</span>
                    </div>
                    <div className="w-full h-2.5 bg-[var(--bar-track)] rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: '92%' }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="h-full rounded-full bg-gradient-to-r from-[#2d6785] to-[#3d8a9e]"
                      />
                    </div>
                  </div>
                </div>
                <div className="pt-4 border-t border-[var(--stroke-soft)]">
                  <div className="flex items-center gap-2 text-xs control-room-text-muted">
                    <TrendingUp size={14} />
                    <span>Improving trend over last 6 periods</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="control-room-card p-12 text-center bg-gradient-to-br from-[#2d6785]/20 via-transparent to-[#d97036]/10 border-2 border-[#2d6785]/30"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[#0B1B2B] mb-4">
              Ready to Transform Your Workplace?
            </h2>
            <p className="text-lg text-[#5c6370] mb-8 max-w-2xl mx-auto">
              Start monitoring psychological safety today and make data-driven decisions 
              that protect your people and improve outcomes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-[#2d6785] to-[#3d8a9e] text-white font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
              >
                Schedule a Demo
                <ArrowRight size={20} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 rounded-xl bg-white border-2 border-[#2d6785] text-[#2d6785] font-semibold hover:bg-[#2d6785]/5 transition-all"
              >
                Contact Sales
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
