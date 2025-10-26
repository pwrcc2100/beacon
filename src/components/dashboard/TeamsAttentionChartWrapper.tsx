'use client';
import { TeamsAttentionChart } from './TeamsAttentionChart';
import { useRouter } from 'next/navigation';

type TeamData = {
  name: string;
  score: number;
  id: string;
};

type Props = {
  teams: TeamData[];
  clientId: string;
  period: string;
  currentLevel: string;
  divisionId?: string;
  departmentId?: string;
};

export function TeamsAttentionChartWrapper({ 
  teams, 
  clientId, 
  period, 
  currentLevel,
  divisionId,
  departmentId 
}: Props) {
  const router = useRouter();

  const handleTeamClick = (teamId: string, teamName: string) => {
    const baseUrl = `/dashboard?client=${clientId}&period=${period}`;
    
    if (currentLevel === 'division') {
      router.push(`${baseUrl}&division_id=${teamId}`);
    } else if (currentLevel === 'department') {
      router.push(`${baseUrl}&division_id=${divisionId}&department_id=${teamId}`);
    } else if (currentLevel === 'team') {
      router.push(`${baseUrl}&division_id=${divisionId}&department_id=${departmentId}&team_id=${teamId}`);
    }
  };

  return (
    <TeamsAttentionChart 
      teams={teams}
      onTeamClick={handleTeamClick}
    />
  );
}



