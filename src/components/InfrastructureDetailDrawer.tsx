import React, { useState } from 'react';
import { 
  X, MapPin, Phone, Zap, Shield, AlertTriangle, CheckCircle, 
  Clock, Copy, Check, Users, Navigation, Compass, ExternalLink, Activity, Sparkles, Award
} from 'lucide-react';
import { InfrastructureItem, EmergencyScenario } from '../types/infrastructure';
import { CATEGORIES_META } from '../data/abaranData';

interface InfrastructureDetailDrawerProps {
  item: InfrastructureItem | null;
  onClose: () => void;
  onFocusOnMap: (item: InfrastructureItem) => void;
  onSimulateImpact?: (item: InfrastructureItem) => void;
  activeScenario: EmergencyScenario | null;
}

export const InfrastructureDetailDrawer: React.FC<InfrastructureDetailDrawerProps> = ({
  item,
  onClose,
  onFocusOnMap,
  onSimulateImpact,
  activeScenario,
}) => {
  const [copiedCoords, setCopiedCoords] = useState(false);

  if (!item) return null;

  const meta = CATEGORIES_META[item.category];
  const isAffected = activeScenario?.affectedInfrasIds.includes(item.id);

  const copyCoordinates = () => {
    const text = `${item.coordinates[0].toFixed(5)}, ${item.coordinates[1].toFixed(5)}`;
    navigator.clipboard.writeText(text);
    setCopiedCoords(true);
    setTimeout(() => setCopiedCoords(false), 2000);
  };

  // Fun educational fact generator for 1º ESO students
  const getDidYouKnowFact = () => {
    if (item.category === 'WATER_HYDRAULIC') {
      return '💧 ¿Sabías que Abarán conserva cuatro de las siete norias que siguen funcionando en la Región de Murcia? La Noria Grande mide 11,92 m de diámetro, gira desde 1808 solo con la fuerza del río y se considera la más grande de Europa.';
    }
    if (item.category === 'FOOD_SUPPLY') {
      return '🛒 ¿Sabías que ninguna ley obliga a los supermercados a guardar reservas de agua para emergencias? Lo que recomiendan Protección Civil y la Unión Europea es que cada familia tenga en casa agua y comida para al menos 72 horas. En una emergencia grave, la Ley 17/2015 permite a las autoridades requisar temporalmente bienes, como los alimentos de una tienda, pagando una indemnización.';
    }
    if (item.category === 'PHARMACY_HEALTH') {
      return '💊 ¿Sabías que las farmacias se turnan las guardias para que siempre haya alguna abierta? Según el Plan de Emergencias de Abarán, el municipio tiene 5 farmacias y un botiquín en San José Artesano. Medicinas como la insulina se guardan en nevera, entre 2 y 8 °C.';
    }
    if (item.category === 'HEALTH_EMERGENCY') {
      return '🚑 ¿Sabías que los consultorios de Hoya del Campo y San José Artesano dependen del Centro de Salud de Abarán y solo abren unas horas por la mañana? Fuera de ese horario, ante una urgencia hay que llamar al 112.';
    }
    if (item.category === 'TRANSPORT_LOGISTICS') {
      return '🌉 ¿Sabías que el Puente Viejo de hierro se decidió construir después de la gran riada de 1888, para que aguantara las futuras crecidas del Segura? Sus vigas se fabricaron en la fundición valenciana La Primitiva.';
    }
    if (item.category === 'TELECOM_EARLY_WARNING') {
      return '📡 ¿Sabías que el SAIH de la Confederación Hidrográfica del Segura tiene 162 puntos de control que actualizan sus datos cada 5 minutos? Así se puede avisar de una crecida antes de que llegue.';
    }
    return '🛡️ ¿Sabías que una infraestructura crítica es aquella que si falla o se inunda, deja al pueblo sin un servicio imprescindible como agua, luz, medicinas o comida?';
  };

  return (
    <div className="fixed top-20 right-3 sm:right-4 bottom-4 z-[1000] w-[calc(100vw-1.5rem)] sm:w-[420px] max-w-full bg-slate-900/95 backdrop-blur-md text-white rounded-3xl shadow-2xl border-2 border-indigo-500/50 flex flex-col overflow-hidden animate-in slide-in-from-right duration-300 ring-4 ring-indigo-500/20">
      {/* Drawer Header - Trading Card Style */}
      <div 
        className="p-4 sm:p-5 border-b border-slate-800 relative bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900"
        style={{ borderTop: `6px solid ${meta.color}` }}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <span 
              className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-black tracking-wider uppercase shadow-sm"
              style={{ backgroundColor: meta.bgColor, color: meta.color }}
            >
              {item.code}
            </span>
            <span className="text-xs text-slate-300 font-bold">{meta.shortName}</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Cerrar detalle"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <h2 className="text-base sm:text-lg font-black text-white mt-2 leading-snug">{item.name}</h2>
        <p className="text-xs text-slate-300 mt-0.5 font-medium">{item.subcategory}</p>

        {/* Badges row with game stars */}
        <div className="flex flex-wrap items-center gap-1.5 mt-3">
          {/* Criticality Badge */}
          {item.criticality === 'CRITICAL_1' && (
            <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-red-500/30 text-red-200 border border-red-500/50 flex items-center gap-1.5 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
              ⭐⭐⭐ Nivel 1 • Súper Crítica
            </span>
          )}
          {item.criticality === 'HIGH_2' && (
            <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-amber-500/30 text-amber-200 border border-amber-500/50 flex items-center gap-1.5 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              ⭐⭐ Nivel 2 • Muy Importante
            </span>
          )}
          {item.criticality === 'MEDIUM_3' && (
            <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-blue-500/30 text-blue-200 border border-blue-500/50 flex items-center gap-1.5 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-blue-400" />
              ⭐ Nivel 3 • Soporte Esencial
            </span>
          )}

          {/* Operational Status */}
          {item.status === 'OPERATIONAL' && !isAffected && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
              <CheckCircle className="w-3 h-3 text-emerald-400" />
              Operativo
            </span>
          )}
          {isAffected && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-red-600 text-white border border-red-400 flex items-center gap-1 animate-pulse">
              <AlertTriangle className="w-3 h-3 text-white" />
              ¡Alerta de Incidencia Activa!
            </span>
          )}
        </div>
      </div>

      {/* Drawer Body */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 text-xs">
        {/* Did You Know Box for 1º ESO */}
        <div className="bg-gradient-to-r from-indigo-950/70 to-purple-950/70 p-3.5 rounded-2xl border-2 border-indigo-500/40 shadow-md">
          <div className="flex items-center gap-1.5 text-amber-300 font-black text-xs mb-1">
            <Sparkles className="w-4 h-4 fill-amber-300" />
            <span>Ficha de Aprendizaje (1º ESO):</span>
          </div>
          <p className="text-slate-200 text-xs leading-relaxed">
            {getDidYouKnowFact()}
          </p>
        </div>

        {/* Description */}
        <div>
          <span className="text-[10px] font-black tracking-wider uppercase text-slate-400 block mb-1">
            Función durante un apagón de 72 horas:
          </span>
          <p className="text-slate-200 leading-relaxed bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
            {item.description}
          </p>
          {item.blackoutRole && <p className="mt-2 rounded-xl border border-amber-400/25 bg-amber-400/10 px-3 py-2 text-[11px] font-semibold text-amber-100">⚡ {item.blackoutRole}</p>}
          {item.detailsUnverified && (
            <p className="mt-1.5 text-[10px] text-amber-300 bg-amber-500/10 border border-amber-500/30 rounded-xl px-2.5 py-1.5">
              ⚠ Esta descripción procede de la versión original de la app y no está comprobada con fuentes oficiales.
            </p>
          )}
        </div>

        {/* Location & Coordinates Grid */}
        <div className="grid grid-cols-2 gap-2 bg-slate-800/50 p-3 rounded-2xl border border-slate-700">
          <div className="col-span-2">
            <span className="text-[10px] text-slate-400 block">Dirección / Ubicación:</span>
            <span className="font-bold text-white flex items-center gap-1.5 mt-0.5 text-xs">
              <MapPin className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
              {item.address}
            </span>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 block">Zona / Pedanía:</span>
            <span className="font-bold text-slate-200">{item.pedania || 'Casco Urbano'}</span>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 block">Altura sobre el mar:</span>
            <span className="font-bold text-slate-200">{item.elevationMeters} metros</span>
          </div>

          <div className="col-span-2 pt-2 border-t border-slate-700/80 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 block">Coordenadas GPS (WGS84):</span>
              <span className="font-mono text-[11px] text-blue-300 font-bold">
                {item.coordinates[0].toFixed(5)}°N, {Math.abs(item.coordinates[1]).toFixed(5)}°O
              </span>
            </div>
            <button
              type="button"
              onClick={copyCoordinates}
              className="p-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 hover:text-white transition-colors flex items-center gap-1 text-[10px] font-bold"
            >
              {copiedCoords ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span>¡Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copiar GPS</span>
                </>
              )}
            </button>
          </div>
          {item.mapsUrl && (
            <a href={item.mapsUrl} target="_blank" rel="noreferrer" className="col-span-2 mt-1 flex items-center justify-center gap-1.5 rounded-xl border border-blue-400/30 bg-blue-500/10 px-2.5 py-2 text-[11px] font-bold text-blue-200 hover:bg-blue-500/20">
              <ExternalLink className="h-3.5 w-3.5" /> Comprobar ubicación en Google Maps
            </a>
          )}
          {item.locationVerification && <p className="col-span-2 text-[10px] text-emerald-300">✓ {item.locationVerification}</p>}
        </div>

        {/* Emergency details */}
        <div className="space-y-2 bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
          <div>
            <span className="text-[10px] text-slate-400 block">Responsable / Entidad Gestora:</span>
            <span className="font-bold text-slate-200">{item.operator}</span>
          </div>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 block">Teléfono de Emergencia Directo:</span>
              <span className="font-black text-red-400 text-xs flex items-center gap-1.5 mt-0.5">
                <Phone className="w-3.5 h-3.5" />
                {item.emergencyPhone}
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800">
            <span className="text-[10px] text-slate-400 block">¿Tiene electricidad de reserva?</span>
            <div className="flex items-center gap-2 mt-1">
              {!item.backupPowerVerified ? (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-800 text-slate-400 border border-slate-700">
                  Sin datos comprobados
                </span>
              ) : item.backupPower ? (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                  <Zap className="w-3 h-3 text-amber-400" />
                  Generador / Baterías autónomas
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-800 text-slate-400 border border-slate-700">
                  Depende de la red general
                </span>
              )}
            </div>
            {item.backupPowerVerified && item.backupPowerDetails && (
              <p className="text-[11px] text-slate-300 mt-1 italic">
                {item.backupPowerDetails}
              </p>
            )}
          </div>
        </div>

        {/* Protocols */}
        <div>
          <span className="text-[10px] font-black tracking-wider uppercase text-slate-400 block mb-1">
            Consejos para este recurso durante el apagón
          </span>
          <p className="text-[10px] text-slate-400 mb-1">Orientación educativa; no sustituye instrucciones oficiales ni protocolos internos.</p>
          <div className="space-y-1.5 bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
            {item.protocols.map((protocol, idx) => (
              <div key={idx} className="flex items-start gap-2 text-[11px] text-slate-200 font-medium">
                <span className="w-4 h-4 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-black text-[9px] flex-shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span>{protocol}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Drawer Actions Footer */}
      <div className="p-3 bg-slate-950 border-t border-slate-800 flex gap-2">
        <button
          type="button"
          onClick={() => onFocusOnMap(item)}
          className="flex-1 py-2.5 px-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs flex items-center justify-center gap-1.5 transition-transform active:scale-95 shadow-md"
        >
          <Navigation className="w-4 h-4" />
          <span>¡Ver en el Mapa!</span>
        </button>
      </div>
    </div>
  );
};
