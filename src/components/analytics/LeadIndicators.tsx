'use client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

type Response = {
  sentiment_5: number;
  workload_5: number;
  safety_5: number;
  leadership_5: number;
  clarity_5: number;
  submitted_at: string;
};

type Props = {
  responses: Response[];
};

export function LeadIndicators({ responses }: Props) {
  if (responses.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Lead Indicators: Early Warning Signals</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No data available yet</p>
        </CardContent>
      </Card>
    );
  }

  // Calculate correlations between metrics and sentiment (as proxy for overall wellbeing)
  const calculateCorrelation = (metric: keyof Response) => {
    const pairs = responses.map(r => ({
      x: r[metric] as number,
      y: r.sentiment_5
    }));
    
    const n = pairs.length;
    const sumX = pairs.reduce((sum, p) => sum + p.x, 0);
    const sumY = pairs.reduce((sum, p) => sum + p.y, 0);
    const sumXY = pairs.reduce((sum, p) => sum + (p.x * p.y), 0);
    const sumX2 = pairs.reduce((sum, p) => sum + (p.x * p.x), 0);
    const sumY2 = pairs.reduce((sum, p) => sum + (p.y * p.y), 0);
    
    const numerator = (n * sumXY) - (sumX * sumY);
    const denominator = Math.sqrt(((n * sumX2) - (sumX * sumX)) * ((n * sumY2) - (sumY * sumY)));
    
    return denominator === 0 ? 0 : numerator / denominator;
  };

  const workloadCorr = calculateCorrelation('workload_5');
  const safetyCorr = calculateCorrelation('safety_5');
  const leadershipCorr = calculateCorrelation('leadership_5');
  const clarityCorr = calculateCorrelation('clarity_5');

  const indicators = [
    {
      name: 'Workload Management',
      correlation: workloadCorr,
      insight: workloadCorr < -0.3 
        ? 'High workload is strongly linked to lower wellbeing. Workload issues often appear 2-3 weeks before sentiment drops.'
        : 'Workload is well-balanced and not impacting overall wellbeing significantly.'
    },
    {
      name: 'Psychological Safety',
      correlation: safetyCorr,
      insight: safetyCorr > 0.5
        ? 'Strong positive driver! People who feel safe speaking up have significantly better wellbeing. This is a key lever for improvement.'
        : safetyCorr > 0.3
        ? 'Moderate positive impact. Increasing psychological safety could improve overall wellbeing.'
        : 'Low correlation suggests other factors may be more immediate concerns.'
    },
    {
      name: 'Leadership Support',
      correlation: leadershipCorr,
      insight: leadershipCorr > 0.5
        ? 'Critical success factor! Leadership support is strongly linked to wellbeing. Continue investing in leadership capability.'
        : leadershipCorr > 0.3
        ? 'Leadership support matters. Focus on visible leadership actions and timely responses to concerns.'
        : 'Leadership perception may need attention - this is often a lead indicator of broader issues.'
    },
    {
      name: 'Role Clarity',
      correlation: clarityCorr,
      insight: clarityCorr > 0.4
        ? 'Clear expectations drive wellbeing. Clarity often deteriorates first during organisational change.'
        : 'Clarity may need improvement - confusion about roles typically precedes disengagement.'
    }
  ];

  const getStrength = (corr: number) => {
    const abs = Math.abs(corr);
    if (abs > 0.7) return { label: 'Very Strong', color: '#16a34a' };
    if (abs > 0.5) return { label: 'Strong', color: '#64afac' };
    if (abs > 0.3) return { label: 'Moderate', color: '#f59e0b' };
    return { label: 'Weak', color: '#94a3b8' };
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lead Indicators: What Predicts Wellbeing?</CardTitle>
        <p className="text-sm text-muted-foreground mt-1">
          These metrics tell you what factors most strongly influence overall team wellbeing
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {indicators.map((indicator, i) => {
            const strength = getStrength(indicator.correlation);
            return (
              <div key={i} className="border rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-base">{indicator.name}</div>
                  <div className="flex items-center gap-2">
                    <Badge style={{ backgroundColor: strength.color, color: 'white' }}>
                      {strength.label}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      r = {indicator.correlation.toFixed(2)}
                    </span>
                  </div>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded p-3 text-sm text-blue-900">
                  <span className="font-medium">💡 What this means: </span>
                  {indicator.insight}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 bg-slate-50 border border-slate-200 rounded-lg p-4 text-sm">
          <div className="font-semibold mb-2">How to Use Lead Indicators:</div>
          <ul className="space-y-1 text-slate-700">
            <li>• <strong>Strong correlations (r &gt; 0.5)</strong> indicate these factors are key drivers you can act on</li>
            <li>• <strong>Negative correlations</strong> mean as that factor worsens, wellbeing drops</li>
            <li>• <strong>Watch for changes:</strong> A sudden drop in a lead indicator often predicts wellbeing issues 2-4 weeks later</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}





