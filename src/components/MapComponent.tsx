import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { 
  InfrastructureItem, RiskZone, EvacuationRoute, EmergencyScenario 
} from '../types/infrastructure';
import { CATEGORIES_META } from '../data/abaranData';
import { MapPin, Sparkles } from 'lucide-react';
import { ABARAN_URBAN_GRID, gridLines, gridLabels } from '../lib/grid';

interface MapComponentProps {
  infrastructures: InfrastructureItem[];
  selectedInfrastructure: InfrastructureItem | null;
  onSelectInfrastructure: (item: InfrastructureItem | null) => void;
  riskZones: RiskZone[];
  evacuationRoutes: EvacuationRoute[];
  showRiskZones: boolean;
  showEvacuationRoutes: boolean;
  showSafetyRadius: boolean;
  showGrid?: boolean;
  gridConfig?: typeof ABARAN_URBAN_GRID;
  activeBaseMap: 'osm' | 'satellite';
  onChangeBaseMap: (basemap: 'osm' | 'satellite') => void;
  activeScenario: EmergencyScenario | null;
  cursorCoordinates: { lat: number; lng: number } | null;
  onUpdateCoordinates: (coords: { lat: number; lng: number } | null) => void;
  onMapClick?: (coords: { lat: number; lng: number }) => void;
  /** Modo escape room: marcadores ocultos salvo los ya encontrados. */
  escape?: {
    foundIds: string[];
    checkedIds: string[];
    zone: { center: [number, number]; radius: number } | null;
    revealAll: boolean;
  } | null;
}

