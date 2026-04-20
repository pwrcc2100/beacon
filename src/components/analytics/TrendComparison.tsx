'use client';
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import ReactECharts from 'echarts-for-react';

type WeeklyTrend = {
  wk: string;
  sentiment_avg: number;
  workload_avg: number;
  safety_avg: number;
  leadership_avg: number;
  clarity_avg: number;
};

type Props = {
  weeklyTrends: WeeklyTrend[];
};

export function TrendComparison({ weeklyTrends }: Props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  if (weeklyTrends.length === 0) {
    return (
      <Card className="control-room-card border-white/10">
        <CardHeader>
          <CardTitle>Multi-Metric Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-zinc-400">No trend data available yet</p>
        </CardContent>
      </Card>
    );
  }

  const weeks = weeklyTrends.map(t => new Date(t.wk).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }));

  const option = {
    grid: { top: 60, right: 120, bottom: 60, left: 60 },
    legend: {
      data: ['Sentiment', 'Psychological Safety', 'Leadership', 'Workload', 'Clarity'],
      top: 10
    },
    xAxis: {
      type: 'category',
      data: weeks,
      axisLabel: { fontSize: 11, rotate: 45 }
    },
    yAxis: {
      type: 'value',
      min: 1,
      max: 5,
      name: 'Score (1-5)',
      nameLocation: 'middle',
      nameGap: 45,
      axisLabel: { fontSize: 11 }
    },
    series: [
      {
        name: 'Sentiment',
        type: 'line',
        data: weeklyTrends.map(t => t.sentiment_avg),
        lineStyle: { width: 3 },
        itemStyle: { color: '#64afac' }
      },
      {
        name: 'Psychological Safety',
        type: 'line',
        data: weeklyTrends.map(t => t.safety_avg),
        lineStyle: { width: 2 },
        itemStyle: { color: '#ea9999' }
      },
      {
        name: 'Leadership',
        type: 'line',
        data: weeklyTrends.map(t => t.leadership_avg),
        lineStyle: { width: 2 },
        itemStyle: { color: '#5d89a9' }
      },
      {
        name: 'Workload',
        type: 'line',
        data: weeklyTrends.map(t => t.workload_avg),
        lineStyle: { width: 2 },
        itemStyle: { color: '#f59e0b' }
      },
      {
        name: 'Clarity',
        type: 'line',
        data: weeklyTrends.map(t => t.clarity_avg),
        lineStyle: { width: 2 },
        itemStyle: { color: '#8b5cf6' }
      }
    ],
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255,255,255,0.95)',
      borderColor: '#e5e7eb',
      textStyle: { color: '#374151', fontSize: 12 }
    }
  };

  // Identify which metrics are leading or lagging
  const last3 = weeklyTrends.slice(-3);
  const sentimentChange = last3.length >= 2 
    ? last3[last3.length - 1].sentiment_avg - last3[0].sentiment_avg 
    : 0;

  const changes = {
    workload: last3.length >= 2 ? last3[last3.length - 1].workload_avg - last3[0].workload_avg : 0,
    safety: last3.length >= 2 ? last3[last3.length - 1].safety_avg - last3[0].safety_avg : 0,
    leadership: last3.length >= 2 ? last3[last3.length - 1].leadership_avg - last3[0].leadership_avg : 0,
    clarity: last3.length >= 2 ? last3[last3.length - 1].clarity_avg - last3[0].clarity_avg : 0
  };

  const leadingIndicator = Object.entries(changes)
    .filter(([_, change]) => change < -0.3)
    .map(([metric, _]) => metric)[0];

  return (
    <Card className="control-room-card border-white/10">
      <CardHeader>
        <CardTitle>Comparing All Metrics Over Time</CardTitle>
        <p className="text-sm text-zinc-400 mt-1">
          Watch for which metrics drop first - they're your early warning system
        </p>
      </CardHeader>
      <CardContent>
        {mounted ? (
          <ReactECharts
            option={option}
            style={{ height: 400 }}
            opts={{ renderer: 'svg' }}
          />
        ) : (
          <div style={{ height: 400 }} className="flex items-center justify-center bg-white/5 rounded text-zinc-400">
            Loading chart...
          </div>
        )}

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-emerald-900/30 border border-emerald-600/50 rounded-lg p-4">
            <div className="font-semibold text-emerald-200 mb-2">✅ What to Look For (Good Signs)</div>
            <ul className="text-sm text-emerald-200/90 space-y-1">
              <li>• Lines moving upward together</li>
              <li>• All metrics above 3.5 (70%)</li>
              <li>• Psychological Safety tracking with or above Sentiment</li>
              <li>• Workload stable or improving</li>
            </ul>
          </div>

          <div className="bg-red-900/30 border border-red-600/50 rounded-lg p-4">
            <div className="font-semibold text-red-200 mb-2">⚠️ Warning Signs</div>
            <ul className="text-sm text-red-200/90 space-y-1">
              <li>• <strong>Workload or Clarity drops first</strong> → Sentiment will follow in 2-3 weeks</li>
              <li>• Widening gap between metrics (inconsistent experience)</li>
              <li>• Psychological Safety declining (people pulling back)</li>
              <li>• Leadership score diverging from others</li>
            </ul>
          </div>
        </div>

        {leadingIndicator && sentimentChange < 0 && (
          <div className="mt-4 bg-amber-900/30 border-l-4 border-amber-500 p-4">
            <div className="font-semibold text-amber-200 mb-1">🚨 Predictive Alert</div>
            <p className="text-sm text-amber-200/90">
              <strong>{leadingIndicator.charAt(0).toUpperCase() + leadingIndicator.slice(1)}</strong> has dropped significantly in the last 3 weeks, 
              and sentiment is also declining. This suggests {leadingIndicator} issues are driving the wellbeing drop. 
              Address {leadingIndicator} concerns to stabilise overall wellbeing.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}





