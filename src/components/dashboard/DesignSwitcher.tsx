'use client';

/**
 * Design Switcher Component
 * Allows switching between different dashboard design options
 */

import { useSearchParams, usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export function DesignSwitcher() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const currentDesign = searchParams.get('design') || 'current';

  const designs = [
    { id: 'current', label: 'Current Design', description: 'Original layout' },
    { id: 'option-a', label: 'Option A: Modern', description: 'Card-based with icons' },
    { id: 'option-b', label: 'Option B: Executive', description: 'Hero gauge focus' },
    { id: 'option-c', label: 'Option C: Professional', description: 'Data-dense 3-column' },
  ];

  const buildUrl = (designId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (designId === 'current') {
      params.delete('design');
    } else {
      params.set('design', designId);
    }
    return `${pathname}?${params.toString()}`;
  };

  return (
    <div className="space-y-2">
      <div className="text-xs uppercase tracking-wide text-[var(--text-muted)] mb-2">
        Design Preview
      </div>
      {designs.map((design) => (
        <Link
          key={design.id}
          href={buildUrl(design.id)}
          className={cn(
            "block px-3 py-2 rounded text-sm transition-colors",
            currentDesign === design.id
              ? "bg-blue-100 text-blue-900 font-medium"
              : "hover:bg-black/5 text-gray-700"
          )}
        >
          <div className="font-medium">{design.label}</div>
          <div className="text-xs text-gray-500">{design.description}</div>
        </Link>
      ))}
    </div>
  );
}

