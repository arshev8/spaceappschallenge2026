# ECHOES — Science Sources (claim → source matrix)

All sources were opened and read on **2026-11-14** (the JPL 2004 release and the Golden Record page were added later the same day, for the mini-games). Every claim shown to learners comes from the page listed beside it. The same IDs appear in `src/content/missions.ts` under `SOURCES`. If a page did not support a claim, we softened or removed the claim; the end of this file lists those cases.

## Sources

| ID | Page | URL |
|---|---|---|
| `ilrsAp11` | NASA CDDIS / ILRS — Apollo 11 Lunar Laser Ranging Retroreflector | https://ilrs.cddis.eosdis.nasa.gov/missions/satellite_missions/current_missions/ap11_reflector.html |
| `nasaMoonArtifacts` | NASA History — Catalogue of Manmade Material on the Moon (background only) | https://www.nasa.gov/wp-content/uploads/static/history/humanartifacts.html |
| `nasaMoonFacts` | NASA Science — Earth's Moon: Facts | https://science.nasa.gov/moon/facts/ |
| `merOpportunity` | NASA Science — Mars Exploration Rover Opportunity | https://science.nasa.gov/mission/mer-opportunity/ |
| `opportunityEnd` | NASA Science — "NASA's Opportunity Rover Mission on Mars Comes to End" (Feb. 13, 2019) | https://science.nasa.gov/missions/mer/nasas-opportunity-rover-mission-on-mars-comes-to-end/ |
| `jpl2004` | NASA JPL — "Opportunity Rover Finds Strong Evidence Meridiani Planum Was Wet" (Mar. 2, 2004) | https://www.jpl.nasa.gov/news/opportunity-rover-finds-strong-evidence-meridiani-planum-was-wet |
| `marsFacts` | NASA Science — Mars: Facts | https://science.nasa.gov/mars/facts/ |
| `insight` | NASA Science — InSight Mars Lander | https://science.nasa.gov/mission/insight/ |
| `insightRetired` | NASA JPL — "NASA Retires InSight Mars Lander Mission After Years of Science" (Dec. 21, 2022) | https://www.jpl.nasa.gov/news/nasa-retires-insight-mars-lander-mission-after-years-of-science |
| `voyager` | NASA Science — Voyager | https://science.nasa.gov/mission/voyager/ |
| `voyager1` | NASA Science — Voyager 1 | https://science.nasa.gov/mission/voyager/voyager-1/ |
| `goldenRecord` | NASA Science — Golden Record Contents | https://science.nasa.gov/mission/voyager/golden-record-contents/ |
| `voyagerLecp` | NASA Science blog — "NASA Shuts Off Instrument on Voyager 1 to Keep Spacecraft Operating" (Apr. 17, 2026) | https://science.nasa.gov/blogs/voyager/2026/04/17/nasa-shuts-off-instrument-on-voyager-1-to-keep-spacecraft-operating/ |

## Claim matrix

### Apollo 11 — The Mirror That Never Went Silent

| Claim as shown to learners | Source | Supporting text on the source page (paraphrased or quoted) |
|---|---|---|
| 100 corner-cube reflectors, each 3.8 cm across, in a 46 cm aluminum panel | `ilrsAp11` | "100 fused silica corner cube reflectors, mounted in a 46 centimeter aluminum panel… Each… 3.8 centimeters in diameter." |
| The array is in the Sea of Tranquility | `ilrsAp11` | "The Apollo 11 and Apollo 14 arrays are located in the Sea of Tranquility and the Fra Mauro, respectively." |
| Observatories have regularly ranged the Moon using the Apollo reflectors | `ilrsAp11` | "Four observatories have regularly ranged the Moon with these reflectors." |
| Left on the Moon in 1969 by Apollo 11 | Project brief + `ilrsAp11` | The year is well established. The ILRS page names Apollo 11 but gives no exact deployment day, so we show only "1969". |
| The Moon moves about an inch (2.5 cm) farther from Earth each year | `nasaMoonFacts` | "getting about an inch farther away each year." |
| Round trip ≈ 2.56 s at 384,400 km | Calculation | 2 × 384,400 km ÷ 299,792.458 km/s = 2.564 s. 384,400 km is the commonly quoted average distance, labeled "often-used approximate". |

