'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

type Props = {
  sentiment?: number;   // Overall / Mood (25%)
  workload?: number;    // Workload / Capacity (25%)
  safety?: number;      // Psychological Safety (20%)
  leadership?: number;  // Leadership Support (20%)
  clarity?: number;     // Clarity / Direction (10%)
  prevScore?: number;
};

export function WellbeingScore({ sentiment, workload, safety, leadership, clarity, prevScore }: Props) {
  // Calculate weighted score with updated weights:
  // Sentiment 25%, Workload 25%, Safety 20%, Leadership 20%, Clarity 10%
  // Convert from 5-point scale to percentage (5 = 100%, 1 = 20%)
  const score = sentiment && workload && leadership && safety && clarity
    ? ((sentiment * 0.25) + (workload * 0.25) + (safety * 0.20) + (leadership * 0.20) + (clarity * 0.10)) * 20
    : undefined;

  const delta = score !== undefined && prevScore !== undefined ? Number((score - prevScore).toFixed(1)) : undefined;
  const TrendIcon = typeof delta === 'number' ? (delta > 0 ? TrendingUp : delta < 0 ? TrendingDown : Minus) : Minus;

  // Color logic: >= 80% = teal (good), >= 60% = slate (neutral), < 60% = coral (risk)
  const getColor = (val?: number) => {
    if (!val) return { bg: '#eeefec', text: '#5d89a9', icon: '#5d89a9' };
    if (val >= 80) return { bg: '#f4feef', text: '#64afac', icon: '#64afac' };
    if (val >= 60) return { bg: '#eeefec', text: '#5d89a9', icon: '#5d89a9' };
    return { bg: '#f6f2ef', text: '#ea9999', icon: '#ea9999' };
  };

  const colors = getColor(score);

  return (
    <Card style={{ backgroundColor: colors.bg, borderColor: colors.icon, border: `2px solid ${colors.icon}` }}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold">Overall Wellbeing Score</CardTitle>
        <div className="h-6 w-6 rounded-full" style={{ backgroundColor: colors.icon }} />
      </CardHeader>
      <CardContent>
        <div className="text-5xl font-bold mb-2" style={{ color: colors.text }}>
          {score !== undefined ? `${score.toFixed(0)}%` : '–'}
        </div>
        <div className="text-xs text-muted-foreground mb-3 space-y-1">
          <div className="font-medium">Weighting Formula:</div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-0.5">
            <div>• Sentiment: 25%</div>
            <div>• Workload: 25%</div>
            <div>• Safety: 20%</div>
            <div>• Leadership: 20%</div>
            <div>• Clarity: 10%</div>
          </div>
        </div>
        {delta !== undefined && (
          <div className="flex items-center gap-2 text-sm" style={{ color: delta >= 0 ? '#64afac' : '#ea9999' }}>
            <TrendIcon className="h-4 w-4" />
            <span className="font-medium">{Math.abs(delta).toFixed(1)}% vs last week</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
