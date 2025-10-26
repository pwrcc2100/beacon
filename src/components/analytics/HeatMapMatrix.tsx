'use client';
import { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';

type Props = {
  data: any[];
};

export function HeatMapMatrix({ data }: Props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const dimensions = [
    { key: 'sentiment_5', label: 'Mood' },
    { key: 'workload_5', label: 'Workload' },
    { key: 'leadership_5', label: 'Support' },
    { key: 'safety_5', label: 'Valued' },
    { key: 'clarity_5', label: 'Clarity' }
  ];

  // Calculate Pearson correlation coefficient
  const calculateCorrelation = (x: number[], y: number[]) => {
    const n = x.length;
    if (n === 0) return 0;
    
    const meanX = x.reduce((a, b) => a + b, 0) / n;
    const meanY = y.reduce((a, b) => a + b, 0) / n;
    
    let numerator = 0;
    let denomX = 0;
    let denomY = 0;
    
    for (let i = 0; i < n; i++) {
      const dx = x[i] - meanX;
      const dy = y[i] - meanY;
      numerator += dx * dy;
      denomX += dx * dx;
      denomY += dy * dy;
    }
    
    if (denomX === 0 || denomY === 0) return 0;
    return numerator / Math.sqrt(denomX * denomY);
  };

  // Build correlation matrix
  const matrix: [number, number, number][] = [];
  const labels = dimensions.map(d => d.label);
  
  dimensions.forEach((dim1, i) => {
    dimensions.forEach((dim2, j) => {
      const values1 = data.map(r => r[dim1.key]).filter(v => v != null);
      const values2 = data.map(r => r[dim2.key]).filter(v => v != null);
      
      // Only use complete pairs
      const pairs = data
        .filter(r => r[dim1.key] != null && r[dim2.key] != null)
        .map(r => [r[dim1.key], r[dim2.key]]);
      
      const x = pairs.map(p => p[0]);
      const y = pairs.map(p => p[1]);
      
      const correlation = calculateCorrelation(x, y);
      matrix.push([i, j, correlation]);
    });
  });

  const option = {
    tooltip: {
      position: 'top',
      formatter: (params: any) => {
        const [i, j, value] = params.data;
        return `${labels[i]} vs ${labels[j]}<br/>Correlation: ${value.toFixed(3)}`;
      }
    },
    grid: {
      top: 60,
      right: 90,
      bottom: 80,
      left: 90
    },
    xAxis: {
      type: 'category',
      data: labels,
      splitArea: { show: true },
      axisLabel: { fontSize: 11, rotate: 45 }
    },
    yAxis: {
      type: 'category',
      data: labels,
      splitArea: { show: true },
      axisLabel: { fontSize: 11 }
    },
    visualMap: {
      min: -1,
      max: 1,
      calculable: true,
      orient: 'horizontal',
      left: 'center',
      bottom: 10,
      inRange: {
        color: ['#d73027', '#f46d43', '#fdae61', '#fee090', '#e0f3f8', '#abd9e9', '#74add1', '#4575b4']
      },
      text: ['High Correlation', 'Low Correlation'],
      textStyle: { fontSize: 10 }
    },
    series: [{
      name: 'Correlation',
      type: 'heatmap',
      data: matrix,
      label: {
        show: true,
        formatter: (params: any) => params.data[2].toFixed(2),
        fontSize: 10
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }]
  };

  return (
    <div>
      {!mounted ? (
        <div style={{height:400}} className="flex items-center justify-center text-sm text-muted-foreground">
          Loading...
        </div>
      ) : data.length === 0 ? (
        <div style={{height:400}} className="flex items-center justify-center text-sm text-muted-foreground">
          No data available
        </div>
      ) : (
        <>
          <ReactECharts option={option} style={{ height: 400 }} opts={{ renderer: 'svg' }} />
          <div className="mt-4 text-xs text-muted-foreground">
            <p className="font-medium mb-2">Insights:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Values close to +1 indicate strong positive correlation</li>
              <li>Values close to -1 indicate strong negative correlation</li>
              <li>Values near 0 indicate little to no relationship</li>
              <li>Strong correlations help identify which factors most predict overall wellbeing</li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
}



