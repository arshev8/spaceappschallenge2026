import { useId } from 'react';
import type { Patch as PatchData } from '../app/explorer';

const glyphs: Record<PatchData['glyph'], string> = {
  pulse: 'M14 32h8l4-10 6 20 5-14 3 4h10',
  orbit: 'M32 24a8 8 0 1 0 0 16a8 8 0 1 0 0-16M10 32c0-6 10-11 22-11s22 5 22 11-10 11-22 11-22-5-22-11',
  gear: 'M32 22l3 4 5-1 1 5 4 3-3 4 1 5-5 1-3 4-3-4-5 1-1-5-4-3 3-4-1-5 5-1Z M32 29a3 3 0 1 0 0 6a3 3 0 1 0 0-6',
  clock: 'M32 18a14 14 0 1 0 0 28a14 14 0 1 0 0-28M32 24v8l6 4',
  lander: 'M24 30h16l-3-8h-10ZM26 30l-6 12M38 30l6 12M17 42h6M41 42h6M32 30v6',
  star: 'M32 16l4.5 10 10.5 1-8 7 2.5 11-9.5-6-9.5 6 2.5-11-8-7 10.5-1Z',
  probe: 'M26 28h12v10H26ZM32 28v-8M26 20a6 3 0 0 0 12 0M38 33h10M16 33h10M44 29v8M20 29v8',
  book: 'M32 22v22M18 20c6-1 10 0 14 2 4-2 8-3 14-2v22c-6-1-10 0-14 2-4-2-8-3-14-2Z',
  crown: 'M18 40l3-16 7 8 4-12 4 12 7-8 3 16Z',
};

/** An embroidered-style mission patch. Unearned patches render as a stitched outline. */
export function Patch({ patch, earned, size = 88 }: { patch: PatchData; earned: boolean; size?: number }) {
  const uid = useId().replace(/:/g, '');
  return <svg className={`patch ${earned ? 'is-earned' : ''}`} width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
    <defs>
      <radialGradient id={`${uid}-g`} cx="35%" cy="30%" r="80%"><stop offset="0" stopColor="#1f2c4d" /><stop offset="1" stopColor="#0c1326" /></radialGradient>
    </defs>
    <circle cx="32" cy="32" r="30" fill={earned ? patch.color : 'none'} opacity={earned ? 1 : .5} stroke={earned ? 'none' : '#aab8d4'} strokeDasharray={earned ? undefined : '2 3'} />
    <circle cx="32" cy="32" r="25.5" fill={earned ? `url(#${uid}-g)` : 'none'} />
    {earned && <circle cx="32" cy="32" r="27.8" fill="none" stroke="#070b18" strokeOpacity=".35" strokeDasharray="1.2 1.6" />}
    <path d={glyphs[patch.glyph]} fill="none" stroke={earned ? patch.color : '#aab8d4'} strokeOpacity={earned ? 1 : .55} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>;
}
