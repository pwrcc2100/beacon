'use client';

import { useRouter } from 'next/navigation';
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

type Props = {
  clientId: string;
  period: string;
  mode: string;
  currentDivisionId?: string;
  currentDepartmentId?: string;
  divisions: Division[];
  departments: Department[];
};

export function GroupLeaderFilters({
  clientId,
  period,
  mode,
  currentDivisionId,
  currentDepartmentId,
  divisions,
  departments
}: Props) {
  const router = useRouter();

  const handleDivisionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const divisionId = e.target.value;
    const params = new URLSearchParams();
    params.set('client', clientId);
    params.set('period', period);
    params.set('mode', mode);
    if (divisionId) {
      params.set('division_id', divisionId);
    }
    router.push(`/dashboard/group-leader?${params.toString()}`);
  };

  const handleDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const departmentId = e.target.value;
    const params = new URLSearchParams();
    params.set('client', clientId);
    params.set('period', period);
    params.set('mode', mode);
    if (currentDivisionId) {
      params.set('division_id', currentDivisionId);
    }
    if (departmentId) {
      params.set('department_id', departmentId);
    }
    router.push(`/dashboard/group-leader?${params.toString()}`);
  };

  const filteredDepartments = currentDivisionId
    ? departments.filter(d => d.division_id === currentDivisionId)
    : departments;

  return (
    <div className="flex items-center gap-4 flex-wrap">
      <div className="flex items-center gap-2">
        <Label className="text-sm font-medium">Division:</Label>
        <select
          className="border rounded px-3 py-1.5 text-sm min-w-[180px]"
          value={currentDivisionId || ''}
          onChange={handleDivisionChange}
        >
          <option value="">All Divisions</option>
          {divisions.map(div => (
            <option key={div.division_id} value={div.division_id}>
              {div.division_name}
            </option>
          ))}
        </select>
      </div>

      {currentDivisionId && (
        <div className="flex items-center gap-2">
          <Label className="text-sm font-medium">Department:</Label>
          <select
            className="border rounded px-3 py-1.5 text-sm min-w-[180px]"
            value={currentDepartmentId || ''}
            onChange={handleDepartmentChange}
          >
            <option value="">All Departments</option>
            {filteredDepartments.map(dept => (
              <option key={dept.department_id} value={dept.department_id}>
                {dept.department_name}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}


