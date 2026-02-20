'use client';

/**
 * ENHANCED EXECUTIVE DASHBOARD
 * Screenshot-friendly, webinar-ready design
 * - Executive Summary panel with auto-generated insights
 * - Operational/compliance-ready KPI strip
 * - Driver-based Leading Indicators (not survey-ish)
 * - Explicit action pathways with triage bands
 * - Share view mode for clean screenshots
 */

import type { ExecutiveInsight } from '@/lib/executiveInsights';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  formatPercent,
  getScoreStatus,
  SCORE_COLORS,
  SCORE_THRESHOLDS,
} from './scoreTheme';
import { TeamsAttentionChart } from './TeamsAttentionChart';

const DRIVER_META = {
  clarity: { label: 'Role Clarity', driver: 'clarity', escalationRisk: 'high' },
  workload: { label: 'Workload Manageability', driver: 'workload', escalationRisk: 'high' },
  safety: { label: 'Psychological Safety', driver: 'safety', escalationRisk: 'critical' },
  leadership: { label: 'Leadership Support', driver: 'leadership', escalationRisk: 'high' },
  sentiment: { label: 'Overall Sentiment', driver: 'sentiment', escalationRisk: 'moderate' },
} as const;

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

type ExecutiveSummary = {
  whatsChanging: string;
  whereToFocus: string;
  whatToDoNext: string;
};

type ExecutiveOverviewEnhancedProps = {
  overallScore?: number;
  previousScore?: number;
  trendSeries: TrendPoint[];
  questionScores: QuestionScores;
  participationRate: number;
  responseRate: { responded: number; total: number };
  teams: TeamScore[];
  divisions: DivisionRow[];
  insights: ExecutiveInsight[];
  attentionLabel?: string;
  tableTitle?: string;
  onDivisionClick?: (divisionId: string, divisionName: string) => void;
};

// =============================================================================
// EXECUTIVE SUMMARY GENERATOR (Rule-Based, No AI)
// =============================================================================
function generateExecutiveSummary(
  overallScore: number | undefined,
  previousScore: number | undefined,
  questionScores: QuestionScores,
  teams: TeamScore[]
): ExecutiveSummary {
  // 1) What's changing
  let whatsChanging = "Beacon Index stable – no significant movement detected.";
  if (overallScore !== undefined && previousScore !== undefined) {
    const delta = overallScore - previousScore;
    const absDelta = Math.abs(delta);
    
    if (absDelta >= 5) {
      const direction = delta > 0 ? "improved" : "declined";
      const magnitude = absDelta >= 10 ? "significantly" : "";
      whatsChanging = `Beacon Index ${direction} ${magnitude} by ${absDelta.toFixed(1)} points vs. previous period.`;
    } else if (absDelta >= 2) {
      whatsChanging = `Beacon Index showing minor ${delta > 0 ? 'upward' : 'downward'} movement (${delta > 0 ? '+' : ''}${delta.toFixed(1)} points).`;
    }
  } else if (overallScore !== undefined) {
    whatsChanging = `Current Beacon Index: ${overallScore.toFixed(1)}% – baseline period.`;
  }

  // 2) Where to focus
  let whereToFocus = "All teams above 65% threshold – continue monitoring.";
  const lowTeams = teams.filter(t => t.wellbeing < 65).sort((a, b) => a.wellbeing - b.wellbeing);
  const watchTeams = teams.filter(t => t.wellbeing >= 65 && t.wellbeing < 80);
  
  if (lowTeams.length > 0) {
    const lowestTeam = lowTeams[0];
    const count = lowTeams.length;
    whereToFocus = `${count} team${count > 1 ? 's' : ''} below 65% requiring immediate attention. Lowest: ${lowestTeam.displayName || lowestTeam.name} (${lowestTeam.wellbeing.toFixed(0)}%).`;
  } else if (watchTeams.length > 0) {
    whereToFocus = `${watchTeams.length} team${watchTeams.length > 1 ? 's' : ''} in watch band (65-79%) – schedule manager conversations within 14 days.`;
  }

  // 3) What to do next (mapped to lowest driver)
  const driversArray = [
    { key: 'clarity', score: questionScores.clarity * 20, label: 'Role Clarity' },
    { key: 'workload', score: questionScores.workload * 20, label: 'Workload' },
    { key: 'safety', score: questionScores.safety * 20, label: 'Psychological Safety' },
    { key: 'leadership', score: questionScores.leadership * 20, label: 'Leadership Support' },
  ];
  
  const lowestDriver = driversArray.sort((a, b) => a.score - b.score)[0];
  
  const actionMap: Record<string, string> = {
    clarity: "Review role definitions and priority-setting processes. Conduct one-on-ones to clarify expectations.",
    workload: "Audit current workload distribution. Identify resourcing gaps or reprioritization opportunities.",
    safety: "Facilitate team retrospectives. Reinforce speak-up culture and psychological safety principles.",
    leadership: "Provide leadership coaching. Review manager effectiveness and support structures.",
  };
  
  let whatToDoNext = actionMap[lowestDriver.key] || "Continue standard governance monitoring and quarterly reviews.";
  
  if (lowTeams.length > 0) {
    whatToDoNext = `Primary driver: ${lowestDriver.label} (${lowestDriver.score.toFixed(0)}%). ${actionMap[lowestDriver.key]}`;
  }

  return { whatsChanging, whereToFocus, whatToDoNext };
}

