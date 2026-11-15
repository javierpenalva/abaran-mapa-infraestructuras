import { CategoryId } from '../types/infrastructure';

/**
 * Guion del juego "OPERACIÓN FÉNIX — Abarán sin luz · 72 horas".
 * Alineado con el cuaderno del IES Villa de Abarán (fichas F02 y F03):
 * las categorías de descubrimiento son las que el alumnado debe localizar.
 */

export interface FenixTask {
  id: string;
  icon: string;
  title: string;
  /** Qué buscar (etiqueta legible, como en la ficha F02). */
  whatToFind: string;
  targetCategories: CategoryId[];
  hint: string;
  fact: string;
  xp: number;
  badge: string;
  badgeIcon: string;
}

export const FENIX_INTRO = {
  title: 'OPERACIÓN FÉNIX',
  subtitle: 'Abarán sin luz · 72 horas',
  scenario:
    'Martes, 11:20. Se corta la electricidad en toda la Región de Murcia y la reparación puede tardar hasta tres días. No hay cobertura de móvil ni internet. ' +
    'Tu misión como cadete de Protección Civil: localizar los puntos críticos para ayudar a los vecinos. ¡Puedes moverte libremente por el mapa, pero primero completa los 5 puntos!',
  filterPrompt:
    'Paso 1: Activa el FILTRO DE EMERGENCIA para ver los puntos críticos del apagón.',
};

export const FENIX_TASKS: FenixTask[] = [
  {
    id: 'task-medica',
    icon: '🏥',
    title: 'Atención médica',
    whatToFind: 'Centro de salud, farmacias o residencia',
    targetCategories: ['HEALTH_EMERGENCY', 'PHARMACY_HEALTH'],
    hint: 'Si alguien se hace daño, ¿dónde te van a atender? Busca el Centro de Salud o una farmacia.',
    fact: 'No des por hecho que un centro mantiene todos sus servicios: ante una emergencia sanitaria, llama al 112.',
    xp: 60,
    badge: 'Sanitario de Emergencia',
    badgeIcon: '🩺',
  },
  {
    id: 'task-autoridades',
    icon: '🚔',
    title: 'Autoridades y seguridad',
    whatToFind: 'Ayuntamiento, Policía Local, Guardia Civil o Protección Civil',
    targetCategories: ['SECURITY_DEFENSE'],
    hint: 'Los que organizan la emergencia. Busca el Ayuntamiento o la Jefatura de Policía Local / Protección Civil (CECOPAL).',
    fact: 'El Ayuntamiento, Policía Local y Protección Civil difunden las instrucciones oficiales cuando están disponibles.',
    xp: 60,
    badge: 'Puesto de Mando',
    badgeIcon: '🛡️',
  },
  {
    id: 'task-alimentacion',
    icon: '🛒',
    title: 'Alimentación',
    whatToFind: 'Supermercado, tienda o mercado',
    targetCategories: ['FOOD_SUPPLY'],
    hint: 'Sin refrigeración, los alimentos frescos aguantan menos días. Busca un supermercado o tienda para saber dónde comprar.',
    fact: 'En un apagón no se obliga a las tiendas a guardar reservas, pero la UE recomienda a cada familia un kit de 72 horas.',
    xp: 50,
    badge: 'Abastecimiento',
    badgeIcon: '🧺',
  },
  {
    id: 'task-reunion',
    icon: '🏕️',
    title: 'Punto de reunión / lugar seguro',
    whatToFind: 'Polideportivo, colegio o albergue',
    targetCategories: ['SHELTER_EDUCATION'],
    hint: '¿Dónde se encuentra tu familia si no hay teléfono? Busca un lugar amplio y seguro (polideportivo, colegio).',
    fact: 'Un lugar seguro debe ser amplio, lejos del río, accesible sin escaleras y conocido por la mayoría de vecinos.',
    xp: 70,
    badge: 'Refugio Seguro',
    badgeIcon: '🏠',
  },
];

export const FENIX_TOTAL_XP = FENIX_TASKS.reduce((sum, t) => sum + t.xp, 0);

/** Categorías implicadas en la Operación Fénix (para el "filtro de emergencia"). */
export const FENIX_EMERGENCY_CATEGORIES: CategoryId[] = Array.from(
  new Set(FENIX_TASKS.flatMap((t) => t.targetCategories)),
);
