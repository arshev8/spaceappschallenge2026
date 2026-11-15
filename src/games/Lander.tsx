import { useCallback, useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent, type MouseEvent as ReactMouseEvent, type PointerEvent as ReactPointerEvent } from 'react';
import { award, recordBest } from '../app/explorer';
import { useReducedMotion } from '../app/preferences';
import { useA11y } from '../app/a11y';
import { formatNumber, useT, type MessageKey, type Vars } from '../i18n';
import { LANDER, flameFrame, spriteImage } from './sprites';

type World = 'moon' | 'mars';
const WORLDS: Record<World, { g: number; thrust: number; side: number; fuel: number; burn: number; pad: number; maxVy: number; maxVx: number; vx0: number; ground: string; rim: string; sky: string }> = {
  moon: { g: 1.62, thrust: 3.6, side: 1.4, fuel: 220, burn: 9, pad: 64, maxVy: 2.5, maxVx: 1.5, vx0: 5, ground: '#4a4d55', rim: '#9b9da3', sky: '#070b18' },
  mars: { g: 3.71, thrust: 7.6, side: 2, fuel: 270, burn: 11, pad: 46, maxVy: 2.2, maxVx: 1.2, vx0: 8, ground: '#7a3f2c', rim: '#d27a58', sky: '#1d1220' },
};
const W = 400, H = 260, LANDER_HALF = 10;
/** Relaxed games (accessibility panel): more fuel, a wider pad and more forgiving touchdown limits. */
const worldConfig = (w: World, relaxed: boolean) => {
  const c = WORLDS[w];
  return relaxed ? { ...c, fuel: Math.round(c.fuel * 1.4), pad: Math.round(c.pad * 1.3), maxVy: c.maxVy * 1.5, maxVx: c.maxVx * 1.5 } : c;
};

type Phase = 'ready' | 'flying' | 'paused' | 'landed' | 'crashed';
type Result = { score: number; title: MessageKey; detail: MessageKey; vars: Vars; fuel: number; vy: number; offset: number };
type Particle = { x: number; y: number; vx: number; vy: number; life: number; color: string };

function makeTerrain(seed: number, padWidth: number) {
  let s = seed;
  const rand = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
  // The pad lands 110–190 m along the track. With the starting drift and fuel above, every pad can be
  // reached by hovering across without speeding up; farther pads used to need more fuel than the tank held.
  const padStart = 110 + rand() * 80;
  const points: [number, number][] = [];
  const padY = 22 + rand() * 30;
  for (let x = 0; x <= W; x += 16) {
    if (x > padStart - 16 && x < padStart + padWidth + 16) continue;
    points.push([x, 12 + rand() * 62]);
  }
  points.push([padStart, padY], [padStart + padWidth, padY]);
  points.sort((a, b) => a[0] - b[0]);
  return { points, pad: { x1: padStart, x2: padStart + padWidth, y: padY } };
}
function groundAt(points: [number, number][], x: number) {
  for (let i = 1; i < points.length; i++) {
    const [x1, y1] = points[i - 1], [x2, y2] = points[i];
    if (x >= x1 && x <= x2) return y1 + (y2 - y1) * ((x - x1) / (x2 - x1 || 1));
  }
  return points[points.length - 1][1];
}

const coarseQuery = '(pointer: coarse)';
/** Touch screens get touch instructions instead of keyboard keys. */
function useCoarsePointer() {
  const [coarse, setCoarse] = useState(() => typeof window !== 'undefined' && !!window.matchMedia?.(coarseQuery).matches);
  useEffect(() => {
    const m = window.matchMedia?.(coarseQuery);
    if (!m) return;
    const on = () => setCoarse(m.matches);
    m.addEventListener?.('change', on);
    return () => m.removeEventListener?.('change', on);
  }, []);
  return coarse;
}

