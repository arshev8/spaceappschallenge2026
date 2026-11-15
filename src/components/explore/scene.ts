import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { ARTIFACTS, PLANETS, VOYAGER, type Artifact, type Planet, type PlanetId } from '../../app/solar';

export type Selection = { kind: 'planet'; id: PlanetId } | { kind: 'artifact'; id: string } | { kind: 'voyager' } | null;
export type SceneOptions = {
  reduced: boolean;
  lowPower: boolean;
  labels: { planets: Record<PlanetId, string>; artifacts: Record<string, string>; voyager: string };
  onSelect: (selection: Selection) => void;
  onReady?: () => void;
};

type Body = { planet: Planet; pivot: THREE.Object3D; holder: THREE.Object3D; spinner: THREE.Mesh; angle: number; label: HTMLButtonElement };
type Marker = { artifact: Artifact; sprite: THREE.Sprite; label: HTMLButtonElement; normal: THREE.Vector3 };
type Tween = { from: { pos: THREE.Vector3; target: THREE.Vector3 }; start: number; duration: number; to: () => { pos: THREE.Vector3; target: THREE.Vector3 } };

const DEG = Math.PI / 180;
/**
 * Overview framing. Orbits are circular, so the view is turned to the side opposite Voyager 1:
 * its (approximate, real) direction then sits above the Sun inside the frame instead of off-screen,
 * and the full width of Neptune's orbit fits on landscape screens.
 */
const HOME = { pos: () => new THREE.Vector3(160, 70, 44), target: () => new THREE.Vector3(-8, 18, -2) };
const ease = (k: number) => (k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2);

/** lat/lon (degrees) → point on a unit sphere, matching three.js SphereGeometry UVs for equirectangular maps centered on 0° longitude. */
export function surfacePoint(lat: number, lon: number): THREE.Vector3 {
  const phi = (lon + 180) * DEG, theta = lat * DEG;
  return new THREE.Vector3(-Math.cos(phi) * Math.cos(theta), Math.sin(theta), Math.sin(phi) * Math.cos(theta));
}

function canvasTexture(w: number, h: number, paint: (ctx: CanvasRenderingContext2D) => void) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  paint(c.getContext('2d')!);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}
const glowTexture = (inner: string, outer: string) => canvasTexture(128, 128, ctx => {
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, inner); g.addColorStop(.25, inner); g.addColorStop(1, outer);
  ctx.fillStyle = g; ctx.fillRect(0, 0, 128, 128);
});

function seeded(seed: number) { return () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; }; }

/** Procedural maps only where no NASA map is used: the Sun's surface, Uranus's near-featureless clouds and Saturn's rings. */
function sunTexture() {
  return canvasTexture(512, 256, ctx => {
    const rand = seeded(11);
    ctx.fillStyle = '#ffb547'; ctx.fillRect(0, 0, 512, 256);
    for (let i = 0; i < 2200; i++) {
      const x = rand() * 512, y = rand() * 256, r = 1 + rand() * 5;
      ctx.fillStyle = rand() > .5 ? 'rgba(255,230,150,.35)' : 'rgba(214,110,30,.3)';
      ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
    }
  });
}
function uranusTexture() {
  return canvasTexture(256, 128, ctx => {
    const g = ctx.createLinearGradient(0, 0, 0, 128);
    g.addColorStop(0, '#c4eef0'); g.addColorStop(.5, '#a5dde2'); g.addColorStop(1, '#93cfd6');
    ctx.fillStyle = g; ctx.fillRect(0, 0, 256, 128);
    for (let y = 0; y < 128; y += 6) { ctx.fillStyle = `rgba(255,255,255,${.02 + (y % 18) / 600})`; ctx.fillRect(0, y, 256, 3); }
  });
}
function ringTexture() {
  return canvasTexture(512, 8, ctx => {
    const rand = seeded(5);
    for (let x = 0; x < 512; x++) {
      const t = x / 512;
      const gap = t > .58 && t < .63 ? .08 : 1; // Cassini Division
      const a = (.35 + rand() * .5) * gap * (t < .05 ? t / .05 : 1);
      const c = 200 + Math.round(rand() * 40);
      ctx.fillStyle = `rgba(${c},${c - 18},${c - 52},${a.toFixed(3)})`;
      ctx.fillRect(x, 0, 1, 8);
    }
  });
}

