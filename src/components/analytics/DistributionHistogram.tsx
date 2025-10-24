'use client';
import { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';

type Props = {
  data: any[];
  dimension: string;
  title: string;
};

export function DistributionHistogram({ data, dimension, title }: Props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  // Calculate histogram bins
  const values = data.map(r => r[dimension]).filter(v => v != null);
  const bins = [0, 1, 2, 3, 4, 5, 6]; // For 5-point scale (1-5)
  const counts = new Array(5).fill(0);
  
  values.forEach(v => {
    const index = Math.floor(v) - 1;
    if (index >= 0 && index < 5) counts[index]++;
  });

  const total = values.length;
  const percentages = counts.map(c => total > 0 ? (c / total * 100).toFixed(1) : 0);

  // Calculate statistics
  const mean = values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0;
  const sorted = [...values].sort((a, b) => a - b);
  const median = sorted.length > 0 ? sorted[Math.floor(sorted.length / 2)] : 0;
  const variance = values.length > 0 
    ? values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length 
    : 0;
  const stdDev = Math.sqrt(variance);

  const option = {
    grid: { top: 40, right: 20, bottom: 60, left: 50 },
    xAxis: {
      type: 'category',
      data: ['1 (Low)', '2', '3', '4', '5 (High)'],
      axisLabel: { fontSize: 10, rotate: 0 }
    },
    yAxis: {
      type: 'value',
      name: 'Count',
      axisLabel: { fontSize: 10 }
    },
    series: [{
      data: counts,
      type: 'bar',
      itemStyle: { 
        color: (params: any) => {
          const colors = ['#ea9999', '#f4b084', '#ffe699', '#c6e0b4', '#64afac'];
          return colors[params.dataIndex];
        }
      },
      label: {
        show: true,
        position: 'top',
        formatter: (params: any) => `${percentages[params.dataIndex]}%`,
        fontSize: 10
      }
    }],
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => {
        const p = params[0];
        return `${p.name}<br/>Count: ${p.value}<br/>Percentage: ${percentages[p.dataIndex]}%`;
      }
    }
  };

  return (
    <div>
      <h3 className="text-sm font-medium mb-2">{title}</h3>
      {!mounted ? (
        <div style={{height:250}} className="flex items-center justify-center text-sm text-muted-foreground">
          Loading...
        </div>
      ) : values.length === 0 ? (
        <div style={{height:250}} className="flex items-center justify-center text-sm text-muted-foreground">
          No data available
        </div>
      ) : (
        <>
          <ReactECharts option={option} style={{ height: 250 }} opts={{ renderer: 'svg' }} />
          <div className="mt-2 text-xs text-muted-foreground space-y-1">
            <div>Mean: {mean.toFixed(2)} | Median: {median.toFixed(2)}</div>
            <div>Std Dev: {stdDev.toFixed(2)} | n = {total}</div>
            <div className="text-xs mt-1">
              {stdDev > 1.2 && <span className="text-orange-600">⚠ High variance - polarized responses</span>}
              {stdDev <= 0.8 && <span className="text-green-600">✓ Low variance - consistent responses</span>}
            </div>
          </div>
        </>
      )}
    </div>
  );
}


