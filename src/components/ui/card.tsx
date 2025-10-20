'use client';
import * as React from 'react';

export function Card({ className, children }: { className?: string; children?: React.ReactNode }){
  return <div className={["rounded-xl border border-black/5 bg-white shadow-sm", className].filter(Boolean).join(' ')}>{children}</div>;
}

export function CardHeader({ className, children }:{ className?: string; children?: React.ReactNode }){
  return <div className={["p-4", className].filter(Boolean).join(' ')}>{children}</div>;
}

export function CardTitle({ className, children }:{ className?: string; children?: React.ReactNode }){
  return <div className={["text-sm font-medium text-[var(--text-muted)]", className].filter(Boolean).join(' ')}>{children}</div>;
}

export function CardContent({ className, children }:{ className?: string; children?: React.ReactNode }){
  return <div className={["p-4 pt-0", className].filter(Boolean).join(' ')}>{children}</div>;
}


