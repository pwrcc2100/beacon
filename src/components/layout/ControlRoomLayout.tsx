import { LayoutDashboard, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

interface ControlRoomLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  /** Optional content between header and main (e.g. participation summary) */
  headerExtra?: React.ReactNode;
  /** Optional actions to display in header (e.g. Print button) */
  actions?: React.ReactNode;
}

export function ControlRoomLayout({ title, subtitle, children, headerExtra, actions }: ControlRoomLayoutProps) {
  const reportDate = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase();

  return (
    <div
      className="min-h-full -m-4 lg:-m-6 p-4 lg:p-6 control-room-bg"
      style={{
        background: 'var(--control-room-bg)',
        backgroundImage:
          'radial-gradient(circle at 50% -20%, var(--control-room-bg-gradient) 0%, transparent 50%), linear-gradient(to right, var(--control-room-grid) 1px, transparent 1px), linear-gradient(to bottom, var(--control-room-grid) 1px, transparent 1px)',
        backgroundSize: '100% 100%, 60px 60px, 60px 60px',
      }}
    >
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-lg flex items-center justify-center">
              <LayoutDashboard className="text-slate-900 dark:text-white" size={20} />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">{title}</h1>
              {subtitle && (
                <p className="text-xs text-zinc-600 dark:text-zinc-500 font-medium uppercase tracking-widest">{subtitle}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4">
            {actions && (
              <>
                {actions}
                <div className="h-8 w-px bg-black/10 dark:bg-white/10" />
              </>
            )}
            <div className="text-right">
              <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 dark:text-zinc-500">System Status</div>
              <div className="flex items-center gap-1.5 justify-end">
                <div className="w-1.5 h-1.5 rounded-full bg-[#2d6785] animate-pulse" />
                <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400">Live Feed Active</span>
              </div>
            </div>
            <div className="h-8 w-px bg-black/10 dark:bg-white/10" />
            <div className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">{reportDate}</div>
          </div>
        </header>

        {headerExtra && <div className="text-sm text-zinc-600 dark:text-zinc-500 -mt-4">{headerExtra}</div>}

        {/* Main content */}
        <div className="text-slate-900 dark:text-white">{children}</div>

        {/* Footer */}
        <footer className="mt-12 pt-6 border-t border-black/10 dark:border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 text-[10px] font-medium uppercase tracking-widest text-zinc-600">
          <div className="space-y-4">
            <div className="bg-slate-200/80 dark:bg-[#111e26] border border-black/10 dark:border-white/10 rounded-lg p-2 flex items-center gap-2 w-fit">
              <div className="w-4 h-4 bg-[#d97036] rounded-sm flex items-center justify-center">
                <ShieldCheck size={10} className="text-black" />
              </div>
              <span className="text-zinc-600 dark:text-zinc-400 font-bold">ISO 45003 Compliant</span>
            </div>
            <div>Proprietary Governance Intelligence System — Confidential</div>
          </div>
          <div className="flex gap-4 pb-1">
            <Link href="/methodology" className="hover:text-zinc-400 transition-colors">
              Documentation
            </Link>
            <Link href="/methodology" className="hover:text-zinc-400 transition-colors">
              Methodology
            </Link>
            <span className="hover:text-zinc-400 cursor-pointer transition-colors">Support</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
