'use client';
import { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';

type Props = {
  data: any[];
  divisions: any[];
  departments: any[];
};

export function SegmentedBoxPlots({ data, divisions, departments }: Props) {
  const [mounted, setMounted] = useState(false);
  const [metric, setMetric] = useState<'sentiment_5' | 'workload_5' | 'leadership_5' | 'safety_5'>('sentiment_5');
  
  useEffect(() => { setMounted(true); }, []);

  // Calculate box plot statistics
  const calculateBoxStats = (values: number[]) => {
    if (values.length === 0) return null;
    
    const sorted = [...values].sort((a, b) => a - b);
    const q1Index = Math.floor(sorted.length * 0.25);
    const q2Index = Math.floor(sorted.length * 0.5);
    const q3Index = Math.floor(sorted.length * 0.75);
    
    const q1 = sorted[q1Index];
    const median = sorted[q2Index];
    const q3 = sorted[q3Index];
    const min = sorted[0];
    const max = sorted[sorted.length - 1];
    
    return [min, q1, median, q3, max];
  };

  // Group data by division
  const divisionData = divisions.map(div => {
    const divResponses = data.filter(r => 
      r.employees?.division_id === div.division_id && r[metric] != null
    );
    const values = divResponses.map(r => r[metric]);
    return {
      name: div.division_name,
      stats: calculateBoxStats(values),
      count: values.length
    };
  }).filter(d => d.stats !== null);

  if (divisionData.length === 0) {
    return (
      <div style={{height:400}} className="flex items-center justify-center text-sm text-muted-foreground">
        No segmented data available
      </div>
    );
  }

  const option = {
    grid: { top: 60, right: 40, bottom: 80, left: 80 },
    tooltip: {
      trigger: 'item',
      axisPointer: { type: 'shadow' },
      formatter: (params: any) => {
        if (params.componentSubType === 'boxplot') {
          const [min, q1, median, q3, max] = params.data;
          const div = divisionData[params.dataIndex];
          return `${div.name} (n=${div.count})<br/>
            Max: ${max}<br/>
            Q3: ${q3}<br/>
            Median: ${median}<br/>
            Q1: ${q1}<br/>
            Min: ${min}`;
        }
        return '';
      }
    },
    xAxis: {
      type: 'category',
      data: divisionData.map(d => `${d.name}\n(n=${d.count})`),
      axisLabel: { fontSize: 10, rotate: 20 },
      boundaryGap: true,
      nameGap: 30,
      splitArea: { show: false },
      splitLine: { show: false }
    },
    yAxis: {
      type: 'value',
      name: 'Score (1-5 scale)',
      min: 1,
      max: 5,
      splitArea: { show: true }
    },
    series: [
      {
        name: 'boxplot',
        type: 'boxplot',
        data: divisionData.map(d => d.stats),
        itemStyle: {
          color: '#64afac',
          borderColor: '#2B4162'
        },
        boxWidth: ['30%', '60%']
      }
    ]
  };

  const metricLabels = {
    sentiment_5: 'Mood',
    workload_5: 'Workload',
    leadership_5: 'Support',
    safety_5: 'Feeling Valued'
  };

  // Identify divisions with concerning patterns
  const lowMedian = divisionData.filter(d => d.stats && d.stats[2] < 3);
  const highVariance = divisionData.filter(d => d.stats && (d.stats[4] - d.stats[0]) > 3);

  return (
    <div>
      {!mounted ? (
        <div style={{height:400}} className="flex items-center justify-center text-sm text-muted-foreground">
          Loading...
        </div>
      ) : (
        <>
          <div className="mb-4 flex gap-2 flex-wrap">
            <span className="text-sm font-medium">Select Metric:</span>
            {(Object.keys(metricLabels) as Array<keyof typeof metricLabels>).map(key => (
              <button
                key={key}
                onClick={() => setMetric(key)}
                className={`px-3 py-1 rounded text-sm ${
                  metric === key 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }`}
              >
                {metricLabels[key]}
              </button>
            ))}
          </div>
          
          <ReactECharts option={option} style={{ height: 400 }} opts={{ renderer: 'svg' }} />
          
          {(lowMedian.length > 0 || highVariance.length > 0) && (
            <div className="mt-4 space-y-2">
              {lowMedian.length > 0 && (
                <div className="p-3 bg-red-50 rounded text-sm">
                  <div className="font-medium text-red-800 mb-1">⚠ Low Median Divisions:</div>
                  <div className="text-red-700">
                    {lowMedian.map(d => d.name).join(', ')} - Median score &lt; 3 (at risk)
                  </div>
                </div>
              )}
              {highVariance.length > 0 && (
                <div className="p-3 bg-orange-50 rounded text-sm">
                  <div className="font-medium text-orange-800 mb-1">⚠ High Variance Divisions:</div>
                  <div className="text-orange-700">
                    {highVariance.map(d => d.name).join(', ')} - Wide range suggests inconsistent experiences
                  </div>
                </div>
              )}
            </div>
          )}
          
          <div className="mt-4 text-xs text-muted-foreground">
            <p className="font-medium mb-2">How to Read Box Plots:</p>
            <ul className="list-disc list-inside space-y-1">
              <li><strong>Box:</strong> Middle 50% of responses (Q1 to Q3)</li>
              <li><strong>Line in box:</strong> Median (50th percentile)</li>
              <li><strong>Whiskers:</strong> Min and max values (excluding outliers)</li>
              <li><strong>Narrow box:</strong> Consistent responses across the division</li>
              <li><strong>Wide box:</strong> Varied experiences - some doing well, some struggling</li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
}





