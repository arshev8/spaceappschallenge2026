/**
 * Data for the 3D Solar System. Orbits and sizes are compressed for usability
 * (the scene says so); everything shown as fact is standard NASA information.
 * Artifact coordinates are the published landing-site coordinates of each mission
 * (NASA / NSSDCA), rounded to two decimals.
 */
import type { Locale } from '../i18n';
import { SHELL_TRANSLATIONS } from './l10n';
import { MEDIA, type Media } from './media';
import type { ChapterId } from './missions';

/** English and Russian are written inline; other languages look the English text up in their pack (ShellTranslation.solar). */
export type Text = { en: string; ru: string };
export const pick = (text: Text, locale: Locale): string =>
  locale === 'en' || locale === 'ru' ? text[locale] : SHELL_TRANSLATIONS[locale]?.solar?.[text.en] ?? text.en;

/** Every English string in the 3D solar-system data (used to check that each language pack is complete). */
export function solarTexts(): string[] {
  const out = new Set<string>();
  const walk = (value: unknown) => {
    if (!value || typeof value !== 'object') return;
    const v = value as Record<string, unknown>;
    if (typeof v.en === 'string' && typeof v.ru === 'string' && Object.keys(v).length === 2) { out.add(v.en); return; }
    for (const child of Object.values(v)) if (child && typeof child === 'object' && !('file' in (child as object))) walk(child);
  };
  walk(PLANETS); walk(ARTIFACTS); walk(VOYAGER);
  return [...out];
}

export type PlanetId = 'sun' | 'mercury' | 'venus' | 'earth' | 'moon' | 'mars' | 'jupiter' | 'saturn' | 'uranus' | 'neptune';

export type Artifact = {
  id: string;
  body: 'moon' | 'mars';
  name: Text;
  /** Short marker label in the 3D scene. */
  label: Text;
  mission: Text;
  year: string;
  site: Text;
  lat: number;
  lon: number;
  media: Media;
  about: Text;
  chapter?: ChapterId;
  source: string;
};

export type Planet = {
  id: PlanetId;
  name: Text;
  tagline: Text;
  /** Scene units, deliberately not to scale. */
  radius: number;
  orbit: number;
  /** Degrees per second of animation at normal speed. */
  orbitSpeed: number;
  spin: number;
  tilt: number;
  color: string;
  texture?: string;
  /** Short note when the texture is not a natural-color photo map. */
  textureNote?: Text;
  atmosphere?: string;
  media: Media;
  facts: Text[];
  missions: { name: Text; when: Text; chapter?: ChapterId }[];
  /** Hardware NASA has left at or in this world, without coordinates. */
  hardware?: Text[];
  source: { label: string; url: string };
};

const t = (en: string, ru: string): Text => ({ en, ru });

