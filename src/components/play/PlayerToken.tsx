interface PlayerTokenProps {
  color: string;
  label: string;
  active?: boolean;
}

export function PlayerToken({ color, label, active = false }: PlayerTokenProps) {
  return (
    <span
      className={[
        'flex h-8 w-8 items-center justify-center rounded-full border-2 border-white text-xs font-bold text-white shadow-sm',
        active ? 'ring-2 ring-amber-300 ring-offset-2 ring-offset-white/40' : '',
      ].join(' ')}
      style={{ backgroundColor: color }}
    >
      {label.slice(0, 1)}
    </span>
  );
}
