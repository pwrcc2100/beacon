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
  basePath?: string; // Optional base path for redirects (defaults to /dashboard)
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
  teams,
  basePath = '/dashboard'
}: Props) {
  const router = useRouter();

  const buildBaseParams = () => {
    const params = new URLSearchParams();
    params.set('client', clientId);
    params.set('mode', mode);
    
    if (period !== 'all') params.set('period', period);
    return params;
  };

  const handleViewChange = (type: 'all' | 'division' | 'department' | 'team', id?: string) => {
    const params = buildBaseParams();

    if (type === 'division' && id) {
      params.set('division_id', id);
    } else if (type === 'department' && id) {
      const dept = departments.find(d => d.department_id === id);
      if (dept) {
        params.set('division_id', dept.division_id);
        params.set('department_id', id);
      }
    } else if (type === 'team' && id) {
      const team = teams.find(t => t.team_id === id);
      if (team) {
        const dept = departments.find(d => d.department_id === team.department_id);
        if (dept) {
          params.set('division_id', dept.division_id);
          params.set('department_id', dept.department_id);
        }
        params.set('team_id', id);
      }
    }

    router.push(`${basePath}?${params.toString()}`);
  };

  const handleDepartmentMultiChange = (selected: string[]) => {
    const params = buildBaseParams();
    selected.forEach(deptId => {
      params.append('selected_departments', deptId);
    });
    router.push(`${basePath}?${params.toString()}`);
  };

  const handleClearDepartments = () => {
    const params = buildBaseParams();
    router.push(`${basePath}?${params.toString()}`);
  };

  return (
    <EnhancedOrganisationFilter
      currentDivisionId={currentDivisionId}
      currentDepartmentId={currentDepartmentId}
      currentTeamId={currentTeamId}
      selectedDepartments={selectedDepartments}
      divisions={divisions}
      departments={departments}
      teams={teams}
      onViewChange={handleViewChange}
      onDepartmentMultiChange={handleDepartmentMultiChange}
      onDepartmentMultiClear={handleClearDepartments}
    />
  );
}



