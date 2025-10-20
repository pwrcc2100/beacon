'use client';
import * as React from 'react';

export function DashboardShell({ sidebar, children }:{ sidebar: React.ReactNode; children: React.ReactNode }){
  const [open, setOpen] = React.useState(false);
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-[260px_1fr]">
      <aside className={["bg-white border-r border-black/5 p-4 hidden lg:block sticky top-0 h-screen overflow-y-auto"].join(' ')}>
        {sidebar}
      </aside>
      <div className="lg:hidden sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-black/5 px-4 py-3 flex items-center justify-between">
        <div className="font-semibold text-[var(--text-primary)]">Beacon</div>
        <button onClick={()=>setOpen(o=>!o)} className="px-3 py-1 rounded border border-black/10">Menu</button>
      </div>
      {open && (
        <div className="lg:hidden fixed inset-0 z-20 bg-black/30" onClick={()=>setOpen(false)}>
          <div className="absolute left-0 top-0 h-full w-[260px] bg-white p-4 overflow-y-auto" onClick={e=>e.stopPropagation()}>
            {sidebar}
          </div>
        </div>
      )}
      <main className="p-4 lg:p-6">{children}</main>
    </div>
  );
}


