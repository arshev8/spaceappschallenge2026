import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { surfacePoint } from '../components/explore/scene';
import { ARTIFACTS, PLANETS, VOYAGER, type Text } from './solar';

const filled = (t: Text) => t.en.trim().length > 0 && t.ru.trim().length > 0 && t.en !== t.ru || /^[A-Z][\w\s]*$/.test(t.en);
const pub = (p: string) => resolve(__dirname, '../../public', p);

describe('3D solar system data', () => {
  it('has text in English and Russian for every planet, fact and mission', () => {
    for (const p of PLANETS) {
      for (const t of [p.name, p.tagline, ...p.facts, ...p.missions.flatMap(m => [m.name, m.when]), ...(p.hardware ?? [])]) expect(filled(t), t.en).toBe(true);
    }
    expect(filled(VOYAGER.note)).toBe(true);
  });
  it('places artifacts only on worlds that exist, with valid coordinates and sources', () => {
    for (const a of ARTIFACTS) {
      expect(PLANETS.some(p => p.id === a.body)).toBe(true);
      expect(Math.abs(a.lat)).toBeLessThanOrEqual(90);
      expect(Math.abs(a.lon)).toBeLessThanOrEqual(180);
      expect(a.source).toMatch(/^https:\/\/[a-z.]*nasa\.gov\//);
      for (const t of [a.name, a.label, a.site, a.about, a.mission]) expect(t.en.length && t.ru.length).toBeTruthy();
    }
  });
  it('ships every texture and image the scene references', () => {
    for (const p of PLANETS) {
      if (p.texture) expect(existsSync(pub(`textures/${p.texture}.webp`)), p.texture).toBe(true);
      expect(existsSync(pub(`media/${p.media.file}.webp`)), p.media.file).toBe(true);
    }
    for (const a of ARTIFACTS) expect(existsSync(pub(`media/${a.media.file}.webp`)), a.media.file).toBe(true);
  });
  it('maps latitude/longitude onto the sphere like an equirectangular texture', () => {
    const v = (lat: number, lon: number) => surfacePoint(lat, lon).toArray().map(n => Math.round(n * 1000) / 1000);
    expect(v(0, 0)).toEqual([1, 0, 0]);       // texture center faces +X
    expect(v(90, 0)[1]).toBe(1);              // north pole is up
    expect(v(0, 90)).toEqual([0, 0, -1]);     // east is toward -Z, matching SphereGeometry UVs
  });
});
