import { useCallback, useRef, useState } from 'react';
import type { Scene } from '../../content/scripts.ts';

export type ChapterFlow = {
  scenes: Scene[];
  index: number;
  scene: Scene;
  /** Furthest scene the learner has unlocked (they may jump back to any scene up to here). */
  maxReached: number;
  isFirst: boolean;
  isLast: boolean;
  canAdvance: boolean;
  next: () => void;
  prev: () => void;
  goTo: (index: number) => void;
};

/**
 * Linear scene navigation. `gateSolved` reports whether the current scene's
 * experiment (if any) is complete; forward navigation is blocked until it is.
 */
export function useChapterFlow(scenes: Scene[], gateSolved: (scene: Scene) => boolean): ChapterFlow {
  const [index, setIndex] = useState(0);
  const [maxReached, setMaxReached] = useState(0);
  const scene = scenes[index];
  const canAdvance = index < scenes.length - 1 && (!scene.gate || gateSolved(scene));

  const next = useCallback(() => {
    if (!canAdvance) return;
    const target = Math.min(index + 1, scenes.length - 1);
    setIndex(target);
    setMaxReached(m => Math.max(m, target));
  }, [canAdvance, index, scenes.length]);
  const prev = useCallback(() => setIndex(i => Math.max(i - 1, 0)), []);
  const goTo = useCallback((target: number) => {
    if (target >= 0 && target <= maxReached) setIndex(target);
  }, [maxReached]);

  return {
    scenes,
    index,
    scene,
    maxReached,
    isFirst: index === 0,
    isLast: index === scenes.length - 1,
    canAdvance,
    next,
    prev,
    goTo,
  };
}

/** Calls `onComplete` at most once per mounted chapter, only from a user action. */
export function useCompleteOnce(onComplete: () => void): [boolean, () => void] {
  const fired = useRef(false);
  const [completed, setCompleted] = useState(false);
  const complete = useCallback(() => {
    if (fired.current) return;
    fired.current = true;
    setCompleted(true);
    onComplete();
  }, [onComplete]);
  return [completed, complete];
}

/** True when the OS asks for reduced motion OR the site's "Reduce motion" setting is on. */
export function prefersReducedMotion(): boolean {
  if (typeof document !== 'undefined' && document.documentElement.hasAttribute('data-reduce-motion')) return true;
  return typeof window !== 'undefined' && typeof window.matchMedia === 'function'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;
}
