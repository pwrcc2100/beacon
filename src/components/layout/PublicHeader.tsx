'use client';

import { MaterialIcon } from '@/components/ui/MaterialIcon';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/#advisory', label: 'Advisory' },
  { href: '/about', label: 'About' },
] as const;

export function PublicHeader() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <a href="/" className="flex items-center gap-3">
          <MaterialIcon icon="auto_awesome" style={{ fontSize: '32px', color: '#2B4162' }} />
          <div>
            <h1 className="text-lg font-semibold text-[#2B4162]">Beacon Advisory</h1>
            <p className="text-xs text-[#737A8C]">Practical senior advisory & execution support</p>
          </div>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[#2B4162]">
          {navLinks.map(({ href, label }) => (
            <a key={href} href={href} className="text-[#2B4162] hover:text-[#1b2740] transition-colors">
              {label}
            </a>
          ))}
        </nav>
        <a
          href="mailto:hello@beaconeffect.com.au"
          className="hidden md:inline-flex items-center gap-2 rounded-md border border-[#2B4162] px-4 py-2 text-sm font-semibold text-[#2B4162] hover:bg-[#2B4162] hover:text-white transition-colors"
        >
          <MaterialIcon icon="mail" style={{ fontSize: '18px' }} />
          Start a conversation
        </a>

        {/* Mobile menu - always show below md; use SVG so it renders without font */}
        <div className="flex md:hidden items-center flex-shrink-0">
          <Sheet>
            <SheetTrigger asChild>
              <button
                type="button"
                className="flex items-center justify-center w-10 h-10 rounded-md border-2 border-[#2B4162] text-[#2B4162] hover:bg-[#2B4162] hover:text-white transition-colors"
                aria-label="Open menu"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
                  <line x1="4" y1="6" x2="20" y2="6" />
                  <line x1="4" y1="12" x2="20" y2="12" />
                  <line x1="4" y1="18" x2="20" y2="18" />
                </svg>
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] bg-white">
              <nav className="flex flex-col gap-1 pt-8">
                {navLinks.map(({ href, label }) => (
                  <a
                    key={href}
                    href={href}
                    className="block px-4 py-3 text-base font-medium text-[#2B4162] hover:bg-[#f8f9fb] rounded-md transition-colors"
                  >
                    {label}
                  </a>
                ))}
                <a
                  href="mailto:hello@beaconeffect.com.au"
                  className="mt-4 mx-4 inline-flex items-center justify-center gap-2 rounded-md border border-[#2B4162] px-4 py-3 text-sm font-semibold text-[#2B4162] hover:bg-[#2B4162] hover:text-white transition-colors"
                >
                  <MaterialIcon icon="mail" style={{ fontSize: '18px' }} />
                  Start a conversation
                </a>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
