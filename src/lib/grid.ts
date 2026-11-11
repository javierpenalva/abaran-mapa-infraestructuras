// Cuadrícula de referencia del centro urbano (ficha F01): columnas A–J, filas 1–6.
// Columna A = oeste, J = este. Fila 1 = norte (arriba), fila 6 = sur (abajo).
// La caja se ajusta al centro urbano de Abarán (mismo plano que la ficha F01).

export interface GridConfig {
  lngMin: number;
  lngMax: number;
  latMin: number;
  latMax: number;
  cols: number;
  rows: number;
}

export const ABARAN_URBAN_GRID: GridConfig = {
  lngMin: -1.4085,
  lngMax: -1.3865,
  latMin: 38.1985,
  latMax: 38.217,
  cols: 10,
  rows: 6,
};

const COL_LETTERS = 'ABCDEFGHIJ';

/** Devuelve la casilla (p. ej. "D4") de una coordenada, o null si está fuera del centro urbano. */
export function toGridRef(
  coord: [number, number],
  grid: GridConfig = ABARAN_URBAN_GRID,
): string | null {
  const [lat, lng] = coord;
  if (lat < grid.latMin || lat > grid.latMax || lng < grid.lngMin || lng > grid.lngMax) {
    return null;
  }
  const col = Math.min(
    grid.cols - 1,
    Math.floor(((lng - grid.lngMin) / (grid.lngMax - grid.lngMin)) * grid.cols),
  );
  const row = Math.min(
    grid.rows - 1,
    Math.floor(((grid.latMax - lat) / (grid.latMax - grid.latMin)) * grid.rows),
  );
  return COL_LETTERS[col] + (row + 1);
}

/** Líneas verticales (columnas) y horizontales (filas) de la retícula para dibujar en el mapa. */
export function gridLines(grid: GridConfig = ABARAN_URBAN_GRID): {
  v: [number, number][][];
  h: [number, number][][];
} {
  const v: [number, number][][] = [];
  const h: [number, number][][] = [];
  for (let c = 0; c <= grid.cols; c++) {
    const lng = grid.lngMin + ((grid.lngMax - grid.lngMin) * c) / grid.cols;
    v.push([
      [grid.latMin, lng],
      [grid.latMax, lng],
    ]);
  }
  for (let r = 0; r <= grid.rows; r++) {
    const lat = grid.latMax - ((grid.latMax - grid.latMin) * r) / grid.rows;
    h.push([
      [lat, grid.lngMin],
      [lat, grid.lngMax],
    ]);
  }
  return { v, h };
}

/** Etiquetas de columnas (arriba) y filas (izquierda). */
export function gridLabels(grid: GridConfig = ABARAN_URBAN_GRID): {
  cols: { text: string; at: [number, number] }[];
  rows: { text: string; at: [number, number] }[];
} {
  const cols: { text: string; at: [number, number] }[] = [];
  for (let i = 0; i < grid.cols; i++) {
    const lng = grid.lngMin + ((grid.lngMax - grid.lngMin) * (i + 0.5)) / grid.cols;
    cols.push({ text: COL_LETTERS[i], at: [grid.latMax, lng] });
  }
  const rows: { text: string; at: [number, number] }[] = [];
  for (let i = 0; i < grid.rows; i++) {
    const lat = grid.latMax - ((grid.latMax - grid.latMin) * (i + 0.5)) / grid.rows;
    rows.push({ text: String(i + 1), at: [lat, grid.lngMin] });
  }
  return { cols, rows };
}
