export type Destination = 'moon' | 'mars' | 'jupiter' | 'deep';
export type SlotId = 'power' | 'comms' | 'science' | 'landing';
export type Rating = 'great' | 'ok' | 'bad';
export type Part = {
  id: string;
  slot: SlotId;
  name: string;
  what: string;
  fit: Record<Destination, [Rating, string]>;
};

export const DESTINATIONS: { id: Destination; name: string; brief: string; color: string; media: 'moon' | 'mars' | 'jupiter' | 'paleBlueDot' }[] = [
  { id: 'moon', name: 'Moon surface', brief: 'Land near the equator and study the ground.', color: '#c9c4b8', media: 'moon' },
  { id: 'mars', name: 'Mars surface', brief: 'Survive dust, cold and a thin atmosphere.', color: '#ef9876', media: 'mars' },
  { id: 'jupiter', name: 'Jupiter flyby', brief: 'A giant planet with no solid surface, far from the Sun.', color: '#e2b58a', media: 'jupiter' },
  { id: 'deep', name: 'Interstellar space', brief: 'Keep working for decades beyond the planets.', color: '#b7a6ff', media: 'paleBlueDot' },
];

export const SLOTS: { id: SlotId; name: string; hint: string }[] = [
  { id: 'power', name: 'Power', hint: 'What keeps it running?' },
  { id: 'comms', name: 'Antenna', hint: 'How does it call home?' },
  { id: 'science', name: 'Instrument', hint: 'What will it study?' },
  { id: 'landing', name: 'Landing gear', hint: 'Land, roll or fly by?' },
];

