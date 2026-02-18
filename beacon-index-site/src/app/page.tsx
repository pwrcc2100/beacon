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

        .section {
          padding: 100px 0;
        }

        .container {
          max-width: 1160px;
          margin: 0 auto;
          padding: 0 24px;
        }

        .section-alt {
          background: #f4f7f6;
        }

        .hero {
          padding-top: 140px;
          padding-bottom: 120px;
        }

        .hero-inner {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 60px;
          align-items: center;
        }

        @media (max-width: 900px){
          .hero-inner {
            grid-template-columns: 1fr;
            gap: 40px;
          }
          .hero-right {
            order: -1;
          }
        }

        .hero-tag {
          display: inline-block;
          font-size: 13px;
          color: #5b6670;
          margin-bottom: 20px;
          font-weight: 500;
        }

        .hero-left h1 {
          font-size: 44px;
          line-height: 1.2;
          margin-bottom: 24px;
          font-family: Georgia, "Times New Roman", serif;
          color: #0B1B2B;
        }

        .hero-subtext {
          font-size: 18px;
          color: #5b6670;
          max-width: 600px;
          line-height: 1.6;
          margin-bottom: 32px;
        }

        .hero-buttons {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .btn-primary, .btn-secondary {
          padding: 12px 24px;
          border-radius: 8px;
          text-decoration: none;
          font-size: 15px;
          font-weight: 600;
          transition: all 0.2s;
        }

        .btn-primary {
          background: #2f7f7b;
          color: #ffffff;
          border: 1px solid #2f7f7b;
        }

        .btn-primary:hover {
          background: #276b68;
        }

        .btn-secondary {
          background: transparent;
          color: #2f7f7b;
          border: 1px solid #d7e0e8;
        }

        .btn-secondary:hover {
          border-color: #2f7f7b;
          background: rgba(47, 127, 123, 0.05);
        }

        .score-card {
          background: #ffffff;
          border: 1px solid #e0e5e8;
          border-top: 4px solid #2f7f7b;
          border-radius: 12px;
          padding: 32px;
          text-align: center;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
        }

        .score-label {
          font-size: 11px;
          letter-spacing: 1.2px;
          text-transform: uppercase;
          color: #5b6670;
          margin-bottom: 16px;
          font-weight: 700;
        }

        .score-number {
          font-size: 72px;
          font-weight: 700;
          color: #0B1B2B;
          line-height: 1;
          margin-bottom: 16px;
          font-family: Georgia, "Times New Roman", serif;
        }

        .score-meta {
          font-size: 14px;
          color: #5b6670;
          line-height: 1.8;
        }

        @media (prefers-reduced-motion: reduce){
          .btn-primary:hover, .btn-secondary:hover { transform: none; }
        }

        .two-column {
          display: flex;
          gap: 60px;
          align-items: center;
          justify-content: space-between;
        }

        @media (max-width: 900px){
          .two-column {
            flex-direction: column;
            gap: 40px;
          }
        }

        .two-column h2 {
          font-size: 32px;
          margin-bottom: 24px;
          font-family: Georgia, "Times New Roman", serif;
          color: #0B1B2B;
          font-weight: 600;
        }

        .two-column p {
          margin-bottom: 18px;
          color: #2E4057;
          line-height: 1.6;
          font-size: 17px;
        }

        .micro-note {
          color: #5a6b6b;
          font-size: 14px;
          font-style: italic;
          margin-top: 24px;
        }

        .demo-card {
          background: #ffffff;
          padding: 32px;
          border-radius: 14px;
          box-shadow: 0 8px 30px rgba(0,0,0,0.06);
          border-top: 4px solid #2f7f7b;
          text-align: center;
          min-width: 320px;
        }

        .demo-card h3 {
          font-size: 20px;
          margin: 16px 0 12px;
          color: #0B1B2B;
          font-family: Georgia, "Times New Roman", serif;
          font-weight: 600;
        }

        .demo-card p {
          font-size: 15px;
          color: #2E4057;
          margin-bottom: 0;
        }

        .demo-badge {
          display: inline-block;
          font-size: 12px;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: #2f7f7b;
          margin-bottom: 12px;
        }

        .demo-card .signal-line {
          height: 3px;
          width: 60px;
          background: linear-gradient(90deg, #2f7f7b, #6db4b0);
          margin: 16px auto 0;
          border-radius: 2px;
        }

        @media (prefers-reduced-motion: reduce){
          .signal-line::after { animation: none; }
        }
      `}} />
      
      <div style={{ fontFamily: 'ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif', lineHeight: 1.6, color: '#2E4057', background: '#ffffff' }}>
        
        {/* HERO */}
        <section className="section hero">
          <div className="container hero-inner">
            <div className="hero-left">
              <div className="hero-tag">
                Serious governance instrument · Early strain detection
              </div>

              <h1>
                Psychosocial risk is a governance responsibility — not a sentiment metric.
              </h1>

              <p className="hero-subtext">
                Beacon Index makes psychosocial risk visible at system level, 
                with calibrated domains, defensible thresholds, and trend oversight 
                designed for WHS governance.
              </p>

              <div className="hero-buttons">
                <a href="#methodology" className="btn-primary">Methodology</a>
                <a href="#governance" className="btn-secondary">Governance calibration</a>
                <a href="#pilot" className="btn-secondary">Pilot overview</a>
              </div>
            </div>

            <div className="hero-right">
              <div className="score-card">
                <div className="score-label">BEACON INDEX SCORE</div>
                <div className="score-number">74</div>
                <div className="score-meta">
                  Status: Within risk tolerance<br />
                  Trend: ↑ 1.2%
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* THE VISIBILITY GAP */}
        <section className="section section-alt">
          <div className="container">
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

        {/* EXECUTIVE EXPERIENCE */}
        <section className="section section-alt">
          <div className="container two-column">
            <div>
              <h2>See It in 60 Seconds</h2>
              <p>
                Beacon Index is intentionally simple at the point of interaction.
                Five calibrated system-level questions. Mobile-first.
                Typically completed in under one minute.
              </p>
              <p>
                In executive briefings, leaders scan a QR code,
                complete the questions live,
                and immediately view the composite governance score
                within the calibrated risk bands.
              </p>
              <p>
                The simplicity at the surface contrasts with the modelling beneath —
                weighted domain scoring, stability logic, de-identification thresholds,
                and escalation triggers are applied automatically.
              </p>
              <p className="micro-note">
                Designed for governance validation — not employee sentiment tracking.
              </p>
            </div>

            <div className="demo-card">
              <div className="demo-badge">LIVE GOVERNANCE DEMONSTRATION</div>
              <h3>Scan → Respond → View</h3>
              <p>Composite score appears instantly within calibrated risk bands.</p>
              <div className="signal-line"></div>
            </div>
          </div>
        </section>

        {/* METHODOLOGY */}
        <section id="methodology" className="section">
          <div className="container">
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
        <section className="section section-alt">
          <div className="container">
            <h2 style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontSize: '28px', fontWeight: 600, color: '#0B1B2B', marginBottom: '20px', lineHeight: 1.2 }}>
              Operational Design
            </h2>
            <p style={{ fontSize: '18px', color: '#2E4057', marginBottom: '16px' }}>
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
            <p style={{ marginTop: '25px', fontSize: '16px', color: '#2E4057' }}>
              The employee experience remains simple.  
              The governance intelligence sits within the composite modelling,
              stability analysis, and escalation logic.
            </p>
          </div>
        </section>

        {/* GOVERNANCE CALIBRATION */}
        <section id="governance" className="section">
          <div className="container">
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
        <section id="pilot" className="section section-alt">
          <div className="container">
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
        <section id="contact" className="section section-alt" style={{ borderTop: '1px solid #D7E0E8', textAlign: 'center' }}>
          <div className="container">
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
        <footer style={{ backgroundColor: '#0B1B2B', color: '#ffffff', padding: '48px 0', textAlign: 'center' }}>
          <div className="container">
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
