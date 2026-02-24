'use client';

import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const links = [
  { href: '/', label: 'Home' },
  { href: '/beacon-index', label: 'Beacon Index' },
  { href: '/beacon-index/about', label: 'About' },
  { href: '/beacon-index/features', label: 'Features' },
  { href: 'mailto:hello@beaconeffect.com.au', label: 'Contact' },
];

export function BeaconIndexMobileNav({ variant = 'light' }: { variant?: 'light' | 'dark' }) {
  const isDark = variant === 'dark';
  const buttonClass = isDark
    ? 'border-2 border-[#2B4162] text-[#2B4162] hover:bg-[#2B4162] hover:text-white'
    : 'border-2 border-white text-white hover:bg-white hover:text-[#2B4162]';
  return (
    <div className="flex md:hidden items-center flex-shrink-0">
      <Sheet>
        <SheetTrigger asChild>
          <button
            type="button"
            className={`flex items-center justify-center w-10 h-10 rounded-md transition-colors ${buttonClass}`}
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
            {links.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                className="block px-4 py-3 text-base font-medium text-[#2B4162] hover:bg-[#f8f9fb] rounded-md transition-colors"
              >
                {label}
              </a>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
}
