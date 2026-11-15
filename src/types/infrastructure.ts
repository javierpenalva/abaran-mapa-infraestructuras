export type CriticalityLevel = 'CRITICAL_1' | 'HIGH_2' | 'MEDIUM_3';

export type InfrastructureStatus = 'OPERATIONAL' | 'MAINTENANCE' | 'ALERT';

export type CategoryId = 
  | 'WATER_HYDRAULIC'
  | 'HEALTH_EMERGENCY'
  | 'PHARMACY_HEALTH'
  | 'FOOD_SUPPLY'
  | 'SECURITY_DEFENSE'
  | 'ENERGY_POWER'
  | 'TRANSPORT_LOGISTICS'
  | 'TELECOM_EARLY_WARNING'
  | 'SHELTER_EDUCATION'
  | 'HAZMAT_INDUSTRY';

export interface InfrastructureItem {
  id: string;
  name: string;
  code: string; // e.g. "INF-ABA-01"
  category: CategoryId;
  subcategory: string;
  coordinates: [number, number]; // [lat, lng]
  elevationMeters: number;
  criticality: CriticalityLevel;
  status: InfrastructureStatus;
  address: string;
  pedania?: string; // Casco Urbano, Hoya del Campo, etc.
  description: string;
  operator: string;
  emergencyPhone: string;
  backupPower: boolean;
  backupPowerDetails?: string;
  impactRadiusMeters: number;
  evacuationCapacity?: number;
  protocols: string[];
  lastInspectionDate: string;
  detailsUnverified?: boolean; // descripción heredada sin fuente
  backupPowerVerified?: boolean; // dato de generador comprobado
  /** Enlace de comprobación pública de la ubicación. */
  mapsUrl?: string;
  /** Cómo debe interpretarse la posición del marcador. */
  locationVerification?: string;
  /** Papel educativo del recurso durante el apagón de 72 horas. */
  blackoutRole?: string;
}

export interface CategoryMeta {
  id: CategoryId;
  name: string;
  shortName: string;
  iconName: string;
  color: string;
  bgColor: string;
  borderColor: string;
  description: string;
}

export interface RiskZone {
  id: string;
  name: string;
  type: 'FLOOD' | 'SEISMIC' | 'WILDFIRE' | 'INDUSTRIAL';
  color: string;
  strokeColor: string;
  coordinates: [number, number][];
  description: string;
  affectedPopulationEst: number;
  criticalPointsCount: number;
  warningLevel: 'YELLOW' | 'ORANGE' | 'RED';
}

export interface EvacuationRoute {
  id: string;
  name: string;
  code: string;
  type: 'PRIMARY' | 'SECONDARY' | 'ALTERNATE';
  coordinates: [number, number][];
  color: string;
  destination: string;
  estimatedCapacityVehPerHour: number;
  description: string;
}

export interface EmergencyScenario {
  id: string;
  title: string;
  badge: string;
  type: 'FLOOD' | 'BLACKOUT' | 'WILDFIRE' | 'WATER_SHORTAGE';
  description: string;
  triggerEvent: string;
  affectedInfrasIds: string[];
  recommendedActions: string[];
  evacuationRouteId?: string;
  riskZoneId?: string;
}