### Opportunity — The Rover That Outlived Its Mission

| Claim | Source | Supporting text |
|---|---|---|
| Launch July 7, 2003 | `merOpportunity` | "Launch Date and Time: July 7, 2003" |
| Landed Jan. 24, 2004 (PST) in Meridiani Planum, inside Eagle crater | `merOpportunity`, `opportunityEnd` | "landed on Mars on Jan. 24, 2004 PST"; "within an impact crater known as Eagle" |
| Designed for 90 sols and about 1,000 m of driving | `opportunityEnd` | "Designed to last just 90 Martian days and travel 1,100 yards (1,000 meters)" |
| A sol (Martian day) is about 24.6 hours | `jpl2004` | NASA JPL — "Opportunity Rover Finds Strong Evidence Meridiani Planum Was Wet" (Mar. 2, 2004) | https://www.jpl.nasa.gov/news/opportunity-rover-finds-strong-evidence-meridiani-planum-was-wet |
| `marsFacts` | "completes one rotation every 24.6 hours… Martian days are called sols." |
| Lasted almost 15 years; drove more than 28 miles (45 km) | `opportunityEnd`, `merOpportunity` | "at an end after almost 15 years"; "28.06 miles (45.16 kilometers)" |
| Found hematite, a mineral that forms in water | `opportunityEnd` | "Found hematite, a mineral that forms in water, at its landing site." |
| Strong signs of ancient water at Endeavour Crater | `opportunityEnd` | "Discovered strong indications at Endeavour Crater of the action of ancient water." |
| Region may have been habitable; **not proof of life** | `opportunityEnd`, `merOpportunity` | "may have been habitable for some period of time"; "evidence that Mars may once have been able to sustain microbial life" |
| Stopped communicating during a planet-wide dust storm in June 2018; last communication June 10, 2018 | `opportunityEnd` | "stopped communicating with Earth when a severe Mars-wide dust storm blanketed its location in June 2018"; "final communication was received June 10" |
| Sample: jarosite / sulfate salts in “El Capitan” (hydrated iron sulfate); water once flowed through the rocks | `jpl2004` | "a hydrated iron sulfate mineral called jarosite"; "Liquid water once flowed through these rocks. It changed their texture, and it changed their chemistry" |
| Sample: BB-sized spheres; several possible origins (volcanic, impact, minerals from solution), so shape alone is not decisive | `jpl2004` | "Round particles the size of BBs are embedded in the outcrop"; they "might be formed from volcanic eruptions, from lofting of molten droplets by a meteor impact, or from accumulation of minerals coming out of solution" |
| Endeavour Crater about 22 km (13 miles) wide | `merOpportunity` | "about 13 miles (22 kilometers) in diameter" |
| NASA declared the mission over Feb. 13, 2019, after more than a thousand commands | `opportunityEnd`, `merOpportunity` | "Feb. 13, 2019: NASA declares End of Mission"; "After more than a thousand commands to restore contact" |

### InSight — Listening to the Heart of Mars

| Claim | Source | Supporting text |
|---|---|---|
| Launched May 5, 2018 | `insight` | "Launched: May 5, 2018" |
| Landed Nov. 26, 2018, on Elysium Planitia | `insight` | "Landed: Nov. 26, 2018"; "Landing Site: Elysium Planitia, Mars" |
| Seismometer called SEIS (Seismic Experiment for Interior Structure) | `insightRetired` | "Seismic Experiment for Interior Structure (SEIS) instrument" |
| Detected 1,319 marsquakes, including some caused by meteoroid impacts | `insightRetired` | "detected 1,319 marsquakes, including quakes caused by meteoroid impacts" |
| Seismometer data lets scientists study the crust, mantle and core | `insightRetired` | "provides scientists a way to study the planet's crust, mantle, and core" |
| Last communication Dec. 15, 2022; mission end announced Dec. 21, 2022 | `insightRetired`, `insight` | "The last time InSight communicated with Earth was Dec. 15"; release dated Dec. 21, 2022; mission page "End of Mission: Dec. 15, 2022" |

