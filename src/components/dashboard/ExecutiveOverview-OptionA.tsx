'use client';

/**
 * DESIGN OPTION A: Card-Based Modern
 * Inspired by: H-care and Good UX dashboards
 * Features:
 * - Top row: 4 clean metric cards with icons
 * - Soft color palette with rounded cards
 * - Better visual hierarchy
 * - Modern spacing and typography
 */

import type { ExecutiveInsight } from '@/lib/executiveInsights';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  formatPercent,
  getScoreStatus,
  SCORE_COLORS,
} from './scoreTheme';
import { TeamsAttentionChart } from './TeamsAttentionChart';

const QUESTION_META = [
  { key: 'sentiment', label: 'Q1', description: 'How are you feeling about work this week?' },
  { key: 'clarity', label: 'Q2', description: 'How clear are you about your priorities?' },
  { key: 'workload', label: 'Q3', description: 'How manageable is your current workload?' },
  { key: 'safety', label: 'Q4', description: 'How comfortable do you feel speaking up?' },
  { key: 'leadership', label: 'Q5', description: 'How supported do you feel by your immediate leadership?' },
] as const;

type QuestionScores = Record<'sentiment' | 'clarity' | 'workload' | 'safety' | 'leadership', number>;

type TrendPoint = {
  label: string;
  wellbeing: number;
  safety: number;
};

type TeamScore = {
  id: string;
  name: string;
  wellbeing: number;
};

type DivisionRow = {
  id: string;
  name: string;
  response_count: number;
  total_employees?: number;
  sentiment_avg: number;
  clarity_avg: number;
  workload_avg: number;
  safety_avg: number;
  leadership_avg: number;
  wellbeing_score: number;
};

type ExecutiveOverviewProps = {
  overallScore?: number;
  previousScore?: number;
  trendSeries: TrendPoint[];
  questionScores: QuestionScores;
  participationRate: number;
  teams: TeamScore[];
  divisions: DivisionRow[];
  insights: ExecutiveInsight[];
  attentionLabel?: string;
  tableTitle?: string;
  onDivisionClick?: (divisionId: string, divisionName: string) => void;
};

