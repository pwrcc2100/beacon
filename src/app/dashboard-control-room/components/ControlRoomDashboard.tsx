'use client';

import { Gauge, PressureGradientBar, StatusBadge, TrendSparkline } from './VisualComponents';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';
import { Activity, TrendingUp, ShieldCheck, BarChart3, ChevronRight, AlertTriangle, CheckCircle, TrendingDown } from 'lucide-react';
import { scoreToHex, scoreToGradient, scoreToBandLabel } from '../utils/scoreHelpers';
import type { BeaconSignal } from '@/lib/beaconSignals';
import { getControlForPressure } from '@/lib/executiveLogic';

function MotionDiv({
  animate,
  initial: _initial,
  transition: _transition,
  style,
  children,
  ...props
}: any) {
  const resolvedStyle = {
    ...style,
    ...(animate?.width ? { width: animate.width } : {}),
  };

  return (
    <div {...props} style={resolvedStyle}>
      {children}
    </div>
  );
}

const motion = {
  div: MotionDiv,
} as const;

interface TeamWithScore {
  id: string;
  name: string;
  displayName?: string;
  divisionName?: string;
  departmentName?: string;
  wellbeing: number;
  domainScores?: { sentiment: number; clarity: number; workload: number; safety: number; leadership: number };
}

interface ControlRoomDashboardProps {
  overallScore: number;
  previousScore?: number;
  trendData: number[];
  questionScores: {
    sentiment: number;
    clarity: number;
    workload: number;
    safety: number;
    leadership: number;
  };
  beaconSignals: BeaconSignal[];
  participationRate: number;
  teams: TeamWithScore[];
  responseCount: number;
  totalEmployees: number;
}

