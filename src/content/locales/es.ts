import type { ContentTranslation } from '../localize.ts';

const ART = 'Ilustraciones y diagramas: arte original en CSS/SVG del equipo de ECHOES (no son imágenes de la NASA).';

/** Traducción al español del contenido científico. Las claves y el orden coinciden con los datos en inglés. */
export const es: ContentTranslation = {
  missions: {
    apollo11: {
      title: 'Retrorreflector de telemetría láser del Apolo 11',
      chapterTitle: 'El espejo que nunca se quedó en silencio',
      target: 'La Luna — Mar de la Tranquilidad',
      hardwareType: 'Conjunto retrorreflector pasivo (sin energía y sin radio)',
      chronology: [
        { date: '1969', event: 'Los astronautas del Apolo 11 dejan el conjunto de reflectores en la Luna.' },
        { date: '1969 → hoy', event: 'Los observatorios de telemetría láser en la Tierra siguen apuntando a los reflectores del Apolo.' },
      ],
      statusDetail: 'No tiene energía y no emite ninguna señal propia. Simplemente refleja la luz láser con la que los observatorios le apuntan.',
      scienceQuestion: '¿A qué distancia está la Luna y cómo cambia esa distancia?',
      method: 'Telemetría láser lunar: medir el tiempo que tarda un pulso láser en ir hasta el reflector y volver.',
      result: 'Distancia = velocidad de la luz × tiempo de ida y vuelta ÷ 2.',
      takeaway: 'La ingeniería puede sobrevivir a su misión original y seguir apoyando a la ciencia.',
      claims: {
        'ap11-cubes': 'El conjunto del Apolo 11 tiene 100 reflectores de prisma de esquina de sílice fundida, cada uno de 3,8 cm de ancho, en un panel de aluminio de 46 cm.',
        'ap11-location': 'El conjunto del Apolo 11 se encuentra en el Mar de la Tranquilidad.',
        'ap11-ranging': 'Los observatorios en la Tierra han medido con regularidad la distancia a la Luna usando los reflectores del programa Apolo.',
        'moon-receding': 'La telemetría láser muestra que la Luna se aleja lentamente de la Tierra: unos 3,8 cm cada año.',
      },
      credits: [ART],
    },
    opportunity: {
      title: 'Rover de exploración de Marte Opportunity',
      chapterTitle: 'El rover que sobrevivió a su misión',
      target: 'Marte — Meridiani Planum',
      hardwareType: 'Rover de seis ruedas alimentado por energía solar',
      chronology: [
        { date: '7 de julio de 2003', event: 'Lanzamiento desde la Tierra.' },
        { date: '24 de enero de 2004 (PST)', event: 'Aterriza en Meridiani Planum, dentro de un pequeño cráter llamado Eagle.' },
        { date: '10 de junio de 2018', event: 'Última comunicación, durante una tormenta de polvo que cubrió todo el planeta.' },
        { date: '13 de febrero de 2019', event: 'La NASA da por terminada la misión.' },
      ],
      statusDetail: 'La misión terminó el 13 de febrero de 2019, después de que más de mil comandos no lograran restablecer el contacto.',
      scienceQuestion: '¿Fue el Marte antiguo más húmedo y, posiblemente, habitable?',
      method: 'Conducir hasta las rocas y estudiar sus minerales y texturas con cámaras e instrumentos.',
      result: 'Encontró hematita, un mineral que se forma en el agua, y fuertes indicios de agua antigua en el cráter Endeavour. Esto apunta a condiciones habitables en el pasado, pero no es una prueba de vida.',
      takeaway: 'Las rocas registran la historia de los entornos del pasado.',
      claims: {
        'opp-90-sols': 'Opportunity estaba diseñado para durar 90 soles (días marcianos) y recorrer unos 1000 metros.',
        'opp-sol': 'Un sol es un día marciano; Marte completa una rotación cada 24,6 horas.',
        'opp-15-years': 'La misión duró casi 15 años y el rover recorrió más de 28 millas (45 km).',
        'opp-hematite': 'Opportunity encontró hematita, un mineral que se forma en el agua, en su lugar de aterrizaje.',
        'opp-jarosite': 'En 2004, los instrumentos encontraron sales de sulfato, entre ellas jarosita, un mineral de sulfato de hierro hidratado, y el equipo concluyó que alguna vez fluyó agua líquida a través de las rocas.',
        'opp-spherules': 'Cuando se descubrieron en 2004, las esferas del tamaño de perdigones podían haberse formado de varias maneras. Semanas después, Opportunity descubrió que son ricas en hematita, y el equipo concluyó que crecieron dentro de roca empapada de agua.',
        'opp-endeavour': 'En el cráter Endeavour encontró fuertes indicios de la acción de agua antigua.',
        'opp-dust': 'El rover solar dejó de comunicarse cuando una fuerte tormenta de polvo que abarcó todo Marte cubrió su ubicación en junio de 2018.',
      },
      credits: [ART],
    },
    insight: {
      title: 'Módulo de aterrizaje InSight en Marte',
      chapterTitle: 'Escuchando el corazón de Marte',
      target: 'Marte — Elysium Planitia',
      hardwareType: 'Módulo de aterrizaje fijo con un sismómetro y una sonda de flujo de calor',
      chronology: [
        { date: '5 de mayo de 2018', event: 'Lanzamiento desde la Tierra.' },
        { date: '26 de noviembre de 2018', event: 'Aterriza en Elysium Planitia.' },
        { date: '15 de diciembre de 2022', event: 'Última comunicación con la Tierra.' },
        { date: '21 de diciembre de 2022', event: 'La NASA anuncia el final de la misión.' },
      ],
      statusDetail: 'La misión científica terminó en diciembre de 2022, cuando el módulo se quedó sin energía.',
      scienceQuestion: '¿Cómo es el interior de Marte?',
      method: 'Registrar las vibraciones del suelo con su sismómetro, SEIS (Experimento Sísmico para la Estructura Interior).',
      result: 'Detectó 1319 sismos marcianos, algunos causados por impactos de meteoroides, lo que dio a los científicos una forma de estudiar la corteza, el manto y el núcleo.',
      takeaway: 'Puedes estudiar lo que hay bajo la superficie de un planeta sin excavar hasta su núcleo.',
      claims: {
        'ins-landing': 'InSight aterrizó en Elysium Planitia, Marte, el 26 de noviembre de 2018.',
        'ins-quakes': 'InSight detectó 1319 sismos marcianos, incluidos sismos causados por impactos de meteoroides.',
        'ins-interior': 'Los datos del sismómetro dan a los científicos una forma de estudiar la corteza, el manto y el núcleo del planeta.',
        'ins-end': 'InSight se comunicó por última vez con la Tierra el 15 de diciembre de 2022.',
      },
      credits: [
        ART,
        'Los sismogramas de este capítulo son ilustraciones sintéticas, no grabaciones de la NASA.',
      ],
    },
    voyager: {
      title: 'Voyager 1',
      chapterTitle: 'Más allá del último planeta',
      target: 'Espacio interestelar',
      hardwareType: 'Sonda de espacio profundo de propulsión nuclear (generadores termoeléctricos de radioisótopos)',
      chronology: [
        { date: '5 de septiembre de 1977', event: 'Lanzamiento desde la Tierra.' },
        { date: '17 de febrero de 1998', event: 'Se convierte en el objeto fabricado por el ser humano más lejano.' },
        { date: '25 de agosto de 2012', event: 'Sale de la heliosfera y empieza a medir el espacio interestelar.' },
        { date: '17 de abril de 2026', event: 'Los ingenieros apagan un instrumento más para ahorrar energía.' },
      ],
      statusDetail: 'Sigue viajando y sigue comunicándose con la Tierra. La NASA indica su estado como “Misión extendida”. La energía se agota poco a poco, así que los instrumentos se apagan uno a uno.',
      scienceQuestion: '¿Cómo es el espacio más allá de la burbuja del Sol, la heliosfera?',
      method: 'Medir ondas de plasma y campos magnéticos en el espacio interestelar.',
      result: 'La primera nave en medir directamente el entorno interestelar.',
      takeaway: 'No todos los exploradores se han quedado en silencio: algunos todavía envían noticias desde el borde.',
      claims: {
        'voy-launch': 'Voyager 1 se lanzó el 5 de septiembre de 1977.',
        'voy-interstellar': 'El 25 de agosto de 2012, Voyager 1 se convirtió en la primera nave en salir de la heliosfera y medir el espacio interestelar.',
        'voy-status': 'La NASA indica el estado de Voyager como “Misión extendida”.',
        'voy-power': 'A Voyager 1 le queda poca energía y pierde unos 4 vatios cada año; desde abril de 2026 tiene dos instrumentos científicos en funcionamiento.',
        'voy-golden-record': 'Ambas sondas Voyager llevan un disco chapado en oro de 12 pulgadas con 115 imágenes, saludos en cincuenta y cinco idiomas, sonidos naturales y 90 minutos de música.',
        'voy-light-day': 'En noviembre de 2026, la Voyager 1 alcanza una distancia de alrededor de un día luz de la Tierra.',
      },
      credits: [ART],
    },
  },
  scenes: {
    apollo11: {
      hook: {
        title: 'Un espejo en la Luna',
        body: [
          'En 1969, los astronautas del Apolo 11 dejaron un pequeño panel en el Mar de la Tranquilidad. No tiene batería, ni radio, ni piezas móviles.',
          'Y, sin embargo, los científicos en la Tierra lo siguen usando desde hace décadas. ¿Cómo puede ayudar a la ciencia algo que nunca “habla”?',
        ],
        narration: 'No emito pitidos. No llamo a casa. Espero en el polvo gris y, cuando la luz me encuentra, la devuelvo directamente.',
      },
      tool: {
        title: 'La herramienta: un retrorreflector',
        body: [
          'Un retrorreflector es un espejo que devuelve la luz en la misma dirección de la que vino, como el reflector de una bicicleta que brilla ante los faros.',
          'El panel del Apolo 11 tiene 100 prismas de esquina de vidrio, cada uno de 3,8 cm de ancho, en un marco de 46 cm. Los observatorios le disparan un láser y captan la luz que regresa.',
        ],
      },
      experiment: {
        title: 'Mide la distancia a la Luna',
        body: [
          'Diriges una estación de telemetría láser. La luz es rápida, unos 300.000 km por segundo, pero no instantánea. Apunta al reflector, dispara un pulso, mide su tiempo de ida y vuelta y conviértelo en una distancia.',
        ],
      },
      reveal: {
        title: 'Lo que hacen las estaciones reales',
        body: [
          'Las estaciones reales de telemetría láser hacen la misma cuenta con relojes increíblemente precisos: distancia = velocidad de la luz × tiempo de ida y vuelta ÷ 2.',
          'Solo una parte diminuta de la luz láser vuelve, así que se necesitan láseres potentes y detectores muy sensibles. Estas mediciones revelaron que la Luna se aleja de la Tierra unos 3,8 cm cada año.',
        ],
      },
      discovery: {
        title: 'Descubrimiento: silencioso, pero no inútil',
        body: [
          'El trabajo del reflector nunca necesitó energía, así que nunca “se agotó”. Su diseño sencillo le permite seguir ayudando mucho después de que los astronautas volvieran a casa.',
          'La ingeniería puede sobrevivir a su misión original y seguir apoyando a la ciencia.',
        ],
      },
    },
    opportunity: {
      hook: {
        title: 'Noventa soles… y muchos más',
        body: [
          'Un sol es un día marciano: unas 24,6 horas. Opportunity se construyó para funcionar 90 soles y recorrer unos 1000 metros.',
          'Aterrizó en enero de 2004. Siguió en marcha casi 15 años y recorrió más de 28 millas (45 km).',
        ],
        narration: 'Esperaban que durara una estación marciana. Cada mañana salía el Sol, mis paneles despertaban y había otra roca que leer.',
      },
      problem: {
        title: 'La pregunta: ¿fue Marte húmedo alguna vez?',
        body: [
          'Hoy Marte es frío y seco. Pero los científicos se preguntaban si alguna vez fluyó agua líquida allí y si el Marte antiguo pudo ser un lugar donde sobreviviera vida diminuta.',
          'El agua deja huellas en las rocas. El trabajo de Opportunity era leerlas.',
        ],
      },
      experiment: {
        title: 'Sigue el agua',
        body: [
          'Formas parte del equipo científico del rover. Examina cada muestra del mapa, lee lo que observó Opportunity y decide: ¿apoya la idea de que hubo agua en el pasado? Después, descubre por qué la luz del Sol importaba tanto.',
        ],
      },
      reveal: {
        title: 'Lo que nos contaron las rocas',
        body: [
          'Los descubrimientos de Opportunity apuntaron a agua líquida en el Marte antiguo, y la NASA dice que su región de aterrizaje pudo ser habitable en algún momento de la historia marciana.',
          'Son pruebas sobre entornos del pasado, no la prueba de que allí existiera vida.',
          'En junio de 2018, una tormenta de polvo que cubrió el planeta tapó la luz solar. Su última comunicación llegó el 10 de junio de 2018. La NASA dio por terminada la misión el 13 de febrero de 2019.',
        ],
      },
      discovery: {
        title: 'Descubrimiento: las rocas recuerdan',
        body: [
          'El agua desapareció de la superficie marciana hace mucho, pero los minerales que formó siguen ahí para quien sepa leerlos.',
          'Las rocas registran la historia de los entornos del pasado.',
        ],
      },
    },
    insight: {
      hook: {
        title: 'Un explorador que nunca se movió',
        body: [
          'En noviembre de 2018, InSight aterrizó en una llanura llamada Elysium Planitia. A diferencia de un rover, se quedó en el mismo lugar durante toda su misión.',
          'En lugar de conducir, escuchó.',
        ],
        narration: 'No podía vagar. Así que posé un oído muy paciente en el suelo y esperé a que Marte se estremeciera.',
      },
      problem: {
        title: 'La pregunta: ¿qué hay dentro de Marte?',
        body: [
          'Nadie puede excavar hasta el centro de un planeta. Pero un sismo marciano, una sacudida del suelo de Marte como un terremoto en la Tierra, envía ondas a través de su interior.',
          'El sismómetro de InSight, llamado SEIS, registró esas vibraciones.',
        ],
      },
      experiment: {
        title: 'Investigador de sismos marcianos',
        body: [
          'Un sismómetro mide movimientos diminutos del suelo. Los tres trazos de abajo son ejemplos sintéticos creados para esta lección, no grabaciones reales de la NASA. Encuentra el probable sismo marciano y usa sus ondas para razonar sobre el interior oculto de Marte.',
        ],
      },
      reveal: {
        title: 'Las ondas como mensajeras',
        body: [
          'Las ondas sísmicas se aceleran, se frenan, se curvan y rebotan al encontrar capas distintas. Comparando muchos sismos, los científicos pueden crear un modelo de lo que hay debajo.',
          'InSight detectó 1319 sismos marcianos, algunos causados por impactos de meteoroides. Sus datos permiten estudiar la corteza, el manto y el núcleo de Marte.',
        ],
      },
      discovery: {
        title: 'Descubrimiento: escuchar es explorar',
        body: [
          'InSight llamó a casa por última vez el 15 de diciembre de 2022, cuando su energía bajó demasiado. En cuatro años de escucha convirtió leves temblores en el retrato de un mundo oculto.',
          'Puedes estudiar lo que hay bajo la superficie de un planeta sin excavar hasta su núcleo.',
        ],
      },
    },
    voyager: {
      hook: {
        title: 'No todos los exploradores callan',
        body: [
          'El reflector espera en la Luna. Opportunity e InSight descansan en Marte. Pero una máquina de 1977 sigue en movimiento.',
          'Voyager 1 se lanzó el 5 de septiembre de 1977. No descansa en ningún sitio: vuela por el espacio y todavía envía datos a casa.',
        ],
      },
      problem: {
        title: 'Más allá de la burbuja del Sol',
        body: [
          'El Sol sopla alrededor de los planetas una burbuja de partículas llamada heliosfera. El 25 de agosto de 2012, Voyager 1 se convirtió en la primera nave en salir de ella y medir el espacio interestelar.',
          'Su fuente de energía nuclear pierde unos 4 vatios al año, así que los ingenieros apagan los instrumentos de uno en uno. En 2026, todavía funcionan dos instrumentos científicos.',
        ],
      },
      experiment: {
        title: 'Empareja cada máquina con su estado',
        body: [
          'Cuatro máquinas, cuatro historias distintas. Elige el estado que corresponde a cada una y después comprueba tus respuestas.',
        ],
      },
      'golden-record': {
        title: 'Un mensaje a bordo',
        body: [
          'Voyager 1 lleva algo más que instrumentos. Ambas sondas Voyager llevan un disco chapado en oro de 12 pulgadas: un mensaje de la Tierra, guardado en una funda protectora de aluminio.',
          'Abre cada parte del disco aquí abajo para ver lo que la humanidad decidió enviar.',
        ],
      },
      discovery: {
        title: 'Epílogo: la señal continúa',
        body: [
          'En noviembre de 2026, la Voyager 1 alcanza una distancia de alrededor de un día luz de la Tierra: tan lejos que su mensaje de radio tarda un día entero en llegar.',
          'Algunas máquinas se quedan en silencio. Sus descubrimientos, no.',
        ],
      },
    },
  },
  statusLabels: {
    'passive-still-useful': 'Pasivo, pero todavía útil',
    'mission-ended': 'Misión finalizada',
    'extended-mission': 'Misión extendida en activo',
  },
  stageLabels: {
    hook: 'Informe de la misión',
    problem: 'La ciencia',
    experiment: 'Experimento interactivo',
    reveal: 'Conexión real con la NASA',
    discovery: 'Descubrimiento',
  },
  narrationLabel: 'Narración imaginada a partir de los registros de misión de la NASA',
  futureQuestion: '¿Qué máquina lanzada durante tu vida crees que nos seguirá enseñando dentro de 50 años, y por qué?',
  targets: {
    reflector: {
      label: 'El conjunto de reflectores del Apolo 11',
      feedback: 'Objetivo fijado. Cada prisma de esquina devuelve la luz hacia el lugar del que vino, así que parte del pulso puede regresar al telescopio.',
    },
    ground: {
      label: 'El suelo lunar desnudo a su lado',
      feedback: 'El suelo desnudo dispersa la luz en todas direcciones, así que vuelve mucha menos luz directamente. Prueba con el objetivo diseñado para devolver la luz a casa.',
    },
  },
  formulas: {
    ct: {
      label: 'distancia = velocidad de la luz × tiempo',
      feedback: 'Eso da la longitud del viaje completo: de ida Y de vuelta. Pista: la luz cruzó la distancia dos veces.',
    },
    ct2: {
      label: 'distancia = velocidad de la luz × tiempo ÷ 2',
      feedback: '¡Exacto! El pulso viajó hasta la Luna y volvió, así que la mitad del recorrido total es la distancia de ida.',
    },
    c_t: {
      label: 'distancia = velocidad de la luz ÷ tiempo',
      feedback: 'Dividir una velocidad entre un tiempo no da una distancia. Pista: velocidad × tiempo = distancia recorrida.',
    },
  },
  gap: {
    farther: {
      label: 'Más lejos',
      feedback: 'Correcto. La primera onda (P) es más rápida que la segunda (S), así que cuanto más lejos viajan, más crece el intervalo.',
    },
    closer: {
      label: 'Más cerca',
      feedback: 'No del todo. Piensa en dos corredores a velocidades distintas: cuanto más larga es la carrera, mayor es la diferencia en la meta. Lo mismo pasa con las dos ondas.',
    },
  },
  layers: {
    layers: {
      label: 'Dónde están los límites entre las capas y a qué profundidad',
      feedback: '¡Sí! Las ondas se aceleran, se frenan, se curvan y rebotan en los límites. Medir el tiempo de muchas de ellas permite cartografiar capas que nadie puede ver.',
    },
    color: {
      label: 'De qué color son las rocas en las profundidades',
      feedback: 'Las ondas sísmicas no transportan color. Transportan tiempos: cuándo llegan y cómo cambian. Pista: piensa en qué cambia cuando una onda encuentra una capa nueva.',
    },
    weather: {
      label: 'Qué tiempo hacía durante el sismo',
      feedback: 'El viento puede añadir ruido a un sismómetro, pero los científicos intentan eliminarlo. Pista: la señal útil viajó a través del planeta, no por el aire.',
    },
  },
  verdicts: {
    water: 'Apoya la idea de agua antigua',
    'not-clear': 'Por sí sola no es una pista de agua',
  },
  samples: {
    hematite: {
      name: 'Hematita en el lugar de aterrizaje',
      location: 'Meridiani Planum, donde aterrizó Opportunity',
      observation: 'Opportunity encontró hematita, un mineral que se forma en el agua, en su lugar de aterrizaje.',
      properties: [
        'Tipo: mineral (un óxido de hierro)',
        'Cómo lo describe la NASA: “un mineral que se forma en el agua”',
      ],
      explanation: 'Este mineral se forma en el agua, así que encontrarlo es una pista sólida de que alguna vez hubo agua allí.',
      hint: 'Vuelve a leer la observación: ¿qué dice la NASA que necesita este mineral para formarse?',
    },
    jarosite: {
      name: 'Jarosita en la roca “El Capitán”',
      location: 'Un afloramiento en capas dentro del cráter Eagle (2004)',
      observation: 'Los instrumentos encontraron sales de sulfato, entre ellas jarosita, un mineral de sulfato de hierro hidratado.',
      properties: [
        'Tipo: mineral salino',
        '“Hidratado” significa que el agua forma parte del propio mineral',
      ],
      explanation: 'El agua forma parte de la jarosita. En 2004, el equipo científico concluyó que alguna vez fluyó agua líquida a través de estas rocas y cambió su textura y su química.',
      hint: 'Fíjate en la palabra “hidratado”. ¿Qué forma parte de este mineral?',
    },
    spherules: {
      name: 'Diminutas esferas redondas',
      location: 'Incrustadas en el mismo afloramiento (descubiertas en 2004)',
      observation: 'Partículas redondas del tamaño de perdigones están incrustadas en el afloramiento. Al principio, solo se conocía su forma.',
      properties: [
        'Forma: redonda, de unos pocos milímetros de ancho',
        'Al descubrirlas, la NASA mencionó varios orígenes posibles',
      ],
      explanation: '¡Buena prudencia científica! Cuando se descubrieron las esferas, su forma no bastaba para decidir: la NASA mencionó erupciones volcánicas, gotas fundidas por el impacto de un meteorito o minerales que se separan del agua. Semanas después, las pruebas mostraron que son ricas en hematita, y los científicos concluyeron que crecieron dentro de roca empapada de agua. Ir paso a paso hizo más sólida la respuesta final.',
      hint: 'Al descubrir las esferas, la NASA mencionó más de una forma en que podían formarse. ¿Basta su forma para demostrar que hubo agua?',
    },
    endeavour: {
      name: 'Rocas del cráter Endeavour',
      location: 'Cráter Endeavour, de unos 22 km (13 millas) de ancho',
      observation: 'Opportunity descubrió en el cráter Endeavour fuertes indicios de la acción de agua antigua.',
      properties: [
        'Alcanzado tras años de viaje',
        'Rocas más antiguas que las cercanas al lugar de aterrizaje',
      ],
      explanation: 'Estas rocas fueron transformadas por el agua hace mucho tiempo y todavía conservan un registro de esa agua.',
      hint: '¿De qué dice la NASA que muestran señales estas rocas?',
    },
    eagle: {
      name: 'El pequeño cráter donde aterrizó',
      location: 'Cráter Eagle, Meridiani Planum',
      observation: 'Opportunity se detuvo dentro de un pequeño cráter de impacto llamado Eagle.',
      properties: [
        'Tipo: cráter de impacto (formado cuando algo golpeó el suelo)',
        'Sus paredes dejaron al descubierto roca madre para estudiar',
      ],
      explanation: '¡Cierto, y qué suerte! Las paredes del cráter dieron al rover rocas para estudiar. Pero el cráter en sí solo nos dice dónde aterrizó, no si allí hubo agua.',
      hint: 'Un cráter se forma por un impacto. ¿Necesita agua un impacto?',
    },
  },
  waves: {
    quiet: {
      label: 'Trazo A',
      description: 'Una línea fina y estable con solo oscilaciones diminutas todo el tiempo.',
      shape: 'Plana y tranquila de principio a fin',
      feedback: 'Este trazo se mantiene tranquilo todo el tiempo: un tramo silencioso en el que no pasa gran cosa. Busca un trazo con un comienzo claro.',
    },
    event: {
      label: 'Trazo B',
      description: 'Calma, luego una primera sacudida repentina y después una segunda llegada, más grande, que se desvanece poco a poco.',
      shape: 'Calma → inicio brusco → segunda llegada mayor → desvanecimiento lento',
      feedback: '¡Sí! Un inicio brusco, una segunda llegada y un desvanecimiento lento son el patrón que buscan los sismólogos en un sismo o un impacto.',
    },
    wind: {
      label: 'Trazo C',
      description: 'Ráfagas desordenadas de sacudidas repartidas por todo el registro, sin un comienzo claro.',
      shape: 'Ráfagas irregulares que van y vienen',
      feedback: 'Mucha sacudida, pero sin un comienzo claro ni una segunda llegada. Ráfagas así se parecen más al viento o a otro ruido. Pista: un sismo empieza de repente.',
    },
  },
  matches: {
    apollo11: {
      label: 'Reflector láser del Apolo 11',
      explanation: 'Sin energía y sin radio, pero todavía devuelve luz láser cuyo tiempo pueden medir los científicos.',
      hint: '¿Necesita energía para hacer su trabajo?',
    },
    opportunity: {
      label: 'Rover Opportunity',
      explanation: 'Quedó en silencio en la tormenta de polvo de 2018; la NASA dio por terminada la misión en febrero de 2019.',
      hint: 'Recuerda lo que la tormenta de polvo de 2018 les hizo a sus paneles solares.',
    },
    insight: {
      label: 'Módulo de aterrizaje InSight',
      explanation: 'Se quedó sin energía; último contacto el 15 de diciembre de 2022.',
      hint: '¿Cuándo llamó InSight a casa por última vez?',
    },
    voyager: {
      label: 'Voyager 1',
      explanation: 'Sigue viajando por el espacio interestelar y todavía envía datos a casa.',
      hint: '¿Esta máquina todavía envía datos a la Tierra hoy?',
    },
  },
  goldenRecord: {
    images: {
      title: 'Imágenes',
      fact: '115 imágenes, reunidas por Carl Sagan y sus colaboradores, que muestran la vida y la ciencia en la Tierra.',
    },
    greetings: {
      title: 'Saludos',
      fact: 'Saludos hablados de personas de la Tierra en cincuenta y cinco idiomas.',
    },
    sounds: {
      title: 'Sonidos de la Tierra',
      fact: 'Sonidos naturales como el oleaje, el viento y los truenos, las aves y las ballenas.',
    },
    music: {
      title: 'Música',
      fact: 'Una selección ecléctica de 90 minutos de música.',
    },
    cover: {
      title: 'La cubierta',
      fact: 'Unas instrucciones en lenguaje simbólico explican de dónde vino la nave y cómo reproducir el disco.',
    },
  },
};
