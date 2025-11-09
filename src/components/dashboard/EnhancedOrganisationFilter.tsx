'use client';

import { useMemo, ChangeEvent } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuItem
} from '@/components/ui/dropdown-menu';

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
  currentDivisionId?: string;
  currentDepartmentId?: string;
  currentTeamId?: string;
  selectedDepartments: string[];
  divisions: Division[];
  departments: Department[];
  teams: Team[];
  onViewChange: (type: 'all' | 'division' | 'department' | 'team', id?: string) => void;
  onDepartmentMultiChange: (selected: string[]) => void;
  onDepartmentMultiClear: () => void;
};

export function EnhancedOrganisationFilter({
  currentDivisionId,
  currentDepartmentId,
  currentTeamId,
  selectedDepartments,
  divisions,
  departments,
  teams,
  onViewChange,
  onDepartmentMultiChange,
  onDepartmentMultiClear
}: Props) {
  const divisionLookup = useMemo(() => {
    const map = new Map<string, string>();
    divisions.forEach(div => map.set(div.division_id, div.division_name));
    return map;
  }, [divisions]);

  const groupedDepartments = useMemo(() => {
    const groups = new Map<string, Department[]>();
    departments.forEach(dept => {
      const divName = divisionLookup.get(dept.division_id) ?? 'Other';
      if (!groups.has(divName)) {
        groups.set(divName, []);
      }
      groups.get(divName)!.push(dept);
    });
    return Array.from(groups.entries());
  }, [departments, divisionLookup]);

  const currentViewValue = useMemo(() => {
    if (selectedDepartments.length > 0) return 'all';
    if (currentTeamId) return `team:${currentTeamId}`;
    if (currentDepartmentId) return `department:${currentDepartmentId}`;
    if (currentDivisionId) return `division:${currentDivisionId}`;
    return 'all';
  }, [selectedDepartments, currentTeamId, currentDepartmentId, currentDivisionId]);

  const handleViewSelect = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    if (value === 'all') {
      onViewChange('all');
      return;
    }
    const [type, id] = value.split(':');
    onViewChange(type as 'division' | 'department' | 'team', id);
  };

  const toggleDepartment = (deptId: string, checked: boolean) => {
    let next = selectedDepartments;
    if (checked) {
      if (!next.includes(deptId)) {
        next = [...next, deptId];
      }
    } else {
      next = next.filter(id => id !== deptId);
    }
    onDepartmentMultiChange(next);
  };

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <div className="flex items-center gap-2">
        <Label className="text-sm font-medium">View:</Label>
        <select
          className="border rounded px-3 py-1.5 text-sm min-w-[200px]"
          value={currentViewValue}
          onChange={handleViewSelect}
        >
          <option value="all">Whole of Business (ALL)</option>
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

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button type="button" variant="outline" size="sm">
            Multi-Select Departments{selectedDepartments.length > 0 ? ` (${selectedDepartments.length})` : ''}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="max-h-80 w-64 overflow-y-auto">
          <DropdownMenuLabel>Departments</DropdownMenuLabel>
          <DropdownMenuItem
            onSelect={(event) => {
              event.preventDefault();
              onDepartmentMultiClear();
              onViewChange('all');
            }}
          >
            Clear selection
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {groupedDepartments.map(([divisionName, items]) => (
            <div key={divisionName}>
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                {divisionName}
              </DropdownMenuLabel>
              {items.map(dept => (
                <DropdownMenuCheckboxItem
                  key={dept.department_id}
                  checked={selectedDepartments.includes(dept.department_id)}
                  onCheckedChange={(checked) => {
                    toggleDepartment(dept.department_id, Boolean(checked));
                  }}
                >
                  {dept.department_name}
                </DropdownMenuCheckboxItem>
              ))}
              <DropdownMenuSeparator />
            </div>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}


