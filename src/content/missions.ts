/**
 * ECHOES — verified mission data.
 *
 * Every claim carries one or more source ids. Sources were read on 2026-11-14.
 * See docs/SCIENCE_SOURCES.md for the claim → source matrix and
 * docs/CONTENT_REVIEW.md for approximations and illustrative content.
 */

export type ChapterId = 'apollo11' | 'opportunity' | 'insight' | 'voyager';

export const CHAPTER_IDS: readonly ChapterId[] = ['apollo11', 'opportunity', 'insight', 'voyager'];

export type SourceRef = {
  id: string;
  label: string;
  publisher: string;
  url: string;
};

export type Claim = {
  id: string;
  text: string;
  sourceIds: string[];
};

export type ChronologyEntry = {
  date: string;
  event: string;
  sourceId: string;
};

export type MissionStatus = 'passive-still-useful' | 'mission-ended' | 'extended-mission';

export const STATUS_LABELS: Record<MissionStatus, string> = {
  'passive-still-useful': 'Passive, but still useful',
  'mission-ended': 'Mission ended',
  'extended-mission': 'Active extended mission',
};

export type MissionRecord = {
  id: ChapterId;
  title: string;
  chapterTitle: string;
  role: 'core' | 'epilogue';
  target: string;
  hardwareType: string;
  chronology: ChronologyEntry[];
  /** ISO date on which the status was checked against the cited sources. */
  statusAsOf: string;
  status: MissionStatus;
  statusDetail: string;
  scienceQuestion: string;
  method: string;
  result: string;
  takeaway: string;
  claims: Claim[];
  primarySourceId: string;
  credits?: string[];
};

export const STATUS_AS_OF = '2026-11-14';

export const SOURCES = {
  ilrsAp11: {
    id: 'ilrsAp11',
    label: 'Apollo 11 Lunar Laser Ranging Retroreflector',
    publisher: 'NASA CDDIS / International Laser Ranging Service',
    url: 'https://ilrs.cddis.eosdis.nasa.gov/missions/satellite_missions/current_missions/ap11_reflector.html',
  },
  nasaMoonArtifacts: {
    id: 'nasaMoonArtifacts',
    label: 'Catalogue of Manmade Material on the Moon',
    publisher: 'NASA History',
    url: 'https://www.nasa.gov/wp-content/uploads/static/history/humanartifacts.html',
  },
  nasaMoonFacts: {
    id: 'nasaMoonFacts',
    label: 'Earth’s Moon: Facts',
    publisher: 'NASA Science',
    url: 'https://science.nasa.gov/moon/facts/',
  },
  merOpportunity: {
    id: 'merOpportunity',
    label: 'Mars Exploration Rover — Opportunity',
    publisher: 'NASA Science',
    url: 'https://science.nasa.gov/mission/mer-opportunity/',
  },
  opportunityEnd: {
    id: 'opportunityEnd',
    label: 'NASA’s Opportunity Rover Mission on Mars Comes to End',
    publisher: 'NASA Science (Feb. 13, 2019)',
    url: 'https://science.nasa.gov/missions/mer/nasas-opportunity-rover-mission-on-mars-comes-to-end/',
  },
  marsFacts: {
    id: 'marsFacts',
    label: 'Mars: Facts',
    publisher: 'NASA Science',
    url: 'https://science.nasa.gov/mars/facts/',
  },
  insight: {
    id: 'insight',
    label: 'InSight Mars Lander',
    publisher: 'NASA Science',
    url: 'https://science.nasa.gov/mission/insight/',
  },
  insightRetired: {
    id: 'insightRetired',
    label: 'NASA Retires InSight Mars Lander Mission After Years of Science',
    publisher: 'NASA JPL (Dec. 21, 2022)',
    url: 'https://www.jpl.nasa.gov/news/nasa-retires-insight-mars-lander-mission-after-years-of-science',
  },
  voyager: {
    id: 'voyager',
    label: 'Voyager',
    publisher: 'NASA Science',
    url: 'https://science.nasa.gov/mission/voyager/',
  },
  voyager1: {
    id: 'voyager1',
    label: 'Voyager 1',
    publisher: 'NASA Science',
    url: 'https://science.nasa.gov/mission/voyager/voyager-1/',
  },
  voyagerLecp: {
    id: 'voyagerLecp',
    label: 'NASA Shuts Off Instrument on Voyager 1 to Keep Spacecraft Operating',
    publisher: 'NASA Science blog (Apr. 17, 2026)',
    url: 'https://science.nasa.gov/blogs/voyager/2026/04/17/nasa-shuts-off-instrument-on-voyager-1-to-keep-spacecraft-operating/',
  },
} as const satisfies Record<string, SourceRef>;

export type SourceId = keyof typeof SOURCES;

export function getSource(id: string): SourceRef | undefined {
  return (SOURCES as Record<string, SourceRef>)[id];
}

const ILLUSTRATION_CREDIT =
  'Illustrations and diagrams: original CSS/SVG artwork by the ECHOES team (not NASA imagery).';

