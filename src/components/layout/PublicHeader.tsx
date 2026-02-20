import { MaterialIcon } from '@/components/ui/MaterialIcon';

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
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[#2B4162]">
          <a href="/" className="text-[#2B4162] hover:text-[#1b2740] transition-colors">Home</a>
          <a href="/advisory" className="text-[#2B4162] hover:text-[#1b2740] transition-colors">Advisory</a>
          <a href="/about" className="text-[#2B4162] hover:text-[#1b2740] transition-colors">About</a>
        </nav>
        <a
          href="mailto:hello@beaconeffect.com.au"
          className="hidden md:inline-flex items-center gap-2 rounded-md border border-[#2B4162] px-4 py-2 text-sm font-semibold text-[#2B4162] hover:bg-[#2B4162] hover:text-white transition-colors"
        >
          <MaterialIcon icon="mail" style={{ fontSize: '18px' }} />
          Start a conversation
        </a>
      </div>
    </header>
  );
}
