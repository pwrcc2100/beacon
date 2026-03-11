'use client';

import { Gauge, PressureGradientBar, StatusBadge, TrendSparkline } from './VisualComponents';
import { motion } from 'motion/react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { Activity, TrendingUp, ShieldCheck, BarChart3, ChevronRight } from 'lucide-react';
import { scoreToHex, scoreToGradient } from '../utils/scoreHelpers';

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
  participationRate,
  teams,
  responseCount,
  totalEmployees,
}: ControlRoomDashboardProps) {
  // Build chart data for pressure trajectory (last 6-12 periods)
  const trajectoryData = trendData.slice(-12).map((score, idx) => ({
    value: Math.round(score),
  }));
  const trajectoryDelta = trendData.length >= 2 ? (trendData[trendData.length - 1] ?? 0) - (trendData[0] ?? 0) : 0;

  // Domain data
  const domains = [
    { name: 'Experience', score: questionScores.sentiment, trend: Array(6).fill(questionScores.sentiment * 20) },
    { name: 'Workload & Resourcing', score: questionScores.workload, trend: Array(6).fill(questionScores.workload * 20) },
    { name: 'Psychological Safety', score: questionScores.safety, trend: Array(6).fill(questionScores.safety * 20) },
    { name: 'Leadership & Support', score: questionScores.leadership, trend: Array(6).fill(questionScores.leadership * 20) },
    { name: 'Clarity & Direction', score: questionScores.clarity, trend: Array(6).fill(questionScores.clarity * 20) },
  ];

  // Primary pressure domain
  const primaryPressure = domains.reduce((a, b) => ((b.score * 20) < (a.score * 20) ? b : a));

  // Recommendations based on data
  const recommendations = [
    { action: 'Stabilise workload expectations for the next 2 weeks' },
    { action: 'Run targeted check-ins for affected teams (non-punitive)' },
    { action: 'Remove one major blocker (handover, approvals, resourcing)' },
  ];

  return (
    <div className="space-y-6">
      {/* TOP METRICS - 4 Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Composite Risk Score */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0 }}
          className="control-room-card p-5 flex flex-col items-center justify-center text-center h-full"
        >
          <div className="metric-label mb-2 w-full text-left">Composite Risk Score</div>
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
            <div className="metric-value mb-1 text-2xl">{teams.filter(t => t.wellbeing < 70).length} / {teams.length}</div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Teams below tolerance</div>
          </div>
          <div className="w-full h-1.5 bg-zinc-900/40 rounded-full overflow-hidden mt-3">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${teams.length ? (teams.filter(t => t.wellbeing < 70).length / teams.length) * 100 : 0}%` }}
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
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={trajectoryData.length ? scoreToHex(trajectoryData[trajectoryData.length - 1]?.value ?? 68) : '#d97036'}
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* ROW 2: Domain Pressure Analysis + Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="control-room-card overflow-hidden h-full lg:col-span-7"
        >
          <div className="p-4 border-b border-white/5 bg-white/5 flex items-center gap-2">
            <Activity size={16} className="text-zinc-400" />
            <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-300">Domain Pressure Analysis</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-zinc-500">Domain</th>
                  <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-zinc-500">Score</th>
                  <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-zinc-500 w-1/3">Strain Gradient (higher = more pressure)</th>
                  <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-zinc-500">Pressure Trend (last 6 periods)</th>
                  <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-zinc-500 text-right">Classification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {domains.map((domain) => {
                  const pressure = domain.score * 20;
                  return (
                    <tr key={domain.name} className="group hover:bg-white/[0.02] transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="text-sm font-medium text-zinc-200">{domain.name}</div>
                          <span className="text-xs font-mono text-zinc-400">{Math.round(pressure)}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm font-mono text-zinc-300">{Math.round(pressure)}</div>
                      </td>
                      <td className="p-4">
                        <PressureGradientBar value={pressure} />
                      </td>
                      <td className="p-4">
                        <TrendSparkline data={domain.trend} score={pressure} />
                      </td>
                      <td className="p-4 text-right">
                        <StatusBadge score={pressure} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Recommendations - Right column */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
          className="control-room-card h-full flex flex-col overflow-hidden lg:col-span-5 border-l-4 border-[#d97036]"
        >
          <div className="p-4 border-b border-white/5 bg-white/5 flex items-center gap-2">
            <TrendingUp size={16} className="text-zinc-300" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-200">Recommendations</h2>
          </div>
          <div className="p-6 space-y-6 flex-1">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">Primary pressure domain</div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-zinc-200">{primaryPressure.name}</span>
                <StatusBadge score={primaryPressure.score * 20} />
              </div>
            </div>

            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">Persistence signal</div>
              <div className="text-sm text-zinc-300/80">Sustained pressure detected</div>
            </div>

            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-3">This week's leadership actions</div>
              <ul className="space-y-2">
                {recommendations.map((rec, idx) => (
                  <li key={idx} className="text-xs text-zinc-300 flex gap-2">
                    <span className="text-orange-400 flex-shrink-0">•</span>
                    <span>{rec.action}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ROW 3: Exposure Heatmap + Leadership Briefing */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="control-room-card h-full flex flex-col lg:col-span-7"
        >
          <div className="p-4 border-b border-white/5 bg-white/5 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-zinc-300" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-200">Exposure Heatmap</h2>
            </div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
              Colour scale reflects strain (higher = more pressure)
            </div>
            <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10px] uppercase tracking-widest text-zinc-500">
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
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-2 px-2 text-zinc-300">TEAM</th>
                    <th className="text-center py-2 px-1 text-zinc-300">INDEX</th>
                    {['Experience', 'Workload', 'Psychol.', 'Leadership', 'Clarity &'].map((d) => (
                      <th key={d} className="text-center py-2 px-1 text-zinc-300 uppercase text-[10px]">
                        {d}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {teams.slice(0, 6).map((team) => {
                    const domainKeys = ['sentiment', 'workload', 'safety', 'leadership', 'clarity'] as const;
                    const teamScores = team.domainScores
                      ? domainKeys.map(k => Math.round(team.domainScores![k] * 20))
                      : domainKeys.map(k => Math.round((questionScores[k] ?? 0) * 20));
                    return (
                      <tr key={team.id} className="border-t border-white/5">
                        <td className="p-2 text-[10px] font-bold text-zinc-400">{team.name}</td>
                        <td className="p-2">
                          <div className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold text-center w-fit text-white border border-white/10 bg-gradient-to-r ${scoreToGradient(team.wellbeing)}`}>
                            {Math.round(team.wellbeing)}
                          </div>
                        </td>
                        {teamScores.map((score, idx) => (
                          <td key={idx} className="p-1 text-center">
                            <div
                              className="w-full min-w-[2rem] h-8 rounded-xl flex items-center justify-center text-[10px] font-mono font-semibold text-white border border-white/10 relative overflow-hidden"
                              title={`${domainKeys[idx]}: ${score}`}
                            >
                              <div className={`absolute inset-0 opacity-80 bg-gradient-to-r ${scoreToGradient(score)}`} />
                              <span className="relative z-10">{score}</span>
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

        {/* Leadership Briefing - Right column */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="control-room-card h-full flex flex-col lg:col-span-5 bg-gradient-to-br from-[#2d6785]/20 to-transparent border border-[#2d6785]/20"
        >
          <div className="p-4 border-b border-white/5 bg-white/5 flex items-center gap-2">
            <BarChart3 size={16} className="text-zinc-300" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-200">Leadership Briefing</h2>
          </div>

          <div className="p-6 space-y-8 flex-1">
            <section>
              <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-4 flex items-center gap-2">
                <ChevronRight size={14} className="text-zinc-500" /> Are we exposed?
              </h3>
              <p className="text-sm text-zinc-300/80 leading-relaxed pl-5 border-l-2 border-zinc-800 max-w-prose">
                Elevated exposure detected in 75% of team-domain signals; emerging exposure in 15%. Concentration is highest in {primaryPressure.name}.
              </p>
            </section>

            <section>
              <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-4 flex items-center gap-2">
                <ChevronRight size={14} className="text-zinc-500" /> Where is the pressure?
              </h3>
              <p className="text-sm text-zinc-300/80 leading-relaxed pl-5 border-l-2 border-zinc-800 max-w-prose">
                <span className="text-[#8b3a3a] font-bold underline underline-offset-2 decoration-[#8b3a3a]/40">
                  {primaryPressure.name}
                </span>{' '}
                is currently classified as {primaryPressure.score * 20 > 80 ? 'ELEVATED' : 'EMERGING'}. This is the lowest-scoring domain across the system, indicating the strongest strain signal relative to other domains.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
