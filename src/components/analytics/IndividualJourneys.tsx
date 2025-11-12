'use client';
import { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';

type Props = {
  data: any[];
};

export function IndividualJourneys({ data }: Props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  // Group by employee_id and track their responses over time
  const employeeJourneys: Record<string, any[]> = {};
  
  data.forEach(response => {
    const empId = response.employee_id || 'anonymous';
    if (!employeeJourneys[empId]) {
      employeeJourneys[empId] = [];
    }
    employeeJourneys[empId].push({
      date: new Date(response.submitted_at),
      wellbeing: ((response.sentiment_5 || 0) * 0.30 + 
                  (response.workload_5 || 0) * 0.25 + 
                  (response.leadership_5 || 0) * 0.25 + 
                  (response.safety_5 || 0) * 0.20) * 20
    });
  });

  // Sort each journey by date
  Object.values(employeeJourneys).forEach(journey => {
    journey.sort((a, b) => a.date.getTime() - b.date.getTime());
  });

  // Only show employees with at least 2 responses
  const meaningfulJourneys = Object.entries(employeeJourneys)
    .filter(([_, journey]) => journey.length >= 2)
    .slice(0, 15); // Limit to 15 for readability

  if (meaningfulJourneys.length === 0) {
    return (
      <div style={{height:400}} className="flex items-center justify-center text-sm text-muted-foreground">
        No longitudinal data available (requires 2+ responses per person)
      </div>
    );
  }

  // Create anonymized series
  const series = meaningfulJourneys.map(([empId, journey], idx) => {
    return {
      name: `Person ${idx + 1}`,
      type: 'line',
      data: journey.map(j => [j.date.getTime(), j.wellbeing.toFixed(1)]),
      smooth: false,
      symbol: 'circle',
      symbolSize: 6,
      lineStyle: { width: 2 },
      emphasis: {
        focus: 'series',
        lineStyle: { width: 4 }
      }
    };
  });

  const option = {
    grid: { top: 60, right: 120, bottom: 80, left: 60 },
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => {
        const date = new Date(params[0].data[0]).toLocaleDateString();
        let result = `${date}<br/>`;
        params.forEach((p: any) => {
          result += `${p.seriesName}: ${p.data[1]}%<br/>`;
        });
        return result;
      }
    },
    legend: {
      type: 'scroll',
      orient: 'vertical',
      right: 10,
      top: 20,
      bottom: 20,
      textStyle: { fontSize: 10 }
    },
    xAxis: {
      type: 'time',
      axisLabel: { fontSize: 10, rotate: 45 }
    },
    yAxis: {
      type: 'value',
      name: 'Wellbeing Score (%)',
      min: 0,
      max: 100,
      axisLabel: { fontSize: 10 },
      splitLine: {
        lineStyle: {
          type: 'dashed',
          color: '#e5e7eb'
        }
      },
      // Add risk zones
      splitArea: {
        show: true,
        areaStyle: {
          color: ['rgba(234, 153, 153, 0.12)', 'transparent', 'transparent', 'rgba(100, 175, 172, 0.12)']
        }
      }
    },
    series
  };

  // Identify patterns
  const declining = meaningfulJourneys.filter(([_, journey]) => {
    if (journey.length < 2) return false;
    const first = journey[0].wellbeing;
    const last = journey[journey.length - 1].wellbeing;
    return last < first - 10; // Declined by more than 10%
  }).length;

  const improving = meaningfulJourneys.filter(([_, journey]) => {
    if (journey.length < 2) return false;
    const first = journey[0].wellbeing;
    const last = journey[journey.length - 1].wellbeing;
    return last > first + 10; // Improved by more than 10%
  }).length;

  const stable = meaningfulJourneys.length - declining - improving;

  return (
    <div>
      {!mounted ? (
        <div style={{height:450}} className="flex items-center justify-center text-sm text-muted-foreground">
          Loading...
        </div>
      ) : (
        <>
          <ReactECharts option={option} style={{ height: 450 }} opts={{ renderer: 'svg' }} />
          <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
            <div className="text-center p-3 bg-red-50 rounded">
              <div className="text-2xl font-bold text-red-600">{declining}</div>
              <div className="text-xs text-red-700">Declining Trajectories</div>
              <div className="text-xs text-muted-foreground mt-1">↓ 10%+ drop</div>
            </div>
            <div className="text-center p-3 bg-slate-50 rounded">
              <div className="text-2xl font-bold text-slate-600">{stable}</div>
              <div className="text-xs text-slate-700">Stable Trajectories</div>
              <div className="text-xs text-muted-foreground mt-1">±10% range</div>
            </div>
            <div className="text-center p-3 bg-teal-50 rounded">
              <div className="text-2xl font-bold text-teal-600">{improving}</div>
              <div className="text-xs text-teal-700">Improving Trajectories</div>
              <div className="text-xs text-muted-foreground mt-1">↑ 10%+ gain</div>
            </div>
          </div>
          <div className="mt-4 text-xs text-muted-foreground">
            <p className="font-medium mb-2">Insights:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Each line represents one anonymized individual's wellbeing trajectory</li>
              <li>Declining trajectories need urgent intervention</li>
              <li>Consistent low scores (&lt;60%) indicate chronic issues</li>
              <li>Volatile patterns suggest unstable work conditions</li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
}





