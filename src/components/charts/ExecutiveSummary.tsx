'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, TrendingDown, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';

type WellbeingRow = {
  wk: string;
  sentiment_avg: number;
  clarity_avg: number;
  workload_avg: number;
  safety_avg: number;
  leadership_avg: number;
};

type Props = {
  trends: WellbeingRow[];
  hierarchyData?: {
    data: Array<any>; // Flexible type to handle different hierarchy levels
    currentLevel?: string;
  };
};

type Insight = {
  type: 'warning' | 'attention' | 'positive' | 'neutral';
  icon: React.ReactNode;
  text: string;
  recommendation?: string;
};

function analyzeTrends(trends: WellbeingRow[], hierarchyData?: Props['hierarchyData']): Insight[] {
  if (trends.length < 2) {
    return [{
      type: 'neutral',
      icon: <AlertCircle className="h-5 w-5" />,
      text: 'Insufficient data for trend analysis',
      recommendation: 'Continue collecting responses to build meaningful insights.'
    }];
  }

  const insights: Insight[] = [];

  // Analyze team-level comparisons if hierarchy data is available
  if (hierarchyData && hierarchyData.data.length > 1 && hierarchyData.currentLevel !== 'team') {
    const teams = hierarchyData.data.filter(d => 
      d.wellbeing_score !== undefined && 
      d.response_count > 0 &&
      d.name
    );
    
    if (teams.length >= 2) {
      // Find best and worst performing teams by overall wellbeing
      const sortedByWellbeing = [...teams].sort((a, b) => 
        (b.wellbeing_score || 0) - (a.wellbeing_score || 0)
      );
      const bestTeam = sortedByWellbeing[0];
      const worstTeam = sortedByWellbeing[sortedByWellbeing.length - 1];
      
      if (bestTeam.wellbeing_score - worstTeam.wellbeing_score >= 15) {
        insights.push({
          type: 'positive',
          icon: <CheckCircle className="h-5 w-5" />,
          text: `${bestTeam.name} is significantly outperforming other teams (${bestTeam.wellbeing_score.toFixed(0)}% vs ${worstTeam.name} at ${worstTeam.wellbeing_score.toFixed(0)}%).`,
          recommendation: `Key question for management: What practices or conditions in ${bestTeam.name} are driving higher wellbeing? Consider interviewing managers from both teams to identify transferable strategies.`
        });
      }

      // Find teams with exceptional scores in specific dimensions
      const dimensions = [
        { key: 'safety_avg' as const, name: 'Psychological Safety' },
        { key: 'leadership_avg' as const, name: 'Leadership Support' },
        { key: 'workload_avg' as const, name: 'Workload Management' }
      ];

      dimensions.forEach(dim => {
        const sortedByDim = [...teams].sort((a, b) => b[dim.key] - a[dim.key]);
        const topTeam = sortedByDim[0];
        
        if (topTeam[dim.key] >= 4.5 && teams.length > 2) {
          insights.push({
            type: 'positive',
            icon: <TrendingUp className="h-5 w-5" />,
            text: `${topTeam.name} excels in ${dim.name} (${(topTeam[dim.key] * 20).toFixed(0)}%).`,
            recommendation: `Investigate and document best practices from ${topTeam.name}'s approach to ${dim.name.toLowerCase()}. Share findings across organisation.`
          });
        }
      });

      // Identify teams needing support
      const strugglingTeams = teams.filter(t => t.wellbeing_score < 60);
      if (strugglingTeams.length > 0 && strugglingTeams.length < teams.length) {
        const teamNames = strugglingTeams.map(t => t.name).join(', ');
        insights.push({
          type: 'warning',
          icon: <AlertTriangle className="h-5 w-5" />,
          text: `${strugglingTeams.length} team(s) showing elevated psychosocial risk: ${teamNames}.`,
          recommendation: `Compare team structures, workload distribution, and management practices. What differs from higher-performing teams?`
        });
      }
    }
  }

  // Analyze overall trends
  const dimensions = [
    { key: 'sentiment_avg' as const, name: 'Sentiment', criticalThreshold: 3 },
    { key: 'workload_avg' as const, name: 'Workload', criticalThreshold: 3 },
    { key: 'safety_avg' as const, name: 'Safety', criticalThreshold: 3 },
    { key: 'leadership_avg' as const, name: 'Leadership', criticalThreshold: 3 },
    { key: 'clarity_avg' as const, name: 'Clarity', criticalThreshold: 3 }
  ];

  // Calculate trends for each dimension
  dimensions.forEach(dim => {
    const recentValues = trends.slice(-4).map(t => t[dim.key]);
    const currentValue = recentValues[recentValues.length - 1];
    const previousValue = recentValues[recentValues.length - 2];
    const change = currentValue - previousValue;
    const percentChange = ((change / previousValue) * 100).toFixed(0);

    // Check for consistent decline (3+ periods)
    if (recentValues.length >= 3) {
      let decliningPeriods = 0;
      for (let i = 1; i < recentValues.length; i++) {
        if (recentValues[i] < recentValues[i - 1]) {
          decliningPeriods++;
        }
      }
      
      if (decliningPeriods >= 2) {
        insights.push({
          type: 'warning',
          icon: <TrendingDown className="h-5 w-5" />,
          text: `${dim.name} has declined for ${decliningPeriods + 1} consecutive periods, indicating potential team disengagement or systemic issues.`,
          recommendation: dim.key === 'leadership_avg' 
            ? 'Conduct one-on-one manager check-ins and review leadership support structures.'
            : dim.key === 'workload_avg'
            ? 'Review resource allocation and consider workload rebalancing across teams.'
            : dim.key === 'safety_avg'
            ? 'Schedule psychological safety workshops and review feedback mechanisms.'
            : dim.key === 'sentiment_avg'
            ? 'Investigate recent organisational changes or external factors affecting morale.'
            : 'Clarify role expectations and improve communication channels.'
        });
      }
    }

    // Check for rapid drop (>20% in one period)
    if (Math.abs(change) > 0.6 && change < 0) {
      insights.push({
        type: 'warning',
        icon: <AlertTriangle className="h-5 w-5" />,
        text: `Rapid ${Math.abs(Number(percentChange))}% drop in ${dim.name} this period could indicate a critical incident or significant change.`,
        recommendation: 'Immediate manager engagement recommended. Conduct pulse check-in or town hall meeting.'
      });
    }

    // Check for consistent improvement
    if (recentValues.length >= 3) {
      let improvingPeriods = 0;
      for (let i = 1; i < recentValues.length; i++) {
        if (recentValues[i] > recentValues[i - 1]) {
          improvingPeriods++;
        }
      }
      
      if (improvingPeriods >= 2 && currentValue >= 4) {
        insights.push({
          type: 'positive',
          icon: <TrendingUp className="h-5 w-5" />,
          text: `${dim.name} has improved consistently over ${improvingPeriods + 1} periods, indicating positive momentum.`,
          recommendation: 'Document and share successful practices with other teams.'
        });
      }
    }

    // Check for critically low scores
    if (currentValue < 2.5) {
      insights.push({
        type: 'warning',
        icon: <AlertTriangle className="h-5 w-5" />,
        text: `${dim.name} is at a critically low level (${currentValue.toFixed(1)}/5), indicating high psychosocial risk.`,
        recommendation: 'Urgent intervention required. Escalate to senior leadership and HR.'
      });
    }

    // Check for high performance to maintain
    if (currentValue >= 4.5) {
      insights.push({
        type: 'positive',
        icon: <CheckCircle className="h-5 w-5" />,
        text: `${dim.name} is performing exceptionally well (${currentValue.toFixed(1)}/5).`,
        recommendation: 'Maintain current practices and use as benchmark for other areas.'
      });
    }
  });

  // Calculate overall wellbeing trend
  const recentOverall = trends.slice(-4).map(t => 
    (t.sentiment_avg * 0.25 + t.workload_avg * 0.25 + t.safety_avg * 0.20 + t.leadership_avg * 0.20 + t.clarity_avg * 0.10) * 20
  );
  const overallChange = recentOverall[recentOverall.length - 1] - recentOverall[recentOverall.length - 2];
  
  if (Math.abs(overallChange) > 5) {
    const direction = overallChange > 0 ? 'improved' : 'declined';
    insights.push({
      type: overallChange > 0 ? 'positive' : 'attention',
      icon: overallChange > 0 ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />,
      text: `Overall wellbeing has ${direction} by ${Math.abs(overallChange).toFixed(1)}% this period.`,
      recommendation: overallChange < 0 
        ? 'Review recent organisational changes and consider all-hands communication.'
        : 'Positive trend detected. Continue monitoring and reinforce successful initiatives.'
    });
  }

  // Sort by priority: positive first (to highlight wins), then warnings, then attention
  const priorityOrder = { positive: 0, warning: 1, attention: 2, neutral: 3 };
  insights.sort((a, b) => priorityOrder[a.type] - priorityOrder[b.type]);

  // Return top 5-6 insights (more if we have team comparisons)
  const maxInsights = hierarchyData && hierarchyData.data.length > 1 ? 6 : 5;
  return insights.slice(0, maxInsights);
}

