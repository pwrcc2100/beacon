'use client';
import * as React from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';

export function DashboardShell({ sidebar, children }:{ sidebar: React.ReactNode; children: React.ReactNode }){
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-[260px_1fr]">
      <aside className={["bg-white dark:bg-slate-900 border-r border-black/5 dark:border-white/10 p-4 hidden lg:block sticky top-0 h-screen overflow-y-auto"].join(' ')}>
        <div className="flex items-center justify-between mb-4">
          <span className="font-semibold text-slate-900 dark:text-white">Beacon</span>
          <ThemeToggle />
        </div>
        {sidebar}
      </aside>
      <div className="lg:hidden sticky top-0 z-10 bg-white/90 dark:bg-slate-900/90 backdrop-blur border-b border-black/5 dark:border-white/10 px-4 py-3 flex items-center justify-between">
        <div className="font-semibold text-[var(--text-primary)]">Beacon</div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm">Composite Index Score</Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[260px] p-0">
              <div className="p-4 h-full overflow-y-auto">{sidebar}</div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      <main className="p-4 lg:p-6 bg-[#f5f8ff] dark:bg-slate-950">{children}</main>
    </div>
  );
}


