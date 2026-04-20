'use client';

/**
 * Layout + responsive visibility use `marketing.css` (`beacon-public-header-*`),
 * not Tailwind `hidden` / `lg:` — those break if utility CSS fails to load,
 * which duplicates nav links and collapses the header row.
 */

const navLinks = [
  { href: '/#whos-it-for', label: "Who It's For" },
  { href: '/#what-i-work-on', label: 'What I Work On' },
  { href: '/#how-it-works', label: 'How It Works' },
  { href: '/#about-peta', label: 'About Peta' },
] as const;

export function PublicHeader() {
  return (
    <header className="beacon-public-header">
      <div className="beacon-public-header-inner">
        <div className="beacon-public-header-top">
          <a href="/" className="beacon-public-brand">
            Beacon Advisory
          </a>

          <a href="/#contact" className="beacon-public-cta beacon-public-cta--sm">
            Start
          </a>

          <nav className="beacon-public-nav beacon-public-nav--desktop" aria-label="Primary">
            {navLinks.map(({ href, label }) => (
              <a key={href} href={href}>
                {label}
              </a>
            ))}
          </nav>

          <a href="/#contact" className="beacon-public-cta beacon-public-cta--lg">
            Start a conversation
          </a>
        </div>

        <nav className="beacon-public-nav beacon-public-nav--mobile" aria-label="Primary">
          {navLinks.map(({ href, label }) => (
            <a key={href} href={href}>
              {label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
