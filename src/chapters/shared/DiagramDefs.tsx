/**
 * Shared <defs> for the chapter diagrams. The diagrams are explanatory schematics (labeled,
 * translated, not to scale), so they use lit, shaded fills rather than flat outlines to sit
 * beside the NASA photographs. Fills are passed as inline `style` because the scoped chapter
 * CSS sets class fills, which would override SVG presentation attributes.
 */
export function GlowFilter({ id, blur = 2.4 }: { id: string; blur?: number }) {
  return (
    <filter id={`${id}-glow`} x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation={blur} result="blur" />
      <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
    </filter>
  );
}

/** Crust, mantle and core of Mars as lit spheres, plus a soft highlight for the globe. */
export function MarsLayerGradients({ id }: { id: string }) {
  return (
    <>
      <radialGradient id={`${id}-crust`} cx="38%" cy="32%" r="75%">
        <stop offset="0" stopColor="#e39a6f" /><stop offset="0.7" stopColor="#a3502f" /><stop offset="1" stopColor="#5e2817" />
      </radialGradient>
      <radialGradient id={`${id}-mantle`} cx="42%" cy="38%" r="70%">
        <stop offset="0" stopColor="#b4553a" /><stop offset="0.75" stopColor="#6a2a1c" /><stop offset="1" stopColor="#3a150e" />
      </radialGradient>
      <radialGradient id={`${id}-core`} cx="40%" cy="36%" r="68%">
        <stop offset="0" stopColor="#ffd38a" /><stop offset="0.6" stopColor="#d88a35" /><stop offset="1" stopColor="#8a4412" />
      </radialGradient>
      <radialGradient id={`${id}-shine`} cx="32%" cy="26%" r="60%">
        <stop offset="0" stopColor="#fff" stopOpacity="0.22" /><stop offset="1" stopColor="#fff" stopOpacity="0" />
      </radialGradient>
    </>
  );
}
