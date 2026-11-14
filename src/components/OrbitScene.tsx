import { useId } from 'react';
import { useT } from '../i18n';

export function OrbitScene({ className = '' }: { className?: string }) {
  const { t } = useT();
  const uid = useId().replace(/:/g, '');
  const moon = `${uid}-moon`, mars = `${uid}-mars`, earth = `${uid}-earth`, glow = `${uid}-glow`;
  return <svg className={`orbit-scene ${className}`} viewBox="0 0 800 620" fill="none" aria-hidden="true">
    <defs>
      <radialGradient id={moon} cx="28%" cy="23%" r="77%"><stop stopColor="#dbddd8" /><stop offset=".45" stopColor="#8f999e" /><stop offset=".82" stopColor="#46515e" /><stop offset="1" stopColor="#111b2a" /></radialGradient>
      <radialGradient id={mars} cx="30%" cy="27%" r="77%"><stop stopColor="#edb08b" /><stop offset=".44" stopColor="#b76d52" /><stop offset=".8" stopColor="#653932" /><stop offset="1" stopColor="#1c1c29" /></radialGradient>
      <radialGradient id={earth} cx="24%" cy="22%" r="80%"><stop stopColor="#98d6d1" /><stop offset=".45" stopColor="#3d7586" /><stop offset="1" stopColor="#0b1728" /></radialGradient>
      <radialGradient id={glow}><stop stopColor="#8ee7dd" stopOpacity=".1" /><stop offset="1" stopColor="#8ee7dd" stopOpacity="0" /></radialGradient>
      <clipPath id={`${uid}-clip`}><circle cx="552" cy="301" r="100" /></clipPath>
    </defs>
    <circle cx="433" cy="280" r="320" fill={`url(#${glow})`} />
    {Array.from({ length: 85 }, (_, i) => <circle key={i} cx={(i * 137.508 + 17) % 800} cy={(i * 71.31 + 19) % 620} r={i % 9 === 0 ? 1.7 : .85} fill={i % 7 === 0 ? '#8ee7dd' : '#e8effb'} opacity={.2 + (i % 5) * .12} />)}
    <g stroke="#aab8d4" strokeWidth=".65">
      <ellipse cx="400" cy="346" rx="342" ry="163" transform="rotate(-30 400 346)" opacity=".18" />
      <ellipse cx="405" cy="348" rx="258" ry="118" transform="rotate(-30 405 348)" opacity=".18" />
      <ellipse cx="405" cy="348" rx="181" ry="78" transform="rotate(-30 405 348)" opacity=".14" />
      <path d="M71 550 707 83" strokeDasharray="4 8" opacity=".26" />
      <path d="M131 123h15m-7-7v14m548 303h15m-7-7v14M369 77h10m-5-5v10" opacity=".5" />
    </g>
    <circle cx="108" cy="501" r="21" fill={`url(#${earth})`} stroke="#8ee7dd" strokeOpacity=".15" />
    <path d="m94 489 9 2 1 8 10 4-2 12m3-28 6 9" stroke="#c1d3c5" strokeWidth="4" opacity=".35" />
    <text x="76" y="544" className="scene-label">{t('scene.earth')}</text>
    <g className="scene-moon">
      <circle cx="269" cy="375" r="70" fill={`url(#${moon})`} stroke="#e8effb" strokeOpacity=".12" />
      <g fill="#475362" fillOpacity=".28" stroke="#e9e5dd" strokeOpacity=".1">
        <circle cx="244" cy="346" r="16" /><circle cx="271" cy="377" r="23" /><circle cx="227" cy="384" r="9" /><circle cx="280" cy="330" r="8" /><circle cx="301" cy="365" r="11" /><circle cx="251" cy="415" r="12" />
      </g>
      <path d="m265 375 11-8 6 5-11 8Z" stroke="#bdf6e9" strokeWidth="1.8" />
      <circle cx="273" cy="374" r="14" stroke="#8ee7dd" strokeOpacity=".4" /><circle cx="273" cy="374" r="22" stroke="#8ee7dd" strokeOpacity=".15" />
      <path d="m287 364 39-33h59" stroke="#8ee7dd" strokeOpacity=".5" />
      <text x="332" y="316" className="scene-label">{t('scene.moon')}</text>
      <text x="332" y="349" className="scene-caption">{t('scene.moonCaption')}</text>
    </g>
    <g className="scene-mars">
      <circle cx="552" cy="301" r="100" fill={`url(#${mars})`} stroke="#ef9876" strokeOpacity=".15" />
      <g clipPath={`url(#${uid}-clip)`} stroke="#754336" strokeOpacity=".35" strokeWidth="8">
        <path d="m470 260 51 20 30-7 50 20 53-4m-164 26 41-14 28 19 43 3 46 26m-173-1 48 12 38 28 42-2" /><path d="m501 222 21 17 45-5" stroke="#f4cab0" strokeOpacity=".15" strokeWidth="16" />
      </g>
      <circle cx="521" cy="302" r="4" fill="#ffccae" /><circle cx="574" cy="329" r="4" fill="#ffccae" />
      <path d="m579 333 41 50h84" stroke="#ef9876" strokeOpacity=".5" />
      <text x="639" y="408" className="scene-label">{t('scene.mars')}</text>
      <text x="639" y="431" className="scene-caption">{t('scene.marsCaption')}</text>
    </g>
    <g stroke="#dac699" strokeWidth="1.5" transform="translate(626 114) rotate(-24)">
      <ellipse rx="16" ry="10" /><path d="m-13 5 13-8 17 12m-17-12 11 26m-4-9 11 5 7-8-11-5Zm15 3 32 11m-39-10-16 22" /><circle cx="14" cy="19" r="3" />
    </g>
    <path d="m652 102 27-23h57" stroke="#dac699" strokeOpacity=".4" />
    <text x="622" y="58" className="scene-label scene-label-gold">{t('scene.voyager')}</text>
    <text x="622" y="155" className="scene-caption">{t('scene.voyagerCaption')}</text>
    <path d="M686 116q14 5 15 19m-10-26q23 6 24 28" stroke="#dac699" strokeOpacity=".4" />
    <text x="363" y="559" className="scene-coordinate">{t('scene.horizon')}</text>
  </svg>;
}
