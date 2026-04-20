'use client';
import { useRouter, usePathname } from 'next/navigation';
import { DataModeToggle } from '@/components/dashboard/DataModeToggle';

type Props = {
  currentMode: 'historical' | 'live';
  clientId: string;
  period: string;
  divisionId?: string;
  departmentId?: string;
  teamId?: string;
};

export function DataModeToggleClient({ currentMode, clientId, period, divisionId, departmentId, teamId }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const basePath = pathname || '/dashboard';

  const handleModeChange = (mode: 'historical' | 'live') => {
    const params = new URLSearchParams();
    params.set('mode', mode);
    params.set('client', clientId);

    if (period !== 'all') params.set('period', period);
    if (divisionId) params.set('division_id', divisionId);
    if (departmentId) params.set('department_id', departmentId);
    if (teamId) params.set('team_id', teamId);

    if (typeof window !== 'undefined') {
      const currentParams = new URLSearchParams(window.location.search);
      currentParams.getAll('selected_departments').forEach((id) => params.append('selected_departments', id));
    }

    router.push(`${basePath}?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium text-muted-foreground">Data Mode:</span>
      <DataModeToggle currentMode={currentMode} onModeChange={handleModeChange} />
      {currentMode === 'live' && (
        <span className="text-xs text-muted-foreground">
          (Today's responses only)
        </span>
      )}
    </div>
  );
}

