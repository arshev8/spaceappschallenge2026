import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { record, useExplorerLog } from '../../app/explorer';
import { useShell } from '../../app/l10n';
import { useReducedMotion } from '../../app/preferences';
import { ARTIFACTS, PLANETS, VOYAGER, pick, type Artifact, type PlanetId } from '../../app/solar';
import { formatNumber } from '../../i18n';
import { HotspotImage } from '../Hotspots';
import { Icon } from '../Icon';
import { NasaImage } from '../NasaImage';
import { PlanetGuide } from './PlanetGuide';
import { SolarScene, type Selection } from './scene';
import './explore.css';

const lowPowerDevice = () => typeof window !== 'undefined' && (window.matchMedia?.('(pointer: coarse)').matches || window.innerWidth < 760 || (navigator.hardwareConcurrency ?? 8) <= 4);

/** Immersive 3D Solar System with NASA hardware markers. Rendering lives in scene.ts; this file is the UI. */
export default function SolarSystem3D({ simple = false }: { simple?: boolean }) {
  const { t, locale, exhibit } = useShell();
  const reduced = useReducedMotion();
  const log = useExplorerLog();
  const canvas = useRef<HTMLCanvasElement>(null);
  const layer = useRef<HTMLDivElement>(null);
  const scene = useRef<SolarScene | null>(null);
  const panel = useRef<HTMLElement>(null);
  const [selection, setSelection] = useState<Selection>(null);
  const [ready, setReady] = useState(false);
  const [inspect, setInspect] = useState(false);
  const [paused, setPaused] = useState(false);
  const [guide, setGuide] = useState(false);
  const guideRef = useRef<HTMLElement>(null);
  useEffect(() => { if (guide) guideRef.current?.focus({ preventScroll: true }); }, [guide]);

  const labels = useMemo(() => ({
    planets: Object.fromEntries(PLANETS.map(p => [p.id, pick(p.name, locale)])) as Record<PlanetId, string>,
    artifacts: Object.fromEntries(ARTIFACTS.map(a => [a.id, pick(a.label, locale)])),
    voyager: pick(VOYAGER.name, locale),
  }), [locale]);

  // Selection comes from the scene (clicks) or the UI; the scene is told about it here.
  const choose = (next: Selection) => {
    setSelection(next);
    setInspect(false);
    scene.current?.select(next);
    if (next?.kind === 'planet') record('visited', next.id, PLANETS.length);
    if (next) requestAnimationFrame(() => { panel.current?.scrollTo({ top: 0 }); panel.current?.focus({ preventScroll: true }); });
  };
  const chooseRef = useRef(choose);
  useEffect(() => { chooseRef.current = choose; });

  useEffect(() => {
    if (!canvas.current || !layer.current) return;
    const s = new SolarScene(canvas.current, layer.current, {
      reduced: reduced || paused, lowPower: simple || lowPowerDevice(), labels,
      onSelect: sel => chooseRef.current(sel),
      onReady: () => setReady(true),
    });
    scene.current = s;
    return () => { s.dispose(); scene.current = null; };
    // The scene is created once; later changes are pushed in by the effects below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => { scene.current?.setReduced(reduced || paused); }, [reduced, paused]);
  useEffect(() => { scene.current?.setLabels(labels); }, [labels]);
  // Keep the subject clear of the info panel: a side panel on wide screens and in landscape,
  // a bottom sheet (about half the stage) on phones held upright.
  useEffect(() => {
    const update = () => {
      const s = scene.current, c = canvas.current;
      if (!s || !c) return;
      if (!selection) { s.setInset(0, 0); return; }
      if (window.innerWidth > 860) s.setInset(420, 0);
      else if (window.innerHeight <= 520) s.setInset(Math.min(360, c.clientWidth * .55), 0);
      else s.setInset(0, Math.round(c.clientHeight * .55));
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [selection]);
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') chooseRef.current(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const planet = selection?.kind === 'planet' ? PLANETS.find(p => p.id === selection.id)! : null;
  const artifact = selection?.kind === 'artifact' ? ARTIFACTS.find(a => a.id === selection.id)! : null;
  const visited = log.visited.filter(id => PLANETS.some(p => p.id === id)).length;
  const coord = (value: number, pos: 'ui.s3.n' | 'ui.s3.e', neg: 'ui.s3.s' | 'ui.s3.w') => `${formatNumber(Math.abs(value), locale, 2)}° ${t(value >= 0 ? pos : neg)}`;

  return <div className="s3">
    <div className={`s3-stage ${ready ? 'is-ready' : ''} ${selection ? 'has-panel' : ''}`}>
      <canvas ref={canvas} className="s3-canvas" tabIndex={0} aria-label={t('ui.s3.canvas')} aria-describedby="s3-hint" />
      <div ref={layer} className="s3-labels" />
      {!ready && <p className="s3-loading" role="status"><span className="loading-orbit" aria-hidden="true" />{t('ui.s3.loading')}</p>}

      <nav className="s3-dest" aria-label={t('ui.exp.dest')} aria-describedby="s3-list-hint">
        <p id="s3-list-hint" className="sr-only">{t('a11y.s3.listHint')}</p>
        <ul onKeyDown={event => {
          // Arrow keys / Home / End move between destinations (the list is vertical on desktop, a row on phones).
          const keys = ['ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft', 'Home', 'End'];
          if (!keys.includes(event.key)) return;
          const items = [...event.currentTarget.querySelectorAll<HTMLButtonElement>('button')];
          const i = items.indexOf(document.activeElement as HTMLButtonElement);
          if (i < 0) return;
          event.preventDefault();
          const rtl = document.documentElement.dir === 'rtl';
          const forward = event.key === 'ArrowDown' || event.key === (rtl ? 'ArrowLeft' : 'ArrowRight');
          const next = event.key === 'Home' ? 0 : event.key === 'End' ? items.length - 1 : (i + (forward ? 1 : -1) + items.length) % items.length;
          items[next].focus();
          items[next].scrollIntoView?.({ block: 'nearest', inline: 'nearest' });
        }}>
          {PLANETS.map(p => <li key={p.id}><button type="button" aria-pressed={selection?.kind === 'planet' && selection.id === p.id} onClick={() => choose({ kind: 'planet', id: p.id })} style={{ '--dot': p.color } as CSSProperties}>
            <span className="dest-dot" aria-hidden="true" />{pick(p.name, locale)}{log.visited.includes(p.id) && <Icon name="check" size={13} />}
          </button></li>)}
          <li><button type="button" aria-pressed={selection?.kind === 'voyager'} onClick={() => choose({ kind: 'voyager' })} style={{ '--dot': '#b7a6ff' } as CSSProperties}><span className="dest-dot" aria-hidden="true" />{pick(VOYAGER.name, locale)}</button></li>
        </ul>
        <p className="dest-count">{t('ui.exp.visited', { n: visited, total: PLANETS.length })}</p>
      </nav>

      <div className="s3-toolbar">
        <p className="s3-scale">{t('ui.s3.scale')}</p>
        <button type="button" className="button button-ghost button-small" aria-pressed={guide} onClick={() => setGuide(g => !g)}>
          <Icon name={guide ? 'orbit' : 'list'} size={16} />{t(guide ? 'a11y.s3.hide' : 'a11y.s3.guide')}
        </button>
        {!reduced && !guide && <button type="button" className="button button-ghost button-small" aria-pressed={paused} onClick={() => setPaused(p => !p)}>
          <Icon name={paused ? 'play' : 'pause'} size={16} />{t(paused ? 'a11y.s3.play' : 'a11y.s3.pause')}
        </button>}
        <button type="button" className="button button-ghost button-small" onClick={() => choose(null)} disabled={!selection}>{t('ui.s3.reset')}</button>
      </div>
      <p className="s3-hint" id="s3-hint">{t('ui.s3.hint')}</p>
      {guide && <PlanetGuide ref={guideRef} visited={log.visited} onFly={id => { setGuide(false); choose({ kind: 'planet', id }); }} />}

      {(planet || artifact || selection?.kind === 'voyager') && <article ref={panel} tabIndex={-1} className="s3-panel" aria-labelledby="s3-panel-title" key={JSON.stringify(selection)}
        style={{ '--hue': planet?.color ?? (artifact ? '#e8b04b' : '#b7a6ff') } as CSSProperties}>
        <div className="s3-panel-top">
          {artifact && <button type="button" className="text-link" onClick={() => choose({ kind: 'planet', id: artifact.body })}><Icon name="back" size={15} />{t('ui.s3.backTo', { name: pick(PLANETS.find(p => p.id === artifact.body)!.name, locale) })}</button>}
          <button type="button" className="icon-button s3-close" onClick={() => choose(null)} aria-label={t('ui.s3.close')}>×</button>
        </div>

        {planet && <>
          <NasaImage media={planet.media} caption className="s3-photo" sizes="380px" />
          <h2 id="s3-panel-title">{pick(planet.name, locale)}</h2>
          <p className="s3-tagline">{pick(planet.tagline, locale)}</p>
          <h3>{t('ui.s3.facts')}</h3>
          <ul className="fact-list">{planet.facts.map(f => <li key={f.en}>{pick(f, locale)}</li>)}</ul>
          <h3>{t('ui.exp.missions')}</h3>
          <ul className="mission-chips">{planet.missions.map(m => <li key={m.name.en}>{m.chapter
            ? <a href={`#/chapter/${m.chapter}`}><strong>{pick(m.name, locale)}</strong><span>{pick(m.when, locale)}</span><Icon name="arrow" size={14} /></a>
            : <span className="chip-static"><strong>{pick(m.name, locale)}</strong><span>{pick(m.when, locale)}</span></span>}</li>)}</ul>
          {ARTIFACTS.some(a => a.body === planet.id) && <>
            <h3>{t('ui.s3.artifacts')}</h3>
            <ul className="s3-artifact-list">{ARTIFACTS.filter(a => a.body === planet.id).map(a => <li key={a.id}>
              <button type="button" onClick={() => choose({ kind: 'artifact', id: a.id })}>
                <span className="s3-pin" aria-hidden="true" /><strong>{pick(a.name, locale)}</strong><span>{a.year} · {pick(a.site, locale)}</span>
              </button></li>)}</ul>
          </>}
          {planet.hardware && <><h3>{t('ui.s3.hardware')}</h3><ul className="fact-list">{planet.hardware.map(h => <li key={h.en}>{pick(h, locale)}</li>)}</ul></>}
          {planet.textureNote && <p className="s3-note">{pick(planet.textureNote, locale)}</p>}
          <a className="source-link" href={planet.source.url} target="_blank" rel="noreferrer">NASA Science · {pick(planet.name, locale)}<Icon name="external" size={12} /></a>
        </>}

        {artifact && <ArtifactView artifact={artifact} inspect={inspect} setInspect={setInspect} coords={t('ui.s3.coords', { lat: coord(artifact.lat, 'ui.s3.n', 'ui.s3.s'), lon: coord(artifact.lon, 'ui.s3.e', 'ui.s3.w') })} exhibit={exhibit} />}

        {selection?.kind === 'voyager' && <>
          <NasaImage media={exhibit('voyager').hero} caption className="s3-photo" sizes="380px" />
          <p className="s3-kicker">{t('ui.s3.deepSpace')}</p>
          <h2 id="s3-panel-title">{pick(VOYAGER.name, locale)}</h2>
          <p className="s3-tagline">{exhibit('voyager').discovery}</p>
          <p className="s3-note">{pick(VOYAGER.note, locale)}</p>
          <a className="button button-primary" href="#/chapter/voyager">{t('ui.exp.open')}</a>
        </>}
      </article>}
    </div>
  </div>;
}

function ArtifactView({ artifact, inspect, setInspect, coords, exhibit }: { artifact: Artifact; inspect: boolean; setInspect: (v: boolean) => void; coords: string; exhibit: ReturnType<typeof useShell>['exhibit'] }) {
  const { t, locale } = useShell();
  const ex = artifact.chapter ? exhibit(artifact.chapter) : null;
  return <>
    <NasaImage media={artifact.media} caption className="s3-photo" sizes="380px" />
    <p className="s3-kicker">{pick(artifact.mission, locale)} · {artifact.year}</p>
    <h2 id="s3-panel-title">{pick(artifact.name, locale)}</h2>
    <p className="s3-tagline">{pick(artifact.site, locale)}</p>
    <p>{pick(artifact.about, locale)}</p>
    <p className="s3-coords">{coords}</p>
    {ex && <div className="button-row">
      <a className="button button-primary" href={`#/chapter/${ex.id}`}>{t('ui.exp.open')}</a>
      <button type="button" className="button button-ghost" aria-expanded={inspect} onClick={() => setInspect(!inspect)}>{t(inspect ? 'ui.exp.hide' : 'ui.atlas.inspect')}</button>
    </div>}
    {inspect && ex && <HotspotImage media={ex.inspect.media} hotspots={ex.inspect.hotspots} label={t('ui.exp.hardware', { name: pick(artifact.mission, locale) })} />}
    <a className="source-link" href={artifact.source} target="_blank" rel="noreferrer">{t('ui.tl.source')}<Icon name="external" size={12} /></a>
  </>;
}
