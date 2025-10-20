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
  const show = typeof value === 'number';
  const deltaText = typeof delta === 'number' ? Math.abs(delta).toFixed(2) : undefined;
  const deltaVariant = typeof delta === 'number' ? (delta > 0 ? 'default' : delta < 0 ? 'destructive' : 'secondary') : 'secondary';
  const TrendIcon = typeof delta === 'number' ? (delta > 0 ? TrendingUp : delta < 0 ? TrendingDown : Minus) : Minus;
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{label}</CardTitle>
        <div className="h-4 w-4 rounded-full" style={{ backgroundColor: color }} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold" style={{ color }}>{show ? value!.toFixed(2) : '–'}</div>
        {deltaText && (
          <Badge variant={deltaVariant} className="mt-2 gap-1">
            <TrendIcon className="h-3 w-3" />
            {deltaText} vs last wk
          </Badge>
        )}
      </CardContent>
    </Card>
  );
}


