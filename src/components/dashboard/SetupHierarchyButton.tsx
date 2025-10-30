'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

type Props = {
  clientId: string;
};

export function SetupHierarchyButton({ clientId }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string>('');
  const [divisions, setDivisions] = useState('Sydney Metro\nRegional\nQLD');
  const [departments, setDepartments] = useState('Aged Care\nResidential\nHealth\nEducation');
  const [teams, setTeams] = useState('Team A\nTeam B\nTeam C');

  const handleSetup = async () => {
    setLoading(true);
    setMessage('');
    
    try {
      const hierarchy = {
        divisions: divisions.split('\n').map(s => s.trim()).filter(Boolean),
        departments_per_division: departments.split('\n').map(s => s.trim()).filter(Boolean),
        teams_per_department: teams.split('\n').map(s => s.trim()).filter(Boolean),
      };

      if (hierarchy.divisions.length === 0 || hierarchy.departments_per_division.length === 0 || hierarchy.teams_per_department.length === 0) {
        setMessage('❌ Please fill in all fields');
        setLoading(false);
        return;
      }

      const response = await fetch('/api/client/setup-hierarchy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
        body: JSON.stringify({ client_id: clientId, hierarchy })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to setup hierarchy');
      }

      setMessage(`✅ Success! Created ${data.summary.divisions} divisions, ${data.summary.departments} departments, ${data.summary.teams} teams.`);
      setIsOpen(false);
      
      // Refresh page after a delay
      setTimeout(() => {
        window.location.reload();
      }, 2000);
      
    } catch (error: any) {
      setMessage(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
      >
        Setup Hierarchy
      </Button>
    );
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Setup Organizational Hierarchy</CardTitle>
        <CardDescription>
          Define your organization's structure: Divisions → Departments → Teams
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="divisions">Divisions (one per line)</Label>
          <textarea
            id="divisions"
            value={divisions}
            onChange={(e) => setDivisions(e.target.value)}
            placeholder="Sydney Metro&#10;Regional&#10;QLD"
            rows={3}
            className="w-full p-2 border rounded-md font-mono text-sm"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Top level (e.g., Regions, Business Units)
          </p>
        </div>

        <div>
          <Label htmlFor="departments">Departments per Division (one per line)</Label>
          <textarea
            id="departments"
            value={departments}
            onChange={(e) => setDepartments(e.target.value)}
            placeholder="Aged Care&#10;Residential&#10;Health&#10;Education"
            rows={4}
            className="w-full p-2 border rounded-md font-mono text-sm"
          />
          <p className="text-xs text-muted-foreground mt-1">
            These will be created under each division
          </p>
        </div>

        <div>
          <Label htmlFor="teams">Teams per Department (one per line)</Label>
          <textarea
            id="teams"
            value={teams}
            onChange={(e) => setTeams(e.target.value)}
            placeholder="Team A&#10;Team B&#10;Team C"
            rows={3}
            className="w-full p-2 border rounded-md font-mono text-sm"
          />
          <p className="text-xs text-muted-foreground mt-1">
            These will be created under each department
          </p>
        </div>

        {message && (
          <div className={`text-sm p-3 rounded ${message.startsWith('✅') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
            {message}
          </div>
        )}

        <div className="flex gap-2">
          <Button
            type="button"
            onClick={handleSetup}
            disabled={loading}
          >
            {loading ? 'Setting up...' : 'Create Hierarchy'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setIsOpen(false);
              setMessage('');
            }}
            disabled={loading}
          >
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

