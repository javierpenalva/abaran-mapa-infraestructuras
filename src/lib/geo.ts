// Utilidades geodésicas para la ficha F04 (escala/distancias) y F06 (rutas).
const EARTH_RADIUS_M = 6371000;

const toRad = (deg: number) => (deg * Math.PI) / 180;

/** Distancia en metros entre dos puntos [lat, lng] (haversine). */
export function haversineMeters(a: [number, number], b: [number, number]): number {
  const dLat = toRad(b[0] - a[0]);
  const dLng = toRad(b[1] - a[1]);
  const lat1 = toRad(a[0]);
  const lat2 = toRad(b[0]);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_M * Math.asin(Math.sqrt(h));
}

/** Distancia total (m) de una polilínea de puntos. */
export function pathMeters(points: [number, number][]): number {
  let total = 0;
  for (let i = 1; i < points.length; i++) total += haversineMeters(points[i - 1], points[i]);
  return total;
}

/** Tiempo a pie en minutos para una distancia en metros a una velocidad en km/h. */
export function walkMinutes(meters: number, kmPerHour: number): number {
  if (kmPerHour <= 0) return 0;
  return Math.round(((meters / 1000) / kmPerHour) * 60);
}

/** Formatea metros de forma legible. */
export function formatMeters(meters: number): string {
  if (meters < 1000) return `${Math.round(meters)} m`;
  return `${(meters / 1000).toLocaleString('es-ES', { maximumFractionDigits: 2 })} km`;
}
