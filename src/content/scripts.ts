/**
 * Narrative scripts. Each chapter is a linear list of scenes.
 * A scene with a `gate` cannot be left forwards until that experiment is solved.
 * Keep body copy under ~80 words per scene (checked by integrity.ts).
 */
import type { ChapterId } from './missions.ts';

export type SceneKind = 'hook' | 'problem' | 'experiment' | 'reveal' | 'discovery';

export type GateId = 'apollo-ranging' | 'opportunity-evidence' | 'insight-seismogram' | 'voyager-matching';

export type Scene = {
  id: string;
  kind: SceneKind;
  title: string;
  body: string[];
  /** Fictional first-person narration. Always rendered with the "Imagined narration" label. */
  narration?: string;
  gate?: GateId;
};

export const IMAGINED_NARRATION_LABEL = 'Imagined narration based on NASA mission records';

export const MAX_SCENE_WORDS = 80;

export const SCRIPTS: Record<ChapterId, Scene[]> = {
  apollo11: [
    {
      id: 'hook',
      kind: 'hook',
      title: 'A mirror on the Moon',
      body: [
        'In 1969, Apollo 11 astronauts left a small panel in the Sea of Tranquility. It has no battery, no radio and no moving parts.',
        'And yet scientists on Earth have kept using it for decades. How can something that never “talks” still help science?',
      ],
      narration:
        'I do not beep. I do not call home. I wait in the grey dust, and when light finds me, I send it straight back.',
    },
    {
      id: 'tool',
      kind: 'problem',
      title: 'The tool: a retroreflector',
      body: [
        'A retroreflector is a mirror that sends light back in the same direction it came from — like a bike reflector glowing back at headlights.',
        'The Apollo 11 panel holds 100 glass corner-cubes, each 3.8 cm across, in a 46 cm frame. Observatories fire a laser at it and catch the light that comes back.',
      ],
    },
    {
      id: 'experiment',
      kind: 'experiment',
      title: 'Experiment: time the light',
      body: [
        'Light is fast — about 300,000 km every second — but not instant. Choose a distance, fire a pulse and watch how long the round trip takes. Then solve the puzzle.',
      ],
      gate: 'apollo-ranging',
    },
    {
      id: 'reveal',
      kind: 'reveal',
      title: 'What real stations do',
      body: [
        'Real laser ranging stations do the same math with incredibly precise clocks: distance = speed of light × round-trip time ÷ 2.',
        'Only a tiny part of the laser light makes the journey home, so they need powerful lasers and sensitive detectors. Careful measurements help scientists study the Moon’s orbit. NASA notes the Moon drifts about an inch (2.5 cm) farther from Earth each year.',
      ],
    },
    {
      id: 'discovery',
      kind: 'discovery',
      title: 'Discovery: silent, not useless',
      body: [
        'The reflector’s job never needed power, so it never “ran out”. Its simple design lets it keep helping long after the astronauts went home.',
        'Engineering can outlive its original mission and still support science.',
      ],
    },
  ],

  opportunity: [
    {
      id: 'hook',
      kind: 'hook',
      title: 'Ninety sols… and then some',
      body: [
        'A sol is one Martian day — about 24.6 hours. Opportunity was built to work for 90 sols and drive about 1,000 meters.',
        'It landed in January 2004. It kept going for almost 15 years and drove more than 28 miles (45 km).',
      ],
      narration:
        'They hoped I would last one Martian season. Every morning the Sun rose, my panels woke up, and there was another rock to read.',
    },
    {
      id: 'problem',
      kind: 'problem',
      title: 'The question: was Mars once wet?',
      body: [
        'Today Mars is cold and dry. But scientists wondered whether liquid water once flowed there — and whether ancient Mars could have been a place where tiny life might survive.',
        'Water leaves fingerprints in rocks. Opportunity’s job was to read them.',
      ],
    },
    {
      id: 'experiment',
      kind: 'experiment',
      title: 'Experiment: be the geologist',
      body: [
        'First, choose every clue that supports the idea of ancient water. Then explore why sunlight mattered so much to a solar-powered rover.',
      ],
      gate: 'opportunity-evidence',
    },
    {
      id: 'reveal',
      kind: 'reveal',
      title: 'What the rocks told us',
      body: [
        'Opportunity’s discoveries pointed to liquid water on ancient Mars, and NASA says its landing region may have been habitable at some point in Martian history.',
        'That is evidence about past environments — not proof that life ever existed there.',
        'In June 2018, a planet-wide dust storm blocked the sunlight. Its final communication arrived on June 10, 2018. NASA declared the mission over on Feb. 13, 2019.',
      ],
    },
    {
      id: 'discovery',
      kind: 'discovery',
      title: 'Discovery: rocks remember',
      body: [
        'Water vanished from the Martian surface long ago, but the minerals it formed are still there to read.',
        'Rocks record the history of past environments.',
      ],
    },
  ],

  insight: [
    {
      id: 'hook',
      kind: 'hook',
      title: 'An explorer that never moved',
      body: [
        'In November 2018, InSight landed on a flat plain called Elysium Planitia. Unlike a rover, it stayed in one place for its whole mission.',
        'Instead of driving, it listened.',
      ],
      narration:
        'I could not wander. So I set a very patient ear on the ground and waited for Mars to shiver.',
    },
    {
      id: 'problem',
      kind: 'problem',
      title: 'The question: what is inside Mars?',
      body: [
        'Nobody can dig to the center of a planet. But a marsquake — a shaking of the Martian ground, like an earthquake on Earth — sends waves through the inside of Mars.',
        'InSight’s seismometer, called SEIS, recorded those vibrations.',
      ],
    },
    {
      id: 'experiment',
      kind: 'experiment',
      title: 'Experiment: read the wiggles',
      body: [
        'These three traces are synthetic illustrations made for this lesson — not real NASA recordings. Which one looks most like a marsquake or impact? Then answer one question about its two wave arrivals.',
      ],
      gate: 'insight-seismogram',
    },
    {
      id: 'reveal',
      kind: 'reveal',
      title: 'Waves as messengers',
      body: [
        'Seismic waves speed up, slow down, bend and bounce when they meet different layers. By comparing many quakes, scientists can build a model of what lies underneath.',
        'InSight detected 1,319 marsquakes, including some caused by meteoroid impacts. Its data gives scientists a way to study the crust, mantle and core of Mars.',
      ],
    },
    {
      id: 'discovery',
      kind: 'discovery',
      title: 'Discovery: listening is exploring',
      body: [
        'InSight last called home on Dec. 15, 2022, after its power ran too low. In four years of listening it turned faint shivers into a picture of a hidden world.',
        'You can study what lies beneath a planet’s surface without digging to its core.',
      ],
    },
  ],

  voyager: [
    {
      id: 'hook',
      kind: 'hook',
      title: 'Not every explorer is silent',
      body: [
        'The reflector waits on the Moon. Opportunity and InSight rest on Mars. But one machine from 1977 is still on the move.',
        'Voyager 1 launched on Sept. 5, 1977. It is not resting anywhere — it is flying through space, and it still sends data home.',
      ],
    },
    {
      id: 'problem',
      kind: 'problem',
      title: 'Beyond the Sun’s bubble',
      body: [
        'The Sun blows a bubble of particles around the planets called the heliosphere. On Aug. 25, 2012, Voyager 1 became the first spacecraft to leave it and measure interstellar space.',
        'Its nuclear power supply loses about 4 watts a year, so engineers switch instruments off one at a time. In 2026, two science instruments still work.',
      ],
    },
    {
      id: 'experiment',
      kind: 'experiment',
      title: 'Match each machine to its status',
      body: ['Four machines, four different stories. Choose the status that fits each one, then check your answers.'],
      gate: 'voyager-matching',
    },
    {
      id: 'discovery',
      kind: 'discovery',
      title: 'Epilogue: the signal goes on',
      body: [
        'In November 2026, NASA is counting down to Voyager 1 reaching about one light-day from Earth — so far that its radio message takes a whole day to arrive.',
        'Some machines fall silent. Their discoveries do not.',
      ],
    },
  ],
};

export const FUTURE_QUESTION =
  'Which machine launched in your lifetime do you think will still be teaching us 50 years from now — and why?';

export function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export function sceneWordCount(scene: Scene): number {
  return scene.body.reduce((n, p) => n + wordCount(p), 0);
}
