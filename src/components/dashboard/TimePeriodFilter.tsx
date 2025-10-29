'use client';
import { Button } from '@/components/ui/button';

type Props = {
  clientId: string;
  currentPeriod: string;
  mode?: 'historical' | 'live';
  divisionId?: string;
  departmentId?: string;
  teamId?: string;
  selectedDepartments?: string[];
};

export function TimePeriodFilter({
  clientId,
  currentPeriod,
  mode = 'historical',
  divisionId,
  departmentId,
  teamId,
  selectedDepartments = []
}: Props) {
  const buildUrl = (period: string) => {
    const params = new URLSearchParams();
    params.set('client', clientId);
    params.set('period', period);
    params.set('mode', mode); // Preserve mode when changing periods
    if (divisionId) params.set('division_id', divisionId);
    if (departmentId) params.set('department_id', departmentId);
      if (teamId) params.set('team_id', teamId);
      // Preserve selected_departments if they exist
      const currentParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams();
      const selectedDepts = currentParams.getAll('selected_departments');
      selectedDepts.forEach(deptId => params.append('selected_departments', deptId));
    if (selectedDepartments.length > 0) {
      selectedDepartments.forEach(id => params.append('dept', id));
    }
    return `/dashboard?${params.toString()}`;
  };

  const periods = [
    { value: 'this_month', label: 'This Month' },
    { value: 'last_month', label: 'Last Month' },
    { value: 'last_3_months', label: 'Last 3 Months' },
    { value: 'last_6_months', label: 'Last 6 Months' },
    { value: 'last_12_months', label: 'Last 12 Months' },
    { value: 'all', label: 'All Time' }
  ];

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-sm font-medium">Period:</span>
      <div className="flex gap-1 flex-wrap">
        {periods.map(period => (
          <a key={period.value} href={buildUrl(period.value)}>
            <Button 
              variant={currentPeriod === period.value ? 'default' : 'outline'} 
              size="sm"
            >
              {period.label}
            </Button>
          </a>
        ))}
      </div>
    </div>
  );
}

