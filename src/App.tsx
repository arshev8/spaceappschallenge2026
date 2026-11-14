import { useCallback, useEffect, useRef, useState } from 'react';
import { coreMissions, getMission, type ChapterId } from './app/missions';
import { navigate, useRoute } from './app/navigation';
import { useProgress } from './app/progress';
import { usePreferences } from './app/preferences';
import ChapterHost from './app/ChapterHost';
import { BrandMark, Icon } from './components/Icon';
import Landing from './components/Landing';
import Atlas from './components/Atlas';
import Journal from './components/Journal';
import SettingsPanel, { SettingsButton } from './components/SettingsPanel';

export default function App() {
  const route = useRoute();
  const progress = useProgress();
  const preferences = usePreferences();
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
    const pageTitle = route.page === 'chapter' ? getMission(route.id).name : {
      home: 'The Machines That Changed Our Universe', atlas: 'The Discovery Atlas', journal: 'Your Discovery Journal', 'not-found': 'Signal Not Found',
    }[route.page];
    document.title = `${pageTitle} — ECHOES`;
    if (firstRender.current) { firstRender.current = false; return; }
    main.current?.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [routeKey, route]);

  const openSettings = () => {
    const dialog = settingsDialog.current;
    if (!dialog || dialog.open) return;
    dialog.showModal();
  };

  return <div className="echoes-shell">
    <a className="skip-link" href="#main-content" onClick={event => { event.preventDefault(); main.current?.focus(); }}>Skip to content</a>
    <header className="site-header">
      <a className="brand" href="#/" aria-label="ECHOES home"><BrandMark /><span>ECHOES<small>A SPACE DISCOVERY ARCHIVE</small></span></a>
      <nav aria-label="Main navigation">
        <a href="#/atlas" className={route.page === 'atlas' || route.page === 'chapter' ? 'nav-active' : ''} aria-current={route.page === 'atlas' ? 'page' : undefined}><Icon name="compass" size={17} /><span>The atlas</span></a>
        <a href="#/journal" className={route.page === 'journal' ? 'nav-active' : ''} aria-current={route.page === 'journal' ? 'page' : undefined}><Icon name="book" size={17} /><span>Discovery journal</span><span className="nav-count" aria-label={`${count} of 3 discoveries`}>{count}/3</span></a>
      </nav>
      <SettingsButton onOpen={openSettings} buttonRef={settingsButton} />
    </header>
    <main ref={main} id="main-content" tabIndex={-1}>
      <div className="page-transition" key={routeKey}>
        {route.page === 'home' && <Landing completed={progress.completed} />}
        {route.page === 'atlas' && <Atlas completed={progress.completed} />}
        {route.page === 'journal' && <Journal completed={progress.completed} saved={progress.saved} justCollected={justCollected} onHighlightShown={() => setJustCollected(null)} onReset={() => { progress.reset(); setJustCollected(null); announce('Journal reset.'); }} />}
        {route.page === 'chapter' && <ChapterHost key={route.id} id={route.id} onBack={() => navigate('/atlas')} onComplete={() => {
          const id = route.id;
          const isNew = !progress.completed.includes(id);
          progress.complete(id);
          setJustCollected(id);
          announce(id === 'voyager' ? 'Voyager epilogue recorded in your journal.' : `${getMission(id).name} discovery ${isNew ? 'collected' : 'already in your journal'}.`);
          navigate('/journal');
        }} />}
        {route.page === 'not-found' && <section className="host-message not-found"><Icon name="compass" size={40} /><p className="eyebrow">SIGNAL NOT FOUND</p><h1>A little off course.</h1><p>This address isn’t in the archive. There are four extraordinary machines waiting on the atlas.</p><a className="button button-primary" href="#/atlas">Find your way back<Icon name="arrow" /></a></section>}
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
    <footer className="site-footer"><div><a className="footer-wordmark" href="#/">ECHOES<span aria-hidden="true">✦</span></a><span>Their signals may fade. Their discoveries never will.</span></div><p>Independent educational exhibit · Science references from <a href="https://science.nasa.gov/" target="_blank" rel="noreferrer">NASA <Icon name="external" size={11} /><span className="sr-only">(opens in a new tab)</span></a><br /><span>Original illustrations · AI-assisted code and content · Not endorsed by NASA</span></p></footer>
  </div>;
}
