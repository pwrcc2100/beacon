'use client';

import { Gauge, PressureGradientBar, StatusBadge, TrendSparkline } from './VisualComponents';
import { motion } from 'motion/react';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface TeamWithScore {
  id: string;
  name: string;
  displayName?: string;
  divisionName?: string;
  departmentName?: string;
  wellbeing: number;
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
  const scoreChange = previousScore ? overallScore - previousScore : 0;
  const riskCount = teams.filter(t => t.wellbeing < 70).length;
  const thriving = teams.filter(t => t.wellbeing >= 80).length;
  const onesToWatch = teams.filter(t => t.wellbeing >= 70 && t.wellbeing < 80).length;

  // Build chart data for pressure trajectory
  const trajectoryData = trendData.slice(-12).map((score, idx) => ({
    week: `W${idx + 1}`,
    score: Math.round(score),
  }));

  // Domain data
  const domains = [
    { name: 'Experience', score: questionScores.sentiment, trend: Array(6).fill(questionScores.sentiment * 20) },
    { name: 'Workload & Resourcing', score: questionScores.workload, trend: Array(6).fill(questionScores.workload * 20) },
    { name: 'Psychological Safety', score: questionScores.safety, trend: Array(6).fill(questionScores.safety * 20) },
    { name: 'Leadership & Support', score: questionScores.leadership, trend: Array(6).fill(questionScores.leadership * 20) },
    { name: 'Clarity & Direction', score: questionScores.clarity, trend: Array(6).fill(questionScores.clarity * 20) },
  ];

  // Get heatmap color based on score - using reference design colors
  const getHeatmapColor = (score: number) => {
    const value = Math.round(score);
    if (value >= 80) return { bg: 'bg-[#2d6785]/15', border: 'border-[#3d8a9e]/30', text: 'text-[#3d8a9e]', hex: '#2d6785' };
    if (value >= 70) return { bg: 'bg-[#b8860b]/15', border: 'border-[#d4a84b]/30', text: 'text-[#d4a84b]', hex: '#b8860b' };
    if (value >= 60) return { bg: 'bg-[#d97036]/15', border: 'border-[#e8904d]/30', text: 'text-[#e8904d]', hex: '#d97036' };
    return { bg: 'bg-[#8b3a3a]/15', border: 'border-[#a64b4b]/30', text: 'text-[#a64b4b]', hex: '#8b3a3a' };
  };

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
          className="control-room-card p-6"
        >
          <div className="metric-label mb-4 text-xs">COMPOSITE RISK SCORE</div>
          <div className="flex flex-col items-center">
            <Gauge value={overallScore} />
            <div className="mt-3 text-center">
              <StatusBadge score={overallScore} />
            </div>
          </div>
        </motion.div>

        {/* 2. Breadth */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="control-room-card p-6"
        >
          <div className="metric-label mb-4 text-xs">BREADTH</div>
          <div className="space-y-3">
            <div className="text-2xl font-bold">{teams.filter(t => t.wellbeing >= 70).length}/{teams.length}</div>
            <div className="text-xs text-zinc-300 uppercase">TEAMS BELOW TOLERANCE</div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(teams.filter(t => t.wellbeing >= 70).length / teams.length) * 100 || 0}%` }}
                transition={{ duration: 1 }}
                className="h-full bg-gradient-to-r from-orange-500 to-orange-600"
              />
            </div>
          </div>
        </motion.div>

        {/* 3. Participation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="control-room-card p-6"
        >
          <div className="metric-label mb-4 text-xs">PARTICIPATION</div>
          <div className="space-y-3">
            <div className="text-2xl font-bold">{Math.round(participationRate)}%</div>
            <div className="text-xs text-zinc-300 uppercase">RESPONSE RATE</div>
            <div className="flex gap-1">
              {Array(8)
                .fill(0)
                .map((_, i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded ${
                      i < Math.round((participationRate / 100) * 8)
                        ? 'bg-gradient-to-r from-[#2d6785] to-[#3d8a9e]'
                        : 'bg-white/10'
                    }`}
                  />
                ))}
            </div>
          </div>
        </motion.div>

        {/* 4. Pressure Trajectory */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="control-room-card p-6"
        >
          <div className="metric-label mb-4 text-xs">PRESSURE TRAJECTORY</div>
          <div className="space-y-3">
            <div className="text-2xl font-bold">{Math.round(overallScore)}</div>
            <div className="h-12 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trajectoryData}>
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#d97036"
                    strokeWidth={2}
                    dot={false}
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="text-xs text-zinc-300">LAST 8 PERIODS</div>
          </div>
        </motion.div>
      </div>

      {/* MAIN CONTENT - 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* LEFT COLUMN - Domain Analysis + Heatmap */}
        <div className="lg:col-span-2 space-y-4">
          {/* Domain Pressure Analysis */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="control-room-card p-6"
          >
            <div className="mb-4">
              <h2 className="text-sm font-bold text-white uppercase">Domain Pressure Analysis</h2>
              <p className="text-xs text-zinc-300 uppercase">Higher Pressure Scores Indicate Greater Strain. Risk Classification Reflects The Corresponding Psychosocial Risk Exposure Band.</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-2 px-2 text-zinc-300 uppercase">Domain</th>
                    <th className="text-center py-2 px-1 text-zinc-300 uppercase">Score</th>
                    <th className="text-center py-2 px-2 text-zinc-300 uppercase">Strain Gradient (Higher = More Pressure)</th>
                    <th className="text-center py-2 px-1 text-zinc-300 uppercase">Pressure Trend (Last 8 Periods)</th>
                    <th className="text-center py-2 px-1 text-zinc-300 uppercase">Risk Classification</th>
                  </tr>
                </thead>
                <tbody>
                  {domains.map((domain, idx) => {
                    const pressure = domain.score * 20;
                    return (
                      <tr key={domain.name} className="border-b border-white/5 hover:bg-white/5">
                        <td className="py-3 px-2 text-white font-medium">{domain.name}</td>
                        <td className="text-center py-3 px-1 text-white font-semibold">{Math.round(pressure)}</td>
                        <td className="py-3 px-2">
                          <div className="flex items-center gap-2">
                            <div className="h-2 flex-1 bg-white/10 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${pressure}%` }}
                                transition={{ duration: 0.8, delay: 0.4 + idx * 0.05 }}
                                className="h-full rounded-full"
                                style={{
                                  background:
                                    pressure >= 80
                                      ? 'linear-gradient(to right, #8b3a3a, #a64b4b)'
                                      : pressure >= 70
                                        ? 'linear-gradient(to right, #d97036, #e8904d)'
                                        : pressure >= 60
                                          ? 'linear-gradient(to right, #b8860b, #d4a84b)'
                                          : 'linear-gradient(to right, #2d6785, #3d8a9e)',
                                }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="text-center py-3 px-1 w-20">
                          <TrendSparkline data={domain.trend} score={pressure} />
                        </td>
                        <td className="text-center py-3 px-1">
                          <StatusBadge score={pressure} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Exposure Heatmap */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="control-room-card p-6"
          >
            <div className="mb-4">
              <h2 className="text-sm font-bold text-white uppercase">Exposure Heatmap</h2>
              <p className="text-xs text-zinc-300 uppercase">Colour Scale Reflects Strain (Higher = More Pressure)</p>
              <div className="flex gap-2 text-xs text-zinc-300 mt-2">
                <span>LOW (&lt;30)</span> • <span>WITHIN TOLERANCE (30-79)</span> • <span>EMERGING (80-89)</span> •
                <span>ELEVATED (&gt;80)</span>
              </div>
            </div>

            <div className="overflow-x-auto">
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
                    const teamScores = [
                      questionScores.sentiment * 20,
                      questionScores.workload * 20,
                      questionScores.safety * 20,
                      questionScores.leadership * 20,
                      questionScores.clarity * 20,
                    ];
                    return (
                      <tr key={team.id} className="border-b border-white/5">
                        <td className="py-3 px-2 text-white text-xs truncate max-w-xs">{team.name}</td>
                        <td className="text-center py-3 px-1">
                          <div className={`inline-block px-2 py-1 rounded text-xs font-semibold ${getHeatmapColor(team.wellbeing).bg} ${getHeatmapColor(team.wellbeing).text}`}>
                            {Math.round(team.wellbeing)}
                          </div>
                        </td>
                        {teamScores.map((score, idx) => {
                          const colors = getHeatmapColor(score);
                          return (
                            <td key={idx} className="text-center py-3 px-1">
                              <div className={`rounded px-2 py-1 border ${colors.bg} ${colors.border} ${colors.text} text-xs font-medium`}>
                                {Math.round(score)}
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>

        {/* RIGHT COLUMN - Recommendations + Leadership Briefing */}
        <div className="space-y-4">
          {/* Recommendations */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55 }}
            className="control-room-card p-6 border-l-4 border-[#d97036]"
          >
            <div className="mb-4">
              <h2 className="text-sm font-bold text-white uppercase flex items-center gap-2">
                <span>⚡</span> Recommendations
              </h2>
            </div>

            <div className="space-y-3">
              <div>
                <div className="text-xs text-zinc-300 uppercase">PRIMARY PRESSURE DOMAIN</div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm font-semibold text-white">{primaryPressure.name}</span>
                  <StatusBadge score={primaryPressure.score * 20} />
                </div>
              </div>

              <div>
                <div className="text-xs text-zinc-300 uppercase">PERSISTENT SIGNAL</div>
                <div className="text-xs text-zinc-300 mt-1">Sustained pressure detected</div>
              </div>

              <div>
                <div className="text-xs text-zinc-300 uppercase mb-2">THIS WEEK'S LEADERSHIP ACTIONS</div>
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

          {/* Leadership Briefing */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="control-room-card p-6 bg-gradient-to-br from-[#2d6785]/20 to-transparent border border-[#2d6785]/20"
          >
            <div className="mb-4">
              <h2 className="text-sm font-bold text-white uppercase flex items-center gap-2">
                📋 Leadership Briefing
              </h2>
            </div>

            <div className="space-y-3 text-xs text-zinc-300">
              <div>
                <div className="text-zinc-300 uppercase mb-1">ARE WE EXPOSED?</div>
                <div className="text-zinc-300">
                  Elevated exposure detected in 75% of team-domain signals; emerging exposure in 15%. Concentration is highest in {primaryPressure.name}.
                </div>
              </div>

              <div>
                <div className="text-zinc-300 uppercase mb-1">WHERE IS THE PRESSURE?</div>
                <div className="text-zinc-300">
                  <strong>{primaryPressure.name}</strong> is currently classified as {primaryPressure.score * 20 > 80 ? 'ELEVATED' : 'EMERGING'}. This is the lowest-scoring domain across the system, indicating the strongest strain signal relative to other domains.
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
