# Abarán · Mapa de Infraestructuras Críticas

Mapa interactivo de las infraestructuras críticas, servicios de emergencia y recursos básicos
de Abarán (Región de Murcia), pensado para trabajar Protección Civil en 1.º de ESO.
Incluye fichas de aprendizaje, misiones con preguntas, simulador de incidencias y un informe exportable.

- **37 elementos** en el mapa del apagón: sanidad, farmacias, alimentación, coordinación, albergues, agua potable (potabilizadora y depósitos), energía, salidas por carretera, helipuerto y telecomunicaciones. Cada punto está contrastado con al menos dos fuentes (ver `FUENTES_DATOS.md`).
- **Mapa base:** OpenStreetMap (y vista satélite de Esri). **Datos de ubicación:** Plan de Emergencias Municipal de Abarán (2025) y Google Maps.
- Revisión de datos realizada el 10/11/2026: ver `REVISION_Y_APRENDIZAJES.md` y `FUENTES_DATOS.md`.

## Escape room «Abarán a oscuras · 72 horas»

Botón morado **Escape room** (abajo a la derecha). Por equipos, 45, 60 o 75 min (lo elige el profesorado al empezar; recomendado 60).

1. El equipo está en el CECOPAL con **72 horas de batería**; el tiempo real se convierte en horas de batería.
2. **9 enigmas** (salud, CECOPAL, Ayuntamiento, agua potable, farmacia, antenas de móvil, alimentación, punto de apoyo y helipuerto). En cada uno:
   adivinanza → localizar el lugar en un mapa con marcadores ocultos (❓) → leer el dossier → responder por qué es crítico.
3. Cada enigma da una letra; con las 9 se abre el **candado final** (solución: `SOLIDARIO`).
4. Penalizaciones: fallar el lugar −2 h (con pista frío/templado/caliente), respuesta incorrecta −3 h,
   pistas −2/−4/−6 h (texto, casilla de la cuadrícula y zona en el mapa), código erróneo −4 h.
5. Al terminar sale un **certificado imprimible** con puntos, estrellas y las infraestructuras localizadas.
   Si se agota la batería, el equipo puede seguir en tiempo extra (sin estrellas extra).

La partida se guarda en el navegador: si se cierra o se recarga, aparece «Continuar la partida guardada».
Los enigmas están en `src/data/escapeRoom.ts` y la lógica en `src/hooks/useEscapeRoom.ts`.

---

## 1. Verla sin instalar nada

Abre **`vista-previa-app.html`** con doble clic. Se abre en el navegador y carga el mapa desde internet.
Es una copia compilada de la app: sirve para enseñarla, pero si cambias el código hay que volver a generarla.

## 2. Ejecutarla en tu ordenador

Requisitos: [Node.js](https://nodejs.org) 20 o superior (versión LTS).

```bash
cd ruta/a/la/carpeta
npm install
npm run dev
```

Abre http://localhost:3000. Para pararla, `Ctrl + C` en la Terminal.
No hace falta clave de Gemini: la dependencia `@google/genai` viene de AI Studio pero la app no la usa.

Otros comandos: `npm run build` (genera la web estática en `dist/`) y `npm run lint` (comprueba tipos).

## 3. Publicarla en GitHub Pages

1. Crea un repositorio **público** vacío en github.com (Pages gratis solo funciona con repos públicos).
2. Sube esta carpeta (sin `node_modules`):
   ```bash
   git init && git add . && git commit -m "Mapa de infraestructuras de Abarán"
   git branch -M main
   git remote add origin https://github.com/TU-USUARIO/TU-REPO.git
   git push -u origin main
   ```
3. En el repositorio: **Settings → Pages → Source: GitHub Actions**.
4. El flujo `.github/workflows/deploy.yml` compila y publica en `https://TU-USUARIO.github.io/TU-REPO/` en un par de minutos.
   Cada `git push` a `main` vuelve a publicar.

## 4. Estructura

```
src/
  data/abaranData.ts        Elementos del mapa, zonas de riesgo, rutas y escenarios
  data/missionsData.ts      Misiones y preguntas del modo juego
  data/escapeRoom.ts        Enigmas, pistas y candado del escape room
  data/emergencyInfrastructure.ts  Agua, energía, salidas, helipuerto y antenas (con sus fuentes)
  hooks/useEscapeRoom.ts    Reloj, penalizaciones y guardado del escape room
  types/infrastructure.ts   Tipos de datos (campos de cada elemento)
  components/               Mapa (Leaflet), fichas, leyenda, simulador, informe
.github/workflows/deploy.yml  Publicación automática en GitHub Pages
FUENTES_DATOS.md            De dónde sale cada dato
REVISION_Y_APRENDIZAJES.md  Qué se corrigió, cómo y qué queda pendiente
vista-previa-app.html       Versión compilada en un solo archivo
```

## 5. Cómo añadir o corregir un elemento

Edita `src/data/abaranData.ts`. Cada elemento lleva, entre otros:

| Campo | Qué poner |
|---|---|
| `coordinates` | `[latitud, longitud]` en grados decimales (WGS84), p. ej. `[38.20667, -1.39833]`. En Google Maps: clic derecho sobre el sitio → copiar coordenadas. |
| `category` | Una de: `WATER_HYDRAULIC`, `HEALTH_EMERGENCY`, `PHARMACY_HEALTH`, `FOOD_SUPPLY`, `SECURITY_DEFENSE`, `ENERGY_POWER`, `TRANSPORT_LOGISTICS`, `TELECOM_EARLY_WARNING`, `SHELTER_EDUCATION`, `HAZMAT_INDUSTRY` |
| `description` | Texto para el alumnado. Indica la fuente si das un dato concreto. |
| `detailsUnverified` | `true` si la descripción no está comprobada: la ficha muestra un aviso. |
| `backupPowerVerified` | `true` solo si el dato del generador está comprobado; si no, la ficha dice "Sin datos comprobados". |

Las coordenadas del PEMU vienen en UTM ETRS89 huso 30 (X, Y). Para pasarlas a latitud/longitud se puede usar
el conversor del IGN o cualquier conversor UTM → geográficas (huso 30 N).

Anota cada dato nuevo en `FUENTES_DATOS.md`.

## 6. Créditos y avisos

- Cartografía © colaboradores de OpenStreetMap (ODbL). Imagen satélite © Esri.
- Datos municipales: Plan de Emergencias Municipal de Abarán, aprobado el 30/09/2025 (abaran.es/pemu-abaran).
- Proyecto generado inicialmente con Google AI Studio y revisado después contra fuentes oficiales.
- **Uso educativo.** No sustituye al Plan de Emergencias oficial ni a las indicaciones del 112.
