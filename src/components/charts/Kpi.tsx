'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

type Props = {
  label: string;
  value?: number;
  delta?: number;
  color?: string;
};

export function Kpi({ label, value, delta, color = '#2B4162' }: Props) {
  // Convert from 5-point scale to percentage (5 = 100%, 1 = 20%)
  const percentValue = typeof value === 'number' ? value * 20 : undefined;
  const percentDelta = typeof delta === 'number' ? delta * 20 : undefined;
  
  const show = typeof percentValue === 'number';
  const deltaText = typeof percentDelta === 'number' ? Math.abs(percentDelta).toFixed(1) : undefined;
  const deltaVariant = typeof percentDelta === 'number' ? (percentDelta > 0 ? 'default' : percentDelta < 0 ? 'destructive' : 'secondary') : 'secondary';
  const TrendIcon = typeof percentDelta === 'number' ? (percentDelta > 0 ? TrendingUp : percentDelta < 0 ? TrendingDown : Minus) : Minus;

  // Traffic light colors based on percentage: >= 80% = teal (good), >= 60% = slate (neutral), < 60% = coral (risk)
  const getBackgroundColor = (val?: number) => {
    if (!val) return '#eeefec'; // neutral gray
    if (val >= 80) return '#f4feef'; // light teal (good)
    if (val >= 60) return '#eeefec'; // light slate (neutral)
    return '#f6f2ef'; // light coral (risk)
  };

  const getTextColor = (val?: number) => {
    if (!val) return '#5d89a9'; // slate
    if (val >= 80) return '#64afac'; // teal
    if (val >= 60) return '#5d89a9'; // slate
    return '#ea9999'; // coral
  };

  const bgColor = getBackgroundColor(percentValue);
  const textColor = getTextColor(percentValue);

  return (
    <Card style={{ backgroundColor: bgColor, borderColor: textColor }}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{label}</CardTitle>
        <div className="h-4 w-4 rounded-full" style={{ backgroundColor: textColor }} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold" style={{ color: textColor }}>{show ? `${percentValue!.toFixed(0)}%` : '–'}</div>
        {deltaText && (
          <Badge variant={deltaVariant} className="mt-2 gap-1">
            <TrendIcon className="h-3 w-3" />
            {deltaText}% vs last wk
          </Badge>
        )}
      </CardContent>
    </Card>
  );
}


