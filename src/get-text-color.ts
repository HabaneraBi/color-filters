import { oklch } from 'culori';

export function textColorFromBackground(hex: string): '#000000' | '#FFFFFF' {
  const c = oklch(hex);

  if (!c) return '#000000';

  const l = c.l;

  return l > 0.6 ? '#000000' : '#FFFFFF';
}
