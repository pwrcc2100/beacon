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

  const interpretation = [
    { range: '≥ 80%', label: 'Strong psychosocial safety', color: '#D1FAE5', textColor: '#065F46' },
    { range: '65 – 79%', label: 'Generally positive — monitor', color: '#FEF3C7', textColor: '#92400E' },
    { range: '< 65%', label: 'Elevated psychosocial risk', color: '#FEE2E2', textColor: '#991B1B' },
  ];

  return (
    <div className="rounded-lg border border-gray-200 p-3 space-y-3">
      {/* Weighting Formula */}
      <div>
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

      {/* Beacon Index Interpretation */}
      <div className="pt-3 border-t border-gray-200">
        <div className="text-xs uppercase text-[var(--text-muted)] font-semibold tracking-wide mb-2">
          Beacon Index %
        </div>
        <div className="space-y-1.5">
          {interpretation.map(item => (
            <div 
              key={item.range} 
              className="flex items-center justify-between text-xs px-2 py-1.5 rounded"
              style={{ backgroundColor: item.color }}
            >
              <span className="font-bold" style={{ color: item.textColor }}>{item.range}</span>
              <span className="text-[var(--text-primary)]">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
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
  tableTitle = 'Divisions'
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
      {/* Combined Overall Wellbeing Score + Current Sentiment Card */}
      <Card className="border border-[#E0E7F1] shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-[var(--text-muted)] uppercase tracking-wide">Overall Wellbeing Score</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 lg:grid-cols-[1fr,1.2fr]">
            {/* Left: Gauge and Weighting */}
            <div className="space-y-4">
              <SemiCircularGauge value={overallScore} previous={previousScore} />
              <WeightingBreakdown />
            </div>

            {/* Right: Current Sentiment Questions and AI Insight */}
            <div className="space-y-4">
              <div className="text-xs font-medium text-[var(--text-muted)] uppercase mb-3">Current Sentiment</div>
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
              <div className="flex items-baseline gap-2 pt-2">
                <span className="text-sm font-medium text-[var(--text-muted)] uppercase">Participation</span>
                <span className="text-3xl font-semibold" style={{ color: SCORE_COLORS.thriving }}>{formatPercent(participationRate)}</span>
              </div>
            </div>
          </div>

          {/* Bottom: Historical Wellbeing Chart */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="text-xs font-medium text-[var(--text-muted)] uppercase mb-3">Historical Wellbeing Score</div>
            <Sparkline points={wellbeingPoints} color="#2E96FF" />
          </div>
        </CardContent>
      </Card>

      {/* Which Teams Need Attention - Full Width */}
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

      {/* Divisions table - Full Width */}
      <Card className="border border-[#E0E7F1] shadow-sm overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-[var(--text-muted)] uppercase tracking-wide">{tableTitle}</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="min-w-full text-xs">
            <thead className="text-[var(--text-muted)] bg-[#F8FAFC]">
              <tr>
                <th className="text-left font-medium px-3 py-2">Division</th>
                <th className="text-right font-medium px-3 py-2">Overall</th>
                <th className="text-right font-medium px-3 py-2">Sentiment</th>
                <th className="text-right font-medium px-3 py-2">Clarity</th>
                <th className="text-right font-medium px-3 py-2">Workload</th>
                <th className="text-right font-medium px-3 py-2">Safety</th>
                <th className="text-right font-medium px-3 py-2">Leadership</th>
                <th className="text-right font-medium px-3 py-2">Responses</th>
              </tr>
            </thead>
            <tbody>
              {divisions.map(row => {
                const wellbeing = Math.round(row.wellbeing_score ?? 0);
                return (
                  <tr key={row.id} className="border-t">
                    <td className="px-3 py-2 font-medium text-[var(--text-primary)]">{row.name}</td>
                <td className="px-3 py-2 text-right" style={{ color: getScoreStatus(wellbeing).color }}>{formatPercent(wellbeing)}</td>
                <td className="px-3 py-2 text-right">{formatPercent(row.sentiment_avg * 20)}</td>
                <td className="px-3 py-2 text-right">{formatPercent(row.clarity_avg * 20)}</td>
                <td className="px-3 py-2 text-right">{formatPercent(row.workload_avg * 20)}</td>
                <td className="px-3 py-2 text-right">{formatPercent(row.safety_avg * 20)}</td>
                <td className="px-3 py-2 text-right">{formatPercent(row.leadership_avg * 20)}</td>
                    <td className="px-3 py-2 text-right text-[var(--text-muted)]">{row.response_count ?? 0}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Key Insights - Horizontal Grid (2 per row) */}
      <div className="grid gap-4 md:grid-cols-2">
        {insights.length === 0 && (
          <div className="text-muted-foreground text-xs col-span-2">No significant patterns detected.</div>
        )}
        {insights.map((insight, index) => {
          const visuals = getInsightVisual(insight.type);
          return (
            <Card
              key={index}
              className="border shadow-sm"
              style={{ borderColor: visuals.border, backgroundColor: visuals.background }}
            >
              <CardContent className="p-4 space-y-2">
                <div className="flex items-start gap-2">
                  {insight.icon && (
                    <span className="mt-0.5 text-lg" style={{ color: visuals.border }}>
                      {insight.icon}
                    </span>
                  )}
                  <div className="font-medium text-[var(--text-primary)] text-sm leading-snug">
                    {insight.text}
                  </div>
                </div>
                {insight.recommendation && (
                  <div className="text-[var(--text-muted)] text-xs leading-snug pl-7">
                    → {insight.recommendation}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

