'use client';

/**
 * DESIGN OPTION B: Executive Focus
 * Features:
 * - Hero section with large gauge as focal point
 * - Streamlined metrics around the gauge
 * - Cleaner visual hierarchy
 * - Emphasis on actionable insights
 * - Better use of whitespace
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

// Large Hero Gauge
function HeroGauge({ value, previous }: { value: number; previous?: number }) {
  const status = getScoreStatus(Math.round(value));
  const percentage = (value / 100) * 180; // Semi-circle
  const trend = previous ? value - previous : 0;
  
  return (
    <div className="relative flex flex-col items-center justify-center py-12">
      {/* SVG Gauge */}
      <svg width="280" height="160" viewBox="0 0 280 160" className="mb-4">
        {/* Background arc */}
        <path
          d="M 40 140 A 100 100 0 0 1 240 140"
          fill="none"
          stroke="#E5E7EB"
          strokeWidth="24"
          strokeLinecap="round"
        />
        {/* Colored arc */}
        <path
          d="M 40 140 A 100 100 0 0 1 240 140"
          fill="none"
          stroke={status.color}
          strokeWidth="24"
          strokeLinecap="round"
          strokeDasharray={`${percentage} 314`}
          style={{ transition: 'stroke-dasharray 1s ease-in-out' }}
        />
      </svg>
      
      {/* Center value */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-4 text-center">
        <div className="text-6xl font-bold" style={{ color: status.color }}>
          {Math.round(value)}%
        </div>
        {previous && (
          <div className={cn(
            "text-sm font-medium mt-1",
            trend > 0 ? "text-green-600" : trend < 0 ? "text-red-600" : "text-gray-500"
          )}>
            {trend > 0 ? '↗' : trend < 0 ? '↘' : '→'} {Math.abs(trend).toFixed(1)}% vs previous
          </div>
        )}
      </div>
      
      {/* Status label */}
      <div className="mt-4 text-center">
        <div className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
          Beacon Index
        </div>
        <div 
          className="mt-1 px-4 py-1 rounded-full text-sm font-bold inline-block"
          style={{ 
            backgroundColor: `${status.color}20`,
            color: status.color
          }}
        >
          {status.label}
        </div>
      </div>
    </div>
  );
}

// Compact Metric
function CompactMetric({ label, value, color, icon }: { label: string; value: string; color: string; icon?: string }) {
  return (
    <div className="flex items-center gap-3 p-4 rounded-lg bg-gray-50">
      {icon && <span className="text-2xl">{icon}</span>}
      <div>
        <div className="text-xs text-gray-600">{label}</div>
        <div className="text-2xl font-bold" style={{ color }}>{value}</div>
      </div>
    </div>
  );
}

export default function ExecutiveOverviewOptionB({
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
  const participationColor = participationRate >= 70 ? SCORE_COLORS.thriving : 
                            participationRate >= 40 ? SCORE_COLORS.watch : 
                            SCORE_COLORS.alert;
  
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <Card className="border-none shadow-lg">
        <CardContent className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr,auto,1fr] gap-8 items-center">
            {/* Left metrics */}
            <div className="space-y-4">
              <CompactMetric
                icon="👥"
                label="Participation Rate"
                value={`${Math.round(participationRate)}%`}
                color={participationColor}
              />
              <CompactMetric
                icon="⚠️"
                label="Teams Needing Attention"
                value={`${teamsNeedingAttention}`}
                color={teamsNeedingAttention > 5 ? SCORE_COLORS.alert : SCORE_COLORS.thriving}
              />
            </div>
            
            {/* Center gauge */}
            <div className="flex justify-center">
              <HeroGauge value={overallScore} previous={previousScore} />
            </div>
            
            {/* Right - Top insights */}
            <div className="space-y-3">
              <div className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
                Key Insights
              </div>
              {insights.slice(0, 2).map((insight, idx) => {
                const iconMap = {
                  positive: '✓',
                  warning: '⚠',
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
                  <div key={idx} className="flex gap-2 text-sm">
                    <span style={{ color: colorMap[insight.type] }}>{iconMap[insight.type]}</span>
                    <div className="flex-1">
                      <p className="text-gray-700 leading-relaxed">{insight.text}</p>
                      {insight.recommendation && (
                        <p className="text-xs text-gray-500 mt-1">{insight.recommendation}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Sentiment - Horizontal bars */}
      <Card className="border-none shadow-md">
        <CardHeader>
          <CardTitle className="text-base">Current Sentiment Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {QUESTION_META.map(({ key, label, description }) => {
              const value = questionScores[key] ?? 0;
              const percentage = Math.round(value * 20);
              const status = getScoreStatus(percentage);
              
              return (
                <div key={key} className="text-center">
                  <div className="text-3xl font-bold mb-2" style={{ color: status.color }}>
                    {percentage}%
                  </div>
                  <div className="text-xs font-medium text-gray-700 mb-1">{label}</div>
                  <div className="text-xs text-gray-500">{description}</div>
                  <div className="mt-3 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full"
                      style={{ 
                        width: `${percentage}%`,
                        backgroundColor: status.color
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Divisions Table - Simplified */}
      <Card className="border-none shadow-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">{tableTitle} Performance</CardTitle>
            <div className="text-xs text-gray-500">Click any row to drill down</div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {divisions.map(row => {
              const wellbeing = Math.round(row.wellbeing_score ?? 0);
              const status = getScoreStatus(wellbeing);
              const participation = row.total_employees && row.total_employees > 0 
                ? Math.round((row.response_count / row.total_employees) * 100)
                : 0;
              
              return (
                <div
                  key={row.id}
                  className="flex items-center gap-4 p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-sm cursor-pointer transition-all"
                  onClick={() => onDivisionClick && onDivisionClick(row.id, row.name)}
                >
                  <div className="flex-1 font-semibold text-gray-800">{row.name}</div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="text-xs text-gray-500">Overall</div>
                      <div className="text-2xl font-bold" style={{ color: status.color }}>
                        {wellbeing}%
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-500">Participation</div>
                      <div className="text-lg font-semibold text-gray-700">
                        {participation > 0 ? `${participation}%` : 'N/A'}
                      </div>
                    </div>
                    <div className="text-gray-400">→</div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

