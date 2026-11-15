import type { ContentTranslation } from '../localize.ts';

const ART = 'Illustrationen und Diagramme: eigene CSS/SVG-Grafiken des ECHOES-Teams (keine NASA-Bilder).';

/** Deutsche Übersetzung der Wissenschaftsinhalte. Schlüssel und Reihenfolge entsprechen den englischen Daten. */
export const de: ContentTranslation = {
  missions: {
    apollo11: {
      title: 'Laser-Retroreflektor von Apollo 11',
      chapterTitle: 'Der Spiegel, der nie verstummte',
      target: 'Der Mond – Meer der Ruhe',
      hardwareType: 'Passive Retroreflektor-Anordnung (ohne Strom, ohne Funk)',
      chronology: [
        { date: '1969', event: 'Die Astronauten von Apollo 11 lassen die Reflektor-Anordnung auf dem Mond zurück.' },
        { date: '1969 → heute', event: 'Laser-Messstationen auf der Erde zielen bis heute auf die Apollo-Reflektoren.' },
      ],
      statusDetail: 'Hat keinen Strom und sendet kein eigenes Signal. Er wirft einfach das Laserlicht zurück, mit dem Sternwarten auf ihn zielen.',
      scienceQuestion: 'Wie weit ist der Mond entfernt – und wie verändert sich diese Entfernung?',
      method: 'Lunar Laser Ranging: Man misst, wie lange ein Laserpuls zum Reflektor und zurück braucht.',
      result: 'Entfernung = Lichtgeschwindigkeit × Laufzeit hin und zurück ÷ 2.',
      takeaway: 'Technik kann ihre ursprüngliche Mission überdauern und die Wissenschaft weiter unterstützen.',
      claims: {
        'ap11-cubes': 'Die Anordnung von Apollo 11 besteht aus 100 Tripelspiegeln aus Quarzglas mit je 3,8 cm Durchmesser in einer 46 cm großen Aluminiumplatte.',
        'ap11-location': 'Die Anordnung von Apollo 11 liegt im Meer der Ruhe.',
        'ap11-ranging': 'Sternwarten auf der Erde haben mithilfe der Apollo-Reflektoren regelmäßig die Entfernung zum Mond gemessen.',
        'moon-receding': 'Lasermessungen zeigen: Der Mond entfernt sich langsam von der Erde – jedes Jahr um etwa 3,8 cm.',
      },
      credits: [ART],
    },
    opportunity: {
      title: 'Mars Exploration Rover Opportunity',
      chapterTitle: 'Der Rover, der seine Mission überlebte',
      target: 'Mars – Meridiani Planum',
      hardwareType: 'Solarbetriebener sechsrädriger Rover',
      chronology: [
        { date: '7. Juli 2003', event: 'Start von der Erde.' },
        { date: '24. Januar 2004 (PST)', event: 'Landung in Meridiani Planum, in einem kleinen Krater namens Eagle.' },
        { date: '10. Juni 2018', event: 'Letzter Kontakt, während eines globalen Staubsturms.' },
        { date: '13. Februar 2019', event: 'Die NASA erklärt die Mission für beendet.' },
      ],
      statusDetail: 'Die Mission endete am 13. Februar 2019, nachdem mehr als tausend Befehle den Kontakt nicht wiederherstellen konnten.',
      scienceQuestion: 'War der frühe Mars einst feuchter – und vielleicht lebensfreundlich?',
      method: 'Zu Gesteinen fahren und ihre Minerale und Strukturen mit Kameras und Instrumenten untersuchen.',
      result: 'Fand Hämatit, ein Mineral, das in Wasser entsteht, und starke Hinweise auf uraltes Wasser am Endeavour-Krater. Das deutet auf frühere lebensfreundliche Bedingungen hin – ist aber kein Beweis für Leben.',
      takeaway: 'Gesteine speichern die Geschichte früherer Umgebungen.',
      claims: {
        'opp-90-sols': 'Opportunity war für 90 Sols (Marstage) und eine Fahrstrecke von etwa 1.000 Metern ausgelegt.',
        'opp-sol': 'Ein Sol ist ein Marstag; der Mars dreht sich alle 24,6 Stunden einmal um sich selbst.',
        'opp-15-years': 'Die Mission dauerte fast 15 Jahre, und der Rover fuhr mehr als 28 Meilen (45 km).',
        'opp-hematite': 'Opportunity fand an seinem Landeplatz Hämatit, ein Mineral, das in Wasser entsteht.',
        'opp-jarosite': 'Im Jahr 2004 fanden Instrumente Sulfatsalze, darunter Jarosit, ein wasserhaltiges Eisensulfat-Mineral, und das Team folgerte, dass einst flüssiges Wasser durch das Gestein floss.',
        'opp-spherules': 'Als die schrotkugelgroßen Kügelchen 2004 entdeckt wurden, kamen mehrere Entstehungswege infrage. Wenige Wochen später fand Opportunity heraus, dass sie reich an Hämatit sind, und das Team folgerte, dass sie in wassergetränktem Gestein gewachsen sind.',
        'opp-endeavour': 'Am Endeavour-Krater fand er starke Hinweise auf die Wirkung von uraltem Wasser.',
        'opp-dust': 'Der solarbetriebene Rover verstummte, als im Juni 2018 ein heftiger Staubsturm, der den ganzen Mars erfasste, seinen Standort bedeckte.',
      },
      credits: [ART],
    },
    insight: {
      title: 'Marslander InSight',
      chapterTitle: 'Dem Herzen des Mars lauschen',
      target: 'Mars – Elysium Planitia',
      hardwareType: 'Stationärer Lander mit Seismometer und Wärmeflusssonde',
      chronology: [
        { date: '5. Mai 2018', event: 'Start von der Erde.' },
        { date: '26. November 2018', event: 'Landung auf Elysium Planitia.' },
        { date: '15. Dezember 2022', event: 'Letzter Kontakt mit der Erde.' },
        { date: '21. Dezember 2022', event: 'Die NASA gibt das Ende der Mission bekannt.' },
      ],
      statusDetail: 'Die wissenschaftliche Mission endete im Dezember 2022, als dem Lander die Energie ausging.',
      scienceQuestion: 'Wie sieht das Innere des Mars aus?',
      method: 'Aufzeichnung von Bodenschwingungen mit dem Seismometer SEIS (Seismic Experiment for Interior Structure, seismisches Experiment zur inneren Struktur).',
      result: 'Registrierte 1.319 Marsbeben, darunter einige durch Meteoroideneinschläge, und gab der Forschung so eine Möglichkeit, Kruste, Mantel und Kern zu untersuchen.',
      takeaway: 'Man kann erforschen, was unter der Oberfläche eines Planeten liegt, ohne bis zu seinem Kern zu graben.',
      claims: {
        'ins-landing': 'InSight landete am 26. November 2018 auf Elysium Planitia auf dem Mars.',
        'ins-quakes': 'InSight registrierte 1.319 Marsbeben, darunter Beben, die durch Meteoroideneinschläge ausgelöst wurden.',
        'ins-interior': 'Die Seismometerdaten geben der Forschung eine Möglichkeit, Kruste, Mantel und Kern des Planeten zu untersuchen.',
        'ins-end': 'InSight hatte am 15. Dezember 2022 zum letzten Mal Kontakt mit der Erde.',
      },
      credits: [ART, 'Die Seismogramme in diesem Kapitel sind künstliche Illustrationen, keine Aufzeichnungen der NASA.'],
    },
    voyager: {
      title: 'Voyager 1',
      chapterTitle: 'Jenseits des letzten Planeten',
      target: 'Interstellarer Raum',
      hardwareType: 'Nuklear betriebene Tiefraumsonde (Radioisotopengeneratoren)',
      chronology: [
        { date: '5. September 1977', event: 'Start von der Erde.' },
        { date: '17. Februar 1998', event: 'Wird zum am weitesten entfernten von Menschen gebauten Objekt.' },
        { date: '25. August 2012', event: 'Verlässt die Heliosphäre und beginnt, den interstellaren Raum zu vermessen.' },
        { date: '17. April 2026', event: 'Ingenieure schalten ein weiteres Instrument ab, um Energie zu sparen.' },
      ],
      statusDetail: 'Immer noch unterwegs und immer noch in Kontakt mit der Erde. Die NASA führt ihren Status als „Extended Mission“ (verlängerte Mission). Die Energie geht langsam zur Neige, deshalb werden die Instrumente nacheinander abgeschaltet.',
      scienceQuestion: 'Wie sieht der Weltraum jenseits der Blase der Sonne, der Heliosphäre, aus?',
      method: 'Messung von Plasmawellen und Magnetfeldern im interstellaren Raum.',
      result: 'Die erste Raumsonde, die die interstellare Umgebung direkt gemessen hat.',
      takeaway: 'Nicht jeder Entdecker ist verstummt – manche schicken noch immer Nachrichten vom Rand.',
      claims: {
        'voy-launch': 'Voyager 1 startete am 5. September 1977.',
        'voy-interstellar': 'Am 25. August 2012 verließ Voyager 1 als erste Raumsonde die Heliosphäre und vermaß den interstellaren Raum.',
        'voy-status': 'Die NASA führt den Status von Voyager als „Extended Mission“ (verlängerte Mission).',
        'voy-power': 'Voyager 1 hat nur noch wenig Energie und verliert jedes Jahr etwa 4 Watt; seit April 2026 arbeiten noch zwei wissenschaftliche Instrumente.',
        'voy-golden-record': 'Beide Voyager-Sonden tragen eine vergoldete 12-Zoll-Schallplatte mit 115 Bildern, Grüßen in fünfundfünfzig Sprachen, Naturgeräuschen und 90 Minuten Musik.',
        'voy-light-day': 'Im November 2026 erreicht Voyager 1 eine Entfernung von etwa einem Lichttag von der Erde.',
      },
      credits: [ART],
    },
  },

  scenes: {
    apollo11: {
      hook: {
        title: 'Ein Spiegel auf dem Mond',
        body: [
          'Im Jahr 1969 ließen die Astronauten von Apollo 11 eine kleine Platte im Meer der Ruhe zurück. Sie hat keine Batterie, kein Funkgerät und keine beweglichen Teile.',
          'Und trotzdem nutzen Forschende auf der Erde sie seit Jahrzehnten. Wie kann etwas, das nie „spricht“, der Wissenschaft helfen?',
        ],
        narration: 'Ich piepse nicht. Ich rufe nicht nach Hause. Ich warte im grauen Staub, und wenn mich Licht findet, schicke ich es direkt zurück.',
      },
      tool: {
        title: 'Das Werkzeug: ein Retroreflektor',
        body: [
          'Ein Retroreflektor ist ein Spiegel, der Licht genau in die Richtung zurückschickt, aus der es kam – wie ein Fahrradreflektor, der im Scheinwerferlicht aufleuchtet.',
          'Die Platte von Apollo 11 trägt 100 gläserne Tripelspiegel mit je 3,8 cm Durchmesser in einem 46 cm großen Rahmen. Sternwarten schießen einen Laser darauf und fangen das zurückkommende Licht auf.',
        ],
      },
      experiment: {
        title: 'Miss die Entfernung zum Mond',
        body: [
          'Du leitest eine Laser-Messstation. Licht ist schnell – etwa 300.000 km pro Sekunde –, aber nicht unendlich schnell. Ziele auf den Reflektor, feuere einen Puls ab, miss die Zeit für Hin- und Rückweg und rechne diese Zeit in eine Entfernung um.',
        ],
      },
      reveal: {
        title: 'Was echte Stationen tun',
        body: [
          'Echte Laser-Messstationen rechnen genauso, nur mit unglaublich präzisen Uhren: Entfernung = Lichtgeschwindigkeit × Laufzeit hin und zurück ÷ 2.',
          'Nur ein winziger Teil des Laserlichts schafft den Rückweg, deshalb braucht man starke Laser und empfindliche Detektoren. Genau diese Messungen zeigten, dass sich der Mond jedes Jahr um etwa 3,8 cm von der Erde entfernt.',
        ],
      },
      discovery: {
        title: 'Entdeckung: still, aber nicht nutzlos',
        body: [
          'Der Reflektor brauchte für seine Aufgabe nie Strom, also konnte ihm auch nie „der Saft ausgehen“. Dank seiner einfachen Bauweise hilft er noch lange, nachdem die Astronauten heimgekehrt sind.',
          'Technik kann ihre ursprüngliche Mission überdauern und die Wissenschaft weiter unterstützen.',
        ],
      },
    },
    opportunity: {
      hook: {
        title: 'Neunzig Sols … und noch viel mehr',
        body: [
          'Ein Sol ist ein Marstag – etwa 24,6 Stunden. Opportunity wurde gebaut, um 90 Sols lang zu arbeiten und etwa 1.000 Meter zu fahren.',
          'Der Rover landete im Januar 2004. Er hielt fast 15 Jahre durch und fuhr mehr als 28 Meilen (45 km).',
        ],
        narration: 'Sie hofften, ich würde eine Marsjahreszeit durchhalten. Jeden Morgen ging die Sonne auf, meine Paneele erwachten, und es wartete ein weiterer Stein darauf, gelesen zu werden.',
      },
      problem: {
        title: 'Die Frage: War der Mars einst nass?',
        body: [
          'Heute ist der Mars kalt und trocken. Doch die Forschung fragte sich, ob dort einst flüssiges Wasser floss – und ob der frühe Mars ein Ort war, an dem winziges Leben hätte überleben können.',
          'Wasser hinterlässt Fingerabdrücke im Gestein. Opportunitys Aufgabe war es, sie zu lesen.',
        ],
      },
      experiment: {
        title: 'Folge dem Wasser',
        body: [
          'Du bist im Wissenschaftsteam des Rovers. Untersuche jede Probe auf der Karte, lies, was Opportunity beobachtet hat, und entscheide: Stützt sie die Idee von uraltem Wasser? Danach findest du heraus, warum Sonnenlicht so wichtig war.',
        ],
      },
      reveal: {
        title: 'Was uns die Gesteine verrieten',
        body: [
          'Opportunitys Entdeckungen deuteten auf flüssiges Wasser auf dem frühen Mars hin, und laut NASA könnte seine Landeregion irgendwann in der Marsgeschichte lebensfreundlich gewesen sein.',
          'Das sind Hinweise auf frühere Umgebungen – kein Beweis, dass dort jemals Leben existierte.',
          'Im Juni 2018 verdunkelte ein globaler Staubsturm das Sonnenlicht. Der letzte Kontakt kam am 10. Juni 2018. Die NASA erklärte die Mission am 13. Februar 2019 für beendet.',
        ],
      },
      discovery: {
        title: 'Entdeckung: Gestein erinnert sich',
        body: [
          'Das Wasser verschwand vor langer Zeit von der Marsoberfläche, doch die Minerale, die es bildete, kann man dort noch immer lesen.',
          'Gesteine speichern die Geschichte früherer Umgebungen.',
        ],
      },
    },
    insight: {
      hook: {
        title: 'Ein Entdecker, der sich nie bewegte',
        body: [
          'Im November 2018 landete InSight auf einer flachen Ebene namens Elysium Planitia. Anders als ein Rover blieb InSight während der ganzen Mission an einem Ort.',
          'Statt zu fahren, hörte InSight zu.',
        ],
        narration: 'Ich konnte nicht umherwandern. Also legte ich ein sehr geduldiges Ohr auf den Boden und wartete darauf, dass der Mars erzittert.',
      },
      problem: {
        title: 'Die Frage: Was steckt im Inneren des Mars?',
        body: [
          'Niemand kann bis zum Mittelpunkt eines Planeten graben. Aber ein Marsbeben – ein Beben des Marsbodens, wie ein Erdbeben auf der Erde – schickt Wellen durch das Innere des Mars.',
          'Das Seismometer von InSight, SEIS genannt, zeichnete diese Schwingungen auf.',
        ],
      },
      experiment: {
        title: 'Marsbeben-Detektiv',
        body: [
          'Ein Seismometer misst winzige Bewegungen des Bodens. Die drei Kurven unten sind künstliche Beispiele für diese Lektion, keine echten NASA-Aufzeichnungen. Finde das wahrscheinliche Marsbeben und nutze dann seine Wellen, um auf das verborgene Innere des Mars zu schließen.',
        ],
      },
      reveal: {
        title: 'Wellen als Botschafter',
        body: [
          'Seismische Wellen werden schneller oder langsamer, werden gebrochen und prallen ab, wenn sie auf unterschiedliche Schichten treffen. Durch den Vergleich vieler Beben kann die Forschung ein Modell davon erstellen, was darunter liegt.',
          'InSight registrierte 1.319 Marsbeben, darunter einige durch Meteoroideneinschläge. Seine Daten geben der Forschung eine Möglichkeit, Kruste, Mantel und Kern des Mars zu untersuchen.',
        ],
      },
      discovery: {
        title: 'Entdeckung: Zuhören ist Erkunden',
        body: [
          'InSight meldete sich am 15. Dezember 2022 zum letzten Mal, nachdem die Energie zu knapp geworden war. In vier Jahren des Zuhörens machte InSight aus leisem Zittern ein Bild einer verborgenen Welt.',
          'Man kann erforschen, was unter der Oberfläche eines Planeten liegt, ohne bis zu seinem Kern zu graben.',
        ],
      },
    },
    voyager: {
      hook: {
        title: 'Nicht jeder Entdecker schweigt',
        body: [
          'Der Reflektor wartet auf dem Mond. Opportunity und InSight ruhen auf dem Mars. Aber eine Maschine aus dem Jahr 1977 ist noch immer unterwegs.',
          'Voyager 1 startete am 5. September 1977. Die Sonde ruht nirgendwo – sie fliegt durch den Weltraum und sendet immer noch Daten nach Hause.',
        ],
      },
      problem: {
        title: 'Jenseits der Blase der Sonne',
        body: [
          'Die Sonne bläst eine Blase aus Teilchen um die Planeten, die Heliosphäre. Am 25. August 2012 verließ Voyager 1 sie als erste Raumsonde und vermaß den interstellaren Raum.',
          'Ihre nukleare Energiequelle verliert pro Jahr etwa 4 Watt, deshalb schalten Ingenieure ein Instrument nach dem anderen ab. Im Jahr 2026 arbeiten noch zwei wissenschaftliche Instrumente.',
        ],
      },
      experiment: {
        title: 'Ordne jeder Maschine ihren Status zu',
        body: [
          'Vier Maschinen, vier verschiedene Geschichten. Wähle für jede den passenden Status und prüfe dann deine Antworten.',
        ],
      },
      'golden-record': {
        title: 'Eine Botschaft an Bord',
        body: [
          'Voyager 1 trägt mehr als nur Instrumente. Beide Voyager-Sonden haben eine vergoldete 12-Zoll-Schallplatte an Bord: eine Botschaft von der Erde, verschlossen in einer schützenden Aluminiumhülle.',
          'Öffne unten jeden Teil der Schallplatte und sieh dir an, was die Menschheit ins All schicken wollte.',
        ],
      },
      discovery: {
        title: 'Epilog: Das Signal geht weiter',
        body: [
          'Im November 2026 erreicht Voyager 1 eine Entfernung von etwa einem Lichttag von der Erde – so weit, dass ihre Funknachricht einen ganzen Tag unterwegs ist.',
          'Manche Maschinen verstummen. Ihre Entdeckungen nicht.',
        ],
      },
    },
  },

  statusLabels: {
    'passive-still-useful': 'Passiv, aber weiterhin nützlich',
    'mission-ended': 'Mission beendet',
    'extended-mission': 'Aktive, verlängerte Mission',
  },
  stageLabels: {
    hook: 'Missionsbriefing',
    problem: 'Die Wissenschaft',
    experiment: 'Interaktives Experiment',
    reveal: 'Echte NASA-Verbindung',
    discovery: 'Entdeckung',
  },
  narrationLabel: 'Erfundene Erzählung auf Grundlage von NASA-Missionsunterlagen',
  futureQuestion: 'Welche Maschine, die zu deinen Lebzeiten gestartet ist, wird uns deiner Meinung nach in 50 Jahren noch etwas beibringen – und warum?',

  targets: {
    reflector: { label: 'Die Reflektor-Anordnung von Apollo 11', feedback: 'Ziel erfasst. Jeder Tripelspiegel schickt Licht dorthin zurück, woher es kam, sodass ein Teil des Pulses zum Teleskop zurückkehren kann.' },
    ground: { label: 'Nackter Mondboden daneben', feedback: 'Nackter Boden streut Licht in alle Richtungen, daher kommt viel weniger direkt zurück. Probier das Ziel, das dafür gebaut ist, Licht nach Hause zu schicken.' },
  },
  formulas: {
    ct: { label: 'Entfernung = Lichtgeschwindigkeit × Zeit', feedback: 'Das ergibt die Länge der ganzen Strecke – hin UND zurück. Tipp: Das Licht hat die Strecke zweimal zurückgelegt.' },
    ct2: { label: 'Entfernung = Lichtgeschwindigkeit × Zeit ÷ 2', feedback: 'Genau! Der Puls flog zum Mond und zurück, also ist die Hälfte des Gesamtwegs die einfache Entfernung.' },
    c_t: { label: 'Entfernung = Lichtgeschwindigkeit ÷ Zeit', feedback: 'Wenn man eine Geschwindigkeit durch eine Zeit teilt, erhält man keine Entfernung. Tipp: Geschwindigkeit × Zeit = zurückgelegte Strecke.' },
  },
  gap: {
    farther: { label: 'Weiter entfernt', feedback: 'Richtig. Die erste (P-)Welle ist schneller als die zweite (S-)Welle, je länger sie also unterwegs sind, desto größer wird der Abstand.' },
    closer: { label: 'Näher', feedback: 'Nicht ganz. Denk an zwei Läufer mit unterschiedlichem Tempo: Je länger das Rennen, desto größer der Abstand im Ziel. Bei den zwei Wellen ist es genauso.' },
  },
  layers: {
    layers: { label: 'Wo die Grenzen zwischen den Schichten liegen und wie tief sie sind', feedback: 'Ja! An Grenzen werden Wellen schneller oder langsamer, gebrochen und zurückgeworfen. Wer viele davon zeitlich vermisst, kann Schichten kartieren, die niemand je sehen wird.' },
    color: { label: 'Welche Farbe das Gestein tief im Inneren hat', feedback: 'Seismische Wellen tragen keine Farbe. Sie tragen Zeitangaben: wann sie ankommen und wie sie sich verändern. Tipp: Überlege, was sich ändert, wenn eine Welle auf eine neue Schicht trifft.' },
    weather: { label: 'Wie das Wetter während des Bebens war', feedback: 'Wind kann ein Seismometer stören, aber die Forschung versucht, dieses Rauschen herauszufiltern. Tipp: Das nützliche Signal reiste durch den Planeten, nicht durch die Luft.' },
  },
  verdicts: {
    water: 'Spricht für uraltes Wasser',
    'not-clear': 'Allein kein Hinweis auf Wasser',
  },
  samples: {
    hematite: {
      name: 'Hämatit am Landeplatz',
      location: 'Meridiani Planum, wo Opportunity landete',
      observation: 'Opportunity fand an seinem Landeplatz Hämatit, ein Mineral, das in Wasser entsteht.',
      properties: [
        'Art: Mineral (ein Eisenoxid)',
        'So beschreibt es die NASA: „ein Mineral, das in Wasser entsteht“',
      ],
      explanation: 'Dieses Mineral entsteht in Wasser, also ist sein Fund ein starker Hinweis darauf, dass dort einst Wasser war.',
      hint: 'Lies die Beobachtung noch einmal: Was braucht dieses Mineral laut NASA, um zu entstehen?',
    },
    jarosite: {
      name: 'Jarosit im Gestein „El Capitan“',
      location: 'Ein geschichteter Aufschluss im Eagle-Krater (2004)',
      observation: 'Instrumente fanden Sulfatsalze, darunter Jarosit – ein wasserhaltiges Eisensulfat-Mineral.',
      properties: [
        'Art: Salzmineral',
        '„Wasserhaltig“ bedeutet, dass Wasser ein Teil des Minerals selbst ist',
      ],
      explanation: 'Wasser ist in Jarosit eingebaut. Im Jahr 2004 folgerte das Wissenschaftsteam, dass einst flüssiges Wasser durch dieses Gestein floss und seine Struktur und Chemie veränderte.',
      hint: 'Achte auf das Wort „wasserhaltig“. Was ist in diesem Mineral eingebaut?',
    },
    spherules: {
      name: 'Winzige runde Kügelchen',
      location: 'Eingebettet im selben Aufschluss (2004 entdeckt)',
      observation: 'Runde Teilchen, etwa so groß wie Schrotkugeln (kleine Kügelchen), stecken im Aufschluss. Anfangs kannte man nur ihre Form.',
      properties: [
        'Form: rund, wenige Millimeter groß',
        'Direkt nach der Entdeckung nannte die NASA mehrere mögliche Ursprünge',
      ],
      explanation: 'Gute wissenschaftliche Vorsicht! Als die Kügelchen entdeckt wurden, konnte die Form allein das nicht klären: Die NASA nannte Vulkanausbrüche, geschmolzene Tröpfchen eines Meteoriteneinschlags oder Minerale, die sich aus Wasser abscheiden. Wenige Wochen später zeigten Messungen, dass sie reich an Hämatit sind, und die Forschenden folgerten, dass sie in wassergetränktem Gestein gewachsen sind. Vorsichtige Schritte machten die Antwort am Ende sicherer.',
      hint: 'Direkt nach der Entdeckung nannte die NASA mehrere Wege, wie diese Kügelchen entstehen können. Reicht ihre Form allein als Beweis für Wasser?',
    },
    endeavour: {
      name: 'Gestein am Endeavour-Krater',
      location: 'Endeavour-Krater, etwa 22 km (13 Meilen) breit',
      observation: 'Opportunity entdeckte am Endeavour-Krater starke Hinweise auf die Wirkung von uraltem Wasser.',
      properties: [
        'Nach jahrelanger Fahrt erreicht',
        'Älteres Gestein als in der Nähe des Landeplatzes',
      ],
      explanation: 'Dieses Gestein wurde vor langer Zeit durch Wasser verändert und bewahrt bis heute eine Spur dieses Wassers.',
      hint: 'Wofür zeigt dieses Gestein laut NASA Anzeichen?',
    },
    eagle: {
      name: 'Der kleine Krater, in dem er landete',
      location: 'Eagle-Krater, Meridiani Planum',
      observation: 'Opportunity kam in einem kleinen Einschlagkrater namens Eagle zum Stehen.',
      properties: [
        'Art: Einschlagkrater (entstanden, als etwas auf den Boden prallte)',
        'Seine Wände legten Grundgestein zum Untersuchen frei',
      ],
      explanation: 'Stimmt, und was für ein Glück! Die Kraterwände boten dem Rover Gestein zum Untersuchen. Aber der Krater selbst verrät nur, wo er landete, nicht, ob dort Wasser war.',
      hint: 'Ein Krater entsteht durch einen Einschlag. Braucht ein Einschlag Wasser?',
    },
  },
  waves: {
    quiet: {
      label: 'Kurve A',
      description: 'Eine dünne, gleichmäßige Linie mit die ganze Zeit nur winzigen Ausschlägen.',
      shape: 'Durchgehend flach und ruhig',
      feedback: 'Diese Kurve bleibt die ganze Zeit ruhig: ein stiller Abschnitt, in dem kaum etwas passiert. Suche eine Kurve mit einem deutlichen Beginn.',
    },
    event: {
      label: 'Kurve B',
      description: 'Ruhig, dann ein plötzlicher erster Ruck, dann eine zweite, größere Ankunft, die langsam abklingt.',
      shape: 'Ruhig → scharfer Beginn → größere zweite Ankunft → langsames Abklingen',
      feedback: 'Ja! Ein scharfer Beginn, eine zweite Ankunft und ein langsames Abklingen sind das Muster, nach dem Seismologen bei einem Beben oder Einschlag suchen.',
    },
    wind: {
      label: 'Kurve C',
      description: 'Unruhige Erschütterungsstöße, über die ganze Aufzeichnung verteilt, ohne klaren Beginn.',
      shape: 'Unregelmäßige Stöße, die kommen und gehen',
      feedback: 'Viel Gewackel, aber kein klarer Beginn und keine zweite Ankunft. Solche Stöße sehen eher nach Wind oder anderem Rauschen aus. Tipp: Ein Beben beginnt plötzlich.',
    },
  },
  matches: {
    apollo11: {
      label: 'Laser-Reflektor von Apollo 11',
      explanation: 'Kein Strom und kein Funk – und trotzdem wirft er noch Laserlicht zurück, dessen Laufzeit die Forschung messen kann.',
      hint: 'Braucht dieses Gerät Strom, um seine Aufgabe zu erfüllen?',
    },
    opportunity: {
      label: 'Rover Opportunity',
      explanation: 'Verstummte im Staubsturm von 2018; die NASA beendete die Mission im Februar 2019.',
      hint: 'Denk daran, was der Staubsturm von 2018 mit seinen Solarpaneelen gemacht hat.',
    },
    insight: {
      label: 'Lander InSight',
      explanation: 'Die Energie ging aus; letzter Kontakt am 15. Dezember 2022.',
      hint: 'Wann hat sich InSight zum letzten Mal gemeldet?',
    },
    voyager: {
      label: 'Voyager 1',
      explanation: 'Reist immer noch durch den interstellaren Raum und sendet weiterhin Daten nach Hause.',
      hint: 'Sendet diese Maschine heute noch Daten zur Erde?',
    },
  },
  goldenRecord: {
    images: {
      title: 'Bilder',
      fact: '115 Bilder, zusammengestellt von Carl Sagan und seinem Team, die Leben und Wissenschaft auf der Erde zeigen.',
    },
    greetings: {
      title: 'Grüße',
      fact: 'Gesprochene Grüße von Menschen auf der Erde in fünfundfünfzig Sprachen.',
    },
    sounds: {
      title: 'Klänge der Erde',
      fact: 'Naturgeräusche wie Brandung, Wind und Donner, Vögel und Wale.',
    },
    music: {
      title: 'Musik',
      fact: 'Eine bunt gemischte Musikauswahl von 90 Minuten.',
    },
    cover: {
      title: 'Die Hülle',
      fact: 'Anleitungen in Symbolsprache erklären, woher die Raumsonde kam und wie man die Schallplatte abspielt.',
    },
  },
};
