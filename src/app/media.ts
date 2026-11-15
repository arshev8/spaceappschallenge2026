/**
 * NASA imagery bundled in /public/media (downloaded from the NASA Image and Video
 * Library, images.nasa.gov, and converted to WebP). NASA still images are generally
 * not copyrighted; credit lines follow NASA's media guidelines. `kind` distinguishes
 * real photographs from artist concepts so illustrations are never passed off as photos.
 */
export type MediaKind = 'photo' | 'artist-concept' | 'mosaic';
export type Media = {
  file: string;
  alt: string;
  caption: string;
  credit: string;
  nasaId: string;
  kind: MediaKind;
  width: number;
  height: number;
  /** object-position for cropped (cover) display, e.g. '50% 30%'. */
  focus?: string;
  /** 'contain' for whole-object images (planet globes) that must never be cropped. */
  fit?: 'contain';
};

const m = (file: string, nasaId: string, kind: MediaKind, width: number, height: number, alt: string, caption: string, credit = 'NASA', framing: Pick<Media, 'focus' | 'fit'> = {}): Media =>
  ({ file, nasaId, kind, width, height, alt, caption, credit, ...framing });
const globe = { fit: 'contain' } as const;

export const MEDIA = {
  earth: m('earth', 'as17-148-22727', 'photo', 1280, 1280, 'Earth as a full globe, with Africa and Antarctica under swirling clouds.', 'Earth seen by the Apollo 17 crew on the way to the Moon, Dec. 7, 1972.', 'NASA', globe),
  moon: m('moon', 'GSFC_20171208_Archive_e000868', 'mosaic', 1280, 1280, 'The full Moon, grey with dark plains and bright craters.', 'Full Moon built from Lunar Reconnaissance Orbiter data.', 'NASA Goddard Space Flight Center', globe),
  mars: m('mars', 'PIA00407', 'mosaic', 1280, 1280, 'Mars as a rust-orange globe with a white polar cap and the long scar of a canyon system.', 'Global color view of Mars.', 'NASA/JPL', globe),
  jupiter: m('jupiter', 'PIA00014', 'photo', 895, 848, 'The curved edge of Jupiter, with the orange Great Red Spot, white oval storms and wavy cream and brown cloud bands.', 'Jupiter’s Great Red Spot and its surroundings, photographed by Voyager 1 on Feb. 25, 1979, from 9.2 million km away.', 'NASA/JPL', { focus: '45% 35%' }),
  jupiter1979: m('jupiter-1979', 'PIA00359', 'photo', 916, 783, 'Close-up of Jupiter’s clouds: the reddish oval of the Great Red Spot at upper right, a white oval below it and turbulent swirls to the left.', 'Jupiter’s Great Red Spot (upper right) and the turbulent region to its west, photographed by Voyager 1 on March 1, 1979, four days before its closest approach.', 'NASA/JPL', { focus: '60% 40%' }),
  saturn: m('saturn', 'PIA00400', 'photo', 860, 1230, 'Saturn and its wide rings in natural color, with small icy moons nearby.', 'Saturn and four icy moons in approximate natural color.', 'NASA/JPL', globe),
  paleBlueDot: m('pale-blue-dot', 'PIA00452', 'photo', 453, 614, 'A dark frame crossed by bands of scattered sunlight, with Earth as a tiny pale dot.', 'The “Pale Blue Dot”: Earth photographed by Voyager 1 from about 6 billion km away, 1990.', 'NASA/JPL', globe),
  a11Easep: m('a11-easep', 'as11-37-5551', 'photo', 1280, 1280, 'Grey lunar soil covered in bootprints, with two small experiment packages in the distance and part of the lunar module in the foreground.', 'The Apollo 11 laser reflector (closer, right) and seismometer (farther back), photographed from inside the lunar module, July 20, 1969.'),
  a11Launch: m('a11-launch', '6900556', 'photo', 1280, 1015, 'A rocket climbing diagonally through a black sky, trailing a long white plume.', 'Apollo 11’s Saturn V rocket climbing toward orbit, July 16, 1969.', 'NASA/MSFC'),
  a11Earthrise: m('a11-earthrise', 'as11-44-6552', 'photo', 1280, 1280, 'A half-lit Earth rising above the grey, cratered horizon of the Moon.', 'Earth rising over the Moon, photographed from the Apollo 11 spacecraft, July 1969.', 'NASA', { focus: '50% 32%' }),
  a11Bootprint: m('a11-bootprint', 'as11-40-5877', 'photo', 1280, 1280, 'A crisp, ridged bootprint pressed into fine grey lunar soil.', 'An Apollo 11 bootprint in the lunar soil, July 20, 1969.', 'NASA', { focus: '45% 55%' }),
  oppRover: m('opp-rover', 'PIA04421', 'photo', 1280, 834, 'A six-wheeled rover with a tall white camera mast and flat solar panels in a clean room, with its engineering team and a much smaller rover beside it.', 'Spirit (Rover 2), Opportunity’s identical twin, at JPL in February 2003 with its assembly team and a flight spare of the small Sojourner rover.', 'NASA/JPL', { focus: '40% 60%' }),
  oppSelfie: m('opp-selfie', 'PIA17759', 'mosaic', 1280, 1041, 'Looking down on a rover’s dusty solar panels and deck from its camera mast, with reddish ground all around.', 'Opportunity’s self-portrait, taken in January 2014, about three weeks before its tenth anniversary on Mars.', 'NASA/JPL-Caltech/Cornell/Arizona State Univ.', { focus: '50% 45%' }),
  oppShadow: m('opp-shadow', 'PIA06739', 'photo', 1024, 1024, 'A black-and-white view of a rover’s long shadow stretching across rocky ground into a crater.', 'Opportunity catches its own shadow inside Endurance Crater, July 2004 (Sol 180).', 'NASA/JPL', { focus: '50% 45%' }),
  oppPanorama: m('opp-panorama', 'PIA19109', 'photo', 1280, 316, 'A wide view across a reddish crater basin from a high rim, with rover hardware in the foreground.', 'Opportunity’s view from the Cape Tribulation rim of Endeavour Crater, 2015.', 'NASA/JPL-Caltech/Cornell/Arizona State Univ.', { focus: '50% 60%' }),
  oppBlueberries: m('opp-blueberries', 'PIA06779', 'photo', 819, 819, 'Microscope view of small round grains, some smooth and dark, some rough and light, embedded in rock.', 'Opportunity’s microscopic imager: rough “popcorn” spherules next to the smoother “blueberries.”', 'NASA/JPL/Cornell/USGS'),
  insightFirst: m('insight-first', 'PIA22876', 'mosaic', 1280, 729, 'A lander deck with two round solar panels, clean and bright, on reddish ground.', 'InSight’s first selfie on Mars, Dec. 6, 2018 (Sol 10).', 'NASA/JPL-Caltech'),
  insightFinal: m('insight-final', 'PIA25287', 'mosaic', 1280, 768, 'The same lander, its solar panels now coated in reddish dust.', 'InSight’s final selfie, April 24, 2022 (Sol 1,211), covered in dust.', 'NASA/JPL-Caltech'),
  insightDeck: m('insight-deck', 'PIA22871', 'photo', 1024, 1024, 'A copper hexagonal instrument cover in front of a grey dome, with a black cylinder and a robotic arm above.', 'InSight’s deck on Sol 8: the SEIS seismometer under its copper cover, the grey wind and thermal shield behind it, and the HP3 heat probe at left.', 'NASA/JPL-Caltech'),
  voyagerTest: m('voyager-test', 'PIA21737', 'photo', 1280, 1221, 'Engineers in white clean-room suits work around a spacecraft with a large white dish antenna, hanging in a dark test chamber.', 'One of the two Voyager spacecraft in JPL’s 25-foot space simulator chamber, April 27, 1977.', 'NASA/JPL-Caltech', { focus: '55% 40%' }),
  voyagerLaunch: m('voyager-launch', 'PIA21747', 'photo', 1018, 1280, 'A rocket lifting off from a launch pad in a huge cloud of white exhaust.', 'Voyager 1 launches on a Titan/Centaur rocket, Sept. 5, 1977.', 'NASA/JPL'),
  oppEndeavour: m('opp-endeavour', 'PIA14508', 'photo', 1600, 874, 'A wide, dusty plain leading to the low, rounded hills of a distant crater rim under a hazy sky.', 'The western rim of Endeavour Crater, seen by Opportunity in 2011 after a three-year drive.', 'NASA/JPL-Caltech/Cornell/Arizona State Univ.', { focus: '50% 55%' }),
  oppBurns: m('opp-burns', 'PIA15091', 'photo', 862, 647, 'A steep slope of layered rock, labeled to show ancient dunes, ancient streams and ancient groundwater.', 'Layers in Burns Cliff studied by Opportunity, labeled to show the dunes, streams and groundwater that shaped them.', 'NASA/JPL-Caltech/Cornell/Arizona State Univ.'),
  a14Lrrr: m('a14-lrrr', 'as14-67-09386', 'photo', 1280, 1280, 'A small metal panel of mirrors standing on grey lunar soil, with bootprints around it.', 'The laser reflector left by Apollo 14 at Fra Mauro, Feb. 5, 1971.', 'NASA', { focus: '45% 62%' }),
  a15Lrrr: m('a15-lrrr', 'PIA13037', 'photo', 752, 752, 'An orbital view of a cratered landing site, with labels marking the reflector, the experiment station and the lander’s descent stage.', 'The Apollo 15 landing site seen from orbit by the Lunar Reconnaissance Orbiter; the circle marks the laser reflector.', 'NASA/GSFC/Arizona State University'),
  viking1: m('viking1', 'PIA00381', 'photo', 1439, 512, 'A black-and-white view of rocks and dust, with one round lander footpad in the lower right.', 'The first photograph ever taken on the surface of Mars, by Viking 1, July 20, 1976. Its footpad is at lower right.', 'NASA/JPL', { focus: '62% 50%' }),
  curiosity: m('curiosity', 'PIA19808', 'mosaic', 1280, 779, 'A six-wheeled rover with a tall mast photographed from low down on a rocky slope.', 'Curiosity’s low-angle selfie at the “Buckskin” drill site on Mount Sharp, Aug. 2015.', 'NASA/JPL-Caltech/MSSS', { focus: '58% 45%' }),
  perseverance: m('perseverance', 'PIA24542', 'mosaic', 1280, 941, 'A rover on rippled reddish ground, with a small helicopter standing a few meters behind it.', 'Perseverance’s selfie with the Ingenuity helicopter in Jezero Crater, April 6, 2021.', 'NASA/JPL-Caltech/MSSS', { focus: '60% 50%' }),
  mercury: m('mercury', 'GSFC_20171208_Archive_e001870', 'photo', 1197, 926, 'A cratered, grey-brown surface with bright young craters and subtle blue and tan tones.', 'Mercury’s surface in enhanced color, seen by the MESSENGER spacecraft.', 'NASA/JHUAPL/Carnegie Institution of Washington'),
  venus: m('venus', 'PIA23791', 'photo', 1095, 1096, 'A pale, cream-colored globe wrapped in smooth, swirling clouds.', 'Venus wrapped in clouds, seen by Mariner 10 in 1974 (reprocessed view).', 'NASA/JPL-Caltech', globe),
  uranus: m('uranus', 'PIA18182', 'photo', 1280, 1280, 'A smooth, pale blue-green globe with almost no visible features.', 'Uranus as seen by Voyager 2 in 1986.', 'NASA/JPL-Caltech', globe),
  neptune: m('neptune', 'PIA01492', 'photo', 1280, 1278, 'A deep blue globe with a dark oval storm and bright white clouds.', 'Neptune and its Great Dark Spot, from Voyager 2’s last whole-planet images, 1989.', 'NASA/JPL', globe),
  sun: m('sun', 'PIA26681', 'photo', 1280, 1280, 'The Sun glowing gold, its surface crowded with bright loops and darker patches.', 'The Sun in extreme ultraviolet light, seen by the Solar Dynamics Observatory, Sept. 10, 2025.', 'NASA/SDO', globe),
  a11LrrrDeploy: m('a11-lrrr-deploy', 'as11-40-5948', 'photo', 1280, 1280, 'An astronaut in a white spacesuit stands on grey lunar soil beside two freshly set-up experiments, with a flag and the lunar module in the distance.', 'Buzz Aldrin beside the seismometer he has just set up (front) and the laser reflector (behind it), photographed by Neil Armstrong, July 20, 1969.', 'NASA', { focus: '40% 60%' }),
  a11Eagle: m('a11-eagle', 'as11-40-5927', 'photo', 1280, 1280, 'The gold-foil-wrapped lunar module standing on four legs on grey lunar soil, with an astronaut working beside it.', 'The lunar module Eagle at Tranquility Base as Buzz Aldrin unloads its science experiments, July 20, 1969.', 'NASA', { focus: '50% 30%' }),
  a11Aldrin: m('a11-aldrin', 'as11-40-5903', 'photo', 1280, 1250, 'An astronaut in a white spacesuit and gold visor stands on the grey lunar surface, facing the camera.', 'Buzz Aldrin on the Moon near the lunar module, photographed by Neil Armstrong, July 20, 1969.', 'NASA', { focus: '50% 12%' }),
  laserRanging: m('laser-ranging-gsfc', 'GSFC_20171208_Archive_e001974', 'photo', 1600, 1065, 'Thin laser beams rise from an observatory across a dark blue night sky toward the bright Moon.', 'Lasers from NASA Goddard’s laser ranging facility point at the Moon, Sept. 18, 2010. That night they targeted the Lunar Reconnaissance Orbiter; ranging to the Apollo reflectors works the same way.', 'NASA/GSFC/Debbie McCallum', { focus: '72% 40%' }),
  oppCleanDeck: m('opp-clean-deck', 'PIA18079', 'mosaic', 1280, 1025, 'Looking down from a rover’s camera mast at its mostly clean solar panels, with its robotic arm reaching forward over reddish ground.', 'Opportunity’s self-portrait in late March 2014, after Martian winds blew much of the dust off its solar panels.', 'NASA/JPL-Caltech/Cornell Univ./Arizona State Univ.', { focus: '50% 40%' }),
  oppElCapitan: m('opp-el-capitan', 'PIA05492', 'mosaic', 1209, 790, 'Reddish bedrock in thin, stacked layers, broken into rounded blocks and dusted with sand.', 'Part of “El Capitan,” the layered outcrop Opportunity studied inside Eagle Crater in 2004. Its rocks showed that water once soaked them.', 'NASA/JPL/Cornell'),
  dustStorm2018: m('dust-storm-2018', 'PIA22329', 'mosaic', 1600, 719, 'A flat map of the whole of Mars blurred by tan dust clouds, with a small blue dot marking a rover’s location.', 'The 2018 dust storm on June 6, mapped by Mars Reconnaissance Orbiter; the blue dot marks Opportunity. Black slivers are gaps in coverage.', 'NASA/JPL-Caltech/MSSS', { focus: '48% 45%' }),
  insightWts: m('insight-wts', 'PIA23177', 'photo', 1024, 1024, 'A smooth, silvery dome resting on reddish ground, with part of the lander’s robotic arm above it.', 'InSight’s Wind and Thermal Shield covering its seismometer on Mars, Sol 110 (March 2019).', 'NASA/JPL-Caltech', { focus: '50% 65%' }),
  insightArrays: m('insight-arrays', 'PIA19664', 'photo', 1600, 1067, 'Technicians in clean-room suits work around a lander whose two round, many-sided solar panels are spread open.', 'InSight with its solar arrays deployed in a test at Lockheed Martin near Denver, April 30, 2015.', 'NASA/JPL-Caltech/Lockheed Martin', { focus: '45% 50%' }),
  voyager2Jpl: m('voyager2-jpl', 'PIA21736', 'photo', 1280, 1018, 'Engineers in white clean-room suits work on a spacecraft topped by a large white dish antenna.', 'Voyager 2, Voyager 1’s identical twin, being worked on at JPL, March 23, 1977.', 'NASA/JPL-Caltech', { focus: '58% 40%' }),
  goldenRecord: m('golden-record', 'PIA21741', 'photo', 1012, 1280, 'A black-and-white photo of a gloved hand holding a shiny disc above its protective case.', 'The Voyager 1 Golden Record being prepared for installation on the spacecraft, 1977.', 'NASA/JPL-Caltech', { focus: '55% 55%' }),
  dss43: m('dss43', 'PIA23795', 'photo', 1600, 1200, 'Looking across the white bowl of a giant dish antenna to its central tower, with a red crane against a deep blue sky.', 'Deep Space Station 43 in Canberra, Australia, one of the 70-meter antennas NASA’s Deep Space Network uses to talk to the Voyagers, during upgrades in 2020.', 'NASA/JPL-Caltech', { focus: '55% 50%' }),
} satisfies Record<string, Media>;

export function mediaUrl(media: Media, size: 'sm' | 'lg' = 'lg') {
  return `./media/${media.file}${size === 'sm' ? '-sm' : ''}.webp`;
}
export function nasaPage(media: Media) {
  return `https://images.nasa.gov/details/${encodeURIComponent(media.nasaId)}`;
}
