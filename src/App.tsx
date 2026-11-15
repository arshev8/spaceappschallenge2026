import { Component, lazy, Suspense, useEffect, useRef, useState, type ReactNode } from 'react';
import { coreMissions, missions } from './app/missions';
import { navigate, useRoute, type GameId, type Route } from './app/navigation';
import { useProgress } from './app/progress';
import { points, useExplorerLog } from './app/explorer';
import ChapterHost from './app/ChapterHost';
import { BrandMark, Icon } from './components/Icon';
import Landing from './components/Landing';
import Atlas from './components/Atlas';
import Journal from './components/Journal';
import { Starfield } from './components/Starfield';
import { AwardToast } from './components/AwardToast';
import LanguageSwitcher from './components/LanguageSwitcher';
import AccessibilityPanel from './components/AccessibilityPanel';
import { useT, type MessageKey } from './i18n';
import { missionText } from './app/l10n';

const Explorer = lazy(() => import('./components/explore/ExplorePage'));
const Timeline = lazy(() => import('./components/Timeline'));
const GamesHub = lazy(() => import('./games/GamesHub').then(m => ({ default: m.GamesHub })));
const GamePage = lazy(() => import('./games/GamesHub').then(m => ({ default: m.GamePage })));

/**
 * Catches failures while a page renders, most often a lazily loaded page chunk that could not
 * be fetched (dropped connection, or an old tab after a redeploy). Without it the whole shell
 * would unmount and leave a blank screen. The `.route` wrapper is keyed by route, so moving to
 * another page resets it.
 */
class RouteBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? this.props.fallback : this.props.children; }
}

const GAME_TITLES: Record<GameId, MessageKey> = { lander: 'ui.g.lander.title', probe: 'ui.g.probe.title', quiz: 'ui.g.quiz.title' };
const PAGE_TITLES = {
  home: 'title.home', atlas: 'ui.title.atlas', journal: 'title.journal',
  explore: 'ui.title.explore', timeline: 'ui.title.timeline', games: 'ui.title.games', 'not-found': 'title.notFound',
} as const satisfies Record<string, MessageKey>;

const NAV: { href: string; label: MessageKey; icon: Parameters<typeof Icon>[0]['name']; match: (r: Route) => boolean }[] = [
  { href: '#/atlas', label: 'ui.nav.missions', icon: 'rocket', match: r => r.page === 'atlas' || r.page === 'chapter' },
  { href: '#/explore', label: 'ui.nav.explore', icon: 'orbit', match: r => r.page === 'explore' },
  { href: '#/timeline', label: 'ui.nav.timeline', icon: 'clock', match: r => r.page === 'timeline' },
  { href: '#/games', label: 'ui.nav.games', icon: 'play', match: r => r.page === 'games' || r.page === 'game' },
];