function atmosphere(radius: number, color: string) {
  const material = new THREE.ShaderMaterial({
    uniforms: { glow: { value: new THREE.Color(color) } },
    vertexShader: 'varying vec3 vN; varying vec3 vV; void main(){ vec4 mv = modelViewMatrix * vec4(position,1.); vN = normalize(normalMatrix*normal); vV = normalize(-mv.xyz); gl_Position = projectionMatrix*mv; }',
    fragmentShader: 'uniform vec3 glow; varying vec3 vN; varying vec3 vV; void main(){ float f = pow(1. - max(dot(vN, vV), 0.), 3.); gl_FragColor = vec4(glow * f, f * .9); }',
    blending: THREE.AdditiveBlending, side: THREE.FrontSide, transparent: true, depthWrite: false,
  });
  return new THREE.Mesh(new THREE.SphereGeometry(radius * 1.025, 48, 32), material);
}

export class SolarScene {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera: THREE.PerspectiveCamera;
  private controls: OrbitControls;
  private bodies = new Map<PlanetId, Body>();
  private markers: Marker[] = [];
  private voyager: { sprite: THREE.Sprite; label: HTMLButtonElement };
  private ring: THREE.Mesh;
  private raycaster = new THREE.Raycaster();
  private pointer = new THREE.Vector2();
  private tween: Tween | null = null;
  private selection: Selection = null;
  private focusPlanet: PlanetId | null = null;
  private lastFocusPos = new THREE.Vector3();
  private raf = 0;
  private last = 0;
  private visible = true;
  private disposers: (() => void)[] = [];
  private inset = { x: 0, y: 0 };
  private insetNow = { x: 0, y: 0 };
  private textures: THREE.Texture[] = [];
  /** Set when something changed and the next frame must be drawn (see `loop`). */
  private dirty = true;
  private disposed = false;
  private down = { x: 0, y: 0, t: 0 };
  private opts: SceneOptions;
  private canvas: HTMLCanvasElement;
  private layer: HTMLElement;

