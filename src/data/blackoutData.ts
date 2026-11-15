import { InfrastructureItem } from '../types/infrastructure';
import { EMERGENCY_INFRASTRUCTURE } from './emergencyInfrastructure';

const maps = (query: string) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

/**
 * Recursos de acceso público usados en el mapa del apagón.
 * Las direcciones y la posición del marcador se han contrastado en Google Maps
 * el 15/11/2026. La app no afirma que dispongan de grupo electrógeno: esa
 * información debe confirmarla cada organismo responsable.
 */
const CORE_RESOURCES: InfrastructureItem[] = [
  {
    id: 'inf-salud-01', name: 'Centro de Salud de Abarán', code: 'SALUD-01',
    category: 'HEALTH_EMERGENCY', subcategory: 'Atención primaria y urgencias SUAP',
    coordinates: [38.20447, -1.40364], elevationMeters: 178, criticality: 'CRITICAL_1', status: 'OPERATIONAL',
    address: 'Av. de la Constitución, s/n, 30550 Abarán', pedania: 'Casco urbano',
    description: 'Centro sanitario del Servicio Murciano de Salud. En una urgencia real se llama al 112; no se debe acudir solo para pedir información sobre el corte.',
    operator: 'Servicio Murciano de Salud', emergencyPhone: '112', backupPower: false, impactRadiusMeters: 0,
    protocols: ['Reserva el 112 para emergencias sanitarias reales.', 'Ten preparada una lista en papel de medicación, alergias y contactos.', 'No presupongas que el centro mantiene todos sus servicios: sigue los avisos oficiales.'],
    lastInspectionDate: '2026-11-15', backupPowerVerified: false,
    mapsUrl: maps('Centro de Salud Abarán, Avenida de la Constitución, Abarán'),
    locationVerification: 'Dirección y punto contrastados en Google Maps (15/11/2026).',
    blackoutRole: 'Atención sanitaria prioritaria y coordinación de urgencias.',
  },
  {
    id: 'inf-seg-01', name: 'Jefatura de Policía Local de Abarán', code: 'SEG-01',
    category: 'SECURITY_DEFENSE', subcategory: 'Seguridad municipal', coordinates: [38.20004, -1.39823], elevationMeters: 165,
    criticality: 'CRITICAL_1', status: 'OPERATIONAL', address: 'Calle Almazara, s/n, 30550 Abarán', pedania: 'Bajo Solana',
    description: 'Dependencias municipales de Policía Local. En un apagón prolongado, Policía Local y Protección Civil ayudan a difundir instrucciones y priorizar incidencias.',
    operator: 'Ayuntamiento de Abarán', emergencyPhone: '112 / 092', backupPower: false, impactRadiusMeters: 0,
    protocols: ['Llama al 112 ante peligro inmediato; evita llamadas de consulta.', 'Escucha radio a pilas y canales municipales para recibir instrucciones.', 'No bloquees los accesos con vehículos ni acudas si no te lo solicitan.'],
    lastInspectionDate: '2026-11-15', backupPowerVerified: false,
    mapsUrl: maps('Policía Local de Abarán, Calle Almazara, Abarán'), locationVerification: 'Dirección y punto contrastados en Google Maps (15/11/2026).',
    blackoutRole: 'Seguridad, información oficial y coordinación municipal.',
  },
  {
    id: 'inf-seg-04', name: 'Ayuntamiento de Abarán', code: 'MUNIC-01',
    category: 'SECURITY_DEFENSE', subcategory: 'Información y coordinación municipal', coordinates: [38.20278, -1.40031], elevationMeters: 173,
    criticality: 'HIGH_2', status: 'OPERATIONAL', address: 'Plaza Vieja, 1, 30550 Abarán', pedania: 'Casco urbano',
    description: 'Casa Consistorial. El Ayuntamiento es una fuente de avisos municipales; en un apagón debe consultarse su información oficial cuando esté disponible.',
    operator: 'Ayuntamiento de Abarán', emergencyPhone: '968 77 00 40', backupPower: false, impactRadiusMeters: 0,
    protocols: ['Consulta únicamente comunicados oficiales y radio.', 'Ahorra batería: no reenvíes cadenas ni rumores.', 'Acuerda con tu familia un punto de encuentro antes de necesitarlo.'],
    lastInspectionDate: '2026-11-15', backupPowerVerified: false,
    mapsUrl: maps('Ayuntamiento de Abarán, Plaza Vieja 1, Abarán'), locationVerification: 'Dirección y punto contrastados en Google Maps (15/11/2026).',
    blackoutRole: 'Información municipal y coordinación institucional.',
  },
  {
    id: 'inf-seg-cima', name: 'Edificio CIMA', code: 'MUNIC-02', category: 'SECURITY_DEFENSE', subcategory: 'Sede municipal alternativa prevista',
    coordinates: [38.20557, -1.40051], elevationMeters: 181, criticality: 'HIGH_2', status: 'OPERATIONAL',
    address: 'Calle Compositor David Templado, 54, 30550 Abarán', pedania: 'Casco urbano',
    description: 'Edificio municipal citado por la Adenda al PEMU como sede alternativa del CECOPAL si no pudiera usarse la Comisaría de Policía Local. No es un punto de atención espontánea: se utiliza solo bajo activación oficial.',
    operator: 'Ayuntamiento de Abarán', emergencyPhone: '112', backupPower: false, impactRadiusMeters: 0,
    protocols: ['No acudas salvo indicación oficial.', 'Sigue los avisos de Policía Local y Protección Civil.', 'Mantén libre el acceso para los servicios de emergencia.'],
    lastInspectionDate: '2026-11-15', backupPowerVerified: false,
    mapsUrl: maps('Edificio CIMA, Calle Compositor David Templado 54, Abarán'), locationVerification: 'Dirección contrastada con la web municipal y Google Maps (15/11/2026).', blackoutRole: 'Sede alternativa prevista del CECOPAL, activable por autoridades.',
  },
  {
    id: 'inf-seg-02', name: 'Puesto de la Guardia Civil de Abarán', code: 'SEG-02',
    category: 'SECURITY_DEFENSE', subcategory: 'Seguridad ciudadana', coordinates: [38.20695, -1.40081], elevationMeters: 185,
    criticality: 'CRITICAL_1', status: 'OPERATIONAL', address: 'Travesía Av. de la Constitución, 2, 30550 Abarán', pedania: 'Casco urbano',
    description: 'Puesto de la Guardia Civil de Abarán. Su función no cambia por un apagón: para emergencias se usa siempre el 112.',
    operator: 'Guardia Civil', emergencyPhone: '112 / 062', backupPower: false, impactRadiusMeters: 0,
    protocols: ['No acudas para incidencias menores; deja libres las vías de acceso.', 'Ten en casa linterna, pilas y documentación básica accesible.', 'Nunca uses velas sin vigilancia ni generadores en interiores.'],
    lastInspectionDate: '2026-11-15', backupPowerVerified: false,
    mapsUrl: maps('Guardia Civil Abarán, Travesía Avenida de la Constitución 2, Abarán'), locationVerification: 'Dirección y punto contrastados en Google Maps (15/11/2026).',
    blackoutRole: 'Respuesta de seguridad y apoyo a emergencias.',
  },
  {
    id: 'inf-alb-02', name: 'IES Villa de Abarán', code: 'COMUN-01',
    category: 'SHELTER_EDUCATION', subcategory: 'Centro educativo y referencia comunitaria', coordinates: [38.20087, -1.39985], elevationMeters: 166,
    criticality: 'HIGH_2', status: 'OPERATIONAL', address: 'Calle Constantino Gómez Cano, 1, 30550 Abarán', pedania: 'Bajo Solana',
    description: 'Centro educativo público. No es un albergue activado por defecto: solo podría utilizarse como punto de apoyo si las autoridades lo comunican expresamente.',
    operator: 'Consejería de Educación / IES Villa de Abarán', emergencyPhone: '112', backupPower: false, impactRadiusMeters: 0,
    protocols: ['No conviertas un centro educativo en punto de reunión por iniciativa propia.', 'Conoce un punto de encuentro familiar exterior y seguro.', 'Sigue las indicaciones del centro y de Protección Civil.'],
    lastInspectionDate: '2026-11-15', backupPowerVerified: false,
    mapsUrl: maps('IES Villa de Abarán, Constantino Gómez Cano 1, Abarán'), locationVerification: 'Dirección y punto contrastados en Google Maps (15/11/2026).',
    blackoutRole: 'Referencia comunitaria; posible apoyo solo si se activa oficialmente.',
  },
  {
    id: 'inf-alb-01', name: 'Polideportivo Municipal Príncipe de Asturias', code: 'COMUN-02',
    category: 'SHELTER_EDUCATION', subcategory: 'Instalación deportiva municipal', coordinates: [38.21148, -1.39634], elevationMeters: 188,
    criticality: 'HIGH_2', status: 'OPERATIONAL', address: 'Avenida Reina Sofía, s/n, 30550 Abarán', pedania: 'San José Artesano',
    description: 'Instalación deportiva municipal. Puede ser útil como referencia de gran capacidad, pero no debe considerarse refugio ni punto de reparto salvo anuncio oficial.',
    operator: 'Ayuntamiento de Abarán', emergencyPhone: '112', backupPower: false, impactRadiusMeters: 0,
    protocols: ['No te desplaces sin una instrucción oficial.', 'Lleva siempre medicación, agua y abrigo si debes salir de casa.', 'Ayuda a vecinos vulnerables sin ponerte en riesgo.'],
    lastInspectionDate: '2026-11-15', backupPowerVerified: false,
    mapsUrl: maps('Polideportivo Municipal Príncipe de Asturias, Abarán'), locationVerification: 'Dirección y punto contrastados en Google Maps (15/11/2026).',
    blackoutRole: 'Instalación municipal de referencia; activación solo oficial.',
  },
  {
    id: 'inf-sup-01', name: 'Mercadona Abarán', code: 'ABAST-01', category: 'FOOD_SUPPLY', subcategory: 'Alimentación',
    coordinates: [38.20667, -1.39833], elevationMeters: 184, criticality: 'MEDIUM_3', status: 'OPERATIONAL',
    address: 'Av. de la Constitución, 18, 30550 Abarán', pedania: 'Casco urbano',
    description: 'Comercio de alimentación. Su apertura, el pago y la disponibilidad durante un corte dependen del establecimiento; conviene tener reservas en casa y no acaparar.',
    operator: 'Comercio privado', emergencyPhone: 'No es un teléfono de emergencia', backupPower: false, impactRadiusMeters: 0,
    protocols: ['Guarda agua, alimentos no perecederos y abrelatas para 72 horas.', 'Mantén la nevera y el congelador cerrados tanto como sea posible.', 'Compra con calma: no acapares productos.'],
    lastInspectionDate: '2026-11-15', backupPowerVerified: false,
    mapsUrl: maps('Mercadona Abarán, Avenida de la Constitución 18, Abarán'), locationVerification: 'Dirección y punto contrastados en Google Maps (15/11/2026).',
    blackoutRole: 'Abastecimiento cotidiano; disponibilidad no garantizada durante el corte.',
  },
  {
    id: 'inf-far-01', name: 'Farmacia La Plaza', code: 'FARM-01', category: 'PHARMACY_HEALTH', subcategory: 'Farmacia comunitaria',
    coordinates: [38.20318, -1.40048], elevationMeters: 174, criticality: 'HIGH_2', status: 'OPERATIONAL',
    address: 'Plaza Vieja, 4, 30550 Abarán', pedania: 'Casco urbano',
    description: 'Farmacia comunitaria. Consulta los turnos de guardia por los canales oficiales del Colegio de Farmacéuticos; no se presupone disponibilidad de todos los medicamentos durante un apagón.',
    operator: 'Farmacia comunitaria', emergencyPhone: '112 para emergencias sanitarias', backupPower: false, impactRadiusMeters: 0,
    protocols: ['Mantén una reserva razonable de tu medicación habitual.', 'Pregunta a un profesional cómo conservar medicamentos que requieren frío.', 'No interrumpas ni cambies tratamientos sin indicación sanitaria.'],
    lastInspectionDate: '2026-11-15', backupPowerVerified: false,
    mapsUrl: maps('Farmacia La Plaza, Plaza Vieja 4, Abarán'), locationVerification: 'Dirección y punto contrastados en Google Maps (15/11/2026).',
    blackoutRole: 'Acceso a medicamentos y orientación farmacéutica.',
  },
  {
    id: 'inf-far-02', name: 'Farmacia Clara Gómez', code: 'FARM-02', category: 'PHARMACY_HEALTH', subcategory: 'Farmacia comunitaria',
    coordinates: [38.20659, -1.40074], elevationMeters: 182, criticality: 'HIGH_2', status: 'OPERATIONAL',
    address: 'Av. de la Constitución, 42, 30550 Abarán', pedania: 'Casco urbano',
    description: 'Farmacia comunitaria. En caso de apagón, los turnos de guardia y el acceso a medicamentos deben confirmarse mediante los canales oficiales disponibles.',
    operator: 'Farmacia comunitaria', emergencyPhone: '112 para emergencias sanitarias', backupPower: false, impactRadiusMeters: 0,
    protocols: ['Ten la receta y tu lista de medicación también en papel.', 'No abras frigoríficos de medicamentos si no es necesario.', 'Prioriza a las personas que necesitan medicación esencial.'],
    lastInspectionDate: '2026-11-15', backupPowerVerified: false,
    mapsUrl: maps('Farmacia Clara Gómez, Avenida de la Constitución 42, Abarán'), locationVerification: 'Dirección y punto contrastados en Google Maps (15/11/2026).',
    blackoutRole: 'Acceso a medicamentos y orientación farmacéutica.',
  },
  {
    id: 'inf-far-03', name: 'Farmacia Isabel Yelo Yelo', code: 'FARM-03', category: 'PHARMACY_HEALTH', subcategory: 'Farmacia comunitaria',
    coordinates: [38.20554, -1.39699], elevationMeters: 181, criticality: 'HIGH_2', status: 'OPERATIONAL',
    address: 'Plaza de la Zarzuela, 1, 30550 Abarán', pedania: 'Casco urbano',
    description: 'Farmacia comunitaria. La apertura y el turno de guardia deben confirmarse antes de desplazarse, especialmente durante una incidencia de suministro.',
    operator: 'Farmacia comunitaria', emergencyPhone: '112 para emergencias sanitarias', backupPower: false, impactRadiusMeters: 0,
    protocols: ['Guarda una reserva razonable de medicación habitual.', 'Confirma el turno de guardia antes de acudir.', 'No cambies tratamientos sin indicación profesional.'],
    lastInspectionDate: '2026-11-15', backupPowerVerified: false,
    mapsUrl: maps('Farmacia Isabel Yelo Yelo, Plaza de la Zarzuela 1, Abarán'), locationVerification: 'Nombre, dirección y punto contrastados en Google Maps (15/11/2026).', blackoutRole: 'Acceso a medicamentos y orientación farmacéutica.',
  },
  {
    id: 'inf-far-05', name: 'Farmacia Jesús Joaquín Gómez Abellán', code: 'FARM-04', category: 'PHARMACY_HEALTH', subcategory: 'Farmacia comunitaria',
    coordinates: [38.20754, -1.3944], elevationMeters: 188, criticality: 'HIGH_2', status: 'OPERATIONAL',
    address: 'Avenida de Cieza, 40, 30550 Abarán', pedania: 'Casco urbano',
    description: 'Farmacia comunitaria también conocida como Farmacia La Garita. La guardia debe confirmarse por teléfono o canal oficial antes de desplazarse.',
    operator: 'Farmacia comunitaria', emergencyPhone: '112 para emergencias sanitarias', backupPower: false, impactRadiusMeters: 0,
    protocols: ['Conserva recetas y tu pauta de medicación también en papel.', 'Consulta a profesionales sobre medicamentos que necesitan frío.', 'Confirma la disponibilidad antes de salir.'],
    lastInspectionDate: '2026-11-15', backupPowerVerified: false,
    mapsUrl: maps('Farmacia Jesús Joaquín Gómez Abellán, Avenida de Cieza 40, Abarán'), locationVerification: 'Nombre, dirección y punto contrastados en Google Maps (15/11/2026).', blackoutRole: 'Acceso a medicamentos y orientación farmacéutica.',
  },
  {
    id: 'inf-sup-06', name: 'Supermercado DIA Abarán', code: 'ABAST-02', category: 'FOOD_SUPPLY', subcategory: 'Alimentación',
    coordinates: [38.20652, -1.39664], elevationMeters: 187, criticality: 'MEDIUM_3', status: 'OPERATIONAL',
    address: 'Avenida de la Constitución, 3, 30550 Abarán', pedania: 'Casco urbano',
    description: 'Comercio de alimentación. En un apagón, la apertura, cobro y disponibilidad dependen del establecimiento; no debe considerarse un punto de abastecimiento garantizado.',
    operator: 'Comercio privado', emergencyPhone: 'No es un teléfono de emergencia', backupPower: false, impactRadiusMeters: 0,
    protocols: ['Planifica comida y agua en casa para 72 horas.', 'No acapares: compra solo lo necesario.', 'Mantén cerrados nevera y congelador para conservar el frío.'],
    lastInspectionDate: '2026-11-15', backupPowerVerified: false,
    mapsUrl: maps('DIA, Avenida de la Constitución 3, Abarán'), locationVerification: 'Nombre, dirección y punto contrastados en Google Maps (15/11/2026).', blackoutRole: 'Abastecimiento cotidiano; disponibilidad no garantizada durante el corte.',
  },
  {
    id: 'inf-sup-02', name: 'Supermercados Sandi', code: 'ABAST-03', category: 'FOOD_SUPPLY', subcategory: 'Alimentación',
    coordinates: [38.20446, -1.40027], elevationMeters: 177, criticality: 'MEDIUM_3', status: 'OPERATIONAL',
    address: 'Calle San Damián, 1, 30550 Abarán', pedania: 'Casco urbano',
    description: 'Comercio de alimentación incluido en el PEMU municipal. Sus horarios y medios de pago pueden verse afectados durante un corte eléctrico.',
    operator: 'Comercio privado', emergencyPhone: 'No es un teléfono de emergencia', backupPower: false, impactRadiusMeters: 0,
    protocols: ['Lleva una pequeña cantidad de efectivo como parte del kit familiar.', 'No dependas de una compra de última hora.', 'Prioriza alimentos que no necesiten refrigeración ni cocinado.'],
    lastInspectionDate: '2026-11-15', backupPowerVerified: false,
    mapsUrl: maps('Supermercados Sandi, Calle San Damián 1, Abarán'), locationVerification: 'Dirección contrastada con PEMU y Google Maps (15/11/2026).', blackoutRole: 'Abastecimiento cotidiano; disponibilidad no garantizada durante el corte.',
  },
  {
    id: 'inf-sup-03', name: 'Supermercado Valle Verde', code: 'ABAST-04', category: 'FOOD_SUPPLY', subcategory: 'Alimentación',
    coordinates: [38.2012, -1.4029], elevationMeters: 170, criticality: 'MEDIUM_3', status: 'OPERATIONAL',
    address: 'Avenida del Río Segura, 30550 Abarán', pedania: 'Casco urbano',
    description: 'Supermercado de alimentación situado en el borde urbano de Abarán. El PEMU lo incluye entre los supermercados del municipio; como cualquier comercio, su apertura, cobro y disponibilidad durante un apagón no están garantizados.',
    operator: 'Comercio privado', emergencyPhone: 'No es un teléfono de emergencia', backupPower: false, impactRadiusMeters: 0,
    protocols: ['Cuenta con una despensa básica de 72 horas sin depender de una compra de última hora.', 'Si el corte afecta al pago electrónico, no acapares ni presiones al personal.', 'Prioriza agua, alimentos no perecederos y productos necesarios para tu familia.'],
    lastInspectionDate: '2026-11-15', backupPowerVerified: false,
    mapsUrl: maps('Supermercado Valle Verde, Avenida del Río Segura, Abarán'), locationVerification: 'Nombre, dirección y punto contrastados con PEMU y Google Maps (15/11/2026).', blackoutRole: 'Abastecimiento cotidiano; disponibilidad no garantizada durante el corte.',
  },
];

