'use client';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';

type Slice = { label: string; value: number; color: string };

export function OverviewDonut({ data }:{ data: Slice[] }){
  const total = data.reduce((a,b)=>a+b.value,0) || 1;
  const pct = (v:number)=> Math.round((v/total)*100);
  return (
    <div style={{height:220}} className="flex items-center gap-6">
      <div className="w-[160px] h-[160px]">
        <PieChart width={160} height={160}>
          <Pie data={data} innerRadius={50} outerRadius={78} dataKey="value">
            {data.map((s, i)=>(<Cell key={i} fill={s.color}/>))}
          </Pie>
          <Tooltip/>
        </PieChart>
      </div>
      <div className="space-y-2">
        {data.map((s,i)=> (
          <div key={i} className="flex items-center gap-2 text-sm">
            <span className="inline-block w-3 h-3 rounded-full" style={{background:s.color}}/>
            <span className="text-[var(--text-primary)] mr-2">{s.label}</span>
            <span className="text-[var(--text-muted)]">{pct(s.value)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}


