'use client';
import * as React from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

export function DashboardShell({ sidebar, children }:{ sidebar: React.ReactNode; children: React.ReactNode }){
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-[260px_1fr]">
      <aside className={["bg-white border-r border-black/5 p-4 hidden lg:block sticky top-0 h-screen overflow-y-auto"].join(' ')}>
        {sidebar}
      </aside>
      <div className="lg:hidden sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-black/5 px-4 py-3 flex items-center justify-between">
        <div className="font-semibold text-[var(--text-primary)]">Beacon</div>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm">Menu</Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[260px] p-0">
            <div className="p-4 h-full overflow-y-auto">{sidebar}</div>
          </SheetContent>
        </Sheet>
      </div>
      <main className="p-4 lg:p-6">{children}</main>
    </div>
  );
}


