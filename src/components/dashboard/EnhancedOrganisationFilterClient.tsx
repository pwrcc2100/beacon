'use client';
import { useRouter } from 'next/navigation';
import { EnhancedOrganisationFilter } from './EnhancedOrganisationFilter';

type Division = {
  division_id: string;
  division_name: string;
};

type Department = {
  department_id: string;
  department_name: string;
  division_id: string;
};

type Team = {
  team_id: string;
  team_name: string;
  department_id: string;
};

type Props = {
  clientId: string;
  period: string;
  mode: 'historical' | 'live';
  currentDivisionId?: string;
  currentDepartmentId?: string;
  currentTeamId?: string;
  selectedDepartments: string[];
  divisions: Division[];
  departments: Department[];
  teams: Team[];
};

export function EnhancedOrganisationFilterClient({
  clientId,
  period,
  mode,
  currentDivisionId,
  currentDepartmentId,
  currentTeamId,
  selectedDepartments,
  divisions,
  departments,
  teams
}: Props) {
  const router = useRouter();

  const handleSelectionChange = (selected: string[], isAll: boolean) => {
    const params = new URLSearchParams();
    params.set('client', clientId);
    params.set('mode', mode);
    
    if (period !== 'all') params.set('period', period);
    
    if (isAll) {
      // Clear all filters for "ALL"
      // Don't add division/department/team params
    } else if (selected.length > 0) {
      // Multi-select departments
      selected.forEach(deptId => {
        params.append('selected_departments', deptId);
      });
    } else {
      // Single selection was made (handled by EnhancedOrganisationFilter's single select)
      if (currentTeamId) {
        params.set('division_id', currentDivisionId || '');
        params.set('department_id', currentDepartmentId || '');
        params.set('team_id', currentTeamId);
      } else if (currentDepartmentId) {
        params.set('division_id', currentDivisionId || '');
        params.set('department_id', currentDepartmentId);
      } else if (currentDivisionId) {
        params.set('division_id', currentDivisionId);
      }
    }
    
    router.push(`/dashboard?${params.toString()}`);
  };

  return (
    <EnhancedOrganisationFilter
      clientId={clientId}
      period={period}
      currentDivisionId={currentDivisionId}
      currentDepartmentId={currentDepartmentId}
      currentTeamId={currentTeamId}
      selectedDepartments={selectedDepartments}
      divisions={divisions}
      departments={departments}
      teams={teams}
      onSelectionChange={handleSelectionChange}
    />
  );
}



