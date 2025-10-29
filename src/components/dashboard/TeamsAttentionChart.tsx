'use client';
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import ReactECharts from 'echarts-for-react';

type TeamData = {
  name: string;
  score: number;
  id: string;
};

type Props = {
  teams: TeamData[];
  onTeamClick?: (teamId: string, teamName: string) => void;
};

export function TeamsAttentionChart({ teams, onTeamClick }: Props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  if (teams.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Which teams need attention?</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No team data available yet</p>
        </CardContent>
      </Card>
    );
  }

  // Sort teams by score (lowest first = needs most attention)
  const sortedTeams = [...teams].sort((a, b) => a.score - b.score);

  // Determine colors based on score
  const getColor = (score: number) => {
    if (score >= 70) return '#10b981'; // Green
    if (score >= 55) return '#f59e0b'; // Orange
    return '#ef4444'; // Red
  };

  const colors = sortedTeams.map(t => getColor(t.score));

  // Find lowest and highest scoring teams for action text
  const lowestTeam = sortedTeams[0];
  const highestTeam = sortedTeams[sortedTeams.length - 1];
  const needsAttention = sortedTeams.filter(t => t.score < 60);

  const option = {
    grid: { 
      top: 30, 
      right: 40, 
      bottom: 80, 
      left: 80 
    },
    xAxis: {
      type: 'category',
      data: sortedTeams.map(t => t.name),
      axisLabel: { 
        fontSize: 12,
        interval: 0,
        rotate: 45,
        color: '#4b5563'
      },
      axisLine: {
        lineStyle: { color: '#e5e7eb' }
      }
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 100,
      name: 'Average Wellbeing Score',
      nameLocation: 'middle',
      nameGap: 50,
      nameTextStyle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#4b5563'
      },
      axisLabel: { 
        fontSize: 11,
        color: '#6b7280'
      },
      axisLine: {
        lineStyle: { color: '#e5e7eb' }
      },
      splitLine: {
        lineStyle: { color: '#f3f4f6' }
      }
    },
    series: [{
      type: 'bar',
      data: sortedTeams.map((t, i) => ({
        value: t.score,
        itemStyle: { color: colors[i] }
      })),
      barWidth: '60%',
      label: {
        show: true,
        position: 'top',
        formatter: '{c}',
        fontSize: 11,
        fontWeight: 'bold'
      }
    }],
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter: (params: any) => {
        const data = params[0];
        const team = sortedTeams[data.dataIndex];
        return `<strong>${team.name}</strong><br/>Wellbeing Score: ${team.score}/100`;
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Which teams need attention?</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {mounted ? (
          <ReactECharts
            option={option}
            style={{ height: 400 }}
            opts={{ renderer: 'svg' }}
            onEvents={{
              click: (params: any) => {
                const team = sortedTeams[params.dataIndex];
                if (onTeamClick) {
                  onTeamClick(team.id, team.name);
                }
              }
            }}
          />
        ) : (
          <div style={{ height: 400 }} className="flex items-center justify-center bg-gray-50 rounded">
            Loading chart...
          </div>
        )}

        {/* Action Summary */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
          <div className="flex items-start gap-2">
            <span className="text-xl">🎯</span>
            <div className="flex-1">
              <div className="font-semibold text-blue-900 mb-1">Action needed:</div>
              <p className="text-sm text-blue-800">
                {needsAttention.length > 0 ? (
                  <>
                    <strong>{lowestTeam.name}</strong> shows lowest wellbeing scores ({lowestTeam.score}/100){needsAttention.length > 1 && ` along with ${needsAttention.length - 1} other team${needsAttention.length > 2 ? 's' : ''}`}. 
                    {highestTeam.score >= 70 && (
                      <> <strong>{highestTeam.name}</strong> is thriving ({highestTeam.score}/100).</>
                    )}
                    {' '}Consider workload redistribution or additional resources for lower-scoring teams.
                  </>
                ) : (
                  <>
                    All teams are performing well. Continue monitoring for any changes and maintain current support levels.
                  </>
                )}
              </p>
              {needsAttention.length > 0 && (
                <button
                  onClick={() => onTeamClick && onTeamClick(lowestTeam.id, lowestTeam.name)}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium mt-2 underline"
                >
                  → View {lowestTeam.name} details
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Color Legend */}
        <div className="flex items-center justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#ef4444' }}></div>
            <span className="text-muted-foreground">High Risk (&lt;55)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#f59e0b' }}></div>
            <span className="text-muted-foreground">Moderate (55-69)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#10b981' }}></div>
            <span className="text-muted-foreground">Thriving (70+)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}





