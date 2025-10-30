'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

type Props = {
  currentMode: 'historical' | 'live';
  onModeChange: (mode: 'historical' | 'live') => void;
};

export function DataModeToggle({ currentMode, onModeChange }: Props) {
  return (
    <div className="flex items-center gap-2 bg-white border rounded-lg p-1">
      <Button
        type="button"
        variant={currentMode === 'historical' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onModeChange('historical')}
        className={currentMode === 'historical' ? 'font-semibold' : ''}
      >
        Historical
      </Button>
      <Button
        type="button"
        variant={currentMode === 'live' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onModeChange('live')}
        className={currentMode === 'live' ? 'font-semibold' : ''}
      >
        Live
      </Button>
    </div>
  );
}



