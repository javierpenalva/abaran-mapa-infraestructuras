/**
 * ESCAPE ROOM «Abarán a oscuras · 72 horas».
 *
 * El equipo está en el CECOPAL (Centro de Coordinación Operativa Municipal)
 * con una batería de 72 horas. Debe resolver 6 enigmas: en cada uno
 *   1) descifra una adivinanza, 2) localiza el lugar en un mapa con marcadores
 *   ocultos, 3) lee el dossier y responde por qué ese lugar es crítico.
 * Cada enigma resuelto entrega una letra. Con las 6 letras se abre el candado final.
 *
 * Los datos de cada lugar salen de blackoutData.ts (contrastados en Google Maps y
 * en la Adenda al PEMU de Abarán). No se afirma que ningún edificio tenga generador.
 */

export interface EscapeQuestion {
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface EscapeEnigma {
  id: string;
  icon: string;
  /** Nombre de la «sala» del escape room. */
  room: string;
  /** Hora del apagón en que ocurre el suceso (narrativa). */
  hour: number;
  /** Situación que obliga a buscar el lugar. */
  situation: string;
  /** Adivinanza para localizarlo (sin nombrarlo). */
  riddle: string;
  /** Cualquiera de estos ids resuelve el enigma. */
  targetIds: string[];
  /** Id usado para las pistas de cuadrícula y zona. */
  hintTargetId: string;
  /** Pista 1 (texto). Las pistas 2 y 3 se generan: casilla y zona en el mapa. */
  textHint: string;
  /** Por qué es una infraestructura crítica en un apagón de 72 h. */
  whyCritical: string;
  /** Ideas clave que el alumnado debe recordar. */
  keyIdeas: string[];
  question: EscapeQuestion;
  letter: string;
}

export const ESCAPE_INTRO = {
  title: 'ABARÁN A OSCURAS',
  subtitle: 'Escape room · 72 horas sin luz',
  story: [
    'Martes, 11:20. Un apagón deja sin electricidad a toda la Región de Murcia. Los técnicos calculan que la luz puede tardar hasta 72 horas en volver.',
    'Vuestro equipo de cadetes de Protección Civil está en el CECOPAL, el centro desde donde se coordina la emergencia. Solo os queda una batería de 72 horas para la radio y el ordenador del plan de emergencias.',
    'El plan está bloqueado con un candado de 6 letras. Cada vez que localicéis una infraestructura crítica de Abarán y comprendáis por qué es importante, conseguiréis una letra.',
  ],
  rules: [
    { icon: '🗺️', text: 'En el mapa, los lugares están ocultos (❓). Leed la adivinanza y pulsad el que creáis correcto.' },
    { icon: '🌡️', text: 'Si falláis, la radio os dirá si estáis frío, templado o caliente… pero perderéis 2 horas.' },
    { icon: '💡', text: 'Podéis pedir pistas, aunque cuestan horas de batería.' },
    { icon: '📋', text: 'Al encontrar el lugar, leed el dossier: la pregunta trata sobre él. Una respuesta incorrecta resta 3 horas.' },
    { icon: '🔐', text: 'Con las 6 letras, abrid el candado final antes de que se agote la batería.' },
  ],
};

export const ESCAPE_PENALTIES = {
  wrongLocation: 2,
  wrongAnswer: 3,
  hints: [2, 4, 6] as const,
  wrongCode: 4,
};

export const ESCAPE_ENIGMAS: EscapeEnigma[] = [
  {
    id: 'e1-salud',
    icon: '🩺',
    room: 'La sala blanca',
    hour: 2,
    situation:
      'Una vecina se ha caído por la escalera a oscuras y tiene una herida en la cabeza. Su hijo os pregunta adónde llevarla.',
    riddle:
      'Batas blancas y camillas, aquí curan tus heridas. Busco el edificio del Servicio Murciano de Salud que está en la avenida con nombre de la ley más importante de España.',
    targetIds: ['inf-salud-01'],
    hintTargetId: 'inf-salud-01',
    textHint: 'La ley más importante de España es la Constitución de 1978. Recorred la Avenida de la Constitución en el callejero.',
    whyCritical:
      'Sin luz aumentan las caídas, las quemaduras con velas y las intoxicaciones por monóxido de carbono (braseros o generadores en interiores). Además, hay personas que dependen de aparatos eléctricos para respirar o de medicinas que deben estar en frío.',
    keyIdeas: [
      'El 112 funciona para emergencias reales: no lo uses para preguntar cuándo vuelve la luz.',
      'Ten en papel la lista de medicación, alergias y teléfonos importantes.',
      'No des por hecho que el centro mantiene todos sus servicios: sigue los avisos oficiales.',
    ],
    question: {
      prompt: 'Durante el apagón, ¿en cuál de estos casos SÍ hay que llamar al 112?',
      options: [
        'Para preguntar cuándo volverá la luz.',
        'Una persona inconsciente o con una herida grave.',
        'Para saber qué supermercado está abierto.',
        'Para comprobar si el móvil tiene cobertura.',
      ],
      correctIndex: 1,
      explanation:
        'El 112 es solo para emergencias. Si se satura con consultas, las personas que de verdad lo necesitan no podrán ser atendidas.',
    },
    letter: 'D',
  },
  {
    id: 'e2-cecopal',
    icon: '👮',
    room: 'El cerebro de la emergencia',
    hour: 6,
    situation:
      'No hay teléfono ni internet. Alguien tiene que organizar a los servicios de emergencia y decidir qué se hace primero.',
    riddle:
      'Según el Plan municipal, el centro de mando de la emergencia (CECOPAL) se instala en la casa de los agentes del pueblo. Su calle lleva el nombre del lugar donde se muele la aceituna para hacer aceite.',
    targetIds: ['inf-seg-01'],
    hintTargetId: 'inf-seg-01',
    textHint: 'El lugar donde se hace el aceite de oliva se llama «almazara». Buscad la Policía Local en la calle Almazara, en la zona del instituto.',
    whyCritical:
      'El CECOPAL es el «cerebro» de la emergencia: reúne al alcalde, la Policía Local, Protección Civil y otros servicios para decidir prioridades, repartir recursos y dar avisos a la población. Si cae la telefonía, la Adenda al PEMU prevé usar radio (TETRA) y avisos en persona.',
    keyIdeas: [
      'CECOPAL = Centro de Coordinación Operativa Municipal.',
      'Su sede principal prevista es la Jefatura de Policía Local.',
      'No acudas allí salvo que te lo pidan: deja libres los accesos.',
    ],
    question: {
      prompt: 'Si la Jefatura de Policía Local no pudiera usarse, ¿dónde se trasladaría el CECOPAL según la Adenda al PEMU de Abarán?',
      options: [
        'Al supermercado más grande.',
        'Al Edificio CIMA.',
        'A la casa del alcalde.',
        'A ningún sitio: la emergencia se suspende.',
      ],
      correctIndex: 1,
      explanation:
        'Los planes de emergencia siempre tienen un «plan B». En Abarán, el Edificio CIMA (calle Compositor David Templado) es la sede alternativa del CECOPAL.',
    },
    letter: 'U',
  },
  {
    id: 'e3-ayuntamiento',
    icon: '🏛️',
    room: 'La casa de todos',
    hour: 12,
    situation:
      'Corren rumores por el barrio: «dicen que el agua está contaminada», «dicen que la luz no vuelve en un mes». Los vecinos necesitan información oficial.',
    riddle:
      'Mi plaza es la más antigua y así lo dice su nombre; tengo el número 1 y aquí trabaja el alcalde. ¿Quién soy?',
    targetIds: ['inf-seg-04'],
    hintTargetId: 'inf-seg-04',
    textHint: 'La plaza «más antigua» se llama Plaza Vieja. Buscad la Casa Consistorial en el centro del casco urbano.',
    whyCritical:
      'El Ayuntamiento dirige el plan municipal de emergencias y es la fuente oficial de avisos. En un apagón, la información fiable evita el pánico, los rumores y que la gente haga cosas peligrosas.',
    keyIdeas: [
      'Infórmate por la radio a pilas y por los comunicados oficiales.',
      'No reenvíes cadenas ni rumores: además gastas batería.',
      'Acuerda con tu familia un punto de encuentro antes de necesitarlo.',
    ],
    question: {
      prompt: '¿Qué prevé la Adenda al PEMU para que el Ayuntamiento, la Policía Local y Protección Civil sigan funcionando sin luz?',
      options: [
        'Encender velas en todas las oficinas.',
        'Cerrar hasta que vuelva la electricidad.',
        'Grupos electrógenos portátiles y SAI para los equipos críticos.',
        'Pedir a los vecinos que lleven pilas.',
      ],
      correctIndex: 2,
      explanation:
        'Un grupo electrógeno es un motor que produce electricidad, y un SAI es una batería que evita que los ordenadores se apaguen de golpe. Es una medida planificada: no significa que estén siempre disponibles.',
    },
    letter: 'S',
  },
  {
    id: 'e4-farmacia',
    icon: '💊',
    room: 'La cruz verde',
    hour: 24,
    situation:
      'El abuelo de un compañero es diabético y usa insulina, que debe guardarse en frío. Su familia necesita consejo profesional.',
    riddle:
      'Busco un lugar con una cruz verde que brilla en la fachada, donde un profesional sanitario te aconseja sobre las medicinas. Hay varios en el pueblo: cualquiera vale.',
    targetIds: ['inf-far-01', 'inf-far-02', 'inf-far-03', 'inf-far-05'],
    hintTargetId: 'inf-far-01',
    textHint: 'Hay cuatro farmacias en el casco urbano. Una de ellas está en la misma plaza que el Ayuntamiento.',
    whyCritical:
      'Muchas personas necesitan su medicación todos los días. Sin luz, las neveras dejan de enfriar y algunos medicamentos (como la insulina) pueden estropearse. El farmacéutico puede orientar sobre cómo conservarlos.',
    keyIdeas: [
      'Ten en casa medicación para varios días, sobre todo la crónica.',
      'Consulta a un profesional sobre los medicamentos que necesitan frío.',
      'Ante un problema de salud grave, llama al 112.',
    ],
    question: {
      prompt: '¿Qué es lo más adecuado con un medicamento que necesita frío durante el apagón?',
      options: [
        'Dejarlo al sol para que no se congele.',
        'Congelarlo todo por si acaso.',
        'Consultar a un profesional y abrir la nevera lo menos posible.',
        'Tirarlo en cuanto se va la luz.',
      ],
      correctIndex: 2,
      explanation:
        'Cada medicamento tiene sus propias instrucciones. Una nevera cerrada mantiene el frío varias horas, y el farmacéutico puede decir qué hacer en cada caso.',
    },
    letter: 'N',
  },
  {
    id: 'e5-alimentos',
    icon: '🛒',
    room: 'La despensa',
    hour: 36,
    situation:
      'Ya han pasado día y medio sin luz. En muchas casas las neveras ya no enfrían y hace falta reponer comida que no necesite cocinarse.',
    riddle:
      'Carros, cajas y estanterías llenas de latas: aquí se compra la comida de toda la semana. Hay varios en Abarán: cualquiera vale.',
    targetIds: ['inf-sup-01', 'inf-sup-06', 'inf-sup-02', 'inf-sup-03'],
    hintTargetId: 'inf-sup-06',
    textHint: 'Hay supermercados en la Avenida de la Constitución, en la calle San Damián y en la Avenida del Río Segura.',
    whyCritical:
      'El abastecimiento de alimentos es un servicio esencial. Pero sin luz, las cajas registradoras, los datáfonos y las cámaras frigoríficas pueden fallar, y no está garantizado que abran. Por eso es mejor tener en casa un kit para 72 horas antes de que ocurra.',
    keyIdeas: [
      'Kit de 72 h: agua suficiente para beber y asearse (varios litros por persona y día), comida que no necesite cocinarse y abrelatas manual.',
      'Lleva algo de dinero en efectivo: los datáfonos pueden no funcionar.',
      'Compra solo lo necesario: acaparar deja sin comida a otras familias.',
    ],
    question: {
      prompt: '¿Qué comida es la mejor para un kit de emergencia de 72 horas sin luz?',
      options: [
        'Pizzas y helados congelados.',
        'Carne y pescado frescos.',
        'Conservas, legumbres cocidas, frutos secos y galletas.',
        'Alimentos que haya que cocinar al horno.',
      ],
      correctIndex: 2,
      explanation:
        'Lo ideal son alimentos que aguanten sin nevera y se puedan comer sin cocinar. No olvides el abrelatas manual ni el agua.',
    },
    letter: 'O',
  },
  {
    id: 'e6-polideportivo',
    icon: '🏟️',
    room: 'El refugio',
    hour: 48,
    situation:
      'Algunas personas mayores viven solas y sus casas están muy frías. Las autoridades estudian habilitar un gran espacio municipal para atenderlas.',
    riddle:
      'Soy una gran instalación deportiva del Ayuntamiento. Llevo el nombre de un príncipe y vivo en la avenida de una reina.',
    targetIds: ['inf-alb-01'],
    hintTargetId: 'inf-alb-01',
    textHint: 'El príncipe es el «Príncipe de Asturias» y la reina, «Reina Sofía». Está al norte del casco urbano.',
    whyCritical:
      'Un espacio amplio, cubierto y municipal puede servir para atender a muchas personas a la vez (calor, agua, información, cargar aparatos). Pero solo funciona como punto de apoyo si las autoridades lo activan y lo organizan.',
    keyIdeas: [
      'Los albergues o puntos de apoyo los activan las autoridades, no cada familia.',
      'Comprueba si tus vecinos mayores o dependientes necesitan ayuda.',
      'Ten acordado un punto de encuentro familiar al aire libre y seguro.',
    ],
    question: {
      prompt: '¿Puede una familia usar el polideportivo o un colegio como refugio por su cuenta?',
      options: [
        'Sí, cualquier edificio público vale siempre.',
        'No: solo se usa si lo activan las autoridades.',
        'Sí, pero solo por la noche.',
        'Sí, si se llevan las llaves.',
      ],
      correctIndex: 1,
      explanation:
        'Un punto de acogida necesita organización: personal, seguridad, agua, aseos… Por eso solo se abre cuando lo decide el Ayuntamiento o Protección Civil.',
    },
    letter: 'I',
  },
];

export const ESCAPE_FINAL = {
  code: 'UNIDOS',
  prompt:
    'Hora 60. El candado del plan de emergencia pide una palabra de 6 letras. Ordenad las letras que habéis conseguido: es lo que hace fuerte a un pueblo en una emergencia.',
  success:
    'En un apagón de 72 horas nadie se salva solo. Abarán resiste si los servicios críticos funcionan coordinados y si cada familia está preparada y ayuda a sus vecinos.',
};

export const ESCAPE_DURATIONS = [
  { minutes: 30, label: '30 min', note: 'Rápida' },
  { minutes: 45, label: '45 min', note: 'Recomendada' },
  { minutes: 60, label: '60 min', note: 'Con calma' },
];
