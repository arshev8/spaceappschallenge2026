import { useCallback, useEffect, useRef, useState } from 'react';
import { coreMissions, type ChapterId } from './app/missions';
import { navigate, useRoute } from './app/navigation';
import { useProgress } from './app/progress';
import { usePreferences } from './app/preferences';
import ChapterHost from './app/ChapterHost';
import { BrandMark, Icon } from './components/Icon';
import Landing from './components/Landing';
import Atlas from './components/Atlas';
import Journal from './components/Journal';
import SettingsPanel, { SettingsButton } from './components/SettingsPanel';
import LanguageSwitcher from './components/LanguageSwitcher';
import { useT } from './i18n';

export default function App() {
  const route = useRoute();
  const progress = useProgress();
  const preferences = usePreferences();
  const { t, locale } = useT();
  const [notice, setNotice] = useState('');
  const [justCollected, setJustCollected] = useState<ChapterId | null>(null);
  const main = useRef<HTMLElement>(null);
  const settingsDialog = useRef<HTMLDialogElement>(null);
  const settingsButton = useRef<HTMLButtonElement>(null);
  const firstRender = useRef(true);
  const routeKey = route.page === 'chapter' ? `chapter-${route.id}` : route.page;
  const count = coreMissions.filter(mission => progress.completed.includes(mission.id)).length;

  const announce = useCallback((message: string) => {
    // Clear first so repeating the same message is still announced.
    setNotice('');
    window.setTimeout(() => setNotice(message), 30);
  }, []);

  useEffect(() => {
    const pageTitle = route.page === 'chapter' ? t(`m.${route.id}.name`) : t({
      home: 'title.home', atlas: 'title.atlas', journal: 'title.journal', 'not-found': 'title.notFound',
    }[route.page] as 'title.home');
    document.title = `${pageTitle} — ECHOES`;
  }, [route, t, locale]);

  useEffect(() => {
    if (firstRender.current) { firstRender.current = false; return; }
    main.current?.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [routeKey]);

  const openSettings = () => {
    const dialog = settingsDialog.current;
    if (!dialog || dialog.open) return;
    dialog.showModal();
  };

  return <div className="echoes-shell">
    <a className="skip-link" href="#main-content" onClick={event => { event.preventDefault(); main.current?.focus(); }}>{t('shell.skip')}</a>
    <header className="site-header">
      <a className="brand" href="#/" aria-label={t('shell.home')}><BrandMark /><span>ECHOES<small>{t('shell.tagline')}</small></span></a>
      <nav aria-label={t('shell.nav')}>
        <a href="#/atlas" className={route.page === 'atlas' || route.page === 'chapter' ? 'nav-active' : ''} aria-current={route.page === 'atlas' ? 'page' : undefined}><Icon name="compass" size={17} /><span>{t('shell.atlas')}</span></a>
        <a href="#/journal" className={route.page === 'journal' ? 'nav-active' : ''} aria-current={route.page === 'journal' ? 'page' : undefined}><Icon name="book" size={17} /><span>{t('shell.journal')}</span><span className="nav-count" aria-label={t('shell.count', { count })}>{count}/3</span></a>
      </nav>
      <div className="header-tools">
        <LanguageSwitcher announce={announce} />
        <SettingsButton onOpen={openSettings} buttonRef={settingsButton} />
      </div>
    </header>
    <main ref={main} id="main-content" tabIndex={-1}>
      <div className="page-transition" key={routeKey}>
        {route.page === 'home' && <Landing completed={progress.completed} />}
        {route.page === 'atlas' && <Atlas completed={progress.completed} />}
        {route.page === 'journal' && <Journal completed={progress.completed} saved={progress.saved} justCollected={justCollected} onHighlightShown={() => setJustCollected(null)} onReset={() => { progress.reset(); setJustCollected(null); announce(t('notice.reset')); }} />}
        {route.page === 'chapter' && <ChapterHost key={route.id} id={route.id} onBack={() => navigate('/atlas')} onComplete={() => {
          const id = route.id;
          const isNew = !progress.completed.includes(id);
          progress.complete(id);
          setJustCollected(id);
          const name = t(`m.${id}.name`);
          announce(id === 'voyager' ? t('notice.voyager') : t(isNew ? 'notice.collected' : 'notice.already', { name }));
          navigate('/journal');
        }} />}
        {route.page === 'not-found' && <section className="host-message not-found"><Icon name="compass" size={40} /><p className="eyebrow">{t('notFound.eyebrow')}</p><h1>{t('notFound.title')}</h1><p>{t('notFound.text')}</p><a className="button button-primary" href="#/atlas">{t('notFound.button')}<Icon name="arrow" /></a></section>}
      </div>
    </main>
    <p className="sr-only" role="status" aria-live="polite">{notice}</p>
    <SettingsPanel
      dialogRef={settingsDialog}
      prefs={preferences.prefs}
      saved={preferences.saved}
      onChange={preferences.update}
      onReset={preferences.reset}
      onClose={() => settingsButton.current?.focus()}
      announce={announce}
    />
    <footer className="site-footer"><div><a className="footer-wordmark" href="#/">ECHOES<span aria-hidden="true">✦</span></a><span>{t('footer.motto')}</span></div><p>{t('footer.refs')} <a href="https://science.nasa.gov/" target="_blank" rel="noreferrer">NASA <Icon name="external" size={11} /><span className="sr-only">{t('common.newTab')}</span></a><br /><span>{t('footer.credits')}</span></p></footer>
  </div>;
}
