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
          padding: 56px 0;
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
          padding-top: 80px;
          padding-bottom: 72px;
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

        .section-icon {
          width: 48px;
          height: 48px;
          margin-bottom: 16px;
          color: #2f7f7b;
        }
        .visibility-cards {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          margin-top: 28px;
        }
        @media (max-width: 700px) { .visibility-cards { grid-template-columns: 1fr; } }
        .visibility-card {
          padding: 24px;
          border-radius: 12px;
          border: 1px solid #D7E0E8;
          background: #fff;
        }
        .visibility-card.reactive { border-left: 4px solid #8A3A3A; }
        .visibility-card.solution { border-left: 4px solid #2f7f7b; }
        .visibility-card h3 { font-size: 16px; font-weight: 700; color: #0B1B2B; margin-bottom: 12px; }
        .visibility-card ul { margin: 0; padding-left: 20px; font-size: 15px; color: #2E4057; line-height: 1.6; }
        .step-flow {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          flex-wrap: wrap;
          margin-top: 28px;
        }
        .step-flow .step {
          display: flex;
          flex-direction: column;
          align-items: center;
          min-width: 100px;
        }
        .step-flow .step-circle {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: #2f7f7b;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 18px;
          margin-bottom: 10px;
        }
        .step-flow .step-label { font-size: 14px; font-weight: 600; color: #0B1B2B; }
        .step-flow .arrow { color: #2f7f7b; font-size: 24px; margin: 0 4px; }
        .method-card-visual {
          border: 1px solid #D7E0E8;
          padding: 24px;
          background: #fff;
          border-radius: 10px;
          border-top: 4px solid #2f7f7b;
        }
        .method-card-visual .card-icon { margin-bottom: 12px; color: #2f7f7b; }
        .risk-scale-bar {
          display: flex;
          width: 100%;
          max-width: 560px;
          height: 32px;
          border-radius: 6px;
          overflow: hidden;
          margin-bottom: 24px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }
        .risk-scale-bar span { flex: 1; min-width: 0; }
        .risk-scale-bar .r0 { background: #8A3A3A; }
        .risk-scale-bar .r1 { background: #A87B2F; }
        .risk-scale-bar .r2 { background: #4C6A88; }
        .risk-scale-bar .r3 { background: #2F6F7E; }
        .pilot-steps {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 16px;
          margin-top: 24px;
        }
        .pilot-step {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 16px;
          background: #fff;
          border: 1px solid #D7E0E8;
          border-radius: 10px;
        }
        .pilot-step-num { width: 28px; height: 28px; border-radius: 50%; background: #2f7f7b; color: #fff; font-size: 14px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .pilot-step span { font-size: 15px; color: #2E4057; line-height: 1.4; }
        .op-design-list { list-style: none; padding: 0; margin: 24px 0 0; }
        .op-design-list li { display: flex; align-items: center; gap: 12px; margin-bottom: 14px; font-size: 17px; color: #2E4057; }
        .op-design-list .tick { width: 24px; height: 24px; border-radius: 50%; background: #2f7f7b; color: #fff; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 14px; }
        .method-grid-visual { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; margin-top: 28px; }
        @media (max-width: 768px) {
          .method-grid-visual { grid-template-columns: 1fr; }
          .risk-scale-bar { max-width: 100%; }
          .pilot-steps { grid-template-columns: 1fr; }
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
            <svg className="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
            </svg>
            <h2 style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontSize: '32px', fontWeight: 600, color: '#0B1B2B', marginBottom: '8px', lineHeight: 1.2 }}>
              The Visibility Gap
            </h2>
            <p style={{ marginBottom: '0', fontSize: '17px', maxWidth: '720px' }}>
              Most organisations detect psychosocial risk after escalation. WHS expectations require ongoing identification, monitoring, and response.
            </p>
            <div className="visibility-cards">
              <div className="visibility-card reactive">
                <h3>Reactive detection</h3>
                <ul>
                  <li>Complaints, conflict, attrition, or claims</li>
                  <li>Undermines duty of care</li>
                  <li>Exposes organisations to regulatory scrutiny</li>
                </ul>
              </div>
              <div className="visibility-card solution">
                <h3>Beacon Index</h3>
                <ul>
                  <li>Structured, continuous visibility</li>
                  <li>Suitable for governance reporting</li>
                  <li>Closes the gap between obligation and operational reality</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* EXECUTIVE EXPERIENCE */}
        <section className="section section-alt">
          <div className="container two-column">
            <div>
              <svg className="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
              </svg>
              <h2>See It in 60 Seconds</h2>
              <p>
                Beacon Index is intentionally simple at the point of interaction.
                Five calibrated system-level questions. Mobile-first.
                Typically completed in under one minute.
              </p>
              <div className="step-flow" aria-label="Process: Scan, Respond, View">
                <div className="step">
                  <div className="step-circle">1</div>
                  <span className="step-label">Scan</span>
                </div>
                <span className="arrow" aria-hidden="true">→</span>
                <div className="step">
                  <div className="step-circle">2</div>
                  <span className="step-label">Respond</span>
                </div>
                <span className="arrow" aria-hidden="true">→</span>
                <div className="step">
                  <div className="step-circle">3</div>
                  <span className="step-label">View</span>
                </div>
              </div>
              <p style={{ marginTop: '20px' }}>
                In executive briefings, leaders scan a QR code, complete the questions live, and immediately view the composite governance score within the calibrated risk bands.
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
            <svg className="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
            </svg>
            <h2 style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontSize: '32px', fontWeight: 600, color: '#0B1B2B', marginBottom: '8px', lineHeight: 1.2 }}>
              Methodology (in brief)
            </h2>
            <div className="method-grid-visual">
              <div className="method-card-visual">
                <svg className="card-icon" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                  <path d="M3 3v18h18" /><path d="M18 9V3h-6" /><path d="M18 15v-4" /><path d="M18 21v-2" />
                </svg>
                <h3 style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontSize: '18px', fontWeight: 600, color: '#0B1B2B', marginBottom: '16px', lineHeight: 1.2 }}>Domains & Weighting</h3>
                <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '15px' }}>
                  <li style={{ marginBottom: '8px' }}>Five calibrated ISO 45003-aligned domains</li>
                  <li style={{ marginBottom: '8px' }}>Weighted composite scoring (0–100)</li>
                  <li style={{ marginBottom: '8px' }}>System-level conditions, not individual sentiment</li>
                </ul>
              </div>
              <div className="method-card-visual">
                <svg className="card-icon" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <h3 style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontSize: '18px', fontWeight: 600, color: '#0B1B2B', marginBottom: '16px', lineHeight: 1.2 }}>De-identification & Anonymity</h3>
                <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '15px' }}>
                  <li style={{ marginBottom: '8px' }}>Team-level aggregation minimum thresholds</li>
                  <li style={{ marginBottom: '8px' }}>Individual responses not identifiable</li>
                  <li style={{ marginBottom: '8px' }}>Threshold protections maintained across reporting cycles</li>
                </ul>
              </div>
              <div className="method-card-visual">
                <svg className="card-icon" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
                <h3 style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontSize: '18px', fontWeight: 600, color: '#0B1B2B', marginBottom: '16px', lineHeight: 1.2 }}>Trend Modelling & Stability</h3>
                <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '15px' }}>
                  <li style={{ marginBottom: '8px' }}>Multi-cycle trend analysis prioritised</li>
                  <li style={{ marginBottom: '8px' }}>Single-week volatility smoothed</li>
                  <li style={{ marginBottom: '8px' }}>Sustained movement signals governance significance</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* OPERATIONAL DESIGN */}
        <section className="section section-alt">
          <div className="container">
            <svg className="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="3" /><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
            </svg>
            <h2 style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontSize: '28px', fontWeight: 600, color: '#0B1B2B', marginBottom: '12px', lineHeight: 1.2 }}>
              Operational Design
            </h2>
            <p style={{ fontSize: '18px', color: '#2E4057', marginBottom: '0' }}>
              Beacon Index is intentionally lightweight at the point of employee interaction, while maintaining rigorous governance modelling behind the scenes.
            </p>
            <div style={{ border: '1px solid #D7E0E8', padding: '28px', backgroundColor: '#ffffff', borderRadius: '10px', marginTop: '24px' }}>
              <ul className="op-design-list">
                <li><span className="tick">✓</span> Five calibrated system-level indicators</li>
                <li><span className="tick">✓</span> Mobile-first delivery (typically &lt; 60 seconds to complete)</li>
                <li><span className="tick">✓</span> Team-level de-identification and anonymity thresholds</li>
                <li><span className="tick">✓</span> Trend-weighted composite scoring (0–100 index)</li>
                <li><span className="tick">✓</span> Embedded support pathways activated where elevated risk patterns are detected</li>
              </ul>
            </div>
            <p style={{ marginTop: '24px', fontSize: '16px', color: '#2E4057' }}>
              The employee experience remains simple. The governance intelligence sits within the composite modelling, stability analysis, and escalation logic.
            </p>
          </div>
        </section>

        {/* GOVERNANCE CALIBRATION */}
        <section id="governance" className="section">
          <div className="container">
            <svg className="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 20V10" /><path d="M18 20V4" /><path d="M6 20v-4" />
            </svg>
            <h2 style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontSize: '32px', fontWeight: 600, color: '#0B1B2B', marginBottom: '12px', lineHeight: 1.2 }}>
              Governance Risk Bands (Default)
            </h2>
            <p style={{ fontSize: '15px', color: '#5b6670', marginBottom: '16px' }}>Score scale 0–100: lower = higher risk</p>
            <div className="risk-scale-bar" aria-hidden="true">
              <span className="r0" title="&lt;60 Elevated" />
              <span className="r1" title="60–69 Emerging" />
              <span className="r2" title="70–79 Within tolerance" />
              <span className="r3" title="≥80 Low risk" />
            </div>
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
            <svg className="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <h2 style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontSize: '32px', fontWeight: 600, color: '#0B1B2B', marginBottom: '12px', lineHeight: 1.2 }}>
              Pilot (Governance Validation)
            </h2>
            <p style={{ marginBottom: '0', fontSize: '17px' }}>
              <strong>This is a governance validation pilot — not a software trial.</strong>
            </p>
            <div className="pilot-steps">
              <div className="pilot-step"><span className="pilot-step-num">1</span><span>6–8 weeks</span></div>
              <div className="pilot-step"><span className="pilot-step-num">2</span><span>Baseline deployment + calibration workshop</span></div>
              <div className="pilot-step"><span className="pilot-step-num">3</span><span>Weekly reporting cycles with trend review</span></div>
              <div className="pilot-step"><span className="pilot-step-num">4</span><span>Escalation logic validation</span></div>
              <div className="pilot-step"><span className="pilot-step-num">5</span><span>Board-ready summary and recommendations</span></div>
            </div>
            <div style={{ marginTop: '32px' }}>
              <a href="#contact" style={{ display: 'inline-block', padding: '14px 32px', backgroundColor: '#2F6F7E', color: '#ffffff', textDecoration: 'none', fontWeight: 500, fontSize: '16px', borderRadius: '8px' }}>
                Request pilot pack
              </a>
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" className="section section-alt" style={{ borderTop: '1px solid #D7E0E8', textAlign: 'center' }}>
          <div className="container">
            <svg className="section-icon" style={{ marginLeft: 'auto', marginRight: 'auto' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
            </svg>
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
