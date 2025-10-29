'use client';
import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

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
  selectedDepartments?: string[];
  divisions: Division[];
  departments: Department[];
  teams: Team[];
  onSelectionChange: (selected: string[], isAll: boolean) => void;
};

export function EnhancedOrganisationFilter({ 
  clientId, 
  period, 
  currentDivisionId, 
  currentDepartmentId, 
  currentTeamId,
  selectedDepartments = [],
  divisions,
  departments,
  teams,
  onSelectionChange
}: Props) {
  const [showMultiSelect, setShowMultiSelect] = useState(false);
  const [tempSelections, setTempSelections] = useState<string[]>(selectedDepartments);

  const handleSingleSelect = (value: string) => {
    if (value === 'all') {
      onSelectionChange([], true);
      return;
    }
    
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
  };

  const handleApplyMultiSelect = () => {
    onSelectionChange(tempSelections, false);
    setShowMultiSelect(false);
  };

  const toggleDepartment = (deptId: string) => {
    setTempSelections(prev => 
      prev.includes(deptId) 
        ? prev.filter(id => id !== deptId)
        : [...prev, deptId]
    );
  };

  const currentValue = currentTeamId 
    ? `team:${currentTeamId}` 
    : currentDepartmentId 
    ? `department:${currentDepartmentId}` 
    : currentDivisionId 
    ? `division:${currentDivisionId}` 
    : 'all';

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <Label className="text-sm font-medium">View:</Label>
      
      {/* Single Select Dropdown */}
      <select 
        className="border rounded px-3 py-1.5 text-sm min-w-[200px]"
        onChange={(e) => handleSingleSelect(e.target.value)}
        value={currentValue}
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

      {/* Multi-Select Button */}
      <Button 
        type="button"
        variant="outline" 
        size="sm"
        onClick={() => {
          setTempSelections(selectedDepartments);
          setShowMultiSelect(!showMultiSelect);
        }}
      >
        Multi-Select Departments
      </Button>

      {/* Show selected departments count */}
      {selectedDepartments.length > 0 && !showMultiSelect && (
        <span className="text-sm text-muted-foreground">
          ({selectedDepartments.length} selected)
        </span>
      )}

      {/* Multi-Select Dropdown */}
      {showMultiSelect && (
        <div className="absolute z-50 mt-2 bg-white border rounded-lg shadow-lg p-4 min-w-[300px] max-h-[400px] overflow-y-auto">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-sm">Select Departments</h3>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowMultiSelect(false)}
            >
              ✕
            </Button>
          </div>
          
          <div className="mb-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full mb-2"
              onClick={() => {
                setTempSelections(departments.map(d => d.department_id));
              }}
            >
              Select All
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => setTempSelections([])}
            >
              Clear All
            </Button>
          </div>

          <div className="space-y-2">
            {departments.map(dept => (
              <label key={dept.department_id} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                <input
                  type="checkbox"
                  checked={tempSelections.includes(dept.department_id)}
                  onChange={() => toggleDepartment(dept.department_id)}
                  className="rounded"
                />
                <span className="text-sm">{dept.department_name}</span>
              </label>
            ))}
          </div>

          <div className="mt-4 flex gap-2">
            <Button
              type="button"
              size="sm"
              className="flex-1"
              onClick={handleApplyMultiSelect}
            >
              Apply
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowMultiSelect(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}