/** Recursos del mapa: servicios a la población + infraestructuras de soporte para emergencias. */
export const BLACKOUT_RESOURCES: InfrastructureItem[] = [...CORE_RESOURCES, ...EMERGENCY_INFRASTRUCTURE];

export const BLACKOUT_GUIDE = [
  { title: 'Kit eléctrico y de 72 h', icon: '🎒', text: 'Prepara agua, comida que no necesite cocinar, abrelatas, linterna, radio a pilas, pilas o batería externa, medicación y una lista de teléfonos en papel.' },
  { title: 'Cuando se va la luz', icon: '🔦', text: 'Usa linternas antes que velas. Mantén nevera y congelador cerrados. Si es seguro hacerlo, desenchufa aparatos sensibles para evitar daños al volver la tensión.' },
  { title: 'Si el corte es solo en casa', icon: '⚡', text: 'Comprueba primero si afecta también al edificio o a la calle. Si el cuadro eléctrico no se mantiene conectado o hay señales de avería, no lo fuerces: contacta con un electricista o la distribuidora.' },
  { title: 'Seguridad eléctrica', icon: '🚫', text: 'No toques cables caídos ni instalaciones dañadas. Nunca manipules electricidad con manos mojadas o en zonas húmedas. No uses ascensores ni des el alta a aparatos averiados.' },
  { title: 'Personas vulnerables', icon: '🤝', text: 'Comprueba si vecinos mayores o personas que dependen de equipos eléctricos necesitan ayuda. Para una emergencia médica o peligro inmediato, llama al 112.' },
  { title: 'Información', icon: '📻', text: 'Escucha radio a pilas y los comunicados oficiales. Evita rumores y no satures el 112 con consultas no urgentes.' },
];