export function ExecutiveSummary({ trends, hierarchyData }: Props) {
  const insights = analyzeTrends(trends, hierarchyData);

  const getIconColor = (type: string) => {
    switch (type) {
      case 'warning': return '#ea9999'; // coral
      case 'attention': return '#f59e0b'; // amber
      case 'positive': return '#64afac'; // teal
      default: return '#5d89a9'; // slate
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case 'warning': return '#fef2f2'; // light red
      case 'attention': return '#fffbeb'; // light amber
      case 'positive': return '#f0fdf4'; // light green
      default: return '#f8fafc'; // light slate
    }
  };

  return (
    <Card className="border-2 h-full flex flex-col" style={{ borderColor: '#2B4162' }}>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Key Insights</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        {insights.length === 0 ? (
          <div className="text-xs text-muted-foreground italic">
            No significant patterns detected.
          </div>
        ) : (
          <div className="space-y-2">
            {insights.map((insight, idx) => (
              <div 
                key={idx} 
                className="flex items-start gap-2 p-2 rounded border-l-2"
                style={{ 
                  backgroundColor: getBgColor(insight.type),
                  borderLeftColor: getIconColor(insight.type)
                }}
              >
                <div className="flex-shrink-0 mt-0.5" style={{ color: getIconColor(insight.type) }}>
                  {insight.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-[var(--text-primary)] leading-snug">
                    {insight.text}
                  </p>
                  {insight.recommendation && (
                    <p className="text-xs text-muted-foreground mt-1 leading-snug">
                      → {insight.recommendation}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

