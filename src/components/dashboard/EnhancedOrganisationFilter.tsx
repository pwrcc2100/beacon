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

  // Build hierarchical structure for dropdown
  const hierarchyOptions = useMemo(() => {
    const options: Array<{ value: string; label: string; indent: number }> = [];
    options.push({ value: 'all', label: 'Whole of Business (ALL)', indent: 0 });
    
    divisions.forEach(div => {
      options.push({ 
        value: `division:${div.division_id}`, 
        label: div.division_name, 
        indent: 1 
      });
      
      // Add departments under this division
      const depts = departments.filter(d => d.division_id === div.division_id);
      depts.forEach(dept => {
        options.push({ 
          value: `department:${dept.department_id}`, 
          label: dept.department_name, 
          indent: 2 
        });
        
        // Add teams under this department
        const teamList = teams.filter(t => t.department_id === dept.department_id);
        teamList.forEach(team => {
          options.push({ 
            value: `team:${team.team_id}`, 
            label: team.team_name, 
            indent: 3 
          });
        });
      });
    });
    
    return options;
  }, [divisions, departments, teams]);

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
          className="border rounded px-3 py-1.5 text-sm min-w-[280px] font-mono"
          value={currentViewValue}
          onChange={handleViewSelect}
        >
          {hierarchyOptions.map((opt, idx) => (
            <option 
              key={`${opt.value}-${idx}`} 
              value={opt.value}
              style={{ paddingLeft: `${opt.indent * 12}px` }}
            >
              {'\u00A0'.repeat(opt.indent * 2)}{opt.indent > 0 ? '└─ ' : ''}{opt.label}
            </option>
          ))}
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


