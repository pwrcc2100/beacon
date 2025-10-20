'use client';
import { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';

type Slice = { label: string; value: number; color: string };

export function OverviewDonut({ data }:{ data: Slice[] }){
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)',
      backgroundColor: 'rgba(255,255,255,0.95)',
      borderColor: '#e5e7eb',
      textStyle: { color: '#374151', fontSize: 12 }
    },
    legend: {
      orient: 'vertical',
      right: 10,
      top: 'center',
      textStyle: { fontSize: 12, color: '#6b7280' },
      itemGap: 12
    },
    series: [{
      type: 'pie',
      radius: ['50%', '70%'],
      center: ['35%', '50%'],
      avoidLabelOverlap: false,
      label: { show: false },
      labelLine: { show: false },
      data: data.map(s => ({ name: s.label, value: s.value, itemStyle: { color: s.color } }))
    }]
  };

  return (
    <div style={{height:240}}>
      {!mounted ? (
        <div className="w-full h-full flex items-center justify-center text-sm text-[var(--text-muted)]">Loading overview...</div>
      ) : (
        <ReactECharts option={option} style={{ height: '100%' }} opts={{ renderer: 'svg' }} />
      )}
    </div>
  );
}


