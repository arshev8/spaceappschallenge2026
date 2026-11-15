import type { ContentTranslation } from '../localize.ts';

const ART = 'Illustrations et schémas : créations CSS/SVG originales de l’équipe ECHOES (pas des images de la NASA).';

/** Traduction française du contenu scientifique. Clés et ordre identiques aux données anglaises. */
export const fr: ContentTranslation = {
  missions: {
    apollo11: {
      title: 'Rétroréflecteur de télémétrie laser d’Apollo 11',
      chapterTitle: 'Le miroir qui ne s’est jamais tu',
      target: 'La Lune — mer de la Tranquillité',
      hardwareType: 'Panneau de rétroréflecteurs passif (sans énergie, sans radio)',
      chronology: [
        { date: '1969', event: 'Les astronautes d’Apollo 11 laissent le panneau de réflecteurs sur la Lune.' },
        { date: '1969 → aujourd’hui', event: 'Des observatoires de télémétrie laser sur Terre visent toujours les réflecteurs d’Apollo.' },
      ],
      statusDetail: 'Il n’a aucune source d’énergie et n’émet aucun signal. Il se contente de renvoyer la lumière laser que les observatoires dirigent vers lui.',
      scienceQuestion: 'À quelle distance se trouve la Lune — et comment cette distance change-t-elle ?',
      method: 'Télémétrie laser lunaire : chronométrer l’aller-retour d’une impulsion laser jusqu’au réflecteur.',
      result: 'Distance = vitesse de la lumière × temps aller-retour ÷ 2.',
      takeaway: 'Une machine peut survivre à sa mission d’origine et continuer à servir la science.',
      claims: {
        'ap11-cubes': 'Le panneau d’Apollo 11 compte 100 réflecteurs en coin de cube en silice fondue, de 3,8 cm de diamètre chacun, sur un panneau en aluminium de 46 cm.',
        'ap11-location': 'Le panneau d’Apollo 11 se trouve dans la mer de la Tranquillité.',
        'ap11-ranging': 'Des observatoires sur Terre ont régulièrement mesuré la distance de la Lune grâce aux réflecteurs d’Apollo.',
        'moon-receding': 'La télémétrie laser montre que la Lune s’éloigne lentement de la Terre : d’environ 3,8 cm chaque année.',
      },
      credits: [ART],
    },
    opportunity: {
      title: 'Rover martien Opportunity (Mars Exploration Rover)',
      chapterTitle: 'Le rover qui a survécu à sa mission',
      target: 'Mars — Meridiani Planum',
      hardwareType: 'Rover solaire à six roues',
      chronology: [
        { date: '7 juillet 2003', event: 'Lancement depuis la Terre.' },
        { date: '24 janv. 2004 (heure du Pacifique)', event: 'Atterrit à Meridiani Planum, dans un petit cratère nommé Eagle.' },
        { date: '10 juin 2018', event: 'Dernière communication, pendant une tempête de poussière planétaire.' },
        { date: '13 févr. 2019', event: 'La NASA déclare la mission terminée.' },
      ],
      statusDetail: 'Mission terminée le 13 févr. 2019, après l’échec de plus d’un millier de commandes destinées à rétablir le contact.',
      scienceQuestion: 'La Mars ancienne était-elle plus humide — et peut-être habitable ?',
      method: 'Rouler jusqu’aux roches et étudier leurs minéraux et leurs textures avec des caméras et des instruments.',
      result: 'A trouvé de l’hématite, un minéral qui se forme dans l’eau, et de forts signes d’eau ancienne au cratère Endeavour. Cela indique des conditions habitables dans le passé — pas une preuve de vie.',
      takeaway: 'Les roches gardent la mémoire des environnements passés.',
      claims: {
        'opp-90-sols': 'Opportunity était conçu pour durer 90 sols (jours martiens) et parcourir environ 1 000 mètres.',
        'opp-sol': 'Un sol est un jour martien ; Mars fait un tour sur elle-même toutes les 24,6 heures.',
        'opp-15-years': 'La mission a duré près de 15 ans, et le rover a parcouru plus de 28 miles (45 km).',
        'opp-hematite': 'Opportunity a trouvé de l’hématite, un minéral qui se forme dans l’eau, sur son site d’atterrissage.',
        'opp-jarosite': 'En 2004, les instruments ont détecté des sels de sulfate, dont la jarosite, un sulfate de fer hydraté, et l’équipe a conclu que de l’eau liquide avait autrefois circulé dans les roches.',
        'opp-spherules': 'Lors de leur découverte en 2004, les sphères de la taille d’un plomb de chasse pouvaient s’être formées de plusieurs façons. Quelques semaines plus tard, Opportunity a découvert qu’elles sont riches en hématite, et l’équipe a conclu qu’elles ont grandi dans une roche gorgée d’eau.',
        'opp-endeavour': 'Au cratère Endeavour, il a trouvé de fortes indications de l’action d’une eau ancienne.',
        'opp-dust': 'Le rover solaire a cessé de communiquer lorsqu’une violente tempête de poussière couvrant toute la planète a recouvert sa position en juin 2018.',
      },
      credits: [ART],
    },
    insight: {
      title: 'Atterrisseur martien InSight',
      chapterTitle: 'À l’écoute du cœur de Mars',
      target: 'Mars — Elysium Planitia',
      hardwareType: 'Atterrisseur fixe équipé d’un sismomètre et d’une sonde de flux de chaleur',
      chronology: [
        { date: '5 mai 2018', event: 'Lancement depuis la Terre.' },
        { date: '26 nov. 2018', event: 'Atterrit sur Elysium Planitia.' },
        { date: '15 déc. 2022', event: 'Dernière communication avec la Terre.' },
        { date: '21 déc. 2022', event: 'La NASA annonce la fin de la mission.' },
      ],
      statusDetail: 'Mission scientifique terminée en décembre 2022, quand l’atterrisseur a manqué d’énergie.',
      scienceQuestion: 'À quoi ressemble l’intérieur de Mars ?',
      method: 'Enregistrer les vibrations du sol avec son sismomètre, SEIS (Seismic Experiment for Interior Structure).',
      result: 'A détecté 1 319 séismes martiens, dont certains causés par des impacts de météoroïdes, ce qui permet aux scientifiques d’étudier la croûte, le manteau et le noyau.',
      takeaway: 'On peut étudier ce qui se cache sous la surface d’une planète sans creuser jusqu’à son noyau.',
      claims: {
        'ins-landing': 'InSight s’est posé sur Elysium Planitia, sur Mars, le 26 nov. 2018.',
        'ins-quakes': 'InSight a détecté 1 319 séismes martiens, dont des séismes causés par des impacts de météoroïdes.',
        'ins-interior': 'Les données du sismomètre permettent aux scientifiques d’étudier la croûte, le manteau et le noyau de la planète.',
        'ins-end': 'InSight a communiqué pour la dernière fois avec la Terre le 15 déc. 2022.',
      },
      credits: [ART, 'Les sismogrammes de ce chapitre sont des illustrations synthétiques, pas des enregistrements de la NASA.'],
    },
    voyager: {
      title: 'Voyager 1',
      chapterTitle: 'Au-delà de la dernière planète',
      target: 'Espace interstellaire',
      hardwareType: 'Sonde spatiale lointaine à énergie nucléaire (générateurs thermoélectriques à radioisotope)',
      chronology: [
        { date: '5 sept. 1977', event: 'Lancement depuis la Terre.' },
        { date: '17 févr. 1998', event: 'Devient l’objet fabriqué par l’humain le plus lointain.' },
        { date: '25 août 2012', event: 'Quitte l’héliosphère et commence à mesurer l’espace interstellaire.' },
        { date: '17 avr. 2026', event: 'Les ingénieurs éteignent un instrument de plus pour économiser l’énergie.' },
      ],
      statusDetail: 'Elle voyage toujours et communique encore avec la Terre. La NASA indique comme statut « Extended Mission » (mission prolongée). Son énergie baisse lentement, alors les instruments sont éteints un par un.',
      scienceQuestion: 'À quoi ressemble l’espace au-delà de la bulle du Soleil, l’héliosphère ?',
      method: 'Mesurer les ondes de plasma et les champs magnétiques dans l’espace interstellaire.',
      result: 'La première sonde à mesurer directement l’environnement interstellaire.',
      takeaway: 'Tous les explorateurs ne se sont pas tus — certains envoient encore des nouvelles depuis les confins.',
      claims: {
        'voy-launch': 'Voyager 1 a été lancée le 5 sept. 1977.',
        'voy-interstellar': 'Le 25 août 2012, Voyager 1 est devenue la première sonde à quitter l’héliosphère et à mesurer l’espace interstellaire.',
        'voy-status': 'La NASA indique comme statut de Voyager « Extended Mission » (mission prolongée).',
        'voy-power': 'Voyager 1 manque d’énergie et perd environ 4 watts par an ; depuis avril 2026, elle n’a plus que deux instruments scientifiques en service.',
        'voy-golden-record': 'Les deux Voyager emportent un disque plaqué or de 12 pouces avec 115 images, des salutations en cinquante-cinq langues, des sons de la nature et 90 minutes de musique.',
        'voy-light-day': 'En novembre 2026, Voyager 1 atteint une distance d’environ un jour-lumière de la Terre.',
      },
      credits: [ART],
    },
  },
  scenes: {
    apollo11: {
      hook: {
        title: 'Un miroir sur la Lune',
        body: [
          'En 1969, les astronautes d’Apollo 11 ont laissé un petit panneau dans la mer de la Tranquillité. Il n’a ni batterie, ni radio, ni pièce mobile.',
          'Et pourtant, les scientifiques sur Terre l’utilisent depuis des décennies. Comment un objet qui ne « parle » jamais peut-il encore aider la science ?',
        ],
        narration: 'Je ne bipe pas. Je n’appelle pas la maison. J’attends dans la poussière grise, et quand la lumière me trouve, je la renvoie tout droit.',
      },
      tool: {
        title: 'L’outil : un rétroréflecteur',
        body: [
          'Un rétroréflecteur est un miroir qui renvoie la lumière dans la direction d’où elle vient — comme le catadioptre d’un vélo qui brille dans les phares.',
          'Le panneau d’Apollo 11 contient 100 coins de cube en verre, de 3,8 cm chacun, dans un cadre de 46 cm. Les observatoires tirent un laser dessus et captent la lumière qui revient.',
        ],
      },
      experiment: {
        title: 'Mesure la distance de la Lune',
        body: [
          'Tu diriges une station de télémétrie laser. La lumière est rapide — environ 300 000 km par seconde — mais pas instantanée. Vise le réflecteur, tire une impulsion, chronomètre son aller-retour, puis transforme ce temps en distance.',
        ],
      },
      reveal: {
        title: 'Ce que font les vraies stations',
        body: [
          'Les vraies stations de télémétrie laser font le même calcul avec des horloges d’une précision incroyable : distance = vitesse de la lumière × temps aller-retour ÷ 2.',
          'Seule une infime partie de la lumière laser revient, il faut donc des lasers puissants et des détecteurs sensibles. Ces mesures ont révélé que la Lune s’éloigne de la Terre d’environ 3,8 cm chaque année.',
        ],
      },
      discovery: {
        title: 'Découverte : silencieux, pas inutile',
        body: [
          'Le réflecteur n’a jamais eu besoin d’énergie, alors il n’en a jamais « manqué ». Sa conception simple lui permet d’aider longtemps après le retour des astronautes.',
          'Une machine peut survivre à sa mission d’origine et continuer à servir la science.',
        ],
      },
    },
    opportunity: {
      hook: {
        title: 'Quatre-vingt-dix sols… et bien plus',
        body: [
          'Un sol est un jour martien — environ 24,6 heures. Opportunity a été construit pour fonctionner 90 sols et parcourir environ 1 000 mètres.',
          'Il s’est posé en janvier 2004. Il a tenu près de 15 ans et parcouru plus de 28 miles (45 km).',
        ],
        narration: 'On espérait que je tiendrais une saison martienne. Chaque matin, le Soleil se levait, mes panneaux se réveillaient, et il y avait une nouvelle roche à lire.',
      },
      problem: {
        title: 'La question : Mars a-t-elle été humide ?',
        body: [
          'Aujourd’hui, Mars est froide et sèche. Mais les scientifiques se demandaient si de l’eau liquide y avait coulé — et si la Mars ancienne avait pu abriter une vie minuscule.',
          'L’eau laisse des empreintes dans les roches. La mission d’Opportunity : les lire.',
        ],
      },
      experiment: {
        title: 'Suivre l’eau',
        body: [
          'Tu fais partie de l’équipe scientifique du rover. Examine chaque échantillon sur la carte, lis ce qu’Opportunity a observé, puis décide : soutient-il l’idée d’une eau ancienne ? Ensuite, découvre pourquoi la lumière du Soleil comptait autant.',
        ],
      },
      reveal: {
        title: 'Ce que les roches nous ont appris',
        body: [
          'Les découvertes d’Opportunity indiquent de l’eau liquide sur la Mars ancienne, et selon la NASA, sa région d’atterrissage a pu être habitable à un moment de l’histoire martienne.',
          'Ce sont des indices sur des environnements passés — pas une preuve que la vie y a existé.',
          'En juin 2018, une tempête de poussière planétaire a masqué le Soleil. Sa dernière communication est arrivée le 10 juin 2018. La NASA a déclaré la mission terminée le 13 févr. 2019.',
        ],
      },
      discovery: {
        title: 'Découverte : les roches se souviennent',
        body: [
          'L’eau a disparu de la surface martienne il y a longtemps, mais les minéraux qu’elle a formés sont toujours là, prêts à être lus.',
          'Les roches gardent la mémoire des environnements passés.',
        ],
      },
    },
    insight: {
      hook: {
        title: 'Un explorateur immobile',
        body: [
          'En novembre 2018, InSight s’est posé sur une plaine appelée Elysium Planitia. Contrairement à un rover, il est resté au même endroit pendant toute sa mission.',
          'Au lieu de rouler, il a écouté.',
        ],
        narration: 'Je ne pouvais pas me promener. Alors j’ai posé une oreille très patiente sur le sol et j’ai attendu que Mars frissonne.',
      },
      problem: {
        title: 'La question : qu’y a-t-il à l’intérieur de Mars ?',
        body: [
          'Personne ne peut creuser jusqu’au centre d’une planète. Mais un séisme martien — une secousse du sol de Mars, comme un tremblement de terre — envoie des ondes à travers l’intérieur de la planète.',
          'Le sismomètre d’InSight, appelé SEIS, a enregistré ces vibrations.',
        ],
      },
      experiment: {
        title: 'Enquêteur des séismes martiens',
        body: [
          'Un sismomètre mesure de minuscules mouvements du sol. Les trois tracés ci-dessous sont des exemples synthétiques créés pour cette leçon, pas de vrais enregistrements de la NASA. Trouve le séisme martien probable, puis utilise ses ondes pour raisonner sur l’intérieur caché de Mars.',
        ],
      },
      reveal: {
        title: 'Les ondes, des messagères',
        body: [
          'Les ondes sismiques accélèrent, ralentissent, se courbent et rebondissent quand elles rencontrent des couches différentes. En comparant de nombreux séismes, les scientifiques construisent un modèle de ce qui se trouve en dessous.',
          'InSight a détecté 1 319 séismes martiens, dont certains causés par des impacts de météoroïdes. Ses données permettent d’étudier la croûte, le manteau et le noyau de Mars.',
        ],
      },
      discovery: {
        title: 'Découverte : écouter, c’est explorer',
        body: [
          'InSight a appelé la Terre pour la dernière fois le 15 déc. 2022, quand son énergie est devenue trop faible. En quatre ans d’écoute, il a transformé de faibles frissons en portrait d’un monde caché.',
          'On peut étudier ce qui se cache sous la surface d’une planète sans creuser jusqu’à son noyau.',
        ],
      },
    },
    voyager: {
      hook: {
        title: 'Tous les explorateurs ne se taisent pas',
        body: [
          'Le réflecteur attend sur la Lune. Opportunity et InSight reposent sur Mars. Mais une machine de 1977 est toujours en mouvement.',
          'Voyager 1 a été lancée le 5 sept. 1977. Elle ne repose nulle part — elle file à travers l’espace et envoie encore des données à la Terre.',
        ],
      },
      problem: {
        title: 'Au-delà de la bulle du Soleil',
        body: [
          'Le Soleil souffle autour des planètes une bulle de particules appelée héliosphère. Le 25 août 2012, Voyager 1 est devenue la première sonde à la quitter et à mesurer l’espace interstellaire.',
          'Sa source d’énergie nucléaire perd environ 4 watts par an, alors les ingénieurs éteignent les instruments un à un. En 2026, deux instruments scientifiques fonctionnent encore.',
        ],
      },
      experiment: {
        title: 'Associe chaque machine à son statut',
        body: [
          'Quatre machines, quatre histoires différentes. Choisis le statut qui correspond à chacune, puis vérifie tes réponses.',
        ],
      },
      'golden-record': {
        title: 'Un message à bord',
        body: [
          'Voyager 1 transporte plus que des instruments. Les deux Voyager emportent un disque plaqué or de 12 pouces : un message de la Terre, scellé dans une pochette protectrice en aluminium.',
          'Ouvre chaque partie du disque ci-dessous pour découvrir ce que l’humanité a choisi d’envoyer.',
        ],
      },
      discovery: {
        title: 'Épilogue : le signal continue',
        body: [
          'En novembre 2026, Voyager 1 atteint une distance d’environ un jour-lumière de la Terre : si loin que son message radio met une journée entière à arriver.',
          'Certaines machines se taisent. Leurs découvertes, jamais.',
        ],
      },
    },
  },
  statusLabels: {
    'passive-still-useful': 'Passif, mais toujours utile',
    'mission-ended': 'Mission terminée',
    'extended-mission': 'Mission prolongée, toujours active',
  },
  stageLabels: {
    hook: 'Briefing de mission',
    problem: 'La science',
    experiment: 'Expérience interactive',
    reveal: 'Le lien avec la NASA',
    discovery: 'Découverte',
  },
  narrationLabel: 'Narration imaginée à partir des archives de mission de la NASA',
  futureQuestion: 'Quelle machine lancée de ton vivant, selon toi, nous apprendra encore des choses dans 50 ans — et pourquoi ?',
  targets: {
    reflector: {
      label: 'Le panneau de réflecteurs d’Apollo 11',
      feedback: 'Cible verrouillée. Chaque coin de cube renvoie la lumière vers son point de départ, donc une partie de l’impulsion peut revenir au télescope.',
    },
    ground: {
      label: 'Le sol lunaire nu juste à côté',
      feedback: 'Le sol nu diffuse la lumière dans toutes les directions, donc bien moins de lumière revient tout droit. Essaie la cible conçue pour renvoyer la lumière.',
    },
  },
  formulas: {
    ct: {
      label: 'distance = vitesse de la lumière × temps',
      feedback: 'Cela donne la longueur du trajet complet — l’aller ET le retour. Indice : la lumière a traversé la distance deux fois.',
    },
    ct2: {
      label: 'distance = vitesse de la lumière × temps ÷ 2',
      feedback: 'Exactement ! L’impulsion est allée jusqu’à la Lune et revenue, donc la moitié du trajet total correspond à la distance aller.',
    },
    c_t: {
      label: 'distance = vitesse de la lumière ÷ temps',
      feedback: 'Diviser une vitesse par un temps ne donne pas une distance. Indice : vitesse × temps = distance parcourue.',
    },
  },
  gap: {
    farther: {
      label: 'Plus loin',
      feedback: 'Exact. La première onde (P) est plus rapide que la seconde (S) : plus elles voyagent longtemps, plus l’écart grandit.',
    },
    closer: {
      label: 'Plus près',
      feedback: 'Pas tout à fait. Pense à deux coureurs qui vont à des vitesses différentes : plus la course est longue, plus l’écart est grand à l’arrivée. C’est pareil pour les deux ondes.',
    },
  },
  layers: {
    layers: {
      label: 'Où se trouvent les limites entre les couches, et à quelle profondeur',
      feedback: 'Oui ! Les ondes accélèrent, ralentissent, se courbent et rebondissent aux limites. En chronométrant beaucoup d’ondes, les scientifiques cartographient des couches qu’ils ne verront jamais.',
    },
    color: {
      label: 'La couleur des roches en profondeur',
      feedback: 'Les ondes sismiques ne transportent pas de couleur. Elles transportent du timing : quand elles arrivent et comment elles changent. Indice : pense à ce qui change quand une onde rencontre une nouvelle couche.',
    },
    weather: {
      label: 'La météo pendant le séisme',
      feedback: 'Le vent peut ajouter du bruit à un sismomètre, mais les scientifiques essaient de l’éliminer. Indice : le signal utile a traversé la planète, pas l’air.',
    },
  },
  verdicts: {
    water: 'Soutient l’idée d’une eau ancienne',
    'not-clear': 'Pas un indice d’eau à lui seul',
  },
  samples: {
    hematite: {
      name: 'De l’hématite sur le site d’atterrissage',
      location: 'Meridiani Planum, où Opportunity s’est posé',
      observation: 'Opportunity a trouvé de l’hématite, un minéral qui se forme dans l’eau, sur son site d’atterrissage.',
      properties: [
        'Type : minéral (un oxyde de fer)',
        'Comment la NASA le décrit : « un minéral qui se forme dans l’eau »',
      ],
      explanation: 'Ce minéral se forme dans l’eau : le trouver est donc un indice fort que l’eau était présente autrefois.',
      hint: 'Relis l’observation : de quoi ce minéral a-t-il besoin pour se former, selon la NASA ?',
    },
    jarosite: {
      name: 'De la jarosite dans la roche « El Capitan »',
      location: 'Un affleurement en couches dans le cratère Eagle (2004)',
      observation: 'Les instruments ont détecté des sels de sulfate, dont la jarosite — un sulfate de fer hydraté.',
      properties: [
        'Type : minéral salin',
        '« Hydraté » signifie que l’eau fait partie du minéral lui-même',
      ],
      explanation: 'L’eau est intégrée à la jarosite. En 2004, l’équipe scientifique a conclu que de l’eau liquide avait autrefois circulé dans ces roches, modifiant leur texture et leur chimie.',
      hint: 'Regarde le mot « hydraté ». Qu’est-ce qui est intégré à ce minéral ?',
    },
    spherules: {
      name: 'De minuscules sphères',
      location: 'Incrustées dans le même affleurement (découvertes en 2004)',
      observation: 'Des particules rondes, de la taille de plombs de chasse, sont incrustées dans l’affleurement. Au début, on ne connaissait que leur forme.',
      properties: [
        'Forme : ronde, quelques millimètres de diamètre',
        'À leur découverte, la NASA citait plusieurs origines possibles',
      ],
      explanation: 'Belle prudence scientifique ! À la découverte des sphères, leur forme seule ne permettait pas de trancher : la NASA évoquait des éruptions volcaniques, des gouttelettes fondues lors d’un impact de météorite ou des minéraux sortis de l’eau. Quelques semaines plus tard, des analyses ont montré qu’elles sont riches en hématite, et les scientifiques ont conclu qu’elles ont grandi dans une roche gorgée d’eau. Avancer prudemment a rendu la réponse finale plus solide.',
      hint: 'À leur découverte, la NASA citait plusieurs façons dont ces sphères pouvaient se former. Leur forme suffit-elle à prouver la présence d’eau ?',
    },
    endeavour: {
      name: 'Les roches du cratère Endeavour',
      location: 'Cratère Endeavour, environ 22 km (13 miles) de large',
      observation: 'Opportunity a découvert au cratère Endeavour de fortes indications de l’action d’une eau ancienne.',
      properties: [
        'Atteint après des années de route',
        'Des roches plus anciennes que celles du site d’atterrissage',
      ],
      explanation: 'Ces roches ont été transformées par l’eau il y a longtemps, et elles en gardent la trace aujourd’hui.',
      hint: 'De quoi ces roches portent-elles les signes, selon la NASA ?',
    },
    eagle: {
      name: 'Le petit cratère où il s’est posé',
      location: 'Cratère Eagle, Meridiani Planum',
      observation: 'Opportunity s’est immobilisé dans un petit cratère d’impact nommé Eagle.',
      properties: [
        'Type : cratère d’impact (créé quand un objet a frappé le sol)',
        'Ses parois ont mis à nu la roche à étudier',
      ],
      explanation: 'Vrai, et quelle chance ! Les parois du cratère ont offert des roches à étudier au rover. Mais le cratère lui-même indique seulement où il s’est posé, pas si l’eau était présente.',
      hint: 'Un cratère est créé par un impact. Un impact a-t-il besoin d’eau ?',
    },
  },
  waves: {
    quiet: {
      label: 'Tracé A',
      description: 'Une ligne fine et régulière, avec seulement de minuscules oscillations du début à la fin.',
      shape: 'Plat et calme tout du long',
      feedback: 'Ce tracé reste calme tout du long : un moment tranquille où il ne se passe presque rien. Cherche un tracé avec un début net.',
    },
    event: {
      label: 'Tracé B',
      description: 'Du calme, puis une première secousse soudaine, puis une seconde arrivée plus forte qui s’estompe lentement.',
      shape: 'Calme → début brusque → seconde arrivée plus forte → lente atténuation',
      feedback: 'Oui ! Un début brusque, une seconde arrivée et une lente atténuation : c’est la signature que cherchent les sismologues pour un séisme ou un impact.',
    },
    wind: {
      label: 'Tracé C',
      description: 'Des salves de secousses désordonnées éparpillées sur tout l’enregistrement, sans début net.',
      shape: 'Salves irrégulières qui vont et viennent',
      feedback: 'Beaucoup de secousses, mais pas de début net ni de seconde arrivée. Des salves comme celles-ci ressemblent plutôt au vent ou à un autre bruit. Indice : un séisme commence soudainement.',
    },
  },
  matches: {
    apollo11: {
      label: 'Réflecteur laser d’Apollo 11',
      explanation: 'Sans énergie ni radio, il renvoie pourtant toujours la lumière laser que les scientifiques peuvent chronométrer.',
      hint: 'Celui-ci a-t-il besoin d’énergie pour faire son travail ?',
    },
    opportunity: {
      label: 'Rover Opportunity',
      explanation: 'Réduit au silence par la tempête de poussière de 2018 ; la NASA a mis fin à la mission en février 2019.',
      hint: 'Souviens-toi de ce que la tempête de poussière de 2018 a fait à ses panneaux solaires.',
    },
    insight: {
      label: 'Atterrisseur InSight',
      explanation: 'À court d’énergie ; dernier contact le 15 déc. 2022.',
      hint: 'Quand InSight a-t-il appelé la Terre pour la dernière fois ?',
    },
    voyager: {
      label: 'Voyager 1',
      explanation: 'Elle voyage toujours dans l’espace interstellaire et envoie encore des données à la Terre.',
      hint: 'Cette machine envoie-t-elle encore des données à la Terre aujourd’hui ?',
    },
  },
  goldenRecord: {
    images: {
      title: 'Images',
      fact: '115 images, rassemblées par Carl Sagan et ses collaborateurs, montrant la vie et la science sur Terre.',
    },
    greetings: {
      title: 'Salutations',
      fact: 'Des salutations prononcées par des habitants de la Terre en cinquante-cinq langues.',
    },
    sounds: {
      title: 'Sons de la Terre',
      fact: 'Des sons de la nature comme le ressac, le vent et le tonnerre, des oiseaux et des baleines.',
    },
    music: {
      title: 'Musique',
      fact: 'Une sélection éclectique de 90 minutes de musique.',
    },
    cover: {
      title: 'La pochette',
      fact: 'Des instructions en langage symbolique expliquent d’où vient la sonde et comment lire le disque.',
    },
  },
};
