# Fuentes de los datos del mapa (revisión 10/11/2026)

## Fuentes usadas
- **PEMU Abarán** – Plan de Emergencias Municipal, aprobado por el Pleno el 30/09/2025.
  https://abaran.es/pemu-abaran/ · PDF: https://abaran.es/wp-content/uploads/2025/10/PEMU-ABARAN_DEF.pdf
  Coordenadas en UTM ETRS89 huso 30, convertidas a lat/long.
- **Google Maps (Google Places)** – establecimientos y edificios públicos.
- **Inventario de presas (MITECO / iagua)** – Azud de Ojós: https://www.iagua.es/data/infraestructuras/presas/ojos-azud
- **CHS – esquema del postrasvase** – https://chsegura.es/en/cuenca/infraestructuras/trasvase-tajo-segura-y-postrasvase/infraestructura/postrasvase/esquema-general

Contraste: las coordenadas del PEMU y las de Google Maps coinciden a menos de 30 m
en farmacias, gasolineras, EDAR y Frutas Esther.

## Por elemento
| Fuente | Elementos |
|---|---|
| PEMU + Google Maps | Farmacias (6), gasolineras Montepinar y BP, EDAR, Frutas Esther, Policía Local (teléfono 24 h) |
| PEMU | Depósitos de agua (8: inf-agua-02, -03, -04, -08…-12), ETAP (inf-haz-01), planta GNL Redexis (inf-ene-03), distribuidora Repsol (inf-haz-02), central hidroeléctrica (inf-ene-07), helipuerto La Aurora (inf-tra-07) |
| Google Maps | Centro de Salud, consultorios, Guardia Civil, Bomberos (Cieza), IES y colegios, polideportivo, estación de autobuses, puentes, norias, supermercados, residencia, Cruz Roja, gasolinera Globaltank, estación de tren Blanca-Abarán, vértice Sierra del Oro |
| Inventario de presas | Azud de Ojós (categoría A, titular Estado/CHS) |
| **SIN VERIFICAR** (marcados en el mapa) | Subestaciones 132/20 kV y 66/20 kV, enlaces A-30 "107" y "110", repetidor Sierra del Oro, estación SAIH, helisuperficie 061 del polideportivo |

## Datos eliminados por falsos o sin respaldo
- "Sifón y acueducto del Trasvase Tajo-Segura" en Abarán: el trasvase llega al Talave y baja por el río Segura; no hay canal en el término.
- "ERM de Enagás / gasoducto": el gas del municipio es una planta satélite de GNL de Redexis.
- "Almacén de cloro gas en el depósito Cabezo de la Cruz": no figura en el PEMU.
- Farmacias y supermercados inventados (sustituidos por los reales).

## Pendiente
- Las secciones del PEMU sobre CECOPAL, albergues, evacuación, catálogo de medios y planos
  no se pudieron extraer del PDF: hay que revisarlas a mano (zonas inundables, rutas, capacidad de albergues).
- Errata del PEMU: la central "Nicolás" figura con 394 MW (probablemente kW).
- E.S. Cepsa N-344: las coordenadas del PEMU caen fuera del municipio.

## Fichas de aprendizaje y misiones (revisión 10/11/2026)
- Supermercados: ninguna norma obliga a guardar reservas de agua. Ley 17/2015, art. 7 bis: requisa temporal de bienes con indemnización
  (https://www.boe.es/buscar/act.php?id=BOE-A-2015-7730). Kit familiar de 72 h: Estrategia de Preparación de la UE (26/03/2025).
- Noria Grande: 11,92 m de diámetro, funciona desde 1808 (escapadarural.com, Ruta de las Norias). Abarán tiene 4 de las 7 norias en funcionamiento de la Región (Wikipedia/Hispanopedia).
- Sierra del Oro: 927 m (Hispanopedia, ficha de Abarán).
- Puente Viejo de hierro: proyectado tras la riada de 1888, vigas de La Primitiva (Hispanopedia, Puente Viejo).
- SAIH Segura: 162 puntos de control, datos cada 5 min (iagua.es, "Nuevo iVisor SAIH").
- Eliminado por inventado: generador de 72 h del Centro de Salud, umbral de 200 m³/s para cerrar el puente,
  neveras con "baterías especiales" en farmacias, "450 camas" en el polideportivo, stock estratégico en Mercadona,
  10.000 m³ de cámaras en Frutas Esther.
- La ficha de cada elemento muestra ahora "Sin datos comprobados" en electricidad de reserva y marca los protocolos como orientativos.
