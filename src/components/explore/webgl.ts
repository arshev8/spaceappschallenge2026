let cached: boolean | undefined;

/**
 * True when the browser can create a WebGL context (kept out of scene.ts so the 3D bundle stays lazy).
 * The probe context is released straight away and the answer is cached: browsers cap the number of
 * live WebGL contexts, and every leaked probe would count against the real scene.
 */
export function webglAvailable(): boolean {
  if (cached !== undefined) return cached;
  try {
    const c = document.createElement('canvas');
    const gl = window.WebGLRenderingContext ? (c.getContext('webgl2') || c.getContext('webgl')) : null;
    gl?.getExtension('WEBGL_lose_context')?.loseContext();
    cached = !!gl;
  } catch { cached = false; }
  return cached;
}