export const MISSIONS: Record<ChapterId, MissionRecord> = {
  apollo11: {
    id: 'apollo11',
    title: 'Apollo 11 Laser Ranging Retroreflector',
    chapterTitle: 'The Mirror That Never Went Silent',
    role: 'core',
    target: 'The Moon — Sea of Tranquility',
    hardwareType: 'Passive retroreflector array (no power, no radio)',
    chronology: [
      { date: '1969', event: 'Apollo 11 astronauts leave the reflector array on the Moon.', sourceId: 'ilrsAp11' },
      {
        date: 'Decades since',
        event: 'Laser ranging observatories on Earth regularly aim at the Apollo reflectors.',
        sourceId: 'ilrsAp11',
      },
    ],
    statusAsOf: STATUS_AS_OF,
    status: 'passive-still-useful',
    statusDetail:
      'Has no power and sends no signal of its own. It simply reflects laser light that observatories aim at it.',
    scienceQuestion: 'How far away is the Moon — and how does that distance change?',
    method: 'Lunar laser ranging: time a laser pulse’s round trip to the reflector and back.',
    result: 'Distance = speed of light × round-trip time ÷ 2.',
    takeaway: 'Engineering can outlive its original mission and still support science.',
    claims: [
      {
        id: 'ap11-cubes',
        text: 'The Apollo 11 array has 100 fused silica corner-cube reflectors, each 3.8 cm across, in a 46 cm aluminum panel.',
        sourceIds: ['ilrsAp11'],
      },
      {
        id: 'ap11-location',
        text: 'The Apollo 11 array sits in the Sea of Tranquility.',
        sourceIds: ['ilrsAp11'],
      },
      {
        id: 'ap11-ranging',
        text: 'Observatories on Earth have regularly ranged the Moon using the Apollo reflectors.',
        sourceIds: ['ilrsAp11'],
      },
      {
        id: 'moon-receding',
        text: 'The Moon is slowly moving away from Earth — about an inch (2.5 cm) farther each year.',
        sourceIds: ['nasaMoonFacts'],
      },
    ],
    primarySourceId: 'ilrsAp11',
    credits: [ILLUSTRATION_CREDIT],
  },

  opportunity: {
    id: 'opportunity',
    title: 'Mars Exploration Rover Opportunity',
    chapterTitle: 'The Rover That Outlived Its Mission',
    role: 'core',
    target: 'Mars — Meridiani Planum',
    hardwareType: 'Solar-powered six-wheeled rover',
    chronology: [
      { date: 'July 7, 2003', event: 'Launch from Earth.', sourceId: 'merOpportunity' },
      {
        date: 'Jan. 24, 2004 (PST)',
        event: 'Lands in Meridiani Planum, inside a small crater called Eagle.',
        sourceId: 'merOpportunity',
      },
      {
        date: 'June 10, 2018',
        event: 'Last communication, during a planet-wide dust storm.',
        sourceId: 'opportunityEnd',
      },
      { date: 'Feb. 13, 2019', event: 'NASA declares the mission over.', sourceId: 'opportunityEnd' },
    ],
    statusAsOf: STATUS_AS_OF,
    status: 'mission-ended',
    statusDetail: 'Mission ended Feb. 13, 2019, after more than a thousand commands failed to restore contact.',
    scienceQuestion: 'Was ancient Mars once wetter — and possibly habitable?',
    method: 'Driving to rocks and studying their minerals and textures with cameras and instruments.',
    result:
      'Found hematite, a mineral that forms in water, and strong signs of ancient water at Endeavour Crater. This points to past habitable conditions — not proof of life.',
    takeaway: 'Rocks record the history of past environments.',
    claims: [
      {
        id: 'opp-90-sols',
        text: 'Opportunity was designed to last 90 sols (Martian days) and drive about 1,000 meters.',
        sourceIds: ['opportunityEnd', 'merOpportunity'],
      },
      {
        id: 'opp-sol',
        text: 'A sol is one Martian day; Mars completes one rotation every 24.6 hours.',
        sourceIds: ['marsFacts'],
      },
      {
        id: 'opp-15-years',
        text: 'The mission lasted almost 15 years, and the rover drove more than 28 miles (45 km).',
        sourceIds: ['opportunityEnd', 'merOpportunity'],
      },
      {
        id: 'opp-hematite',
        text: 'Opportunity found hematite, a mineral that forms in water, at its landing site.',
        sourceIds: ['opportunityEnd'],
      },
      {
        id: 'opp-endeavour',
        text: 'At Endeavour Crater it found strong indications of the action of ancient water.',
        sourceIds: ['opportunityEnd'],
      },
      {
        id: 'opp-dust',
        text: 'The solar-powered rover stopped communicating when a severe Mars-wide dust storm covered its location in June 2018.',
        sourceIds: ['opportunityEnd'],
      },
    ],
    primarySourceId: 'merOpportunity',
    credits: [ILLUSTRATION_CREDIT],
  },

  insight: {
    id: 'insight',
    title: 'InSight Mars Lander',
    chapterTitle: 'Listening to the Heart of Mars',
    role: 'core',
    target: 'Mars — Elysium Planitia',
    hardwareType: 'Stationary lander with a seismometer and heat-flow probe',
    chronology: [
      { date: 'May 5, 2018', event: 'Launch from Earth.', sourceId: 'insight' },
      { date: 'Nov. 26, 2018', event: 'Lands on Elysium Planitia.', sourceId: 'insight' },
      { date: 'Dec. 15, 2022', event: 'Last communication with Earth.', sourceId: 'insightRetired' },
      { date: 'Dec. 21, 2022', event: 'NASA announces the end of the mission.', sourceId: 'insightRetired' },
    ],
    statusAsOf: STATUS_AS_OF,
    status: 'mission-ended',
    statusDetail: 'Science mission ended in December 2022 after the lander ran out of power.',
    scienceQuestion: 'What is the inside of Mars like?',
    method: 'Recording ground vibrations with its seismometer, SEIS (Seismic Experiment for Interior Structure).',
    result:
      'Detected 1,319 marsquakes, including some caused by meteoroid impacts, giving scientists a way to study the crust, mantle and core.',
    takeaway: 'You can study what lies beneath a planet’s surface without digging to its core.',
    claims: [
      {
        id: 'ins-landing',
        text: 'InSight landed on Elysium Planitia, Mars, on Nov. 26, 2018.',
        sourceIds: ['insight'],
      },
      {
        id: 'ins-quakes',
        text: 'InSight detected 1,319 marsquakes, including quakes caused by meteoroid impacts.',
        sourceIds: ['insightRetired'],
      },
      {
        id: 'ins-interior',
        text: 'Seismometer data gives scientists a way to study the planet’s crust, mantle and core.',
        sourceIds: ['insightRetired'],
      },
      {
        id: 'ins-end',
        text: 'InSight last communicated with Earth on Dec. 15, 2022.',
        sourceIds: ['insightRetired', 'insight'],
      },
    ],
    primarySourceId: 'insight',
    credits: [ILLUSTRATION_CREDIT, 'Seismograms in this chapter are synthetic illustrations, not NASA recordings.'],
  },

  voyager: {
    id: 'voyager',
    title: 'Voyager 1',
    chapterTitle: 'Beyond the Last Planet',
    role: 'epilogue',
    target: 'Interstellar space',
    hardwareType: 'Nuclear-powered deep-space probe (radioisotope thermoelectric generators)',
    chronology: [
      { date: 'Sept. 5, 1977', event: 'Launch from Earth.', sourceId: 'voyager1' },
      { date: 'Feb. 17, 1998', event: 'Becomes the most distant human-made object.', sourceId: 'voyager1' },
      {
        date: 'Aug. 25, 2012',
        event: 'Leaves the heliosphere and begins measuring interstellar space.',
        sourceId: 'voyager1',
      },
      {
        date: 'Apr. 17, 2026',
        event: 'Engineers switch off one more instrument to save power.',
        sourceId: 'voyagerLecp',
      },
    ],
    statusAsOf: STATUS_AS_OF,
    status: 'extended-mission',
    statusDetail:
      'Still traveling and still talking to Earth. NASA lists its status as “Extended Mission”. Power is slowly running down, so instruments are switched off one by one.',
    scienceQuestion: 'What is space like beyond the Sun’s bubble, the heliosphere?',
    method: 'Measuring plasma waves and magnetic fields in interstellar space.',
    result: 'The first spacecraft to measure the interstellar environment directly.',
    takeaway: 'Not every explorer has fallen silent — some are still sending news from the edge.',
    claims: [
      {
        id: 'voy-launch',
        text: 'Voyager 1 launched on Sept. 5, 1977.',
        sourceIds: ['voyager1'],
      },
      {
        id: 'voy-interstellar',
        text: 'On Aug. 25, 2012, Voyager 1 became the first spacecraft to exit the heliosphere and measure interstellar space.',
        sourceIds: ['voyager1', 'voyager'],
      },
      {
        id: 'voy-status',
        text: 'NASA lists Voyager’s status as “Extended Mission”.',
        sourceIds: ['voyager'],
      },
      {
        id: 'voy-power',
        text: 'Voyager 1 is running low on power, losing about 4 watts each year; after April 2026 it has two operating science instruments.',
        sourceIds: ['voyagerLecp'],
      },
      {
        id: 'voy-light-day',
        text: 'In November 2026, NASA counts down to Voyager 1 reaching about one light-day from Earth.',
        sourceIds: ['voyager'],
      },
    ],
    primarySourceId: 'voyager',
    credits: [ILLUSTRATION_CREDIT],
  },
};

/** Sources shown at the end of each chapter (deduplicated, primary first). */
export function chapterSources(id: ChapterId): SourceRef[] {
  const mission = MISSIONS[id];
  const ids = new Set<string>([mission.primarySourceId]);
  for (const claim of mission.claims) for (const s of claim.sourceIds) ids.add(s);
  for (const entry of mission.chronology) ids.add(entry.sourceId);
  return [...ids].map((s) => getSource(s)).filter((s): s is SourceRef => Boolean(s));
}