// Metric Card Component
function MetricCard({ 
  icon, 
  label, 
  value, 
  trend, 
  color 
}: { 
  icon: string; 
  label: string; 
  value: string | number; 
  trend?: string; 
  color: string;
}) {
  return (
    <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm text-gray-600 mb-2">{label}</p>
            <p className="text-3xl font-bold" style={{ color }}>{value}</p>
            {trend && (
              <p className="text-xs text-gray-500 mt-2">{trend}</p>
            )}
          </div>
          <div 
            className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
            style={{ backgroundColor: `${color}20` }}
          >
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Question Bar Component
function QuestionBar({ label, description, value }: { label: string; description: string; value: number }) {
  const status = getScoreStatus(Math.round(value));
  const percentage = (value / 5) * 100;
  
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-gray-700">{label} · {description}</span>
        <span className="font-bold" style={{ color: status.color }}>{Math.round(value * 20)}%</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div 
          className="h-full rounded-full transition-all duration-500"
          style={{ 
            width: `${percentage}%`,
            backgroundColor: status.color
          }}
        />
      </div>
    </div>
  );
}

export default function ExecutiveOverviewOptionA({
  overallScore = 0,
  previousScore,
  trendSeries,
  questionScores,
  participationRate,
  teams,
  divisions,
  insights,
  attentionLabel = 'Which Teams Need Attention',
  tableTitle = 'Divisions',
  onDivisionClick,
}: ExecutiveOverviewProps) {
  
  const router = useRouter();
  const status = getScoreStatus(Math.round(overallScore));
  const trend = previousScore ? overallScore - previousScore : 0;
  const trendText = trend > 0 ? `+${trend.toFixed(1)}%` : `${trend.toFixed(1)}%`;
  
  const teamsNeedingAttention = teams.filter(t => t.wellbeing < 65).length;
  
  const handleTeamClick = (teamId: string, teamName: string) => {
    router.push(`/dashboard/group-leader?team_id=${teamId}`);
  };
  
  const handleInsightClick = (insight: ExecutiveInsight) => {
    if (insight.relatedEntities && insight.relatedEntities.length > 0) {
      const entity = insight.relatedEntities[0];
      if (entity.type === 'team') {
        router.push(`/dashboard/group-leader?team_id=${entity.id}`);
      }
    }
  };
  
  return (
    <div className="space-y-6 p-6 bg-gray-50 rounded-lg">
      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          icon="💚"
          label="Overall Wellbeing"
          value={`${Math.round(overallScore)}%`}
          trend={previousScore ? trendText + ' vs previous' : undefined}
          color={status.color}
        />
        <MetricCard
          icon="👥"
          label="Participation Rate"
          value={`${Math.round(participationRate)}%`}
          color={participationRate >= 70 ? SCORE_COLORS.thriving : participationRate >= 40 ? SCORE_COLORS.watch : SCORE_COLORS.alert}
        />
        <MetricCard
          icon="⚠️"
          label="Teams Needing Attention"
          value={teamsNeedingAttention}
          trend={`out of ${teams.length} teams`}
          color={teamsNeedingAttention > 5 ? SCORE_COLORS.alert : teamsNeedingAttention > 2 ? SCORE_COLORS.watch : SCORE_COLORS.thriving}
        />
        <MetricCard
          icon="📈"
          label="Trend"
          value={trend > 0 ? '↗' : trend < 0 ? '↘' : '→'}
          trend={`${Math.abs(trend).toFixed(1)}% change`}
          color={trend > 0 ? SCORE_COLORS.thriving : trend < -5 ? SCORE_COLORS.alert : SCORE_COLORS.watch}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current Sentiment - Takes 2 columns */}
        <Card className="lg:col-span-2 border-none shadow-md">
          <CardHeader>
            <CardTitle className="text-lg">Current Sentiment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {QUESTION_META.map(({ key, label, description }) => (
              <QuestionBar
                key={key}
                label={label}
                description={description}
                value={questionScores[key] ?? 0}
              />
            ))}
          </CardContent>
        </Card>

        {/* Key Insights */}
        <Card className="border-none shadow-md">
          <CardHeader>
            <CardTitle className="text-lg">Key Insights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {insights.slice(0, 3).map((insight, idx) => {
              const colors = insight.type === 'positive' ? SCORE_COLORS.thriving :
                            insight.type === 'warning' ? SCORE_COLORS.alert :
                            SCORE_COLORS.watch;
              const isClickable = insight.relatedEntities && insight.relatedEntities.length > 0;
              
              return (
                <div 
                  key={idx}
                  className={cn(
                    "p-3 rounded-lg border-l-4",
                    isClickable && "cursor-pointer hover:opacity-80 transition-opacity"
                  )}
                  style={{ 
                    borderLeftColor: colors,
                    backgroundColor: `${colors}10`
                  }}
                  onClick={() => isClickable && handleInsightClick(insight)}
                >
                  <p className="text-xs text-gray-700">{insight.text}</p>
                  {insight.recommendation && (
                    <p className="text-xs text-gray-500 mt-1">{insight.recommendation}</p>
                  )}
                  {isClickable && (
                    <p className="text-xs text-blue-600 mt-1 font-medium">→ Click to view details</p>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Beacon Index - Teams Bar Chart */}
      <TeamsAttentionChart 
        teams={teams.map(t => ({ id: t.id, name: t.name, score: t.wellbeing }))}
        onTeamClick={handleTeamClick}
      />

      {/* Divisions Table */}
      <Card className="border-none shadow-md">
        <CardHeader>
          <CardTitle className="text-lg">{tableTitle}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Division</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Overall</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Sentiment</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Clarity</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Workload</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Safety</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Leadership</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Participation</th>
                </tr>
              </thead>
              <tbody>
                {divisions.map(row => {
                  const wellbeing = Math.round(row.wellbeing_score ?? 0);
                  const sentiment = Math.round(row.sentiment_avg * 20);
                  const clarity = Math.round(row.clarity_avg * 20);
                  const workload = Math.round(row.workload_avg * 20);
                  const safety = Math.round(row.safety_avg * 20);
                  const leadership = Math.round(row.leadership_avg * 20);
                  const participation = row.total_employees && row.total_employees > 0 
                    ? Math.round((row.response_count / row.total_employees) * 100)
                    : 0;
                  
                  const getCellStyle = (score: number) => {
                    const status = getScoreStatus(score);
                    return {
                      backgroundColor: `${status.color}25`,
                      color: score < 50 ? '#7F1D1D' : score < 70 ? '#78350F' : '#064E3B',
                      fontWeight: 600
                    };
                  };
                  
                  return (
                    <tr 
                      key={row.id}
                      className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => onDivisionClick && onDivisionClick(row.id, row.name)}
                    >
                      <td className="py-3 px-4 font-semibold text-gray-800">{row.name}</td>
                      <td className="py-3 px-4 text-center rounded-md" style={getCellStyle(wellbeing)}>
                        {formatPercent(wellbeing)}
                      </td>
                      <td className="py-3 px-4 text-center rounded-md" style={getCellStyle(sentiment)}>
                        {formatPercent(sentiment)}
                      </td>
                      <td className="py-3 px-4 text-center rounded-md" style={getCellStyle(clarity)}>
                        {formatPercent(clarity)}
                      </td>
                      <td className="py-3 px-4 text-center rounded-md" style={getCellStyle(workload)}>
                        {formatPercent(workload)}
                      </td>
                      <td className="py-3 px-4 text-center rounded-md" style={getCellStyle(safety)}>
                        {formatPercent(safety)}
                      </td>
                      <td className="py-3 px-4 text-center rounded-md" style={getCellStyle(leadership)}>
                        {formatPercent(leadership)}
                      </td>
                      <td className="py-3 px-4 text-center rounded-md" style={getCellStyle(participation)}>
                        {participation > 0 ? `${participation}%` : 'N/A'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

