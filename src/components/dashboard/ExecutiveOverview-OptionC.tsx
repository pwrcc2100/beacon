'use client';

/**
 * DESIGN OPTION C: Data-Dense Professional
 * Features:
 * - Maximum information density
 * - 3-column layout for efficient space use
 * - Enhanced typography and spacing
 * - Professional corporate aesthetic
 * - All key metrics visible at once
 */

import type { ExecutiveInsight } from '@/lib/executiveInsights';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useMemo } from 'react';
import {
  formatPercent,
  getScoreStatus,
  SCORE_COLORS,
} from './scoreTheme';

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

// Compact Gauge
function CompactGauge({ value, previous, label }: { value: number; previous?: number; label: string }) {
  const status = getScoreStatus(Math.round(value));
  const percentage = (value / 100) * 180;
  const trend = previous ? value - previous : 0;
  
  return (
    <div className="flex flex-col items-center">
      <svg width="140" height="80" viewBox="0 0 140 80">
        <path
          d="M 20 70 A 50 50 0 0 1 120 70"
          fill="none"
          stroke="#E5E7EB"
          strokeWidth="12"
          strokeLinecap="round"
        />
        <path
          d="M 20 70 A 50 50 0 0 1 120 70"
          fill="none"
          stroke={status.color}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={`${percentage / 2} 157`}
        />
      </svg>
      <div className="text-3xl font-bold -mt-6" style={{ color: status.color }}>
        {Math.round(value)}%
      </div>
      {previous && (
        <div className="text-xs text-gray-500 mt-1">
          {trend > 0 ? '↗' : trend < 0 ? '↘' : '→'} {Math.abs(trend).toFixed(1)}%
        </div>
      )}
      <div className="text-xs font-medium text-gray-600 mt-1">{label}</div>
    </div>
  );
}

// Mini Insight
function MiniInsight({ insight }: { insight: ExecutiveInsight }) {
  const iconMap = {
    positive: '✓',
    warning: '!',
    attention: '→',
    neutral: '•'
  };
  const colorMap = {
    positive: SCORE_COLORS.thriving,
    warning: SCORE_COLORS.alert,
    attention: SCORE_COLORS.watch,
    neutral: '#6B7280'
  };
  
  return (
    <div className="flex gap-2 p-2 rounded border-l-2" style={{ borderLeftColor: colorMap[insight.type] }}>
      <span className="text-sm font-bold" style={{ color: colorMap[insight.type] }}>
        {iconMap[insight.type]}
      </span>
      <div className="flex-1 min-w-0">
        <div className="text-xs text-gray-700">{insight.text}</div>
        {insight.recommendation && (
          <div className="text-xs text-gray-500 mt-0.5">{insight.recommendation}</div>
        )}
      </div>
    </div>
  );
}

