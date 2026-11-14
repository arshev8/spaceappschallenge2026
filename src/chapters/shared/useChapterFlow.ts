import { useCallback, useRef, useState } from 'react';
import type { ChapterId } from '../../content/missions.ts';
import { SCRIPTS, type Scene } from '../../content/scripts.ts';

export type ChapterFlow = {
  scenes: Scene[];
  index: number;
  scene: Scene;
  isFirst: boolean;
  isLast: boolean;
  canAdvance: boolean;
  next: () => void;
  prev: () => void;
};

/**
 * Linear scene navigation. `gateSolved` reports whether the current scene's
 * experiment (if any) is complete; forward navigation is blocked until it is.
 */
export function useChapterFlow(id: ChapterId, gateSolved: (scene: Scene) => boolean): ChapterFlow {
  const scenes = SCRIPTS[id];
  const [index, setIndex] = useState(0);
  const scene = scenes[index];
  const canAdvance = index < scenes.length - 1 && (!scene.gate || gateSolved(scene));

  const next = useCallback(() => {
    if (canAdvance) setIndex((i) => Math.min(i + 1, scenes.length - 1));
  }, [canAdvance, scenes.length]);
  const prev = useCallback(() => setIndex((i) => Math.max(i - 1, 0)), []);

  return {
    scenes,
    index,
    scene,
    isFirst: index === 0,
    isLast: index === scenes.length - 1,
    canAdvance,
    next,
    prev,
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

export function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && typeof window.matchMedia === 'function'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;
}
