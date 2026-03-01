'use client';

import { useCallback } from 'react';

export type TalkingPoint = {
  label: string; // e.g. POSITION, CONCENTRATION
  lines: [string] | [string, string];
};

export type TalkingPointsStripProps = {
  points: TalkingPoint[];
  onCopy?: () => void;
};

export function TalkingPointsStrip({ points, onCopy }: TalkingPointsStripProps) {
  const handleCopy = useCallback(() => {
    const text = points
      .map((p) => `${p.label}\n${p.lines.join('\n')}`)
      .join('\n\n');
    void navigator.clipboard.writeText(text);
    onCopy?.();
  }, [points, onCopy]);

  return (
    <div>
      <div className="flex justify-end mb-1.5">
        <button
          type="button"
          onClick={handleCopy}
          className="text-xs font-medium text-bi-textMuted hover:text-bi-text px-2 py-1 rounded"
        >
          Copy talking points
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {points.map((p, i) => (
          <div
            key={i}
            className="rounded-bi-md bg-bi-surfaceCard/80 border border-bi-borderSubtle/80 p-3 shadow-bi-sm min-h-0"
          >
            <p className="text-[10px] font-semibold uppercase tracking-wider text-bi-textMuted mb-1.5">
              {p.label}
            </p>
            <p className="text-xs text-bi-text leading-snug">{p.lines[0]}</p>
            {p.lines[1] && (
              <p className="text-xs text-bi-textMuted leading-snug mt-0.5">{p.lines[1]}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
