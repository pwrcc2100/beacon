'use client';

/**
 * Dashboard overview in V2 design theme: dark background (#0f1e28, #1a2632),
 * circular gauge, horizontal domain bars, gradient accents, risk badges.
 */
import type { ExecutiveInsight } from '@/lib/executiveInsights';
import { getScoreStatus, formatPercent, SCORE_COLORS } from './scoreTheme';
import { ScoreGaugeV2 } from './ScoreGaugeV2';
import { DomainBarsV2, type DomainScores } from './DomainBarsV2';
import { TeamsAttentionChart } from './TeamsAttentionChart';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

const CARD_BG = '#0f1e28';
const TRACK_BG = '#1a2632';
const TEXT_MUTED = '#94a3b8';
const TEXT_PRIMARY = '#e2e8f0';

type TrendPoint = { label: string; wellbeing: number; safety?: number };
type TeamScore = { id: string; name: string; displayName?: string; divisionName?: string; departmentName?: string; wellbeing: number };
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

type ExecutiveOverviewV2Props = {
  overallScore?: number;
  previousScore?: number;
  trendSeries: TrendPoint[];
  questionScores: Record<'sentiment' | 'clarity' | 'workload' | 'safety' | 'leadership', number>;
  participationRate: number;
  teams: TeamScore[];
  divisions: DivisionRow[];
  insights: ExecutiveInsight[];
  attentionLabel?: string;
  tableTitle?: string;
  onDivisionClick?: (divisionId: string, divisionName: string) => void;
};

function MetricCardV2({
  label,
  value,
  trend,
  color,
}: {
  label: string;
  value: string | number;
  trend?: string;
  color: string;
}) {
  return (
    <div
      className="rounded-2xl p-5 border border-white/5"
      style={{ background: TRACK_BG }}
    >
      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">{label}</p>
      <p className="mt-3 text-2xl font-bold tabular-nums" style={{ color }}>
        {value}
      </p>
      {trend && <p className="mt-1 text-xs text-slate-500">{trend}</p>}
    </div>
  );
}

