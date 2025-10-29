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

export function RiskSignals({ responses }: Props) {
  if (responses.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Risk Signals</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No data available yet</p>
        </CardContent>
      </Card>
    );
  }

  // Get last 7 days of responses
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const recentResponses = responses.filter(r => new Date(r.submitted_at) >= sevenDaysAgo);

  if (recentResponses.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Risk Signals (Last 7 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No recent responses in the last 7 days</p>
        </CardContent>
      </Card>
    );
  }

  // Calculate risk signals
  const lowSentiment = recentResponses.filter(r => r.sentiment_5 <= 2).length;
  const highWorkload = recentResponses.filter(r => r.workload_5 <= 2).length; // Low score on workload = overloaded
  const lowSafety = recentResponses.filter(r => r.safety_5 <= 2).length;
  const lowLeadership = recentResponses.filter(r => r.leadership_5 <= 2).length;
  const lowClarity = recentResponses.filter(r => r.clarity_5 <= 2).length;

  const total = recentResponses.length;

  const signals = [
    {
      metric: 'Low Sentiment',
      count: lowSentiment,
      percent: Math.round((lowSentiment / total) * 100),
      severity: lowSentiment / total > 0.3 ? 'high' : lowSentiment / total > 0.15 ? 'medium' : 'low',
      action: lowSentiment > 0 
        ? `${lowSentiment} people reported feeling challenged/overwhelmed. Check in with them within 48 hours.`
        : 'No immediate concerns about overall sentiment.'
    },
    {
      metric: 'Workload Concerns',
      count: highWorkload,
      percent: Math.round((highWorkload / total) * 100),
      severity: highWorkload / total > 0.3 ? 'high' : highWorkload / total > 0.15 ? 'medium' : 'low',
      action: highWorkload > 0
        ? `${highWorkload} people struggling with workload. Review priorities and deadlines. Consider redistribution.`
        : 'Workload appears manageable across the team.'
    },
    {
      metric: 'Psychological Safety Issues',
      count: lowSafety,
      percent: Math.round((lowSafety / total) * 100),
      severity: lowSafety / total > 0.2 ? 'high' : lowSafety / total > 0.1 ? 'medium' : 'low',
      action: lowSafety > 0
        ? `${lowSafety} people don't feel safe speaking up. This is a critical red flag requiring immediate leadership attention.`
        : 'Team feels safe raising concerns - maintain this positive culture.'
    },
    {
      metric: 'Leadership Support Gap',
      count: lowLeadership,
      percent: Math.round((lowLeadership / total) * 100),
      severity: lowLeadership / total > 0.25 ? 'high' : lowLeadership / total > 0.15 ? 'medium' : 'low',
      action: lowLeadership > 0
        ? `${lowLeadership} people don't feel supported by leadership. Schedule visible leadership engagement sessions.`
        : 'Leadership support is being felt across the team.'
    },
    {
      metric: 'Role Clarity Problems',
      count: lowClarity,
      percent: Math.round((lowClarity / total) * 100),
      severity: lowClarity / total > 0.25 ? 'high' : lowClarity / total > 0.15 ? 'medium' : 'low',
      action: lowClarity > 0
        ? `${lowClarity} people unclear on expectations. Hold role clarity sessions or update position descriptions.`
        : 'Roles and expectations are clear across the team.'
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return { bg: '#fee2e2', border: '#dc2626', text: '#991b1b', label: 'HIGH RISK' };
      case 'medium': return { bg: '#fef3c7', border: '#f59e0b', text: '#92400e', label: 'MODERATE' };
      default: return { bg: '#d1fae5', border: '#10b981', text: '#065f46', label: 'LOW RISK' };
    }
  };

  const highRiskCount = signals.filter(s => s.severity === 'high').length;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Risk Signals (Last 7 Days)</CardTitle>
        <p className="text-sm text-muted-foreground mt-1">
          Immediate concerns requiring attention - based on {total} recent responses
        </p>
      </CardHeader>
      <CardContent>
        {highRiskCount > 0 && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-600 p-4">
            <div className="font-semibold text-red-900 text-lg mb-1">🚨 {highRiskCount} High-Risk Signal{highRiskCount > 1 ? 's' : ''} Detected</div>
            <p className="text-sm text-red-800">
              These require immediate leadership action. Review details below and assign owners for follow-up.
            </p>
          </div>
        )}

        <div className="space-y-4">
          {signals.map((signal, i) => {
            const style = getSeverityColor(signal.severity);
            return (
              <div 
                key={i} 
                className="border rounded-lg p-4" 
                style={{ backgroundColor: style.bg, borderColor: style.border }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="font-semibold text-base" style={{ color: style.text }}>
                    {signal.metric}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge style={{ backgroundColor: style.border, color: 'white' }}>
                      {style.label}
                    </Badge>
                    <span className="text-sm font-bold" style={{ color: style.text }}>
                      {signal.percent}% ({signal.count}/{total})
                    </span>
                  </div>
                </div>
                <div className="text-sm" style={{ color: style.text }}>
                  <strong>Recommended Action:</strong> {signal.action}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 bg-slate-50 border border-slate-200 rounded-lg p-4 text-sm">
          <div className="font-semibold mb-2">Using Risk Signals Effectively:</div>
          <ul className="space-y-1 text-slate-700">
            <li>• <strong>High Risk (&gt;30%):</strong> Urgent action required. Assign leadership owner and set 48-hour follow-up.</li>
            <li>• <strong>Moderate Risk (15-30%):</strong> Monitor closely. Plan intervention within 1 week.</li>
            <li>• <strong>Low Risk (&lt;15%):</strong> Maintain current approach. Continue regular check-ins.</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}


