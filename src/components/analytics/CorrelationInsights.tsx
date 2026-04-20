'use client';
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import ReactECharts from 'echarts-for-react';

type Response = {
  sentiment_5: number;
  workload_5: number;
  safety_5: number;
  leadership_5: number;
  clarity_5: number;
};

type Props = {
  responses: Response[];
};

export function CorrelationInsights({ responses }: Props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  if (responses.length === 0) {
    return (
      <Card className="control-room-card border-white/10">
        <CardHeader>
          <CardTitle>Correlation Patterns</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-zinc-400">No data available yet</p>
        </CardContent>
      </Card>
    );
  }

  // Create scatter plots showing relationships
  const workloadVsSentiment = responses.map(r => [r.workload_5, r.sentiment_5]);
  const safetyVsSentiment = responses.map(r => [r.safety_5, r.sentiment_5]);
  const leadershipVsSentiment = responses.map(r => [r.leadership_5, r.sentiment_5]);

  const createScatterOption = (data: number[][], xLabel: string, yLabel: string, color: string) => ({
    grid: { top: 40, right: 40, bottom: 60, left: 60 },
    xAxis: {
      type: 'value',
      min: 1,
      max: 5,
      name: xLabel,
      nameLocation: 'middle',
      nameGap: 35,
      nameTextStyle: { fontSize: 12, fontWeight: 'bold' },
      axisLabel: { fontSize: 11 }
    },
    yAxis: {
      type: 'value',
      min: 1,
      max: 5,
      name: yLabel,
      nameLocation: 'middle',
      nameGap: 45,
      nameTextStyle: { fontSize: 12, fontWeight: 'bold' },
      axisLabel: { fontSize: 11 }
    },
    series: [{
      type: 'scatter',
      data: data,
      symbolSize: 10,
      itemStyle: {
        color: color,
        opacity: 0.6
      }
    }],
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => {
        return `${xLabel}: ${params.value[0]}<br/>${yLabel}: ${params.value[1]}`;
      }
    }
  });

  const insights = [
    {
      title: 'Workload → Wellbeing',
      description: 'As workload increases, does wellbeing decrease? Look for a downward trend.',
      pattern: workloadVsSentiment,
      color: '#ea9999',
      interpretation: workloadVsSentiment.length > 5
        ? 'If dots trend downward (top-left to bottom-right), high workload is hurting wellbeing.'
        : 'Need more data for pattern analysis'
    },
    {
      title: 'Psychological Safety → Wellbeing',
      description: 'People who feel safe should have higher wellbeing. Look for an upward trend.',
      pattern: safetyVsSentiment,
      color: '#64afac',
      interpretation: safetyVsSentiment.length > 5
        ? 'If dots trend upward (bottom-left to top-right), safety is a key driver of wellbeing.'
        : 'Need more data for pattern analysis'
    },
    {
      title: 'Leadership Support → Wellbeing',
      description: 'Strong leadership support should correlate with better wellbeing.',
      pattern: leadershipVsSentiment,
      color: '#5d89a9',
      interpretation: leadershipVsSentiment.length > 5
        ? 'If dots trend upward, leadership support is working. If scattered, support is inconsistent.'
        : 'Need more data for pattern analysis'
    }
  ];

  return (
    <Card className="control-room-card border-white/10">
      <CardHeader>
        <CardTitle>How Metrics Relate to Wellbeing</CardTitle>
        <p className="text-sm text-zinc-400 mt-1">
          Understanding which factors drive overall wellbeing in your organisation
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {insights.map((insight, i) => (
            <div key={i} className="space-y-3">
              <div>
                <div className="font-semibold text-base mb-1 text-white">{insight.title}</div>
                <div className="text-xs text-zinc-400">{insight.description}</div>
              </div>
              {mounted ? (
                <ReactECharts
                  option={createScatterOption(
                    insight.pattern,
                    insight.title.split(' → ')[0],
                    'Overall Sentiment',
                    insight.color
                  )}
                  style={{ height: 220 }}
                  opts={{ renderer: 'svg' }}
                />
              ) : (
                <div style={{ height: 220 }} className="flex items-center justify-center bg-white/5 rounded text-zinc-400">
                  Loading chart...
                </div>
              )}
              <div className="bg-amber-900/30 border border-amber-600/50 rounded p-2 text-xs text-amber-200">
                <strong>Pattern:</strong> {insight.interpretation}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 bg-[#2d6785]/20 border-l-4 border-[#2d6785] p-4">
          <div className="font-semibold text-white mb-2">💡 Executive Takeaway</div>
          <p className="text-sm text-zinc-300">
            These scatter plots show relationships between factors. A clear upward or downward line indicates a strong, predictable relationship. 
            Scattered dots mean the relationship is weak or inconsistent. Focus your interventions on the factors showing the strongest patterns.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}