export default function App() {
  const route = useRoute();
  const { t } = useT();
  const progress = useProgress();
  const log = useExplorerLog();
  const [notice, setNotice] = useState('');
  const main = useRef<HTMLElement>(null);
  const firstRender = useRef(true);
  const routeKey = route.page === 'chapter' || route.page === 'game' ? `${route.page}-${route.id}` : route.page;
  const count = coreMissions.filter(mission => progress.completed.includes(mission.id)).length;
  const epilogueDone = missions.some(mission => mission.epilogue && progress.completed.includes(mission.id));
  const total = points(log, count);
  useEffect(() => {
    const pageTitle = route.page === 'chapter' ? missionText(t, route.id).name : t(route.page === 'game' ? GAME_TITLES[route.id] : PAGE_TITLES[route.page]);
    document.title = `${pageTitle} — ECHOES`;
    if (firstRender.current) { firstRender.current = false; return; }
    main.current?.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [routeKey, route, t]);
  const journalActive = route.page === 'journal';
  return <div className="echoes-shell">
    <Starfield />
    <a className="skip-link" href="#main-content" onClick={event => { event.preventDefault(); main.current?.focus(); }}>{t('shell.skip')}</a>
    <header className="site-header">
      <a className="brand" href="#/" aria-label={t('shell.home')}><BrandMark /><span>ECHOES</span></a>
      <nav className="main-nav" aria-label={t('shell.nav')}>
        <ul>
          {NAV.map(item => <li key={item.href}><a href={item.href} className={item.match(route) ? 'nav-active' : ''} aria-current={item.match(route) && route.page !== 'chapter' && route.page !== 'game' ? 'page' : undefined}><Icon name={item.icon} size={18} /><span>{t(item.label)}</span></a></li>)}
          <li><a href="#/journal" className={`nav-journal ${journalActive ? 'nav-active' : ''}`} aria-current={journalActive ? 'page' : undefined} title={t('ui.journalHint')}><Icon name="book" size={18} /><span>{t('ui.nav.journal')}</span>
            <span className="nav-count"><span aria-hidden="true">{count}/3{epilogueDone && <span className="nav-epilogue"> ✦</span>}</span>
              <span className="sr-only">{t(epilogueDone ? 'ui.journalCountEpilogue' : 'ui.journalCount', { count, points: total })}</span></span></a></li>
        </ul>
      </nav>
      <div className="settings" role="group" aria-label={t('ui.settings')}>
        <LanguageSwitcher announce={setNotice} />
        <AccessibilityPanel announce={setNotice} />
      </div>
    </header>
    <main ref={main} id="main-content" tabIndex={-1}>
      <div className="route" key={routeKey}>
        <RouteBoundary fallback={<div className="host-message route-failed" role="alert">
          <Icon name="compass" size={36} /><h1>{t('ui.route.failedTitle')}</h1><p>{t('ui.route.failedText')}</p>
          <div className="button-row"><button type="button" className="button button-primary" onClick={() => window.location.reload()}>{t('ui.route.reload')} <Icon name="reset" /></button><a className="button button-ghost" href="#/">{t('shell.home')}</a></div>
        </div>}>
        <Suspense fallback={<div className="host-message route-loading" role="status"><span className="loading-orbit" aria-hidden="true" /><p>{t('ui.loading')}</p></div>}>
          {route.page === 'home' && <Landing completed={progress.completed} />}
          {route.page === 'atlas' && <Atlas completed={progress.completed} />}
          {route.page === 'explore' && <Explorer />}
          {route.page === 'timeline' && <Timeline />}
          {route.page === 'games' && <GamesHub />}
          {route.page === 'game' && <GamePage id={route.id} />}
          {route.page === 'journal' && <Journal completed={progress.completed} saved={progress.saved} onReset={() => { progress.reset(); setNotice(t('notice.reset')); }} />}
          {route.page === 'chapter' && <ChapterHost key={route.id} id={route.id} onBack={() => navigate('/atlas')} onComplete={() => { progress.complete(route.id); setNotice(route.id === 'voyager' ? t('notice.voyager') : t('notice.collected', { name: missionText(t, route.id).name })); navigate('/journal'); }} />}
          {route.page === 'not-found' && <section className="host-message not-found"><BrandMark /><h1>{t('notFound.title')}</h1><p>{t('ui.notFound.text')}</p><a className="button button-primary" href="#/atlas">{t('notFound.button')}</a></section>}
        </Suspense>
        </RouteBoundary>
      </div>
    </main>
    <p className="sr-only" role="status">{notice}</p>
    <AwardToast />
    <footer className="site-footer">
      <div><a className="footer-wordmark" href="#/">ECHOES</a><span>{t('footer.motto')}</span></div>
      <p>{t('ui.footer.pre')} <a href="https://science.nasa.gov/" target="_blank" rel="noreferrer">NASA</a> {t('ui.footer.and')} <a href="https://images.nasa.gov/" target="_blank" rel="noreferrer">{t('ui.footer.library')}</a>. {t('ui.footer.post')}</p>
    </footer>
  </div>;
}