// =============================================================================
// COMPONENTS
// =============================================================================

function TooltipIcon({ text }: { text: string }) {
  return (
    <div className="group relative inline-block ml-1">
      <svg className="w-4 h-4 text-slate-400 hover:text-slate-600 cursor-help" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <div className="hidden group-hover:block absolute z-50 w-64 p-2 text-xs bg-slate-800 text-white rounded shadow-lg -top-2 left-6">
        {text}
      </div>
    </div>
  );
}

function MetricCardEnhanced({
  label,
  value,
  trend,
  tooltipText,
  dataCoverage,
  className,
}: {
  label: string;
  value: string | number;
  trend?: string;
  tooltipText: string;
  dataCoverage?: string;
  className?: string;
}) {
  return (
    <Card className={cn("bg-white border border-slate-200", className)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center text-sm font-medium text-slate-600">
            {label}
            <TooltipIcon text={tooltipText} />
          </div>
          {trend && (
            <span className={cn(
              "text-xs font-semibold px-2 py-1 rounded",
              trend.startsWith('+') ? "bg-green-50 text-green-700" : trend.startsWith('-') ? "bg-red-50 text-red-700" : "bg-slate-50 text-slate-600"
            )}>
              {trend}
            </span>
          )}
        </div>
        <div className="text-3xl font-bold text-slate-900">{value}</div>
        {dataCoverage && (
          <div className="text-xs text-slate-500 mt-1">{dataCoverage}</div>
        )}
      </CardContent>
    </Card>
  );
}

function ExecutiveSummaryPanel({ summary }: { summary: ExecutiveSummary }) {
  return (
    <Card className="bg-gradient-to-r from-blue-50 to-slate-50 border-l-4 border-l-blue-600">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
          <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Executive Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="grid md:grid-cols-3 gap-4 text-sm">
        <div>
          <div className="font-semibold text-slate-700 mb-1">What's changing</div>
          <p className="text-slate-600 leading-relaxed">{summary.whatsChanging}</p>
        </div>
        <div>
          <div className="font-semibold text-slate-700 mb-1">Where to focus</div>
          <p className="text-slate-600 leading-relaxed">{summary.whereToFocus}</p>
        </div>
        <div>
          <div className="font-semibold text-slate-700 mb-1">What to do next</div>
          <p className="text-slate-600 leading-relaxed">{summary.whatToDoNext}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function TriageBandsLegend() {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-4">
      <div className="text-sm font-semibold text-slate-700 mb-3">Triage Bands & Expected Actions</div>
      <div className="grid md:grid-cols-3 gap-3 text-xs">
        <div className="flex items-start gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500 mt-0.5 flex-shrink-0"></div>
          <div>
            <div className="font-semibold text-red-700">High Alert (&lt;65%)</div>
            <div className="text-slate-600">Immediate check-in + workload review within 7 days</div>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <div className="w-3 h-3 rounded-full bg-yellow-500 mt-0.5 flex-shrink-0"></div>
          <div>
            <div className="font-semibold text-yellow-700">Watch (65–79%)</div>
            <div className="text-slate-600">Manager conversation within 14 days</div>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500 mt-0.5 flex-shrink-0"></div>
          <div>
            <div className="font-semibold text-green-700">Thriving (80%+)</div>
            <div className="text-slate-600">Reinforce what's working</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function ExecutiveOverviewEnhanced({
  overallScore,
  previousScore,
  trendSeries,
  questionScores,
  participationRate,
  responseRate,
  teams,
  divisions,
  insights,
  attentionLabel = "Team Index Score",
  tableTitle = "Divisions",
}: ExecutiveOverviewEnhancedProps) {
  const [shareViewMode, setShareViewMode] = useState(false);
  const router = useRouter();

  const executiveSummary = useMemo(
    () => generateExecutiveSummary(overallScore, previousScore, questionScores, teams),
    [overallScore, previousScore, questionScores, teams]
  );

  // Sort drivers lowest to highest
  const sortedDrivers = useMemo(() => {
    const drivers = [
      { key: 'clarity', score: questionScores.clarity * 20, ...DRIVER_META.clarity },
      { key: 'workload', score: questionScores.workload * 20, ...DRIVER_META.workload },
      { key: 'safety', score: questionScores.safety * 20, ...DRIVER_META.safety },
      { key: 'leadership', score: questionScores.leadership * 20, ...DRIVER_META.leadership },
      { key: 'sentiment', score: questionScores.sentiment * 20, ...DRIVER_META.sentiment },
    ];
    return drivers.sort((a, b) => a.score - b.score);
  }, [questionScores]);

  const primaryDriver = sortedDrivers[0];
  const secondaryDriver = sortedDrivers[1];

  const scoreTrend = useMemo(() => {
    if (overallScore === undefined || previousScore === undefined) return undefined;
    const delta = overallScore - previousScore;
    if (Math.abs(delta) < 1) return undefined;
    return delta > 0 ? `+${delta.toFixed(1)}%` : `${delta.toFixed(1)}%`;
  }, [overallScore, previousScore]);

  const teamsNeedingAttention = useMemo(() => teams.filter(t => t.wellbeing < 80).length, [teams]);

  return (
    <div className={cn("space-y-6", shareViewMode && "share-view-mode")}>
      {/* Share View Toggle */}
      <div className="flex justify-end print:hidden">
        <button
          onClick={() => setShareViewMode(!shareViewMode)}
          className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
        >
          {shareViewMode ? "Exit Share View" : "📸 Share View"}
        </button>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCardEnhanced
          label="Overall Risk Signal (Beacon Index)"
          value={overallScore !== undefined ? `${overallScore.toFixed(1)}%` : "—"}
          trend={scoreTrend}
          tooltipText="Composite psychosocial risk indicator (0-100). Lower scores signal early strain requiring intervention to meet positive duty obligations."
          className={overallScore !== undefined && overallScore < 65 ? "border-l-4 border-l-red-500" : ""}
        />
        <MetricCardEnhanced
          label="Participation Rate"
          value={`${participationRate.toFixed(0)}%`}
          tooltipText="Percentage of active employees who have responded. Higher participation improves signal reliability for early detection."
          dataCoverage={`Coverage: ${responseRate.responded} / ${responseRate.total} employees`}
        />
        <MetricCardEnhanced
          label="Teams Needing Attention"
          value={teamsNeedingAttention}
          tooltipText="Number of teams below 80% threshold requiring manager check-in or structured support."
        />
        <MetricCardEnhanced
          label="Trend"
          value={trendSeries.length >= 2 ? "Tracking" : "Baseline"}
          trend={scoreTrend}
          tooltipText="Multi-period trend analysis. Sustained downward movement triggers escalation protocols."
        />
      </div>

      {/* Executive Summary */}
      <ExecutiveSummaryPanel summary={executiveSummary} />

      {/* Leading Indicators (Drivers) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div>
              <div className="text-lg font-semibold">Leading Indicators (Drivers)</div>
              <div className="text-sm font-normal text-slate-500 mt-1">
                Drivers most correlated with escalation risk when trending down
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {sortedDrivers.map((driver, index) => {
            const isPrimary = index === 0;
            const isSecondary = index === 1;
            const colorClass = driver.score < 60 ? 'bg-red-500' : driver.score < 70 ? 'bg-yellow-500' : driver.score < 80 ? 'bg-blue-500' : 'bg-green-500';
            
            return (
              <div key={driver.key} className="relative">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-700">{driver.label}</span>
                    {isPrimary && (
                      <span className="text-xs px-2 py-0.5 bg-red-100 text-red-700 rounded-full font-semibold">
                        Primary driver
                      </span>
                    )}
                    {isSecondary && (
                      <span className="text-xs px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full font-semibold">
                        Secondary driver
                      </span>
                    )}
                  </div>
                  <span className="text-sm font-semibold text-slate-900">{driver.score.toFixed(0)}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                  <div 
                    className={cn("h-full rounded-full transition-all", colorClass)}
                    style={{ width: `${Math.min(100, Math.max(0, driver.score))}%` }}
                  />
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Triage Bands + Team Index */}
      <div>
        <TriageBandsLegend />
        <TeamsAttentionChart 
          teams={teams.map(t => ({ ...t, score: t.wellbeing }))} 
        />
      </div>

      {/* Share View Footer */}
      {shareViewMode && (
        <div className="text-center text-xs text-slate-500 py-3 border-t border-slate-200 print:block">
          <p>Snapshot view – aggregated results, no individual-level data</p>
        </div>
      )}

      <style jsx global>{`
        .share-view-mode {
          max-width: 100%;
        }
        @media print {
          .share-view-mode nav,
          .share-view-mode aside,
          .share-view-mode .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
