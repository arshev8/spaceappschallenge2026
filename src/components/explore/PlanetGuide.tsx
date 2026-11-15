import { forwardRef, type CSSProperties } from 'react';
import { useShell } from '../../app/l10n';
import { PLANETS, VOYAGER, pick, type PlanetId } from '../../app/solar';
import { Icon } from '../Icon';

/**
 * Text alternative to the 3D Solar System: every world with its facts and missions,
 * readable without WebGL, a pointer or any motion. When the 3D scene is available,
 * each entry can fly the camera there.
 */
export const PlanetGuide = forwardRef<HTMLElement, { onFly?: (id: PlanetId) => void; visited?: string[] }>(function PlanetGuide({ onFly, visited = [] }, ref) {
  const { t, locale, exhibit } = useShell();
  return <section ref={ref} className="s3-guide" aria-labelledby="s3-guide-title" tabIndex={-1}>
    <header>
      <h2 id="s3-guide-title">{t('a11y.s3.guideTitle')}</h2>
      <p>{t('a11y.s3.guideIntro')}</p>
    </header>
    <ul className="s3-guide-list">
      {PLANETS.map(p => <li key={p.id} style={{ '--hue': p.color } as CSSProperties}>
        <h3>{pick(p.name, locale)}{visited.includes(p.id) && <> <Icon name="check" size={16} /></>}</h3>
        <p className="s3-tagline">{pick(p.tagline, locale)}</p>
        <ul className="fact-list">{p.facts.map(f => <li key={f.en}>{pick(f, locale)}</li>)}</ul>
        {p.missions.length > 0 && <p className="s3-note">{t('ui.exp.missions')}: {p.missions.map(m => pick(m.name, locale)).join(', ')}</p>}
        {onFly && <button type="button" className="button button-ghost button-small" onClick={() => onFly(p.id)}>{t('a11y.s3.fly', { name: pick(p.name, locale) })}<Icon name="arrow" size={14} /></button>}
      </li>)}
      <li style={{ '--hue': '#b7a6ff' } as CSSProperties}>
        <h3>{pick(VOYAGER.name, locale)}</h3>
        <p className="s3-tagline">{exhibit('voyager').discovery}</p>
        <p>{pick(VOYAGER.note, locale)}</p>
        <a className="button button-ghost button-small" href="#/chapter/voyager">{t('ui.exp.open')}<Icon name="arrow" size={14} /></a>
      </li>
    </ul>
  </section>;
});
