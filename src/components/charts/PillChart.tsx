'use client';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown } from 'lucide-react';

type Props = {
  label: string;
  value?: number; // 1-5 scale
  delta?: number; // change from last week
  prevValue?: number;
};

export function PillChart({ label, value, delta }: Props) {
  // Convert from 5-point scale to percentage (5 = 100%, 1 = 20%)
  const percentValue = typeof value === 'number' ? value * 20 : undefined;
  const percentDelta = typeof delta === 'number' ? delta * 20 : undefined;
  
  // Traffic light colors based on percentage: >= 80% = good (teal), >= 60% = okay (slate), < 60% = attn (coral)
  const getColor = (val?: number) => {
    if (!val) return { bg: '#eeefec', fill: '#5d89a9' }; // neutral slate
    if (val >= 80) return { bg: '#f4f4ee', fill: '#64afac' }; // good (teal)
    if (val >= 60) return { bg: '#eeefec', fill: '#5d89a9' }; // okay (slate)
    return { bg: '#f6f2ef', fill: '#ea9999' }; // attn (coral)
  };

  const colors = getColor(percentValue);
  const deltaText = typeof percentDelta === 'number' ? Math.abs(percentDelta).toFixed(0) : undefined;
  const deltaSign = typeof percentDelta === 'number' ? (percentDelta >= 0 ? '↑' : '↓') : '';
  const deltaColor = typeof percentDelta === 'number' ? (percentDelta >= 0 ? '#64afac' : '#ea9999') : '#999';

  return (
    <div className="flex items-center gap-4 py-2">
      {/* Label (only show if not empty) */}
      {label && (
        <div className="w-24 text-sm font-medium text-[var(--text-primary)] flex-shrink-0">
          {label}
        </div>
      )}

      {/* Pill bar container */}
      <div className="flex-1 relative">
        <div 
          className="h-10 rounded-full flex items-center justify-between px-4"
          style={{ 
            backgroundColor: colors.bg,
            border: `1px solid ${colors.fill}20`
          }}
        >
          {/* Filled portion */}
          <div 
            className="absolute left-0 top-0 h-full rounded-full transition-all duration-500"
            style={{ 
              width: `${percentValue ?? 0}%`,
              backgroundColor: colors.fill,
              opacity: 0.9
            }}
          />
          
          {/* Score text */}
          <div className="relative z-10 text-sm font-bold" style={{ color: '#fff', mixBlendMode: 'difference' }}>
            {percentValue !== undefined ? `${percentValue.toFixed(0)}` : '–'}
          </div>

          {/* Delta badge */}
          {deltaText && (
            <div className="relative z-10 flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-white/90" style={{ color: deltaColor }}>
              {percentDelta! >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {deltaSign} {deltaText} points
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