export const PLANETS: Planet[] = [
  {
    id: 'sun', name: t('The Sun', 'Солнце'), tagline: t('The star every signal escapes from', 'Звезда, от которой улетает каждый сигнал'),
    radius: 6, orbit: 0, orbitSpeed: 0, spin: 2, tilt: 7.25, color: '#ffb547', media: MEDIA.sun,
    facts: [t('Holds about 99.8% of all the mass in the solar system.', 'В нём около 99,8% всей массы Солнечной системы.'), t('Its light takes about 8 minutes to reach Earth.', 'Его свет идёт до Земли около 8 минут.')],
    missions: [{ name: t('Solar Dynamics Observatory', 'Обсерватория SDO'), when: t('Watching since 2010', 'Наблюдает с 2010 года') }],
    source: { label: 'NASA Science · Sun', url: 'https://science.nasa.gov/sun/' },
  },
  {
    id: 'mercury', name: t('Mercury', 'Меркурий'), tagline: t('The smallest, swiftest planet', 'Самая маленькая и быстрая планета'),
    radius: .7, orbit: 13, orbitSpeed: 16, spin: 4, tilt: .03, color: '#9c8f86', texture: 'mercury',
    textureNote: t('Map in enhanced color from MESSENGER.', 'Карта MESSENGER в усиленных цветах.'), media: MEDIA.mercury,
    facts: [t('A year on Mercury lasts just 88 Earth days.', 'Год на Меркурии длится всего 88 земных суток.'), t('It is the planet closest to the Sun.', 'Это ближайшая к Солнцу планета.')],
    missions: [{ name: t('Mariner 10', '«Маринер-10»'), when: t('Flybys, 1974–1975', 'Пролёты, 1974–1975') }, { name: t('MESSENGER', 'MESSENGER'), when: t('Orbited 2011–2015', 'На орбите 2011–2015') }],
    hardware: [t('MESSENGER ended its mission by crashing into Mercury in April 2015.', 'MESSENGER завершил миссию, упав на Меркурий в апреле 2015 года.')],
    source: { label: 'NASA Science · Mercury', url: 'https://science.nasa.gov/mercury/' },
  },
  {
    id: 'venus', name: t('Venus', 'Венера'), tagline: t('A furnace under the clouds', 'Печь под облаками'),
    radius: 1.3, orbit: 19, orbitSpeed: 11, spin: -1, tilt: 177, color: '#e6c18a', texture: 'venus', atmosphere: '#ffd9a0',
    textureNote: t('Surface map from Magellan radar, seen through the clouds.', 'Карта поверхности по радару «Магеллана», сквозь облака.'), media: MEDIA.venus,
    facts: [t('Its surface is hot enough to melt lead.', 'Её поверхность достаточно горячая, чтобы расплавить свинец.'), t('It spins backward compared with most planets.', 'Она вращается в обратную сторону по сравнению с большинством планет.')],
    missions: [{ name: t('Mariner 2', '«Маринер-2»'), when: t('First planetary flyby, 1962', 'Первый пролёт у планеты, 1962') }, { name: t('Magellan', '«Магеллан»'), when: t('Radar mapping, 1990–1994', 'Радарная съёмка, 1990–1994') }],
    hardware: [t('Pioneer Venus probes descended to the surface in 1978.', 'Зонды Pioneer Venus спустились к поверхности в 1978 году.'), t('Magellan was sent into Venus’s atmosphere at the end of its mission in 1994.', '«Магеллан» в конце миссии в 1994 году направили в атмосферу Венеры.')],
    source: { label: 'NASA Science · Venus', url: 'https://science.nasa.gov/venus/' },
  },
  {
    id: 'earth', name: t('Earth', 'Земля'), tagline: t('Where every mission begins', 'Здесь начинается каждая миссия'),
    radius: 1.4, orbit: 26, orbitSpeed: 8, spin: 20, tilt: 23.4, color: '#4f8fd8', texture: 'earth', atmosphere: '#7fb8ff', media: MEDIA.earth,
    facts: [t('The only world known to have life.', 'Единственный известный мир, где есть жизнь.'), t('Laser stations here still aim at mirrors on the Moon.', 'Лазерные станции здесь до сих пор целятся в зеркала на Луне.')],
    missions: [{ name: t('Every mission in this museum', 'Все миссии этого музея'), when: t('Launched from here', 'Стартовали отсюда') }],
    source: { label: 'NASA Science · Earth', url: 'https://science.nasa.gov/earth/' },
  },
  {
    id: 'moon', name: t('The Moon', 'Луна'), tagline: t('Mirrors that still answer', 'Зеркала, которые всё ещё отвечают'),
    radius: .42, orbit: 2.8, orbitSpeed: 60, spin: 0, tilt: 6.7, color: '#bdb8ae', texture: 'moon', media: MEDIA.moon,
    facts: [t('Laser light takes about 2.6 seconds to get there and back.', 'Лазерный свет летит туда и обратно около 2,6 секунды.'), t('It drifts about 2.5 cm farther from Earth every year.', 'Каждый год она отдаляется от Земли примерно на 2,5 см.')],
    missions: [{ name: t('Apollo 11', '«Аполлон-11»'), when: t('Landed July 1969', 'Посадка в июле 1969'), chapter: 'apollo11' }, { name: t('Apollo 14 and 15', '«Аполлон-14» и «-15»'), when: t('Landed 1971', 'Посадки в 1971') }],
    source: { label: 'NASA Science · Moon', url: 'https://science.nasa.gov/moon/' },
  },
  {
    id: 'mars', name: t('Mars', 'Марс'), tagline: t('The most visited planet', 'Самая посещаемая планета'),
    radius: .95, orbit: 34, orbitSpeed: 4.3, spin: 19, tilt: 25.2, color: '#c8673f', texture: 'mars', atmosphere: '#ff9a72', media: MEDIA.mars,
    facts: [t('A Martian day, called a sol, lasts about 24.6 hours.', 'Марсианские сутки, сол, длятся около 24,6 часа.'), t('Radio signals take 3 to 22 minutes to cross between Earth and Mars.', 'Радиосигнал идёт между Землёй и Марсом от 3 до 22 минут.')],
    missions: [
      { name: t('Viking 1', '«Викинг-1»'), when: t('Landed 1976', 'Посадка в 1976') },
      { name: t('Spirit and Opportunity', 'Spirit и Opportunity'), when: t('Landed 2004', 'Посадка в 2004'), chapter: 'opportunity' },
      { name: t('Curiosity', 'Curiosity'), when: t('Landed 2012', 'Посадка в 2012') },
      { name: t('InSight', 'InSight'), when: t('Landed 2018', 'Посадка в 2018'), chapter: 'insight' },
      { name: t('Perseverance', 'Perseverance'), when: t('Landed 2021', 'Посадка в 2021') },
    ],
    source: { label: 'NASA Science · Mars', url: 'https://science.nasa.gov/mars/' },
  },
  {
    id: 'jupiter', name: t('Jupiter', 'Юпитер'), tagline: t('A giant made of storms', 'Гигант из бурь'),
    radius: 3.6, orbit: 50, orbitSpeed: 1.6, spin: 40, tilt: 3.1, color: '#d9b38c', texture: 'jupiter', media: MEDIA.jupiter,
    textureNote: t('Globe map built from Cassini photos taken during its Jupiter flyby, Dec. 2000 (NASA/JPL/Univ. of Arizona, PIA07782).', 'Карта планеты из снимков «Кассини» во время пролёта Юпитера, декабрь 2000 года (NASA/JPL/Univ. of Arizona, PIA07782).'),
    facts: [t('The largest planet: more than 1,300 Earths would fit inside.', 'Самая большая планета: внутри поместилось бы больше 1300 Земель.'), t('Its Great Red Spot is a storm wider than Earth.', 'Его Большое красное пятно — буря шире Земли.')],
    missions: [{ name: t('Voyager 1', '«Вояджер-1»'), when: t('Flyby, March 1979', 'Пролёт, март 1979'), chapter: 'voyager' }, { name: t('Galileo', '«Галилео»'), when: t('Orbited 1995–2003', 'На орбите 1995–2003') }, { name: t('Juno', 'Juno'), when: t('Arrived 2016', 'Прибыл в 2016') }],
    hardware: [t('Galileo’s probe parachuted into Jupiter’s clouds in 1995.', 'Зонд «Галилео» спустился на парашюте в облака Юпитера в 1995 году.'), t('The Galileo orbiter was sent into Jupiter in 2003.', 'Орбитальный аппарат «Галилео» направили в Юпитер в 2003 году.')],
    source: { label: 'NASA Science · Jupiter', url: 'https://science.nasa.gov/jupiter/' },
  },
  {
    id: 'saturn', name: t('Saturn', 'Сатурн'), tagline: t('Rings of ice', 'Кольца изо льда'),
    radius: 3.1, orbit: 68, orbitSpeed: 1.1, spin: 38, tilt: 26.7, color: '#e3cc92', texture: 'saturn', media: MEDIA.saturn,
    facts: [t('Its rings are mostly ice, from tiny grains to boulders.', 'Его кольца — в основном лёд: от крошечных крупинок до глыб.'), t('The rings are very wide but often only about 10 meters thick.', 'Кольца очень широкие, но часто толщиной всего около 10 метров.')],
    missions: [{ name: t('Voyager 1', '«Вояджер-1»'), when: t('Flyby, November 1980', 'Пролёт, ноябрь 1980'), chapter: 'voyager' }, { name: t('Cassini', '«Кассини»'), when: t('Orbited 2004–2017', 'На орбите 2004–2017') }],
    hardware: [t('Cassini ended its mission by diving into Saturn in September 2017.', '«Кассини» завершил миссию, нырнув в Сатурн в сентябре 2017 года.')],
    source: { label: 'NASA Science · Saturn', url: 'https://science.nasa.gov/saturn/' },
  },
  {
    id: 'uranus', name: t('Uranus', 'Уран'), tagline: t('The planet that rolls on its side', 'Планета, которая катится на боку'),
    radius: 2.1, orbit: 84, orbitSpeed: .55, spin: -30, tilt: 97.8, color: '#9fd8de', atmosphere: '#bdf2f5',
    textureNote: t('Shown as a smooth globe: Voyager 2 saw almost no cloud features.', 'Показан гладким шаром: «Вояджер-2» почти не увидел облачных деталей.'), media: MEDIA.uranus,
    facts: [t('Its axis is tilted about 98°, so it spins on its side.', 'Его ось наклонена примерно на 98°, поэтому он вращается на боку.'), t('Only one spacecraft has ever visited it.', 'Его посетил лишь один космический аппарат.')],
    missions: [{ name: t('Voyager 2', '«Вояджер-2»'), when: t('Flyby, January 1986', 'Пролёт, январь 1986') }],
    source: { label: 'NASA Science · Uranus', url: 'https://science.nasa.gov/uranus/' },
  },
  {
    id: 'neptune', name: t('Neptune', 'Нептун'), tagline: t('The windiest world', 'Самый ветреный мир'),
    radius: 2.0, orbit: 98, orbitSpeed: .4, spin: 32, tilt: 28.3, color: '#4166d8', texture: 'neptune', atmosphere: '#7aa2ff', media: MEDIA.neptune,
    facts: [t('It has the strongest winds measured in the solar system.', 'Здесь самые сильные ветры, измеренные в Солнечной системе.'), t('One year here lasts about 165 Earth years.', 'Один год здесь длится около 165 земных лет.')],
    missions: [{ name: t('Voyager 2', '«Вояджер-2»'), when: t('Flyby, August 1989', 'Пролёт, август 1989') }],
    source: { label: 'NASA Science · Neptune', url: 'https://science.nasa.gov/neptune/' },
  },
];