export default function ControlRoomDashboard({
  overallScore,
  previousScore,
  trendData,
  questionScores,
  beaconSignals,
  participationRate,
  teams,
  responseCount,
  totalEmployees,
}: ControlRoomDashboardProps) {
  // Ensure we have valid data (use local variables, don't mutate props)
  const validTrendData = trendData && trendData.length > 0 ? trendData : [overallScore || 0];
  const validTeams = teams && teams.length > 0 ? teams : [];
  
  // Build chart data for pressure trajectory (last 6-12 periods)
  const trajectoryData = validTrendData.slice(-12).map((score, idx) => ({
    value: Math.round(score),
  }));
  const trajectoryDelta = validTrendData.length >= 2 ? (validTrendData[validTrendData.length - 1] ?? 0) - (validTrendData[0] ?? 0) : 0;

  // Domain data — use the same questionScores that were used to calculate overallScore
  // Both questionScores and overallScore come from getData() which applies the same filters
  // (period, mode, divisionId, departmentId, teamId, selectedDepartments) as the Exposure Heatmap
  // 
  // The Composite Index is calculated as:
  // (sentiment*0.25 + workload*0.25 + safety*0.2 + leadership*0.2 + clarity*0.1) * 20
  // Individual domain scores shown are: questionScores[key] * 20
  //
  // IMPORTANT: Domain Pressure Analysis shows ORGANIZATIONAL AVERAGE across all filtered responses.
  // Exposure Heatmap shows INDIVIDUAL TEAMS sorted by wellbeing (lowest first).
  // This is intentional - the heatmap highlights teams needing attention, while Domain Pressure
  // Analysis shows overall organizational health. Both use the same filtered dataset.
  const domainKeys = ['sentiment', 'workload', 'safety', 'leadership', 'clarity'] as const;
  const domainNames = ['Experience', 'Workload & Resourcing', 'Psychological Safety', 'Leadership & Support', 'Clarity & Direction'];
  // Map to executive logic keys (sentiment -> experience)
  const execKeys = ['experience', 'workload', 'safety', 'leadership', 'clarity'] as const;

  // Use questionScores directly - these are the same values used to calculate overallScore
  // Both come from the same filtered dataset via getData()
  const domainAverages = domainKeys.map((key) => questionScores[key] ?? 0);

  // Build trend data for each domain (use overall trend as proxy if domain-specific trends unavailable)
  const domains = domainKeys.map((key, i) => {
    // Use overall validTrendData as proxy for domain trends, scaled to domain average
    const domainScore100 = domainAverages[i] * 20;
    const trend = validTrendData.length >= 6 
      ? validTrendData.slice(-6).map(score => {
          // Scale trend data proportionally to domain score
          const avgTrend = validTrendData.reduce((a, b) => a + b, 0) / validTrendData.length;
          return avgTrend > 0 ? (score / avgTrend) * domainScore100 : domainScore100;
        })
      : Array(6).fill(domainScore100);
    
    return {
      name: domainNames[i],
      score: domainAverages[i],
      execKey: execKeys[i],
      trend,
    };
  });

  // Primary pressure domain (lowest-scoring domain among displayed teams)
  const primaryPressure = domains.length > 0 
    ? domains.reduce((a, b) => ((b.score * 20) < (a.score * 20) ? b : a))
    : { name: 'N/A', score: 0, execKey: 'experience' as const, trend: [] };
  const primaryScore100 = Math.round(primaryPressure.score * 20);
  
  // Extract domain scores for propagation model
  const domainScores: Record<string, number> = {};
  domains.forEach((domain) => {
    const key = domain.name === 'Experience' ? 'experience' :
                domain.name === 'Workload & Resourcing' ? 'workload' :
                domain.name === 'Psychological Safety' ? 'safety' :
                domain.name === 'Leadership & Support' ? 'leadership' :
                'clarity';
    domainScores[key] = Math.round(domain.score * 20);
  });
  
  const experience = domainScores.experience ?? 0;
  const workload = domainScores.workload ?? 0;
  const safety = domainScores.safety ?? 0;
  const leadership = domainScores.leadership ?? 0;
  const clarity = domainScores.clarity ?? 0;

  // Pattern for recommendations: Emerging when below tolerance or declining, else Localised
  const pressurePattern = primaryScore100 < 60 || trajectoryDelta < -5 ? 'Emerging' : 'Localised';
  let controlTile;
  let recommendations: Array<{ action: string }> = [];
  try {
    controlTile = getControlForPressure(primaryPressure.execKey, pressurePattern);
    recommendations = controlTile.steps.map((action) => ({ action }));
  } catch (error) {
    console.error('Error getting control tile:', error);
    // Fallback recommendations
    recommendations = [{ action: 'Review organizational data and identify pressure points' }];
  }

  // Generate key insights using Beacon Index Psychosocial Risk Propagation Model
  const generateKeyInsights = () => {
    const insights: Array<{ domain: string; text: string; recommendation: string; type: 'positive' | 'warning' | 'neutral' }> = [];
    
    // PROPAGATION PATHWAY 1: Workload → Experience
    if (workload < 55 && experience < 50) {
      insights.push({
        domain: 'System',
        text: 'Operational demand may be exceeding workforce capacity and driving declining experience.',
        recommendation: 'Rebalance workload and available resources by removing non-essential tasks or adjusting timelines.',
        type: 'warning'
      });
    }
    
    // PROPAGATION PATHWAY 2: Clarity → Workload
    if (clarity < 60 && workload < 60) {
      insights.push({
        domain: 'System',
        text: 'Coordination misalignment may be generating unnecessary workload pressure.',
        recommendation: 'Clarify priorities, decision ownership and organisational direction to reduce coordination friction.',
        type: 'warning'
      });
    }
    
    // PROPAGATION PATHWAY 3: Leadership → Psychological Safety
    if (leadership < 60 && safety < 65) {
      insights.push({
        domain: 'System',
        text: 'Leadership support conditions may be affecting the interpersonal safety climate.',
        recommendation: 'Increase leadership visibility, decision clarity and support availability to reinforce open communication.',
        type: 'warning'
      });
    }
    
    // PROPAGATION PATHWAY 4: Experience → Psychological Safety
    if (experience < 50 && safety < 60) {
      insights.push({
        domain: 'System',
        text: 'Workforce pressure may be suppressing open communication.',
        recommendation: 'Identify and relieve operational pressure points to restore psychological safety and early problem detection.',
        type: 'warning'
      });
    }
    
    // Domain-specific critical thresholds
    if (experience < 40) {
      insights.push({
        domain: 'Experience',
        text: 'Workforce strain is critically elevated, indicating sustained structural pressure across teams.',
        recommendation: 'Identify the most significant operational pressure points affecting teams and reduce structural workload or coordination pressure.',
        type: 'warning'
      });
    } else if (experience >= 40 && experience < 60) {
      insights.push({
        domain: 'Experience',
        text: 'System strain is emerging and may begin to reduce psychological safety and discretionary effort.',
        recommendation: 'Identify early operational pressures and intervene before escalation.',
        type: 'warning'
      });
    }
    
    if (workload < 50) {
      insights.push({
        domain: 'Workload & Resourcing',
        text: 'Operational demand may be exceeding available capacity.',
        recommendation: 'Rebalance workload and available resources by removing non-essential tasks or adjusting timelines.',
        type: 'warning'
      });
    }
    
    if (safety < 60) {
      insights.push({
        domain: 'Psychological Safety',
        text: 'Interpersonal risk climate is deteriorating, reducing early problem detection and increasing escalation risk.',
        recommendation: 'Leaders should reinforce open communication signals and reward early issue escalation.',
        type: 'warning'
      });
    }
    
    if (leadership < 60) {
      insights.push({
        domain: 'Leadership & Support',
        text: 'Leadership support capacity may be insufficient for current operating pressure.',
        recommendation: 'Increase leadership visibility, decision clarity and support availability.',
        type: 'warning'
      });
    }
    
    if (clarity < 60) {
      insights.push({
        domain: 'Clarity & Direction',
        text: 'Role clarity or organisational alignment may be weakening, creating duplicated work and decision delays.',
        recommendation: 'Clarify priorities, decision ownership and organisational direction.',
        type: 'warning'
      });
    }
    
    // Check for trend escalation (3+ consecutive declines)
    domains.forEach((domain) => {
      const domainTrend = domain.trend;
      if (domainTrend.length >= 3) {
        let decliningPeriods = 0;
        for (let i = domainTrend.length - 1; i > 0; i--) {
          const diff = domainTrend[i] - domainTrend[i - 1];
          if (diff < -2) {
            decliningPeriods++;
          } else {
            break;
          }
        }
        
        if (decliningPeriods >= 2) {
          insights.push({
            domain: domain.name,
            text: `${domain.name} has declined for ${decliningPeriods + 1} consecutive periods. Structural pressure is intensifying and may escalate if not addressed.`,
            recommendation: 'Investigate root causes and implement targeted intervention to prevent further deterioration.',
            type: 'warning'
          });
        }
      }
    });
    
    // Sort insights: warnings first, then positive, then neutral
    insights.sort((a, b) => {
      if (a.type === 'warning' && b.type !== 'warning') return -1;
      if (a.type !== 'warning' && b.type === 'warning') return 1;
      return 0;
    });
    
    return insights.slice(0, 4); // Limit to top 4 insights
  };
  
  // Determine Primary Pressure Source using propagation model
  const determinePrimaryPressureSource = () => {
    
    // Find domains below 60 (elevated risk)
    const atRisk: Array<{ name: string; score: number; key: string }> = [];
    if (clarity < 60) atRisk.push({ name: 'Clarity & Direction', score: clarity, key: 'clarity' });
    if (workload < 60) atRisk.push({ name: 'Workload & Resourcing', score: workload, key: 'workload' });
    if (experience < 60) atRisk.push({ name: 'Experience', score: experience, key: 'experience' });
    if (safety < 60) atRisk.push({ name: 'Psychological Safety', score: safety, key: 'safety' });
    if (leadership < 60) atRisk.push({ name: 'Leadership & Support', score: leadership, key: 'leadership' });
    
    if (atRisk.length === 0) {
      return { primarySource: 'N/A', propagationRisk: 'No significant pressure detected' };
    }
    
    // Sort by score (lowest first)
    atRisk.sort((a, b) => a.score - b.score);
    
    // Determine propagation pathway
    let primarySource = atRisk[0];
    let propagationRisk = '';
    
    // Check propagation pathways
    if (clarity < workload && workload < experience) {
      primarySource = atRisk.find(d => d.key === 'clarity') || primarySource;
      propagationRisk = 'Workload & Resourcing → Experience';
    } else if (workload < experience && experience < safety) {
      primarySource = atRisk.find(d => d.key === 'workload') || primarySource;
      propagationRisk = 'Experience → Psychological Safety';
    } else if (leadership < safety) {
      primarySource = atRisk.find(d => d.key === 'leadership') || primarySource;
      propagationRisk = 'Leadership & Support → Psychological Safety';
    } else if (experience < safety) {
      primarySource = atRisk.find(d => d.key === 'experience') || primarySource;
      propagationRisk = 'Experience → Psychological Safety';
    }
    
    return { primarySource: primarySource.name, propagationRisk };
  };
  
  let keyInsights: Array<{ domain: string; text: string; recommendation: string; type: 'positive' | 'warning' | 'neutral' }> = [];
  let pressureSource: { primarySource: string; propagationRisk: string } = { primarySource: 'N/A', propagationRisk: 'N/A' };
  
  try {
    keyInsights = generateKeyInsights();
    const result = determinePrimaryPressureSource();
    if (result) {
      pressureSource = result;
    }
  } catch (error) {
    console.error('Error generating insights:', error);
    keyInsights = [{ domain: 'System', text: 'Loading dashboard data...', recommendation: '', type: 'neutral' as const }];
    pressureSource = { primarySource: 'N/A', propagationRisk: 'N/A' };
  }

  // Ensure we have valid data before rendering
  if (!questionScores) {
    return (
      <div className="p-6 text-center">
        <p className="text-slate-600 dark:text-slate-400">Loading dashboard data... (no questionScores)</p>
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="control-room-dashboard">
      {/* TOP METRICS - 4 Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Composite Index Score */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0 }}
          className="control-room-card p-5 flex flex-col items-center justify-center text-center h-full"
        >
          <div className="metric-label mb-2 w-full text-left">Composite Index Score</div>
          <div className="flex flex-col items-center">
            <Gauge value={overallScore} />
            <div className="mt-3 text-center">
              <StatusBadge score={overallScore} />
            </div>
          </div>
        </motion.div>

        {/* 2. Breadth - teams below tolerance (wellbeing < 70) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="control-room-card p-5 flex flex-col justify-between h-full"
        >
          <div>
            <div className="metric-label mb-2">Breadth</div>
            <div className="metric-value mb-1 text-2xl">{validTeams.filter(t => t.wellbeing < 70).length} / {validTeams.length}</div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Teams below tolerance</div>
          </div>
          <div className="w-full h-1.5 bg-zinc-900/40 rounded-full overflow-hidden mt-3">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${validTeams.length ? (validTeams.filter(t => t.wellbeing < 70).length / validTeams.length) * 100 : 0}%` }}
              transition={{ duration: 1 }}
              className="h-full bg-zinc-400/40"
            />
          </div>
        </motion.div>

        {/* 3. Participation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="control-room-card p-5 flex flex-col justify-between h-full"
        >
          <div>
            <div className="metric-label mb-2">Participation</div>
            <div className="metric-value mb-1 text-2xl">{Math.round(participationRate)}%</div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Response Rate</div>
          </div>
          <div className="flex gap-1 mt-3">
            {Array(10)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className={`h-2 flex-1 rounded-sm ${
                    i < Math.round((participationRate / 100) * 10)
                      ? 'bg-zinc-400/40'
                      : 'bg-zinc-800/40'
                  }`}
                />
              ))}
          </div>
        </motion.div>

        {/* 4. Pressure Trajectory */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="control-room-card p-5 flex flex-col justify-between h-full"
        >
          <div>
            <div className="metric-label mb-2">Pressure Trajectory</div>
            <div className="flex items-baseline gap-2 mb-1">
              <div className="metric-value text-2xl">{Math.round(overallScore)}</div>
              {trajectoryData.length >= 2 && (
                <div className={`text-[10px] font-mono font-bold ${trajectoryDelta >= 0 ? 'text-emerald-500' : 'text-rose-400'}`}>
                  Δ {trajectoryDelta >= 0 ? '+' : ''}{trajectoryDelta.toFixed(1)}
                </div>
              )}
            </div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">over last {trajectoryData.length} periods</div>
          </div>
          <div className="h-10 mt-3">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trajectoryData}>
                <YAxis
                  hide
                  domain={(() => {
                    if (trajectoryData.length >= 2) {
                      const values = trajectoryData.map((d) => d.value);
                      const minVal = Math.min(...values);
                      const maxVal = Math.max(...values);
                      const range = maxVal - minVal;
                      const padding = Math.max(15, range * 0.3);
                      const domainMin = Math.max(0, minVal - padding);
                      const domainMax = Math.min(100, maxVal + padding);
                      return [domainMin, domainMax];
                    }
                    return [0, 100];
                  })()}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={trajectoryData.length ? scoreToHex(trajectoryData[trajectoryData.length - 1]?.value ?? 68) : '#d97036'}
                  strokeWidth={2}
                  dot={{ fill: trajectoryData.length ? scoreToHex(trajectoryData[trajectoryData.length - 1]?.value ?? 68) : '#d97036', r: 3, strokeWidth: 0 }}
                  activeDot={{ r: 4 }}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      <div className="control-room-card overflow-hidden">
        <div className="p-4 border-b border-black/5 dark:border-white/5 flex items-center gap-2">
          <AlertTriangle size={16} className="control-room-text-muted" />
          <h2 className="text-sm font-semibold uppercase tracking-wider metric-label">Beacon Signals</h2>
        </div>
        <div className="p-4">
          {beaconSignals.length > 0 ? (
            <div className="space-y-3">
              {beaconSignals.map((signal, index) => {
                const badgeClass =
                  signal.severity === 'system'
                    ? 'band-risk'
                    : signal.severity === 'escalation'
                    ? 'band-warn'
                    : 'band-tolerance';

                return (
                  <div
                    key={`${signal.type}-${signal.domain}-${index}`}
                    className="rounded-lg border border-black/5 dark:border-white/10 bg-white/40 dark:bg-white/[0.03] p-3"
                  >
                    <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`status-badge ${badgeClass}`}>{signal.type}</span>
                          <span className="text-xs font-medium control-room-text-bright">{signal.domain}</span>
                        </div>
                        <p className="text-sm control-room-text-bright leading-relaxed">{signal.interpretation}</p>
                      </div>
                      <div className="text-left md:text-right shrink-0">
                        <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Current score</div>
                        <div className="metric-value text-2xl">{signal.currentScore}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-lg border border-black/5 dark:border-white/10 bg-white/40 dark:bg-white/[0.03] p-3">
              <div className="flex items-center gap-2">
                <CheckCircle size={16} className="text-emerald-500" />
                <p className="text-sm control-room-text-bright">
                  No Beacon Signals are currently triggered. Domain and system scores are operating within the configured thresholds.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ROW 2: Domain Pressure Analysis + Exposure Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="control-room-card overflow-hidden h-full lg:col-span-6"
        >
          <div className="p-4 border-b border-black/5 dark:border-white/5 bg-black/5 dark:bg-white/5 flex items-center gap-2">
            <Activity size={16} className="control-room-text-muted" />
            <h2 className="text-sm font-semibold uppercase tracking-wider metric-label">Domain Pressure Analysis</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-black/5 dark:border-white/5">
                  <th className="p-3 text-[10px] font-bold uppercase tracking-widest metric-label">Domain</th>
                  <th className="p-3 text-[10px] font-bold uppercase tracking-widest metric-label">Score</th>
                  <th className="p-3 text-[10px] font-bold uppercase tracking-widest metric-label w-1/5"></th>
                  <th className="p-3 text-[10px] font-bold uppercase tracking-widest metric-label w-1/6">
                        <span className="block">Trend</span>
                        <span className="block font-normal normal-case text-[9px]">(6 periods)</span>
                      </th>
                  <th className="p-3 text-[10px] font-bold uppercase tracking-widest metric-label text-right">Risk</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 dark:divide-white/5">
                {domains.map((domain) => {
                  const pressure = domain.score * 20;
                  return (
                    <tr key={domain.name} className="group hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors">
                      <td className="p-3">
                        <div className="text-xs font-medium control-room-text-bright">{domain.name}</div>
                      </td>
                      <td className="p-3">
                        <div className="text-xs font-mono control-room-text-bright">{Math.round(pressure)}</div>
                      </td>
                      <td className="p-3 w-1/5">
                        <PressureGradientBar value={pressure} />
                      </td>
                      <td className="p-3 w-1/6">
                        <TrendSparkline data={domain.trend} score={pressure} />
                      </td>
                      <td className="p-3 text-right">
                        <StatusBadge score={pressure} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
          className="control-room-card h-full flex flex-col lg:col-span-6"
        >
          <div className="p-4 border-b border-black/5 dark:border-white/5 bg-black/5 dark:bg-white/5 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="control-room-text-muted" />
              <h2 className="text-sm font-bold uppercase tracking-wider metric-label">Exposure Heatmap</h2>
            </div>
            <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10px] uppercase tracking-widest metric-label">
              <span>LOW (≥80)</span>
              <span>•</span>
              <span>WITHIN TOLERANCE (70–79)</span>
              <span>•</span>
              <span>EMERGING (60–69)</span>
              <span>•</span>
              <span>ELEVATED (&lt;60)</span>
            </div>
          </div>

          <div className="p-4 flex-1 overflow-x-auto">
              <table className="w-full text-xs table-fixed">
                <thead>
                  <tr className="border-b border-black/10 dark:border-white/10">
                    <th className="text-left py-2 px-2 metric-label w-[30%]">TEAM</th>
                    <th className="text-center py-2 px-1 metric-label w-16">INDEX</th>
                    {['Experience', 'Workload', 'Psychol.', 'Leadership', 'Clarity'].map((d) => (
                      <th key={d} className="text-center py-2 px-1 metric-label uppercase text-[10px] w-[14%]">
                        {d}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {validTeams.slice(0, 6).map((team) => {
                    const domainKeys = ['sentiment', 'workload', 'safety', 'leadership', 'clarity'] as const;
                    const teamScores = team.domainScores
                      ? domainKeys.map(k => Math.round(team.domainScores![k] * 20))
                      : domainKeys.map(k => Math.round((questionScores[k] ?? 0) * 20));
                    return (
                      <tr key={team.id} className="border-t border-black/5 dark:border-white/5">
                        <td className="p-2 text-[10px] font-bold control-room-text-bright truncate" title={team.name}>{team.name}</td>
                        <td className="p-2">
                          <div className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold text-center w-fit mx-auto text-white border border-white/10 bg-gradient-to-r ${scoreToGradient(team.wellbeing)}`}>
                            {Math.round(team.wellbeing)}
                          </div>
                        </td>
                        {teamScores.map((score, idx) => (
                          <td key={idx} className="p-2 text-center">
                            <div className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold mx-auto w-fit text-white border border-white/10 bg-gradient-to-r ${scoreToGradient(score)}`}>
                              {score}
                            </div>
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>
      </div>

      {/* ROW 3: Recommendations + Leadership Briefing */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="control-room-card h-full flex flex-col overflow-hidden lg:col-span-6 border-l-4 border-[#d97036]"
        >
          <div className="p-4 flex items-center gap-2">
            <TrendingUp size={16} className="control-room-text-muted" />
            <h2 className="text-sm font-bold uppercase tracking-wider metric-label">Recommendations</h2>
          </div>
          <div className="p-6 space-y-6 flex-1 flex flex-col overflow-hidden">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest metric-label mb-2">Primary pressure domain</div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold control-room-text-bright">{primaryPressure.name}</span>
                <StatusBadge score={primaryPressure.score * 20} />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto min-h-0">
              <div className="text-[10px] font-bold uppercase tracking-widest metric-label mb-4">Key insights</div>
              {keyInsights.length > 0 ? (
                <div className="space-y-4">
                  {keyInsights.map((insight, idx) => {
                    const isWarning = insight.type === 'warning';
                    const isPositive = insight.type === 'positive';
                    const borderColor = isWarning ? '#d97036' : isPositive ? '#64afac' : '#5d89a9';
                    const bgGradient = isWarning 
                      ? 'from-[#f6f2ef]/50 to-transparent' 
                      : isPositive 
                      ? 'from-[#e8f4f3]/50 to-transparent' 
                      : 'from-[#eeefec]/50 to-transparent';
                    
                    return (
                      <div 
                        key={idx} 
                        className={`p-3 rounded-lg border-l-4 bg-gradient-to-r ${bgGradient}`}
                        style={{ borderLeftColor: borderColor }}
                      >
                        <div className="flex gap-2 items-start">
                          <div className="flex-shrink-0 mt-0.5">
                            {isWarning ? (
                              <AlertTriangle size={16} className="text-[#d97036]" />
                            ) : isPositive ? (
                              <TrendingUp size={16} className="text-[#64afac]" />
                            ) : (
                              <CheckCircle size={16} className="text-[#5d89a9]" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold control-room-text-bright mb-2 leading-relaxed">
                              {insight.text}
                            </div>
                            <div className="text-xs control-room-text-muted leading-relaxed">
                              {insight.recommendation}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-3 rounded-lg border-l-4 bg-gradient-to-r from-[#eeefec]/50 to-transparent" style={{ borderLeftColor: '#5d89a9' }}>
                  <div className="flex gap-2 items-start">
                    <CheckCircle size={16} className="text-[#5d89a9] flex-shrink-0 mt-0.5" />
                    <div className="text-sm control-room-text-bright">
                      All domains are performing within acceptable ranges. Continue monitoring trends.
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest metric-label mb-3">This week's leadership actions</div>
              <ul className="space-y-2">
                {recommendations.map((rec, idx) => (
                  <li key={idx} className="text-xs control-room-text-bright flex gap-2">
                    <span className="text-orange-500 dark:text-orange-400 flex-shrink-0">•</span>
                    <span>{rec.action}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Leadership Briefing - Right column */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55 }}
          className="control-room-card h-full flex flex-col overflow-hidden lg:col-span-6 border-l-4 border-[#2d6785]"
        >
          <div className="p-4 flex items-center gap-2">
            <BarChart3 size={16} className="control-room-text-muted" />
            <h2 className="text-sm font-bold uppercase tracking-wider metric-label">Leadership Briefing</h2>
          </div>

          <div className="p-6 space-y-6 flex-1 flex flex-col overflow-hidden">
            <section>
              <h3 className="text-xs font-black uppercase tracking-widest metric-label mb-4 flex items-center gap-2">
                <ChevronRight size={14} className="control-room-text-muted" /> Primary System Signal
              </h3>
              <p className="text-sm control-room-text-bright leading-relaxed pl-5 border-l-2 border-zinc-300 dark:border-zinc-800 max-w-prose">
                {experience < 40 
                  ? `Workforce strain is critically elevated. Experience has fallen to ${experience}, indicating sustained structural pressure across teams.`
                  : experience < 60
                  ? `System strain is emerging. Experience at ${experience} suggests sustained pressure may begin to reduce psychological safety and discretionary effort.`
                  : `System conditions are within acceptable range. Experience at ${experience} indicates manageable operational pressure.`}
              </p>
            </section>

            {pressureSource && (
              <section>
                <h3 className="text-xs font-black uppercase tracking-widest metric-label mb-4 flex items-center gap-2">
                  <ChevronRight size={14} className="control-room-text-muted" /> Pressure Source
                </h3>
                <p className="text-sm control-room-text-bright leading-relaxed pl-5 border-l-2 border-zinc-300 dark:border-zinc-800 max-w-prose">
                  <span className="text-[#8b3a3a] font-bold underline underline-offset-2 decoration-[#8b3a3a]/40">
                    {pressureSource.primarySource}
                  </span>
                  {' '}is likely driving system deterioration.
                  {pressureSource.propagationRisk && (
                    <>
                      {' '}Pressure may propagate through:{' '}
                      <span className="font-semibold">{pressureSource.propagationRisk}</span>.
                    </>
                  )}
                </p>
              </section>
            )}

            <section>
              <h3 className="text-xs font-black uppercase tracking-widest metric-label mb-4 flex items-center gap-2">
                <ChevronRight size={14} className="control-room-text-muted" /> System Propagation
              </h3>
              <p className="text-sm control-room-text-bright leading-relaxed pl-5 border-l-2 border-zinc-300 dark:border-zinc-800 max-w-prose">
                {experience < 50 && safety < 60
                  ? 'Under sustained pressure environments, psychological safety often declines as individuals become less likely to raise concerns. Current scores suggest this pattern may already be emerging.'
                  : workload < 55 && experience < 50
                  ? 'Operational demand exceeding capacity typically reduces recovery capacity and drives declining workforce experience.'
                  : clarity < 60 && workload < 60
                  ? 'Coordination misalignment creates hidden workload pressure through duplicated work, decision delays, and rework cycles.'
                  : 'Monitor domain interactions to detect early propagation signals.'}
              </p>
            </section>

            <section>
              <h3 className="text-xs font-black uppercase tracking-widest metric-label mb-4 flex items-center gap-2">
                <ChevronRight size={14} className="control-room-text-muted" /> Leadership Focus
              </h3>
              <p className="text-sm control-room-text-bright leading-relaxed pl-5 border-l-2 border-zinc-300 dark:border-zinc-800 max-w-prose">
                {pressureSource?.primarySource === 'Clarity & Direction'
                  ? 'Leaders should prioritise clarifying priorities and decision ownership, relieving operational pressure points, and reinforcing open communication signals.'
                  : pressureSource?.primarySource === 'Workload & Resourcing'
                  ? 'Leaders should prioritise rebalancing workload and resources, removing non-essential tasks, and adjusting timelines to restore capacity.'
                  : pressureSource?.primarySource === 'Leadership & Support'
                  ? 'Leaders should prioritise increasing visibility, decision clarity, and support availability to reinforce open communication.'
                  : 'Leaders should identify the most significant operational pressure points affecting teams and reduce structural workload or coordination pressure.'}
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
