import type { CSSProperties, ReactNode } from 'react';
type IconName = 'arrow' | 'book' | 'compass' | 'check' | 'spark' | 'external' | 'back' | 'reset' | 'orbit' | 'clock' | 'play' | 'rocket' | 'pause' | 'contrast' | 'globe' | 'access' | 'text' | 'motion' | 'list';
export function Icon({ name, size = 20, style }: { name: IconName; size?: number; style?: CSSProperties }) {
  const paths: Record<IconName, ReactNode> = {
    arrow: <><path d="M4 12h15M13 5l7 7-7 7" /></>,
    back: <><path d="M20 12H5m6-7-7 7 7 7" /></>,
    book: <><path d="M12 5v15M3 4c4-1 6 0 9 2 3-2 5-3 9-2v15c-4-1-6 0-9 2-3-2-5-3-9-2Z" /></>,
    compass: <><circle cx="12" cy="12" r="9" /><path d="m16 8-2 6-6 2 2-6Z" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    spark: <><path d="m12 2 2.4 7.6L22 12l-7.6 2.4L12 22l-2.4-7.6L2 12l7.6-2.4Z" /></>,
    external: <><path d="M14 3h7v7M21 3l-9 9M10 3H4a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-6" /></>,
    reset: <><path d="M3 11a9 9 0 1 1 2 7M3 4v7h7" /></>,
    orbit: <><circle cx="12" cy="12" r="3.5" /><ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(-25 12 12)" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3.5 2" /></>,
    play: <><rect x="2.5" y="7" width="19" height="11" rx="5.5" /><path d="M7 10.5v4M5 12.5h4M15.5 11.5h.01M18 13.5h.01" /></>,
    rocket: <><path d="M12 2c3 2.5 4.5 6 4.5 10L14 17h-4l-2.5-5C7.5 8 9 4.5 12 2Z" /><circle cx="12" cy="9.5" r="1.8" /><path d="M10 17l-1 4 3-2 3 2-1-4" /></>,
    pause: <><path d="M9 5v14M15 5v14" /></>,
    globe: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3Z" /></>,
    access: <><circle cx="12" cy="12" r="10" /><circle cx="12" cy="6.6" r="1.5" fill="currentColor" stroke="none" /><path d="M6.5 9.4c3.6 1 7.4 1 11 0M12 10.4v4.2m0 0-2.6 4.6m2.6-4.6 2.6 4.6" /></>,
    text: <><path d="M4 7V5h10v2M9 5v14M7 19h4M14 12v-1.5h6V12M17 10.5V19M15.5 19h3" /></>,
    motion: <><circle cx="15" cy="12" r="5" /><path d="M2 9h5M3 12h4M2 15h5" /></>,
    list: <><path d="M9 6h11M9 12h11M9 18h11" /><circle cx="4.5" cy="6" r="1" /><circle cx="4.5" cy="12" r="1" /><circle cx="4.5" cy="18" r="1" /></>,
    contrast: <><circle cx="12" cy="12" r="9" /><path d="M12 3a9 9 0 0 1 0 18Z" fill="currentColor" /></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" data-icon={name} style={style}>{paths[name]}</svg>;
}
export function BrandMark() {
  return <svg viewBox="0 0 48 48" fill="none" aria-hidden="true"><circle cx="16" cy="24" r="5" className="brand-core" /><path d="M24 14a14 14 0 0 1 0 20M30 9a21 21 0 0 1 0 30M36 4a28 28 0 0 1 0 40" className="brand-waves" /></svg>;
}