export const ARTIFACTS: Artifact[] = [
  { id: 'a11', body: 'moon', label: t('Apollo 11', '«Аполлон-11»'), name: t('Apollo 11 laser reflector', 'Лазерный отражатель «Аполлона-11»'), mission: t('Apollo 11', '«Аполлон-11»'), year: '1969',
    site: t('Sea of Tranquility', 'Море Спокойствия'), lat: .67, lon: 23.47, media: MEDIA.a11Easep, chapter: 'apollo11',
    about: t('100 corner-cube mirrors that need no power. Observatories still bounce lasers off them to measure the Moon’s distance.', '100 уголковых зеркал без всякого питания. Обсерватории до сих пор отражают от них лазер, чтобы измерить расстояние до Луны.'),
    source: 'https://ilrs.cddis.eosdis.nasa.gov/missions/satellite_missions/current_missions/ap11_reflector.html' },
  { id: 'a14', body: 'moon', label: t('Apollo 14', '«Аполлон-14»'), name: t('Apollo 14 laser reflector', 'Лазерный отражатель «Аполлона-14»'), mission: t('Apollo 14', '«Аполлон-14»'), year: '1971',
    site: t('Fra Mauro', 'Фра Мауро'), lat: -3.64, lon: -17.48, media: MEDIA.a14Lrrr,
    about: t('A second mirror array, the same size as Apollo 11’s. Together they let scientists measure the Moon’s motion from several points.', 'Вторая панель зеркал такого же размера, как у «Аполлона-11». Вместе они позволяют измерять движение Луны из нескольких точек.'),
    source: 'https://ilrs.cddis.eosdis.nasa.gov/missions/satellite_missions/current_missions/ap11_general.html' },
  { id: 'a15', body: 'moon', label: t('Apollo 15', '«Аполлон-15»'), name: t('Apollo 15 laser reflector', 'Лазерный отражатель «Аполлона-15»'), mission: t('Apollo 15', '«Аполлон-15»'), year: '1971',
    site: t('Hadley–Apennine', 'Хэдли — Апеннины'), lat: 26.13, lon: 3.63, media: MEDIA.a15Lrrr,
    about: t('The largest Apollo reflector, with 300 corner cubes. It returns the strongest echo, so it is the favorite target.', 'Самый большой отражатель «Аполлонов» — 300 уголковых зеркал. Он даёт самое сильное эхо, поэтому в него целятся чаще всего.'),
    source: 'https://ilrs.cddis.eosdis.nasa.gov/missions/satellite_missions/current_missions/ap11_general.html' },
  { id: 'viking1', body: 'mars', label: t('Viking 1', '«Викинг-1»'), name: t('Viking 1 lander', 'Посадочный модуль «Викинг-1»'), mission: t('Viking 1', '«Викинг-1»'), year: '1976',
    site: t('Chryse Planitia', 'Равнина Хриса'), lat: 22.27, lon: -47.95, media: MEDIA.viking1,
    about: t('The first spacecraft to work on the surface of Mars. It sent pictures and weather reports until 1982.', 'Первый аппарат, работавший на поверхности Марса. Он присылал снимки и сводки погоды до 1982 года.'),
    source: 'https://science.nasa.gov/mission/viking/' },
  { id: 'spirit', body: 'mars', label: t('Spirit', 'Spirit'), name: t('Spirit rover', 'Марсоход Spirit'), mission: t('Mars Exploration Rover', 'Mars Exploration Rover'), year: '2004',
    site: t('Gusev Crater', 'Кратер Гусев'), lat: -14.57, lon: 175.47, media: MEDIA.oppRover,
    about: t('Opportunity’s twin. It got stuck in soft sand in 2009 and last called home in March 2010. Pictured: Spirit itself at JPL before launch.', 'Близнец Opportunity. В 2009 году он увяз в мягком песке и в последний раз вышел на связь в марте 2010 года. На фото — сам Spirit в JPL перед запуском.'),
    source: 'https://science.nasa.gov/mission/mars-exploration-rovers-spirit-and-opportunity/' },
  { id: 'opportunity', body: 'mars', label: t('Opportunity', 'Opportunity'), name: t('Opportunity rover', 'Марсоход Opportunity'), mission: t('Mars Exploration Rover', 'Mars Exploration Rover'), year: '2004',
    site: t('Meridiani Planum', 'Плато Меридиана'), lat: -1.95, lon: -5.53, media: MEDIA.oppEndeavour, chapter: 'opportunity',
    about: t('Planned for 90 sols, it worked for almost 15 years and found rocks that formed in water.', 'Его рассчитывали на 90 солов, а он проработал почти 15 лет и нашёл породы, образовавшиеся в воде.'),
    source: 'https://science.nasa.gov/mission/mer-opportunity/' },
  { id: 'curiosity', body: 'mars', label: t('Curiosity', 'Curiosity'), name: t('Curiosity rover', 'Марсоход Curiosity'), mission: t('Mars Science Laboratory', 'Mars Science Laboratory'), year: '2012',
    site: t('Gale Crater', 'Кратер Гейл'), lat: -4.59, lon: 137.44, media: MEDIA.curiosity,
    about: t('A car-sized rover climbing Mount Sharp to read the layers of an ancient lake environment.', 'Марсоход размером с автомобиль поднимается на гору Шарп, чтобы прочитать слои древней озёрной среды.'),
    source: 'https://science.nasa.gov/mission/msl-curiosity/' },
  { id: 'insight', body: 'mars', label: t('InSight', 'InSight'), name: t('InSight lander', 'Посадочный модуль InSight'), mission: t('InSight', 'InSight'), year: '2018',
    site: t('Elysium Planitia', 'Равнина Элизий'), lat: 4.5, lon: 135.62, media: MEDIA.insightFirst, chapter: 'insight',
    about: t('A stationary listener. Its seismometer recorded 1,319 marsquakes before dust ended the mission in 2022.', 'Неподвижный слушатель. Его сейсмометр записал 1319 марсотрясений, пока пыль не завершила миссию в 2022 году.'),
    source: 'https://science.nasa.gov/mission/insight/' },
  { id: 'perseverance', body: 'mars', label: t('Perseverance', 'Perseverance'), name: t('Perseverance rover', 'Марсоход Perseverance'), mission: t('Mars 2020', 'Mars 2020'), year: '2021',
    site: t('Jezero Crater', 'Кратер Езеро'), lat: 18.44, lon: 77.45, media: MEDIA.perseverance,
    about: t('Exploring an ancient river delta and sealing rock samples in tubes. It brought the Ingenuity helicopter.', 'Исследует древнюю дельту реки и запечатывает образцы пород в трубки. Доставил на Марс вертолёт Ingenuity.'),
    source: 'https://science.nasa.gov/mission/mars-2020-perseverance/' },
];

/** Voyager 1's direction, roughly toward Ophiuchus: ~35° above the plane of the planets. Distance is symbolic. */
export const VOYAGER = {
  elevation: 35, azimuth: 255, distance: 140,
  name: t('Voyager 1', '«Вояджер-1»'),
  note: t('Direction is approximate and the distance is not to scale: in November 2026 it is about one light-day away.', 'Направление примерное, расстояние не в масштабе: в ноябре 2026 года до него около одного светового дня.'),
};
