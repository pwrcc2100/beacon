export default function Home() {
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      
      <style dangerouslySetInnerHTML={{ __html: `
        :root{
          --ink: #0B1220;
          --navy: #0E1B2E;
          --muted-teal: #2A8C8A;
          --teal-soft: rgba(42, 140, 138, 0.18);
          --teal-glow: rgba(42, 140, 138, 0.28);
          --paper: #FFFFFF;
          --paper-tint: #F6FAFA;
          --line: rgba(14, 27, 46, 0.14);
          --shadow: 0 10px 30px rgba(11, 18, 32, 0.10);
          --radius: 18px;
        }

        .beacon-hero{
          position: relative;
          overflow: hidden;
          background: linear-gradient(180deg, var(--paper-tint) 0%, var(--paper) 55%);
          border: 1px solid var(--line);
          border-radius: calc(var(--radius) + 6px);
          box-shadow: var(--shadow);
          max-width: 1200px;
          margin: 40px auto;
        }

        .beacon-hero__inner{
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 28px;
          padding: clamp(28px, 4vw, 56px);
          align-items: center;
        }

        @media (max-width: 900px){
          .beacon-hero__inner{
            grid-template-columns: 1fr;
          }
          .beacon-hero__visual{
            order: -1;
          }
        }

        .beacon-hero::before{
          content:"";
          position:absolute;
          inset:-120px -120px auto auto;
          width: 560px;
          height: 560px;
          background: radial-gradient(circle at 40% 40%, var(--teal-glow) 0%, rgba(42,140,138,0.08) 35%, rgba(255,255,255,0) 70%);
          filter: blur(2px);
          pointer-events:none;
        }

        .beacon-hero::after{
          content:"";
          position:absolute;
          right: 18px;
          bottom: 14px;
          width: 180px;
          height: 180px;
          background-image: url("/assets/Beaconlogo.png");
          background-repeat: no-repeat;
          background-size: contain;
          background-position: bottom right;
          opacity: 0.06;
          filter: grayscale(100%) contrast(90%);
          pointer-events:none;
        }

        .beacon-hero h1{
          margin: 0 0 12px 0;
          color: var(--ink);
          letter-spacing: -0.02em;
          line-height: 1.02;
          font-size: clamp(34px, 4vw, 56px);
          font-family: Georgia, "Times New Roman", serif;
        }

        .beacon-hero p{
          margin: 0 0 18px 0;
          color: rgba(11, 18, 32, 0.78);
          font-size: 18px;
          line-height: 1.55;
          max-width: 60ch;
        }

        .beacon-hero__kicker{
          display: inline-flex;
          align-items:center;
          gap: 10px;
          padding: 8px 12px;
          border-radius: 999px;
          border: 1px solid rgba(42,140,138,0.24);
          background: rgba(42,140,138,0.08);
          color: rgba(11, 18, 32, 0.80);
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.02em;
          margin-bottom: 14px;
        }

        .beacon-dot{
          width: 10px;
          height: 10px;
          border-radius: 999px;
          background: var(--muted-teal);
          box-shadow: 0 0 0 6px rgba(42,140,138,0.14);
        }

        .signal-line{
          position: relative;
          height: 2px;
          width: min(520px, 92%);
          background: linear-gradient(90deg, rgba(14,27,46,0.16), rgba(42,140,138,0.55), rgba(14,27,46,0.16));
          border-radius: 999px;
          margin: 10px 0 18px 0;
          overflow: hidden;
        }

        .signal-line::after{
          content:"";
          position:absolute;
          top: 50%;
          transform: translateY(-50%);
          left: -18%;
          width: 18%;
          height: 8px;
          background: radial-gradient(circle, rgba(42,140,138,0.65) 0%, rgba(42,140,138,0.10) 55%, rgba(42,140,138,0) 70%);
          filter: blur(0.2px);
          animation: signal-sweep 3.2s ease-in-out infinite;
          opacity: 0.9;
        }

        @keyframes signal-sweep{
          0%   { left: -20%; opacity: 0.0; }
          10%  { opacity: 0.9; }
          55%  { opacity: 0.9; }
          100% { left: 110%; opacity: 0.0; }
        }

        .beacon-actions{
          display:flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-top: 8px;
        }

        .btn{
          appearance:none;
          border: 1px solid rgba(14,27,46,0.18);
          background: var(--paper);
          color: var(--ink);
          padding: 10px 14px;
          border-radius: 12px;
          font-weight: 700;
          font-size: 14px;
          cursor:pointer;
          text-decoration:none;
          display:inline-flex;
          align-items:center;
          gap: 10px;
        }

        .btn--primary{
          background: rgba(42,140,138,0.12);
          border-color: rgba(42,140,138,0.30);
        }

        .btn:hover{
          transform: translateY(-1px);
          box-shadow: 0 10px 20px rgba(11,18,32,0.08);
        }

        .beacon-hero__visual{
          display:flex;
          justify-content: flex-end;
        }

        .scorecard{
          width: min(360px, 100%);
          background: linear-gradient(180deg, #FFFFFF 0%, #FBFEFE 100%);
          border: 1px solid rgba(14,27,46,0.14);
          border-radius: 20px;
          box-shadow: 0 14px 34px rgba(11,18,32,0.10);
          padding: 18px;
          position: relative;
        }

        .scorecard__title{
          font-size: 12px;
          letter-spacing: 0.12em;
          font-weight: 800;
          color: rgba(11,18,32,0.58);
          text-transform: uppercase;
          margin: 2px 0 14px 0;
        }

        .scorecard__value{
          font-size: 86px;
          line-height: 0.92;
          font-weight: 900;
          letter-spacing: -0.03em;
          color: var(--navy);
          margin: 0 0 8px 0;
        }

        .scorecard__rule{
          height: 3px;
          width: 64px;
          background: var(--muted-teal);
          border-radius: 999px;
          margin: 8px 0 14px 2px;
          opacity: 0.85;
        }

        .scorecard__meta{
          display:grid;
          gap: 8px;
          font-size: 16px;
          color: rgba(11,18,32,0.72);
        }

        .scorecard__meta b{
          color: rgba(11,18,32,0.90);
        }

        .trend{
          display:inline-flex;
          align-items:center;
          gap: 8px;
          font-weight: 800;
          color: var(--navy);
        }

        .trend__arrow{
          width: 10px; height: 10px;
          border-right: 3px solid var(--muted-teal);
          border-top: 3px solid var(--muted-teal);
          transform: rotate(-45deg);
          margin-top: 2px;
        }

        @media (prefers-reduced-motion: reduce){
          .signal-line::after{ animation: none; }
          .btn:hover{ transform: none; }
        }
      `}} />
      
      <div style={{ fontFamily: 'ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif', lineHeight: 1.6, color: '#2E4057', background: '#ffffff' }}>
        
        {/* HERO */}
        <section className="beacon-hero" aria-label="Beacon Index hero">
          <div className="beacon-hero__inner">
            <div className="beacon-hero__copy">
              <div className="beacon-hero__kicker">
                <span className="beacon-dot" aria-hidden="true"></span>
                Serious governance instrument • early strain detection
              </div>

              <h1>Psychosocial risk is a governance responsibility — not a sentiment metric.</h1>

              <div className="signal-line" aria-hidden="true"></div>

              <p>
                Beacon Index makes psychosocial risk visible at system level, with calibrated domains,
                defensible thresholds, and trend oversight designed for WHS governance.
              </p>

              <div className="beacon-actions">
                <a className="btn btn--primary" href="#methodology">Methodology</a>
                <a className="btn" href="#governance">Governance calibration</a>
                <a className="btn" href="#pilot">Pilot overview</a>
              </div>
            </div>

            <div className="beacon-hero__visual">
              <div className="scorecard" role="img" aria-label="Beacon Index scorecard example">
                <div className="scorecard__title">Beacon Index Score</div>
                <div className="scorecard__value">74</div>
                <div className="scorecard__rule"></div>
                <div className="scorecard__meta">
                  <div><b>Status:</b> Within risk tolerance</div>
                  <div><b>Trend:</b> <span className="trend"><span className="trend__arrow" aria-hidden="true"></span>1.2%</span></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* THE VISIBILITY GAP */}
        <section style={{ backgroundColor: '#F3F7FB', padding: '64px 0' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px' }}>
            <h2 style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontSize: '32px', fontWeight: 600, color: '#0B1B2B', marginBottom: '24px', lineHeight: 1.2 }}>
              The Visibility Gap
            </h2>
            <p style={{ marginBottom: '16px', fontSize: '17px' }}>
              Most organisations detect psychosocial risk after escalation — through complaints, conflict, attrition, or claims.
            </p>
            <p style={{ marginBottom: '16px', fontSize: '17px' }}>
              WHS expectations require ongoing identification, monitoring, and response. Reactive detection undermines duty of care and exposes organisations to regulatory scrutiny.
            </p>
            <p style={{ marginBottom: '16px', fontSize: '17px' }}>
              Beacon Index provides structured, continuous visibility suitable for governance reporting — closing the gap between obligation and operational reality.
            </p>
          </div>
        </section>

        {/* METHODOLOGY */}
        <section id="methodology" style={{ padding: '64px 0' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px' }}>
            <h2 style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontSize: '32px', fontWeight: 600, color: '#0B1B2B', marginBottom: '24px', lineHeight: 1.2 }}>
              Methodology (in brief)
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginTop: '32px' }}>
              <div style={{ border: '1px solid #D7E0E8', padding: '24px', background: '#ffffff' }}>
                <h3 style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontSize: '18px', fontWeight: 600, color: '#0B1B2B', marginBottom: '16px', lineHeight: 1.2 }}>
                  Domains & Weighting
                </h3>
                <ul style={{ margin: 0, paddingLeft: '20px' }}>
                  <li style={{ fontSize: '15px', marginBottom: '8px' }}>Five calibrated ISO 45003-aligned domains</li>
                  <li style={{ fontSize: '15px', marginBottom: '8px' }}>Weighted composite scoring (0–100)</li>
                  <li style={{ fontSize: '15px', marginBottom: '8px' }}>System-level conditions, not individual sentiment</li>
                </ul>
              </div>
              <div style={{ border: '1px solid #D7E0E8', padding: '24px', background: '#ffffff' }}>
                <h3 style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontSize: '18px', fontWeight: 600, color: '#0B1B2B', marginBottom: '16px', lineHeight: 1.2 }}>
                  De-identification & Anonymity
                </h3>
                <ul style={{ margin: 0, paddingLeft: '20px' }}>
                  <li style={{ fontSize: '15px', marginBottom: '8px' }}>Team-level aggregation minimum thresholds</li>
                  <li style={{ fontSize: '15px', marginBottom: '8px' }}>Individual responses not identifiable</li>
                  <li style={{ fontSize: '15px', marginBottom: '8px' }}>Threshold protections maintained across reporting cycles</li>
                </ul>
              </div>
              <div style={{ border: '1px solid #D7E0E8', padding: '24px', background: '#ffffff' }}>
                <h3 style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontSize: '18px', fontWeight: 600, color: '#0B1B2B', marginBottom: '16px', lineHeight: 1.2 }}>
                  Trend Modelling & Stability
                </h3>
                <ul style={{ margin: 0, paddingLeft: '20px' }}>
                  <li style={{ fontSize: '15px', marginBottom: '8px' }}>Multi-cycle trend analysis prioritised</li>
                  <li style={{ fontSize: '15px', marginBottom: '8px' }}>Single-week volatility smoothed</li>
                  <li style={{ fontSize: '15px', marginBottom: '8px' }}>Sustained movement signals governance significance</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* OPERATIONAL DESIGN */}
        <section style={{ backgroundColor: '#F3F7FB', padding: '70px 20px' }}>
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <h2 style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontSize: '28px', fontWeight: 600, color: '#0B1B2B', marginBottom: '20px', lineHeight: 1.2 }}>
              Operational Design
            </h2>
            <p style={{ fontSize: '18px', color: '#2E4057', maxWidth: '760px', marginBottom: '16px' }}>
              Beacon Index is intentionally lightweight at the point of employee interaction,
              while maintaining rigorous governance modelling behind the scenes.
            </p>
            <div style={{ marginTop: '35px', border: '1px solid #D7E0E8', padding: '30px', backgroundColor: '#ffffff' }}>
              <ul style={{ fontSize: '17px', lineHeight: 1.6, paddingLeft: '20px', margin: 0 }}>
                <li style={{ marginBottom: '10px' }}>Five calibrated system-level indicators</li>
                <li style={{ marginBottom: '10px' }}>Mobile-first delivery (typically &lt; 60 seconds to complete)</li>
                <li style={{ marginBottom: '10px' }}>Team-level de-identification and anonymity thresholds</li>
                <li style={{ marginBottom: '10px' }}>Trend-weighted composite scoring (0–100 index)</li>
                <li style={{ marginBottom: 0 }}>Embedded support pathways activated where elevated risk patterns are detected</li>
              </ul>
            </div>
            <p style={{ marginTop: '25px', fontSize: '16px', color: '#2E4057', maxWidth: '760px' }}>
              The employee experience remains simple.  
              The governance intelligence sits within the composite modelling,
              stability analysis, and escalation logic.
            </p>
          </div>
        </section>

        {/* GOVERNANCE CALIBRATION */}
        <section id="governance" style={{ padding: '64px 0' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px' }}>
            <h2 style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontSize: '32px', fontWeight: 600, color: '#0B1B2B', marginBottom: '24px', lineHeight: 1.2 }}>
              Governance Risk Bands (Default)
            </h2>
            <table style={{ width: '100%', borderCollapse: 'collapse', margin: '24px 0' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #0B1B2B' }}>
                  <th style={{ textAlign: 'left', padding: '14px 16px', fontWeight: 600, fontSize: '15px' }}>Score Band</th>
                  <th style={{ textAlign: 'left', padding: '14px 16px', fontWeight: 600, fontSize: '15px' }}>Classification</th>
                  <th style={{ textAlign: 'left', padding: '14px 16px', fontWeight: 600, fontSize: '15px' }}>Governance Response</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderLeft: '4px solid #2F6F7E', borderBottom: '1px solid #D7E0E8' }}>
                  <td style={{ padding: '14px 16px', fontSize: '15px', fontWeight: 600, fontFamily: 'Georgia, serif' }}>≥ 80</td>
                  <td style={{ padding: '14px 16px', fontSize: '15px' }}>Low risk</td>
                  <td style={{ padding: '14px 16px', fontSize: '15px' }}>Standard monitoring</td>
                </tr>
                <tr style={{ borderLeft: '4px solid #4C6A88', borderBottom: '1px solid #D7E0E8' }}>
                  <td style={{ padding: '14px 16px', fontSize: '15px', fontWeight: 600, fontFamily: 'Georgia, serif' }}>70–79</td>
                  <td style={{ padding: '14px 16px', fontSize: '15px' }}>Within tolerance</td>
                  <td style={{ padding: '14px 16px', fontSize: '15px' }}>Trend review</td>
                </tr>
                <tr style={{ borderLeft: '4px solid #A87B2F', borderBottom: '1px solid #D7E0E8' }}>
                  <td style={{ padding: '14px 16px', fontSize: '15px', fontWeight: 600, fontFamily: 'Georgia, serif' }}>60–69</td>
                  <td style={{ padding: '14px 16px', fontSize: '15px' }}>Emerging risk</td>
                  <td style={{ padding: '14px 16px', fontSize: '15px' }}>Targeted review</td>
                </tr>
                <tr style={{ borderLeft: '4px solid #8A3A3A', borderBottom: '1px solid #D7E0E8' }}>
                  <td style={{ padding: '14px 16px', fontSize: '15px', fontWeight: 600, fontFamily: 'Georgia, serif' }}>&lt; 60</td>
                  <td style={{ padding: '14px 16px', fontSize: '15px' }}>Elevated risk</td>
                  <td style={{ padding: '14px 16px', fontSize: '15px' }}>Structured intervention</td>
                </tr>
              </tbody>
            </table>
            <div style={{ fontSize: '14px', lineHeight: 1.6, color: '#2E4057', marginTop: '16px' }}>
              Default thresholds are evidence-calibrated. Organisations can adjust tolerance bands within defined governance parameters. Core domain weighting remains fixed.
            </div>
          </div>
        </section>

        {/* PILOT OVERVIEW */}
        <section id="pilot" style={{ backgroundColor: '#F3F7FB', padding: '64px 0' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px' }}>
            <h2 style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontSize: '32px', fontWeight: 600, color: '#0B1B2B', marginBottom: '24px', lineHeight: 1.2 }}>
              Pilot (Governance Validation)
            </h2>
            <p style={{ marginBottom: '16px', fontSize: '17px' }}>
              <strong>This is a governance validation pilot — not a software trial.</strong>
            </p>
            <ul style={{ margin: '16px 0', paddingLeft: '24px' }}>
              <li style={{ marginBottom: '10px', fontSize: '16px' }}>6–8 weeks</li>
              <li style={{ marginBottom: '10px', fontSize: '16px' }}>Baseline deployment + calibration workshop</li>
              <li style={{ marginBottom: '10px', fontSize: '16px' }}>Weekly reporting cycles with trend review</li>
              <li style={{ marginBottom: '10px', fontSize: '16px' }}>Escalation logic validation</li>
              <li style={{ marginBottom: '10px', fontSize: '16px' }}>Board-ready summary and recommendations</li>
            </ul>
            <div style={{ marginTop: '32px' }}>
              <a href="#contact" style={{ display: 'inline-block', padding: '14px 32px', backgroundColor: '#2F6F7E', color: '#ffffff', textDecoration: 'none', fontWeight: 500, fontSize: '16px' }}>
                Request pilot pack
              </a>
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" style={{ backgroundColor: '#F3F7FB', padding: '48px 24px', textAlign: 'center', borderTop: '1px solid #D7E0E8' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px' }}>
            <h3 style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontSize: '20px', fontWeight: 600, color: '#0B1B2B', marginBottom: '16px', lineHeight: 1.2 }}>
              Contact
            </h3>
            <p style={{ marginBottom: '16px', fontSize: '17px' }}>
              Request the executive pack, pilot overview, or methodology summary.<br />
              <a href="mailto:hello@beaconeffect.com.au" style={{ color: '#2F6F7E', textDecoration: 'none', fontWeight: 500 }}>
                hello@beaconeffect.com.au
              </a>
            </p>
          </div>
        </section>

        {/* FOOTER */}
        <footer style={{ backgroundColor: '#0B1B2B', color: '#ffffff', padding: '48px 24px', textAlign: 'center' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px' }}>
            <p style={{ fontSize: '18px', marginBottom: '24px', color: '#D7E0E8' }}>
              Structured data. Early signals. Defensible governance insight.
            </p>
            <a href="#contact" style={{ display: 'inline-block', padding: '14px 32px', backgroundColor: '#2F6F7E', color: '#ffffff', textDecoration: 'none', fontWeight: 500, fontSize: '16px' }}>
              Request Executive Overview
            </a>
            <p style={{ marginTop: '32px', fontSize: '13px', color: '#D7E0E8', opacity: 0.8 }}>
              © Beacon Effect
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
