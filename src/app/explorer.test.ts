import { beforeEach, describe, expect, it } from 'vitest';
import { EXPLORER_KEY, award, emptyLog, parseLog, points, record, recordBest, resetLog, onAward } from './explorer';

beforeEach(() => { localStorage.clear(); resetLog(); });
describe('exploration log', () => {
  it.each([null, '', '{bad', '[]', '{"version":2}', 'null'])('recovers from %s', raw => {
    expect(parseLog(raw)).toEqual(emptyLog());
  });
  it('drops unknown patches and invalid scores', () => {
    const log = parseLog(JSON.stringify({ version: 1, patches: ['grand-tour', 'hacked', 4], visited: ['moon', 'moon'], best: { lander: 'x', quiz: 700 } }));
    expect(log.patches).toEqual(['grand-tour']);
    expect(log.visited).toEqual(['moon']);
    expect(log.best).toEqual({ lander: 0, quiz: 700 });
  });
  it('awards threshold patches once and persists them', () => {
    const awarded: string[] = [];
    const off = onAward(p => awarded.push(p.id));
    for (const id of ['a', 'b', 'c', 'd', 'e', 'e']) record('inspected', id);
    award('hardware');
    expect(awarded).toEqual(['hardware']);
    expect(JSON.parse(localStorage.getItem(EXPLORER_KEY)!).patches).toEqual(['hardware']);
    off();
  });
  it('awards the grand tour after every destination', () => {
    ['earth', 'moon', 'mars'].forEach(id => record('visited', id, 3));
    expect(parseLog(localStorage.getItem(EXPLORER_KEY)).patches).toContain('grand-tour');
  });
  it('keeps only the best score and totals points', () => {
    recordBest('lander', 500); recordBest('lander', 300);
    const log = parseLog(localStorage.getItem(EXPLORER_KEY));
    expect(log.best.lander).toBe(500);
    expect(points({ ...log, patches: ['soft-landing'] }, 2)).toBe(150 + 500);
  });
});
