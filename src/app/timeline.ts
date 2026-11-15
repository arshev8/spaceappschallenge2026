import type { ChapterId } from './missions';
import { MEDIA, type Media } from './media';

export type Moment = {
  id: string;
  year: number;
  date: string;
  title: string;
  detail: string;
  mission: string;
  chapter?: ChapterId;
  media: Media;
  source: string;
};

const SRC = {
  ilrs: 'https://ilrs.cddis.eosdis.nasa.gov/missions/satellite_missions/current_missions/ap11_reflector.html',
  opp: 'https://science.nasa.gov/mission/mer-opportunity/',
  oppEnd: 'https://science.nasa.gov/missions/mer/nasas-opportunity-rover-mission-on-mars-comes-to-end/',
  insight: 'https://science.nasa.gov/mission/insight/',
  insightEnd: 'https://www.jpl.nasa.gov/news/nasa-retires-insight-mars-lander-mission-after-years-of-science',
  voyager: 'https://science.nasa.gov/mission/voyager/',
  voyager1: 'https://science.nasa.gov/mission/voyager/voyager-1/',
  voyager2026: 'https://science.nasa.gov/blogs/voyager/2026/04/17/nasa-shuts-off-instrument-on-voyager-1-to-keep-spacecraft-operating/',
  pbd: 'https://science.nasa.gov/resource/voyager-1s-pale-blue-dot/',
};

export const MOMENTS: Moment[] = [
  { id: 'a11-launch', year: 1969, date: 'July 16, 1969', title: 'Apollo 11 lifts off', detail: 'A Saturn V rocket sends three astronauts toward the Moon.', mission: 'Apollo 11', chapter: 'apollo11', media: MEDIA.a11Launch, source: SRC.ilrs },
  { id: 'a11-mirror', year: 1969, date: 'July 20, 1969', title: 'A mirror is left on the Moon', detail: 'The laser reflector is set up in the Sea of Tranquility. It needs no power.', mission: 'Apollo 11', chapter: 'apollo11', media: MEDIA.a11Easep, source: SRC.ilrs },
  { id: 'v1-launch', year: 1977, date: 'Sept. 5, 1977', title: 'Voyager 1 launches', detail: 'Its path will carry it past Jupiter and Saturn, then out of the planets’ realm.', mission: 'Voyager 1', chapter: 'voyager', media: MEDIA.voyagerLaunch, source: SRC.voyager1 },
  { id: 'v1-jupiter', year: 1979, date: 'March 1979', title: 'Close-up of Jupiter', detail: 'Voyager 1 photographs the Great Red Spot, a storm larger than Earth.', mission: 'Voyager 1', chapter: 'voyager', media: MEDIA.jupiter1979, source: SRC.voyager },
  { id: 'v1-saturn', year: 1980, date: 'November 1980', title: 'Past Saturn', detail: 'Voyager 1 flies by Saturn and its moon Titan, then heads out of the solar system’s plane.', mission: 'Voyager 1', chapter: 'voyager', media: MEDIA.saturn, source: SRC.voyager },
  { id: 'v1-pbd', year: 1990, date: 'Feb. 14, 1990', title: 'The Pale Blue Dot', detail: 'Looking back from about 6 billion km away, Voyager 1 photographs Earth as a tiny speck.', mission: 'Voyager 1', chapter: 'voyager', media: MEDIA.paleBlueDot, source: SRC.pbd },
  { id: 'v1-farthest', year: 1998, date: 'Feb. 17, 1998', title: 'Farthest human-made object', detail: 'Voyager 1 passes Pioneer 10 to become the most distant spacecraft.', mission: 'Voyager 1', chapter: 'voyager', media: MEDIA.voyager2Jpl, source: SRC.voyager1 },
  { id: 'opp-land', year: 2004, date: 'Jan. 24, 2004', title: 'Opportunity bounces down', detail: 'Wrapped in airbags, the rover rolls to a stop inside a small crater called Eagle.', mission: 'Opportunity', chapter: 'opportunity', media: MEDIA.oppShadow, source: SRC.opp },
  { id: 'opp-water', year: 2004, date: '2004', title: 'Rocks that remember water', detail: 'Hematite “blueberries” and layered rock point to ancient water at the landing site.', mission: 'Opportunity', chapter: 'opportunity', media: MEDIA.oppBlueberries, source: SRC.opp },
  { id: 'v1-interstellar', year: 2012, date: 'Aug. 25, 2012', title: 'Into interstellar space', detail: 'Voyager 1 leaves the heliosphere, the bubble of the Sun’s influence.', mission: 'Voyager 1', chapter: 'voyager', media: MEDIA.voyagerTest, source: SRC.voyager1 },
  { id: 'opp-endeavour', year: 2015, date: 'January 2015', title: 'View from a crater rim', detail: 'Eleven years in, Opportunity looks across Endeavour Crater from a high ridge.', mission: 'Opportunity', chapter: 'opportunity', media: MEDIA.oppPanorama, source: SRC.opp },
  { id: 'opp-storm', year: 2018, date: 'June 10, 2018', title: 'A dust storm goes dark', detail: 'A planet-wide storm blocks the sunlight. Opportunity sends its last signal.', mission: 'Opportunity', chapter: 'opportunity', media: MEDIA.dustStorm2018, source: SRC.oppEnd },
  { id: 'ins-land', year: 2018, date: 'Nov. 26, 2018', title: 'InSight lands to listen', detail: 'A lander that never drives, built to feel the vibrations inside Mars.', mission: 'InSight', chapter: 'insight', media: MEDIA.insightFirst, source: SRC.insight },
  { id: 'opp-end', year: 2019, date: 'Feb. 13, 2019', title: 'Opportunity’s mission ends', detail: 'After more than a thousand recovery commands, NASA declares the mission complete.', mission: 'Opportunity', chapter: 'opportunity', media: MEDIA.oppSelfie, source: SRC.oppEnd },
  { id: 'ins-end', year: 2022, date: 'Dec. 2022', title: 'InSight falls silent', detail: 'Dust covers its solar panels. By then it has detected 1,319 marsquakes.', mission: 'InSight', chapter: 'insight', media: MEDIA.insightFinal, source: SRC.insightEnd },
  { id: 'v1-2026', year: 2026, date: 'April 17, 2026', title: 'Saving power, still talking', detail: 'Engineers switch off one more instrument so Voyager 1 can keep operating.', mission: 'Voyager 1', chapter: 'voyager', media: MEDIA.dss43, source: SRC.voyager2026 },
  { id: 'v1-lightday', year: 2026, date: 'November 2026', title: 'One light-day away', detail: 'Voyager 1 reaches a distance where its signal takes about a full day to reach Earth.', mission: 'Voyager 1', chapter: 'voyager', media: MEDIA.paleBlueDot, source: SRC.voyager1 },
];
