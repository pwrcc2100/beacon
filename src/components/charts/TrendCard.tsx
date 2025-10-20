'use client';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

type Point = { wk: string; value: number };

export function TrendCard({ title, data, color }:{ title:string; data:Point[]; color:string }){
  const last = data[data.length - 1]?.value ?? undefined;
  const prev = data[data.length - 2]?.value ?? undefined;
  const delta = (last !== undefined && prev !== undefined) ? Number((last - prev).toFixed(2)) : undefined;
  const deltaLabel = delta !== undefined ? (delta > 0 ? `+${delta}` : `${delta}`) : '';
  const deltaColor = delta === undefined ? '#999' : delta >= 0 ? '#16a34a' : '#dc2626';
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-black/5">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm text-[var(--text-muted)]">{title}</div>
        {delta !== undefined && (
          <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: '#f3f4f6', color: deltaColor }}>
            {deltaLabel} vs last week
          </span>
        )}
      </div>
      <div style={{height:180}}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
            <XAxis dataKey="wk" tick={{ fontSize: 10 }} />
            <YAxis domain={[1,5]} ticks={[1,2,3,4,5]} tick={{ fontSize: 10 }} />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}


