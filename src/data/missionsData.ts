import { Mission } from '../types/game';

export const EDUCATIONAL_MISSIONS: Mission[] = [
  {
    id: 'm1-noria',
    title: 'El Gigante del Agua',
    subtitle: 'Encuentra la Noria Grande en el Río Segura',
    targetInfraId: 'inf-agua-06',
    xpReward: 50,
    badgeName: 'Maestro del Regadío',
    badgeIcon: '🎡',
    question: {
      prompt: '¿Por qué las norias como la Noria Grande de Abarán fueron tan importantes históricamente?',
      options: [
        'Porque producían electricidad para los teléfonos móviles.',
        'Porque subían el agua del río a las tierras altas para regar frutales sin motores.',
        'Eran atracciones de feria para los días de fiesta.',
        'Servían para frenar a los barcos de mercancías.'
      ],
      correctIndex: 1,
      explanation: '¡Exacto! La Noria Grande mide 11,92 metros y permitía subir el agua a las terrazas de cultivo por pura fuerza de la corriente del río.'
    }
  },
  {
    id: 'm2-satellite',
    title: 'Visión de Astronauta',
    subtitle: 'Cambia el mapa a modo "Satélite" para ver Abarán desde el espacio',
    targetAction: 'satellite_mode',
    xpReward: 30,
    badgeName: 'Explorador Espacial',
    badgeIcon: '🛰️',
  },
  {
    id: 'm3-salud',
    title: 'Primeros Auxilios',
    subtitle: 'Localiza el Centro de Salud de Abarán',
    targetInfraId: 'inf-salud-01',
    xpReward: 50,
    badgeName: 'Héroe Sanitario',
    badgeIcon: '🚑',
    question: {
      prompt: 'Si alguien se pone muy enfermo por la noche y el Centro de Salud está cerrado, ¿a qué número hay que llamar?',
      options: [
        'Al 091.',
        'Al 112.',
        'Al teléfono del colegio.',
        'A ninguno: hay que esperar a que abra.'
      ],
      correctIndex: 1,
      explanation: '¡Muy bien! El 112 es el número de emergencias de toda la Unión Europea. Es gratuito, funciona sin saldo y desde allí envían ambulancia, bomberos o policía según lo que haga falta.'
    }
  },
  {
    id: 'm4-rio-inundacion',
    title: '¡Cuidado con la DANA!',
    subtitle: 'Activa la capa de riesgo de inundación del Río Segura',
    targetAction: 'flood_zone',
    xpReward: 40,
    badgeName: 'Vigilante de Riadas',
    badgeIcon: '🌊',
    question: {
      prompt: '¿Qué sistema de la Confederación Hidrográfica del Segura mide el río cada 5 minutos para avisar de las crecidas?',
      options: [
        'El GPS de los móviles.',
        'El SAIH (Sistema Automático de Información Hidrológica).',
        'Las cámaras de tráfico de la autovía.',
        'Un vecino que mira el río desde el puente.'
      ],
      correctIndex: 1,
      explanation: '¡Correcto! El SAIH tiene 162 puntos de control en la cuenca del Segura que miden lluvia y caudal y actualizan los datos cada 5 minutos.'
    }
  },
  {
    id: 'm5-azud',
    title: 'La Llave del Valle',
    subtitle: 'Viaja al sur hasta la Presa del Azud de Ojós',
    targetInfraId: 'inf-agua-05',
    xpReward: 60,
    badgeName: 'Guardián de la Presa',
    badgeIcon: '🧱',
    question: {
      prompt: '¿Qué gran infraestructura hidráulica nacional pasa por el término de Abarán?',
      options: [
        'El Canal de Panamá.',
        'El agua del Trasvase Tajo-Segura, que baja por el río Segura.',
        'Un río subterráneo de lava volcánica.',
        'El canal de Venecia.'
      ],
      correctIndex: 1,
      explanation: '¡Excelente! El agua del Trasvase Tajo-Segura llega al embalse del Talave y baja por el río Segura, atravesando Abarán, hasta el Azud de Ojós, desde donde se distribuye agua a toda la huerta de Murcia y Alicante.'
    }
  },
  {
    id: 'm6-sierra-oro',
    title: 'En la Cima de la Sierra',
    subtitle: 'Sube a Sierra del Oro, el punto más alto de Abarán (927 m)',
    targetInfraId: 'inf-tel-01',
    xpReward: 70,
    badgeName: 'Centinela de las Alturas',
    badgeIcon: '📡',
  },
  {
    id: 'm7-albergue',
    title: 'Punto de Refugio',
    subtitle: 'Encuentra el Polideportivo, zona segura ante terremotos según el Plan de Emergencias',
    targetInfraId: 'inf-alb-01',
    xpReward: 50,
    badgeName: 'Protector Ciudadano',
    badgeIcon: '🏕️',
  }
];

export const PLAYER_RANKS = [
  { level: 1, minXp: 0, title: 'Cadete de Protección Civil', icon: '🌱' },
  { level: 2, minXp: 80, title: 'Explorador del Valle', icon: '🧭' },
  { level: 3, minXp: 180, title: 'Vigilante del Segura', icon: '🛡️' },
  { level: 4, minXp: 280, title: 'Oficial de Resiliencia', icon: '⭐' },
  { level: 5, minXp: 380, title: 'Gran Guardián de Abarán', icon: '👑' },
];
