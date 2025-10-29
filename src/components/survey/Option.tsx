'use client';
import clsx from 'clsx';

type Variant = 'good' | 'okay' | 'attention';

export function Option({
  value3,
  label,
  variant,
  selected,
  onSelect
}: {
  value3: 1 | 2 | 3;
  label: string;
  variant: Variant;
  selected: boolean;
  onSelect: (v: 1 | 2 | 3) => void;
}) {
  const colors = {
    good: { icon: 'var(--icon-good)', bg: 'var(--bg-good)' },
    okay: { icon: 'var(--icon-okay)', bg: 'var(--bg-okay)' },
    attention: { icon: 'var(--icon-attn)', bg: 'var(--bg-attn)' }
  }[variant];

  return (
    <button
      type="button"
      onClick={() => onSelect(value3)}
      aria-pressed={selected}
      className={clsx(
        'w-full rounded-[var(--radius)] px-4 py-3 flex items-center gap-3 text-left ring-1 ring-black/5 transition-colors',
        selected && 'outline outline-2 outline-[var(--navy)] bg-white/70'
      )}
      style={{ background: selected ? 'var(--navy)' : colors.bg, color: selected ? 'white' : 'inherit' }}
    >
      <span
        className={clsx('inline-grid place-items-center rounded-full text-white', selected && 'ring-2 ring-white/80')}
        style={{ background: selected ? 'white' : colors.icon, width: 40, height: 40, color: selected ? 'var(--navy)' : 'white' }}
      >
        {variant === 'good' && '✓'}
        {variant === 'okay' && '–'}
        {variant === 'attention' && '△'}
      </span>
      <span className={clsx('font-semibold', selected ? 'text-white' : 'text-[var(--text-primary)]')}>{label}</span>
    </button>
  );
}

