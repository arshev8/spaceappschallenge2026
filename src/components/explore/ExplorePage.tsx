import { lazy, Suspense, useLayoutEffect, useRef, useState } from 'react';
import { useT } from '../../i18n';
import { webglAvailable } from './webgl';
import { useA11y } from '../../app/a11y';
import { PlanetGuide } from './PlanetGuide';

const SolarSystem3D = lazy(() => import('./SolarSystem3D'));

/** Smallest stage height (px) before the page is allowed to scroll on very short screens. */
const MIN_STAGE = 200;

/**
 * Sizes the Explore section so the whole 3D stage fits the visible viewport below the
 * sticky header and above the mobile tab bar. Recomputed on resize, rotation, on-screen
 * keyboard / browser-chrome changes (visualViewport) and whenever the header reflows
 * (for example after a language switch).
 */
function useViewportFit() {
  const ref = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    const section = ref.current;
    if (!section) return;
    const header = document.querySelector<HTMLElement>('.site-header');
    const tabBar = document.querySelector<HTMLElement>('.main-nav');
    const fit = () => {
      const viewport = window.visualViewport?.height ?? window.innerHeight;
      const top = header ? header.getBoundingClientRect().height : 0;
      // On phones the main navigation becomes a fixed bar along the bottom edge.
      const bottom = tabBar && getComputedStyle(tabBar).position === 'fixed' ? tabBar.getBoundingClientRect().height : 0;
      section.style.setProperty('--explore-h', `${Math.max(MIN_STAGE, Math.floor(viewport - top - bottom))}px`);
    };
    fit();
    window.scrollTo({ top: 0, behavior: 'instant' });
    const ro = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(fit);
    if (header) ro?.observe(header);
    if (tabBar) ro?.observe(tabBar);
    window.addEventListener('resize', fit);
    window.addEventListener('orientationchange', fit);
    window.visualViewport?.addEventListener('resize', fit);
    return () => {
      ro?.disconnect();
      window.removeEventListener('resize', fit);
      window.removeEventListener('orientationchange', fit);
      window.visualViewport?.removeEventListener('resize', fit);
    };
  }, []);
  return ref;
}

/** Explore: the interactive 3D Solar System, sized to fill the screen. */
export default function ExplorePage() {
  const { t } = useT();
  const [supported] = useState(webglAvailable);
  const ref = useViewportFit();
  // "Reduce motion" in the accessibility panel rebuilds the scene with lighter effects (fewer stars, no antialiasing, lower resolution).
  const { reduceMotion: calm } = useA11y();
  return <section ref={ref} className="explorer explorer-fit" aria-labelledby="explorer-title">
    <header className="page-head explorer-head">
      <h1 id="explorer-title">{t('ui.title.explore')}</h1>
      <p>{t('ui.s3.lede')}</p>
    </header>
    {supported
      ? <Suspense fallback={<div className="s3"><div className="s3-stage s3-placeholder" role="status"><p className="s3-loading"><span className="loading-orbit" aria-hidden="true" />{t('ui.s3.loading')}</p></div></div>}><SolarSystem3D key={calm ? 'simple' : 'full'} simple={calm} /></Suspense>
      : <div className="s3"><div className="s3-stage s3-unsupported-wrap"><p className="s3-unsupported" role="status">{t('ui.s3.unsupported')}</p><PlanetGuide /></div></div>}
  </section>;
}
