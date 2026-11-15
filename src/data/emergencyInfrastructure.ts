import { CategoryId, CriticalityLevel, InfrastructureItem } from '../types/infrastructure';

/**
 * Infraestructuras de soporte para emergencias (agua, energía, salidas por
 * carretera, helipuerto, telecomunicaciones y centros sanitarios de pedanías).
 *
 * Regla de inclusión: cada punto está respaldado por al menos DOS fuentes
 * independientes que coinciden. Revisión del 15/11/2026:
 *  - PEMU de Abarán (aprobado 30/09/2025): coordenadas UTM ETRS89 h30 convertidas a lat/long.
 *  - OpenStreetMap (consulta Overpass) para depósitos, helipuerto y carreteras.
 *  - Ortofoto (Esri World Imagery) para comprobar que la instalación se ve en el punto.
 *  - Google Maps para centros sanitarios y gasolineras.
 *  - InfoAntenas (Ministerio para la Transformación Digital) para la estación de telefonía.
 * Ver FUENTES_DATOS.md para lo que se descartó y por qué.
 *
 * No se afirma que ninguna instalación tenga generador o autonomía eléctrica.
 */

const PEMU = 'PEMU de Abarán (2025)';
const at = (lat: number, lng: number) => `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

interface Base {
  id: string;
  name: string;
  code: string;
  category: CategoryId;
  subcategory: string;
  coordinates: [number, number];
  criticality: CriticalityLevel;
  address: string;
  pedania: string;
  description: string;
  operator: string;
  emergencyPhone?: string;
  protocols: string[];
  sources: string;
  blackoutRole: string;
  mapsUrl?: string;
}

const make = (b: Base): InfrastructureItem => ({
  id: b.id,
  name: b.name,
  code: b.code,
  category: b.category,
  subcategory: b.subcategory,
  coordinates: b.coordinates,
  elevationMeters: 0, // sin dato contrastado: la ficha no lo muestra
  criticality: b.criticality,
  status: 'OPERATIONAL',
  address: b.address,
  pedania: b.pedania,
  description: b.description,
  operator: b.operator,
  emergencyPhone: b.emergencyPhone ?? '112',
  backupPower: false,
  backupPowerVerified: false,
  impactRadiusMeters: 0,
  protocols: b.protocols,
  lastInspectionDate: '2026-11-15',
  mapsUrl: b.mapsUrl ?? at(b.coordinates[0], b.coordinates[1]),
  locationVerification: b.sources,
  blackoutRole: b.blackoutRole,
});

const WATER_PROTOCOLS = [
  'Ten en casa agua embotellada para 72 horas: el suministro puede bajar de presión o cortarse.',
  'Si el agua sale turbia o con olor extraño después del corte, no la bebas hasta que lo indiquen las autoridades.',
  'No te acerques a las instalaciones: son recintos cerrados y vigilados.',
];

const tank = (
  id: string, code: string, name: string, coordinates: [number, number], capacity: string,
  pedania: string, sources: string,
): InfrastructureItem =>
  make({
    id, code, name, coordinates, pedania,
    category: 'WATER_HYDRAULIC',
    subcategory: `Depósito de agua potable · ${capacity}`,
    criticality: 'HIGH_2',
    address: name.replace('Depósito ', '') + ', Abarán',
    description:
      `Depósito de la red municipal de agua potable (capacidad según el PEMU: ${capacity}). Los depósitos se colocan en alto para que el agua baje por gravedad: ` +
      'durante un apagón guardan una reserva que puede seguir llegando a las casas aunque fallen las bombas, hasta que se vacían.',
    operator: 'Ayuntamiento de Abarán · gestión FCC Aqualia',
    protocols: WATER_PROTOCOLS,
    sources,
    blackoutRole: 'Reserva de agua por gravedad mientras dure el depósito.',
  });

export const EMERGENCY_INFRASTRUCTURE: InfrastructureItem[] = [
  /* ---------------------------- AGUA POTABLE ---------------------------- */
  make({
    id: 'inf-haz-01', code: 'AGUA-01', name: 'ETAP de Abarán (potabilizadora)',
    category: 'WATER_HYDRAULIC', subcategory: 'Estación de tratamiento de agua potable y captación',
    coordinates: [38.20789, -1.40282], criticality: 'CRITICAL_1',
    address: 'Parque Municipal Noria Grande, 30550 Abarán', pedania: 'Casco urbano',
    description:
      'Estación de Tratamiento de Agua Potable (ETAP), gestionada por Aqualia. El PEMU la sitúa junto a una captación de tipo «instalación forzada» (impulsión), a diferencia de otras que funcionan «por gravedad». ' +
      'Las bombas necesitan electricidad: si no tienen respaldo, un apagón largo puede reducir el tratamiento y el bombeo de agua.',
    operator: 'FCC Aqualia S.A. (gestión) · Ayuntamiento de Abarán',
    protocols: WATER_PROTOCOLS,
    sources: `${PEMU}, tablas de ETAP y captaciones + edificio visible en ortofoto (15/11/2026).`,
    blackoutRole: 'Tratamiento y bombeo de agua potable: depende de la electricidad.',
  }),
  tank('inf-agua-02', 'AGUA-02', 'Depósito Cabezo de la Cruz', [38.20807, -1.39977], '1.000 m³', 'Casco urbano',
    `${PEMU} + OpenStreetMap (a 3 m) (15/11/2026).`),
  tank('inf-agua-08', 'AGUA-03', 'Depósito Cabezo del Cuartel (C/ Reyes Católicos)', [38.20934, -1.39351], '1.500 m³', 'Casco urbano',
    `${PEMU} (tabla de captaciones) + OpenStreetMap (a 22 m) + ortofoto. En la tabla de depósitos del PEMU las coordenadas son por error las de la oficina de Aqualia.`),
  tank('inf-agua-12', 'AGUA-04', 'Depósito junto al Polideportivo', [38.21087, -1.39559], '1.000 m³', 'Casco urbano',
    `${PEMU} + depósito cubierto visible en ortofoto (15/11/2026).`),
  tank('inf-agua-03', 'AGUA-05', 'Depósito Cota 300 (MCT)', [38.20221, -1.37499], '2.500 m³', 'Término municipal',
    `${PEMU} + depósito cubierto visible en ortofoto (15/11/2026).`),
  tank('inf-agua-11', 'AGUA-06', 'Depósito San José Artesano', [38.21391, -1.36429], '150 m³', 'San José Artesano',
    `${PEMU} + depósito visible en ortofoto (15/11/2026).`),
  tank('inf-agua-10', 'AGUA-07', 'Depósito Paraje La Asomada', [38.22479, -1.34818], '500 m³', 'La Asomada',
    `${PEMU} + depósito cubierto visible en ortofoto (15/11/2026).`),
  tank('inf-agua-09', 'AGUA-08', 'Depósito Sierra del Oro', [38.19647, -1.40729], '133 m³', 'Sierra del Oro',
    `${PEMU} + pequeña construcción visible en ortofoto junto al punto (15/11/2026).`),

  /* ------------------------------ ENERGÍA ------------------------------- */
  make({
    id: 'inf-ene-03', code: 'ENER-01', name: 'Planta satélite de gas natural (GNL) Redexis',
    category: 'ENERGY_POWER', subcategory: 'Depósito de gas natural licuado · 30 m³',
    coordinates: [38.20391, -1.39103], criticality: 'HIGH_2',
    address: 'Junto a la RM-514, 30550 Abarán', pedania: 'Casco urbano',
    description:
      'Planta que almacena gas natural licuado (30 m³ según el PEMU) y lo distribuye por la red de gas del casco urbano. ' +
      'El PEMU señala que por la RM-514 circulan camiones de mercancías peligrosas hacia esta planta.',
    operator: 'Redexis Gas', emergencyPhone: '900 924 622 (urgencias Redexis, según PEMU) · 112',
    protocols: [
      'Si hueles a gas en casa: no enciendas luces ni aparatos, abre ventanas, sal y llama desde fuera.',
      'Nunca uses cocinas de gas, braseros ni generadores en espacios cerrados sin ventilación.',
      'Mantente alejado de la instalación: es un recinto cerrado.',
    ],
    sources: `${PEMU} + instalación vallada visible en ortofoto (15/11/2026).`,
    blackoutRole: 'Gas para cocinas y calefacción; riesgo si se usa mal en interiores.',
  }),
  make({
    id: 'inf-ene-04', code: 'ENER-02', name: 'Estación de Servicio Montepinar',
    category: 'ENERGY_POWER', subcategory: 'Gasolinera',
    coordinates: [38.20837, -1.39079], criticality: 'MEDIUM_3',
    address: 'Av. de la Estación, 20, 30550 Abarán', pedania: 'Casco urbano',
    description: 'Gasolinera. Los surtidores funcionan con electricidad: sin luz (y sin respaldo) no se puede repostar ni pagar con tarjeta.',
    operator: 'Estación de servicio privada', emergencyPhone: 'No es un teléfono de emergencia',
    protocols: ['Mantén el depósito del coche por encima de la mitad.', 'Nunca guardes gasolina en casa ni en recipientes no homologados.', 'Lleva algo de efectivo.'],
    sources: `${PEMU} + Google Maps (coinciden) (15/11/2026).`,
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Estaci%C3%B3n%20de%20Servicio%20Montepinar%20Abar%C3%A1n',
    blackoutRole: 'Combustible para vehículos; surtidores dependen de la electricidad.',
  }),
  make({
    id: 'inf-ene-05', code: 'ENER-03', name: 'Estación de Servicio BP Las Colonias',
    category: 'ENERGY_POWER', subcategory: 'Gasolinera',
    coordinates: [38.2073, -1.3777], criticality: 'MEDIUM_3',
    address: 'RM-513, km 2, 30550 Abarán', pedania: 'Las Colonias',
    description: 'Gasolinera en la salida hacia la A-30. Sin electricidad (y sin respaldo) los surtidores no funcionan.',
    operator: 'Estación de servicio privada', emergencyPhone: 'No es un teléfono de emergencia',
    protocols: ['Mantén el depósito del coche por encima de la mitad.', 'Nunca guardes gasolina en casa.', 'Lleva algo de efectivo.'],
    sources: `${PEMU} + Google Maps (a 22 m) (15/11/2026).`,
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=BP%20Las%20Colonias%20Abar%C3%A1n',
    blackoutRole: 'Combustible para vehículos; surtidores dependen de la electricidad.',
  }),

  /* ------------------- SALIDAS POR CARRETERA (PEMU 2.3.1) ------------------- */
  ...([
    ['inf-acc-512', 'SALIDA-01', 'Salida RM-512 hacia Cieza', [38.21181, -1.39984], 'Avenida de Cieza', 'Cieza (carretera Abarán–Cieza).', 'Casco urbano'],
    ['inf-acc-513', 'SALIDA-02', 'Salida RM-513 hacia la A-30', [38.20757, -1.38742], 'Avenida de la Estación', 'RM-402 y N-301, que enlazan con la autovía A-30. El PEMU indica que es la vía con más tráfico del municipio.', 'Casco urbano'],
    ['inf-acc-514', 'SALIDA-03', 'Salida RM-514 hacia Blanca', [38.20487, -1.39305], 'Avenida del Río Segura', 'Blanca. Por ella circulan camiones de mercancías peligrosas hacia la planta de GNL.', 'Casco urbano'],
    ['inf-acc-b17', 'SALIDA-04', 'Salida RM-B17 por el Puente Nuevo (Virgen del Oro)', [38.19945, -1.4027], 'Avenida de los Puentes', 'Blanca (carretera de tercer orden, según el PEMU).', 'Virgen del Oro'],
    ['inf-acc-sja', 'SALIDA-05', 'Acceso N-301 / RM-513 (San José Artesano)', [38.21301, -1.36453], 'Cruce N-301 / RM-513', 'Cieza y Murcia por la N-301.', 'San José Artesano'],
    ['inf-acc-344', 'SALIDA-06', 'Acceso N-344 (Hoya del Campo)', [38.24124, -1.33097], 'C/ Juan Carlos I con N-344', 'Jumilla por la N-344.', 'Hoya del Campo'],
  ] as const).map(([id, code, name, coordinates, street, where, pedania]) =>
    make({
      id, code, name, pedania,
      category: 'TRANSPORT_LOGISTICS', subcategory: 'Acceso principal por carretera (PEMU)',
      coordinates: [coordinates[0], coordinates[1]], criticality: 'HIGH_2',
      address: `${street}, Abarán`,
      description:
        `Uno de los accesos principales del municipio según el Plan de Emergencias. Comunica con ${where} ` +
        'Sin electricidad los semáforos se apagan y la iluminación de las calles también: hay que circular con mucha precaución.',
      operator: 'Comunidad Autónoma (Red Regional de Carreteras) / Estado (N-301, N-344)',
      protocols: [
        'No uses el coche si no es necesario: deja las vías libres para los servicios de emergencia.',
        'Una evacuación solo la ordena el Director del Plan (alcalde): sigue sus indicaciones y rutas.',
        'Con los semáforos apagados, cede el paso y circula despacio.',
      ],
      sources: `${PEMU}, tabla «Principales accesos» + OpenStreetMap (la carretera pasa por el punto) (15/11/2026).`,
      blackoutRole: 'Vía de entrada de ayuda y de salida si se ordena una evacuación.',
    }),
  ),

  /* ----------------------------- HELIPUERTO ----------------------------- */
  make({
    id: 'inf-tra-07', code: 'HELI-01', name: 'Helipuerto Casa Forestal de La Aurora',
    category: 'TRANSPORT_LOGISTICS', subcategory: 'Helipuerto del Centro de Defensa Forestal · 2.010 m²',
    coordinates: [38.25057, -1.32505], criticality: 'HIGH_2',
    address: 'Casa Forestal de La Aurora, Sierra de la Pila (El Reguero), Abarán', pedania: 'El Reguero (Sierra de la Pila)',
    description:
      'Único helipuerto que recoge el PEMU en el término municipal. Pertenece a la Comunidad Autónoma (Centro de Defensa Forestal de la Sierra de la Pila). ' +
      'Los helicópteros no dependen de la red eléctrica ni de las carreteras: pueden traer ayuda o evacuar heridos si las vías están cortadas.',
    operator: 'Comunidad Autónoma de la Región de Murcia',
    protocols: [
      'Es una instalación de uso exclusivo de los servicios de emergencia.',
      'No te acerques a una zona de aterrizaje: el viento de las hélices es peligroso.',
      'Para pedir un helicóptero sanitario se llama siempre al 112.',
    ],
    sources: `${PEMU}, apartado 2.3.1.3 + OpenStreetMap (helipuerto a 18 m) (15/11/2026).`,
    blackoutRole: 'Transporte aéreo de emergencia, independiente de la red eléctrica.',
  }),

  /* --------------------------- TELECOMUNICACIONES --------------------------- */
  make({
    id: 'inf-tel-zarzuela', code: 'TELEC-01', name: 'Estación de telefonía móvil Plaza de la Zarzuela',
    category: 'TELECOM_EARLY_WARNING', subcategory: 'Antenas Vodafone y Orange (2G a 5G)',
    coordinates: [38.20558, -1.39678], criticality: 'HIGH_2',
    address: 'Plaza de la Zarzuela, 4, 30550 Abarán', pedania: 'Casco urbano',
    description:
      'Estación de telefonía móvil registrada en InfoAntenas con equipos de Vodafone y Orange, incluidas bandas de 5G (3.600 MHz). ' +
      'Las mediciones oficiales en su entorno están miles de veces por debajo del límite legal. ' +
      'Las antenas necesitan electricidad: si no tienen respaldo, o cuando este se agota, los móviles de la zona se quedan sin cobertura. ' +
      'Según el PEMU hay 15 antenas en el municipio (Movistar 4, Vodafone 6, Orange 3, Másmóvil 2); esta es la que se ha podido localizar con fuente oficial.',
    operator: 'Vodafone España S.A.U. · Orange Espagne S.A.U.',
    emergencyPhone: '112 (funciona con cualquier operador con cobertura)',
    protocols: [
      'Ahorra batería: modo avión cuando no lo necesites y brillo bajo.',
      'Envía SMS en lugar de llamadas: ocupan menos la red.',
      'Ten una radio a pilas: la radio no depende de las antenas de telefonía.',
    ],
    sources: 'InfoAntenas, Ministerio para la Transformación Digital (dirección y equipos) + OpenStreetMap (posición de la plaza). El propio Ministerio indica que la posición es orientativa (15/11/2026).',
    mapsUrl: 'https://geoportal.minetur.gob.es/VCTEL/detalleEstacion.do?emplazamiento=MURR0612A&codEmplazamiento=ORANGE%20ESPAGNE,%20S.A.U.%20-%20MURR0612A',
    blackoutRole: 'Cobertura móvil mientras duren sus baterías de respaldo.',
  }),

  /* ------------------------- SANIDAD Y CUIDADOS ------------------------- */
  make({
    id: 'inf-salud-05', code: 'SALUD-02', name: 'Residencia de mayores Santa Teresa',
    category: 'HEALTH_EMERGENCY', subcategory: 'Residencia y centro de día',
    coordinates: [38.20115, -1.39845], criticality: 'CRITICAL_1',
    address: 'C/ Almazara, 3, 30550 Abarán', pedania: 'Bajo Solana',
    description:
      'Residencia de personas mayores. En un apagón es un lugar prioritario: hay residentes que dependen de ascensores, camas articuladas, oxígeno o medicamentos en frío.',
    operator: 'Residencia de mayores', emergencyPhone: '112',
    protocols: [
      'Las personas mayores y dependientes son prioritarias: comprueba si tus vecinos necesitan ayuda.',
      'No acudas a la residencia salvo que te lo pidan: deja trabajar a su personal.',
      'Ante una urgencia sanitaria, llama al 112.',
    ],
    sources: `${PEMU} + Google Maps (a 24 m) (15/11/2026).`,
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Residencia%20Santa%20Teresa%20Abar%C3%A1n',
    blackoutRole: 'Personas muy vulnerables: prioridad para los servicios de emergencia.',
  }),
  make({
    id: 'inf-salud-02', code: 'SALUD-03', name: 'Consultorio médico de Hoya del Campo',
    category: 'HEALTH_EMERGENCY', subcategory: 'Consultorio de atención primaria',
    coordinates: [38.23655, -1.33619], criticality: 'HIGH_2',
    address: 'Avda. de Murcia, 16, 30559 Hoya del Campo', pedania: 'Hoya del Campo',
    description: 'Consultorio médico de la pedanía. Su horario es limitado: ante una urgencia, llama al 112.',
    operator: 'Servicio Murciano de Salud',
    protocols: ['Ante una urgencia, llama al 112.', 'Ten tu lista de medicación en papel.', 'Confirma el horario antes de desplazarte.'],
    sources: `${PEMU} + Google Maps (a 3 m) (15/11/2026).`,
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Consultorio%20Hoya%20del%20Campo%20Abar%C3%A1n',
    blackoutRole: 'Atención sanitaria de proximidad en la pedanía.',
  }),
  make({
    id: 'inf-salud-04', code: 'SALUD-04', name: 'Consultorio médico de San José Artesano',
    category: 'HEALTH_EMERGENCY', subcategory: 'Consultorio de atención primaria',
    coordinates: [38.21414, -1.36186], criticality: 'HIGH_2',
    address: 'Pl. Juan Sáez Hurtado, 1, 30559 San José Artesano', pedania: 'San José Artesano',
    description: 'Consultorio médico de la pedanía. Su horario es limitado: ante una urgencia, llama al 112.',
    operator: 'Servicio Murciano de Salud',
    protocols: ['Ante una urgencia, llama al 112.', 'Ten tu lista de medicación en papel.', 'Confirma el horario antes de desplazarte.'],
    sources: `${PEMU} + Google Maps (a 4 m) (15/11/2026).`,
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Consultorio%20San%20Jos%C3%A9%20Artesano%20Abar%C3%A1n',
    blackoutRole: 'Atención sanitaria de proximidad en la pedanía.',
  }),
];
