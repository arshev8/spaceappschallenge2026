/**
 * ECHOES game sprites. One art direction for every game:
 * dark navy outline (1.4px at 32px scale), flat fills with a lighter top-left
 * highlight and a darker lower-right shade, Kapton gold foil for spacecraft
 * bodies, silver for structure, solar-cell blue for panels, signal cyan for
 * anything that transmits. Sprites are SVG strings so the same art renders in
 * the DOM (<img>) and on canvas (rasterized once).
 */
const O = '#0b1226';          // outline
const GOLD = '#e8b04b', GOLD_HI = '#ffd27a', GOLD_LO = '#a8741f';
const SILVER = '#d8dde6', SILVER_LO = '#8f99a8';
const CELL = '#2d4f8f', CELL_HI = '#4b77c4';
const CYAN = '#8ee7dd', COPPER = '#c9774a', DARK = '#24304d';

const svg = (w: number, h: number, body: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" fill="none" stroke="${O}" stroke-width="1.4" stroke-linejoin="round" stroke-linecap="round">${body}</svg>`;

export const toDataUrl = (markup: string) => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(markup)}`;

/** Apollo-style lunar lander, feet at the bottom edge. 64 × 64. */
export const LANDER = svg(64, 64, `
  <path d="M14 40 4 58M50 40l10 18M20 44l-6 14M44 44l6 14" stroke-width="4.2"/>
  <path d="M14 40 4 58M50 40l10 18M20 44l-6 14M44 44l6 14" stroke="${SILVER}" stroke-width="2"/>
  <path d="M0 58h9M55 58h9M10 58h8M46 58h8" stroke-width="4.6"/>
  <path d="M0.8 58h7.4M55.8 58h7.4M10.8 58h6.4M46.8 58h6.4" stroke="${SILVER}" stroke-width="2.4"/>
  <path d="M27 44h10l3 7H24Z" fill="${SILVER_LO}"/>
  <path d="M12 28h40l4 6v8l-4 4H12l-4-4v-8Z" fill="${GOLD}"/>
  <path d="M12 28h40l4 6H8Z" fill="${GOLD_HI}" stroke="none"/>
  <path d="M8 42l4 4h40l4-4Z" fill="${GOLD_LO}" stroke="none"/>
  <path d="M12 28h40l4 6v8l-4 4H12l-4-4v-8Z"/>
  <path d="M18 31l3 9M27 30l-2 11M36 31l3 10M45 30l-3 11" stroke="${GOLD_LO}" stroke-width="1"/>
  <path d="M20 28V16l6-8h12l6 8v12Z" fill="${SILVER}"/>
  <path d="M20 16l6-8h12l6 8Z" fill="#f4f7ff" stroke="none"/>
  <path d="M20 28V16l6-8h12l6 8v12Z"/>
  <path d="M27 14h10l2 5H25Z" fill="${DARK}"/>
  <path d="M28 15h3l-1 3h-3Z" fill="${CYAN}" stroke="none" opacity=".8"/>
  <path d="M44 20h5M44 24h5M15 20h5M15 24h5" />
  <circle cx="44" cy="6" r="3" fill="${SILVER}"/><path d="M44 9v3"/>`);

/** One frame of engine exhaust (0–2), drawn under the lander. 24 × 32. */
export const flameFrame = (frame: number) => {
  const len = [26, 30, 22][frame % 3];
  return svg(24, 32, `
    <path d="M4 0h16L${12 + (frame - 1) * 1.5} ${len}Z" fill="#ef9876" stroke="none" opacity=".85"/>
    <path d="M7 0h10L${12 + (frame - 1)} ${len * .72}Z" fill="${GOLD_HI}" stroke="none"/>
    <path d="M10 0h4l-2 ${len * .4}Z" fill="#fff6dc" stroke="none"/>`);
};

/** Probe bus (body without parts), used at the center of the probe builder. 96 × 96. */
export const PROBE_BUS = svg(96, 96, `
  <path d="M30 30h36v36H30Z" fill="${GOLD}"/>
  <path d="M30 30h36l-6 6H36Z" fill="${GOLD_HI}" stroke="none"/>
  <path d="M66 30v36l-6-6V36Z" fill="${GOLD_LO}" stroke="none"/>
  <path d="M30 30h36v36H30Z"/>
  <path d="M36 36h24v24H36Z" stroke="${GOLD_LO}" stroke-width="1"/>
  <path d="M38 44l6 4-4 6M52 40l4 8-6 3" stroke="${GOLD_LO}" stroke-width="1"/>
  <path d="M48 30V18M48 66v12M30 48H18M66 48h12" stroke-dasharray="3 4" stroke="${SILVER_LO}"/>`);

/** Probe part icons, 32 × 32, one per part id. */
export const PART_ICONS: Record<string, string> = {
  solar: svg(32, 32, `<path d="M3 9h11v14H3ZM18 9h11v14H18Z" fill="${CELL}"/><path d="M3 13.7h11M3 18.3h11M8.5 9v14M18 13.7h11M18 18.3h11M23.5 9v14" stroke="${CELL_HI}" stroke-width="1"/><path d="M14 16h4" stroke-width="2"/>`),
  rtg: svg(32, 32, `<path d="M12 5h8v22h-8Z" fill="${SILVER}"/><path d="M12 5h3v22h-3Z" fill="#f4f7ff" stroke="none"/><path d="M12 5h8v22h-8Z"/><path d="M7 9h5M7 14h5M7 19h5M7 24h5M20 9h5M20 14h5M20 19h5M20 24h5" stroke="${SILVER_LO}" stroke-width="1.8"/><circle cx="16" cy="16" r="2.6" fill="${GOLD}"/>`),
  battery: svg(32, 32, `<path d="M7 9h16v16H7Z" fill="${DARK}"/><path d="M23 14h3v6h-3" fill="${SILVER_LO}"/><path d="M10 20h10v2H10Z" fill="#8be39a" stroke="none"/><path d="M12 13h6M15 10v6" stroke="${GOLD_HI}"/>`),
  hga: svg(32, 32, `<path d="M4 15c4 9 20 9 24 0Z" fill="#f4f7ff"/><path d="M6 17c5 5 15 5 20 0" stroke="${SILVER_LO}" stroke-width="1"/><path d="M16 18V6M13 6h6" stroke-width="1.8"/><path d="M16 22v6M11 28h10" stroke-width="2"/><path d="M22 6c2 1 3 3 3 5" stroke="${CYAN}" stroke-width="1.4"/>`),
  uhf: svg(32, 32, `<path d="M16 28V12" stroke-width="2.2"/><path d="M13 12h6l-1-4h-4Z" fill="${SILVER}"/><path d="M11 28h10" stroke-width="2"/><path d="M21 9c2 2 2 5 0 7M24 6c4 4 4 10 0 13M11 9c-2 2-2 5 0 7M8 6c-4 4-4 10 0 13" stroke="${CYAN}"/>`),
  lga: svg(32, 32, `<path d="M16 28V11" stroke-width="2.2"/><circle cx="16" cy="9" r="4" fill="${SILVER}"/><path d="M11 28h10" stroke-width="2"/><path d="M22 7c1 2 1 3 0 5M10 7c-1 2-1 3 0 5" stroke="${CYAN}"/>`),
  seis: svg(32, 32, `<path d="M8 20 16 7l8 13Z" fill="${COPPER}"/><path d="M16 7l8 13h-6Z" fill="#a25a32" stroke="none"/><path d="M8 20 16 7l8 13Z"/><path d="M10 20l-3 6M22 20l3 6M16 20v6" stroke-width="1.8"/><path d="M2 29h4l2-3 2 5 2-4 2 2h18" stroke="${CYAN}" stroke-width="1.2"/>`),
  rocklab: svg(32, 32, `<path d="M4 26c2-6 8-9 13-8 5 1 9 4 11 8Z" fill="#a07a5c"/><path d="M8 25c2-3 4-4 7-4" stroke="#c99a74" stroke-width="1"/><circle cx="20" cy="10" r="6" fill="${DARK}"/><circle cx="20" cy="10" r="3.5" fill="${CYAN}" stroke="none" opacity=".7"/><path d="M15.5 14.5 11 19" stroke-width="2.4"/>`),
  camera: svg(32, 32, `<path d="M6 10h20v12H6Z" fill="${SILVER}"/><path d="M6 10h20v3H6Z" fill="#f4f7ff" stroke="none"/><path d="M6 10h20v12H6Z"/><circle cx="12" cy="16" r="3.2" fill="${DARK}"/><circle cx="20" cy="16" r="3.2" fill="${DARK}"/><circle cx="11" cy="15" r="1" fill="${CYAN}" stroke="none"/><circle cx="19" cy="15" r="1" fill="${CYAN}" stroke="none"/><path d="M16 22v6M12 28h8" stroke-width="2"/>`),
  fields: svg(32, 32, `<path d="M4 26 24 8" stroke-width="2"/><path d="M22 4h6v6h-6Z" fill="${SILVER}"/><path d="M8 10c4-4 10-4 14 0M4 16c6-8 18-8 24 0" stroke="${CYAN}" stroke-dasharray="2 2.5"/><circle cx="5" cy="26" r="3" fill="${GOLD}"/>`),
  wheels: svg(32, 32, `<circle cx="16" cy="16" r="11" fill="${DARK}"/><circle cx="16" cy="16" r="5" fill="${SILVER}"/><path d="M16 5v3M16 24v3M5 16h3M24 16h3M8.2 8.2l2.2 2.2M21.6 21.6l2.2 2.2M8.2 23.8l2.2-2.2M21.6 10.4l2.2-2.2" stroke="${SILVER_LO}" stroke-width="2"/>`),
  legs: svg(32, 32, `<path d="M8 6h16v8H8Z" fill="${GOLD}"/><path d="M8 6h16l-2 2H10Z" fill="${GOLD_HI}" stroke="none"/><path d="M8 6h16v8H8Z"/><path d="M10 14 5 26M22 14l5 12M16 14v12" stroke-width="2"/><path d="M2 27h6M24 27h6M13 27h6" stroke-width="2.6"/>`),
  airbags: svg(32, 32, `<circle cx="11" cy="20" r="7" fill="#f4f7ff"/><circle cx="21" cy="20" r="7" fill="${SILVER}"/><circle cx="16" cy="11" r="7" fill="#f4f7ff"/><path d="M9 17c1-2 3-3 5-3M14 8c1-1 3-2 5-1" stroke="${SILVER_LO}" stroke-width="1"/>`),
  flyby: svg(32, 32, `<circle cx="13" cy="19" r="7" fill="#d9b38c"/><path d="M8 17h10M7 21h12" stroke="#a87d55" stroke-width="1.2"/><path d="M3 9c10-6 24-4 26 8" stroke="${CYAN}" stroke-dasharray="2.5 2.5"/><path d="M29 17l-1-4M29 17l-4-1" stroke="${CYAN}"/>`),
};

/** Shared cache so canvas games rasterize each sprite once. */
const images = new Map<string, HTMLImageElement>();
export function spriteImage(markup: string): HTMLImageElement {
  let img = images.get(markup);
  if (!img) { img = new Image(); img.decoding = 'async'; img.src = toDataUrl(markup); images.set(markup, img); }
  return img;
}
