'use client';

import { useEffect, useState } from 'react';

const RADIUS = 80;
const STROKE = 12;
const circumference = 2 * Math.PI * RADIUS;

function getRiskLabel(score: number): string {
  if (score >= 80) return 'Low risk';
  if (score >= 70) return 'Within tolerance';
  if (score >= 60) return 'Emerging risk';
  return 'Elevated risk';
}

export function ScoreGaugeV2({ score, animate = true, variant = 'light' }: { score: number; animate?: boolean; variant?: 'light' | 'dark' }) {
  const [displayScore, setDisplayScore] = useState(animate ? 0 : score);
  const value = Math.max(0, Math.min(100, score));
  const progress = value / 100;
  const riskLabel = getRiskLabel(value);
  const isLight = variant === 'light';

  useEffect(() => {
    if (!animate) {
      setDisplayScore(score);
      return;
    }
    const start = 0;
    const end = score;
    const duration = 800;
    const startTime = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - startTime) / duration, 1);
      const eased = 1 - (1 - t) * (1 - t);
      setDisplayScore(Math.round(start + (end - start) * eased));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [score, animate]);

  const dashOffset = circumference * (1 - progress);
  const gaugeBg = isLight ? '#ffffff' : '#0f1e28';
  const trackStroke = isLight ? '#E0E5E8' : '#1a2632';
  const scoreColor = isLight ? '#0B1B2B' : '#e2e8f0';
  const badgeBg = value >= 70 ? (isLight ? '#d1fae5' : 'rgba(34, 197, 94, 0.2)') : value >= 60 ? (isLight ? '#ffedd5' : 'rgba(249, 115, 22, 0.2)') : (isLight ? '#fee2e2' : 'rgba(239, 68, 68, 0.2)');
  const badgeColor = value >= 70 ? (isLight ? '#065f46' : '#86efac') : value >= 60 ? (isLight ? '#9a3412' : '#fdba74') : (isLight ? '#991b1b' : '#fca5a5');

  return (
    <div className="flex flex-col items-center">
      <div
        className="relative rounded-full flex items-center justify-center border border-[#E0E5E8]"
        style={{ width: RADIUS * 2 + STROKE * 2, height: RADIUS * 2 + STROKE * 2, background: gaugeBg, boxShadow: isLight ? '0 1px 3px rgba(0,0,0,0.06)' : 'none' }}
      >
        <svg
          width={RADIUS * 2 + STROKE * 2}
          height={RADIUS * 2 + STROKE * 2}
          className="-rotate-90"
          style={{ position: 'absolute', top: 0, left: 0 }}
        >
          <defs>
            <linearGradient id="gaugeGradientV2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#2A8C8A" />
              <stop offset="50%" stopColor="#2F6F7E" />
              <stop offset="100%" stopColor="#2B4162" />
            </linearGradient>
          </defs>
          <circle
            cx={RADIUS + STROKE}
            cy={RADIUS + STROKE}
            r={RADIUS}
            fill="none"
            stroke={trackStroke}
            strokeWidth={STROKE}
          />
          <circle
            cx={RADIUS + STROKE}
            cy={RADIUS + STROKE}
            r={RADIUS}
            fill="none"
            stroke="url(#gaugeGradientV2)"
            strokeWidth={STROKE}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            style={{ transition: 'stroke-dashoffset 0.6s ease-out' }}
          />
        </svg>
        <span
          className="text-4xl font-bold tabular-nums"
          style={{ color: scoreColor, zIndex: 1 }}
        >
          {displayScore}
        </span>
      </div>
      <span
        className="mt-3 text-sm font-medium px-3 py-1 rounded-full"
        style={{ background: badgeBg, color: badgeColor }}
      >
        {riskLabel}
      </span>
    </div>
  );
}
