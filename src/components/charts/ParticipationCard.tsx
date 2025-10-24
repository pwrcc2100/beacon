'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MaterialIcon } from '@/components/ui/MaterialIcon';

type Props = {
  responseRate: {
    responded: number;
    total: number;
  };
};

const quotes = [
  {
    text: "The highest performing teams have one thing in common: psychological safety — the belief that you won't be punished when you make a mistake.",
    author: "Amy Edmondson"
  },
  {
    text: "Speaking up is worth the risk when the work environment is psychologically safe.",
    author: "Harvard Business Review"
  },
  {
    text: "In psychologically safe teams, team members feel accepted and respected.",
    author: "Google's Project Aristotle"
  },
  {
    text: "The most important thing for learning is psychological safety — knowing you can take risks without feeling insecure or embarrassed.",
    author: "Timothy R. Clark"
  }
];

export function ParticipationCard({ responseRate }: Props) {
  const participationPercent = responseRate.total > 0 
    ? Math.round((responseRate.responded / responseRate.total) * 100)
    : 0;

  const getColor = (percent: number) => {
    if (percent >= 70) return { bg: '#f4f4ee', text: '#64afac', icon: '#64afac', iconName: 'trending_up' }; // teal (good)
    if (percent >= 50) return { bg: '#eeefec', text: '#5d89a9', icon: '#5d89a9', iconName: 'group' }; // slate (okay)
    return { bg: '#f6f2ef', text: '#ea9999', icon: '#ea9999', iconName: 'trending_down' }; // coral (low)
  };

  const colors = getColor(participationPercent);
  
  // Rotate quotes based on current week
  const weekNumber = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000));
  const quote = quotes[weekNumber % quotes.length];

  return (
    <Card className="h-full flex flex-col" style={{ backgroundColor: colors.bg, borderColor: colors.icon, border: `2px solid ${colors.icon}` }}>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <MaterialIcon icon="group" style={{ fontSize: '20px', color: colors.icon }} />
          Response Rate
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 flex-1 flex flex-col justify-between">
        {/* Participation Stats */}
        <div className="text-center">
          <div className="text-5xl font-bold mb-1" style={{ color: colors.text }}>
            {participationPercent}%
          </div>
          <div className="text-xs text-muted-foreground">
            {responseRate.responded} of {responseRate.total} employees
          </div>
          <div className="flex items-center justify-center gap-1 mt-2 text-xs" style={{ color: colors.text }}>
            <MaterialIcon icon={colors.iconName} style={{ fontSize: '16px', color: colors.text }} />
            <span className="font-medium">
              {participationPercent >= 70 ? 'Excellent engagement' : participationPercent >= 50 ? 'Good participation' : 'Low response rate'}
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-black/10 my-3" />

        {/* Inspiring Quote */}
        <div className="space-y-2">
          <div className="text-xs font-semibold" style={{ color: '#2B4162' }}>Psychological Safety Insight</div>
          <blockquote className="text-xs italic leading-relaxed border-l-2 pl-3" style={{ borderColor: colors.icon, color: '#737A8C' }}>
            "{quote.text}"
          </blockquote>
          <div className="text-xs text-right" style={{ color: '#737A8C' }}>
            — {quote.author}
          </div>
        </div>

        {/* Call to Action */}
        {participationPercent < 50 && (
          <div className="mt-3 p-2 bg-white/50 rounded text-xs text-center">
            <strong>Action:</strong> Low response rates may indicate trust issues. Consider anonymous feedback channels.
          </div>
        )}
      </CardContent>
    </Card>
  );
}

