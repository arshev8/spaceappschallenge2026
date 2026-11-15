import { useId } from 'react';

/** A document-unique, URL-safe id prefix for gradients and filters inside one inline SVG. */
export function useSvgId(prefix: string) {
  return prefix + useId().replace(/[^a-zA-Z0-9_-]/g, '');
}

/** Inline fill pointing at a gradient defined with that prefix (inline style beats class fills). */
export const fillUrl = (id: string, name: string) => ({ fill: `url(#${id}-${name})` });
