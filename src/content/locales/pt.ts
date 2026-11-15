import type { ContentTranslation } from '../localize.ts';

const ART = 'Ilustrações e diagramas: arte original em CSS/SVG da equipe ECHOES (não são imagens da NASA).';

/** Tradução para o português do conteúdo científico. Chaves e ordem iguais aos dados em inglês. */
export const pt: ContentTranslation = {
  missions: {
    apollo11: {
      title: 'Retrorrefletor de Medição a Laser da Apollo 11',
      chapterTitle: 'O Espelho Que Nunca Silenciou',
      target: 'A Lua — Mar da Tranquilidade',
      hardwareType: 'Painel passivo de retrorrefletores (sem energia, sem rádio)',
      chronology: [
        { date: '1969', event: 'Os astronautas da Apollo 11 deixam o painel de refletores na Lua.' },
        { date: '1969 → hoje', event: 'Observatórios de medição a laser na Terra continuam mirando os refletores da Apollo.' },
      ],
      statusDetail: 'Não tem energia e não envia nenhum sinal próprio. Ele simplesmente reflete a luz de laser que os observatórios apontam para ele.',
      scienceQuestion: 'A que distância está a Lua — e como essa distância muda?',
      method: 'Medição lunar a laser: cronometrar a ida e volta de um pulso de laser até o refletor.',
      result: 'Distância = velocidade da luz × tempo de ida e volta ÷ 2.',
      takeaway: 'A engenharia pode durar mais que a missão original e continuar apoiando a ciência.',
      claims: {
        'ap11-cubes': 'O painel da Apollo 11 tem 100 refletores de canto de sílica fundida, cada um com 3,8 cm de largura, num painel de alumínio de 46 cm.',
        'ap11-location': 'O painel da Apollo 11 fica no Mar da Tranquilidade.',
        'ap11-ranging': 'Observatórios na Terra medem regularmente a distância até a Lua usando os refletores das missões Apollo.',
        'moon-receding': 'A medição a laser mostra que a Lua está se afastando lentamente da Terra: cerca de 3,8 cm por ano.',
      },
      credits: [ART],
    },
    opportunity: {
      title: 'Rover de Exploração de Marte Opportunity',
      chapterTitle: 'O Rover Que Sobreviveu à Própria Missão',
      target: 'Marte — Meridiani Planum',
      hardwareType: 'Rover de seis rodas movido a energia solar',
      chronology: [
        { date: '7 de julho de 2003', event: 'Lançamento da Terra.' },
        { date: '24 de jan. de 2004 (PST)', event: 'Pousa em Meridiani Planum, dentro de uma pequena cratera chamada Eagle.' },
        { date: '10 de junho de 2018', event: 'Última comunicação, durante uma tempestade de poeira que cobriu o planeta inteiro.' },
        { date: '13 de fev. de 2019', event: 'A NASA declara o fim da missão.' },
      ],
      statusDetail: 'Missão encerrada em 13 de fev. de 2019, depois que mais de mil comandos não conseguiram restabelecer o contato.',
      scienceQuestion: 'A Marte antiga já foi mais úmida — e talvez habitável?',
      method: 'Dirigir até rochas e estudar seus minerais e texturas com câmeras e instrumentos.',
      result: 'Encontrou hematita, um mineral que se forma na água, e fortes sinais de água antiga na cratera Endeavour. Isso aponta para condições habitáveis no passado — não é prova de vida.',
      takeaway: 'As rochas registram a história dos ambientes do passado.',
      claims: {
        'opp-90-sols': 'A Opportunity foi projetada para durar 90 sóis (dias marcianos) e percorrer cerca de 1.000 metros.',
        'opp-sol': 'Um sol é um dia marciano; Marte completa uma rotação a cada 24,6 horas.',
        'opp-15-years': 'A missão durou quase 15 anos, e o rover percorreu mais de 28 milhas (45 km).',
        'opp-hematite': 'A Opportunity encontrou hematita, um mineral que se forma na água, no seu local de pouso.',
        'opp-jarosite': 'Em 2004, os instrumentos encontraram sais de sulfato, incluindo jarosita, um mineral de sulfato de ferro hidratado, e a equipe concluiu que água líquida já correu pelas rochas.',
        'opp-spherules': 'Quando foram descobertas em 2004, as esferas do tamanho de chumbinhos podiam ter se formado de várias maneiras. Semanas depois, a Opportunity descobriu que elas são ricas em hematita, e a equipe concluiu que cresceram dentro de rocha encharcada de água.',
        'opp-endeavour': 'Na cratera Endeavour, encontrou fortes indícios da ação de água antiga.',
        'opp-dust': 'O rover movido a energia solar parou de se comunicar quando uma forte tempestade de poeira, em todo o planeta, cobriu sua localização em junho de 2018.',
      },
      credits: [ART],
    },
    insight: {
      title: 'Módulo de Pouso InSight em Marte',
      chapterTitle: 'Ouvindo o Coração de Marte',
      target: 'Marte — Elysium Planitia',
      hardwareType: 'Módulo de pouso fixo com um sismômetro e uma sonda de fluxo de calor',
      chronology: [
        { date: '5 de maio de 2018', event: 'Lançamento da Terra.' },
        { date: '26 de nov. de 2018', event: 'Pousa em Elysium Planitia.' },
        { date: '15 de dez. de 2022', event: 'Última comunicação com a Terra.' },
        { date: '21 de dez. de 2022', event: 'A NASA anuncia o fim da missão.' },
      ],
      statusDetail: 'A missão científica terminou em dezembro de 2022, depois que o módulo ficou sem energia.',
      scienceQuestion: 'Como é o interior de Marte?',
      method: 'Registrar as vibrações do solo com seu sismômetro, o SEIS (Experimento Sísmico para a Estrutura Interior).',
      result: 'Detectou 1.319 martemotos, incluindo alguns causados por impactos de meteoroides, dando aos cientistas um jeito de estudar a crosta, o manto e o núcleo.',
      takeaway: 'Dá para estudar o que existe sob a superfície de um planeta sem cavar até o núcleo.',
      claims: {
        'ins-landing': 'A InSight pousou em Elysium Planitia, em Marte, em 26 de nov. de 2018.',
        'ins-quakes': 'A InSight detectou 1.319 martemotos, incluindo tremores causados por impactos de meteoroides.',
        'ins-interior': 'Os dados do sismômetro dão aos cientistas um jeito de estudar a crosta, o manto e o núcleo do planeta.',
        'ins-end': 'A InSight se comunicou com a Terra pela última vez em 15 de dez. de 2022.',
      },
      credits: [ART, 'Os sismogramas deste capítulo são ilustrações sintéticas, não gravações da NASA.'],
    },
    voyager: {
      title: 'Voyager 1',
      chapterTitle: 'Além do Último Planeta',
      target: 'Espaço interestelar',
      hardwareType: 'Sonda de espaço profundo movida a energia nuclear (geradores termoelétricos de radioisótopos)',
      chronology: [
        { date: '5 de set. de 1977', event: 'Lançamento da Terra.' },
        { date: '17 de fev. de 1998', event: 'Torna-se o objeto feito pelo ser humano mais distante.' },
        { date: '25 de ago. de 2012', event: 'Deixa a heliosfera e começa a medir o espaço interestelar.' },
        { date: '17 de abr. de 2026', event: 'Os engenheiros desligam mais um instrumento para economizar energia.' },
      ],
      statusDetail: 'Ainda viajando e ainda falando com a Terra. A NASA lista sua situação como “Missão Estendida”. A energia está diminuindo aos poucos, então os instrumentos são desligados um a um.',
      scienceQuestion: 'Como é o espaço além da bolha do Sol, a heliosfera?',
      method: 'Medir ondas de plasma e campos magnéticos no espaço interestelar.',
      result: 'A primeira sonda a medir diretamente o ambiente interestelar.',
      takeaway: 'Nem todo explorador silenciou — alguns ainda mandam notícias da fronteira.',
      claims: {
        'voy-launch': 'A Voyager 1 foi lançada em 5 de set. de 1977.',
        'voy-interstellar': 'Em 25 de ago. de 2012, a Voyager 1 se tornou a primeira sonda a sair da heliosfera e medir o espaço interestelar.',
        'voy-status': 'A NASA lista a situação da Voyager como “Missão Estendida”.',
        'voy-power': 'A Voyager 1 está com pouca energia, perdendo cerca de 4 watts por ano; depois de abril de 2026, ela tem dois instrumentos científicos funcionando.',
        'voy-golden-record': 'As duas Voyagers levam um disco banhado a ouro de 12 polegadas com 115 imagens, saudações em cinquenta e cinco idiomas, sons da natureza e 90 minutos de música.',
        'voy-light-day': 'Em novembro de 2026, a Voyager 1 alcança cerca de um dia-luz de distância da Terra.',
      },
      credits: [ART],
    },
  },
  scenes: {
    apollo11: {
      hook: {
        title: 'Um espelho na Lua',
        body: [
          'Em 1969, os astronautas da Apollo 11 deixaram um pequeno painel no Mar da Tranquilidade. Ele não tem bateria, nem rádio, nem peças móveis.',
          'E mesmo assim os cientistas na Terra continuam a usá-lo há décadas. Como algo que nunca “fala” ainda pode ajudar a ciência?',
        ],
        narration: 'Eu não apito. Eu não ligo para casa. Espero na poeira cinzenta e, quando a luz me encontra, eu a devolvo na mesma hora.',
      },
      tool: {
        title: 'A ferramenta: um retrorrefletor',
        body: [
          'Um retrorrefletor é um espelho que devolve a luz na mesma direção de onde ela veio — como o refletor de uma bicicleta brilhando de volta para os faróis.',
          'O painel da Apollo 11 tem 100 prismas de canto de vidro, cada um com 3,8 cm de largura, numa moldura de 46 cm. Os observatórios disparam um laser contra ele e captam a luz que volta.',
        ],
      },
      experiment: {
        title: 'Meça a distância até a Lua',
        body: [
          'Você está operando uma estação de medição a laser. A luz é rápida — cerca de 300.000 km por segundo — mas não instantânea. Mire no refletor, dispare um pulso, cronometre a ida e volta e transforme esse tempo em distância.',
        ],
      },
      reveal: {
        title: 'O que as estações reais fazem',
        body: [
          'As estações reais de medição a laser fazem a mesma conta com relógios incrivelmente precisos: distância = velocidade da luz × tempo de ida e volta ÷ 2.',
          'Só uma parte minúscula da luz do laser volta, por isso são necessários lasers potentes e detectores sensíveis. Essas medições revelaram que a Lua se afasta da Terra cerca de 3,8 cm por ano.',
        ],
      },
      discovery: {
        title: 'Descoberta: silencioso, mas não inútil',
        body: [
          'O trabalho do refletor nunca precisou de energia, então ela nunca “acabou”. Seu design simples permite que ele continue ajudando muito depois de os astronautas voltarem para casa.',
          'A engenharia pode durar mais que a missão original e continuar apoiando a ciência.',
        ],
      },
    },
    opportunity: {
      hook: {
        title: 'Noventa sóis… e muito mais',
        body: [
          'Um sol é um dia marciano — cerca de 24,6 horas. A Opportunity foi construída para funcionar por 90 sóis e percorrer cerca de 1.000 metros.',
          'Ela pousou em janeiro de 2004. Continuou funcionando por quase 15 anos e percorreu mais de 28 milhas (45 km).',
        ],
        narration: 'Esperavam que eu durasse uma estação marciana. Toda manhã o Sol nascia, meus painéis acordavam e havia mais uma rocha para ler.',
      },
      problem: {
        title: 'A pergunta: Marte já foi úmido?',
        body: [
          'Hoje Marte é frio e seco. Mas os cientistas se perguntavam se já correu água líquida por lá — e se a Marte antiga poderia ter sido um lugar onde uma vida minúscula sobreviveria.',
          'A água deixa impressões digitais nas rochas. O trabalho da Opportunity era lê-las.',
        ],
      },
      experiment: {
        title: 'Siga a água',
        body: [
          'Você faz parte da equipe científica do rover. Examine cada amostra no mapa, leia o que a Opportunity observou e decida: ela apoia a ideia de água antiga? Depois, descubra por que a luz do Sol importava tanto.',
        ],
      },
      reveal: {
        title: 'O que as rochas nos contaram',
        body: [
          'As descobertas da Opportunity apontaram para água líquida na Marte antiga, e a NASA diz que sua região de pouso pode ter sido habitável em algum momento da história marciana.',
          'Isso é evidência sobre ambientes do passado — não prova de que já existiu vida lá.',
          'Em junho de 2018, uma tempestade de poeira em todo o planeta bloqueou a luz do Sol. Sua última comunicação chegou em 10 de junho de 2018. A NASA declarou o fim da missão em 13 de fev. de 2019.',
        ],
      },
      discovery: {
        title: 'Descoberta: as rochas se lembram',
        body: [
          'A água sumiu da superfície marciana há muito tempo, mas os minerais que ela formou ainda estão lá para serem lidos.',
          'As rochas registram a história dos ambientes do passado.',
        ],
      },
    },
    insight: {
      hook: {
        title: 'Uma exploradora que nunca se moveu',
        body: [
          'Em novembro de 2018, a InSight pousou numa planície chamada Elysium Planitia. Diferente de um rover, ela ficou no mesmo lugar durante toda a missão.',
          'Em vez de dirigir, ela escutou.',
        ],
        narration: 'Eu não podia passear. Então encostei um ouvido muito paciente no chão e esperei Marte estremecer.',
      },
      problem: {
        title: 'A pergunta: o que há dentro de Marte?',
        body: [
          'Ninguém consegue cavar até o centro de um planeta. Mas um martemoto — um tremor do solo marciano, como um terremoto na Terra — envia ondas pelo interior de Marte.',
          'O sismômetro da InSight, chamado SEIS, registrou essas vibrações.',
        ],
      },
      experiment: {
        title: 'Investigador de martemotos',
        body: [
          'Um sismômetro mede movimentos minúsculos do solo. Os três registros abaixo são exemplos sintéticos feitos para esta lição, não gravações reais da NASA. Encontre o provável martemoto e use suas ondas para raciocinar sobre o interior escondido de Marte.',
        ],
      },
      reveal: {
        title: 'Ondas como mensageiras',
        body: [
          'As ondas sísmicas aceleram, desaceleram, se curvam e ricocheteiam ao encontrar camadas diferentes. Comparando muitos tremores, os cientistas montam um modelo do que existe lá embaixo.',
          'A InSight detectou 1.319 martemotos, incluindo alguns causados por impactos de meteoroides. Seus dados dão aos cientistas um jeito de estudar a crosta, o manto e o núcleo de Marte.',
        ],
      },
      discovery: {
        title: 'Descoberta: escutar é explorar',
        body: [
          'A InSight ligou para casa pela última vez em 15 de dez. de 2022, quando sua energia ficou baixa demais. Em quatro anos de escuta, ela transformou tremores fracos no retrato de um mundo escondido.',
          'Dá para estudar o que existe sob a superfície de um planeta sem cavar até o núcleo.',
        ],
      },
    },
    voyager: {
      hook: {
        title: 'Nem todo explorador está em silêncio',
        body: [
          'O refletor espera na Lua. A Opportunity e a InSight descansam em Marte. Mas uma máquina de 1977 ainda está em movimento.',
          'A Voyager 1 foi lançada em 5 de set. de 1977. Ela não está descansando em lugar nenhum — está voando pelo espaço e ainda envia dados para casa.',
        ],
      },
      problem: {
        title: 'Além da bolha do Sol',
        body: [
          'O Sol sopra uma bolha de partículas em volta dos planetas, chamada heliosfera. Em 25 de ago. de 2012, a Voyager 1 se tornou a primeira sonda a sair dela e medir o espaço interestelar.',
          'Sua fonte de energia nuclear perde cerca de 4 watts por ano, então os engenheiros desligam os instrumentos um de cada vez. Em 2026, dois instrumentos científicos ainda funcionam.',
        ],
      },
      experiment: {
        title: 'Associe cada máquina à sua situação',
        body: [
          'Quatro máquinas, quatro histórias diferentes. Escolha a situação que combina com cada uma e depois verifique suas respostas.',
        ],
      },
      'golden-record': {
        title: 'Uma mensagem a bordo',
        body: [
          'A Voyager 1 leva mais do que instrumentos. As duas Voyagers carregam um disco banhado a ouro de 12 polegadas: uma mensagem da Terra, selada numa capa protetora de alumínio.',
          'Abra cada parte do disco abaixo para ver o que a humanidade escolheu enviar.',
        ],
      },
      discovery: {
        title: 'Epílogo: o sinal continua',
        body: [
          'Em novembro de 2026, a Voyager 1 alcança cerca de um dia-luz de distância da Terra: tão longe que sua mensagem de rádio leva um dia inteiro para chegar.',
          'Algumas máquinas silenciam. Suas descobertas, não.',
        ],
      },
    },
  },
  statusLabels: {
    'passive-still-useful': 'Passivo, mas ainda útil',
    'mission-ended': 'Missão encerrada',
    'extended-mission': 'Missão estendida ativa',
  },
  stageLabels: {
    hook: 'Briefing da missão',
    problem: 'A ciência',
    experiment: 'Experimento interativo',
    reveal: 'Conexão real com a NASA',
    discovery: 'Descoberta',
  },
  narrationLabel: 'Narração imaginada com base nos registros das missões da NASA',
  futureQuestion: 'Qual máquina lançada durante a sua vida você acha que ainda vai estar nos ensinando daqui a 50 anos — e por quê?',
  targets: {
    reflector: {
      label: 'O painel de refletores da Apollo 11',
      feedback: 'Alvo travado. Cada prisma de canto devolve a luz para o lugar de onde ela veio, então parte do pulso pode voltar ao telescópio.',
    },
    ground: {
      label: 'O solo lunar nu ao lado dele',
      feedback: 'O solo nu espalha a luz em todas as direções, então muito menos luz volta direto. Tente o alvo construído para mandar a luz de volta para casa.',
    },
  },
  formulas: {
    ct: {
      label: 'distância = velocidade da luz × tempo',
      feedback: 'Isso dá o comprimento da viagem inteira — ida E volta. Dica: a luz atravessou a distância duas vezes.',
    },
    ct2: {
      label: 'distância = velocidade da luz × tempo ÷ 2',
      feedback: 'Exatamente! O pulso foi até a Lua e voltou, então metade do caminho total é a distância só de ida.',
    },
    c_t: {
      label: 'distância = velocidade da luz ÷ tempo',
      feedback: 'Dividir uma velocidade por um tempo não dá uma distância. Dica: velocidade × tempo = distância percorrida.',
    },
  },
  gap: {
    farther: {
      label: 'Mais longe',
      feedback: 'Certo. A primeira onda (P) é mais rápida que a segunda (S), então quanto mais elas viajam, maior fica o intervalo.',
    },
    closer: {
      label: 'Mais perto',
      feedback: 'Quase. Pense em dois corredores com velocidades diferentes: quanto mais longa a corrida, maior a diferença na chegada. O mesmo vale para as duas ondas.',
    },
  },
  layers: {
    layers: {
      label: 'Onde ficam as fronteiras entre as camadas e a que profundidade',
      feedback: 'Isso! As ondas aceleram, desaceleram, se curvam e ricocheteiam nas fronteiras. Cronometrar muitas delas permite mapear camadas que ninguém consegue ver.',
    },
    color: {
      label: 'De que cor são as rochas lá no fundo',
      feedback: 'As ondas sísmicas não carregam cor. Elas carregam tempo: quando chegam e como mudam. Dica: pense no que muda quando uma onda encontra uma nova camada.',
    },
    weather: {
      label: 'Como estava o tempo durante o tremor',
      feedback: 'O vento pode adicionar ruído a um sismômetro, mas os cientistas tentam removê-lo. Dica: o sinal útil viajou pelo planeta, não pelo ar.',
    },
  },
  verdicts: {
    water: 'Apoia a ideia de água antiga',
    'not-clear': 'Sozinha, não é uma pista de água',
  },
  samples: {
    hematite: {
      name: 'Hematita no local de pouso',
      location: 'Meridiani Planum, onde a Opportunity pousou',
      observation: 'A Opportunity encontrou hematita, um mineral que se forma na água, no seu local de pouso.',
      properties: [
        'Tipo: mineral (um óxido de ferro)',
        'Como a NASA o descreve: “um mineral que se forma na água”',
      ],
      explanation: 'Esse mineral se forma na água, então encontrá-lo é uma pista forte de que já houve água ali.',
      hint: 'Leia a observação de novo: do que a NASA diz que esse mineral precisa para se formar?',
    },
    jarosite: {
      name: 'Jarosita na rocha “El Capitan”',
      location: 'Um afloramento em camadas dentro da cratera Eagle (2004)',
      observation: 'Os instrumentos encontraram sais de sulfato, incluindo jarosita — um mineral de sulfato de ferro hidratado.',
      properties: [
        'Tipo: mineral salino',
        '“Hidratado” significa que a água faz parte do próprio mineral',
      ],
      explanation: 'A água faz parte da jarosita. Em 2004, a equipe científica concluiu que água líquida já correu por essas rochas, mudando sua textura e sua química.',
      hint: 'Observe a palavra “hidratado”. O que faz parte desse mineral?',
    },
    spherules: {
      name: 'Esferas minúsculas',
      location: 'Incrustadas no mesmo afloramento (descobertas em 2004)',
      observation: 'Partículas redondas do tamanho de chumbinhos estão incrustadas no afloramento. No início, só se conhecia o formato delas.',
      properties: [
        'Forma: redonda, com poucos milímetros de largura',
        'Logo após a descoberta, a NASA listou várias origens possíveis',
      ],
      explanation: 'Boa cautela científica! Quando as esferas foram descobertas, o formato sozinho não resolvia a questão: a NASA listou erupções vulcânicas, gotas derretidas pelo impacto de um meteorito ou minerais que se separam da água. Semanas depois, testes mostraram que elas são ricas em hematita, e os cientistas concluíram que cresceram dentro de rocha encharcada de água. Ir com cuidado deixou a resposta final mais forte.',
      hint: 'Logo após a descoberta, a NASA listou mais de uma maneira de essas esferas se formarem. O formato sozinho basta para provar que havia água?',
    },
    endeavour: {
      name: 'Rochas na cratera Endeavour',
      location: 'Cratera Endeavour, com cerca de 22 km (13 milhas) de largura',
      observation: 'A Opportunity descobriu na cratera Endeavour fortes indícios da ação de água antiga.',
      properties: [
        'Alcançada depois de anos de viagem',
        'Rochas mais antigas que as próximas ao local de pouso',
      ],
      explanation: 'Essas rochas foram alteradas pela água há muito tempo e guardam até hoje um registro dessa água.',
      hint: 'De que a NASA diz que essas rochas mostram sinais?',
    },
    eagle: {
      name: 'A pequena cratera onde pousou',
      location: 'Cratera Eagle, Meridiani Planum',
      observation: 'A Opportunity parou dentro de uma pequena cratera de impacto chamada Eagle.',
      properties: [
        'Tipo: cratera de impacto (formada quando algo atingiu o solo)',
        'Suas paredes expuseram a rocha para ser estudada',
      ],
      explanation: 'Verdade, e que sorte! As paredes da cratera deram ao rover rochas para estudar. Mas a cratera em si só nos diz onde ele pousou, não se havia água ali.',
      hint: 'Uma cratera é formada por um impacto. Um impacto precisa de água?',
    },
  },
  waves: {
    quiet: {
      label: 'Registro A',
      description: 'Uma linha fina e estável, com apenas oscilações minúsculas o tempo todo.',
      shape: 'Plano e calmo do começo ao fim',
      feedback: 'Este registro fica calmo o tempo todo: um trecho tranquilo, sem quase nada acontecendo. Procure um registro com um começo nítido.',
    },
    event: {
      label: 'Registro B',
      description: 'Calmo, depois um primeiro solavanco súbito, depois uma segunda chegada maior que vai sumindo devagar.',
      shape: 'Calmo → início brusco → segunda chegada maior → fim lento',
      feedback: 'Isso! Um início brusco, uma segunda chegada e um fim lento são o padrão que os sismólogos procuram num tremor ou impacto.',
    },
    wind: {
      label: 'Registro C',
      description: 'Rajadas bagunçadas de tremor espalhadas por todo o registro, sem um começo claro.',
      shape: 'Rajadas irregulares que vêm e vão',
      feedback: 'Muito tremor, mas nenhum começo claro e nenhuma segunda chegada. Rajadas assim parecem mais vento ou outro ruído. Dica: um tremor começa de repente.',
    },
  },
  matches: {
    apollo11: {
      label: 'Refletor a laser da Apollo 11',
      explanation: 'Sem energia e sem rádio, mas ainda devolve a luz de laser que os cientistas conseguem cronometrar.',
      hint: 'Este precisa de energia para fazer seu trabalho?',
    },
    opportunity: {
      label: 'Rover Opportunity',
      explanation: 'Silenciou na tempestade de poeira de 2018; a NASA encerrou a missão em fevereiro de 2019.',
      hint: 'Lembre o que a tempestade de poeira de 2018 fez com seus painéis solares.',
    },
    insight: {
      label: 'Módulo de pouso InSight',
      explanation: 'Ficou sem energia; último contato em 15 de dez. de 2022.',
      hint: 'Quando a InSight ligou para casa pela última vez?',
    },
    voyager: {
      label: 'Voyager 1',
      explanation: 'Ainda viaja pelo espaço interestelar e ainda envia dados para casa.',
      hint: 'Esta máquina ainda envia dados para a Terra hoje?',
    },
  },
  goldenRecord: {
    images: {
      title: 'Imagens',
      fact: '115 imagens, reunidas por Carl Sagan e seus colaboradores, mostrando a vida e a ciência na Terra.',
    },
    greetings: {
      title: 'Saudações',
      fact: 'Saudações faladas por pessoas da Terra em cinquenta e cinco idiomas.',
    },
    sounds: {
      title: 'Sons da Terra',
      fact: 'Sons da natureza, como ondas do mar, vento e trovões, pássaros e baleias.',
    },
    music: {
      title: 'Música',
      fact: 'Uma seleção eclética de 90 minutos de música.',
    },
    cover: {
      title: 'A capa',
      fact: 'Instruções em linguagem simbólica explicam de onde a sonda veio e como tocar o disco.',
    },
  },
};
