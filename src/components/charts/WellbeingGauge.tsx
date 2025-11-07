'use client';
import { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import {
  calculateWellbeingPercent,
  getScoreStatus,
  SCORE_BACKGROUNDS,
  SCORE_COLORS,
  SCORE_THRESHOLDS,
} from '@/components/dashboard/scoreTheme';

type Props = {
  sentiment?: number;   // Overall / Mood (25%)
  workload?: number;    // Workload / Capacity (25%)
  safety?: number;      // Psychological Safety (20%)
  leadership?: number;  // Leadership Support (20%)
  clarity?: number;     // Clarity / Direction (10%)
  prevScore?: number;
};

export function WellbeingGauge({ sentiment, workload, safety, leadership, clarity, prevScore }: Props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const score = calculateWellbeingPercent({
    sentiment,
    workload,
    safety,
    leadership,
    clarity,
  });

  const delta = score !== undefined && prevScore !== undefined ? Number((score - prevScore).toFixed(1)) : undefined;
  const TrendIcon = typeof delta === 'number' ? (delta > 0 ? TrendingUp : delta < 0 ? TrendingDown : Minus) : Minus;
  const status = getScoreStatus(score);
  const gaugeColor = status.color;

  const option = {
    series: [
      {
        type: 'gauge',
        startAngle: 200,
        endAngle: -20,
        min: 0,
        max: 100,
        splitNumber: 10,
        radius: '70%',
        center: ['50%', '55%'],
        itemStyle: {
          color: gaugeColor,
        },
        progress: {
          show: true,
          width: 16,
        },
        pointer: {
          show: false
        },
        axisLine: {
          lineStyle: {
            width: 16,
            color: [
              [SCORE_THRESHOLDS.watch / 100, SCORE_BACKGROUNDS.alert],
              [SCORE_THRESHOLDS.thriving / 100, SCORE_BACKGROUNDS.watch],
              [1, SCORE_BACKGROUNDS.thriving],
            ]
          }
        },
        axisTick: {
          show: false
        },
        splitLine: {
          show: false
        },
        axisLabel: {
          distance: -40,
          color: '#2E2E38',
          fontSize: 12,
          formatter: (value: number) => {
            if (value === 0 || value === 50 || value === 100) {
              return value.toString();
            }
            return '';
          }
        },
        anchor: {
          show: false
        },
        title: {
          show: false
        },
        detail: {
          valueAnimation: true,
          width: '60%',
          lineHeight: 28,
          borderRadius: 8,
          offsetCenter: [0, '5%'],
          fontSize: 40,
          fontWeight: 'bold',
          formatter: () => (score !== undefined ? `${Math.round(score)}%` : '—'),
          color: gaugeColor
        },
        data: [
          {
            value: score !== undefined ? Number(score.toFixed(0)) : 0
          }
        ]
      }
    ]
  };

  const status = getScoreStatus(wellbeingPercent);
  
  return (
    <Card className="h-full flex flex-col relative overflow-hidden" style={{ 
      borderColor: gaugeColor, 
      border: `2px solid ${gaugeColor || SCORE_COLORS.neutral}`,
      background: `linear-gradient(135deg, ${gaugeColor}08 0%, ${gaugeColor}02 100%)`
    }}>
      {/* Decorative background circle */}
      <div 
        className="absolute -right-12 -top-12 w-48 h-48 rounded-full opacity-5"
        style={{ backgroundColor: gaugeColor }}
      />
      
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full flex items-center justify-center" style={{ 
            backgroundColor: `${gaugeColor}20`,
            border: `2px solid ${gaugeColor}`
          }}>
            <span className="text-lg">📊</span>
          </div>
          <CardTitle className="text-base font-bold text-[var(--text-primary)]">Overall Wellbeing</CardTitle>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide">Status</span>
          <span className="text-xs font-bold" style={{ color: gaugeColor }}>{status.label}</span>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col justify-between relative z-10">
        {!mounted ? (
          <div style={{ height: 200 }} className="flex items-center justify-center text-sm text-muted-foreground">
            Loading gauge...
          </div>
        ) : (
          <ReactECharts option={option} style={{ height: 200 }} opts={{ renderer: 'svg' }} />
        )}
        
        {/* Enhanced weighting formula with visual bars */}
        <div className="mt-3 p-3 rounded-lg bg-white/50 border border-slate-200">
          <div className="text-xs font-bold text-[var(--text-primary)] mb-2 flex items-center gap-1">
            <span>⚖️</span>
            <span>Weighting Formula</span>
          </div>
          <div className="space-y-1.5">
            {[
              { label: 'Sentiment', weight: 25, color: '#1A936F' },
              { label: 'Workload', weight: 25, color: '#E63946' },
              { label: 'Safety', weight: 20, color: '#F4A259' },
              { label: 'Leadership', weight: 20, color: '#1A936F' },
              { label: 'Clarity', weight: 10, color: '#94A3B8' }
            ].map(item => (
              <div key={item.label} className="flex items-center gap-2">
                <div className="flex-1 flex items-center gap-2">
                  <span className="text-[10px] font-medium text-[var(--text-primary)] w-20">{item.label}</span>
                  <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all"
                      style={{ 
                        width: `${item.weight * 4}%`,
                        backgroundColor: item.color
                      }}
                    />
                  </div>
                </div>
                <span className="text-[10px] font-bold text-[var(--text-muted)] w-8 text-right">{item.weight}%</span>
              </div>
            ))}
          </div>
        </div>
        
        {delta !== undefined && (
          <div className="flex items-center justify-between mt-3 p-2 rounded-lg" style={{ 
            backgroundColor: delta >= 0 ? `${SCORE_COLORS.thriving}15` : `${SCORE_COLORS.alert}15`,
            border: `1px solid ${delta >= 0 ? SCORE_COLORS.thriving : SCORE_COLORS.alert}40`
          }}>
            <span className="text-xs font-medium text-[var(--text-muted)]">vs Previous Period</span>
            <div className="flex items-center gap-1.5" style={{ color: delta >= 0 ? SCORE_COLORS.thriving : SCORE_COLORS.alert }}>
              <TrendIcon className="h-3.5 w-3.5" />
              <span className="text-sm font-bold">{delta >= 0 ? '+' : ''}{delta.toFixed(1)}%</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

