export const chapterIds = ['apollo11', 'opportunity', 'insight', 'voyager'] as const;
export type ChapterId = (typeof chapterIds)[number];
export type ChapterProps = { onComplete: () => void; onBack: () => void };
export type Mission = {
  id: ChapterId;
  number: string;
  name: string;
  place: string;
  instrument: string;
  title: string;
  summary: string;
  status: string;
  statusKind: 'passive' | 'ended' | 'active';
  source: string;
  sourceName: string;
  epilogue?: boolean;
};
export const missions: Mission[] = [
  { id: 'apollo11', number: '01', name: 'Apollo 11', place: 'The Moon', instrument: 'Laser retroreflector',
    title: 'A mirror. A Moon. A measurement.', summary: 'A Moon reflector enables Earth–Moon laser distance measurements.',
    status: 'Passive · still useful', statusKind: 'passive',
    source: 'https://ilrs.cddis.eosdis.nasa.gov/missions/satellite_missions/current_missions/ap11_reflector.html', sourceName: 'NASA / ILRS reflector archive' },
  { id: 'opportunity', number: '02', name: 'Opportunity', place: 'Mars', instrument: 'Exploration rover',
    title: 'A world with a watery past.', summary: 'Mars rocks preserved evidence of an ancient watery environment.',
    status: 'Mission ended', statusKind: 'ended', source: 'https://science.nasa.gov/mission/mer-opportunity/', sourceName: 'NASA · Opportunity' },
  { id: 'insight', number: '03', name: 'InSight', place: 'Mars', instrument: 'Seismic lander',
    title: 'A planet with a story inside.', summary: "Marsquakes revealed information about Mars’s interior.",
    status: 'Mission ended', statusKind: 'ended', source: 'https://science.nasa.gov/mission/insight/', sourceName: 'NASA · InSight' },
  { id: 'voyager', number: '04', name: 'Voyager 1', place: 'Interstellar space', instrument: 'Interstellar spacecraft',
    title: 'The journey is still unfolding.', summary: 'Active interstellar spacecraft, an epilogue rather than an abandoned surface object.',
    status: 'Active · extended mission', statusKind: 'active', source: 'https://science.nasa.gov/mission/voyager/', sourceName: 'NASA · Voyager', epilogue: true },
];
export const coreMissions = missions.filter(mission => !mission.epilogue);
export function isChapterId(value: unknown): value is ChapterId {
  return typeof value === 'string' && chapterIds.some(id => id === value);
}
export function getMission(id: ChapterId): Mission {
  return missions.find(mission => mission.id === id)!;
}
