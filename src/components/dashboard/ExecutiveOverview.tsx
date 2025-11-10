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
    <div className="rounded-lg border border-gray-200 p-3">
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

  const paddingLeft = 40;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 30;
  const width = 800;
  const height = 120;
  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = max - min || 1;

  const step = points.length > 1 ? (width - paddingLeft - paddingRight) / (points.length - 1) : 0;
  
  // Calculate path and point coordinates
  const coordinates = points.map((value, index) => ({
    x: paddingLeft + index * step,
    y: height - paddingBottom - ((value - min) / range) * (height - paddingTop - paddingBottom),
    value
  }));
  
  const path = coordinates
    .map((coord, index) => `${index === 0 ? 'M' : 'L'}${coord.x},${coord.y}`)
    .join(' ');

  // Generate month labels (assuming monthly data)
  const getMonthLabel = (index: number) => {
    const now = new Date();
    const monthDate = new Date(now.getFullYear(), now.getMonth() - (points.length - 1 - index), 1);
    return monthDate.toLocaleDateString('en-US', { month: 'short' });
  };

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full" style={{ height: '120px' }}>
      {/* Grid lines */}
      <path d={`M${paddingLeft},${height - paddingBottom} H${width - paddingRight}`} stroke="#E4E7EC" strokeWidth={1} fill="none" />
      <path d={`M${paddingLeft},${paddingTop + (height - paddingTop - paddingBottom) * 0.33} H${width - paddingRight}`} stroke="#F3F4F6" strokeWidth={1} fill="none" />
      <path d={`M${paddingLeft},${paddingTop + (height - paddingTop - paddingBottom) * 0.66} H${width - paddingRight}`} stroke="#F3F4F6" strokeWidth={1} fill="none" />
      
      {/* Y-axis labels */}
      <text x={paddingLeft - 8} y={height - paddingBottom + 4} textAnchor="end" fontSize="10" fill="#94A3B8">{Math.round(min)}%</text>
      <text x={paddingLeft - 8} y={paddingTop + 4} textAnchor="end" fontSize="10" fill="#94A3B8">{Math.round(max)}%</text>
      
      {/* Data line */}
      <path d={path} stroke={color} strokeWidth={2.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      
      {/* Data point markers */}
      {coordinates.map((coord, index) => (
        <g key={index}>
          <circle cx={coord.x} cy={coord.y} r={4} fill="white" stroke={color} strokeWidth={2} />
          {/* Month labels */}
          <text 
            x={coord.x} 
            y={height - paddingBottom + 18} 
            textAnchor="middle" 
            fontSize="10" 
            fill="#64748B"
            fontWeight="500"
          >
            {getMonthLabel(index)}
          </text>
        </g>
      ))}
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
      {/* Combined Wellbeing Overview Card */}
      <Card className="border border-[#E0E7F1] shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold text-[var(--text-primary)]">Wellbeing Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 xl:grid-cols-[1fr,1.2fr] gap-8">
            {/* Left: Gauge and Weighting */}
            <div className="space-y-4">
              <SemiCircularGauge value={overallScore} previous={previousScore} />
              
              {/* Weighting Formula and AI Insight - Horizontal */}
              <div className="grid grid-cols-2 gap-4">
                <WeightingBreakdown />
                
                {/* AI Insights Box */}
                <div className="rounded-lg border border-gray-200 p-3">
                  <div className="flex items-start gap-2">
                    <span className="text-lg flex-shrink-0">💡</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-[var(--text-primary)] mb-1.5">AI Insight</div>
                      <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                        {(() => {
                          if (overallScore === undefined) return 'Insufficient data for insights.';
                          
                          const status = getScoreStatus(overallScore);
                          const trend = previousScore ? overallScore - previousScore : 0;
                          const lowestQ = Object.entries(questionScores).reduce((minKey, [key, val]) => {
                            const minVal = questionScores[minKey as keyof typeof questionScores] ?? 100;
                            return val < minVal ? key : minKey;
                          }, 'sentiment');
                          const lowestLabel = QUESTION_META.find(q => q.key === lowestQ)?.description || '';
                          
                          if (overallScore < 40) {
                            return `Critical situation: Wellbeing at ${Math.round(overallScore)}%. Immediate action needed. Focus on "${lowestLabel}" - this is your weakest area. Schedule urgent team check-ins.`;
                          } else if (overallScore < 70) {
                            if (trend < -5) {
                              return `Declining trend detected (${trend.toFixed(1)}%). Address "${lowestLabel}" before it impacts retention. Consider targeted interventions this week.`;
                            } else if (trend > 5) {
                              return `Positive momentum! Up ${trend.toFixed(1)}%. Keep focus on improvements while addressing "${lowestLabel}" to reach thriving status.`;
                            } else {
                              return `Moderate wellbeing at ${Math.round(overallScore)}%. "${lowestLabel}" needs attention. Small improvements here could significantly boost overall scores.`;
                            }
                          } else {
                            return `Strong performance at ${Math.round(overallScore)}%! Team is thriving. Continue current practices and monitor "${lowestLabel}" to maintain balance across all dimensions.`;
                          }
                        })()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Current Sentiment Questions */}
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-[var(--text-primary)] uppercase tracking-wide">Current Sentiment</h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-[var(--text-muted)]">Participation</span>
                  <span className="text-xl font-bold" style={{ 
                    color: participationRate >= 70 ? SCORE_COLORS.thriving : participationRate >= 40 ? SCORE_COLORS.watch : SCORE_COLORS.alert 
                  }}>
                    {formatPercent(participationRate)}
                  </span>
                </div>
              </div>
              <div className="space-y-2.5">
                {QUESTION_META.map(({ key, label, description }) => (
                  <QuestionBar
                    key={key}
                    label={label}
                    description={description}
                    value={questionScores[key] ?? 0}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Bottom: Historical Trend Line */}
          <div className="mt-6 pt-6 border-t border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-[var(--text-primary)] uppercase tracking-wide">Wellbeing Trend Over Time</h3>
              <span className="text-xs text-[var(--text-muted)]">Last {wellbeingPoints.length} periods</span>
            </div>
            <Sparkline points={wellbeingPoints} color={getScoreStatus(overallScore).color} />
          </div>
        </CardContent>
      </Card>

      {/* Which Teams Need Attention - Full Width */}
      <Card className="border border-[#E0E7F1] shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-[var(--text-muted)] uppercase tracking-wide">{attentionLabel}</CardTitle>
        </CardHeader>
        <CardContent>
          {teamSummary.sorted.length > 0 ? (
            <>
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
            </>
          ) : (
            <div className="text-center py-8 text-[var(--text-muted)]">
              <p className="text-sm font-medium">No team Data?</p>
              <p className="text-xs mt-1">Compare against last report to track shifts in psychosocial risk.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Divisions heatmap table - Full Width */}
      <Card className="border border-[#E0E7F1] shadow-sm overflow-hidden">
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
                    // Use same soft opacity as Beacon Index legend (~25%)
                    const opacity = 0.25;
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

      {/* Key Insights - Horizontal Layout */}
      <div>
        <h3 className="text-sm font-bold text-[var(--text-muted)] uppercase tracking-wide mb-4">Key Insights</h3>
        {insights.length === 0 ? (
          <div className="text-muted-foreground text-xs">No significant patterns detected.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {insights.map((insight, index) => {
              const visuals = getInsightVisual(insight.type);
              return (
                <div
                  key={index}
                  className="rounded-lg p-4 space-y-2 border"
                  style={{ borderColor: visuals.border, backgroundColor: visuals.background }}
                >
                  <div className="flex items-start gap-2">
                    {insight.icon && (
                      <span className="mt-0.5 text-lg" style={{ color: visuals.border }}>
                        {insight.icon}
                      </span>
                    )}
                    <div className="font-medium text-[var(--text-primary)] leading-snug text-sm">
                      {insight.text}
                    </div>
                  </div>
                  {insight.recommendation && (
                    <div className="text-[var(--text-muted)] leading-snug text-xs pl-7">
                      → {insight.recommendation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