  constructor(canvas: HTMLCanvasElement, layer: HTMLElement, opts: SceneOptions) {
    this.canvas = canvas; this.layer = layer; this.opts = opts;
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: !opts.lowPower, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, opts.lowPower ? 1.25 : 1.75));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;
    this.camera = new THREE.PerspectiveCamera(45, 1, .05, 3000);
    this.camera.position.copy(HOME.pos().multiplyScalar(1.7)); // fly-in starts far out along the overview line
    this.controls = new OrbitControls(this.camera, canvas);
    Object.assign(this.controls, { enableDamping: true, dampingFactor: .08, minDistance: 3, maxDistance: 320, screenSpacePanning: true, rotateSpeed: .6, zoomSpeed: .9 });
    this.controls.listenToKeyEvents(canvas);
    this.controls.addEventListener('change', () => this.invalidate());
    this.controls.keyPanSpeed = 14;

    this.scene.add(new THREE.AmbientLight(0x3a4a6a, .85)); // night sides stay readable instead of black discs
    const sunLight = new THREE.PointLight(0xfff1dc, 3.2, 0, 0);
    this.scene.add(sunLight);
    this.buildStars();
    this.buildBodies();
    this.voyager = this.buildVoyager();
    this.ring = new THREE.Mesh(new THREE.RingGeometry(1.3, 1.325, 128), new THREE.MeshBasicMaterial({ color: 0xffd27a, transparent: true, opacity: .9, side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending }));
    this.ring.visible = false;
    this.scene.add(this.ring);
    this.bindEvents();
    this.resize();
    if (opts.reduced) { this.camera.position.copy(HOME.pos()); this.controls.target.copy(HOME.target()); }
    else this.tween = { from: { pos: this.camera.position.clone(), target: new THREE.Vector3() }, start: performance.now(), duration: 2600, to: () => ({ pos: HOME.pos(), target: HOME.target() }) };
    this.loadTextures();
    this.raf = requestAnimationFrame(this.loop);
  }

  private markerTexture() {
    return this.track(canvasTexture(64, 64, ctx => {
      const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      g.addColorStop(0, 'rgba(255,240,200,1)'); g.addColorStop(.22, 'rgba(255,214,130,1)'); g.addColorStop(.32, 'rgba(255,190,90,.55)'); g.addColorStop(1, 'rgba(255,170,60,0)');
      ctx.fillStyle = g; ctx.fillRect(0, 0, 64, 64);
      ctx.strokeStyle = 'rgba(255,214,130,.95)'; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(32, 32, 19, 0, Math.PI * 2); ctx.stroke();
    }));
  }

  private buildStars() {
    const count = this.opts.lowPower ? 1600 : 3600;
    const rand = seeded(42);
    const pos = new Float32Array(count * 3), col = new Float32Array(count * 3);
    const tints = [new THREE.Color('#f4f7ff'), new THREE.Color('#ffd9a0'), new THREE.Color('#bfe9ff')];
    for (let i = 0; i < count; i++) {
      const u = rand() * 2 - 1, a = rand() * Math.PI * 2, r = 900 + rand() * 600;
      const s = Math.sqrt(1 - u * u);
      pos.set([Math.cos(a) * s * r, u * r, Math.sin(a) * s * r], i * 3);
      const c = tints[rand() > .9 ? (rand() > .5 ? 1 : 2) : 0].clone().multiplyScalar(.45 + rand() * .55);
      col.set([c.r, c.g, c.b], i * 3);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
    this.scene.add(new THREE.Points(geo, new THREE.PointsMaterial({ size: 1.6, sizeAttenuation: false, vertexColors: true, depthWrite: false })));
  }

  private makeLabel(text: string, className: string, onClick: () => void) {
    const el = document.createElement('button');
    el.type = 'button';
    el.className = className;
    el.textContent = text;
    el.tabIndex = -1; // the destination list is the keyboard path; labels are a pointer convenience
    el.setAttribute('aria-hidden', 'true');
    el.addEventListener('click', event => { event.stopPropagation(); onClick(); });
    this.layer.appendChild(el);
    return el;
  }

  private buildBodies() {
    const seg = this.opts.lowPower ? [32, 24] : [64, 48];
    for (const planet of PLANETS) {
      const pivot = new THREE.Object3D();
      const holder = new THREE.Object3D();
      holder.position.x = planet.orbit;
      pivot.add(holder);
      const tilt = new THREE.Object3D();
      tilt.rotation.z = planet.tilt * DEG;
      holder.add(tilt);
      const material = planet.id === 'sun'
        ? new THREE.MeshBasicMaterial({ map: this.track(sunTexture()), color: 0xffffff })
        : new THREE.MeshStandardMaterial({ color: planet.color, roughness: 1, metalness: 0, map: planet.id === 'uranus' ? this.track(uranusTexture()) : null });
      if (planet.id === 'uranus') (material as THREE.MeshStandardMaterial).color.set('#ffffff');
      const spinner = new THREE.Mesh(new THREE.SphereGeometry(planet.radius, seg[0], seg[1]), material);
      spinner.userData = { planet: planet.id };
      tilt.add(spinner);
      if (planet.atmosphere) tilt.add(atmosphere(planet.radius, planet.atmosphere));
      if (planet.id === 'sun') {
        const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: this.track(glowTexture('rgba(255,200,110,.9)', 'rgba(255,140,40,0)')), blending: THREE.AdditiveBlending, depthWrite: false, transparent: true }));
        glow.scale.setScalar(planet.radius * 4.2);
        holder.add(glow);
      }
      if (planet.id === 'saturn') {
        const inner = planet.radius * 1.25, outer = planet.radius * 2.35;
        const geo = new THREE.RingGeometry(inner, outer, 128, 1);
        const uv = geo.attributes.uv, p = geo.attributes.position, v = new THREE.Vector3();
        for (let i = 0; i < uv.count; i++) { v.fromBufferAttribute(p, i); uv.setXY(i, (v.length() - inner) / (outer - inner), .5); }
        const rings = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ map: this.track(ringTexture()), transparent: true, side: THREE.DoubleSide, roughness: 1, depthWrite: false }));
        rings.rotation.x = -Math.PI / 2;
        tilt.add(rings);
      }
      if (planet.orbit > 0 && planet.id !== 'moon') {
        const curve = new THREE.EllipseCurve(0, 0, planet.orbit, planet.orbit, 0, Math.PI * 2);
        const pts = curve.getPoints(220).map(q => new THREE.Vector3(q.x, 0, q.y));
        this.scene.add(new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color: 0x8ea0c4, transparent: true, opacity: .16 })));
      }
      const angle = (PLANETS.indexOf(planet) * 137.5) % 360;
      const label = this.makeLabel(this.opts.labels.planets[planet.id], `s3-label s3-label-${planet.id}`, () => this.opts.onSelect({ kind: 'planet', id: planet.id }));
      this.bodies.set(planet.id, { planet, pivot, holder, spinner, angle, label });
    }
    for (const body of this.bodies.values()) {
      if (body.planet.id === 'moon') this.bodies.get('earth')!.holder.add(body.pivot);
      else this.scene.add(body.pivot);
      body.pivot.rotation.y = body.angle * DEG;
    }
    // Artifact markers ride on the surface, so they turn with their world.
    const markerTex = this.markerTexture();
    for (const artifact of ARTIFACTS) {
      const body = this.bodies.get(artifact.body)!;
      const normal = surfacePoint(artifact.lat, artifact.lon);
      const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: markerTex, depthTest: true, transparent: true, depthWrite: false }));
      sprite.position.copy(normal).multiplyScalar(body.planet.radius * 1.01);
      sprite.scale.setScalar(body.planet.radius * .11);
      sprite.userData = { artifact: artifact.id };
      sprite.visible = false;
      body.spinner.add(sprite);
      const label = this.makeLabel(this.opts.labels.artifacts[artifact.id], 's3-label s3-artifact s3-side', () => this.opts.onSelect({ kind: 'artifact', id: artifact.id }));
      this.markers.push({ artifact, sprite, label, normal });
    }
  }

  private buildVoyager() {
    const dir = new THREE.Vector3().setFromSphericalCoords(1, (90 - VOYAGER.elevation) * DEG, VOYAGER.azimuth * DEG);
    const end = dir.clone().multiplyScalar(VOYAGER.distance);
    const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints([dir.clone().multiplyScalar(12), end]), new THREE.LineDashedMaterial({ color: 0xb7a6ff, dashSize: 2, gapSize: 2.5, transparent: true, opacity: .55 }));
    line.computeLineDistances();
    this.scene.add(line);
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: this.track(glowTexture('rgba(210,196,255,1)', 'rgba(150,120,255,0)')), transparent: true, depthWrite: false }));
    sprite.position.copy(end);
    sprite.scale.setScalar(4);
    sprite.userData = { voyager: true };
    this.scene.add(sprite);
    const label = this.makeLabel(this.opts.labels.voyager, 's3-label s3-voyager', () => this.opts.onSelect({ kind: 'voyager' }));
    return { sprite, label };
  }

  private track<T extends THREE.Texture>(tex: T): T { this.textures.push(tex); return tex; }

  /** Loads NASA maps in parallel after first paint; planets show their base color until their map arrives. */
  private loadTextures() {
    const loader = new THREE.TextureLoader();
    const aniso = Math.min(4, this.renderer.capabilities.getMaxAnisotropy());
    const queue = PLANETS.filter(p => p.texture);
    let pending = queue.length;
    const settle = () => { if (--pending === 0 && !this.disposed) this.opts.onReady?.(); };
    if (!pending) { this.opts.onReady?.(); return; }
    for (const planet of queue) {
      loader.load(`./textures/${planet.texture}.webp`, tex => {
        if (this.disposed) { tex.dispose(); return; }
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.anisotropy = aniso;
        this.track(tex);
        const mat = this.bodies.get(planet.id)!.spinner.material as THREE.MeshStandardMaterial;
        mat.map = tex; mat.color.set('#ffffff'); mat.needsUpdate = true;
        this.invalidate();
        settle();
      }, undefined, settle);
    }
  }

  private bindEvents() {
    const on = <K extends keyof HTMLElementEventMap>(el: HTMLElement | Window, type: K, fn: (e: HTMLElementEventMap[K]) => void, opt?: AddEventListenerOptions) => {
      el.addEventListener(type, fn as EventListener, opt);
      this.disposers.push(() => el.removeEventListener(type, fn as EventListener));
    };
    on(this.canvas, 'pointerdown', e => { this.down = { x: e.clientX, y: e.clientY, t: performance.now() }; });
    on(this.canvas, 'pointerup', e => {
      if (Math.hypot(e.clientX - this.down.x, e.clientY - this.down.y) > 6) return;
      const hit = this.pick(e.clientX, e.clientY);
      if (hit) this.opts.onSelect(hit);
    });
    on(this.canvas, 'pointermove', e => {
      if (e.buttons) return;
      this.canvas.style.cursor = this.pick(e.clientX, e.clientY) ? 'pointer' : 'grab';
    });
    on(this.canvas, 'keydown', e => {
      if (e.key === '+' || e.key === '=') this.dolly(.8);
      if (e.key === '-' || e.key === '_') this.dolly(1.25);
      this.invalidate();
    });
    const ro = new ResizeObserver(() => this.resize());
    ro.observe(this.canvas);
    this.disposers.push(() => ro.disconnect());
    const onVisibility = () => this.invalidate();
    document.addEventListener('visibilitychange', onVisibility);
    this.disposers.push(() => document.removeEventListener('visibilitychange', onVisibility));
    const io = new IntersectionObserver(([entry]) => { this.visible = entry.isIntersecting; this.invalidate(); });
    io.observe(this.canvas);
    this.disposers.push(() => io.disconnect());
  }

  private dolly(factor: number) {
    const offset = this.camera.position.clone().sub(this.controls.target).multiplyScalar(factor);
    const len = THREE.MathUtils.clamp(offset.length(), this.controls.minDistance, this.controls.maxDistance);
    this.camera.position.copy(this.controls.target).add(offset.setLength(len));
  }

  private pick(x: number, y: number): Selection {
    const rect = this.canvas.getBoundingClientRect();
    this.pointer.set(((x - rect.left) / rect.width) * 2 - 1, -((y - rect.top) / rect.height) * 2 + 1);
    this.raycaster.setFromCamera(this.pointer, this.camera);
    const targets: THREE.Object3D[] = [...[...this.bodies.values()].map(b => b.spinner), this.voyager.sprite, ...this.markers.filter(m => m.sprite.visible).map(m => m.sprite)];
    const hit = this.raycaster.intersectObjects(targets, false)[0];
    if (!hit) return null;
    const data = hit.object.userData;
    if (data.artifact) return { kind: 'artifact', id: data.artifact };
    if (data.voyager) return { kind: 'voyager' };
    return { kind: 'planet', id: data.planet };
  }

  private worldPos(id: PlanetId) { return this.bodies.get(id)!.spinner.getWorldPosition(new THREE.Vector3()); }

  /** Camera framing for a selection: planets from a 3/4 angle, artifacts from straight above their site. */
  private framing(selection: Selection): () => { pos: THREE.Vector3; target: THREE.Vector3 } {
    if (!selection) return () => ({ pos: HOME.pos(), target: HOME.target() });
    if (selection.kind === 'voyager') return () => {
      const p = this.voyager.sprite.position.clone();
      return { pos: p.clone().add(p.clone().setLength(-30)).add(new THREE.Vector3(0, 8, 0)), target: p };
    };
    if (selection.kind === 'artifact') {
      const marker = this.markers.find(m => m.artifact.id === selection.id)!;
      return () => {
        const center = this.worldPos(marker.artifact.body);
        const surface = marker.sprite.getWorldPosition(new THREE.Vector3());
        const r = this.bodies.get(marker.artifact.body)!.planet.radius;
        return { pos: center.clone().add(surface.sub(center).setLength(r * 3.1 * Math.max(1, 1.1 / this.camera.aspect))), target: center };
      };
    }
    const r = this.bodies.get(selection.id)!.planet.radius;
    return () => {
      const center = this.worldPos(selection.id);
      const out = center.lengthSq() > 0 ? center.clone().normalize() : new THREE.Vector3(0, 0, 1);
      const side = new THREE.Vector3(-out.z, 0, out.x);
      // Portrait screens need more distance to fit the same subject.
      const fit = Math.max(1, 1.1 / this.camera.aspect);
      const dist = (selection.id === 'sun' ? r * 5 : r * 4.2 + 1.5) * fit * (selection.id === 'saturn' ? 1.3 : 1);
      return { pos: center.clone().add(out.multiplyScalar(-dist * .72)).add(side.multiplyScalar(dist * .5)).add(new THREE.Vector3(0, dist * .32, 0)), target: center };
    };
  }

  select(selection: Selection) {
    this.selection = selection;
    this.invalidate();
    const planet = selection?.kind === 'planet' ? selection.id : selection?.kind === 'artifact' ? ARTIFACTS.find(a => a.id === selection.id)!.body : null;
    this.focusPlanet = planet;
    if (planet) this.lastFocusPos.copy(this.worldPos(planet));
    for (const m of this.markers) m.sprite.visible = m.artifact.body === planet;
    this.controls.minDistance = planet ? this.bodies.get(planet)!.planet.radius * 1.6 : 3;
    const to = this.framing(selection);
    if (this.opts.reduced) { const f = to(); this.camera.position.copy(f.pos); this.controls.target.copy(f.target); this.tween = null; }
    else this.tween = { from: { pos: this.camera.position.clone(), target: this.controls.target.clone() }, start: performance.now(), duration: 1500, to };
  }

  setReduced(reduced: boolean) { this.opts.reduced = reduced; this.invalidate(); }

  /** Ask for one more frame, for changes made outside the render loop. */
  invalidate() { this.dirty = true; }

  /**
   * Pixels covered by the info panel: `x` for a side panel on the right, `y` for a bottom sheet
   * on phones. The view shifts so the subject stays in the part of the canvas that is still visible.
   */
  setInset(x: number, y = 0) { this.inset = { x, y }; this.invalidate(); }

  private applyInset() {
    const w = this.canvas.clientWidth, h = this.canvas.clientHeight;
    if (!w || !h) return;
    if (this.insetNow.x < .5 && this.insetNow.y < .5) this.camera.clearViewOffset();
    else this.camera.setViewOffset(w, h, this.insetNow.x / 2, this.insetNow.y / 2, w, h);
  }

  setLabels(labels: SceneOptions['labels']) {
    this.opts.labels = labels;
    for (const b of this.bodies.values()) b.label.textContent = labels.planets[b.planet.id];
    for (const m of this.markers) m.label.textContent = labels.artifacts[m.artifact.id];
    this.voyager.label.textContent = labels.voyager;
    this.invalidate();
  }

  private resize() {
    // Size from the canvas's own CSS box: on phones the stage also contains the panel and lists.
    const w = this.canvas.clientWidth, h = this.canvas.clientHeight;
    if (!w || !h) return;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.invalidate();
    this.applyInset();
  }

  /**
   * Positions an HTML label over a world point. Side labels (landing sites) are nudged down when they
   * would overlap a site label already placed this frame (`taken`), so neighbouring sites stay readable.
   */
  private placeLabel(el: HTMLElement, world: THREE.Vector3, show: boolean, dy = 0, side = false, taken?: { x: number; y: number; w: number; h: number }[]) {
    const p = world.clone().project(this.camera);
    if (!show || p.z > 1 || p.z < -1) { el.style.opacity = '0'; el.style.pointerEvents = 'none'; return; }
    const w = this.canvas.clientWidth, h = this.canvas.clientHeight;
    el.style.opacity = '1';
    el.style.pointerEvents = 'auto';
    const x = (p.x + 1) / 2 * w;
    let y = (1 - p.y) / 2 * h;
    if (side && taken) {
      const box = { x: x + 12, w: el.offsetWidth, h: el.offsetHeight || 20 };
      const hits = (ty: number) => taken.some(r => box.x < r.x + r.w && box.x + box.w > r.x && ty - box.h / 2 < r.y + r.h / 2 && ty + box.h / 2 > r.y - r.h / 2);
      for (let i = 0; i < 6 && hits(y); i++) y += box.h + 2;
      taken.push({ ...box, y });
    }
    el.style.transform = side ? `translate(${(x + 12).toFixed(1)}px, ${y.toFixed(1)}px) translate(0, -50%)` : `translate(${x.toFixed(1)}px, ${(y + dy).toFixed(1)}px) translate(-50%, 0)`;
  }

  private loop = (now: number) => {
    this.raf = requestAnimationFrame(this.loop);
    if (!this.visible || document.hidden) { this.last = now; return; }
    const dt = Math.min(.05, (now - (this.last || now)) / 1000);
    this.last = now;
    const moving = !this.opts.reduced;
    // Render on demand: orbits, camera flights, panel shifts and user input mark the frame dirty.
    // With orbits paused (or reduced motion) and nothing happening, the GPU stays idle.
    let changed = this.dirty || moving || this.tween !== null;
    this.dirty = false;
    for (const body of this.bodies.values()) {
      if (moving) {
        // The focused world (and the Moon when Earth is focused) holds still so its markers stay readable.
        const holdOrbit = this.focusPlanet && (body.planet.id === this.focusPlanet || (this.focusPlanet === 'moon' && body.planet.id === 'earth'));
        if (!holdOrbit) body.angle += body.planet.orbitSpeed * dt * .25;
        if (body.planet.id !== this.focusPlanet || this.selection?.kind === 'planet') body.spinner.rotation.y += body.planet.spin * DEG * dt * (body.planet.id === this.focusPlanet ? .25 : 1);
      }
      body.pivot.rotation.y = body.angle * DEG;
    }
    // Follow the focused world as it moves.
    if (this.focusPlanet) {
      const p = this.worldPos(this.focusPlanet);
      const delta = p.clone().sub(this.lastFocusPos);
      this.lastFocusPos.copy(p);
      if (!this.tween) { this.camera.position.add(delta); this.controls.target.add(delta); }
    }
    if (this.tween) {
      const k = Math.min(1, (now - this.tween.start) / this.tween.duration);
      const to = this.tween.to(), e = ease(k);
      this.camera.position.lerpVectors(this.tween.from.pos, to.pos, e);
      this.controls.target.lerpVectors(this.tween.from.target, to.target, e);
      if (k >= 1) this.tween = null;
    }
    const dx = this.inset.x - this.insetNow.x, dy = this.inset.y - this.insetNow.y;
    if (Math.abs(dx) > .5 || Math.abs(dy) > .5) {
      const k = this.opts.reduced ? 1 : Math.min(1, dt * 6);
      this.insetNow = { x: this.insetNow.x + dx * k, y: this.insetNow.y + dy * k };
      this.applyInset();
      changed = true;
    }
    if (this.controls.update()) changed = true;
    if (!changed) return;

    // Selection ring faces the camera and breathes gently.
    const sel = this.selection;
    if (sel?.kind === 'planet') {
      const b = this.bodies.get(sel.id)!;
      this.ring.visible = true;
      this.ring.position.copy(this.worldPos(sel.id));
      this.ring.scale.setScalar(b.planet.radius * (sel.id === 'saturn' ? 1.95 : 1.02));
      this.ring.lookAt(this.camera.position);
      (this.ring.material as THREE.MeshBasicMaterial).opacity = moving ? .5 + Math.sin(now / 420) * .25 : .7;
    } else this.ring.visible = false;

    const camDir = new THREE.Vector3();
    for (const body of this.bodies.values()) {
      const p = this.worldPos(body.planet.id);
      const dist = p.distanceTo(this.camera.position);
      const small = body.planet.id === 'moon' && !this.focusPlanet;
      const px = body.planet.radius / dist * this.canvas.clientHeight;
      // The focused world's name is already the panel title; its label would cover the site markers.
      const focused = body.planet.id === this.focusPlanet;
      this.placeLabel(body.label, p, !small && !focused && px < 260, Math.max(10, px * .9));
      body.label.classList.toggle('is-active', sel?.kind === 'planet' && sel.id === body.planet.id);
    }
    const taken: { x: number; y: number; w: number; h: number }[] = [];
    for (const m of this.markers) {
      const visible = m.sprite.visible;
      const wp = m.sprite.getWorldPosition(new THREE.Vector3());
      const center = this.worldPos(m.artifact.body);
      camDir.copy(this.camera.position).sub(wp).normalize();
      const facing = wp.clone().sub(center).normalize().dot(camDir) > .15;
      this.placeLabel(m.label, wp, visible && facing, 0, true, taken);
      m.label.classList.toggle('is-active', sel?.kind === 'artifact' && sel.id === m.artifact.id);
      if (visible) m.sprite.scale.setScalar(this.bodies.get(m.artifact.body)!.planet.radius * (sel?.kind === 'artifact' && sel.id === m.artifact.id ? .2 : .11));
    }
    this.placeLabel(this.voyager.label, this.voyager.sprite.position, true, 12);
    this.renderer.render(this.scene, this.camera);
  };

  dispose() {
    this.disposed = true;
    cancelAnimationFrame(this.raf);
    this.disposers.forEach(d => d());
    this.controls.dispose();
    this.scene.traverse(obj => {
      const mesh = obj as THREE.Mesh;
      mesh.geometry?.dispose();
      const mat = mesh.material as THREE.Material | THREE.Material[] | undefined;
      (Array.isArray(mat) ? mat : mat ? [mat] : []).forEach(m => m.dispose());
    });
    this.textures.forEach(t => t.dispose());
    this.renderer.dispose();
    // dispose() frees buffers but keeps the context alive; browsers allow only a handful at once,
    // so release it explicitly or repeated visits to Explore exhaust them. Only do this once the
    // canvas has left the page: a lost context can never be restored on the same element, and
    // React StrictMode (dev) disposes and re-creates the scene on a canvas that stays mounted.
    if (!this.canvas.isConnected) this.renderer.forceContextLoss();
    this.layer.replaceChildren();
  }
}
