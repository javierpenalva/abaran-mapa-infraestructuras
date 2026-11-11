# Revisión de datos y aprendizajes

Revisión hecha el 10/11/2026 sobre la versión generada con Google AI Studio.

## 1. Qué pasaba

La app se generó con una IA y **ningún dato citaba fuente**. Al contrastarlo con Google Maps y con el
Plan de Emergencias Municipal (PEMU) de Abarán, una parte importante resultó inventada o mal colocada,
aunque todo parecía verosímil: direcciones, teléfonos, potencias en kVA, capacidades, protocolos.

### Ubicaciones
- **Hoya del Campo** completa estaba ~2 km al noroeste, en pleno campo.
- Bomberos (~3,7 km, en realidad está en Cieza, N-301), vértice de Sierra del Oro (~3,6 km),
  estación de tren (~5 km, es la estación Blanca-Abarán), depósito de Hoya del Campo (>5 km).
- Norias, EDAR, Azud de Ojós y puentes desplazados entre 300 y 900 m.

### Elementos que no existían
- Las 4 farmacias tenían nombres y direcciones inventados. Abarán tiene 5 farmacias y 1 botiquín.
- "Consum/Charter", "Mercado de Abastos" y "Autoservicio Hoya del Campo" no existen.
- "Sifón y acueducto del Trasvase Tajo-Segura" en Abarán: el agua del trasvase baja por el propio río Segura.
- "Estación de gas de Enagás": el gas del pueblo viene de una planta de GNL de Redexis.
- "Almacén de cloro gas" en un depósito: no figura en el PEMU.

### Afirmaciones falsas en las fichas de aprendizaje
| Decía | Realidad |
|---|---|
| Los supermercados tienen reservas de agua para emergencias | Ninguna norma lo exige. La Ley 17/2015 (art. 7 bis) permite **requisar** bienes con indemnización. La UE y Protección Civil recomiendan a **las familias** un kit de 72 h. |
| El Centro de Salud tiene generador 72 h para quirófanos y respiradores | Dato sin fuente; un centro de salud no tiene quirófanos. |
| El Puente de Hierro se cierra con más de 200 m³/s | Umbral inventado. |
| Farmacias con neveras de "baterías especiales" | Sin fuente. |
| Polideportivo: albergue de 450 camas | El PEMU lo cita como **zona segura ante terremotos**; no da capacidad de albergue. |
| SAIH envía datos "por satélite" | Son 162 puntos que actualizan cada 5 minutos; el medio no se especifica. |

## 2. Cómo se comprobó

1. Extraer todos los puntos de `abaranData.ts`.
2. Buscar cada uno en **Google Maps** y medir la distancia entre la posición de la app y la real.
3. Leer el **PEMU de Abarán** (abaran.es/pemu-abaran), que da coordenadas UTM oficiales de farmacias,
   gasolineras, depósitos, EDAR, ETAP, planta de GNL, etc.
4. Convertir UTM → latitud/longitud y comparar las dos fuentes: **coinciden a menos de 30 m**,
   lo que confirma que ambas son fiables.
5. Para afirmaciones legales o técnicas, buscar la norma (BOE) o el organismo responsable (CHS, MITECO).
6. Lo que no aparece en ninguna fuente se marca como **[SIN VERIFICAR]** en el mapa en lugar de borrarlo.

## 3. Aprendizajes (útiles también para el aula)

- **Una IA puede inventar datos con aspecto profesional.** Cuantos más detalles concretos (kVA, litros,
  teléfonos) sin fuente, más sospechoso.
- **Dos fuentes independientes que coinciden** valen más que una sola.
- **"¿Dónde pone eso?"**: toda obligación debe estar en una norma (BOE, BORM) o en un plan aprobado.
- Las coordenadas también se comprueban: un error de 2 km en una pedanía cambia por completo una evacuación.
- El catálogo oficial de infraestructuras críticas (Ley 8/2011) es **secreto**; un mapa público solo
  puede usar información pública (PEMU, Google Maps, organismos).
- Las autoridades pueden requisar bienes en una emergencia, pero **la preparación empieza en casa**:
  agua y comida para 72 horas, linterna, radio a pilas, botiquín y teléfono del 112.

### Ideas de actividad
- Dar al alumnado una ficha y pedir que encuentre la fuente de cada dato o la marque como no verificada.
- Comparar la posición de un elemento en la app con Google Maps y calcular el error con la escala.
- Preparar en grupo la lista del kit familiar de 72 horas para una familia de Abarán.

## 4. Pendiente

- **Rutas de evacuación y zonas de riesgo** (inundable, incendio): no tienen fuente. Las zonas inundables
  oficiales están en el SNCZI del MITECO; las rutas y albergues deberían salir de los capítulos 5–9 y los
  planos del PEMU, que no se pudieron extraer del PDF.
- 7 elementos [SIN VERIFICAR]: subestaciones (2), enlaces A-30 (2; el "Enlace 110" cae en mitad del campo),
  repetidor de Sierra del Oro, estación SAIH y helisuperficie 061.
- Niveles de criticidad: la leyenda los atribuye a la Ley 8/2011, que no define esos niveles.
- Simulador de escenarios: textos y cifras heredados sin comprobar.
- 22 fichas mantienen la descripción original (llevan aviso visible).
- Errata del PEMU: la central "Nicolás" figura con 394 MW (probablemente kW).
