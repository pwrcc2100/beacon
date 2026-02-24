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
  SCORE_THRESHOLDS,
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
  displayName?: string;
  divisionName?: string;
  departmentName?: string;
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

const hexToRgba = (hex: string, alpha: number) => {
  const clean = hex.replace('#', '');
  const bigint = parseInt(clean, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

// Metric Card Component
function MetricCard({
  icon,
  label,
  value,
  trend,
  color,
  className,
}: {
  icon: string;
  label: string;
  value: string | number;
  trend?: string;
  color: string;
  className: string;
}) {
  return (
    <Card className={className}>
      <CardContent className="p-6 md:p-7">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.55em] text-slate-400">
              {label}
            </p>
            <p className="mt-6 text-4xl font-semibold leading-tight" style={{ color }}>
              {value}
            </p>
            {trend && <p className="mt-3 text-xs text-slate-500">{trend}</p>}
          </div>
          <div className="ml-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-xl text-slate-500">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Question Bar Component with conditional coloring
function QuestionBar({ label, description, value }: { label: string; description: string; value: number }) {
  const scorePercent = Math.round(value * 20);
  const status = getScoreStatus(scorePercent);
  const percentage = (value / 5) * 100;
  const alertStop = SCORE_THRESHOLDS.watch;
  const thrivingStop = SCORE_THRESHOLDS.thriving;
  const trackGradient = `linear-gradient(90deg,
    ${hexToRgba(SCORE_COLORS.alert, 0.18)} 0%,
    ${hexToRgba(SCORE_COLORS.alert, 0.18)} ${alertStop}%,
    ${hexToRgba(SCORE_COLORS.watch, 0.18)} ${alertStop}%,
    ${hexToRgba(SCORE_COLORS.watch, 0.18)} ${thrivingStop}%,
    ${hexToRgba(SCORE_COLORS.thriving, 0.18)} ${thrivingStop}%,
    ${hexToRgba(SCORE_COLORS.thriving, 0.18)} 100%
  )`;
  
  return (
    <div className="space-y-2 rounded-2xl border border-white/50 bg-white/80 p-4 shadow-[0_12px_28px_rgba(15,23,42,0.08)] backdrop-blur-sm">
      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold uppercase tracking-[0.2em] text-[#5f6f87]">
          {label}
          <span className="ml-2 normal-case tracking-normal text-[#1e293b]">{description}</span>
        </span>
        <span className="font-bold" style={{ color: status.color }}>{scorePercent}%</span>
      </div>
      <div
        className="relative h-3 overflow-hidden rounded-full"
        style={{ background: trackGradient }}
      >
        <div className="absolute top-0 bottom-0 w-px bg-white/60" style={{ left: `${alertStop}%` }} />
        <div className="absolute top-0 bottom-0 w-px bg-white/60" style={{ left: `${thrivingStop}%` }} />
        <div
          className="relative h-full rounded-full transition-all duration-500"
          style={{
            width: `${Math.min(percentage, 100)}%`,
            backgroundColor: hexToRgba(status.color, 0.9),
            boxShadow: `0 0 6px ${hexToRgba(status.color, 0.45)}`,
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
  const labelFrequency = Math.max(1, Math.ceil(trendSeries.length / 10));
  
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
  
  const surfaceCardClass =
    'border-none bg-white/95 rounded-3xl shadow-[0_24px_60px_rgba(15,23,42,0.08)] ring-1 ring-white/60';
  const metricCardClass =
    'border-none bg-white/95 rounded-3xl shadow-[0_30px_70px_rgba(15,23,42,0.12)] transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_36px_85px_rgba(15,23,42,0.18)]';

  return (
    <div className="space-y-10 rounded-[32px] border border-white/60 bg-gradient-to-br from-[#f7faff] via-[#f0f5ff] to-[#e9effb] p-8 md:p-10 shadow-[0_30px_80px_rgba(15,23,42,0.12)]">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-[#0f172a] md:text-3xl">Beacon Index Overview</h2>
        <p className="text-sm text-[#5d6f87] md:text-base">
          Latest check-in insights across sentiment, workload, support, safety and leadership for the selected view.
        </p>
      </div>
      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          icon="💚"
          label="Beacon Index"
          value={`${Math.round(overallScore)}%`}
          trend={previousScore ? trendText + ' vs previous' : undefined}
          color={status.color}
          className={metricCardClass}
        />
        <MetricCard
          icon="👥"
          label="Participation Rate"
          value={`${Math.round(participationRate)}%`}
          trend={previousScore ? trendText + ' vs previous' : undefined}
          color={participationRate >= 70 ? SCORE_COLORS.thriving : participationRate >= 40 ? SCORE_COLORS.watch : SCORE_COLORS.alert}
          className={metricCardClass}
        />
        <MetricCard
          icon="⚠️"
          label="Teams Needing Attention"
          value={teamsNeedingAttention}
          trend={previousScore ? trendText + ' vs previous' : `out of ${teams.length} teams`}
          color={teamsNeedingAttention > 5 ? SCORE_COLORS.alert : teamsNeedingAttention > 2 ? SCORE_COLORS.watch : SCORE_COLORS.thriving}
          className={metricCardClass}
        />
        <MetricCard
          icon="📈"
          label="Trend"
          value={trend > 0 ? '↗' : trend < 0 ? '↘' : '→'}
          trend={previousScore ? trendText + ' vs previous' : `${Math.abs(trend).toFixed(1)}% change`}
          color={trend > 0 ? SCORE_COLORS.thriving : trend < -5 ? SCORE_COLORS.alert : SCORE_COLORS.watch}
          className={metricCardClass}
        />
      </div>

      {/* Beacon Index Over Time - Line Chart */}
      <Card className={surfaceCardClass}>
        <CardHeader className="p-8 pb-0">
          <CardTitle className="text-xl text-[#0f172a]">Beacon Index Over Time</CardTitle>
          <p className="mt-2 text-sm text-[#5f6f87]">Last {trendSeries.length} reporting periods</p>
        </CardHeader>
        <CardContent className="p-8 pt-6">
          {trendSeries.length > 0 ? (
            <div className="w-full h-48">
              <svg viewBox="0 0 800 180" className="w-full h-full">
                {/* Grid lines */}
                <line x1="40" y1="140" x2="760" y2="140" stroke="#E5E7EB" strokeWidth="1" />
                <line x1="40" y1="100" x2="760" y2="100" stroke="#F3F4F6" strokeWidth="1" />
                <line x1="40" y1="60" x2="760" y2="60" stroke="#F3F4F6" strokeWidth="1" />
                <line x1="40" y1="20" x2="760" y2="20" stroke="#F3F4F6" strokeWidth="1" />
                
                {/* Y-axis labels */}
                <text x="30" y="145" textAnchor="end" fontSize="12" fill="#9CA3AF">0%</text>
                <text x="30" y="105" textAnchor="end" fontSize="12" fill="#9CA3AF">33%</text>
                <text x="30" y="65" textAnchor="end" fontSize="12" fill="#9CA3AF">67%</text>
                <text x="30" y="25" textAnchor="end" fontSize="12" fill="#9CA3AF">100%</text>
                
                {/* Line path */}
                <path
                  d={trendSeries.map((point, i) => {
                    const x = 40 + (i / Math.max(1, trendSeries.length - 1)) * 720;
                    const y = 140 - (point.wellbeing / 100) * 120;
                    return `${i === 0 ? 'M' : 'L'}${x},${y}`;
                  }).join(' ')}
                  stroke={status.color}
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                
                {/* Data points */}
                {trendSeries.map((point, i) => {
                  const x = 40 + (i / Math.max(1, trendSeries.length - 1)) * 720;
                  const y = 140 - (point.wellbeing / 100) * 120;
                  const showLabel = trendSeries.length <= 12 || i % labelFrequency === 0 || i === trendSeries.length - 1;
                  return (
                    <g key={i}>
                      <circle cx={x} cy={y} r="5" fill="white" stroke={status.color} strokeWidth="2" />
                      {showLabel && (
                        <text 
                          x={x} 
                          y="162" 
                          textAnchor="middle" 
                          fontSize="10" 
                          fill="#6B7280"
                        >
                          {point.label}
                        </text>
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>
          ) : (
            <p className="text-sm text-gray-500 py-8 text-center">No trend data available yet</p>
          )}
        </CardContent>
      </Card>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Current Sentiment - Takes 2 columns */}
        <Card className={`${surfaceCardClass} lg:col-span-2`}>
          <CardHeader className="p-8 pb-4">
            <CardTitle className="text-xl text-[#0f172a]">Current Sentiment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5 p-8 pt-0">
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
        <Card className={surfaceCardClass}>
          <CardHeader className="p-8 pb-4">
            <CardTitle className="text-xl text-[#0f172a]">Key Insights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-8 pt-0">
            {insights.slice(0, 3).map((insight, idx) => {
              const colors = insight.type === 'positive' ? SCORE_COLORS.thriving :
                            insight.type === 'warning' ? SCORE_COLORS.alert :
                            SCORE_COLORS.watch;
              const isClickable = insight.relatedEntities && insight.relatedEntities.length > 0;
              
              return (
                <div 
                  key={idx}
                  className={cn(
                    "rounded-2xl border border-transparent bg-white/80 p-4 shadow-[0_12px_30px_rgba(15,23,42,0.06)] transition-transform duration-200",
                    isClickable && "cursor-pointer hover:-translate-y-0.5 hover:shadow-[0_20px_38px_rgba(15,23,42,0.12)]"
                  )}
                  style={{ 
                    borderColor: `${colors}40`,
                    boxShadow: `0 18px 35px -18px ${hexToRgba(colors, 0.45)}`,
                  }}
                  onClick={() => isClickable && handleInsightClick(insight)}
                >
                  <p className="text-sm font-medium text-[#1e293b]">{insight.text}</p>
                  {insight.recommendation && (
                    <p className="mt-2 text-xs text-[#64748b]">{insight.recommendation}</p>
                  )}
                  {isClickable && (
                    <p className="mt-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#2563eb]">
                      View details →
                    </p>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Team Index Score - Full Width Below Grid */}
      <TeamsAttentionChart 
        teams={teams.map(t => ({
          id: t.id,
          name: t.displayName ?? t.name,
          rawName: t.name,
          division: t.divisionName,
          department: t.departmentName,
          score: t.wellbeing,
        }))}
        onTeamClick={handleTeamClick}
      />

      {/* Divisions Table */}
      <Card className={surfaceCardClass}>
        <CardHeader className="p-8 pb-3">
          <CardTitle className="text-xl text-[#0f172a]">{tableTitle}</CardTitle>
        </CardHeader>
        <CardContent className="p-8 pt-0">
          <div className="overflow-x-auto rounded-2xl border border-white/50 bg-white/70 shadow-[0_12px_28px_rgba(15,23,42,0.08)]">
            <table className="w-full">
              <thead>
                <tr className="bg-white/60 text-left uppercase tracking-[0.35em] text-[#7b88a3]">
                  <th className="py-4 pl-5 pr-4 text-xs text-left">Division</th>
                  <th className="py-4 px-4 text-center text-xs">Overall</th>
                  <th className="py-4 px-4 text-center text-xs">Sentiment</th>
                  <th className="py-4 px-4 text-center text-xs">Clarity</th>
                  <th className="py-4 px-4 text-center text-xs">Workload</th>
                  <th className="py-4 px-4 text-center text-xs">Safety</th>
                  <th className="py-4 px-4 text-center text-xs">Leadership</th>
                  <th className="py-4 px-4 text-center text-xs">Participation</th>
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
                      className="cursor-pointer border-b border-white/40 last:border-none hover:bg-white/90 hover:shadow-[0_10px_25px_rgba(15,23,42,0.08)] transition-all"
                      onClick={() => onDivisionClick && onDivisionClick(row.id, row.name)}
                    >
                      <td className="whitespace-nowrap py-4 pl-5 pr-4 text-sm font-semibold text-[#1e293b]">{row.name}</td>
                      <td className="py-4 px-4 text-center rounded-md font-semibold text-sm" style={getCellStyle(wellbeing)}>
                        {formatPercent(wellbeing)}
                      </td>
                      <td className="py-4 px-4 text-center rounded-md font-semibold text-sm" style={getCellStyle(sentiment)}>
                        {formatPercent(sentiment)}
                      </td>
                      <td className="py-4 px-4 text-center rounded-md font-semibold text-sm" style={getCellStyle(clarity)}>
                        {formatPercent(clarity)}
                      </td>
                      <td className="py-4 px-4 text-center rounded-md font-semibold text-sm" style={getCellStyle(workload)}>
                        {formatPercent(workload)}
                      </td>
                      <td className="py-4 px-4 text-center rounded-md font-semibold text-sm" style={getCellStyle(safety)}>
                        {formatPercent(safety)}
                      </td>
                      <td className="py-4 px-4 text-center rounded-md font-semibold text-sm" style={getCellStyle(leadership)}>
                        {formatPercent(leadership)}
                      </td>
                      <td className="py-4 px-4 text-center rounded-md font-semibold text-sm" style={getCellStyle(participation)}>
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

