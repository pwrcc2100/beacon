import { MaterialIcon } from '@/components/ui/MaterialIcon';

export function PublicHeader() {
  return (
    <header className="bg-gradient-to-r from-[#2B4162] to-[#5d89a9] sticky top-0 z-50 shadow-lg">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <a href="/" className="flex items-center gap-3">
          <MaterialIcon icon="health_and_safety" style={{ fontSize: '32px', color: '#64afac' }} />
          <div>
            <h1 className="text-xl font-bold text-white">Beacon</h1>
            <p className="text-xs text-white/80">Psychosocial Wellbeing Platform</p>
          </div>
        </a>
        <nav className="hidden md:flex items-center gap-6">
          <a href="/" className="text-white/80 hover:text-white transition-colors text-sm">Home</a>
          <a href="/about" className="text-white/80 hover:text-white transition-colors text-sm">About</a>
          <a href="/features" className="text-white/80 hover:text-white transition-colors text-sm">Features</a>
          <a href="/pricing" className="text-white/80 hover:text-white transition-colors text-sm">Pricing</a>
          <a href="/dashboard" className="text-white/80 hover:text-white transition-colors text-sm">Demo</a>
          <a 
            href="mailto:hello@beaconwellbeing.com.au" 
            className="px-4 py-2 bg-[#64afac] text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Contact
          </a>
        </nav>
      </div>
    </header>
  );
}