export default function ExecutiveOverviewV2({
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
}: ExecutiveOverviewV2Props) {
  const router = useRouter();
  const status = getScoreStatus(Math.round(overallScore));
  const trend = previousScore != null ? overallScore - previousScore : 0;
  const trendText = trend > 0 ? `+${trend.toFixed(1)}%` : `${trend.toFixed(1)}%`;
  const labelFrequency = Math.max(1, Math.ceil(trendSeries.length / 10));
  const teamsNeedingAttention = teams.filter((t) => t.wellbeing < 65).length;

  const domainScores: DomainScores = {
    experience: questionScores.sentiment ?? 0,
    workload: questionScores.workload ?? 0,
    safety: questionScores.safety ?? 0,
    leadership: questionScores.leadership ?? 0,
    clarity: questionScores.clarity ?? 0,
  };

  const handleTeamClick = (teamId: string, teamName: string) => {
    router.push(`/dashboard/group-leader?team_id=${teamId}`);
  };

  const handleInsightClick = (insight: ExecutiveInsight) => {
    if (insight.relatedEntities?.length) {
      const entity = insight.relatedEntities[0];
      if (entity.type === 'team') router.push(`/dashboard/group-leader?team_id=${entity.id}`);
    }
  };

  return (
    <div className="space-y-8 rounded-2xl p-6 md:p-8" style={{ background: CARD_BG }}>
      <div>
        <h2 className="text-xl font-semibold md:text-2xl" style={{ color: TEXT_PRIMARY }}>
          Beacon Index Overview
        </h2>
        <p className="mt-1 text-sm" style={{ color: TEXT_MUTED }}>
          Latest check-in insights across sentiment, workload, support, safety and leadership.
        </p>
      </div>

      {/* Top: Gauge + Domain bars + Metric cards */}
      <div className="grid gap-8 lg:grid-cols-[auto_1fr]">
        <div className="flex flex-col items-center gap-6">
          <ScoreGaugeV2 score={overallScore} animate />
          <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-4">
            <MetricCardV2
              label="Beacon Index"
              value={`${Math.round(overallScore)}%`}
              trend={previousScore != null ? `${trendText} vs previous` : undefined}
              color={status.color}
            />
            <MetricCardV2
              label="Participation"
              value={`${Math.round(participationRate)}%`}
              color={participationRate >= 70 ? SCORE_COLORS.thriving : participationRate >= 40 ? SCORE_COLORS.watch : SCORE_COLORS.alert}
            />
            <MetricCardV2
              label="Teams need attention"
              value={teamsNeedingAttention}
              trend={`of ${teams.length} teams`}
              color={teamsNeedingAttention > 5 ? SCORE_COLORS.alert : teamsNeedingAttention > 2 ? SCORE_COLORS.watch : SCORE_COLORS.thriving}
            />
            <MetricCardV2
              label="Trend"
              value={trend > 0 ? '↗' : trend < 0 ? '↘' : '→'}
              trend={previousScore != null ? trendText : undefined}
              color={trend > 0 ? SCORE_COLORS.thriving : trend < -5 ? SCORE_COLORS.alert : SCORE_COLORS.watch}
            />
          </div>
        </div>
        <div className="min-w-0">
          <h3 className="text-lg font-semibold mb-4" style={{ color: TEXT_PRIMARY }}>
            Domain scores
          </h3>
          <DomainBarsV2 scores={domainScores} />
        </div>
      </div>

      {/* Trend over time */}
      <div className="rounded-2xl p-6 border border-white/5" style={{ background: TRACK_BG }}>
        <h3 className="text-lg font-semibold mb-2" style={{ color: TEXT_PRIMARY }}>
          Beacon Index over time
        </h3>
        <p className="text-sm mb-4" style={{ color: TEXT_MUTED }}>
          Last {trendSeries.length} reporting periods
        </p>
        {trendSeries.length > 0 ? (
          <div className="w-full h-40">
            <svg viewBox="0 0 800 160" className="w-full h-full">
              <line x1="40" y1="120" x2="760" y2="120" stroke="#334155" strokeWidth="1" />
              <line x1="40" y1="80" x2="760" y2="80" stroke="#334155" strokeWidth="0.5" />
              <line x1="40" y1="40" x2="760" y2="40" stroke="#334155" strokeWidth="0.5" />
              <text x="30" y="125" textAnchor="end" fontSize="11" fill={TEXT_MUTED}>0%</text>
              <text x="30" y="85" textAnchor="end" fontSize="11" fill={TEXT_MUTED}>50%</text>
              <text x="30" y="45" textAnchor="end" fontSize="11" fill={TEXT_MUTED}>100%</text>
              <path
                d={trendSeries
                  .map((point, i) => {
                    const x = 40 + (i / Math.max(1, trendSeries.length - 1)) * 720;
                    const y = 120 - (point.wellbeing / 100) * 80;
                    return `${i === 0 ? 'M' : 'L'}${x},${y}`;
                  })
                  .join(' ')}
                stroke="url(#trendGradientV2)"
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <defs>
                <linearGradient id="trendGradientV2" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="50%" stopColor="#f97316" />
                  <stop offset="100%" stopColor="#c2410c" />
                </linearGradient>
              </defs>
              {trendSeries.map((point, i) => {
                const x = 40 + (i / Math.max(1, trendSeries.length - 1)) * 720;
                const y = 120 - (point.wellbeing / 100) * 80;
                const showLabel = trendSeries.length <= 12 || i % labelFrequency === 0 || i === trendSeries.length - 1;
                return (
                  <g key={i}>
                    <circle cx={x} cy={y} r="4" fill={TRACK_BG} stroke="#f97316" strokeWidth="1.5" />
                    {showLabel && (
                      <text x={x} y="138" textAnchor="middle" fontSize="9" fill={TEXT_MUTED}>
                        {point.label}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>
        ) : (
          <p className="text-sm py-6 text-center" style={{ color: TEXT_MUTED }}>
            No trend data yet
          </p>
        )}
      </div>

      {/* Key insights + Teams */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1 space-y-4 rounded-2xl p-6 border border-white/5" style={{ background: TRACK_BG }}>
          <h3 className="text-lg font-semibold" style={{ color: TEXT_PRIMARY }}>
            Key insights
          </h3>
          {insights.slice(0, 3).map((insight, idx) => {
            const colors = insight.type === 'positive' ? SCORE_COLORS.thriving : insight.type === 'warning' ? SCORE_COLORS.alert : SCORE_COLORS.watch;
            const isClickable = !!insight.relatedEntities?.length;
            return (
              <div
                key={idx}
                className={cn(
                  'rounded-xl p-4 border transition-colors',
                  isClickable && 'cursor-pointer hover:border-white/20'
                )}
                style={{ borderColor: `${colors}40`, background: `${colors}12` }}
                onClick={() => isClickable && handleInsightClick(insight)}
              >
                <p className="text-sm font-medium" style={{ color: TEXT_PRIMARY }}>
                  {insight.text}
                </p>
                {insight.recommendation && (
                  <p className="mt-2 text-xs" style={{ color: TEXT_MUTED }}>
                    {insight.recommendation}
                  </p>
                )}
                {isClickable && (
                  <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-sky-400">
                    View details →
                  </p>
                )}
              </div>
            );
          })}
        </div>
        <div className="lg:col-span-2">
          <TeamsAttentionChart
            teams={teams.map((t) => ({
              id: t.id,
              name: t.displayName ?? t.name,
              rawName: t.name,
              division: t.divisionName,
              department: t.departmentName,
              score: t.wellbeing,
            }))}
            onTeamClick={handleTeamClick}
          />
        </div>
      </div>

      {/* Divisions table - V2 dark style */}
      <div className="rounded-2xl overflow-hidden border border-white/5" style={{ background: TRACK_BG }}>
        <div className="p-4 border-b border-white/10">
          <h3 className="text-lg font-semibold" style={{ color: TEXT_PRIMARY }}>
            {tableTitle}
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left uppercase tracking-wider text-xs border-b border-white/10" style={{ color: TEXT_MUTED }}>
                <th className="py-3 pl-4 pr-3">Name</th>
                <th className="py-3 px-3 text-center">Overall</th>
                <th className="py-3 px-3 text-center">Sentiment</th>
                <th className="py-3 px-3 text-center">Clarity</th>
                <th className="py-3 px-3 text-center">Workload</th>
                <th className="py-3 px-3 text-center">Safety</th>
                <th className="py-3 px-3 text-center">Leadership</th>
                <th className="py-3 px-3 text-center">Participation</th>
              </tr>
            </thead>
            <tbody>
              {divisions.map((row) => {
                const wellbeing = Math.round(row.wellbeing_score ?? 0);
                const sentiment = Math.round(row.sentiment_avg * 20);
                const clarity = Math.round(row.clarity_avg * 20);
                const workload = Math.round(row.workload_avg * 20);
                const safety = Math.round(row.safety_avg * 20);
                const leadership = Math.round(row.leadership_avg * 20);
                const participation =
                  row.total_employees && row.total_employees > 0
                    ? Math.round((row.response_count / row.total_employees) * 100)
                    : 0;
                const cellStyle = (score: number) => {
                  const s = getScoreStatus(score);
                  return { color: s.color, fontWeight: 600 as const };
                };
                return (
                  <tr
                    key={row.id}
                    className="border-b border-white/5 last:border-0 cursor-pointer hover:bg-white/5 transition-colors"
                    onClick={() => onDivisionClick?.(row.id, row.name)}
                  >
                    <td className="py-3 pl-4 pr-3 text-sm font-medium whitespace-nowrap" style={{ color: TEXT_PRIMARY }}>
                      {row.name}
                    </td>
                    <td className="py-3 px-3 text-center text-sm" style={cellStyle(wellbeing)}>
                      {formatPercent(wellbeing)}
                    </td>
                    <td className="py-3 px-3 text-center text-sm" style={cellStyle(sentiment)}>
                      {formatPercent(sentiment)}
                    </td>
                    <td className="py-3 px-3 text-center text-sm" style={cellStyle(clarity)}>
                      {formatPercent(clarity)}
                    </td>
                    <td className="py-3 px-3 text-center text-sm" style={cellStyle(workload)}>
                      {formatPercent(workload)}
                    </td>
                    <td className="py-3 px-3 text-center text-sm" style={cellStyle(safety)}>
                      {formatPercent(safety)}
                    </td>
                    <td className="py-3 px-3 text-center text-sm" style={cellStyle(leadership)}>
                      {formatPercent(leadership)}
                    </td>
                    <td className="py-3 px-3 text-center text-sm" style={cellStyle(participation)}>
                      {participation > 0 ? `${participation}%` : 'N/A'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