### Voyager 1 — Beyond the Last Planet

| Claim | Source | Supporting text |
|---|---|---|
| Launched Sept. 5, 1977 | `voyager1` | "Launch Date and Time: Sept. 5, 1977" |
| Most distant human-made object since Feb. 17, 1998 | `voyager1` | "On Feb. 17, 1998, Voyager 1 became the most distant human-made object in existence" |
| First to leave the heliosphere and measure interstellar space, Aug. 25, 2012 | `voyager1`, `voyager` | "On Aug. 25, 2012, the spacecraft became the first to exit the heliosphere…" |
| Status "Extended Mission" (an active mission) | `voyager` | "Status: Extended Mission"; "Active Mission" |
| Nuclear-powered (RTGs); loses about 4 watts per year | `voyager1`, `voyagerLecp` | "Radioisotope Thermoelectric Generators"; "Both probes lose about 4 watts of power each year." |
| An instrument (LECP) was switched off Apr. 17, 2026; two science instruments still operate | `goldenRecord` | NASA Science — Golden Record Contents | https://science.nasa.gov/mission/voyager/golden-record-contents/ |
| `voyagerLecp` | "Voyager 1 still has two remaining operating science instruments — one that listens to plasma waves and one that measures magnetic fields." |
| Golden Record: 12-inch gold-plated record on both Voyagers; 115 images; greetings in fifty-five languages; natural sounds (surf, wind, thunder, birds, whales); an eclectic 90-minute music selection; symbolic cover instructions; aluminum jacket | `goldenRecord` | "carry a 12-inch gold-plated phonograph record"; "115 images"; "fifty-five languages"; "90-minute selection of music"; "Instructions, in symbolic language…"; "protective aluminum jacket" |
| In November 2026 NASA is counting down to about one light-day from Earth | `voyager` | The page shows a countdown to Nov. 18, 2026 and says Voyager 1 is "on the brink of" reaching one light-day. We word this as a countdown, not as something that has already happened. |

## Claims softened or omitted

| Original idea | What we found | Decision |
|---|---|---|
| "Laser ranging shows the Moon recedes 3.8 cm/yr" | No NASA page we read gives 3.8 cm/yr or links the recession to laser ranging. Two candidate NASA/JPL articles return 404. | We use the NASA Moon Facts wording "about an inch a year" and don't say which measurement produced it. |
| Exact Apollo 11 deployment date | Not stated on the ILRS page. | We show only "1969". |
| Opportunity "blueberries" as hematite, gypsum veins (2011), clay at Endeavour (2013) | The 2004 JPL page does not say "hematite" or "blueberries"; the 2011/2013 JPL URLs returned 404. | Omitted. The spheres card uses the 2004 wording (several possible origins). Hematite comes only from the 2019 end-of-mission article. |
| Crossbedding as water evidence | The 2004 page says crossbedding "can result from the action of wind or water" (preliminary). | Not used as a game sample, to avoid an ambiguous answer key. |
| Golden Record "gold-plated copper" | The NASA page says only "gold-plated". | We say "gold-plated". |
| InSight largest quake (magnitude 4.7), core size, liquid core | Not on the cited pages. | Omitted. We say only that the data "gives a way to study crust, mantle and core". |
| Voyager 1 "four functioning instruments" (Voyager 1 page, In Depth section) | Conflicts with the newer Apr. 17, 2026 blog ("two remaining operating science instruments"). | We use the newer blog. Recheck before release. |
| InSight power loss caused by dust | Plausible, but not stated on the pages we read. | We say "after its power ran too low". |
| Opportunity's "final words" | The viral quote "my battery is low and it's getting dark" is not a real transmission. | Never used. An integrity check rejects it. |