export const MapComponent: React.FC<MapComponentProps> = ({
  infrastructures,
  selectedInfrastructure,
  onSelectInfrastructure,
  riskZones,
  evacuationRoutes,
  showRiskZones,
  showEvacuationRoutes,
  showSafetyRadius,
  activeBaseMap,
  onChangeBaseMap,
  activeScenario,
  cursorCoordinates,
  onUpdateCoordinates,
  showGrid,
  gridConfig,
  onMapClick,
  escape,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const riskZonesLayerRef = useRef<L.LayerGroup | null>(null);
  const routesLayerRef = useRef<L.LayerGroup | null>(null);
  const circlesLayerRef = useRef<L.LayerGroup | null>(null);
  const gridLayerRef = useRef<L.LayerGroup | null>(null);
  const [gridVisible, setGridVisible] = useState<boolean>(showGrid ?? false);
  // Helper to get tile configuration for given basemap (ONLY OSM and Satellite)
  const getTileConfig = (basemapId: 'osm' | 'satellite') => {
    if (basemapId === 'satellite') {
      return {
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        options: {
          maxZoom: 19,
          attribution: 'Foto Satélite &copy; Esri &mdash; IGN España (PNOA)',
        },
      };
    }
    // Default: OpenStreetMap (European free CDN with open CORS and zero IP blocking)
    return {
      url: 'https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png',
      options: {
        subdomains: ['a', 'b', 'c'],
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> colaboradores (Libre)',
      },
    };
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Center coordinates of Abarán Casco Urbano (Murcia, España)
    const abaranCenter: L.LatLngExpression = [38.2045, -1.4010];

    const map = L.map(mapContainerRef.current, {
      center: abaranCenter,
      zoom: 14,
      minZoom: 11,
      maxZoom: 19,
      zoomControl: false,
    });

    // Zoom control in bottom-right (more videogame friendly, leaving top for badges and view shortcuts)
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Scale in bottom-left
    L.control.scale({ imperial: false, position: 'bottomleft' }).addTo(map);

    // Initial base tile layer (OSM by default)
    const initialConfig = getTileConfig(activeBaseMap);
    const initialTile = L.tileLayer(initialConfig.url, initialConfig.options).addTo(map);
    tileLayerRef.current = initialTile;

    // Layer groups for overlays
    const riskGroup = L.layerGroup().addTo(map);
    const routesGroup = L.layerGroup().addTo(map);
    const circlesGroup = L.layerGroup().addTo(map);
    const markersGroup = L.layerGroup().addTo(map);
    const gridGroup = L.layerGroup().addTo(map);

    riskZonesLayerRef.current = riskGroup;
    routesLayerRef.current = routesGroup;
    circlesLayerRef.current = circlesGroup;
    markersLayerRef.current = markersGroup;
    gridLayerRef.current = gridGroup;
    mapInstanceRef.current = map;

    // Invalidate size on mount
    map.invalidateSize();
    const t1 = setTimeout(() => map.invalidateSize(), 50);
    const t2 = setTimeout(() => map.invalidateSize(), 200);
    const t3 = setTimeout(() => map.invalidateSize(), 600);

    // ResizeObserver to automatically resize Leaflet when container changes
    let observer: ResizeObserver | null = null;
    if (mapContainerRef.current && typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(() => {
        map.invalidateSize();
      });
      observer.observe(mapContainerRef.current);
    }

    // Coordinates tracking
    map.on('mousemove', (e: L.LeafletMouseEvent) => {
      onUpdateCoordinates({ lat: Number(e.latlng.lat.toFixed(5)), lng: Number(e.latlng.lng.toFixed(5)) });
    });

    map.on('mouseout', () => {
      onUpdateCoordinates(null);
    });

    map.on('click', (e: L.LeafletMouseEvent) => {
      onMapClick?.({ lat: Number(e.latlng.lat.toFixed(5)), lng: Number(e.latlng.lng.toFixed(5)) });
    });

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      if (observer) observer.disconnect();
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Base Tile Layer dynamically (between OSM and Satellite)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    const { url, options } = getTileConfig(activeBaseMap);
    const newTileLayer = L.tileLayer(url, options).addTo(map);
    tileLayerRef.current = newTileLayer;

    map.invalidateSize();
  }, [activeBaseMap]);

  // Render Risk Zones (Floods & Wildfire)
  useEffect(() => {
    const group = riskZonesLayerRef.current;
    if (!group) return;
    group.clearLayers();

    if (!showRiskZones) return;

    riskZones.forEach((zone) => {
      const polygon = L.polygon(zone.coordinates, {
        color: zone.strokeColor,
        weight: 3,
        fillColor: zone.color,
        fillOpacity: 0.45,
        dashArray: zone.type === 'FLOOD' ? '6, 6' : undefined,
      });

      polygon.bindTooltip(
        `<div class="p-2 font-sans text-xs">
          <div class="font-extrabold text-blue-900 flex items-center gap-1">🌊 ${zone.name}</div>
          <div class="text-[11px] text-slate-700 mt-1">${zone.description}</div>
          <div class="mt-1 text-[10px] font-bold text-blue-800 bg-blue-100 px-2 py-0.5 rounded">
            ⚠️ Zona inundable en crecida del Segura (~${zone.affectedPopulationEst} vecinos)
          </div>
        </div>`,
        { sticky: true }
      );

      group.addLayer(polygon);
    });
  }, [riskZones, showRiskZones]);

  // Render Evacuation Routes
  useEffect(() => {
    const group = routesLayerRef.current;
    if (!group) return;
    group.clearLayers();

    if (!showEvacuationRoutes) return;

    evacuationRoutes.forEach((route) => {
      // Highway outer casing
      const casing = L.polyline(route.coordinates, {
        color: '#020617',
        weight: 8,
        opacity: 0.9,
      });

      // Colored asphalt road line
      const mainLine = L.polyline(route.coordinates, {
        color: route.color,
        weight: 5,
        opacity: 0.95,
      });

      // Dashed white centerline for realistic road look
      const centerDashes = L.polyline(route.coordinates, {
        color: '#ffffff',
        weight: 1.5,
        opacity: 0.9,
        dashArray: '8, 8',
      });

      // Start & destination waypoint markers
      if (route.coordinates.length > 0) {
        const startPoint = route.coordinates[0];
        const endPoint = route.coordinates[route.coordinates.length - 1];

        const startPin = L.circleMarker(startPoint, {
          radius: 6,
          fillColor: route.color,
          color: '#ffffff',
          weight: 2,
          fillOpacity: 1,
        }).bindTooltip(`<span class="font-bold text-xs">🚗 INICIO EVACUACIÓN: ${route.name.split(':')[0]}</span>`, { direction: 'top' });

        const endPin = L.circleMarker(endPoint, {
          radius: 7,
          fillColor: '#16a34a',
          color: '#ffffff',
          weight: 2,
          fillOpacity: 1,
        }).bindTooltip(`<span class="font-bold text-xs">🏁 ENTRADA SEGURA: ${route.destination}</span>`, { direction: 'top' });

        group.addLayer(startPin);
        group.addLayer(endPin);
      }

      mainLine.bindTooltip(
        `<div class="p-2 font-sans text-xs min-w-[220px]">
          <div class="font-black text-slate-900 flex items-center gap-1.5">🚗 ${route.name}</div>
          <div class="text-[11px] text-slate-700 mt-1">Salida hacia: <strong class="text-emerald-700">${route.destination}</strong></div>
          <div class="text-[10px] text-slate-500 mt-1 leading-tight">${route.description}</div>
          <div class="mt-1.5 text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
            Capacidad: ${route.estimatedCapacityVehPerHour} vehículos/hora
          </div>
        </div>`,
        { sticky: true }
      );

      group.addLayer(casing);
      group.addLayer(mainLine);
      group.addLayer(centerDashes);
    });
  }, [evacuationRoutes, showEvacuationRoutes]);

  // Render Safety Radios
  useEffect(() => {
    const group = circlesLayerRef.current;
    if (!group) return;
    group.clearLayers();

    if (escape?.zone) {
      const zone = L.circle(escape.zone.center, {
        radius: escape.zone.radius,
        color: '#8b5cf6',
        weight: 3,
        fillColor: '#a78bfa',
        fillOpacity: 0.18,
        dashArray: '8, 6',
      });
      zone.bindTooltip('<b>Zona de búsqueda</b>: el lugar está aquí dentro', { sticky: true });
      group.addLayer(zone);
    }

    if (!showSafetyRadius || escape) return;

    infrastructures.forEach((item) => {
      const meta = CATEGORIES_META[item.category];
      const isSelected = selectedInfrastructure?.id === item.id;
      const isAffected = activeScenario?.affectedInfrasIds.includes(item.id);

      const circle = L.circle(item.coordinates, {
        radius: item.impactRadiusMeters,
        color: isAffected ? '#ef4444' : (isSelected ? '#3b82f6' : meta.color),
        weight: isSelected || isAffected ? 2 : 1,
        fillColor: isAffected ? '#fee2e2' : meta.bgColor,
        fillOpacity: isSelected || isAffected ? 0.25 : 0.12,
        dashArray: '5, 5',
      });

      circle.bindTooltip(
        `<span class="text-xs font-bold">Radio de seguridad ${item.name}: ${item.impactRadiusMeters} metros</span>`,
        { sticky: true }
      );

      group.addLayer(circle);
    });
  }, [infrastructures, showSafetyRadius, selectedInfrastructure, activeScenario, escape]);

  // Render Infrastructure Markers with Gaming Pins
  useEffect(() => {
    const group = markersLayerRef.current;
    if (!group) return;
    group.clearLayers();

    infrastructures.forEach((item) => {
      const meta = CATEGORIES_META[item.category];
      const isSelected = selectedInfrastructure?.id === item.id;
      const isAffectedByScenario = activeScenario?.affectedInfrasIds.includes(item.id);

      // Icon emoji based on category for 1º ESO students
      let emoji = '📍';
      if (item.category === 'WATER_HYDRAULIC') emoji = '💧';
      if (item.category === 'HEALTH_EMERGENCY') emoji = '🚑';
      if (item.category === 'PHARMACY_HEALTH') emoji = '💊';
      if (item.category === 'FOOD_SUPPLY') emoji = '🛒';
      if (item.category === 'SECURITY_DEFENSE') emoji = '👮';
      if (item.category === 'ENERGY_POWER') emoji = '⚡';
      if (item.category === 'TRANSPORT_LOGISTICS') emoji = '🚗';
      if (item.category === 'TELECOM_EARLY_WARNING') emoji = '📡';
      if (item.category === 'SHELTER_EDUCATION') emoji = '🏫';
      if (item.category === 'HAZMAT_INDUSTRY') emoji = '⚠️';

      // Specific icons for key Abarán landmarks
      if (item.id === 'inf-agua-06') emoji = '🎡'; // Noria Grande
      if (item.id === 'inf-agua-05') emoji = '🧱'; // Presa Azud
      if (item.id === 'inf-tra-01') emoji = '🌉'; // Puente Hierro
      if (item.id === 'inf-tra-06') emoji = '🚌'; // Estación de Autobuses
      if (item.id === 'inf-alb-02') emoji = '🏫'; // IES Villa de Abarán
      if (item.id === 'inf-seg-01') emoji = '👮'; // Policía Local
      if (item.id === 'inf-tra-07') emoji = '🚁'; // Helipuerto La Aurora
      if (item.id.startsWith('inf-acc-')) emoji = '🛣️'; // Salidas por carretera (PEMU)
      if (item.id === 'inf-haz-01') emoji = '🚰'; // ETAP

      let critNumber = '3';
      let critBg = 'bg-blue-600';
      if (item.criticality === 'CRITICAL_1') {
        critNumber = '1';
        critBg = 'bg-red-600';
      } else if (item.criticality === 'HIGH_2') {
        critNumber = '2';
        critBg = 'bg-amber-500';
      }

      const iconHtml = `
        <div class="relative group cursor-pointer transition-transform duration-200 ${
          isSelected ? 'scale-125 z-50 animate-bounce' : 'hover:scale-125 hover:rotate-6'
        }">
          ${isAffectedByScenario ? `
            <div class="absolute -inset-2.5 rounded-full bg-red-500/50 animate-ping"></div>
          ` : ''}
          
          <!-- Outer Pin Body Gaming Style -->
          <div 
            class="w-10 h-10 rounded-2xl flex items-center justify-center shadow-xl transition-all border-2 ${
              isSelected 
                ? 'ring-4 ring-amber-400 shadow-2xl border-white scale-110' 
                : isAffectedByScenario 
                  ? 'border-red-400 ring-4 ring-red-500 shadow-red-500/50 animate-pulse' 
                  : 'border-white/90 shadow-md hover:ring-2 hover:ring-white'
            }"
            style="background-color: ${isAffectedByScenario ? '#dc2626' : meta.color};"
          >
            <span class="text-lg leading-none">${emoji}</span>
          </div>

          <!-- Criticality Badge Top Right -->
          <div class="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full ${critBg} text-white flex items-center justify-center text-[9px] font-black shadow-md border border-white">
            ${critNumber}
          </div>
        </div>
      `;

      if (escape && !escape.revealAll) {
        const found = escape.foundIds.includes(item.id);
        const checked = escape.checkedIds.includes(item.id);
        if (!found) {
          const mysteryHtml = checked
            ? `<div class="w-9 h-9 rounded-2xl flex items-center justify-center border-2 border-white bg-slate-400/90 shadow-md grayscale opacity-80 cursor-pointer"><span class="text-base leading-none">${emoji}</span></div>`
            : `<div class="w-10 h-10 rounded-2xl flex items-center justify-center border-2 border-white bg-gradient-to-br from-violet-600 to-fuchsia-500 shadow-xl animate-mystery cursor-pointer hover:scale-125 transition-transform"><span class="text-lg leading-none font-black text-white">?</span></div>`;
          const mysteryMarker = L.marker(item.coordinates, {
            icon: L.divIcon({ className: 'custom-infrastructure-marker', html: mysteryHtml, iconSize: [40, 40], iconAnchor: [20, 20] }),
            // Los ❓ pendientes siempre por encima de los ya encontrados o descartados.
            zIndexOffset: checked ? 0 : 1000,
          });
          mysteryMarker.on('click', () => onSelectInfrastructure(item));
          mysteryMarker.bindTooltip(
            checked
              ? `<div class="p-1 text-xs"><b>${item.name}</b><br/><span class="text-slate-500">Ya comprobado: no era este</span></div>`
              : '<div class="p-1 text-xs font-black text-violet-700">❓ ¿Qué lugar será?</div>',
            { direction: 'top', offset: [0, -18] },
          );
          group.addLayer(mysteryMarker);
          return;
        }
      }
      const escapeFoundBadge = escape?.foundIds.includes(item.id)
        ? '<div class="absolute -bottom-1.5 -right-1.5 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[11px] font-black shadow-md border-2 border-white">✓</div>'
        : '';

      const customIcon = L.divIcon({
        className: 'custom-infrastructure-marker',
        html: iconHtml.replace(/<\/div>\s*$/, `${escapeFoundBadge}</div>`),
        iconSize: [40, 40],
        iconAnchor: [20, 20],
      });

      const marker = L.marker(item.coordinates, { icon: customIcon });

      marker.on('click', () => {
        onSelectInfrastructure(item);
      });

      // Child-friendly Tooltip
      marker.bindTooltip(
        `<div class="p-2 font-sans min-w-[200px]">
          <div class="flex items-center justify-between gap-2 pb-1 mb-1 border-b border-slate-200">
            <span class="text-xs font-black text-slate-800">${emoji} ${item.name}</span>
            <span class="text-[9px] px-1.5 py-0.5 rounded-full font-bold ${
              item.criticality === 'CRITICAL_1' ? 'bg-red-100 text-red-700' :
              item.criticality === 'HIGH_2' ? 'bg-amber-100 text-amber-800' :
              'bg-blue-100 text-blue-700'
            }">
              Nivel ${critNumber}
            </span>
          </div>
          <div class="text-[11px] text-slate-600">${item.subcategory}</div>
          <div class="text-[10px] text-amber-700 font-bold mt-1">¡Toca para descubrir su secreto! ✨</div>
        </div>`,
        {
          direction: 'top',
          offset: [0, -18],
          className: 'shadow-xl rounded-2xl border-2 border-indigo-400',
        }
      );

      group.addLayer(marker);
    });
  }, [infrastructures, selectedInfrastructure, activeScenario, escape]);

  // Escape room: al empezar, encuadra todos los lugares dejando sitio a la tarjeta del enigma.
  const escapeOn = !!escape;
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !escapeOn || infrastructures.length === 0) return;
    const wide = window.innerWidth >= 640;
    // Encuadra el casco urbano (≤ 1,2 km del centro); los lugares lejanos se ven alejando el mapa.
    const center = L.latLng(38.2045, -1.4010);
    const core = infrastructures.filter((i) => center.distanceTo(L.latLng(i.coordinates)) <= 1200);
    map.flyToBounds(L.latLngBounds((core.length ? core : infrastructures).map((i) => i.coordinates)), {
      paddingTopLeft: [wide ? 400 : 20, 40],
      paddingBottomRight: [40, wide ? 40 : 300],
      maxZoom: 17,
      duration: 1.2,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [escapeOn]);

  // Center on Selected Infrastructure
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !selectedInfrastructure) return;

    map.flyTo(selectedInfrastructure.coordinates, 16, {
      duration: 1.2,
      easeLinearity: 0.25,
    });
  }, [selectedInfrastructure]);

  // Render Grid Overlay (cuadrícula A–J × 1–6 de la ficha F01)
  useEffect(() => {
    const map = mapInstanceRef.current;
    const group = gridLayerRef.current;
    if (!map || !group) return;
    group.clearLayers();

    if (!gridVisible) return;

    const grid = gridConfig || ABARAN_URBAN_GRID;
    const { v, h } = gridLines(grid);
    const { cols: colLabels, rows: rowLabels } = gridLabels(grid);

    // Líneas verticales (columnas A–J)
    v.forEach((line) => {
      const polyline = L.polyline(line, {
        color: '#f59e0b',
        weight: 2,
        opacity: 0.55,
        dashArray: '6, 8',
      });
      polyline.addTo(group);
    });

    // Líneas horizontales (filas 1–6)
    h.forEach((line) => {
      const polyline = L.polyline(line, {
        color: '#f59e0b',
        weight: 2,
        opacity: 0.55,
        dashArray: '6, 8',
      });
      polyline.addTo(group);
    });

    // Etiquetas de columnas (arriba)
    colLabels.forEach(({ text, at: [lat, lng] }) => {
      const label = L.marker([lat, lng], {
        icon: L.divIcon({
          className: '',
          html: `<div style="font-weight:900; color:#b45309; font-size:11px; text-shadow: 0 0 4px #ffffffcc;">${text}</div>`,
          iconSize: [20, 20],
          iconAnchor: [10, 10],
        }),
      });
      label.addTo(group);
    });

    // Etiquetas de filas (izquierda)
    rowLabels.forEach(({ text, at: [lat, lng] }) => {
      const label = L.marker([lat, lng], {
        icon: L.divIcon({
          className: '',
          html: `<div style="font-weight:900; color:#b45309; font-size:11px; text-shadow: 0 0 4px #ffffffcc;">${text}</div>`,
          iconSize: [20, 20],
          iconAnchor: [10, 10],
        }),
      });
      label.addTo(group);
    });
  }, [gridVisible, gridConfig]);

  const goToLocation = (lat: number, lng: number, zoom: number) => {
    const map = mapInstanceRef.current;
    if (!map) return;
    map.flyTo([lat, lng], zoom, { duration: 1.2 });
  };

  return (
    <div className="relative w-full h-full min-h-[400px] overflow-hidden select-none">
      {/* The Leaflet container */}
      <div 
        ref={mapContainerRef} 
        className="absolute inset-0 w-full h-full z-0 bg-slate-900" 
      />

      {/* Selector de Mapa Base Divertido: Solo OpenStreetMap y Satélite */}
      <div className="absolute top-3 right-3 z-[900]">
        <div className="bg-slate-900/90 backdrop-blur-md p-1 rounded-2xl border-2 border-indigo-500/50 shadow-2xl flex items-center gap-1">
          <button
            type="button"
            onClick={() => onChangeBaseMap('osm')}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all ${
              activeBaseMap === 'osm'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md scale-105'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <span>🗺️</span>
            <span>Callejero (OSM)</span>
          </button>

          <button
            type="button"
            onClick={() => onChangeBaseMap('satellite')}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all ${
              activeBaseMap === 'satellite'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md scale-105'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <span>🛰️</span>
            <span>Satélite Aéreo</span>
          </button>
          <button
            type="button"
            onClick={() => setGridVisible((prev: boolean) => !prev)}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all ${
              gridVisible
                ? 'bg-gradient-to-r from-amber-400 to-orange-400 text-white shadow-md scale-105'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
            title="Activar cuadrícula A–J × 1–6 (ficha F01)"
          >
            <span>🔲</span>
            <span>Cuadrícula</span>
          </button>
        </div>
      </div>

      {/* Floating Coordinates Bar */}
      {cursorCoordinates && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-[900] bg-slate-900/90 backdrop-blur-md px-3 py-1 rounded-full border border-slate-700 text-[11px] font-mono text-slate-300 shadow-lg pointer-events-none flex items-center gap-3">
          <span>Lat: <strong className="text-amber-300">{cursorCoordinates.lat.toFixed(5)}°N</strong></span>
          <span className="text-slate-600">•</span>
          <span>Lng: <strong className="text-amber-300">{Math.abs(cursorCoordinates.lng).toFixed(5)}°O</strong></span>
          <span className="text-slate-600">•</span>
          <span className="text-emerald-400">Abarán (Murcia)</span>
        </div>
      )}
    </div>
  );
};