/** Medidas recogidas en la Adenda al PEMU aprobada por el Ayuntamiento. */
export const MUNICIPAL_BLACKOUT_MEASURES = [
  { title: 'Respaldo energético', icon: '🔋', text: 'La adenda prevé grupos electrógenos portátiles en Ayuntamiento, Policía Local y Protección Civil, además de SAI/UPS para equipos críticos. Es una medida planificada, no un indicador de disponibilidad en tiempo real.' },
  { title: 'Comunicaciones alternativas', icon: '📡', text: 'El plan contempla radiocomunicaciones TETRA o análogas y priorizarlas si cae la telefonía habitual.' },
  { title: 'CECOPAL presencial', icon: '👮', text: 'La Comisaría de Policía Local es la sede primaria prevista del CECOPAL; el Edificio CIMA se establece como alternativa si no puede utilizarse la primera.' },
  { title: 'Avisos y simulacros', icon: '📣', text: 'Si fallan teléfono e internet, la adenda prevé activación presencial y avisos físicos mediante Policía Local o Protección Civil, junto con un simulacro anual.' },
];

export const BLACKOUT_SOURCES = {
  municipal: 'https://abaran.es/wp-content/uploads/2025/10/20250922_Resolucion_Resolucion_Propuesta-Adenda-y-Cronograma.pdf',
  preparedness: 'https://ficheros.proteccioncivil.es/unidadesFormativas/01_Manal_Plan_Familia_Preparada.pdf',
  electricalSafety: 'https://www.proteccioncivil.es/es/buscador?_com_liferay_portal_search_web_search_results_portlet_SearchResultsPortlet_INSTANCE_bG26ZQfiBk0e_assetEntryId=861188&_com_liferay_portal_search_web_search_results_portlet_SearchResultsPortlet_INSTANCE_bG26ZQfiBk0e_mvcPath=%2Fview_content.jsp&_com_liferay_portal_search_web_search_results_portlet_SearchResultsPortlet_INSTANCE_bG26ZQfiBk0e_redirect=%2Fes%2Fbuscador%3Fdelta%3D20%26start%3D60%26tag%3Dde%2Bbaja%26tag%3Driesgo%2Bnuclear&_com_liferay_portal_search_web_search_results_portlet_SearchResultsPortlet_INSTANCE_bG26ZQfiBk0e_type=content&p_l_back_url=%2Fes%2Fbuscador',
};
