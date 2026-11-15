import { useEffect, useRef } from 'react';
import { useReducedMotion } from '../app/preferences';
import { useA11y } from '../app/a11y';

type Star = { x: number; y: number; z: number; r: number; tw: number; hue: number };

/**
 * Fixed, full-viewport starfield. Three depth layers drift slowly and shift with the
 * pointer (parallax). Renders one static frame when motion is reduced, and stops
 * drawing while the tab is hidden.
 */
export function Starfield() {
  // "Reduce motion" in the accessibility panel removes the starfield entirely; no canvas, no loop.
  const { reduceMotion } = useA11y();
  return reduceMotion ? null : <StarCanvas />;
}

function StarCanvas() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    const el = canvas.current;
    const ctx = el?.getContext('2d');
    if (!el || !ctx) return;
    let stars: Star[] = [];
    let w = 0, h = 0, raf = 0, last = 0;
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const resize = () => {
      w = window.innerWidth; h = window.innerHeight;
      el.width = Math.round(w * dpr); el.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(420, Math.round((w * h) / 4200));
      let seed = 7;
      const rand = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
      stars = Array.from({ length: count }, () => {
        const z = rand();
        return { x: rand() * w, y: rand() * h, z, r: .35 + z * z * 1.4, tw: rand() * Math.PI * 2, hue: rand() };
      });
      if (reduced) draw(0);
    };
    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      pointer.x += (pointer.tx - pointer.x) * .04;
      pointer.y += (pointer.ty - pointer.y) * .04;
      const scroll = window.scrollY;
      for (const s of stars) {
        const depth = .15 + s.z * .85;
        let x = s.x + (reduced ? 0 : t * .004 * depth) - pointer.x * 14 * depth;
        let y = s.y - scroll * .06 * depth - pointer.y * 10 * depth;
        x = ((x % w) + w) % w; y = ((y % h) + h) % h;
        const twinkle = reduced ? .8 : .65 + Math.sin(t * .0012 + s.tw) * .35;
        ctx.globalAlpha = (.25 + s.z * .7) * twinkle;
        ctx.fillStyle = s.hue > .93 ? '#ffd9a0' : s.hue > .86 ? '#bfe9ff' : '#f4f7ff';
        ctx.beginPath(); ctx.arc(x, y, s.r, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1;
    };
    const loop = (t: number) => {
      raf = requestAnimationFrame(loop);
      if (t - last < 30) return; // ~30 fps is plenty for a background
      last = t;
      draw(t);
    };
    const onPointer = (event: PointerEvent) => {
      pointer.tx = event.clientX / w - .5; pointer.ty = event.clientY / h - .5;
    };
    const onVisibility = () => {
      cancelAnimationFrame(raf);
      if (document.visibilityState === 'visible' && !reduced) raf = requestAnimationFrame(loop);
    };
    const onScroll = () => { if (reduced) draw(0); };
    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('visibilitychange', onVisibility);
    if (!reduced) { window.addEventListener('pointermove', onPointer, { passive: true }); raf = requestAnimationFrame(loop); }
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('pointermove', onPointer);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [reduced]);
  return <canvas ref={canvas} className="starfield" aria-hidden="true" />;
}
