import { AlertTriangle, TrendingDown, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import type { ReactNode } from 'react';

export type WellbeingRow = {
  wk: string;
  sentiment_avg: number;
  clarity_avg: number;
  workload_avg: number;
  safety_avg: number;
  leadership_avg: number;
};

export type ExecutiveInsight = {
  type: 'warning' | 'attention' | 'positive' | 'neutral';
  icon: ReactNode;
  text: string;
  recommendation?: string;
};

type HierarchyData = {
  data: Array<any>;
  currentLevel?: string;
};

export function generateExecutiveInsights(trends: WellbeingRow[], hierarchyData?: HierarchyData): ExecutiveInsight[] {
  if (trends.length < 2) {
    return [{
      type: 'neutral',
      icon: <AlertCircle className="h-5 w-5" />,
      text: 'Insufficient data for trend analysis',
      recommendation: 'Continue collecting responses to build meaningful insights.'
    }];
  }

  const insights: ExecutiveInsight[] = [];

  if (hierarchyData && hierarchyData.data.length > 1 && hierarchyData.currentLevel !== 'team') {
    const teams = hierarchyData.data.filter(d =>
      d.wellbeing_score !== undefined &&
      d.response_count > 0 &&
      d.name
    );

    if (teams.length >= 2) {
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

      const strugglingTeams = teams.filter((t: any) => t.wellbeing_score < 60);
      if (strugglingTeams.length > 0 && strugglingTeams.length < teams.length) {
        const teamNames = strugglingTeams.map((t: any) => t.name).join(', ');
        insights.push({
          type: 'warning',
          icon: <AlertTriangle className="h-5 w-5" />,
          text: `${strugglingTeams.length} team(s) showing elevated psychosocial risk: ${teamNames}.`,
          recommendation: 'Compare team structures, workload distribution, and management practices. What differs from higher-performing teams?'
        });
      }
    }
  }

  const dimensions = [
    { key: 'sentiment_avg' as const, name: 'Sentiment' },
    { key: 'workload_avg' as const, name: 'Workload' },
    { key: 'safety_avg' as const, name: 'Safety' },
    { key: 'leadership_avg' as const, name: 'Leadership' },
    { key: 'clarity_avg' as const, name: 'Clarity' }
  ];

  dimensions.forEach(dim => {
    const recentValues = trends.slice(-4).map(t => t[dim.key]);
    if (recentValues.length < 2) {
      return;
    }

    const currentValue = recentValues[recentValues.length - 1];
    const previousValue = recentValues[recentValues.length - 2];
    const change = currentValue - previousValue;
    const percentChange = previousValue !== 0 ? ((change / previousValue) * 100) : 0;
    const percentChangeRounded = Math.round(percentChange);

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

    if (Math.abs(change) > 0.6 && change < 0) {
      insights.push({
        type: 'warning',
        icon: <AlertTriangle className="h-5 w-5" />,
        text: `Rapid ${Math.abs(percentChangeRounded)}% drop in ${dim.name} this period could indicate a critical incident or significant change.`,
        recommendation: 'Immediate manager engagement recommended. Conduct pulse check-in or town hall meeting.'
      });
    }

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

    if (currentValue < 2.5) {
      insights.push({
        type: 'warning',
        icon: <AlertTriangle className="h-5 w-5" />,
        text: `${dim.name} is at a critically low level (${currentValue.toFixed(1)}/5), indicating high psychosocial risk.`,
        recommendation: 'Urgent intervention required. Escalate to senior leadership and HR.'
      });
    }

    if (currentValue >= 4.5) {
      insights.push({
        type: 'positive',
        icon: <CheckCircle className="h-5 w-5" />,
        text: `${dim.name} is performing exceptionally well (${currentValue.toFixed(1)}/5).`,
        recommendation: 'Maintain current practices and use as benchmark for other areas.'
      });
    }
  });

  const recentOverall = trends.slice(-4).map(t =>
    (t.sentiment_avg * 0.25 + t.workload_avg * 0.25 + t.safety_avg * 0.20 + t.leadership_avg * 0.20 + t.clarity_avg * 0.10) * 20
  );

  if (recentOverall.length >= 2) {
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
  }

  const priorityOrder = { positive: 0, warning: 1, attention: 2, neutral: 3 } as const;
  insights.sort((a, b) => priorityOrder[a.type] - priorityOrder[b.type]);

  const maxInsights = hierarchyData && hierarchyData.data.length > 1 ? 6 : 5;
  return insights.slice(0, maxInsights);
}

