import type { ContentTranslation } from '../localize.ts';

const ART = 'Ilustraciones y diagramas: gráficos originales en CSS/SVG del equipo ECHOES (no son imágenes de la NASA).';

/** Traducción al español del contenido científico. Las claves y el orden coinciden con los datos en inglés. */
export const es: ContentTranslation = {
  missions: {
    apollo11: {
      title: 'Retrorreflector láser del Apolo 11',
      chapterTitle: 'El espejo que nunca se calló',
      target: 'La Luna — Mar de la Tranquilidad',
      hardwareType: 'Panel pasivo de retrorreflectores (sin energía y sin radio)',
      chronology: [
        { date: '1969', event: 'Los astronautas del Apolo 11 dejan el panel de reflectores en la Luna.' },
        { date: 'Desde entonces, décadas', event: 'Observatorios en la Tierra apuntan con regularidad a los reflectores de las misiones Apolo.' },
      ],
      statusDetail: 'No tiene energía ni envía señales propias. Simplemente refleja la luz láser que los observatorios le apuntan.',
      scienceQuestion: '¿A qué distancia está la Luna y cómo cambia esa distancia?',
      method: 'Telemetría láser lunar: medir cuánto tarda un pulso láser en ir hasta el reflector y volver.',
      result: 'Distancia = velocidad de la luz × tiempo de ida y vuelta ÷ 2.',
      takeaway: 'La ingeniería puede sobrevivir a su misión original y seguir ayudando a la ciencia.',
      claims: {
        'ap11-cubes': 'El panel del Apolo 11 tiene 100 reflectores de esquina de sílice fundida, de 3,8 cm de diámetro cada uno, en un panel de aluminio de 46 cm.',
        'ap11-location': 'El panel del Apolo 11 se encuentra en el Mar de la Tranquilidad.',
        'ap11-ranging': 'Observatorios en la Tierra han medido con regularidad la distancia a la Luna usando los reflectores de las misiones Apolo.',
        'moon-receding': 'La Luna se aleja lentamente de la Tierra: unos 2,5 cm (cerca de una pulgada) más cada año.',
      },
      credits: [ART],
    },
    opportunity: {
      title: 'Rover Opportunity de exploración de Marte',
      chapterTitle: 'El rover que sobrevivió a su misión',
      target: 'Marte — Meridiani Planum',
      hardwareType: 'Rover de seis ruedas con paneles solares',
      chronology: [
        { date: '7 de julio de 2003', event: 'Lanzamiento desde la Tierra.' },
        { date: '24 de enero de 2004 (hora del Pacífico)', event: 'Aterriza en Meridiani Planum, dentro de un pequeño cráter llamado Eagle.' },
        { date: '10 de junio de 2018', event: 'Última comunicación, durante una tormenta de polvo que cubrió todo el planeta.' },
        { date: '13 de febrero de 2019', event: 'La NASA declara terminada la misión.' },
      ],
      statusDetail: 'La misión terminó el 13 de febrero de 2019, después de que más de mil comandos no lograran recuperar el contacto.',
      scienceQuestion: '¿Fue el antiguo Marte más húmedo y, quizá, habitable?',
      method: 'Conducir hasta las rocas y estudiar sus minerales y texturas con cámaras e instrumentos.',
      result: 'Encontró hematita, un mineral que se forma en el agua, y fuertes indicios de agua antigua en el cráter Endeavour. Esto apunta a condiciones habitables en el pasado, pero no demuestra que hubiera vida.',
      takeaway: 'Las rocas guardan la historia de los ambientes del pasado.',
      claims: {
        'opp-90-sols': 'Opportunity fue diseñado para durar 90 soles (días marcianos) y recorrer unos 1000 metros.',
        'opp-sol': 'Un sol es un día marciano: Marte completa una rotación cada 24,6 horas.',
        'opp-15-years': 'La misión duró casi 15 años y el rover recorrió más de 45 km (28 millas).',
        'opp-hematite': 'Opportunity encontró hematita, un mineral que se forma en el agua, en su lugar de aterrizaje.',
        'opp-jarosite': 'En 2004, los instrumentos encontraron sales de sulfato, incluida la jarosita, un sulfato de hierro hidratado, y el equipo concluyó que alguna vez fluyó agua líquida a través de las rocas.',
        'opp-spherules': 'Según la NASA en 2004, las partículas redondas del tamaño de perdigones en el afloramiento podían formarse de varias maneras: volcánica, por impacto o a partir de minerales que salen de una solución.',
        'opp-endeavour': 'En el cráter Endeavour encontró fuertes indicios de la acción de agua antigua.',
        'opp-dust': 'El rover solar dejó de comunicarse cuando una fuerte tormenta de polvo que abarcó todo Marte cubrió su ubicación en junio de 2018.',
      },
      credits: [ART],
    },
    insight: {
      title: 'Módulo de aterrizaje InSight',
      chapterTitle: 'Escuchando el corazón de Marte',
      target: 'Marte — Elysium Planitia',
      hardwareType: 'Módulo de aterrizaje fijo con un sismómetro y una sonda de flujo de calor',
      chronology: [
        { date: '5 de mayo de 2018', event: 'Lanzamiento desde la Tierra.' },
        { date: '26 de noviembre de 2018', event: 'Aterriza en Elysium Planitia.' },
        { date: '15 de diciembre de 2022', event: 'Última comunicación con la Tierra.' },
        { date: '21 de diciembre de 2022', event: 'La NASA anuncia el fin de la misión.' },
      ],
      statusDetail: 'La misión científica terminó en diciembre de 2022, cuando el módulo se quedó sin energía.',
      scienceQuestion: '¿Cómo es Marte por dentro?',
      method: 'Registrar las vibraciones del suelo con su sismómetro SEIS (Seismic Experiment for Interior Structure, experimento sísmico de estructura interior).',
      result: 'Detectó 1319 martemotos (sismos marcianos), algunos causados por impactos de meteoroides, lo que dio a los científicos una forma de estudiar la corteza, el manto y el núcleo.',
      takeaway: 'Puedes estudiar lo que hay bajo la superficie de un planeta sin excavar hasta su núcleo.',
      claims: {
        'ins-landing': 'InSight aterrizó en Elysium Planitia, Marte, el 26 de noviembre de 2018.',
        'ins-quakes': 'InSight detectó 1319 martemotos, incluidos algunos causados por impactos de meteoroides.',
        'ins-interior': 'Los datos del sismómetro dan a los científicos una forma de estudiar la corteza, el manto y el núcleo del planeta.',
        'ins-end': 'InSight se comunicó por última vez con la Tierra el 15 de diciembre de 2022.',
      },
      credits: [ART, 'Los sismogramas de este capítulo son ilustraciones sintéticas, no grabaciones de la NASA.'],
    },
    voyager: {
      title: 'Voyager 1',
      chapterTitle: 'Más allá del último planeta',
      target: 'Espacio interestelar',
      hardwareType: 'Sonda de espacio profundo con energía nuclear (generadores termoeléctricos de radioisótopos)',
      chronology: [
        { date: '5 de septiembre de 1977', event: 'Lanzamiento desde la Tierra.' },
        { date: '17 de febrero de 1998', event: 'Se convierte en el objeto hecho por humanos más lejano.' },
        { date: '25 de agosto de 2012', event: 'Sale de la heliosfera y empieza a medir el espacio interestelar.' },
        { date: '17 de abril de 2026', event: 'Los ingenieros apagan un instrumento más para ahorrar energía.' },
      ],
      statusDetail: 'Sigue viajando y sigue comunicándose con la Tierra. La NASA indica su estado como «misión extendida» (Extended Mission). Su energía disminuye poco a poco, así que los instrumentos se apagan uno a uno.',
      scienceQuestion: '¿Cómo es el espacio más allá de la «burbuja» del Sol, la heliosfera?',
      method: 'Medir ondas de plasma y campos magnéticos en el espacio interestelar.',
      result: 'La primera nave espacial en medir directamente el medio interestelar.',
      takeaway: 'No todos los exploradores se han callado: algunos aún envían noticias desde el borde.',
      claims: {
        'voy-launch': 'La Voyager 1 se lanzó el 5 de septiembre de 1977.',
        'voy-interstellar': 'El 25 de agosto de 2012, la Voyager 1 se convirtió en la primera nave espacial en salir de la heliosfera y medir el espacio interestelar.',
        'voy-status': 'La NASA indica el estado de la Voyager como «misión extendida» (Extended Mission).',
        'voy-power': 'A la Voyager 1 se le agota la energía: pierde unos 4 vatios al año; desde abril de 2026 tiene dos instrumentos científicos en funcionamiento.',
        'voy-golden-record': 'Ambas Voyager llevan un disco chapado en oro de 12 pulgadas con 115 imágenes, saludos en cincuenta y cinco idiomas, sonidos de la naturaleza y 90 minutos de música.',
        'voy-light-day': 'En noviembre de 2026, la NASA hace la cuenta regresiva hasta que la Voyager 1 esté a cerca de un día luz de la Tierra.',
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
          'Y aun así, los científicos en la Tierra lo siguen usando desde hace décadas. ¿Cómo puede ayudar a la ciencia algo que nunca «habla»?',
        ],
        narration: 'No pito. No llamo a casa. Espero en el polvo gris y, cuando la luz me encuentra, la devuelvo en línea recta.',
      },
      tool: {
        title: 'La herramienta: un retrorreflector',
        body: [
          'Un retrorreflector es un espejo que devuelve la luz en la misma dirección de la que vino, como el reflector de una bicicleta que brilla ante los faros.',
          'El panel del Apolo 11 tiene 100 reflectores de esquina de vidrio, de 3,8 cm cada uno, en un marco de 46 cm. Los observatorios le disparan un láser y captan la luz que regresa.',
        ],
      },
      experiment: {
        title: 'Mide la distancia a la Luna',
        body: [
          'Diriges una estación de telemetría láser. La luz es rapidísima —unos 300 000 km por segundo—, pero no instantánea. Apunta al reflector, dispara un pulso, cronometra su ida y vuelta y convierte ese tiempo en una distancia.',
        ],
      },
      reveal: {
        title: 'Lo que hacen las estaciones reales',
        body: [
          'Las estaciones reales de telemetría láser hacen la misma cuenta con relojes increíblemente precisos: distancia = velocidad de la luz × tiempo de ida y vuelta ÷ 2.',
          'Solo una parte diminuta de la luz láser logra regresar, así que hacen falta láseres potentes y detectores sensibles. Las mediciones cuidadosas ayudan a estudiar la órbita de la Luna. La NASA señala que la Luna se aleja unos 2,5 cm de la Tierra cada año.',
        ],
      },
      discovery: {
        title: 'Descubrimiento: callado, pero no inútil',
        body: [
          'El trabajo del reflector nunca necesitó energía, así que nunca «se agotó». Su diseño sencillo le permite seguir ayudando mucho después de que los astronautas volvieran a casa.',
          'La ingeniería puede sobrevivir a su misión original y seguir ayudando a la ciencia.',
        ],
      },
    },
    opportunity: {
      hook: {
        title: 'Noventa soles… y muchos más',
        body: [
          'Un sol es un día marciano, de unas 24,6 horas. Opportunity se construyó para funcionar 90 soles y recorrer unos 1000 metros.',
          'Aterrizó en enero de 2004. Siguió funcionando casi 15 años y recorrió más de 45 km (28 millas).',
        ],
        narration: 'Esperaban que durara una estación marciana. Cada mañana salía el Sol, mis paneles despertaban y había otra roca que leer.',
      },
      problem: {
        title: 'La pregunta: ¿fue Marte húmedo alguna vez?',
        body: [
          'Hoy Marte es frío y seco. Pero los científicos se preguntaban si alguna vez corrió agua líquida allí, y si el antiguo Marte pudo ser un lugar donde sobreviviera vida diminuta.',
          'El agua deja huellas en las rocas. El trabajo de Opportunity era leerlas.',
        ],
      },
      experiment: {
        title: 'Sigue el rastro del agua',
        body: [
          'Formas parte del equipo científico del rover. Examina cada muestra del mapa, lee lo que observó Opportunity y decide: ¿apoya la idea de agua antigua? Después, descubre por qué la luz del Sol era tan importante.',
        ],
      },
      reveal: {
        title: 'Lo que nos contaron las rocas',
        body: [
          'Los descubrimientos de Opportunity apuntaron a agua líquida en el antiguo Marte, y la NASA afirma que su región de aterrizaje pudo ser habitable en algún momento de la historia marciana.',
          'Son pruebas sobre ambientes del pasado, no una prueba de que allí haya existido vida.',
          'En junio de 2018, una tormenta de polvo que cubrió todo el planeta bloqueó la luz del Sol. Su última comunicación llegó el 10 de junio de 2018. La NASA declaró terminada la misión el 13 de febrero de 2019.',
        ],
      },
      discovery: {
        title: 'Descubrimiento: las rocas recuerdan',
        body: [
          'El agua desapareció de la superficie marciana hace mucho, pero los minerales que formó siguen ahí para ser leídos.',
          'Las rocas guardan la historia de los ambientes del pasado.',
        ],
      },
    },
    insight: {
      hook: {
        title: 'Un explorador que nunca se movió',
        body: [
          'En noviembre de 2018, InSight aterrizó en una llanura llamada Elysium Planitia. A diferencia de un rover, permaneció en el mismo lugar durante toda su misión.',
          'En vez de conducir, escuchó.',
        ],
        narration: 'No podía recorrer el paisaje. Así que apoyé un oído muy paciente en el suelo y esperé a que Marte se estremeciera.',
      },
      problem: {
        title: 'La pregunta: ¿qué hay dentro de Marte?',
        body: [
          'Nadie puede excavar hasta el centro de un planeta. Pero un martemoto —una sacudida del suelo marciano, como un terremoto en la Tierra— envía ondas a través del interior de Marte.',
          'El sismómetro de InSight, llamado SEIS, registró esas vibraciones.',
        ],
      },
      experiment: {
        title: 'Investigador de martemotos',
        body: [
          'Un sismómetro mide movimientos diminutos del suelo. Los tres registros de abajo son ejemplos sintéticos hechos para esta lección, no grabaciones reales de la NASA. Encuentra el probable martemoto y usa sus ondas para razonar sobre el interior oculto de Marte.',
        ],
      },
      reveal: {
        title: 'Ondas mensajeras',
        body: [
          'Las ondas sísmicas se aceleran, se frenan, se desvían y rebotan al encontrarse con capas distintas. Comparando muchos sismos, los científicos construyen un modelo de lo que hay debajo.',
          'InSight detectó 1319 martemotos, algunos causados por impactos de meteoroides. Sus datos dan a los científicos una forma de estudiar la corteza, el manto y el núcleo de Marte.',
        ],
      },
      discovery: {
        title: 'Descubrimiento: escuchar es explorar',
        body: [
          'InSight llamó a casa por última vez el 15 de diciembre de 2022, cuando su energía bajó demasiado. En cuatro años de escucha convirtió leves estremecimientos en la imagen de un mundo oculto.',
          'Puedes estudiar lo que hay bajo la superficie de un planeta sin excavar hasta su núcleo.',
        ],
      },
    },
    voyager: {
      hook: {
        title: 'No todos los exploradores se han callado',
        body: [
          'El reflector espera en la Luna. Opportunity e InSight descansan en Marte. Pero una máquina de 1977 sigue en marcha.',
          'La Voyager 1 se lanzó el 5 de septiembre de 1977. No descansa en ningún lugar: vuela por el espacio y todavía envía datos a casa.',
        ],
      },
      problem: {
        title: 'Más allá de la burbuja del Sol',
        body: [
          'El Sol sopla alrededor de los planetas una burbuja de partículas llamada heliosfera. El 25 de agosto de 2012, la Voyager 1 se convirtió en la primera nave en salir de ella y medir el espacio interestelar.',
          'Su fuente de energía nuclear pierde unos 4 vatios al año, así que los ingenieros apagan los instrumentos uno a uno. En 2026 aún funcionan dos instrumentos científicos.',
        ],
      },
      experiment: {
        title: 'Relaciona cada máquina con su estado',
        body: ['Cuatro máquinas, cuatro historias distintas. Elige el estado que corresponde a cada una y comprueba tus respuestas.'],
      },
      'golden-record': {
        title: 'Un mensaje a bordo',
        body: [
          'La Voyager 1 lleva algo más que instrumentos. Las dos Voyager llevan un disco chapado en oro de 12 pulgadas: un mensaje de la Tierra, guardado en una funda protectora de aluminio.',
          'Abre cada parte del disco para ver lo que la humanidad eligió enviar.',
        ],
      },
      discovery: {
        title: 'Epílogo: la señal continúa',
        body: [
          'En noviembre de 2026, la NASA hace la cuenta regresiva hasta que la Voyager 1 esté a cerca de un día luz de la Tierra: tan lejos que su mensaje de radio tarda un día entero en llegar.',
          'Algunas máquinas se callan. Sus descubrimientos, no.',
        ],
      },
    },
  },

  statusLabels: {
    'passive-still-useful': 'Pasivo, pero todavía útil',
    'mission-ended': 'Misión terminada',
    'extended-mission': 'Misión extendida activa',
  },
  stageLabels: {
    hook: 'Informe de la misión',
    problem: 'La ciencia',
    experiment: 'Experimento interactivo',
    reveal: 'Conexión real con la NASA',
    discovery: 'Descubrimiento',
  },
  narrationLabel: 'Narración imaginada basada en registros de misiones de la NASA',
  futureQuestion: '¿Qué máquina lanzada durante tu vida crees que seguirá enseñándonos dentro de 50 años, y por qué?',

  targets: {
    reflector: { label: 'El panel de reflectores del Apolo 11', feedback: 'Objetivo fijado. Cada reflector de esquina devuelve la luz hacia el lugar de donde vino, así que parte del pulso puede volver al telescopio.' },
    ground: { label: 'El suelo lunar desnudo junto a él', feedback: 'El suelo desnudo dispersa la luz en todas direcciones, así que vuelve mucha menos. Prueba con el objetivo que está hecho para devolver la luz a casa.' },
  },
  formulas: {
    ct: { label: 'distancia = velocidad de la luz × tiempo', feedback: 'Eso da la longitud de todo el viaje, de ida Y vuelta. Pista: la luz recorrió la distancia dos veces.' },
    ct2: { label: 'distancia = velocidad de la luz × tiempo ÷ 2', feedback: '¡Exacto! El pulso fue a la Luna y volvió, así que la mitad del recorrido total es la distancia de ida.' },
    c_t: { label: 'distancia = velocidad de la luz ÷ tiempo', feedback: 'Dividir una velocidad entre un tiempo no da una distancia. Pista: velocidad × tiempo = distancia recorrida.' },
  },
  gap: {
    farther: { label: 'Más lejos', feedback: 'Correcto. La primera onda (P) es más rápida que la segunda (S), así que cuanto más viajan, más crece la separación.' },
    closer: { label: 'Más cerca', feedback: 'No del todo. Piensa en dos corredores con velocidades distintas: cuanto más larga es la carrera, mayor es la ventaja en la meta. Con las dos ondas pasa lo mismo.' },
  },
  layers: {
    layers: { label: 'Dónde están los límites entre capas y a qué profundidad', feedback: '¡Sí! Las ondas se aceleran, se frenan, se desvían y rebotan en los límites. Cronometrando muchas de ellas, los científicos trazan un mapa de capas que nunca podrán ver.' },
    color: { label: 'De qué color son las rocas en lo profundo', feedback: 'Las ondas sísmicas no transmiten colores. Transmiten tiempos: cuándo llegan y cómo cambian. Pista: piensa en qué cambia cuando una onda encuentra una capa nueva.' },
    weather: { label: 'Qué tiempo hacía durante el sismo', feedback: 'El viento puede añadir ruido a un sismómetro, pero los científicos intentan eliminarlo. Pista: la señal útil viajó a través del planeta, no por el aire.' },
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
      properties: ['Tipo: mineral (un óxido de hierro)', 'Cómo lo describe la NASA: «un mineral que se forma en el agua»'],
      explanation: 'Este mineral se forma en el agua, así que encontrarlo es una pista sólida de que alguna vez hubo agua allí.',
      hint: 'Vuelve a leer la observación: ¿qué dice la NASA que necesita este mineral para formarse?',
    },
    jarosite: {
      name: 'Jarosita en la roca «El Capitán»',
      location: 'Un afloramiento en capas dentro del cráter Eagle (2004)',
      observation: 'Los instrumentos encontraron sales de sulfato, entre ellas jarosita, un sulfato de hierro hidratado.',
      properties: ['Tipo: mineral salino', '«Hidratado» significa que el agua forma parte del propio mineral'],
      explanation: 'El agua está incorporada en la jarosita. En 2004, el equipo científico concluyó que alguna vez fluyó agua líquida a través de estas rocas y cambió su textura y su química.',
      hint: 'Fíjate en la palabra «hidratado». ¿Qué lleva incorporado este mineral?',
    },
    spherules: {
      name: 'Pequeñas esferas redondas',
      location: 'Incrustadas en el mismo afloramiento (2004)',
      observation: 'Hay partículas redondas, del tamaño de perdigones, incrustadas en el afloramiento.',
      properties: ['Forma: redondas, de unos pocos milímetros', 'En 2004, la NASA mencionó varios orígenes posibles'],
      explanation: '¡Buena prudencia científica! En 2004, la NASA mencionó varias formas en que podían formarse estas esferas: erupciones volcánicas, gotas fundidas por el impacto de un meteorito o minerales que se separan del agua. La forma por sí sola no podía resolverlo.',
      hint: 'La NASA mencionó más de una forma en que podían formarse estas esferas. ¿Basta su forma para demostrar que hubo agua?',
    },
    endeavour: {
      name: 'Rocas del cráter Endeavour',
      location: 'Cráter Endeavour, de unos 22 km (13 millas) de ancho',
      observation: 'Opportunity descubrió en el cráter Endeavour fuertes indicios de la acción de agua antigua.',
      properties: ['El rover tardó años en llegar', 'Rocas más antiguas que las del lugar de aterrizaje'],
      explanation: 'El agua cambió estas rocas hace mucho tiempo, y todavía conservan un registro de esa agua.',
      hint: '¿De qué dice la NASA que muestran señales estas rocas?',
    },
    eagle: {
      name: 'El pequeño cráter donde aterrizó',
      location: 'Cráter Eagle, Meridiani Planum',
      observation: 'Opportunity se detuvo dentro de un pequeño cráter de impacto llamado Eagle.',
      properties: ['Tipo: cráter de impacto (se forma cuando algo golpea el suelo)', 'Sus paredes dejaron al descubierto roca para estudiar'],
      explanation: '¡Cierto, y una suerte! Las paredes del cráter le dieron al rover rocas para estudiar. Pero el cráter en sí solo nos dice dónde aterrizó, no si hubo agua.',
      hint: 'Un cráter se forma por un impacto. ¿Un impacto necesita agua?',
    },
  },
  waves: {
    quiet: { label: 'Registro A', description: 'Una línea fina y estable, con oscilaciones diminutas todo el tiempo.', shape: 'Plana y tranquila de principio a fin', feedback: 'Este registro está tranquilo todo el tiempo: un tramo en calma en el que casi no pasa nada. Busca un registro con un inicio claro.' },
    event: { label: 'Registro B', description: 'Calma, luego una primera sacudida repentina y después una segunda llegada, más fuerte, que se apaga poco a poco.', shape: 'Calma → inicio brusco → segunda llegada más fuerte → desvanecimiento lento', feedback: '¡Sí! Un inicio brusco, una segunda llegada y un desvanecimiento lento son el patrón que buscan los sismólogos en un sismo o un impacto.' },
    wind: { label: 'Registro C', description: 'Ráfagas desordenadas de vibración repartidas por todo el registro, sin un inicio claro.', shape: 'Ráfagas irregulares que van y vienen', feedback: 'Mucha vibración, pero sin un inicio claro ni una segunda llegada. Ráfagas así se parecen más al viento o a otro ruido. Pista: un sismo empieza de repente.' },
  },
  matches: {
    apollo11: { label: 'Reflector láser del Apolo 11', explanation: 'Sin energía ni radio, pero todavía devuelve luz láser que los científicos pueden cronometrar.', hint: '¿Necesita energía para hacer su trabajo?' },
    opportunity: { label: 'Rover Opportunity', explanation: 'Se quedó en silencio en la tormenta de polvo de 2018; la NASA dio por terminada la misión en febrero de 2019.', hint: 'Recuerda lo que la tormenta de polvo de 2018 hizo con sus paneles solares.' },
    insight: { label: 'Módulo InSight', explanation: 'Se quedó sin energía; último contacto el 15 de diciembre de 2022.', hint: '¿Cuándo llamó InSight a casa por última vez?' },
    voyager: { label: 'Voyager 1', explanation: 'Sigue viajando por el espacio interestelar y todavía envía datos a casa.', hint: '¿Esta máquina sigue enviando datos a la Tierra hoy?' },
  },
  goldenRecord: {
    images: { title: 'Imágenes', fact: '115 imágenes, reunidas por Carl Sagan y sus colaboradores, que muestran la vida y la ciencia en la Tierra.' },
    greetings: { title: 'Saludos', fact: 'Saludos hablados de personas de la Tierra en cincuenta y cinco idiomas.' },
    sounds: { title: 'Sonidos de la Tierra', fact: 'Sonidos naturales como el oleaje, el viento y los truenos, las aves y las ballenas.' },
    music: { title: 'Música', fact: 'Una ecléctica selección de música de 90 minutos.' },
    cover: { title: 'La cubierta', fact: 'Instrucciones en lenguaje simbólico explican de dónde viene la nave y cómo reproducir el disco.' },
  },
};
