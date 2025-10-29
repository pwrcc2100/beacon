'use client';
import { useRouter } from 'next/navigation';
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

  const handleModeChange = (mode: 'historical' | 'live') => {
    const params = new URLSearchParams();
    params.set('mode', mode);
    params.set('client', clientId);
    
    if (period !== 'all') params.set('period', period);
    if (divisionId) params.set('division_id', divisionId);
    if (departmentId) params.set('department_id', departmentId);
    if (teamId) params.set('team_id', teamId);
    
    router.push(`/dashboard?${params.toString()}`);
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

