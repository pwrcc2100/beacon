'use client';
import { useState, useEffect, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import ReactECharts from 'echarts-for-react';
import { getScoreStatus, SCORE_COLORS, SCORE_THRESHOLDS } from './scoreTheme';
import { Button } from '@/components/ui/button';

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
  const [sortMode, setSortMode] = useState<'score' | 'name'>('score');
  useEffect(() => { setMounted(true); }, []);

  if (teams.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Team Index Score</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No team data available yet</p>
        </CardContent>
      </Card>
    );
  }

  const sortedTeams = useMemo(() => {
    const copy = [...teams];
    if (sortMode === 'score') {
      copy.sort((a, b) => a.score - b.score);
    } else {
      copy.sort((a, b) => a.name.localeCompare(b.name));
    }
    return copy;
  }, [teams, sortMode]);

  const colors = sortedTeams.map(t => getScoreStatus(t.score).color);

  // Find lowest and highest scoring teams for action text
  const lowestTeam = sortedTeams[0];
  const highestTeam = sortedTeams[sortedTeams.length - 1];
  const highAlertTeams = sortedTeams.filter(t => t.score < SCORE_THRESHOLDS.watch);
  const watchTeams = sortedTeams.filter(
    t => t.score >= SCORE_THRESHOLDS.watch && t.score < SCORE_THRESHOLDS.thriving
  );

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
    dataZoom: sortedTeams.length > 10 ? [
      {
        type: 'inside',
        xAxisIndex: 0,
        startValue: 0,
        endValue: 9,
        minValueSpan: 10,
        maxValueSpan: 10,
      },
      {
        type: 'slider',
        xAxisIndex: 0,
        bottom: 20,
        height: 14,
        startValue: 0,
        endValue: 9,
        minValueSpan: 10,
        maxValueSpan: 10,
        handleSize: 12,
      },
    ] : undefined,
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
        formatter: '{c}%',
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
        return `<strong>${team.name}</strong><br/>Wellbeing Score: ${Math.round(team.score)}%`;
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <CardTitle>Team Index Score</CardTitle>
          <div className="inline-flex rounded-md border border-black/10">
            <Button
              type="button"
              variant={sortMode === 'score' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setSortMode('score')}
              className="rounded-none"
            >
              Sort by score
            </Button>
            <Button
              type="button"
              variant={sortMode === 'name' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setSortMode('name')}
              className="rounded-none"
            >
              Sort by name
            </Button>
          </div>
        </div>
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
        <div className="bg-slate-50 border-l-4 border-slate-400 p-4 rounded">
          <div className="flex items-start gap-2">
            <span className="text-xl">🎯</span>
            <div className="flex-1">
              <div className="font-semibold text-slate-900 mb-1">Action needed:</div>
              <p className="text-sm text-blue-800">
                {highAlertTeams.length > 0 ? (
                  <>
                    <strong>{lowestTeam.name}</strong> is in high alert ({Math.round(lowestTeam.score)}%).
                    {highAlertTeams.length > 1 && ` ${highAlertTeams.length - 1} additional team${highAlertTeams.length > 2 ? 's are' : ' is'} also below ${SCORE_THRESHOLDS.watch}%.`}
                    {watchTeams.length > 0 && (
                      <> Ones to watch: {watchTeams.map(t => t.name).slice(0, 3).join(', ')}{watchTeams.length > 3 ? '…' : ''}.</>
                    )}
                    {' '}Prioritise targeted check-ins and workload review for these teams.
                  </>
                ) : (
                  <>
                    All teams are performing well. Continue monitoring for any changes and maintain current support levels.
                  </>
                )}
              </p>
              {highAlertTeams.length > 0 && (
                <button
                  onClick={() => onTeamClick && onTeamClick(lowestTeam.id, lowestTeam.name)}
                  className="text-sm text-slate-700 hover:text-slate-900 font-medium mt-2 underline"
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
            <div className="w-4 h-4 rounded" style={{ backgroundColor: SCORE_COLORS.alert }}></div>
            <span className="text-muted-foreground">High Alert (&lt;{SCORE_THRESHOLDS.watch}%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: SCORE_COLORS.watch }}></div>
            <span className="text-muted-foreground">Ones to Watch ({SCORE_THRESHOLDS.watch}–{SCORE_THRESHOLDS.thriving - 1}%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: SCORE_COLORS.thriving }}></div>
            <span className="text-muted-foreground">Thriving ({SCORE_THRESHOLDS.thriving}%+)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}





