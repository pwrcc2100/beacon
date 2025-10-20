'use client';
import { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { Badge } from '@/components/ui/badge';

type Point = { wk: string; value: number };

export function TrendCard({ title, data, color }:{ title:string; data:Point[]; color:string }){
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
      axisLine: { lineStyle: { color: '#e5e7eb' } },
      axisLabel: { fontSize: 10, color: '#6b7280' }
    },
    yAxis: {
      type: 'value',
      min: 1,
      max: 5,
      interval: 1,
      axisLine: { lineStyle: { color: '#e5e7eb' } },
      axisLabel: { fontSize: 10, color: '#6b7280' },
      splitLine: { lineStyle: { color: '#f3f4f6' } }
    },
    series: [{
      data: data.map(d => d.value),
      type: 'line',
      smooth: true,
      lineStyle: { color, width: 2 },
      itemStyle: { color },
      areaStyle: { color, opacity: 0.1 }
    }],
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255,255,255,0.95)',
      borderColor: '#e5e7eb',
      textStyle: { color: '#374151', fontSize: 12 }
    }
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-black/5">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm font-medium text-[var(--text-primary)]">{title}</div>
        {delta !== undefined && (
          <Badge variant="secondary" style={{ color: deltaColor }}>
            {deltaLabel} vs last wk
          </Badge>
        )}
      </div>
      {!mounted ? (
        <div style={{height:180}} className="flex items-center justify-center text-sm text-[var(--text-muted)]">Loading chart...</div>
      ) : (
        <ReactECharts option={option} style={{ height: 180 }} opts={{ renderer: 'svg' }} />
      )}
    </div>
  );
}


