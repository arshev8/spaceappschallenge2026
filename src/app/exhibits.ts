import type { ChapterId } from './missions';
import { MEDIA, type Media } from './media';

/** A labelled point on a photo, as a percentage of its width/height. */
export type Hotspot = { id: string; x: number; y: number; name: string; detail: string };

export type Exhibit = {
  id: ChapterId;
  hue: string;
  hero: Media;
  inspect: { media: Media; hotspots: Hotspot[] };
  /** Short, sourced facts taken from src/content/missions.ts claims. */
  facts: { value: string; label: string }[];
  /** The journey from Earth, used for the animated route line. */
  journey: string[];
  discovery: string;
};

export const EXHIBITS: Record<ChapterId, Exhibit> = {
  apollo11: {
    id: 'apollo11', hue: '#c9c4b8', hero: MEDIA.a11Earthrise,
    inspect: {
      media: MEDIA.a11Easep,
      hotspots: [
        { id: 'a11-lrrr', x: 53, y: 30, name: 'Laser reflector', detail: 'A panel of 100 corner-cube reflectors. Laser light that hits it bounces straight back toward the telescope that sent it.' },
        { id: 'a11-psep', x: 40, y: 21, name: 'Seismometer', detail: 'The Passive Seismic Experiment listened for moonquakes and meteorite impacts.' },
        { id: 'a11-lm', x: 22, y: 40, name: 'Lunar module', detail: 'Part of the lander Eagle. The photo was taken from a window inside it.' },
        { id: 'a11-prints', x: 46, y: 83, name: 'Bootprints', detail: 'There is no wind or rain on the Moon to wipe these marks away.' },
      ],
    },
    facts: [{ value: '100', label: 'corner-cube reflectors' }, { value: '1969', label: 'left on the Moon' }, { value: '0 W', label: 'power needed' }],
    journey: ['Earth', 'Lunar orbit', 'Sea of Tranquility'],
    discovery: 'A mirror with no battery still helps measure the Earth–Moon distance.',
  },
  opportunity: {
    id: 'opportunity', hue: '#ef9876', hero: MEDIA.oppEndeavour,
    inspect: {
      media: MEDIA.oppRover,
      hotspots: [
        { id: 'opp-mast', x: 25, y: 27, name: 'Camera mast', detail: 'Panoramic and navigation cameras sat on a mast, so the rover could look around like a geologist.' },
        { id: 'opp-solar', x: 57, y: 58, name: 'Solar panels', detail: 'All of Opportunity’s power came from sunlight. Dust on the panels meant less energy.' },
        { id: 'opp-antenna', x: 35, y: 48, name: 'High-gain antenna', detail: 'A steerable dish for talking directly with Earth.' },
        { id: 'opp-arm', x: 28, y: 68, name: 'Robotic arm', detail: 'Carried a microscope camera, spectrometers and a rock grinder to study rocks up close.' },
        { id: 'opp-wheels', x: 44, y: 78, name: 'Six wheels', detail: 'Designed to drive about 1 km. Opportunity drove more than 45 km.' },
      ],
    },
    facts: [{ value: '90', label: 'sols planned' }, { value: '~15', label: 'years on Mars' }, { value: '45+ km', label: 'driven' }],
    journey: ['Earth', 'Cruise to Mars', 'Meridiani Planum'],
    discovery: 'Mars rocks preserved evidence of an ancient watery environment.',
  },
  insight: {
    id: 'insight', hue: '#e8b04b', hero: MEDIA.insightFirst,
    inspect: {
      media: MEDIA.insightDeck,
      hotspots: [
        { id: 'ins-seis', x: 60, y: 72, name: 'SEIS seismometer', detail: 'The copper cover protects the seismometer that detected marsquakes.' },
        { id: 'ins-shield', x: 49, y: 48, name: 'Wind and thermal shield', detail: 'Later placed over SEIS to block wind and temperature swings that create noise.' },
        { id: 'ins-hp3', x: 22, y: 45, name: 'HP3 heat probe', detail: 'Designed to hammer itself into the ground to measure heat escaping from inside Mars.' },
        { id: 'ins-arm', x: 55, y: 22, name: 'Robotic arm', detail: 'Lifted the instruments off the deck and set them on the Martian surface.' },
        { id: 'ins-panel', x: 95, y: 48, name: 'Solar panel', detail: 'One of two round solar arrays. Dust slowly covered them until power ran out in 2022.' },
      ],
    },
    facts: [{ value: '1,319', label: 'marsquakes detected' }, { value: '2018', label: 'landed' }, { value: '0 m', label: 'driven: it listened' }],
    journey: ['Earth', 'Cruise to Mars', 'Elysium Planitia'],
    discovery: 'Marsquakes revealed information about Mars’s interior.',
  },
  voyager: {
    id: 'voyager', hue: '#b7a6ff', hero: MEDIA.voyagerTest,
    inspect: {
      media: MEDIA.voyagerTest,
      hotspots: [
        { id: 'voy-dish', x: 74, y: 38, name: 'High-gain antenna', detail: 'A 3.7-meter dish that points at Earth to send data home and receive commands.' },
        { id: 'voy-scan', x: 40, y: 50, name: 'Science instruments', detail: 'Cameras and instruments, wrapped here in thermal blankets for the test. Some were switched off over the years to save power.' },
        { id: 'voy-bus', x: 77, y: 57, name: 'Ten-sided body', detail: 'The spacecraft’s main body holds its computers, radio and tape recorder. In flight, the nuclear power source and magnetometer booms (not fitted in this test) stick out from it.' },
      ],
    },
    facts: [{ value: '1977', label: 'launched' }, { value: '2012', label: 'reached interstellar space' }, { value: '~1', label: 'light-day from Earth in Nov. 2026' }],
    journey: ['Earth', 'Jupiter', 'Saturn', 'Interstellar space'],
    discovery: 'Still sending news from beyond the heliosphere.',
  },
};
