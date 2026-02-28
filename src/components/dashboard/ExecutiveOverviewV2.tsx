'use client';

/**
 * Dashboard overview matching Beacon Index (beaconindex.com.au): light backgrounds,
 * readable dark text, teal/navy accents, circular gauge, domain bars.
 */
import type { ExecutiveInsight } from '@/lib/executiveInsights';
import { getScoreStatus, formatPercent, SCORE_COLORS } from './scoreTheme';
import { ScoreGaugeV2 } from './ScoreGaugeV2';
import { DomainBarsV2, type DomainScores } from './DomainBarsV2';
import { TeamsAttentionChart } from './TeamsAttentionChart';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

const CARD_BG = '#ffffff';
const CARD_BORDER = '#E0E5E8';
const SECTION_BG = '#F2F7F5';
const TEXT_PRIMARY = '#0B1B2B';
const TEXT_MUTED = '#2E4057';
const TEXT_SUBTLE = '#5b6670';
const ACCENT = '#2F6F7E';
const ACCENT_TEAL = '#2A8C8A';

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
      className="rounded-xl p-5 border shadow-sm"
      style={{ background: CARD_BG, borderColor: CARD_BORDER }}
    >
      <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: TEXT_SUBTLE }}>{label}</p>
      <p className="mt-3 text-2xl font-bold tabular-nums" style={{ color }}>
        {value}
      </p>
      {trend && <p className="mt-1 text-xs" style={{ color: TEXT_SUBTLE }}>{trend}</p>}
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
    <div className="space-y-8 rounded-2xl p-6 md:p-8 border shadow-sm" style={{ background: SECTION_BG, borderColor: CARD_BORDER }}>
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
          <ScoreGaugeV2 score={overallScore} animate variant="light" />
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
          <DomainBarsV2 scores={domainScores} variant="light" />
        </div>
      </div>

      {/* Trend over time */}
      <div className="rounded-xl p-6 border shadow-sm" style={{ background: CARD_BG, borderColor: CARD_BORDER }}>
        <h3 className="text-lg font-semibold mb-2" style={{ color: TEXT_PRIMARY }}>
          Beacon Index over time
        </h3>
        <p className="text-sm mb-4" style={{ color: TEXT_MUTED }}>
          Last {trendSeries.length} reporting periods
        </p>
        {trendSeries.length > 0 ? (
          <div className="w-full h-40">
            <svg viewBox="0 0 800 160" className="w-full h-full">
              <line x1="40" y1="120" x2="760" y2="120" stroke="#E0E5E8" strokeWidth="1" />
              <line x1="40" y1="80" x2="760" y2="80" stroke="#E8ECF0" strokeWidth="0.5" />
              <line x1="40" y1="40" x2="760" y2="40" stroke="#E8ECF0" strokeWidth="0.5" />
              <text x="30" y="125" textAnchor="end" fontSize="11" fill={TEXT_SUBTLE}>0%</text>
              <text x="30" y="85" textAnchor="end" fontSize="11" fill={TEXT_SUBTLE}>50%</text>
              <text x="30" y="45" textAnchor="end" fontSize="11" fill={TEXT_SUBTLE}>100%</text>
              <path
                d={trendSeries
                  .map((point, i) => {
                    const x = 40 + (i / Math.max(1, trendSeries.length - 1)) * 720;
                    const y = 120 - (point.wellbeing / 100) * 80;
                    return `${i === 0 ? 'M' : 'L'}${x},${y}`;
                  })
                  .join(' ')}
                stroke={ACCENT}
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {trendSeries.map((point, i) => {
                const x = 40 + (i / Math.max(1, trendSeries.length - 1)) * 720;
                const y = 120 - (point.wellbeing / 100) * 80;
                const showLabel = trendSeries.length <= 12 || i % labelFrequency === 0 || i === trendSeries.length - 1;
                return (
                  <g key={i}>
                    <circle cx={x} cy={y} r="4" fill={CARD_BG} stroke={ACCENT_TEAL} strokeWidth="1.5" />
                    {showLabel && (
                      <text x={x} y="138" textAnchor="middle" fontSize="9" fill={TEXT_SUBTLE}>
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
        <div className="lg:col-span-1 space-y-4 rounded-xl p-6 border shadow-sm" style={{ background: CARD_BG, borderColor: CARD_BORDER }}>
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
                  'rounded-lg p-4 border transition-colors',
                  isClickable && 'cursor-pointer hover:border-[#2F6F7E]/50'
                )}
                style={{ borderColor: `${colors}40`, background: `${colors}08` }}
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
                  <p className="mt-2 text-xs font-semibold uppercase tracking-wide" style={{ color: ACCENT }}>
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

      {/* Divisions table */}
      <div className="rounded-xl overflow-hidden border shadow-sm" style={{ background: CARD_BG, borderColor: CARD_BORDER }}>
        <div className="p-4 border-b" style={{ borderColor: CARD_BORDER }}>
          <h3 className="text-lg font-semibold" style={{ color: TEXT_PRIMARY }}>
            {tableTitle}
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left uppercase tracking-wider text-xs border-b" style={{ color: TEXT_SUBTLE, borderColor: CARD_BORDER }}>
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
                    className="border-b last:border-0 cursor-pointer hover:bg-[#F2F7F5]/80 transition-colors"
                    style={{ borderColor: CARD_BORDER }}
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
