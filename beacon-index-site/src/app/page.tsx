export default function Home() {
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      
      <div style={{ fontFamily: 'ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif', lineHeight: 1.6, color: '#2E4057', background: '#ffffff' }}>
        
        {/* HERO */}
        <section style={{ backgroundColor: '#0B1B2B', color: '#ffffff', padding: '80px 24px', textAlign: 'center' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px' }}>
            <h1 style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontSize: '48px', fontWeight: 600, color: '#ffffff', marginBottom: '8px', lineHeight: 1.2 }}>
              Psychosocial Risk Is a Governance Responsibility
            </h1>
            <div style={{ width: '120px', height: '2px', backgroundColor: '#2F6F7E', margin: '20px auto' }}></div>
            <p style={{ fontSize: '20px', color: '#D7E0E8', maxWidth: '800px', margin: '0 auto 32px', lineHeight: 1.5 }}>
              System-level visibility for early detection, proportionate response, and defensible oversight.
            </p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="#contact" style={{ display: 'inline-block', padding: '14px 32px', backgroundColor: '#2F6F7E', color: '#ffffff', textDecoration: 'none', fontWeight: 500, fontSize: '16px' }}>
                Request Executive Overview
              </a>
              <a href="#methodology" style={{ display: 'inline-block', padding: '14px 32px', backgroundColor: 'transparent', color: '#ffffff', textDecoration: 'none', fontWeight: 500, fontSize: '16px', border: '1px solid #D7E0E8' }}>
                View Methodology
              </a>
            </div>
          </div>
        </section>

        {/* SCORECARD SPECIMEN */}
        <section style={{ padding: '64px 0' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px' }}>
            <h2 style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontSize: '32px', fontWeight: 600, color: '#0B1B2B', marginBottom: '24px', lineHeight: 1.2 }}>
              Example Output: Beacon Index Scorecard
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'center' }}>
              <div style={{ background: '#ffffff', border: '2px solid #0B1B2B', padding: '32px', textAlign: 'center', boxShadow: '0 2px 8px rgba(11, 27, 43, 0.06)' }}>
                <div style={{ fontSize: '13px', fontWeight: 600, letterSpacing: '0.5px', color: '#2E4057', marginBottom: '16px' }}>
                  BEACON INDEX SCORE
                </div>
                <div style={{ fontSize: '72px', fontWeight: 600, color: '#0B1B2B', lineHeight: 1, marginBottom: '16px' }}>
                  74
                </div>
                <div style={{ height: '2px', backgroundColor: '#2F6F7E', margin: '16px auto', width: '60px' }}></div>
                <div style={{ fontSize: '16px', fontWeight: 500, color: '#2E4057', marginBottom: '12px' }}>
                  Within risk tolerance
                </div>
                <div style={{ fontSize: '14px', color: '#2E4057' }}>
                  Trend: <span style={{ color: '#2F6F7E', fontWeight: 600 }}>↑ 1.2%</span>
                </div>
              </div>
              <div>
                <ul style={{ margin: '16px 0', paddingLeft: '24px' }}>
                  <li style={{ marginBottom: '10px', fontSize: '16px' }}>Composite 0–100 risk exposure score</li>
                  <li style={{ marginBottom: '10px', fontSize: '16px' }}>Trend-weighted interpretation across reporting cycles</li>
                  <li style={{ marginBottom: '10px', fontSize: '16px' }}>Designed for governance oversight — not sentiment tracking</li>
                </ul>
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
        <section style={{ padding: '64px 0' }}>
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