export default function Lander() {
  const reduced = useReducedMotion();
  const coarse = useCoarsePointer();
  const { t, locale } = useT();
  const num = useCallback((v: number) => formatNumber(v, locale, 1), [locale]);
  // The game loop reads these through refs so changing language never restarts a flight.
  const lang = useRef({ t, num });
  useEffect(() => { lang.current = { t, num }; }, [t, num]);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [world, setWorld] = useState<World>('moon');
  const [phase, setPhase] = useState<Phase>('ready');
  const { relaxedGames: relaxed } = useA11y();
  const [assist, setAssist] = useState(relaxed);
  // Turning relaxed games on or off in the panel also switches slow motion.
  const [relaxedSeen, setRelaxedSeen] = useState(relaxed);
  if (relaxedSeen !== relaxed) { setRelaxedSeen(relaxed); setAssist(relaxed); }
  const [hud, setHud] = useState({ alt: 0, vy: 0, vx: 0, fuel: 100 });
  const [result, setResult] = useState<Result | null>(null);
  const [callout, setCallout] = useState('');
  const input = useRef({ up: false, left: false, right: false });
  const state = useRef({
    x: 50, y: 230, vx: 5, vy: 0, fuel: 220, seed: 1, t: 0,
    terrain: makeTerrain(1, 52), particles: [] as Particle[], called: new Set<number>(), shake: 0,
  });
  const phaseRef = useRef<Phase>('ready');
  useEffect(() => { phaseRef.current = phase; }, [phase]);

  const reset = useCallback((w: World = world) => {
    const cfg = worldConfig(w, relaxed);
    const seed = Math.floor(Math.random() * 100000) + 1;
    state.current = { x: 40, y: 205, vx: cfg.vx0, vy: 0, fuel: cfg.fuel, seed, t: 0, terrain: makeTerrain(seed, cfg.pad), particles: [], called: new Set(), shake: 0 };
    setResult(null); setCallout('');
    setHud({ alt: Math.round(205 - groundAt(state.current.terrain.points, 40)), vy: 0, vx: cfg.vx0, fuel: 100 });
  }, [world, relaxed]);

  const start = () => { reset(); phaseRef.current = 'flying'; setPhase('flying'); setCallout(t(`ui.l.${world}.start` as MessageKey)); canvas.current?.focus({ preventScroll: true }); };

  // Keyboard controls (active only on this page).
  useEffect(() => {
    const keys = (down: boolean) => (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'SELECT') return;
      const k = event.key;
      if (['ArrowUp', ' ', 'w', 'W'].includes(k)) { input.current.up = down; if (phaseRef.current === 'flying') event.preventDefault(); }
      if (['ArrowLeft', 'a', 'A'].includes(k)) { input.current.left = down; if (phaseRef.current === 'flying') event.preventDefault(); }
      if (['ArrowRight', 'd', 'D'].includes(k)) { input.current.right = down; if (phaseRef.current === 'flying') event.preventDefault(); }
      if (down && (k === 'p' || k === 'P' || k === 'Escape')) setPhase(p => p === 'flying' ? 'paused' : p === 'paused' ? 'flying' : p);
    };
    const onDown = keys(true), onUp = keys(false);
    const clear = () => { input.current = { up: false, left: false, right: false }; };
    window.addEventListener('keydown', onDown);
    window.addEventListener('keyup', onUp);
    window.addEventListener('blur', clear);
    return () => { window.removeEventListener('keydown', onDown); window.removeEventListener('keyup', onUp); window.removeEventListener('blur', clear); };
  }, []);

  // Pause when the tab is hidden.
  useEffect(() => {
    const onVis = () => { if (document.visibilityState === 'hidden') setPhase(p => p === 'flying' ? 'paused' : p); };
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, []);

  // Simulation + rendering loop.
  useEffect(() => {
    const el = canvas.current;
    const ctx = el?.getContext('2d');
    if (!el || !ctx) return;
    const cfg = worldConfig(world, relaxed);
    let raf = 0, last = performance.now(), acc = 0, hudTimer = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const fit = () => {
      const rect = el.getBoundingClientRect();
      el.width = Math.round(rect.width * dpr); el.height = Math.round(rect.width * (H / W) * dpr);
    };
    fit();
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(fit) : null;
    ro?.observe(el);
    const stars = Array.from({ length: 70 }, (_, i) => [(i * 97.3) % W, 90 + ((i * 53.7) % (H - 90)), (i % 3) * .3 + .4]);

    const finish = (landed: boolean, detail: MessageKey, title: MessageKey, vars: Vars = {}) => {
      const s = state.current;
      const pad = s.terrain.pad;
      const mid = (pad.x1 + pad.x2) / 2;
      const offset = Math.abs(s.x - mid);
      let score = 0;
      if (landed) {
        const fuelPct = s.fuel / cfg.fuel;
        score = Math.round(400 + fuelPct * 300 + Math.max(0, 1 - offset / (cfg.pad / 2)) * 200 + Math.max(0, 1 - Math.abs(s.vy) / cfg.maxVy) * 100);
        award('soft-landing');
        if (score >= 800) award('ace-pilot');
        recordBest('lander', score);
      }
      const burst = reduced ? 10 : landed ? 24 : 70;
      for (let i = 0; i < burst; i++) {
        const a = Math.random() * Math.PI * (landed ? 1 : 2);
        const sp = (landed ? 6 : 18) * Math.random();
        s.particles.push({ x: s.x, y: s.y, vx: Math.cos(a) * sp, vy: Math.abs(Math.sin(a)) * sp * (landed ? .4 : 1), life: 1, color: landed ? cfg.rim : i % 2 ? '#ffd27a' : '#ef9876' });
      }
      if (!landed && !reduced) s.shake = 1;
      phaseRef.current = landed ? 'landed' : 'crashed';
      setResult({ score, title, detail, vars, fuel: Math.round(s.fuel / cfg.fuel * 100), vy: Math.abs(s.vy), offset: Math.round(offset) });
      setPhase(landed ? 'landed' : 'crashed');
      const tr = lang.current.t;
      setCallout(`${tr(title)} ${tr(detail, vars)}${landed ? ` ${tr('ui.l.scoreCallout', { score })}` : ''}`);
    };

    const step = (dt: number) => {
      const s = state.current;
      const inp = input.current;
      let ax = 0, ay = -cfg.g;
      const burning = inp.up && s.fuel > 0;
      if (burning) { ay += cfg.thrust; s.fuel = Math.max(0, s.fuel - cfg.burn * dt); }
      if (s.fuel > 0 && inp.left) { ax -= cfg.side; s.fuel = Math.max(0, s.fuel - 3 * dt); }
      if (s.fuel > 0 && inp.right) { ax += cfg.side; s.fuel = Math.max(0, s.fuel - 3 * dt); }
      s.vx += ax * dt; s.vy += ay * dt;
      s.x += s.vx * dt; s.y += s.vy * dt;
      s.t += dt;
      if (s.x < LANDER_HALF) { s.x = LANDER_HALF; s.vx = Math.abs(s.vx) * .3; }
      if (s.x > W - LANDER_HALF) { s.x = W - LANDER_HALF; s.vx = -Math.abs(s.vx) * .3; }
      if (s.y > H + 40) s.vy = Math.min(s.vy, 0);
      if (burning && !reduced && Math.random() < .7) s.particles.push({ x: s.x + (Math.random() - .5) * 3, y: s.y - 1, vx: (Math.random() - .5) * 4, vy: -14 - Math.random() * 8, life: .6, color: Math.random() < .5 ? '#ffd27a' : '#ef9876' });
      const ground = Math.max(groundAt(s.terrain.points, s.x - LANDER_HALF), groundAt(s.terrain.points, s.x + LANDER_HALF), groundAt(s.terrain.points, s.x));
      const alt = s.y - ground;
      for (const mark of [100, 50, 20]) if (alt < mark && !s.called.has(mark)) { s.called.add(mark); setCallout(lang.current.t('ui.l.callout', { mark, v: lang.current.num(Math.abs(s.vy)) })); }
      if (s.fuel <= 0 && !s.called.has(-1)) { s.called.add(-1); setCallout(lang.current.t('ui.l.noFuel')); }
      if (alt <= 0) {
        s.y = ground;
        const pad = s.terrain.pad;
        const onPad = s.x - LANDER_HALF >= pad.x1 - 1 && s.x + LANDER_HALF <= pad.x2 + 1;
        const softV = Math.abs(s.vy) <= cfg.maxVy, softH = Math.abs(s.vx) <= cfg.maxVx;
        const { num: n } = lang.current;
        if (onPad && softV && softH) finish(true, 'ui.l.winText', 'ui.l.winTitle', { v: n(Math.abs(s.vy)) });
        else if (!onPad && softV && softH) finish(false, 'ui.l.missText', 'ui.l.missTitle');
        else if (!softH && softV) finish(false, 'ui.l.sideText', 'ui.l.sideTitle', { v: n(Math.abs(s.vx)) });
        else finish(false, 'ui.l.crashText', 'ui.l.crashTitle', { v: n(Math.abs(s.vy)), max: n(cfg.maxVy) });
        s.vx = 0; s.vy = 0;
      }
    };

    // Static backdrop layers, built once per world: a distant ridge line and a few craters.
    const ridge: [number, number][] = [];
    { let seed = world === 'moon' ? 3 : 9; const rand = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
      for (let x = -10, y = 70; x <= W + 10; x += 8) { y = Math.max(55, Math.min(105, y + (rand() - .5) * 14)); ridge.push([x, y]); } }
    const craters = Array.from({ length: world === 'moon' ? 9 : 5 }, (_, i) => [(i * 47.3 + 13) % W, 4 + (i * 13.7) % 22, 3 + (i % 3) * 2.2]);
    const lander = spriteImage(LANDER);
    const flames = [0, 1, 2].map(i => spriteImage(flameFrame(i)));

    const draw = () => {
      const s = state.current;
      const k = el.width / W;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      const sky = ctx.createLinearGradient(0, 0, 0, el.height);
      sky.addColorStop(0, cfg.sky); sky.addColorStop(1, world === 'mars' ? '#4a2a2a' : '#0c1428');
      ctx.fillStyle = sky; ctx.fillRect(0, 0, el.width, el.height);
      const shake = s.shake > 0 ? (Math.random() - .5) * 6 * s.shake * k : 0;
      ctx.setTransform(k, 0, 0, -k, shake, el.height + shake);
      for (const [sx, sy, r] of stars) { ctx.globalAlpha = world === 'mars' ? .25 : .6; ctx.fillStyle = '#f4f7ff'; ctx.fillRect(sx, sy, r, r); }
      ctx.globalAlpha = 1;
      if (world === 'moon') {
        // Earth hanging in the lunar sky, lit from the left.
        const g = ctx.createRadialGradient(340, 228, 1, 345, 225, 12);
        g.addColorStop(0, '#9fd0ff'); g.addColorStop(.6, '#3f7fd0'); g.addColorStop(1, '#0d2244');
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(345, 225, 12, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,.55)'; ctx.fillRect(337, 226, 8, 1.2); ctx.fillRect(342, 221, 7, 1);
      } else {
        const sun = ctx.createRadialGradient(330, 220, 0, 330, 220, 22);
        sun.addColorStop(0, 'rgba(255,240,215,.95)'); sun.addColorStop(.25, 'rgba(255,220,180,.5)'); sun.addColorStop(1, 'rgba(255,200,150,0)');
        ctx.fillStyle = sun; ctx.beginPath(); ctx.arc(330, 220, 22, 0, Math.PI * 2); ctx.fill();
      }
      // Distant ridge
      ctx.beginPath(); ctx.moveTo(0, 0);
      for (const [x, y] of ridge) ctx.lineTo(x, y);
      ctx.lineTo(W, 0); ctx.closePath();
      ctx.fillStyle = world === 'moon' ? '#23262e' : '#52281d'; ctx.fill();
      // Terrain with a lit rim and darker depths
      const pts = s.terrain.points;
      ctx.beginPath(); ctx.moveTo(0, 0);
      for (const [x, y] of pts) ctx.lineTo(x, y);
      ctx.lineTo(W, 0); ctx.closePath();
      const ground = ctx.createLinearGradient(0, 80, 0, 0);
      ground.addColorStop(0, cfg.ground); ground.addColorStop(1, world === 'moon' ? '#24262c' : '#3b1d14');
      ctx.fillStyle = ground; ctx.fill();
      ctx.save(); ctx.clip();
      for (const [cx, cy, r] of craters) {
        ctx.fillStyle = 'rgba(0,0,0,.22)'; ctx.beginPath(); ctx.ellipse(cx, cy, r * 1.6, r * .55, 0, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = 'rgba(255,255,255,.08)'; ctx.lineWidth = .5; ctx.beginPath(); ctx.ellipse(cx, cy - .3, r * 1.6, r * .55, 0, Math.PI, Math.PI * 2); ctx.stroke();
      }
      ctx.restore();
      ctx.strokeStyle = cfg.rim; ctx.lineWidth = .9; ctx.beginPath();
      pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.stroke();
      // Pad: gold deck with beacon lights
      const pad = s.terrain.pad;
      ctx.fillStyle = '#a8741f'; ctx.fillRect(pad.x1, pad.y - 2.2, pad.x2 - pad.x1, 2.2);
      ctx.fillStyle = '#e8b04b'; ctx.fillRect(pad.x1, pad.y - 1, pad.x2 - pad.x1, 1.4);
      for (let x = pad.x1 + 4; x < pad.x2 - 2; x += 6) { ctx.fillStyle = 'rgba(11,18,38,.6)'; ctx.fillRect(x, pad.y - .9, 2.5, .8); }
      const blink = Math.floor(performance.now() / 500) % 2 === 0 || reduced;
      for (const bx of [pad.x1, pad.x2]) {
        ctx.fillStyle = '#5c6a86'; ctx.fillRect(bx - .5, pad.y, 1, 4);
        if (blink) { const glow = ctx.createRadialGradient(bx, pad.y + 4.5, 0, bx, pad.y + 4.5, 4); glow.addColorStop(0, 'rgba(142,231,221,.9)'); glow.addColorStop(1, 'rgba(142,231,221,0)'); ctx.fillStyle = glow; ctx.fillRect(bx - 4, pad.y + .5, 8, 8); }
        ctx.fillStyle = blink ? '#c9fff8' : '#2f5f5a'; ctx.beginPath(); ctx.arc(bx, pad.y + 4.5, 1, 0, Math.PI * 2); ctx.fill();
      }
      // Approach guide
      if (phaseRef.current === 'flying') {
        ctx.setLineDash([2, 3]); ctx.strokeStyle = 'rgba(142,231,221,.25)'; ctx.lineWidth = .6;
        ctx.beginPath(); ctx.moveTo((pad.x1 + pad.x2) / 2, pad.y); ctx.lineTo((pad.x1 + pad.x2) / 2, H); ctx.stroke(); ctx.setLineDash([]);
      }
      // Particles
      for (const p of s.particles) { ctx.globalAlpha = Math.max(0, p.life); ctx.fillStyle = p.color; ctx.fillRect(p.x - .6, p.y - .6, 1.4, 1.4); }
      ctx.globalAlpha = 1;
      // Lander sprite (drawn y-down from its feet) and exhaust frames
      if (phaseRef.current !== 'crashed' && lander.complete) {
        ctx.save(); ctx.translate(s.x, s.y); ctx.scale(1, -1);
        const flying = phaseRef.current === 'flying' && s.fuel > 0;
        if (flying && input.current.up) {
          const frame = flames[reduced ? 0 : Math.floor(performance.now() / 70) % 3];
          if (frame.complete) ctx.drawImage(frame, -4.1, -2.7, 8.2, 11);
        }
        ctx.drawImage(lander, -11, -20, 22, 22);
        if (flying) {
          ctx.fillStyle = 'rgba(142,231,221,.9)';
          if (input.current.left) ctx.fillRect(6.4, -13.2, 4, 1.2);
          if (input.current.right) ctx.fillRect(-10.4, -13.2, 4, 1.2);
        }
        ctx.restore();
      }
    };

    const loop = (t: number) => {
      raf = requestAnimationFrame(loop);
      const dt = Math.min(.1, (t - last) / 1000); last = t;
      const s = state.current;
      const scale = assist ? .5 : 1;
      if (phaseRef.current === 'flying') {
        acc += dt * scale;
        while (acc >= 1 / 120 && phaseRef.current === 'flying') { step(1 / 120); acc -= 1 / 120; }
        hudTimer += dt;
        if (hudTimer > .1) {
          hudTimer = 0;
          const ground = groundAt(s.terrain.points, s.x);
          setHud({ alt: Math.max(0, Math.round(s.y - ground)), vy: s.vy, vx: s.vx, fuel: Math.round(s.fuel / cfg.fuel * 100) });
        }
      }
      for (const p of s.particles) { p.x += p.vx * dt; p.y += p.vy * dt; p.vy -= cfg.g * dt * 2; p.life -= dt * 1.2; }
      s.particles = s.particles.filter(p => p.life > 0 && p.y > -5);
      s.shake = Math.max(0, s.shake - dt * 2);
      draw();
    };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); ro?.disconnect(); };
  }, [world, assist, reduced, relaxed]);

  const hold = (key: 'up' | 'left' | 'right') => ({
    onPointerDown: (event: ReactPointerEvent<HTMLButtonElement>) => { event.preventDefault(); event.currentTarget.setPointerCapture?.(event.pointerId); input.current[key] = true; },
    onPointerUp: () => { input.current[key] = false; },
    onPointerCancel: () => { input.current[key] = false; },
    onLostPointerCapture: () => { input.current[key] = false; },
    onKeyDown: (event: ReactKeyboardEvent) => { if (event.key === 'Enter') input.current[key] = true; },
    onKeyUp: (event: ReactKeyboardEvent) => { if (event.key === 'Enter') input.current[key] = false; },
    onContextMenu: (event: ReactMouseEvent) => event.preventDefault(),
  });

  const cfg = worldConfig(world, relaxed);
  const vyState = Math.abs(hud.vy) <= cfg.maxVy ? 'safe' : Math.abs(hud.vy) <= cfg.maxVy * 2.5 ? 'warn' : 'danger';
  const vxState = Math.abs(hud.vx) <= cfg.maxVx ? 'safe' : 'warn';
  const chooseWorld = (w: World) => { setWorld(w); setPhase('ready'); reset(w); };

  return <div className={`lander lander-${world}`}>
    <div className="game-toolbar">
      <div className="segmented" role="group" aria-label={t('ui.l.choose')}>
        {(['moon', 'mars'] as World[]).map(w => <button key={w} type="button" aria-pressed={world === w} onClick={() => chooseWorld(w)}>{t(w === 'moon' ? 'ui.l.moonBtn' : 'ui.l.marsBtn')}</button>)}
      </div>
      <label className="toggle"><input type="checkbox" checked={assist} onChange={e => setAssist(e.target.checked)} /> {t('ui.l.assist')}</label>
      {(phase === 'flying' || phase === 'paused') && <button type="button" className="button button-ghost button-small" onClick={() => setPhase(p => p === 'paused' ? 'flying' : 'paused')}>{t(phase === 'paused' ? 'ui.l.resume' : 'ui.l.pause')}</button>}
    </div>

    <div className="lander-screen">
      <canvas ref={canvas} className="lander-canvas" tabIndex={0} aria-label={t(`ui.l.${world}.canvas` as MessageKey)} />
      <dl className="lander-hud">
        <div><dt>{t('ui.l.alt')}</dt><dd>{t('ui.l.m', { v: hud.alt })}</dd></div>
        <div className={`hud-${vyState}`}><dt>{t('ui.l.vy')}</dt><dd>{t('ui.l.ms', { v: num(Math.abs(hud.vy)) })}{phase === 'flying' && <span className="hud-state">{t(vyState === 'safe' ? 'a11y.l.ok' : 'a11y.l.high')}</span>}</dd></div>
        <div className={`hud-${vxState}`}><dt>{t('ui.l.vx')}</dt><dd>{hud.vx >= 0 ? '→' : '←'} {t('ui.l.ms', { v: num(Math.abs(hud.vx)) })}{phase === 'flying' && <span className="hud-state">{t(vxState === 'safe' ? 'a11y.l.ok' : 'a11y.l.high')}</span>}</dd></div>
        <div className="hud-fuel"><dt>{t('ui.l.fuel')}</dt><dd><span className="fuel-bar" style={{ width: `${hud.fuel}%` }} />{hud.fuel}%</dd></div>
      </dl>
      {phase === 'ready' && <div className="game-overlay">
        <h2>{t(`ui.l.${world}.land` as MessageKey)}</h2>
        <ul className="howto">
          {coarse ? <>
            <li><strong>{t('ui.l.thrust')}</strong>: {t('ui.l.how1')}</li>
            <li><span aria-hidden="true">◀ ▶</span> {t('ui.l.how2')}</li>
          </> : <>
            <li><kbd>↑</kbd> {t('ui.l.or')} <kbd>{t('ui.l.space')}</kbd>, {t('ui.l.orHold')} <strong>{t('ui.l.thrust')}</strong>: {t('ui.l.how1')}</li>
            <li><kbd>←</kbd> <kbd>→</kbd>: {t('ui.l.how2')}</li>
          </>}
          <li>{t('ui.l.how3', { speed: t('ui.l.ms', { v: num(cfg.maxVy) }) })}</li>
        </ul>
        <button type="button" className="button button-primary" onClick={start}>{t('ui.l.start')}</button>
        <p className="game-note">{t(`ui.l.${world}.note` as MessageKey, { g: formatNumber(cfg.g, locale, 2) })}</p>
      </div>}
      {phase === 'paused' && <div className="game-overlay"><h2>{t('ui.l.paused')}</h2><button type="button" className="button button-primary" onClick={() => setPhase('flying')}>{t('ui.l.resume')}</button></div>}
      {result && (phase === 'landed' || phase === 'crashed') && <div className={`game-overlay result-${phase}`}>
        <h2>{t(result.title)}</h2>
        <p>{t(result.detail, result.vars)}</p>
        {phase === 'landed' && <><p className="big-score"><span>{result.score}</span> {t('ui.points')}</p>
          <dl className="score-breakdown"><div><dt>{t('ui.l.fuelLeft')}</dt><dd>{result.fuel}%</dd></div><div><dt>{t('ui.l.fromPad')}</dt><dd>{t('ui.l.m', { v: result.offset })}</dd></div><div><dt>{t('ui.l.touchdown')}</dt><dd>{t('ui.l.ms', { v: num(result.vy) })}</dd></div></dl></>}
        <div className="button-row"><button type="button" className="button button-primary" onClick={start}>{t(phase === 'landed' ? 'ui.l.flyAgain' : 'ui.l.tryAgain')}</button>
          <button type="button" className="button button-ghost" onClick={() => chooseWorld(world === 'moon' ? 'mars' : 'moon')}>{t(world === 'moon' ? 'ui.l.tryMars' : 'ui.l.tryMoon')}</button></div>
      </div>}
    </div>

    <div className="touch-controls" aria-label={t('ui.l.controls')}>
      <button type="button" className="ctl ctl-side" {...hold('left')} disabled={phase !== 'flying'} aria-label={t('ui.l.left')}>◀</button>
      <button type="button" className="ctl ctl-thrust" {...hold('up')} disabled={phase !== 'flying'}>{t('ui.l.thrust')}</button>
      <button type="button" className="ctl ctl-side" {...hold('right')} disabled={phase !== 'flying'} aria-label={t('ui.l.right')}>▶</button>
    </div>
    <p className="sr-only" aria-live="assertive">{callout}</p>
  </div>;
}
