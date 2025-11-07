'use client';

import type { ExecutiveInsight } from '@/lib/executiveInsights';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useMemo } from 'react';
import {
  formatPercent,
  getScoreStatus,
  SCORE_COLORS,
  SCORE_BACKGROUNDS,
  scoreToPercent,
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
  previous?: number;
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

function getStatusColor(value: number) {
  return getScoreStatus(value).color;
}

function hexToRgba(hex: string, alpha: number) {
  const normalized = hex.replace('#', '');
  const bigint = parseInt(normalized, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function getInsightVisual(type: ExecutiveInsight['type']) {
  switch (type) {
    case 'positive':
      return {
        border: SCORE_COLORS.thriving,
        background: hexToRgba(SCORE_COLORS.thriving, 0.15),
      };
    case 'warning':
      return {
        border: SCORE_COLORS.alert,
        background: hexToRgba(SCORE_COLORS.alert, 0.15),
      };
    case 'attention':
      return {
        border: SCORE_COLORS.watch,
        background: hexToRgba(SCORE_COLORS.watch, 0.15),
      };
    default:
      return {
        border: SCORE_COLORS.neutral,
        background: hexToRgba(SCORE_COLORS.neutral, 0.12),
      };
  }
}

function WeightingBreakdown() {
  const breakdown = [
    { label: 'Sentiment', value: '25%' },
    { label: 'Workload', value: '25%' },
    { label: 'Safety', value: '20%' },
    { label: 'Leadership', value: '20%' },
    { label: 'Clarity', value: '10%' },
  ];

  return (
    <div className="rounded-lg border border-dashed border-[#CBD5E1] bg-[#F8FBFF] p-3">
      <div className="text-xs uppercase text-[var(--text-muted)] font-semibold tracking-wide mb-2">
        Weighting Formula
      </div>
      <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-[var(--text-primary)]">
        {breakdown.map(item => (
          <div key={item.label} className="flex items-center justify-between">
            <dt>{item.label}</dt>
            <dd className="font-semibold">{item.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function Sparkline({ points, color }: { points: number[]; color: string }) {
  if (points.length === 0) {
    return <div className="text-xs text-muted-foreground">No data</div>;
  }

  const padding = 4;
  const width = 160;
  const height = 60;
  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = max - min || 1;

  const step = points.length > 1 ? (width - padding * 2) / (points.length - 1) : 0;
  const path = points
    .map((value, index) => {
      const x = padding + index * step;
      const y = height - padding - ((value - min) / range) * (height - padding * 2);
      return `${index === 0 ? 'M' : 'L'}${x},${y}`;
    })
    .join(' ');

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-16">
      <path d={`M${padding},${height - padding} L${padding},${padding} L${width - padding},${padding} L${width - padding},${height - padding}`} fill="#F5F5F5" opacity={0} />
      <path d={`M${padding},${height - padding} H${width - padding}`} stroke="#E4E7EC" strokeWidth={1} fill="none" />
      <path d={path} stroke={color} strokeWidth={2.5} fill="none" strokeLinecap="round" />
    </svg>
  );
}

function generateTrendInsight(series1: number[], series2: number[], label1: string, label2: string): string {
  if (series1.length < 2 || series2.length < 2) {
    return `Track ${label1} and ${label2} over time to identify patterns and correlations.`;
  }

  const recent1 = series1.slice(-3);
  const recent2 = series2.slice(-3);
  const avg1 = recent1.reduce((a, b) => a + b, 0) / recent1.length;
  const avg2 = recent2.reduce((a, b) => a + b, 0) / recent2.length;
  
  const trend1 = recent1[recent1.length - 1] - recent1[0];
  const trend2 = recent2[recent2.length - 1] - recent2[0];
  
  // Check for correlation
  const bothRising = trend1 > 2 && trend2 > 2;
  const bothFalling = trend1 < -2 && trend2 < -2;
  const diverging = Math.abs(trend1 - trend2) > 5;
  
  if (bothRising) {
    return `Positive trend: Both ${label1} and ${label2} are improving together, indicating strong organizational health.`;
  } else if (bothFalling) {
    return `Concerning trend: Both ${label1} and ${label2} are declining. Immediate intervention recommended.`;
  } else if (diverging && trend1 > trend2) {
    return `${label1} is improving while ${label2} lags. Focus on building psychological safety to match wellbeing gains.`;
  } else if (diverging && trend2 > trend1) {
    return `${label2} is improving while ${label1} lags. Leverage improved safety to address broader wellbeing concerns.`;
  } else if (avg1 < 50 || avg2 < 50) {
    return `One or both metrics are below 50%. Prioritize interventions to address low scores before they impact retention.`;
  } else {
    return `Metrics are tracking steadily. Continue monitoring for early signs of divergence or decline.`;
  }
}

function OverlaidSparklines({ 
  series1, 
  series2, 
  color1, 
  color2, 
  label1, 
  label2 
}: { 
  series1: number[]; 
  series2: number[]; 
  color1: string; 
  color2: string; 
  label1: string; 
  label2: string; 
}) {
  if (series1.length === 0 && series2.length === 0) {
    return <div className="text-xs text-muted-foreground">No data</div>;
  }

  const padding = 8;
  const width = 320;
  const height = 100;
  
  const allPoints = [...series1, ...series2];
  const max = Math.max(...allPoints);
  const min = Math.min(...allPoints);
  const range = max - min || 1;

  const createPath = (points: number[]) => {
    const step = points.length > 1 ? (width - padding * 2) / (points.length - 1) : 0;
    return points
      .map((value, index) => {
        const x = padding + index * step;
        const y = height - padding - ((value - min) / range) * (height - padding * 2);
        return `${index === 0 ? 'M' : 'L'}${x},${y}`;
      })
      .join(' ');
  };

  const path1 = createPath(series1);
  const path2 = createPath(series2);
  const insight = generateTrendInsight(series1, series2, label1, label2);

  return (
    <div className="space-y-3">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full">
        {/* Grid lines */}
        <path d={`M${padding},${height - padding} H${width - padding}`} stroke="#E4E7EC" strokeWidth={1} fill="none" />
        <path d={`M${padding},${padding + (height - 2*padding) * 0.33} H${width - padding}`} stroke="#F3F4F6" strokeWidth={1} fill="none" />
        <path d={`M${padding},${padding + (height - 2*padding) * 0.66} H${width - padding}`} stroke="#F3F4F6" strokeWidth={1} fill="none" />
        
        {/* Data lines */}
        <path d={path1} stroke={color1} strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d={path2} stroke={color2} strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      
      {/* Legend */}
      <div className="flex items-center justify-center gap-6 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-6 h-0.5 rounded" style={{ backgroundColor: color1 }} />
          <span className="font-medium text-[var(--text-primary)]">{label1}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-0.5 rounded" style={{ backgroundColor: color2 }} />
          <span className="font-medium text-[var(--text-primary)]">{label2}</span>
        </div>
      </div>
      
      {/* AI-generated insight */}
      <div className="text-xs text-[var(--text-muted)] border rounded-lg p-3">
        <span className="font-medium text-[var(--text-primary)]">💡 Insight:</span> {insight}
      </div>
    </div>
  );
}

function SemiCircularGauge({ value, previous }: { value?: number; previous?: number }) {
  const percent = Math.max(0, Math.min(100, value ?? 0));
  const radius = 90;
  const circumference = Math.PI * radius;
  const offset = circumference * (1 - percent / 100);
  const color = getStatusColor(percent);
  const delta = value !== undefined && previous !== undefined ? Math.round(value - previous) : undefined;

  return (
    <div className="w-full">
      <div className="relative w-full flex flex-col items-center">
        <svg viewBox="0 0 200 120" className="w-full">
          <path
            d="M20 100 A80 80 0 0 1 180 100"
            stroke="#E8ECF0"
            strokeWidth={18}
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M20 100 A80 80 0 0 1 180 100"
            stroke={color}
            strokeWidth={18}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
        <div className="absolute top-[45%] text-center">
          <div className="text-4xl font-semibold" style={{ color }}>{formatPercent(percent)}</div>
          {typeof delta === 'number' && (
            <div
              className={cn('text-xs font-medium mt-1')}
              style={{ color: delta >= 0 ? SCORE_COLORS.thriving : SCORE_COLORS.alert }}
            >
              {delta >= 0 ? '+' : ''}{delta}% vs previous
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function QuestionBar({ label, description, value }: { label: string; description: string; value: number }) {
  const percent = scoreToPercent(value, 'five') ?? 0;
  const status = getScoreStatus(percent);
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2 text-xs font-medium text-[var(--text-primary)]">
        <span
          className="inline-flex items-center justify-center h-6 px-3 rounded-full"
          style={{ backgroundColor: status.background, color: status.color }}
        >
          {label}
        </span>
        <span className="text-[var(--text-muted)]">{description}</span>
      </div>
      <div className="h-2 rounded-full bg-[#F1F5F9] overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{ width: `${percent}%`, backgroundColor: status.color, transition: 'width 0.3s ease' }}
        />
      </div>
    </div>
  );
}

function TeamsBarChart({ teams }: { teams: TeamScore[] }) {
  if (teams.length === 0) {
    return <div className="text-sm text-muted-foreground">No team data available.</div>;
  }
  const max = Math.max(100, ...teams.map(t => t.wellbeing));

  return (
    <div className="mt-4 overflow-x-auto pb-2">
      <div className="flex items-end gap-4 min-h-[160px]">
        {teams.map(team => {
          const percent = Math.round(team.wellbeing);
          const height = 150;
          const barHeight = Math.max(10, (percent / max) * height);
          const status = getScoreStatus(percent);
          return (
            <div key={team.id} className="flex flex-col items-center gap-2 min-w-[72px]">
              <div
                className="w-10 rounded-t-lg"
                style={{ backgroundColor: status.color, height: `${barHeight}px`, transition: 'height 0.3s ease' }}
              />
              <div className="text-xs font-semibold text-[var(--text-primary)]">{percent}%</div>
              <div className="text-xs text-center text-[var(--text-muted)] leading-tight">
                {team.name}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function LegendItem({ color, label, range }: { color: string; label: string; range: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
      <span className="text-xs font-medium text-[var(--text-primary)]">{label}</span>
      <span className="text-xs text-[var(--text-muted)]">{range}</span>
    </div>
  );
}

export function ExecutiveOverview({
  overallScore,
  previousScore,
  trendSeries,
  questionScores,
  participationRate,
  teams,
  divisions,
  insights,
  attentionLabel = 'Which Teams Need Attention',
  tableTitle = 'Divisions',
  onDivisionClick
}: ExecutiveOverviewProps) {
  const wellbeingPoints = useMemo(() => trendSeries.map(p => p.wellbeing), [trendSeries]);
  const safetyPoints = useMemo(() => trendSeries.map(p => p.safety), [trendSeries]);
  const teamSummary = useMemo(() => {
    const cleaned = teams.filter(team => Number.isFinite(team.wellbeing));
    const sorted = [...cleaned].sort((a, b) => a.wellbeing - b.wellbeing);
    const categories = {
      alert: [] as string[],
      watch: [] as string[],
      thriving: [] as string[],
    };

    sorted.forEach(team => {
      const status = getScoreStatus(Math.round(team.wellbeing));
      if (status.category === 'alert') {
        categories.alert.push(team.name);
      } else if (status.category === 'watch') {
        categories.watch.push(team.name);
      } else if (status.category === 'thriving') {
        categories.thriving.push(team.name);
      }
    });

    return { sorted, categories };
  }, [teams]);

  return (
    <div className="space-y-8">
      {/* Top summary cards */}
      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="border border-[#E0E7F1] shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-[var(--text-muted)] uppercase tracking-wide">Overall Wellbeing Score</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 lg:grid-cols-[1.4fr,1fr] gap-6 items-center">
            <div className="space-y-4">
              <SemiCircularGauge value={overallScore} previous={previousScore} />
              <WeightingBreakdown />
            </div>
            <div className="space-y-3">
              <div className="text-xs font-medium text-[var(--text-muted)] uppercase">Historical Wellbeing Score</div>
              <Sparkline points={wellbeingPoints} color="#2E96FF" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-[#E0E7F1] shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-[var(--text-muted)] uppercase tracking-wide">Current Sentiment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {QUESTION_META.map(({ key, label, description }) => (
                <QuestionBar
                  key={key}
                  label={label}
                  description={description}
                  value={questionScores[key] ?? 0}
                />
              ))}
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-medium text-[var(--text-muted)] uppercase">Participation</span>
              <span className="text-3xl font-semibold" style={{ 
                color: participationRate >= 70 ? SCORE_COLORS.thriving : participationRate >= 40 ? SCORE_COLORS.watch : SCORE_COLORS.alert 
              }}>
                {formatPercent(participationRate)}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Trend vs Safety and Teams */}
      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="border border-[#E0E7F1] shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-[var(--text-muted)] uppercase tracking-wide">Wellbeing vs Safety Trends</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <OverlaidSparklines 
              series1={wellbeingPoints} 
              series2={safetyPoints} 
              color1={SCORE_COLORS.thriving} 
              color2={SCORE_COLORS.watch}
              label1="Overall Wellbeing"
              label2="Psychological Safety"
            />
          </CardContent>
        </Card>

        <Card className="border border-[#E0E7F1] shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-[var(--text-muted)] uppercase tracking-wide">{attentionLabel}</CardTitle>
          </CardHeader>
          <CardContent>
            <TeamsBarChart teams={teamSummary.sorted} />
            <div className="mt-4 flex flex-wrap items-center gap-4">
              <LegendItem color={SCORE_COLORS.alert} label="High Alert" range="Under 40%" />
              <LegendItem color={SCORE_COLORS.watch} label="Ones to Watch" range="40% – 69%" />
              <LegendItem color={SCORE_COLORS.thriving} label="Thriving" range="70%+" />
            </div>
            {(teamSummary.categories.alert.length > 0 || teamSummary.categories.watch.length > 0) && (
              <div className="mt-3 space-y-1 text-xs text-[var(--text-muted)]">
                {teamSummary.categories.alert.length > 0 && (
                  <div>
                    <span className="font-semibold" style={{ color: SCORE_COLORS.alert }}>
                      {teamSummary.categories.alert.join(', ')}
                    </span>{' '}
                    require immediate follow-up.
                  </div>
                )}
                {teamSummary.categories.watch.length > 0 && (
                  <div>
                    <span className="font-semibold" style={{ color: SCORE_COLORS.watch }}>
                      {teamSummary.categories.watch.join(', ')}
                    </span>{' '}
                    are ones to watch this period.
                  </div>
                )}
              </div>
            )}
            <div className="mt-3 text-xs" style={{ color: SCORE_COLORS.watch }}>
              Compare against last report to track shifts in psychosocial risk.
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Divisions heatmap table and insights */}
      <div className="grid gap-6 xl:grid-cols-5">
        <Card className="xl:col-span-3 border border-[#E0E7F1] shadow-sm overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-[var(--text-muted)] uppercase tracking-wide">{tableTitle}</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="min-w-full text-xs border-collapse">
              <thead>
                <tr className="text-[var(--text-muted)]">
                  <th className="text-left font-semibold px-2 py-3 border-b-2 border-slate-200">Division</th>
                  <th className="text-center font-semibold px-2 py-3 border-b-2 border-slate-200">Overall</th>
                  <th className="text-center font-semibold px-2 py-3 border-b-2 border-slate-200">Sentiment</th>
                  <th className="text-center font-semibold px-2 py-3 border-b-2 border-slate-200">Clarity</th>
                  <th className="text-center font-semibold px-2 py-3 border-b-2 border-slate-200">Workload</th>
                  <th className="text-center font-semibold px-2 py-3 border-b-2 border-slate-200">Safety</th>
                  <th className="text-center font-semibold px-2 py-3 border-b-2 border-slate-200">Leadership</th>
                  <th className="text-center font-semibold px-2 py-3 border-b-2 border-slate-200">Participation</th>
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
                    // Increase opacity range for better contrast: 0.25-0.65 instead of 0.15-0.36
                    const opacity = Math.max(0.25, Math.min(0.65, (score / 100) * 0.8 + 0.2));
                    const alphaHex = Math.round(opacity * 255).toString(16).padStart(2, '0');
                    
                    return {
                      backgroundColor: `${status.color}${alphaHex}`,
                      color: score < 50 ? '#7F1D1D' : score < 70 ? '#78350F' : '#064E3B',
                      fontWeight: 700
                    };
                  };
                  
                  return (
                    <tr 
                      key={row.id} 
                      className={cn(
                        "border-b border-slate-100 transition-all",
                        onDivisionClick && "cursor-pointer hover:shadow-sm hover:bg-slate-50"
                      )}
                      onClick={() => onDivisionClick && onDivisionClick(row.id, row.name)}
                    >
                      <td className="px-2 py-3 font-semibold text-[var(--text-primary)]">{row.name}</td>
                      <td className="px-2 py-3 text-center rounded-md" style={getCellStyle(wellbeing)}>
                        {formatPercent(wellbeing)}
                      </td>
                      <td className="px-2 py-3 text-center rounded-md" style={getCellStyle(sentiment)}>
                        {formatPercent(sentiment)}
                      </td>
                      <td className="px-2 py-3 text-center rounded-md" style={getCellStyle(clarity)}>
                        {formatPercent(clarity)}
                      </td>
                      <td className="px-2 py-3 text-center rounded-md" style={getCellStyle(workload)}>
                        {formatPercent(workload)}
                      </td>
                      <td className="px-2 py-3 text-center rounded-md" style={getCellStyle(safety)}>
                        {formatPercent(safety)}
                      </td>
                      <td className="px-2 py-3 text-center rounded-md" style={getCellStyle(leadership)}>
                        {formatPercent(leadership)}
                      </td>
                      <td className="px-2 py-3 text-center rounded-md" style={{
                        backgroundColor: participation >= 70 ? `${SCORE_COLORS.thriving}66` : participation >= 40 ? `${SCORE_COLORS.watch}66` : `${SCORE_COLORS.alert}66`,
                        color: participation >= 70 ? '#064E3B' : participation >= 40 ? '#78350F' : '#7F1D1D',
                        fontWeight: 700
                      }}>
                        {participation > 0 ? `${participation}%` : 'N/A'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {divisions.length > 0 && onDivisionClick && (
              <div className="mt-3 text-xs text-[var(--text-muted)] italic">
                Click any row to drill down into departments and teams
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="xl:col-span-2 border border-[#E0E7F1] shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-[var(--text-muted)] uppercase tracking-wide">Key Insights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            {insights.length === 0 && (
              <div className="text-muted-foreground text-xs">No significant patterns detected.</div>
            )}
            {insights.map((insight, index) => {
              const visuals = getInsightVisual(insight.type);
              return (
                <div
                  key={index}
                  className="rounded-lg p-3 space-y-2 border"
                  style={{ borderColor: visuals.border, backgroundColor: visuals.background }}
                >
                  <div className="flex items-start gap-2">
                    {insight.icon && (
                      <span className="mt-0.5" style={{ color: visuals.border }}>
                        {insight.icon}
                      </span>
                    )}
                    <div className="font-medium text-[var(--text-primary)] leading-snug">
                      {insight.text}
                    </div>
                  </div>
                  {insight.recommendation && (
                    <div className="text-[var(--text-muted)] leading-snug">
                      → {insight.recommendation}
                    </div>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

