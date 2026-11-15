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

## Infraestructuras de soporte para emergencias (revisión 15/11/2026)

Archivo: `src/data/emergencyInfrastructure.ts`. **Regla: solo entra un punto si al menos dos fuentes
independientes coinciden.** El texto del PEMU (128 págs.) ya se puede extraer con `pdftotext -layout`;
las coordenadas UTM ETRS89 (huso 30) se convirtieron a lat/long (control: Farmacia La Plaza, 6 m de diferencia).

| Elemento | Fuente 1 | Fuente 2 (y 3) |
|---|---|---|
| ETAP Abarán (Parque Noria Grande) | PEMU 2.3.2.3 | Edificio visible en ortofoto |
| Depósito Cabezo de la Cruz (1.000 m³) | PEMU | OpenStreetMap (3 m) |
| Depósito Cabezo del Cuartel / C/ Reyes Católicos (1.500 m³) | PEMU, tabla de captaciones | OpenStreetMap (22 m) + ortofoto |
| Depósitos Polideportivo (1.000 m³), Cota 300 (2.500 m³), San José Artesano (150 m³), La Asomada (500 m³) | PEMU | Depósito visible en ortofoto |
| Depósito Sierra del Oro (133 m³) | PEMU | Pequeña construcción visible en ortofoto |
| Planta GNL Redexis (30 m³) | PEMU 2.3.2.2 | Recinto vallado visible en ortofoto |
| Gasolineras Montepinar y BP | PEMU | Google Maps |
| 6 salidas por carretera (RM-512, RM-513 ×2, RM-514, RM-B17, N-344) | PEMU 2.3.1.1, tabla «Principales accesos» | OpenStreetMap (la carretera pasa por el punto) |
| Helipuerto Casa Forestal de La Aurora (2.010 m²) | PEMU 2.3.1.3 | OpenStreetMap (18 m) |
| Estación de telefonía móvil Pl. de la Zarzuela, 4 (Vodafone, Orange) | InfoAntenas, Ministerio para la Transformación Digital: https://geoportal.minetur.gob.es/VCTEL/vcne.do | OpenStreetMap (posición de la plaza). El Ministerio advierte que la posición es orientativa. |
| Residencia Santa Teresa, consultorios de Hoya del Campo y San José Artesano | PEMU 3.3.1.3 | Google Maps (≤ 24 m) |

Comprobación visual: ortofoto Esri World Imagery a zoom 19 sobre cada punto.

### Errores encontrados en el PEMU
- **Depósito C/ Reyes Católicos**: en la tabla de depósitos tiene las mismas coordenadas que la oficina de
  Aqualia (Av. Constitución 19). La tabla de captaciones y OpenStreetMap lo sitúan en el Cabezo del Cuartel
  (38.20934, -1.39351), donde se ve el depósito en la ortofoto. Se usa esta última posición.

### Descartados por no poder contrastarlos
- **Depósito junto a la RM-514 (6.000 m³)**: en el punto del PEMU solo se ve monte en la ortofoto. Puede estar
  enterrado o mal georreferenciado.
- **«Subestación Abarán 132/20 kV» y «Subestación Hoya del Campo 66/20 kV»**: no figuran en el PEMU ni en
  OpenStreetMap. Las subestaciones más cercanas que recoge OSM son las de Cieza y Blanca (fuera del término).
- **Helisuperficie 061 del Polideportivo**: no aparece en el PEMU ni en ninguna fuente pública.
- **Repetidor de Sierra del Oro**: no aparece en el PEMU ni en InfoAntenas. OSM tiene una torre de
  comunicaciones en 38.22634, -1.42724, sin operador ni fuente: no se incluye.
- **Resto de antenas**: el PEMU dice que hay 15 (Movistar 4, Vodafone 6, Orange 3, Másmóvil 2) pero no da
  su ubicación. InfoAntenas solo permite buscar dirección a dirección y no tiene descarga.
- **«Antiguo recinto ferial» (zona segura ante terremotos, PEMU 3.1.2.1.7)**: el PEMU lo sitúa frente al nº 42
  de la Av. de la Constitución, pero el recinto ferial de OSM está en otro sitio. Posición no clara.
- **Central hidroeléctrica «Nicolás»** y **EDAR**: una sola fuente, o diferencia de 78 m entre fuentes; pendiente
  de comprobar en ortofoto.