export default function ExecutiveOverviewOptionC({
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
  
  const teamsNeedingAttention = teams.filter(t => t.wellbeing < 65).length;
  
  return (
    <div className="space-y-4">
      {/* Compact Metrics Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border border-gray-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold" style={{ color: getScoreStatus(Math.round(overallScore)).color }}>
              {Math.round(overallScore)}%
            </div>
            <div className="text-xs text-gray-600 mt-1">Beacon Index</div>
          </CardContent>
        </Card>
        
        <Card className="border border-gray-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold" style={{ 
              color: participationRate >= 70 ? SCORE_COLORS.thriving : 
                     participationRate >= 40 ? SCORE_COLORS.watch : 
                     SCORE_COLORS.alert 
            }}>
              {Math.round(participationRate)}%
            </div>
            <div className="text-xs text-gray-600 mt-1">Participation</div>
          </CardContent>
        </Card>
        
        <Card className="border border-gray-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold" style={{ 
              color: teamsNeedingAttention > 5 ? SCORE_COLORS.alert : 
                     teamsNeedingAttention > 2 ? SCORE_COLORS.watch : 
                     SCORE_COLORS.thriving 
            }}>
              {teamsNeedingAttention}
            </div>
            <div className="text-xs text-gray-600 mt-1">Teams at Risk</div>
          </CardContent>
        </Card>
        
        <Card className="border border-gray-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-700">
              {divisions.length}
            </div>
            <div className="text-xs text-gray-600 mt-1">Divisions</div>
          </CardContent>
        </Card>
      </div>

      {/* 3-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Column 1: Gauge */}
        <Card className="border border-gray-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Beacon Index</CardTitle>
          </CardHeader>
          <CardContent>
            <CompactGauge value={overallScore} previous={previousScore} label="Overall Score" />
            
            {/* Weighting Formula - Compact */}
            <div className="mt-4 p-3 bg-gray-50 rounded text-xs">
              <div className="font-semibold text-gray-700 mb-2">Weighting</div>
              <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-600">Sentiment</span>
                  <span className="font-semibold">25%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Workload</span>
                  <span className="font-semibold">25%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Safety</span>
                  <span className="font-semibold">20%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Leadership</span>
                  <span className="font-semibold">20%</span>
                </div>
                <div className="flex justify-between col-span-2">
                  <span className="text-gray-600">Clarity</span>
                  <span className="font-semibold">10%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Column 2: Sentiment Bars */}
        <Card className="border border-gray-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Current Sentiment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {QUESTION_META.map(({ key, label, description }) => {
              const value = questionScores[key] ?? 0;
              const percentage = Math.round(value * 20);
              const status = getScoreStatus(percentage);
              
              return (
                <div key={key} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-gray-700">{label}</span>
                    <span className="font-bold" style={{ color: status.color }}>{percentage}%</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full"
                      style={{ 
                        width: `${percentage}%`,
                        backgroundColor: status.color
                      }}
                    />
                  </div>
                  <div className="text-xs text-gray-500">{description}</div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Column 3: Insights */}
        <Card className="border border-gray-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Key Insights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {insights.slice(0, 4).map((insight, idx) => (
              <MiniInsight key={idx} insight={insight} />
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Full-Width Table */}
      <Card className="border border-gray-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">{tableTitle} Performance Matrix</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 px-3 font-semibold text-gray-700">Division</th>
                  <th className="text-center py-2 px-2 font-semibold text-gray-700">Overall</th>
                  <th className="text-center py-2 px-2 font-semibold text-gray-700">Sentiment</th>
                  <th className="text-center py-2 px-2 font-semibold text-gray-700">Clarity</th>
                  <th className="text-center py-2 px-2 font-semibold text-gray-700">Workload</th>
                  <th className="text-center py-2 px-2 font-semibold text-gray-700">Safety</th>
                  <th className="text-center py-2 px-2 font-semibold text-gray-700">Leadership</th>
                  <th className="text-center py-2 px-2 font-semibold text-gray-700">Part. %</th>
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
                      backgroundColor: `${status.color}20`,
                      color: score < 50 ? '#7F1D1D' : score < 70 ? '#78350F' : '#064E3B',
                      fontWeight: 600
                    };
                  };
                  
                  return (
                    <tr 
                      key={row.id}
                      className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                      onClick={() => onDivisionClick && onDivisionClick(row.id, row.name)}
                    >
                      <td className="py-2 px-3 font-semibold text-gray-800">{row.name}</td>
                      <td className="py-2 px-2 text-center rounded" style={getCellStyle(wellbeing)}>
                        {wellbeing}%
                      </td>
                      <td className="py-2 px-2 text-center rounded" style={getCellStyle(sentiment)}>
                        {sentiment}%
                      </td>
                      <td className="py-2 px-2 text-center rounded" style={getCellStyle(clarity)}>
                        {clarity}%
                      </td>
                      <td className="py-2 px-2 text-center rounded" style={getCellStyle(workload)}>
                        {workload}%
                      </td>
                      <td className="py-2 px-2 text-center rounded" style={getCellStyle(safety)}>
                        {safety}%
                      </td>
                      <td className="py-2 px-2 text-center rounded" style={getCellStyle(leadership)}>
                        {leadership}%
                      </td>
                      <td className="py-2 px-2 text-center rounded" style={getCellStyle(participation)}>
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

