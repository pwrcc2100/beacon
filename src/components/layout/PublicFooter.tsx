const LINKEDIN = 'https://www.linkedin.com/in/peta-wilson-4769361';

export function PublicFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="beacon-public-footer">
      <div className="beacon-public-footer-inner">
        <p className="beacon-public-footer-brand">Beacon Advisory</p>
        <p className="beacon-public-footer-tagline">So you can finally exhale.</p>
        <div className="beacon-public-footer-spacer" aria-hidden />
        <div className="beacon-marketing-footer-links">
          <a href="mailto:peta@beaconeffect.com.au">peta@beaconeffect.com.au</a>
          <a href={LINKEDIN} target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
        </div>
      </div>

      <div className="beacon-public-footer-legal-wrap">
        <p className="beacon-public-footer-legal">
          © {year} Beacon Advisory · All rights reserved.
        </p>
      </div>
    </footer>
  );
}
