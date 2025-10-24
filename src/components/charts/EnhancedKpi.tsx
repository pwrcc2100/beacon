'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

type Props = {
  heading: string;
  description: string;
  value?: number;
  delta?: number;
  responseRate?: { responded: number; total: number };
};

export function EnhancedKpi({ heading, description, value, delta, responseRate }: Props) {
  // Convert from 5-point scale to percentage (5 = 100%, 1 = 20%)
  const percentValue = typeof value === 'number' ? value * 20 : undefined;
  const percentDelta = typeof delta === 'number' ? delta * 20 : undefined;
  
  const show = typeof percentValue === 'number';
  const deltaText = typeof percentDelta === 'number' ? Math.abs(percentDelta).toFixed(1) : undefined;
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

  const responseRatePercent = responseRate 
    ? Math.round((responseRate.responded / responseRate.total) * 100)
    : undefined;

  return (
    <Card style={{ backgroundColor: bgColor, borderColor: textColor }} className="flex flex-col">
      <CardHeader className="pb-3 flex-shrink-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-h-[48px]">
            <CardTitle className="text-sm font-semibold leading-tight mb-1">{heading}</CardTitle>
            <CardDescription className="text-xs leading-tight">{description}</CardDescription>
          </div>
          <div className="h-3 w-3 rounded-full flex-shrink-0 mt-1" style={{ backgroundColor: textColor }} />
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-between">
        <div className="text-4xl font-bold mb-3" style={{ color: textColor }}>
          {show ? `${percentValue!.toFixed(0)}%` : '–'}
        </div>
        
        <div className="flex items-center gap-2 flex-wrap min-h-[24px]">
          {deltaText && (
            <Badge 
              variant={percentDelta! >= 0 ? 'default' : 'destructive'} 
              className="gap-1 text-xs"
            >
              <TrendIcon className="h-3 w-3" />
              {percentDelta! >= 0 ? '+' : ''}{percentDelta!.toFixed(1)}%
            </Badge>
          )}
          
          {responseRate && (
            <Badge variant="outline" className="text-xs">
              N = {responseRate.responded}/{responseRate.total} ({responseRatePercent}%)
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

