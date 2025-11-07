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
      case 'warning': return '#E63946'; // red
      case 'attention': return '#F4A259'; // orange
      case 'positive': return '#1A936F'; // green
      default: return '#94A3B8'; // neutral
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case 'warning': return '#FDEAE7'; // light red
      case 'attention': return '#FFF4E6'; // light orange
      case 'positive': return '#E6F4EA'; // light green
      default: return '#F1F5F9'; // light neutral
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
          <div className="space-y-3">
            {/* Top Priority Insight - Prominent Callout */}
            {insights.length > 0 && (
              <div 
                className="flex items-start gap-3 p-3 rounded-lg border-2 shadow-sm"
                style={{ 
                  backgroundColor: getBgColor(insights[0].type),
                  borderColor: getIconColor(insights[0].type)
                }}
              >
                <div className="flex-shrink-0 mt-0.5" style={{ color: getIconColor(insights[0].type) }}>
                  {insights[0].icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] font-semibold uppercase tracking-wide mb-1" style={{ color: getIconColor(insights[0].type) }}>
                    Priority Insight
                  </div>
                  <p className="text-sm font-semibold text-[var(--text-primary)] leading-snug mb-1">
                    {insights[0].text}
                  </p>
                  {insights[0].recommendation && (
                    <p className="text-xs text-muted-foreground leading-snug">
                      → {insights[0].recommendation}
                    </p>
                  )}
                </div>
              </div>
            )}
            
            {/* Additional Insights */}
            {insights.length > 1 && (
              <div className="space-y-2">
                {insights.slice(1).map((insight, idx) => (
                  <div 
                    key={idx + 1} 
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
          </div>
        )}
      </CardContent>
    </Card>
  );
}

