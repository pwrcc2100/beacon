'use client';
import { Badge } from '@/components/ui/badge';

type Props = {
  label: string;
  value?: number;
  delta?: number;
  color?: string;
};

export function Kpi({ label, value, delta, color = '#2B4162' }: Props) {
  const show = typeof value === 'number';
  const deltaText = typeof delta === 'number' ? (delta > 0 ? `+${delta.toFixed(2)}` : `${delta.toFixed(2)}`) : undefined;
  const deltaColor = typeof delta === 'number' ? (delta >= 0 ? '#16a34a' : '#dc2626') : '#6b7280';
  return (
    <div className="rounded-xl bg-white shadow-sm border border-black/5 p-4" style={{ borderLeftColor: color, borderLeftWidth: 4 }}>
      <div className="text-[12px] text-[var(--text-muted)] mb-1">{label}</div>
      <div className="flex items-baseline gap-2">
        <div className="text-3xl font-semibold" style={{ color }}>{show ? value!.toFixed(2) : '–'}</div>
        {deltaText && (<Badge variant="secondary" style={{ color: deltaColor }}>{deltaText} vs last wk</Badge>)}
      </div>
    </div>
  );
}


