'use client';
import { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { Badge } from '@/components/ui/badge';

type Point = { wk: string; value: number };

export function TrendCard({ heading, description, data, color }:{ heading:string; description:string; data:Point[]; color:string }){
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const last = data[data.length - 1]?.value ?? undefined;
  const prev = data[data.length - 2]?.value ?? undefined;
  const delta = (last !== undefined && prev !== undefined) ? Number((last - prev).toFixed(2)) : undefined;
  const deltaLabel = delta !== undefined ? (delta > 0 ? `+${delta}` : `${delta}`) : '';
  const deltaColor = delta === undefined ? '#999' : delta >= 0 ? '#16a34a' : '#dc2626';

  const option = {
    grid: { top: 20, right: 10, bottom: 30, left: 40 },
    xAxis: {
      type: 'category',
      data: data.map(d => d.wk),
      axisLine: { lineStyle: { color: 'rgba(255,255,255,0.2)' } },
      axisLabel: { fontSize: 10, color: '#a1a1aa' }
    },
    yAxis: {
      type: 'value',
      min: 1,
      max: 5,
      interval: 1,
      axisLine: { lineStyle: { color: 'rgba(255,255,255,0.2)' } },
      axisLabel: { fontSize: 10, color: '#a1a1aa' },
      splitLine: { lineStyle: { color: 'rgba(255,255,255,0.08)' } }
    },
    series: [{
      data: data.map(d => d.value),
      type: 'line',
      smooth: true,
      lineStyle: { color, width: 2 },
      itemStyle: { color },
      areaStyle: { color, opacity: 0.18 }
    }],
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(17,24,39,0.95)',
      borderColor: 'rgba(255,255,255,0.2)',
      textStyle: { color: '#e4e4e7', fontSize: 12 }
    }
  };

  return (
    <div className="control-room-card border-white/10 rounded-lg p-4">
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <div className="text-sm font-medium text-white">{heading}</div>
          {delta !== undefined && (
            <Badge variant="secondary" style={{ color: deltaColor }}>
              {deltaLabel} vs last wk
            </Badge>
          )}
        </div>
        <div className="text-xs text-zinc-400">{description}</div>
      </div>
      {!mounted ? (
        <div style={{height:180}} className="flex items-center justify-center text-sm text-zinc-400">Loading chart...</div>
      ) : (
        <ReactECharts option={option} style={{ height: 180 }} opts={{ renderer: 'svg' }} />
      )}
    </div>
  );
}


