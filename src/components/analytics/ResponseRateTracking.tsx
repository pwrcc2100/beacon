'use client';
import { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';

type Props = {
  tokens: any[];
};

export function ResponseRateTracking({ tokens }: Props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  // Group tokens by week
  const weeklyData: Record<string, { issued: number; consumed: number }> = {};
  
  tokens.forEach(token => {
    const date = new Date(token.created_at);
    // Get Monday of that week
    const day = date.getDay() || 7;
    const monday = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() - (day - 1)));
    const weekKey = monday.toISOString().slice(0, 10);
    
    if (!weeklyData[weekKey]) {
      weeklyData[weekKey] = { issued: 0, consumed: 0 };
    }
    
    weeklyData[weekKey].issued++;
    if (token.status === 'consumed') {
      weeklyData[weekKey].consumed++;
    }
  });

  const sortedWeeks = Object.keys(weeklyData).sort();
  const issuedData = sortedWeeks.map(w => weeklyData[w].issued);
  const consumedData = sortedWeeks.map(w => weeklyData[w].consumed);
  const rateData = sortedWeeks.map(w => {
    const rate = weeklyData[w].issued > 0 
      ? (weeklyData[w].consumed / weeklyData[w].issued * 100).toFixed(1)
      : 0;
    return rate;
  });

  const weekLabels = sortedWeeks.map(w => new Date(w).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }));

  const option = {
    grid: { top: 80, right: 60, bottom: 60, left: 60 },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'cross' },
      formatter: (params: any) => {
        let result = `${params[0].axisValue}<br/>`;
        params.forEach((p: any) => {
          if (p.seriesName === 'Response Rate') {
            result += `${p.marker} ${p.seriesName}: ${p.value}%<br/>`;
          } else {
            result += `${p.marker} ${p.seriesName}: ${p.value}<br/>`;
          }
        });
        return result;
      }
    },
    legend: {
      data: ['Surveys Issued', 'Responses Received', 'Response Rate'],
      top: 10
    },
    xAxis: {
      type: 'category',
      data: weekLabels,
      axisLabel: { fontSize: 10, rotate: 45 }
    },
    yAxis: [
      {
        type: 'value',
        name: 'Count',
        position: 'left',
        axisLabel: { fontSize: 10 }
      },
      {
        type: 'value',
        name: 'Rate (%)',
        position: 'right',
        min: 0,
        max: 100,
        axisLabel: { 
          fontSize: 10,
          formatter: '{value}%'
        }
      }
    ],
    series: [
      {
        name: 'Surveys Issued',
        type: 'bar',
        data: issuedData,
        itemStyle: { color: '#cbd5e1' },
        yAxisIndex: 0
      },
      {
        name: 'Responses Received',
        type: 'bar',
        data: consumedData,
        itemStyle: { color: '#64afac' },
        yAxisIndex: 0
      },
      {
        name: 'Response Rate',
        type: 'line',
        data: rateData,
        smooth: true,
        lineStyle: { color: '#2B4162', width: 3 },
        itemStyle: { color: '#2B4162' },
        yAxisIndex: 1,
        markLine: {
          silent: true,
          lineStyle: { type: 'dashed', color: '#ea9999' },
          data: [{ yAxis: 50, name: 'Target: 50%' }],
          label: { fontSize: 10 }
        }
      }
    ]
  };

  // Calculate overall statistics
  const totalIssued = tokens.length;
  const totalConsumed = tokens.filter(t => t.status === 'consumed').length;
  const overallRate = totalIssued > 0 ? (totalConsumed / totalIssued * 100).toFixed(1) : 0;
  
  const recentWeeks = sortedWeeks.slice(-4);
  const recentRate = recentWeeks.length > 0
    ? (recentWeeks.reduce((sum, w) => {
        return sum + (weeklyData[w].issued > 0 ? weeklyData[w].consumed / weeklyData[w].issued : 0);
      }, 0) / recentWeeks.length * 100).toFixed(1)
    : 0;

  return (
    <div>
      {!mounted ? (
        <div style={{height:350}} className="flex items-center justify-center text-sm text-muted-foreground">
          Loading...
        </div>
      ) : sortedWeeks.length === 0 ? (
        <div style={{height:350}} className="flex items-center justify-center text-sm text-muted-foreground">
          No survey data available
        </div>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center p-3 bg-slate-50 rounded">
              <div className="text-2xl font-bold text-slate-700">{overallRate}%</div>
              <div className="text-xs text-muted-foreground">Overall Response Rate</div>
              <div className="text-xs text-muted-foreground mt-1">{totalConsumed} / {totalIssued}</div>
            </div>
            <div className="text-center p-3 bg-teal-50 rounded">
              <div className="text-2xl font-bold text-teal-700">{recentRate}%</div>
              <div className="text-xs text-muted-foreground">Recent 4 Weeks Avg</div>
            </div>
            <div className={`text-center p-3 rounded ${Number(recentRate) >= 50 ? 'bg-green-50' : 'bg-orange-50'}`}>
              <div className={`text-2xl font-bold ${Number(recentRate) >= 50 ? 'text-green-700' : 'text-orange-700'}`}>
                {Number(recentRate) >= 50 ? '✓' : '⚠'}
              </div>
              <div className="text-xs text-muted-foreground">Target Status</div>
              <div className="text-xs text-muted-foreground mt-1">Target: 50%</div>
            </div>
          </div>
          <ReactECharts option={option} style={{ height: 350 }} opts={{ renderer: 'svg' }} />
          <div className="mt-4 text-xs text-muted-foreground">
            <p className="font-medium mb-2">Why Response Rate Matters:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Low response rates (&lt;30%) may not represent the full workforce</li>
              <li>Declining rates over time suggest survey fatigue or loss of trust</li>
              <li>High rates (&gt;70%) indicate strong engagement with the process</li>
              <li>All other metrics should be interpreted in context of response rate</li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
}



