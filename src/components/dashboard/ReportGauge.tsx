'use client';

import { useEffect, useState } from 'react';

const RADIUS = 80;
const STROKE = 12;

function getRiskLabel(score: number): string {
  if (score >= 80) return 'Low risk';
  if (score >= 70) return 'Within tolerance';
  if (score >= 60) return 'Emerging risk';
  return 'Elevated risk';
}

function getFillColor(score: number): string {
  if (score >= 70) return '#0d7d4c';
  if (score >= 50) return '#b45309';
  return '#c53030';
}

export interface ReportGaugeProps {
  score: number;
  animate?: boolean;
  size?: number;
}

export function ReportGauge({ score, animate = true, size = RADIUS }: ReportGaugeProps) {
  const [displayScore, setDisplayScore] = useState(animate ? 0 : score);
  const value = Math.max(0, Math.min(100, score));
  const progress = value / 100;
  const riskLabel = getRiskLabel(value);
  const strokeWidth = Math.max(10, (STROKE / RADIUS) * size);
  const circ = 2 * Math.PI * size;

  useEffect(() => {
    if (!animate) {
      setDisplayScore(score);
      return;
    }
    const duration = 700;
    const startTime = performance.now();
    const end = score;
    const tick = (now: number) => {
      const t = Math.min((now - startTime) / duration, 1);
      const eased = 1 - (1 - t) * (1 - t);
      setDisplayScore(Math.round(end * eased));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [score, animate]);

  const dashOffset = circ * (1 - progress);
  const fillColor = getFillColor(value);

  return (
    <div className="flex flex-col items-center">
      <div
        className="relative rounded-full flex items-center justify-center bg-white"
        style={{
          width: size * 2 + strokeWidth * 2,
          height: size * 2 + strokeWidth * 2,
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        }}
      >
        <svg
          width={size * 2 + strokeWidth * 2}
          height={size * 2 + strokeWidth * 2}
          className="-rotate-90"
          style={{ position: 'absolute', top: 0, left: 0 }}
        >
          <circle
            cx={size + strokeWidth}
            cy={size + strokeWidth}
            r={size}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth={strokeWidth}
          />
          <circle
            cx={size + strokeWidth}
            cy={size + strokeWidth}
            r={size}
            fill="none"
            stroke={fillColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={dashOffset}
            style={{ transition: 'stroke-dashoffset 0.5s ease-out' }}
          />
        </svg>
        <span className="text-4xl font-semibold tabular-nums text-neutral-800 z-[1]">
          {displayScore}
        </span>
      </div>
      <span
        className={`mt-2 text-xs font-medium px-2.5 py-1 rounded-md ${
          value >= 70 ? 'bg-emerald-100 text-emerald-800' : value >= 60 ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
        }`}
      >
        {riskLabel}
      </span>
    </div>
  );
}
