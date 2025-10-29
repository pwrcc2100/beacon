'use client';
import { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

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

  // Calculate weighted score
  const score = sentiment && workload && leadership && safety && clarity
    ? ((sentiment * 0.25) + (workload * 0.25) + (safety * 0.20) + (leadership * 0.20) + (clarity * 0.10)) * 20
    : undefined;

  const delta = score !== undefined && prevScore !== undefined ? Number((score - prevScore).toFixed(1)) : undefined;
  const TrendIcon = typeof delta === 'number' ? (delta > 0 ? TrendingUp : delta < 0 ? TrendingDown : Minus) : Minus;

  // Color logic based on Beacon palette
  const getColor = (val?: number) => {
    if (!val) return '#5d89a9'; // slate
    if (val >= 80) return '#64afac'; // teal (good)
    if (val >= 60) return '#5d89a9'; // slate (okay)
    return '#ea9999'; // coral (attn)
  };

  const gaugeColor = getColor(score);

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
              [0.6, '#f6f2ef'],  // coral background for 0-60%
              [0.8, '#eeefec'],  // slate background for 60-80%
              [1, '#f4f4ee']     // teal background for 80-100%
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
          formatter: '{value}%',
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

  return (
    <Card className="h-full flex flex-col" style={{ borderColor: gaugeColor, border: `2px solid ${gaugeColor}` }}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold">Overall Wellbeing Score</CardTitle>
        <div className="h-6 w-6 rounded-full" style={{ backgroundColor: gaugeColor }} />
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-between">
        {!mounted ? (
          <div style={{ height: 200 }} className="flex items-center justify-center text-sm text-muted-foreground">
            Loading gauge...
          </div>
        ) : (
          <ReactECharts option={option} style={{ height: 200 }} opts={{ renderer: 'svg' }} />
        )}
        
        <div className="mt-1 text-[10px] text-muted-foreground space-y-0.5">
          <div className="font-medium">Weighting Formula:</div>
          <div className="grid grid-cols-2 gap-x-2 gap-y-0">
            <div>• Sentiment: 25%</div>
            <div>• Workload: 25%</div>
            <div>• Safety: 20%</div>
            <div>• Leadership: 20%</div>
            <div>• Clarity: 10%</div>
          </div>
        </div>
        
        {delta !== undefined && (
          <div className="flex items-center gap-2 text-xs mt-2" style={{ color: delta >= 0 ? '#64afac' : '#ea9999' }}>
            <TrendIcon className="h-3 w-3" />
            <span className="font-medium">{Math.abs(delta).toFixed(1)}% vs last week</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

