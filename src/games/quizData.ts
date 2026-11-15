import { MEDIA, type Media } from '../app/media';

export type Question = { id: string; level: 1 | 2 | 3; media: Media; prompt: string; options: string[]; answer: number; fact: string };

/** Ordered easy → hard. Facts mirror sourced claims in src/content/missions.ts. */
export const QUESTIONS: Question[] = [
  { id: 'q-boot', level: 1, media: MEDIA.a11Bootprint, prompt: 'Where was this bootprint made?', options: ['On the Moon', 'In a desert on Earth', 'On Mars', 'On the ocean floor'], answer: 0,
    fact: 'Buzz Aldrin photographed it in 1969. With no wind or rain on the Moon, prints like this can last a very long time.' },
  { id: 'q-mars', level: 1, media: MEDIA.mars, prompt: 'Which planet is this?', options: ['Venus', 'Mars', 'Mercury', 'Jupiter'], answer: 1,
    fact: 'Mars gets its rusty color from iron-rich dust. Opportunity and InSight both explored it.' },
  { id: 'q-dust', level: 1, media: MEDIA.insightFinal, prompt: 'What slowly stopped InSight from working?', options: ['It ran out of rocket fuel', 'A meteorite hit it', 'Dust covered its solar panels', 'It tipped over'], answer: 2,
    fact: 'Compare its first and final selfies: dust piled up until there wasn’t enough power. By then it had detected 1,319 marsquakes.' },
  { id: 'q-jupiter', level: 2, media: MEDIA.jupiter, prompt: 'Voyager 1 photographed this giant storm in 1979. Which planet is it on?', options: ['Saturn', 'Neptune', 'Jupiter', 'Earth'], answer: 2,
    fact: 'Jupiter’s Great Red Spot is a storm larger than the whole Earth.' },
  { id: 'q-mirror', level: 2, media: MEDIA.a11Easep, prompt: 'What does the Apollo 11 laser reflector need to keep working?', options: ['Batteries', 'Nothing: it has no power at all', 'Solar panels', 'A radio link to Earth'], answer: 1,
    fact: 'It is a panel of 100 corner-cube mirrors. Light that hits it bounces straight back to where it came from.' },
  { id: 'q-sols', level: 2, media: MEDIA.oppSelfie, prompt: 'Opportunity was planned to work for 90 sols. How long did it actually last?', options: ['Exactly 90 sols', 'About 1 Earth year', 'About 5 years', 'Almost 15 years'], answer: 3,
    fact: 'A sol is one Martian day, about 24.6 hours. Opportunity drove more than 45 km before a dust storm in 2018.' },
  { id: 'q-berries', level: 2, media: MEDIA.oppBlueberries, prompt: 'Opportunity found small hematite-rich grains nicknamed “blueberries.” What do they suggest?', options: ['Water was once there', 'Life was once there', 'A volcano just erupted', 'There is ice there today'], answer: 0,
    fact: 'Hematite is a mineral that forms in water. That is evidence of a wet past, not proof of life.' },
  { id: 'q-seis', level: 3, media: MEDIA.insightDeck, prompt: 'How did InSight study the inside of Mars?', options: ['It drilled to the core', 'It listened to marsquakes with a seismometer', 'It took X-ray pictures', 'It drove into deep canyons'], answer: 1,
    fact: 'Seismic waves change as they pass through crust, mantle and core, so they reveal layers no one can see.' },
  { id: 'q-dot', level: 3, media: MEDIA.paleBlueDot, prompt: 'In this 1990 Voyager 1 photo, what is the tiny pale dot?', options: ['Mars', 'A distant star', 'Earth', 'The Moon'], answer: 2,
    fact: 'From about 6 billion km away, our whole planet is less than a pixel across: the Pale Blue Dot.' },
  { id: 'q-laser', level: 3, media: MEDIA.laserRanging, prompt: 'A laser pulse returns from the Moon after about 2.56 seconds. Light travels about 300,000 km per second. How far away is the Moon?', options: ['About 38,000 km', 'About 384,000 km', 'About 768,000 km', 'About 3.8 million km'], answer: 1,
    fact: 'Distance = speed of light × round-trip time ÷ 2. The pulse goes there AND back, so you divide by two.' },
];
