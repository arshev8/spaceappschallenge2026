import { useEffect, useRef } from 'react';

/** Adds `is-revealed` once the element scrolls into view. CSS decides what that looks like. */
export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') { el.classList.add('is-revealed'); return; }
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) { entry.target.classList.add('is-revealed'); observer.unobserve(entry.target); }
    }, { rootMargin: '0px 0px -12% 0px' });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}
