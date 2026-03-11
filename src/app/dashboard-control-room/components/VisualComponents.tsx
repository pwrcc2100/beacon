'use client';

import { motion } from 'motion/react';
import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts';
import { scoreToBandLabel, scoreToGradient, scoreToHex } from '../utils/scoreHelpers';

export const StatusBadge = ({ score }: { score: number }) => {
  const label = scoreToBandLabel(score);
  const gradient = scoreToGradient(score);

  return (
    <span
      className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-white/10 text-white opacity-90 bg-gradient-to-r ${gradient}`}
    >
      {label}
    </span>
  );
};

export const Gauge = ({ value }: { value: number }) => {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / 100) * circumference;
  const color = scoreToHex(value);
  const bandLabel = scoreToBandLabel(value);

  return (
    <div className="relative flex flex-col items-center justify-center h-28">
      <svg width="120" height="120" className="absolute" viewBox="0 0 120 120">
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="8"
        />
        <motion.circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          strokeLinecap="round"
        />
      </svg>
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="relative text-center"
      >
        <div className="text-2xl font-bold tracking-tighter text-zinc-100">{Math.round(value)}</div>
        <div className="text-[8px] text-zinc-500 font-mono uppercase">/100</div>
      </motion.div>
      <div className="absolute bottom-0 text-[8px] font-bold uppercase tracking-widest" style={{ color }}>
        Band: {bandLabel}
      </div>
    </div>
  );
};

export const TrendSparkline = ({ data, score }: { data: number[]; score: number }) => {
  const color = scoreToHex(score);
  const chartData = data.map((v) => ({ value: v }));

  return (
    <div className="h-6 w-24">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <Tooltip
            contentStyle={{ display: 'none' }}
            cursor={{ stroke: 'rgba(255,255,255,0.1)' }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export const PressureGradientBar = ({ value }: { value: number }) => {
  const gradient = scoreToGradient(value);

  return (
    <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden relative">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className={`h-full rounded-full bg-gradient-to-r ${gradient}`}
      />
    </div>
  );
};
