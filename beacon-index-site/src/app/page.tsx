export default function Home() {
  return (
    <div className="min-h-screen bg-[#f8f9fb] text-[#1c1f26]">
      <main className="max-w-[900px] mx-auto px-5 py-20">
        {/* Hero */}
        <section>
          <h1 className="text-[42px] font-normal mb-5 leading-tight">
            Psychosocial Risk Is a Governance Responsibility.
          </h1>
          <p className="text-lg mb-5">
            Beacon Index provides structured, system-level visibility of psychosocial risk — 
            enabling early detection, defensible oversight, and proportionate action.
          </p>
          <p className="text-lg mb-5 italic">
            Aligned to ISO 45003 principles and contemporary WHS psychosocial risk expectations.
          </p>
          <div className="mt-5">
            <a
              href="#methodology"
              className="inline-block mt-5 mr-4 px-6 py-3 bg-[#1c2b45] text-white text-base hover:opacity-90 transition"
            >
              Executive Overview
            </a>
            <a
              href="mailto:peta@beaconeffect.com.au?subject=Beacon%20Index%20Governance%20Validation%20Pilot%20Discussion"
              className="inline-block mt-5 mr-4 px-6 py-3 bg-[#1c2b45] text-white text-base hover:opacity-90 transition"
            >
              Request Discussion
            </a>
          </div>
        </section>

        <div className="border-t border-gray-300 my-20"></div>

        {/* The Visibility Gap */}
        <section>
          <h2 className="text-[28px] mt-20 mb-5 font-normal">The Visibility Gap</h2>
          <p className="text-lg mb-5">
            Most organisations detect psychosocial strain after escalation — through complaints, 
            attrition, conflict, or claims.
          </p>
          <p className="text-lg mb-5">
            By the time psychosocial risk becomes visible, damage is already underway.
          </p>
          <p className="text-lg mb-5">
            Beacon Index closes the visibility gap through continuous, structured monitoring 
            embedded within existing WHS governance.
          </p>
        </section>

        <div className="border-t border-gray-300 my-20"></div>

        {/* What Beacon Index Is */}
        <section>
          <h2 className="text-[28px] mt-20 mb-5 font-normal">What Beacon Index Is</h2>
          <ul className="my-5 pl-5">
            <li className="mb-2.5 text-lg">A continuous psychosocial risk diagnostic</li>
            <li className="mb-2.5 text-lg">Embedded within WHS governance frameworks</li>
            <li className="mb-2.5 text-lg">Calibrated for early strain detection</li>
            <li className="mb-2.5 text-lg">Designed for executive oversight</li>
          </ul>
          <p className="text-lg mb-5 font-semibold">It is not:</p>
          <ul className="my-5 pl-5">
            <li className="mb-2.5 text-lg">An engagement survey</li>
            <li className="mb-2.5 text-lg">A culture sentiment tracker</li>
            <li className="mb-2.5 text-lg">An employee wellbeing application</li>
          </ul>
        </section>

        <div className="border-t border-gray-300 my-20"></div>

        {/* Methodology */}
        <section id="methodology">
          <h2 className="text-[28px] mt-20 mb-5 font-normal">Methodology</h2>
          <p className="text-lg mb-5">
            Beacon Index measures psychosocial risk exposure at system level. 
            It is calibrated for early strain detection and structured governance oversight — 
            not employee sentiment tracking.
          </p>

          <h3 className="text-xl mt-10 font-normal">Domains & Weighting</h3>
          <p className="text-lg mb-5">
            The Index aggregates five calibrated psychosocial risk domains aligned to ISO 45003 hazard categories.
            Each domain contributes to a weighted composite score, producing a structured 0–100 organisational index.
          </p>
          <p className="text-lg mb-5">
            Core domain weighting methodology remains fixed to preserve scientific integrity and cross-client comparability.
          </p>

          <h3 className="text-xl mt-10 font-normal">Trend Modelling</h3>
          <p className="text-lg mb-5">
            Sustained movement across reporting cycles carries greater governance significance than 
            single-period fluctuation.
          </p>
          <p className="text-lg mb-5">
            Multi-cycle trend modelling supports early identification of structural strain before escalation.
          </p>

          <h3 className="text-xl mt-10 font-normal">Regulatory Alignment</h3>
          <ul className="my-5 pl-5">
            <li className="mb-2.5 text-lg">ISO 45003 psychosocial risk principles</li>
            <li className="mb-2.5 text-lg">Contemporary WHS psychosocial hazard obligations</li>
            <li className="mb-2.5 text-lg">Structured consultation monitoring expectations</li>
          </ul>
        </section>

        <div className="border-t border-gray-300 my-20"></div>

        {/* Governance Calibration */}
        <section>
          <h2 className="text-[28px] mt-20 mb-5 font-normal">Governance Calibration</h2>
          <h3 className="text-xl mt-10 font-normal">Default Risk Bands</h3>
          <p className="text-lg mb-5">
            <strong>≥ 80</strong> — Low Psychosocial Risk<br />
            Healthy operating conditions. Standard governance monitoring.
          </p>
          <p className="text-lg mb-5">
            <strong>70–79</strong> — Within Tolerance<br />
            Acceptable risk exposure. Trend review required.
          </p>
          <p className="text-lg mb-5">
            <strong>60–69</strong> — Emerging Risk<br />
            Early structural strain indicators. Targeted review recommended.
          </p>
          <p className="text-lg mb-5">
            <strong>&lt; 60</strong> — Elevated Risk<br />
            Sustained systemic strain. Structured intervention required.
          </p>

          <h3 className="text-xl mt-10 font-normal">Calibration Framework</h3>
          <p className="text-lg mb-5">
            Default thresholds are evidence-calibrated. Organisations may adjust tolerance bands 
            within defined governance parameters.
          </p>
          <p className="text-lg mb-5">
            Executive calibration settings are formally documented. 
            Core weighting methodology remains fixed.
          </p>
          <p className="text-lg mb-5">
            The objective is proportionate response — not alarm.
          </p>
        </section>

        <div className="border-t border-gray-300 my-20"></div>

        {/* Governance Validation Pilot */}
        <section id="pilot">
          <h2 className="text-[28px] mt-20 mb-5 font-normal">Governance Validation Pilot</h2>
          <p className="text-lg mb-5">
            The Beacon Index Governance Validation Pilot is a structured 8-week calibration 
            and oversight validation phase.
          </p>
          <p className="text-lg mb-5 font-semibold">It is not a software trial.</p>
          <p className="text-lg mb-5">
            It is a controlled governance implementation designed to establish structured 
            psychosocial risk monitoring.
          </p>

          <h3 className="text-xl mt-10 font-normal">Pilot Includes</h3>
          <ul className="my-5 pl-5">
            <li className="mb-2.5 text-lg">Evidence-based baseline index deployment</li>
            <li className="mb-2.5 text-lg">Executive calibration workshop</li>
            <li className="mb-2.5 text-lg">2–4 reporting cycles with trend modelling</li>
            <li className="mb-2.5 text-lg">Governance threshold documentation</li>
            <li className="mb-2.5 text-lg">Escalation framework validation</li>
            <li className="mb-2.5 text-lg">Board-ready summary report</li>
          </ul>

          <h3 className="text-xl mt-10 font-normal">Investment</h3>
          <p className="text-lg mb-5">
            Governance Validation Pilot<br />
            $28,000 – $38,000 AUD (Fixed Fee)
          </p>
          <p className="text-lg mb-5">
            We are onboarding a limited number of foundation governance pilots.
          </p>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-[120px] py-[60px] px-5 bg-[#1c2b45] text-white text-center text-lg">
        Structured data. Early signals. Defensible governance insight.
      </footer>
    </div>
  );
}
