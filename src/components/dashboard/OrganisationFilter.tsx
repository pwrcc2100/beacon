'use client';
import { Label } from '@/components/ui/label';

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
  currentDivisionId?: string;
  currentDepartmentId?: string;
  currentTeamId?: string;
  divisions: Division[];
  departments: Department[];
  teams: Team[];
};

export function OrganisationFilter({ 
  clientId, 
  period, 
  currentDivisionId, 
  currentDepartmentId, 
  currentTeamId,
  divisions,
  departments,
  teams
}: Props) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === 'all') {
      window.location.href = `/dashboard?client=${clientId}&period=${period}`;
    } else {
      const [type, id] = value.split(':');
      if (type === 'division') {
        window.location.href = `/dashboard?client=${clientId}&period=${period}&division_id=${id}`;
      } else if (type === 'department') {
        const dept = departments.find(d => d.department_id === id);
        window.location.href = `/dashboard?client=${clientId}&period=${period}&division_id=${dept?.division_id}&department_id=${id}`;
      } else if (type === 'team') {
        const team = teams.find(t => t.team_id === id);
        const dept = departments.find(d => d.department_id === team?.department_id);
        window.location.href = `/dashboard?client=${clientId}&period=${period}&division_id=${dept?.division_id}&department_id=${dept?.department_id}&team_id=${id}`;
      }
    }
  };

  const currentValue = currentTeamId 
    ? `team:${currentTeamId}` 
    : currentDepartmentId 
    ? `department:${currentDepartmentId}` 
    : currentDivisionId 
    ? `division:${currentDivisionId}` 
    : 'all';

  return (
    <div className="flex items-center gap-2">
      <Label className="text-sm font-medium">View:</Label>
      <select 
        className="border rounded px-3 py-1.5 text-sm min-w-[200px]"
        onChange={handleChange}
        value={currentValue}
      >
        <option value="all">Whole of Business</option>
        {divisions.length > 0 && (
          <optgroup label="Divisions">
            {divisions.map(div => (
              <option key={div.division_id} value={`division:${div.division_id}`}>
                {div.division_name}
              </option>
            ))}
          </optgroup>
        )}
        {departments.length > 0 && (
          <optgroup label="Departments">
            {departments.map(dept => (
              <option key={dept.department_id} value={`department:${dept.department_id}`}>
                {dept.department_name}
              </option>
            ))}
          </optgroup>
        )}
        {teams.length > 0 && (
          <optgroup label="Teams">
            {teams.map(team => (
              <option key={team.team_id} value={`team:${team.team_id}`}>
                {team.team_name}
              </option>
            ))}
          </optgroup>
        )}
      </select>
    </div>
  );
}



