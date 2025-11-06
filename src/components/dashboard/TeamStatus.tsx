'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MaterialIcon } from '@/components/ui/MaterialIcon';
import { formatPercent, SCORE_BACKGROUNDS, SCORE_COLORS, SCORE_THRESHOLDS } from './scoreTheme';

type Props = {
  responses: Array<{
    sentiment_5: number;
    workload_5: number;
    safety_5: number;
    leadership_5: number;
    clarity_5: number;
  }>;
};

export function TeamStatus({ responses }: Props) {
  const scores = responses.map(r => ((
    r.sentiment_5 * 0.25 +
    r.workload_5 * 0.25 +
    r.safety_5 * 0.2 +
    r.leadership_5 * 0.2 +
    r.clarity_5 * 0.1
  ) * 20));

  const total = responses.length || 1;

  const counts = {
    thriving: scores.filter(score => score >= SCORE_THRESHOLDS.thriving).length,
    watch: scores.filter(score => score >= SCORE_THRESHOLDS.watch && score < SCORE_THRESHOLDS.thriving).length,
    alert: scores.filter(score => score < SCORE_THRESHOLDS.watch).length,
  };

  const categories = [
    {
      key: 'thriving' as const,
      label: 'Thriving',
      icon: 'star',
      color: SCORE_COLORS.thriving,
      background: SCORE_BACKGROUNDS.thriving,
      count: counts.thriving,
    },
    {
      key: 'watch' as const,
      label: 'Ones to Watch',
      icon: 'remove_red_eye',
      color: SCORE_COLORS.watch,
      background: SCORE_BACKGROUNDS.watch,
      count: counts.watch,
    },
    {
      key: 'alert' as const,
      label: 'High Alert',
      icon: 'warning',
      color: SCORE_COLORS.alert,
      background: SCORE_BACKGROUNDS.alert,
      count: counts.alert,
    },
  ];

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-base">Overall Team Status</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {categories.map(category => (
            <div
              key={category.key}
              className="text-center p-6 rounded-lg"
              style={{ backgroundColor: category.background }}
            >
              <MaterialIcon icon={category.icon} style={{ fontSize: '56px', color: category.color, marginBottom: '8px' }} />
              <div className="text-sm font-semibold mb-1" style={{ color: '#2E2E38' }}>{category.label}</div>
              <div className="text-3xl font-bold mb-1" style={{ color: category.color }}>{category.count}</div>
              <div className="text-xs" style={{ color: '#737A8C' }}>
                {formatPercent((category.count / total) * 100)} of team
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