export const PARTS: Part[] = [
  { id: 'solar', slot: 'power', name: 'Solar panels', what: 'Turn sunlight into electricity. Light and reliable, but useless without enough sunlight.',
    fit: { moon: ['ok', 'Works in daylight, but a lunar night lasts about two weeks.'], mars: ['ok', 'Powered Opportunity and InSight, until dust covered the panels.'], jupiter: ['ok', 'Sunlight there is about 25 times weaker, so panels must be huge.'], deep: ['bad', 'Far beyond the planets, sunlight is much too faint.'] } },
  { id: 'rtg', slot: 'power', name: 'Nuclear generator', what: 'A radioisotope generator turns heat from decaying plutonium into electricity, day or night, for decades.',
    fit: { moon: ['great', 'Steady power through the long, freezing lunar night.'], mars: ['great', 'Dust storms can’t block it. Curiosity uses one.'], jupiter: ['great', 'Doesn’t care how far the Sun is.'], deep: ['great', 'This is how Voyager has kept working since 1977.'] } },
  { id: 'battery', slot: 'power', name: 'Battery only', what: 'Stores energy but can’t make more. Fine for a backup, not for a whole mission.',
    fit: { moon: ['bad', 'It would run flat within days.'], mars: ['bad', 'It would run flat long before the science is done.'], jupiter: ['bad', 'The trip alone takes years.'], deep: ['bad', 'Decades of travel need a power source, not just storage.'] } },
  { id: 'hga', slot: 'comms', name: 'High-gain dish', what: 'A big dish that focuses radio into a narrow beam aimed at Earth. Strong signal over huge distances.',
    fit: { moon: ['great', 'More than enough to send lots of data home.'], mars: ['great', 'Lets you talk straight to Earth.'], jupiter: ['great', 'Essential at this distance.'], deep: ['great', 'Voyager’s 3.7 m dish still reaches Earth.'] } },
  { id: 'uhf', slot: 'comms', name: 'Relay radio', what: 'A small radio that talks to a nearby orbiter, which forwards the data to Earth.',
    fit: { moon: ['bad', 'There is no relay orbiter waiting for your probe in this mission.'], mars: ['great', 'InSight sent most of its data through Mars orbiters this way.'], jupiter: ['bad', 'No relay satellite out there to pass messages along.'], deep: ['bad', 'Nothing nearby to relay your signal.'] } },
  { id: 'lga', slot: 'comms', name: 'Small antenna', what: 'A simple antenna that sends a weak signal in all directions. Handy as a backup.',
    fit: { moon: ['ok', 'The Moon is close, so a weak signal still gets through, slowly.'], mars: ['ok', 'Very slow at this distance. Fine as a backup.'], jupiter: ['bad', 'Too weak to be heard from Jupiter.'], deep: ['bad', 'Your signal would be lost long before reaching Earth.'] } },
  { id: 'seis', slot: 'science', name: 'Seismometer', what: 'Feels tiny ground vibrations from quakes and impacts to reveal what’s inside a world.',
    fit: { moon: ['great', 'Apollo astronauts left seismometers that recorded moonquakes.'], mars: ['great', 'InSight’s seismometer detected 1,319 marsquakes.'], jupiter: ['bad', 'Jupiter has no solid surface to stand on.'], deep: ['bad', 'There’s no ground to shake in empty space.'] } },
  { id: 'rocklab', slot: 'science', name: 'Rock lab', what: 'A microscope camera and spectrometers that read what rocks are made of.',
    fit: { moon: ['great', 'Moon rocks tell the story of how the Moon formed.'], mars: ['great', 'Opportunity’s rock tools found evidence of ancient water.'], jupiter: ['bad', 'A flyby never touches any rocks.'], deep: ['bad', 'There are no rocks to sample out there.'] } },
  { id: 'camera', slot: 'science', name: 'Cameras', what: 'See landscapes, clouds and storms. Pictures help scientists and inspire everyone.',
    fit: { moon: ['great', 'Great for mapping the landing area.'], mars: ['great', 'Rover cameras pick targets and spot layered rock.'], jupiter: ['great', 'Voyager’s cameras revealed the Great Red Spot up close.'], deep: ['ok', 'Little to see out here, though Voyager took the Pale Blue Dot.'] } },
  { id: 'fields', slot: 'science', name: 'Field & particle sensors', what: 'Measure magnetic fields and charged particles flowing through space.',
    fit: { moon: ['ok', 'Useful, but the Moon has only weak magnetic patches.'], mars: ['ok', 'Mars lost its global magnetic field long ago.'], jupiter: ['great', 'Jupiter has the strongest magnetic field of any planet.'], deep: ['great', 'Particle sensors told scientists Voyager 1 had reached interstellar space.'] } },
  { id: 'wheels', slot: 'landing', name: 'Rover wheels', what: 'Land first, then drive to new places to explore.',
    fit: { moon: ['great', 'Drive between craters to explore more ground.'], mars: ['great', 'Opportunity drove more than 45 km.'], jupiter: ['bad', 'There is no ground to drive on.'], deep: ['bad', 'Wheels are dead weight in empty space.'] } },
  { id: 'legs', slot: 'landing', name: 'Landing legs', what: 'Touch down with rocket engines and stay put. A stable science station.',
    fit: { moon: ['great', 'Apollo’s lunar modules landed on legs.'], mars: ['great', 'InSight landed on three legs.'], jupiter: ['bad', 'You would sink into the clouds. There’s nowhere to land.'], deep: ['bad', 'Nowhere to land between the stars.'] } },
  { id: 'airbags', slot: 'landing', name: 'Airbags', what: 'A parachute slows you in the air; airbags let you bounce to a stop.',
    fit: { moon: ['ok', 'Possible, but tricky: with no air for a parachute, rockets must do all the braking first. The Soviet Luna 9 lander bounced down this way in 1966.'], mars: ['great', 'Opportunity bounced to a stop on airbags in 2004.'], jupiter: ['bad', 'There is no surface to bounce on.'], deep: ['bad', 'Nothing to land on out here.'] } },
  { id: 'flyby', slot: 'landing', name: 'No lander: fly by', what: 'Stay in space and study the target as you pass or orbit.',
    fit: { moon: ['ok', 'You could map it from orbit, but you won’t touch the ground.'], mars: ['ok', 'An orbiter sees the whole planet but can’t feel marsquakes.'], jupiter: ['great', 'Gas giants are explored from space. Voyager flew right past.'], deep: ['great', 'Keep flying. That is the whole mission.'] } },
];
