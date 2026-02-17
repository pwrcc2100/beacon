export default function Home() {
  return (
    <div style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', margin: 0, padding: 0, lineHeight: 1.6, color: '#1a1a1a' }}>
      
      {/* HERO - Dark Section */}
      <section style={{ backgroundColor: '#0B1B2B', color: '#ffffff', padding: '60px 20px', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: '48px', fontWeight: 600, marginBottom: '24px', lineHeight: 1.2 }}>
            Psychosocial Risk Is a Governance Responsibility
          </h1>
          <p style={{ fontSize: '20px', marginBottom: '32px', color: '#d1d5db', fontWeight: 400, lineHeight: 1.5 }}>
            Structured system-level monitoring for early detection and defensible oversight.
          </p>
          <a 
            href="mailto:peta@beaconeffect.com.au?subject=Beacon%20Index%20Executive%20Overview%20Request" 
            style={{ 
              display: 'inline-block', 
              padding: '12px 32px', 
              backgroundColor: 'transparent', 
              border: '1px solid #ffffff',
              color: '#ffffff', 
              textDecoration: 'none',
              fontSize: '16px',
              fontWeight: 500,
              transition: 'all 0.2s'
            }}
          >
            Request Executive Overview
          </a>
        </div>
      </section>

      {/* THE VISIBILITY GAP */}
      <section style={{ backgroundColor: '#ffffff', padding: '48px 20px' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: '32px', fontWeight: 600, marginBottom: '24px', color: '#0B1B2B' }}>
            The Visibility Gap
          </h2>
          <p style={{ fontSize: '18px', marginBottom: '18px', lineHeight: 1.7 }}>
            Most organisations detect psychosocial risk after escalation — through complaints, attrition, conflict, or claims.
          </p>
          <p style={{ fontSize: '18px', marginBottom: '18px', lineHeight: 1.7 }}>
            Current tools measure sentiment, not structural exposure. By the time psychosocial risk becomes visible, damage is already underway.
          </p>
          <p style={{ fontSize: '18px', marginBottom: 0, lineHeight: 1.7 }}>
            Governance requires structured monitoring. Beacon Index closes the visibility gap through continuous, system-level risk detection embedded within existing WHS governance.
          </p>
        </div>
      </section>

      {/* INSTRUMENT ARCHITECTURE */}
      <section style={{ backgroundColor: '#ffffff', padding: '48px 20px' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <div style={{ backgroundColor: '#f5f5f5', border: '1px solid #e0e0e0', padding: '32px' }}>
            <h2 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: '32px', fontWeight: 600, marginBottom: '28px', marginTop: 0, color: '#0B1B2B' }}>
              Instrument Architecture
            </h2>
            
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '12px', marginTop: 0 }}>
                System-Level Composite Model
              </h3>
              <ul style={{ margin: 0, paddingLeft: '20px', listStyleType: 'disc' }}>
                <li style={{ marginBottom: '8px', fontSize: '16px' }}>Five ISO 45003-aligned domains</li>
                <li style={{ marginBottom: '8px', fontSize: '16px' }}>Weighted composite score (0–100)</li>
                <li style={{ marginBottom: 0, fontSize: '16px' }}>Early signal detection logic</li>
              </ul>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '12px', marginTop: 0 }}>
                Trend Significance
              </h3>
              <ul style={{ margin: 0, paddingLeft: '20px', listStyleType: 'disc' }}>
                <li style={{ marginBottom: '8px', fontSize: '16px' }}>Multi-cycle modelling</li>
                <li style={{ marginBottom: 0, fontSize: '16px' }}>Sustained movement &gt; single-week fluctuation</li>
              </ul>
            </div>

            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '12px', marginTop: 0 }}>
                Regulatory Alignment
              </h3>
              <ul style={{ margin: 0, paddingLeft: '20px', listStyleType: 'disc' }}>
                <li style={{ marginBottom: '8px', fontSize: '16px' }}>ISO 45003 principles</li>
                <li style={{ marginBottom: 0, fontSize: '16px' }}>Contemporary WHS psychosocial obligations</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* GOVERNANCE CALIBRATION */}
      <section style={{ backgroundColor: '#ffffff', padding: '48px 20px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: '32px', fontWeight: 600, marginBottom: '28px', color: '#0B1B2B' }}>
            Governance Risk Classification
          </h2>
          
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '24px', fontSize: '16px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #0B1B2B' }}>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600 }}>Score Band</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600 }}>Classification</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600 }}>Governance Response</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid #e0e0e0' }}>
                <td style={{ padding: '12px 16px', fontWeight: 600 }}>≥ 80</td>
                <td style={{ padding: '12px 16px' }}>Low Risk</td>
                <td style={{ padding: '12px 16px' }}>Standard monitoring</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #e0e0e0' }}>
                <td style={{ padding: '12px 16px', fontWeight: 600 }}>70–79</td>
                <td style={{ padding: '12px 16px' }}>Within Tolerance</td>
                <td style={{ padding: '12px 16px' }}>Trend review</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #e0e0e0' }}>
                <td style={{ padding: '12px 16px', fontWeight: 600 }}>60–69</td>
                <td style={{ padding: '12px 16px' }}>Emerging Risk</td>
                <td style={{ padding: '12px 16px' }}>Targeted review</td>
              </tr>
              <tr>
                <td style={{ padding: '12px 16px', fontWeight: 600 }}>&lt; 60</td>
                <td style={{ padding: '12px 16px' }}>Elevated Risk</td>
                <td style={{ padding: '12px 16px' }}>Structured intervention</td>
              </tr>
            </tbody>
          </table>

          <div style={{ fontSize: '15px', lineHeight: 1.6, color: '#4a4a4a' }}>
            <p style={{ marginBottom: '10px' }}>Default thresholds are evidence-calibrated.</p>
            <p style={{ marginBottom: '10px' }}>Organisations may adjust tolerance bands within defined governance parameters.</p>
            <p style={{ marginBottom: 0 }}>Core domain weighting methodology remains fixed.</p>
          </div>
        </div>
      </section>

      {/* VALIDATION PILOT */}
      <section style={{ backgroundColor: '#ffffff', padding: '48px 20px 64px 20px' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: '32px', fontWeight: 600, marginBottom: '24px', color: '#0B1B2B' }}>
            Governance Validation Pilot
          </h2>
          
          <div style={{ marginBottom: '24px' }}>
            <p style={{ fontSize: '17px', marginBottom: '8px', lineHeight: 1.6 }}><strong>Purpose:</strong> Calibration + oversight validation</p>
            <p style={{ fontSize: '17px', marginBottom: '8px', lineHeight: 1.6 }}><strong>Duration:</strong> 8 weeks</p>
            <p style={{ fontSize: '17px', marginBottom: '0', lineHeight: 1.6, fontStyle: 'italic' }}>Not a software trial.</p>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '14px', marginTop: 0 }}>Includes</h3>
            <ul style={{ margin: 0, paddingLeft: '20px', listStyleType: 'disc' }}>
              <li style={{ marginBottom: '8px', fontSize: '16px' }}>Baseline deployment</li>
              <li style={{ marginBottom: '8px', fontSize: '16px' }}>Executive calibration workshop</li>
              <li style={{ marginBottom: '8px', fontSize: '16px' }}>2–4 reporting cycles</li>
              <li style={{ marginBottom: '8px', fontSize: '16px' }}>Escalation framework validation</li>
              <li style={{ marginBottom: 0, fontSize: '16px' }}>Board-ready summary</li>
            </ul>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '12px', marginTop: 0 }}>Investment</h3>
            <p style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>$28,000–$38,000 AUD (Fixed Fee)</p>
            <p style={{ fontSize: '16px', marginBottom: 0, color: '#4a4a4a' }}>Limited foundation pilots available.</p>
          </div>
        </div>
      </section>

      {/* CLOSING DARK BAND */}
      <section style={{ backgroundColor: '#0B1B2B', color: '#ffffff', padding: '48px 20px', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <p style={{ fontSize: '20px', marginBottom: '24px', fontWeight: 500, lineHeight: 1.5 }}>
            Structured data. Early signals. Defensible governance insight.
          </p>
          <a 
            href="mailto:peta@beaconeffect.com.au?subject=Beacon%20Index%20Executive%20Overview%20Request" 
            style={{ 
              display: 'inline-block', 
              padding: '12px 32px', 
              backgroundColor: 'transparent', 
              border: '1px solid #ffffff',
              color: '#ffffff', 
              textDecoration: 'none',
              fontSize: '16px',
              fontWeight: 500,
              transition: 'all 0.2s'
            }}
          >
            Request Executive Overview
          </a>
        </div>
      </section>

      {/* Add Google Fonts */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Playfair+Display:wght@600&display=swap" rel="stylesheet" />
    </div>
  );
}
