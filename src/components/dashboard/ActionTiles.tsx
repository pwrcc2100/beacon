'use client';

import type { ActionTileData } from '@/lib/executiveLogic';

export type ActionTilesProps = {
  tiles: ActionTileData[];
  /** Stack vertically (e.g. in 2-col layout) */
  stacked?: boolean;
};

export function ActionTiles({ tiles, stacked = false }: ActionTilesProps) {
  if (tiles.length === 0) return null;

  return (
    <div
      className={
        stacked
          ? 'flex flex-col gap-3'
          : 'grid grid-cols-1 md:grid-cols-2 gap-4'
      }
    >
      {tiles.map((tile, i) => (
        <div
          key={i}
          className="rounded-bi-lg bg-bi-surfaceCard border border-bi-borderSubtle p-4 shadow-bi-sm"
        >
          <p className="font-semibold text-bi-text text-base">{tile.title}</p>
          <ul className="mt-3 space-y-1.5 text-sm text-bi-textMuted list-disc list-inside">
            <li>{tile.steps[0]}</li>
            <li>{tile.steps[1]}</li>
          </ul>
          <p className="mt-3 text-xs text-bi-textMuted">
            <span className="font-medium text-bi-text">Success cue:</span> {tile.successCue}
          </p>
          <p className="mt-1 text-xs text-bi-textSubtle">{tile.timeframe}</p>
        </div>
      ))}
    </div>
  );
}
