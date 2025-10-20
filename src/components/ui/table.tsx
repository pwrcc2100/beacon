'use client';
import * as React from 'react';

export function Table({ children, className }:{ children?: React.ReactNode; className?: string }){
  return <table className={["min-w-full text-sm", className].filter(Boolean).join(' ')}>{children}</table>;
}
export function THead({ children }:{ children?: React.ReactNode }){
  return <thead>{children}</thead>;
}
export function TBody({ children }:{ children?: React.ReactNode }){
  return <tbody>{children}</tbody>;
}
export function TR({ children }:{ children?: React.ReactNode }){
  return <tr className="border-t border-black/5">{children}</tr>;
}
export function TH({ children }:{ children?: React.ReactNode }){
  return <th className="py-2 pr-4 text-left text-[var(--text-muted)] font-medium">{children}</th>;
}
export function TD({ children }:{ children?: React.ReactNode }){
  return <td className="py-2 pr-4">{children}</td>;
}


