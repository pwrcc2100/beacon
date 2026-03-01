'use client';

import { useEffect, useState } from 'react';
import { getVisualBand } from '@/lib/visualBand';

const RADIUS = 72;
const STROKE = 10;

export interface RiskGaugeProps {
  score: number;
  animate?: boolean;
  size?: number;
}

export function RiskGauge({ score, animate = true, size = RADIUS }: RiskGaugeProps) {
  const [displayScore, setDisplayScore] = useState(animate ? 0 : score);
  const value = Math.max(0, Math.min(100, score));
  const progress = value / 100;
  const band = getVisualBand(value);
  const strokeWidth = Math.max(8, (STROKE / RADIUS) * size);
  const circ = 2 * Math.PI * size;
  const dashOffset = circ * (1 - progress);

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

  const center = size + strokeWidth;
  const shadowStroke = strokeWidth + 2;
  const angle = progress * 2 * Math.PI - Math.PI / 2;
  const dotX = center + size * Math.cos(angle);
  const dotY = center + size * Math.sin(angle);
  const gradientId = `risk-gauge-${band.band}-${size}`;

  return (
    <div className="flex flex-col items-center">
      <div
        className="relative rounded-full flex items-center justify-center"
        style={{
          width: size * 2 + strokeWidth * 2,
          height: size * 2 + strokeWidth * 2,
          background: 'var(--surface)',
          boxShadow: 'var(--shadow-soft)',
          border: '1px solid var(--stroke-soft)',
        }}
      >
        <svg
          width={size * 2 + strokeWidth * 2}
          height={size * 2 + strokeWidth * 2}
          className="-rotate-90"
          style={{ position: 'absolute', top: 0, left: 0 }}
        >
          <defs>
            <linearGradient id={`${gradientId}-ok`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7dd3fc" />
              <stop offset="55%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>
            <linearGradient id={`${gradientId}-warn`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f6c453" />
              <stop offset="60%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#b45309" />
            </linearGradient>
            <linearGradient id={`${gradientId}-risk`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ff6b6b" />
              <stop offset="55%" stopColor="#e63946" />
              <stop offset="100%" stopColor="#b5172a" />
            </linearGradient>
          </defs>
          <circle
            cx={center}
            cy={center}
            r={size}
            fill="none"
            stroke="var(--bar-track)"
            strokeWidth={strokeWidth}
          />
          <circle
            cx={center}
            cy={center}
            r={size}
            fill="none"
            stroke="rgba(0,0,0,0.06)"
            strokeWidth={shadowStroke}
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={dashOffset}
          />
          <circle
            cx={center}
            cy={center}
            r={size}
            fill="none"
            stroke={`url(#${gradientId}-${band.band})`}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={dashOffset}
            style={{ transition: 'stroke-dashoffset 0.5s ease-out' }}
          />
          {progress > 0.02 && progress < 0.98 && (
            <circle cx={dotX} cy={dotY} r={strokeWidth / 3} fill="rgba(255,255,255,0.25)" />
          )}
        </svg>
        <span className="text-3xl font-semibold tabular-nums text-neutral-800 z-[1]">
          {displayScore}
        </span>
      </div>
      <span
        className="mt-2 text-xs font-medium px-2.5 py-1 rounded-full border border-[var(--stroke-soft)]"
        style={{
          background: band.gradientVar,
          color: band.band === 'risk' ? 'white' : band.band === 'warn' ? '#78350f' : '#0c4a6e',
          boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.35)',
        }}
      >
        {band.label}
      </span>
    </div>
  );
}
