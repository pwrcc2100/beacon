'use client';
import { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';

type Props = {
  data: any[];
  dimension: string;
  title: string;
};

export function ControlChart({ data, dimension, title }: Props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  // Group by week and calculate weekly averages
  const weeklyData: Record<string, number[]> = {};
  
  data.forEach(response => {
    if (response[dimension] == null) return;
    
    const date = new Date(response.submitted_at);
    const day = date.getDay() || 7;
    const monday = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() - (day - 1)));
    const weekKey = monday.toISOString().slice(0, 10);
    
    if (!weeklyData[weekKey]) {
      weeklyData[weekKey] = [];
    }
    weeklyData[weekKey].push(response[dimension]);
  });

  const sortedWeeks = Object.keys(weeklyData).sort();
  
  if (sortedWeeks.length < 3) {
    return (
      <div>
        <h3 className="text-sm font-medium mb-2">{title}</h3>
        <div style={{height:300}} className="flex items-center justify-center text-sm text-muted-foreground">
          Insufficient data for control chart (need 3+ weeks)
        </div>
      </div>
    );
  }

  const weeklyAverages = sortedWeeks.map(week => {
    const values = weeklyData[week];
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    return { week, avg, count: values.length };
  });

  // Calculate control limits
  const overallMean = weeklyAverages.reduce((sum, w) => sum + w.avg, 0) / weeklyAverages.length;
  
  // Calculate moving range for standard deviation estimate
  const movingRanges = [];
  for (let i = 1; i < weeklyAverages.length; i++) {
    movingRanges.push(Math.abs(weeklyAverages[i].avg - weeklyAverages[i-1].avg));
  }
  const avgMovingRange = movingRanges.reduce((a, b) => a + b, 0) / movingRanges.length;
  
  // Control limits (using 3-sigma, with d2=1.128 for n=2)
  const sigma = avgMovingRange / 1.128;
  const ucl = overallMean + (3 * sigma);
  const lcl = Math.max(1, overallMean - (3 * sigma)); // Can't go below 1 on a 1-5 scale
  
  // Check for out-of-control points
  const outOfControl = weeklyAverages.filter(w => w.avg > ucl || w.avg < lcl);
  const trend = weeklyAverages.length >= 7 
    ? checkTrend(weeklyAverages.slice(-7).map(w => w.avg))
    : false;

  const weekLabels = sortedWeeks.map(w => new Date(w).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }));

  const option = {
    grid: { top: 60, right: 80, bottom: 60, left: 60 },
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => {
        const idx = params[0].dataIndex;
        const week = weeklyAverages[idx];
        let result = `${params[0].axisValue}<br/>`;
        result += `Average: ${week.avg.toFixed(2)}<br/>`;
        result += `Responses: ${week.count}<br/>`;
        result += `Mean: ${overallMean.toFixed(2)}<br/>`;
        result += `UCL: ${ucl.toFixed(2)}<br/>`;
        result += `LCL: ${lcl.toFixed(2)}`;
        return result;
      }
    },
    legend: {
      data: ['Weekly Average', 'Mean', 'UCL (3σ)', 'LCL (3σ)'],
      top: 10
    },
    xAxis: {
      type: 'category',
      data: weekLabels,
      axisLabel: { fontSize: 10, rotate: 45 }
    },
    yAxis: {
      type: 'value',
      name: 'Score (1-5)',
      min: 1,
      max: 5,
      axisLabel: { fontSize: 10 }
    },
    series: [
      {
        name: 'Weekly Average',
        type: 'line',
        data: weeklyAverages.map(w => w.avg.toFixed(2)),
        symbol: 'circle',
        symbolSize: 8,
        itemStyle: { 
          color: (params: any) => {
            const val = weeklyAverages[params.dataIndex].avg;
            return (val > ucl || val < lcl) ? '#ea9999' : '#2B4162';
          }
        },
        lineStyle: { color: '#2B4162', width: 2 }
      },
      {
        name: 'Mean',
        type: 'line',
        data: weeklyAverages.map(() => overallMean.toFixed(2)),
        lineStyle: { color: '#64afac', type: 'solid', width: 2 },
        symbol: 'none',
        itemStyle: { color: '#64afac' }
      },
      {
        name: 'UCL (3σ)',
        type: 'line',
        data: weeklyAverages.map(() => ucl.toFixed(2)),
        lineStyle: { color: '#ea9999', type: 'dashed', width: 2 },
        symbol: 'none',
        itemStyle: { color: '#ea9999' }
      },
      {
        name: 'LCL (3σ)',
        type: 'line',
        data: weeklyAverages.map(() => lcl.toFixed(2)),
        lineStyle: { color: '#ea9999', type: 'dashed', width: 2 },
        symbol: 'none',
        itemStyle: { color: '#ea9999' }
      }
    ]
  };

  return (
    <div>
      <h3 className="text-sm font-medium mb-2">{title}</h3>
      {!mounted ? (
        <div style={{height:300}} className="flex items-center justify-center text-sm text-muted-foreground">
          Loading...
        </div>
      ) : (
        <>
          <ReactECharts option={option} style={{ height: 300 }} opts={{ renderer: 'svg' }} />
          
          <div className="mt-3 grid grid-cols-3 gap-3 text-xs">
            <div className="p-2 bg-slate-50 rounded">
              <div className="font-medium text-slate-700">Process Mean</div>
              <div className="text-lg font-bold text-slate-800">{overallMean.toFixed(2)}</div>
            </div>
            <div className="p-2 bg-teal-50 rounded">
              <div className="font-medium text-teal-700">Control Range</div>
              <div className="text-sm font-bold text-teal-800">{lcl.toFixed(2)} - {ucl.toFixed(2)}</div>
            </div>
            <div className={`p-2 rounded ${outOfControl.length > 0 ? 'bg-red-50' : 'bg-green-50'}`}>
              <div className={`font-medium ${outOfControl.length > 0 ? 'text-red-700' : 'text-green-700'}`}>
                Process Status
              </div>
              <div className={`text-lg font-bold ${outOfControl.length > 0 ? 'text-red-800' : 'text-green-800'}`}>
                {outOfControl.length > 0 ? `⚠ ${outOfControl.length} Out` : '✓ In Control'}
              </div>
            </div>
          </div>

          {(outOfControl.length > 0 || trend) && (
            <div className="mt-3 space-y-2">
              {outOfControl.length > 0 && (
                <div className="p-3 bg-red-50 rounded text-sm">
                  <div className="font-medium text-red-800 mb-1">⚠ Special Cause Variation Detected</div>
                  <div className="text-red-700">
                    {outOfControl.length} week(s) outside control limits - investigate root cause
                  </div>
                </div>
              )}
              {trend && (
                <div className="p-3 bg-orange-50 rounded text-sm">
                  <div className="font-medium text-orange-800 mb-1">⚠ Trend Detected</div>
                  <div className="text-orange-700">
                    7+ consecutive points showing a trend - process may be shifting
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="mt-3 text-xs text-muted-foreground">
            <p className="font-medium mb-1">Control Chart Rules:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Points within control limits = normal variation (no action needed)</li>
              <li>Points outside limits = special cause variation (requires investigation)</li>
              <li>7+ points trending up/down = process shifting</li>
              <li>Don't react to every fluctuation - distinguish signal from noise</li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
}

// Helper function to detect trends (7 consecutive increasing or decreasing points)
function checkTrend(values: number[]): boolean {
  if (values.length < 7) return false;
  
  let increasing = true;
  let decreasing = true;
  
  for (let i = 1; i < values.length; i++) {
    if (values[i] <= values[i-1]) increasing = false;
    if (values[i] >= values[i-1]) decreasing = false;
  }
  
  return increasing || decreasing;
}


