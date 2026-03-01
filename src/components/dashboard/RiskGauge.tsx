'use client';

import { useEffect, useState } from 'react';
import { tokens } from '@/styles/tokens';

const RADIUS = 72;
const STROKE = 10;
const circumference = 2 * Math.PI * RADIUS;

function getRiskLabel(score: number): string {
  if (score >= 80) return 'Low risk';
  if (score >= 70) return 'Within tolerance';
  if (score >= 60) return 'Emerging risk';
  return 'Elevated risk';
}

function getGradientColor(score: number): string {
  if (score >= 70) return tokens.gaugeFillStart;
  if (score >= 50) return tokens.gaugeFillMid;
  return tokens.gaugeFillEnd;
}

export interface RiskGaugeProps {
  score: number;
  animate?: boolean;
  size?: number;
}

export function RiskGauge({ score, animate = true, size = RADIUS }: RiskGaugeProps) {
  const [displayScore, setDisplayScore] = useState(animate ? 0 : score);
  const value = Math.max(0, Math.min(100, score));
  const progress = value / 100;
  const riskLabel = getRiskLabel(value);
  const strokeWidth = Math.max(8, (STROKE / RADIUS) * size);
  const circ = 2 * Math.PI * size;

  useEffect(() => {
    if (!animate) {
      setDisplayScore(score);
      return;
    }
    const duration = 700;
    const startTime = performance.now();
    const start = 0;
    const end = score;
    const tick = (now: number) => {
      const t = Math.min((now - startTime) / duration, 1);
      const eased = 1 - (1 - t) * (1 - t);
      setDisplayScore(Math.round(start + (end - start) * eased));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [score, animate]);

  const dashOffset = circ * (1 - progress);
  const fillColor = getGradientColor(value);

  return (
    <div className="flex flex-col items-center">
      <div
        className="relative rounded-full flex items-center justify-center bg-bi-surfaceCard shadow-bi-sm"
        style={{
          width: size * 2 + strokeWidth * 2,
          height: size * 2 + strokeWidth * 2,
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
            stroke={tokens.gaugeTrack}
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
        <span className="text-3xl font-semibold tabular-nums text-bi-text z-[1]">
          {displayScore}
        </span>
      </div>
      <span
        className={`mt-2 bi-caption font-medium px-2.5 py-1 rounded-bi-sm ${
          value >= 70 ? 'bg-bi-success/20 text-bi-success' : value >= 60 ? 'bg-bi-warning/20 text-bi-warning' : 'bg-bi-danger/20 text-bi-danger'
        }`}
      >
        {riskLabel}
      </span>
    </div>
  );
}
