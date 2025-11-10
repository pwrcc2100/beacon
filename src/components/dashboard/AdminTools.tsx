'use client';

import { useEffect, useState } from 'react';
import { GenerateDemoDataButton } from '@/components/dashboard/GenerateDemoDataButton';
import { SetupHierarchyButton } from '@/components/dashboard/SetupHierarchyButton';
import { ClearDemoDataButton } from '@/components/dashboard/ClearDemoDataButton';

type AdminToolsProps = {
  clientId: string;
};

function hasCookie(name: string) {
  return document.cookie.split('; ').some(entry => entry.trim().startsWith(`${name}=`));
}

export function AdminTools({ clientId }: AdminToolsProps) {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const cookies = document.cookie.split('; ').map(entry => entry.trim());
    const hasUiFlag = cookies.includes('dash_ui=1');
    const hasLegacyToken = cookies.some(entry => entry.startsWith('dash='));
    const hasGuestFlag = cookies.includes('dash_guest=1');

    if (hasUiFlag || hasLegacyToken || hasGuestFlag) {
      setIsAdmin(true);
      return;
    }

    const publicToken = process.env.NEXT_PUBLIC_ADMIN_DASH_TOKEN;
    if (publicToken && cookies.includes(`dash=${publicToken}`)) {
      setIsAdmin(true);
    }
  }, []);

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="space-y-2">
      <div className="text-xs uppercase tracking-wide text-[var(--text-muted)] mb-2">Demo Data</div>
      <div className="space-y-2">
        <SetupHierarchyButton clientId={clientId} />
        <GenerateDemoDataButton clientId={clientId} endpoint="seed-balanced" label="Generate Balanced Demo Records" />
        <ClearDemoDataButton clientId={clientId} />
      </div>
    </div>
  );
}


