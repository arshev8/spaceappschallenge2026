import type { ChapterId } from '../app/missions';

/** Original schematic illustrations, not NASA imagery or engineering diagrams. */
export function MissionArt({ id, className = '' }: { id: ChapterId; className?: string }) {
  return <svg className={`mission-art ${className}`} viewBox="0 0 220 150" fill="none" aria-hidden="true" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round">
    {id === 'apollo11' && <>
      <path d="m35 112 115-61 43 38-115 51Z" fill="currentColor" fillOpacity=".06" />
      <path d="m45 108 101-52 34 30-101 52Z" />
      {Array.from({ length: 5 }, (_, i) => <path key={i} d={`m${55 + i * 19} ${104 - i * 10} 26 24m${-26} ${-14} 26 24`} opacity=".45" />)}
      <path d="m58 118 101-52m-90 62 101-52M78 140v7m114-58 12 11M35 112l-7 8" />
      <path d="m80 5 12 37m-5-10 5 10 4-11" strokeDasharray="4 5" opacity=".8" />
      <path d="m99 45 35-28m-11 2 11-2-3 11" strokeDasharray="4 5" />
    </>}
    {id === 'opportunity' && <>
      <path d="m36 82 76-26 77 26-76 31Z" fill="currentColor" fillOpacity=".07" /><path d="m36 82 76-26 77 26-76 31Zm19-7 77 30m-58-37 77 29m-56-36 76 29m-117 1 76-27m-57 34 76-27m-57 35 76-28" opacity=".7" />
      <path d="M115 67V24m-14 0h28v14h-28Zm14 14 11 7m-13 67v15m-55-34-5 31m108-31 6 31M54 119l56-4 57 5" />
      {[53, 110, 169].map(x => <g key={x}><ellipse cx={x} cy="126" rx="12" ry="14" fill="var(--color-bg)" /><path d={`M${x - 7} 117v16m7-20v24m7-20v16`} opacity=".5" /></g>)}
      <path d="m188 81 11 19-14 8" />
    </>}
    {id === 'insight' && <>
      <ellipse cx="49" cy="91" rx="39" ry="22" fill="currentColor" fillOpacity=".06" /><ellipse cx="169" cy="91" rx="39" ry="22" fill="currentColor" fillOpacity=".06" />
      {[49, 169].map(x => <g key={x}><path d={`m${x - 38} 91 76 0m-38-22v44m-28-37 56 30m-56 0 56-30`} opacity=".5" /><ellipse cx={x} cy="91" rx="26" ry="15" /></g>)}
      <path d="m84 80 26-12 26 12v21l-26 13-26-13Zm0 21-13 31m39-18v22m26-35 13 31M112 69V42m-6 0h12m-18 33 14-29 35-8 19 13" />
      <path d="m168 51 7 20m-20 54a14 9 0 0 1 28 0Zm14 0v8" />
    </>}
    {id === 'voyager' && <>
      <path d="m105 87 24 12 17-23-24-12Z" fill="currentColor" fillOpacity=".12" /><path d="m110 80-35-32m51 43 63 44m-47-62 42-40M84 53l-9-5-5 11" />
      <path d="M78 55C44 82 21 65 39 30c25-32 50-15 39 25Z" fill="var(--color-bg)" /><ellipse cx="58" cy="41" rx="28" ry="19" transform="rotate(-53 58 41)" />
      <path d="m38 52 20-13 19-17M58 39l27 17m100-24 16-12m-25 17 19-2m-9 91 11 11m-16-4 17 0M117 96l-23 31m-6-6 13 10" />
      <circle cx="129" cy="84" r="6" /><path d="m89 9 17-2m-9-6 1 14m70 52 17 0m-9-8v16" opacity=".5" />
    </>}
  </svg>;
}
