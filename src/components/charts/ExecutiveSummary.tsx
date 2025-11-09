'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { generateExecutiveInsights, type WellbeingRow } from '@/lib/executiveInsights';

type Props = {
  trends: WellbeingRow[];
  hierarchyData?: {
    data: Array<any>;
    currentLevel?: string;
  };
};

export function ExecutiveSummary({ trends, hierarchyData }: Props) {
  const insights = generateExecutiveInsights(trends, hierarchyData);

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

