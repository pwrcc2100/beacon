import { MaterialIcon } from '@/components/ui/MaterialIcon';

export function PublicFooter() {
  return (
    <footer className="bg-[#2B4162] text-white">
      <div className="max-w-6xl mx-auto px-6 py-12 space-y-8">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <MaterialIcon icon="auto_awesome" style={{ fontSize: '24px', color: '#64afac' }} />
            <span className="text-lg font-semibold">Beacon Advisory</span>
          </div>
          <p className="text-sm text-white/80 max-w-3xl">
            Practical senior advisory and execution support for business transformation, digital initiatives,
            enterprise improvement and high-stakes special projects.
          </p>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-semibold tracking-wide uppercase text-white/70">Contact</h4>
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6 text-sm text-white">
            <a href="mailto:hello@beaconeffect.com.au" className="inline-flex items-center gap-2 hover:text-[#64afac] transition-colors">
              <MaterialIcon icon="mail" style={{ fontSize: '18px' }} />
              hello@beaconeffect.com.au
            </a>
            <a
              href="https://www.linkedin.com/in/peta-wilson-4769361"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 hover:text-[#64afac] transition-colors"
            >
              <MaterialIcon icon="person" style={{ fontSize: '18px' }} />
              LinkedIn
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-4 text-xs text-white/60">
          © Beacon Advisory • All rights reserved.
        </div>
      </div>
    </footer>
  );
}







