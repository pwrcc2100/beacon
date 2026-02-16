'use client';
import React from 'react';

export default function Home() {
  return (
    <main className="flex flex-col items-center text-gray-800">
      {/* Hero Section */}
      <section className="w-full bg-gradient-to-b from-blue-900 to-blue-800 text-white py-24 px-6 text-center">
        <h1 className="text-4xl md:text-6xl font-semibold mb-6">
          A Safer, Stronger Workweek for Every Team
        </h1>
        <p className="max-w-2xl mx-auto text-lg mb-10 text-blue-100">
          Beacon Index helps organisations detect and manage psychosocial risks before
          they affect wellbeing, performance, or compliance.
        </p>
        <div className="flex gap-4 justify-center">
          <a
            href="mailto:peta@beaconeffect.com.au?subject=Beacon%20Index%20Demo%20Request"
            className="bg-yellow-400 text-black px-6 py-3 font-semibold rounded-lg hover:bg-yellow-300 transition"
          >
            See Beacon in Action
          </a>
          <a
            href="mailto:peta@beaconeffect.com.au?subject=Beacon%20Index%20Pilot%20Enquiry"
            className="border border-white px-6 py-3 font-semibold rounded-lg hover:bg-white hover:text-blue-900 transition"
          >
            Pilot Beacon
          </a>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-6xl py-20 px-6 grid md:grid-cols-3 gap-10 text-center">
        <div>
          <h3 className="text-xl font-semibold mb-2">Visibility of Risk Indicators</h3>
          <p className="text-gray-600">
            Spot psychosocial stress signals early with automated dashboards and weekly sentiment data.
          </p>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2">Meaningful Support</h3>
          <p className="text-gray-600">
            Private first support chat activates instantly whenever an employee indicates they're struggling.
          </p>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2">Continuous Feedback Loop</h3>
          <p className="text-gray-600">
            Weekly insights guide leaders to act compassionately and proactively, before risks escalate.
          </p>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="w-full bg-gray-50 py-20 px-6 text-center">
        <h2 className="text-3xl font-semibold mb-10">Why Teams Choose Beacon</h2>
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 text-left">
          <div className="p-6 bg-white rounded-lg shadow-sm">
            <h4 className="font-semibold mb-2">Lower Psychosocial Risk</h4>
            <p>Meet ISO 45003 and WHS requirements confidently while protecting employee wellbeing.</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-sm">
            <h4 className="font-semibold mb-2">Higher Team Stability</h4>
            <p>Reduce stress-related turnover and keep teams focused on consistent high performance.</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-sm">
            <h4 className="font-semibold mb-2">Smarter Leadership Decisions</h4>
            <p>Empower executives with real-time psychosocial indicators that support transparent culture change.</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-sm">
            <h4 className="font-semibold mb-2">Early Warning System</h4>
            <p>Get ahead of risk trends — detect workload pressure, fatigue, and morale drops before escalation.</p>
          </div>
        </div>
      </section>

      {/* Pricing / CTA */}
      <section className="max-w-5xl py-24 px-6 text-center">
        <h2 className="text-3xl font-semibold mb-4">Pilot Beacon in Your Organisation</h2>
        <p className="max-w-2xl mx-auto text-gray-600 mb-10">
          One predictable cost. No surprises. Get your team's psychosocial safety index up and running in under four weeks.
        </p>
        <div className="flex flex-col md:flex-row gap-6 justify-center">
          <div className="bg-blue-50 rounded-lg p-8 w-full md:w-1/3">
            <h3 className="text-2xl font-semibold mb-2">$7,000</h3>
            <p className="text-gray-600 mb-4">3‑Month Pilot</p>
            <p className="text-sm text-gray-500 mb-6">Includes weekly reporting and advisory review.</p>
            <a
              href="mailto:peta@beaconeffect.com.au?subject=Beacon%20Index%20Pilot%20Enquiry"
              className="inline-block bg-blue-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-800 transition"
            >
              Start Pilot
            </a>
          </div>
          <div className="bg-yellow-50 rounded-lg p-8 w-full md:w-1/3">
            <h3 className="text-2xl font-semibold mb-2">$5,000</h3>
            <p className="text-gray-600 mb-4">Per Quarter (Beyond Pilot)</p>
            <p className="text-sm text-gray-500 mb-6">Scalable to large teams and enterprise rollouts.</p>
            <a
              href="mailto:peta@beaconeffect.com.au?subject=Beacon%20Index%20Advisory%20Enquiry"
              className="inline-block bg-yellow-400 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition"
            >
              Talk to Advisory
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full bg-blue-900 py-12 text-blue-100 text-center">
        <p className="mb-4 text-lg font-semibold">Beacon Index — Measuring What Matters for Safer Workplaces</p>
        <p className="text-sm text-blue-300">
          © {new Date().getFullYear()} Beacon Advisory. All rights reserved.
        </p>
      </footer>
    </main>
  );
}
