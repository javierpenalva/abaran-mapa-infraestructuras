import React, { useState } from 'react';
import { 
  Droplets, HeartPulse, ShieldAlert, Zap, Truck, Radio, Home, Flame, 
  Layers, Check, ChevronDown, ChevronUp, Eye, EyeOff, AlertTriangle, ShieldCheck,
  Compass, MapPin, Activity, HelpCircle, ShoppingCart, Pill, Sparkles
} from 'lucide-react';
import { CategoryId, CategoryMeta, CriticalityLevel } from '../types/infrastructure';
import { CATEGORIES_META } from '../data/abaranData';

interface LegendPanelProps {
  selectedCategories: Set<CategoryId>;
  onToggleCategory: (catId: CategoryId) => void;
  onSelectAllCategories: () => void;
  onDeselectAllCategories: () => void;
  selectedCriticality: Set<CriticalityLevel>;
  onToggleCriticality: (level: CriticalityLevel) => void;
  showRiskZones: boolean;
  onToggleRiskZones: () => void;
  showEvacuationRoutes: boolean;
  onToggleEvacuationRoutes: () => void;
  showSafetyRadius: boolean;
  onToggleSafetyRadius: () => void;
  activeBaseMap: string;
  onChangeBaseMap: (basemapId: string) => void;
  categoryCounts: Record<CategoryId, number>;
  totalInfrastructures: number;
  isOpen: boolean;
  onToggleOpen: () => void;
}

export const LegendPanel: React.FC<LegendPanelProps> = ({
  selectedCategories,
  onToggleCategory,
  onSelectAllCategories,
  onDeselectAllCategories,
  selectedCriticality,
  onToggleCriticality,
  showRiskZones,
  onToggleRiskZones,
  showEvacuationRoutes,
  onToggleEvacuationRoutes,
  showSafetyRadius,
  onToggleSafetyRadius,
  activeBaseMap,
  onChangeBaseMap,
  categoryCounts,
  totalInfrastructures,
  isOpen,
  onToggleOpen,
}) => {
  const [activeTab, setActiveTab] = useState<'categories' | 'criticality' | 'layers' | 'guide'>('categories');

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Droplets': return <Droplets className="w-4 h-4" />;
      case 'HeartPulse': return <HeartPulse className="w-4 h-4" />;
      case 'Pill': return <Pill className="w-4 h-4" />;
      case 'ShoppingCart': return <ShoppingCart className="w-4 h-4" />;
      case 'ShieldAlert': return <ShieldAlert className="w-4 h-4" />;
      case 'Zap': return <Zap className="w-4 h-4" />;
      case 'Truck': return <Truck className="w-4 h-4" />;
      case 'Radio': return <Radio className="w-4 h-4" />;
      case 'Home': return <Home className="w-4 h-4" />;
      case 'Flame': return <Flame className="w-4 h-4" />;
      default: return <MapPin className="w-4 h-4" />;
    }
  };

  return (
    <div className={`fixed bottom-4 left-4 z-[1000] transition-all duration-300 max-w-sm sm:max-w-md w-[calc(100vw-2rem)] ${isOpen ? 'translate-y-0' : 'translate-y-[calc(100%-3rem)]'}`}>
      <div className="bg-slate-900/95 backdrop-blur-md text-white rounded-2xl shadow-2xl border border-slate-700 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header bar */}
        <div 
          onClick={onToggleOpen}
          className="px-4 py-3 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700/80 flex items-center justify-between cursor-pointer select-none hover:bg-slate-800/80 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-blue-600/30 text-blue-400 border border-blue-500/30">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm tracking-wide text-white">Leyenda Cartográfica</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  {totalInfrastructures} puntos
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Infraestructuras Críticas de Abarán</p>
            </div>
          </div>
          <button 
            type="button"
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors"
            aria-label={isOpen ? "Minimizar leyenda" : "Expandir leyenda"}
          >
            {isOpen ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
          </button>
        </div>

        {isOpen && (
          <>
            {/* Tabs Navigation */}
            <div className="flex border-b border-slate-800 bg-slate-950/60 p-1 gap-1 text-xs font-medium">
              <button
                type="button"
                onClick={() => setActiveTab('categories')}
                className={`flex-1 py-1.5 px-2 rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                  activeTab === 'categories' 
                    ? 'bg-blue-600 text-white shadow-sm' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Sectores</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('criticality')}
                className={`flex-1 py-1.5 px-2 rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                  activeTab === 'criticality' 
                    ? 'bg-blue-600 text-white shadow-sm' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Criticidad</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('layers')}
                className={`flex-1 py-1.5 px-2 rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                  activeTab === 'layers' 
                    ? 'bg-blue-600 text-white shadow-sm' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Capas y Base</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('guide')}
                className={`flex-1 py-1.5 px-2 rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                  activeTab === 'guide' 
                    ? 'bg-blue-600 text-white shadow-sm' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Signos</span>
              </button>
            </div>

            {/* Scrollable Content Body */}
            <div className="overflow-y-auto p-4 space-y-4 text-xs max-h-[55vh]">
              {/* TAB 1: SECTORES / CATEGORÍAS */}
              {activeTab === 'categories' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800 pb-2">
                    <span>Filtro interactivo por tipología de red:</span>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={onSelectAllCategories}
                        className="text-blue-400 hover:underline hover:text-blue-300 font-medium"
                      >
                        Todas
                      </button>
                      <span>•</span>
                      <button
                        type="button"
                        onClick={onDeselectAllCategories}
                        className="text-slate-400 hover:underline hover:text-slate-200"
                      >
                        Ninguna
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-2">
                    {Object.values(CATEGORIES_META).map((meta) => {
                      const isSelected = selectedCategories.has(meta.id);
                      const count = categoryCounts[meta.id] || 0;
                      return (
                        <div
                          key={meta.id}
                          onClick={() => onToggleCategory(meta.id)}
                          className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                            isSelected
                              ? 'bg-slate-800/90 border-slate-600 shadow-sm'
                              : 'bg-slate-900/40 border-slate-800/80 opacity-50 hover:opacity-80'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            {/* Color Pin Preview */}
                            <div
                              className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 shadow"
                              style={{ backgroundColor: meta.color, color: '#ffffff' }}
                            >
                              {getCategoryIcon(meta.iconName)}
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-white truncate text-xs">{meta.name}</p>
                              <p className="text-[10px] text-slate-400 truncate">{meta.description}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 flex-shrink-0">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-700/80 text-slate-300">
                              {count}
                            </span>
                            <div
                              className={`w-4 h-4 rounded flex items-center justify-center border transition-colors ${
                                isSelected
                                  ? 'bg-blue-600 border-blue-500 text-white'
                                  : 'border-slate-600 bg-transparent'
                              }`}
                            >
                              {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 2: NIVELES DE CRITICIDAD */}
              {activeTab === 'criticality' && (
                <div className="space-y-3">
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    Clasificación de las instalaciones conforme a la Ley 8/2011 de Protección de Infraestructuras Críticas (PIC) y el Plan Territorial de Emergencia de Abarán (PEMU):
                  </p>

                  <div className="space-y-2.5">
                    {/* CRITICAL 1 */}
                    <div
                      onClick={() => onToggleCriticality('CRITICAL_1')}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                        selectedCriticality.has('CRITICAL_1')
                          ? 'bg-red-950/40 border-red-500/60 shadow-sm'
                          : 'bg-slate-900/40 border-slate-800 opacity-40'
                      }`}
                    >
                      <div className="relative mt-0.5">
                        <div className="w-4 h-4 rounded-full bg-red-600 flex items-center justify-center text-white text-[9px] font-bold shadow-md shadow-red-500/50">
                          1
                        </div>
                        <span className="animate-ping absolute -top-0.5 -left-0.5 w-5 h-5 rounded-full bg-red-500 opacity-40" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-red-300 text-xs">Nivel 1 - Muy Crítica (Estratégica)</span>
                          <span className={`w-3.5 h-3.5 rounded flex items-center justify-center border ${
                            selectedCriticality.has('CRITICAL_1') ? 'bg-red-600 border-red-400 text-white' : 'border-slate-600'
                          }`}>
                            {selectedCriticality.has('CRITICAL_1') && <Check className="w-2.5 h-2.5" />}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-300 mt-1">
                          Instalaciones cuya perturbación o colapso no admite solución alternativa inmediata y generaría una catástrofe humanitaria, sanitaria o de incomunicación total (ej. Centro de Salud SUAP, Presa de Ojós, EDAR, Subestación Abarán, Puente de Hierro).
                        </p>
                      </div>
                    </div>

                    {/* HIGH 2 */}
                    <div
                      onClick={() => onToggleCriticality('HIGH_2')}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                        selectedCriticality.has('HIGH_2')
                          ? 'bg-amber-950/40 border-amber-500/60 shadow-sm'
                          : 'bg-slate-900/40 border-slate-800 opacity-40'
                      }`}
                    >
                      <div className="w-4 h-4 rounded-full bg-amber-500 flex items-center justify-center text-slate-950 text-[9px] font-bold mt-0.5 shadow">
                        2
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-amber-300 text-xs">Nivel 2 - Criticidad Alta</span>
                          <span className={`w-3.5 h-3.5 rounded flex items-center justify-center border ${
                            selectedCriticality.has('HIGH_2') ? 'bg-amber-500 border-amber-400 text-slate-950' : 'border-slate-600'
                          }`}>
                            {selectedCriticality.has('HIGH_2') && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-300 mt-1">
                          Infraestructuras de alto impacto con planes de sustitución parcial o redundancia en menos de 24 horas (ej. Noria Grande, Depósito Hoya del Campo, Helisuperficie 061, Pabellón Albergue).
                        </p>
                      </div>
                    </div>

                    {/* MEDIUM 3 */}
                    <div
                      onClick={() => onToggleCriticality('MEDIUM_3')}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                        selectedCriticality.has('MEDIUM_3')
                          ? 'bg-blue-950/40 border-blue-500/60 shadow-sm'
                          : 'bg-slate-900/40 border-slate-800 opacity-40'
                      }`}
                    >
                      <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center text-white text-[9px] font-bold mt-0.5 shadow">
                        3
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-blue-300 text-xs">Nivel 3 - Criticidad Media / Soporte</span>
                          <span className={`w-3.5 h-3.5 rounded flex items-center justify-center border ${
                            selectedCriticality.has('MEDIUM_3') ? 'bg-blue-500 border-blue-400 text-white' : 'border-slate-600'
                          }`}>
                            {selectedCriticality.has('MEDIUM_3') && <Check className="w-2.5 h-2.5" />}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-300 mt-1">
                          Servicios esenciales de apoyo secundario o centros educativos habilitables como albergues (ej. IES Villa de Abarán, CEIP Hoya del Campo, norias tradicionales de apoyo).
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: CAPAS VECTORIALES Y MAPA BASE */}
              {activeTab === 'layers' && (
                <div className="space-y-4">
                  {/* Capas temáticas */}
                  <div>
                    <span className="font-bold text-slate-200 text-xs block mb-2">Capas de Riesgo y Protección Civil:</span>
                    <div className="space-y-2">
                      <div 
                        onClick={onToggleRiskZones}
                        className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 hover:border-slate-600 flex items-center justify-between cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-4 h-4 rounded bg-blue-500/40 border border-blue-400 flex items-center justify-center">
                            <span className="w-2 h-2 rounded bg-blue-400" />
                          </div>
                          <div>
                            <span className="font-semibold text-white block">Zonas Inundables Río Segura (SNCZI)</span>
                            <span className="text-[10px] text-slate-400">Lámina de inundabilidad T=100 y Ramblas</span>
                          </div>
                        </div>
                        {showRiskZones ? <Eye className="w-4 h-4 text-blue-400" /> : <EyeOff className="w-4 h-4 text-slate-500" />}
                      </div>

                      <div 
                        onClick={onToggleEvacuationRoutes}
                        className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 hover:border-slate-600 flex items-center justify-between cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-4 h-4 rounded bg-emerald-500/30 border border-emerald-400 flex items-center justify-center">
                            <span className="w-3 h-0.5 bg-emerald-400" />
                          </div>
                          <div>
                            <span className="font-semibold text-white block">Rutas Principales de Evacuación</span>
                            <span className="text-[10px] text-slate-400">Salidas rápidas hacia A-30 y cotas seguras</span>
                          </div>
                        </div>
                        {showEvacuationRoutes ? <Eye className="w-4 h-4 text-emerald-400" /> : <EyeOff className="w-4 h-4 text-slate-500" />}
                      </div>

                      <div 
                        onClick={onToggleSafetyRadius}
                        className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 hover:border-slate-600 flex items-center justify-between cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-4 h-4 rounded-full border-2 border-dashed border-amber-400" />
                          <div>
                            <span className="font-semibold text-white block">Radios de Afección y Seguridad</span>
                            <span className="text-[10px] text-slate-400">Perímetros de protección de 200m a 1000m</span>
                          </div>
                        </div>
                        {showSafetyRadius ? <Eye className="w-4 h-4 text-amber-400" /> : <EyeOff className="w-4 h-4 text-slate-500" />}
                      </div>
                    </div>
                  </div>

                  {/* Selector de Mapa Base */}
                  <div>
                    <span className="font-bold text-slate-200 text-xs block mb-2">Cartografía Base (Libre):</span>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => onChangeBaseMap('osm')}
                        className={`p-2.5 rounded-xl text-left border transition-all ${
                          activeBaseMap === 'osm'
                            ? 'bg-blue-600/40 border-blue-400 text-white font-bold ring-2 ring-blue-500/50'
                            : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <span className="block text-xs flex items-center gap-1.5 font-extrabold">
                          <span>🗺️</span> OpenStreetMap
                        </span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">Predeterminado (Libre)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onChangeBaseMap('satellite')}
                        className={`p-2.5 rounded-xl text-left border transition-all ${
                          activeBaseMap === 'satellite'
                            ? 'bg-emerald-600/40 border-emerald-400 text-white font-bold ring-2 ring-emerald-500/50'
                            : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <span className="block text-xs flex items-center gap-1.5 font-extrabold">
                          <span>🛰️</span> Satélite Aéreo
                        </span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">Fotografía espacial ESRI/IGN</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: GUÍA DE SIGNOS Y SÍMBOLOS */}
              {activeTab === 'guide' && (
                <div className="space-y-3">
                  <span className="font-bold text-slate-200 text-xs block">Simbología Oficial del Visor:</span>
                  
                  <div className="space-y-2 bg-slate-950/40 p-3 rounded-xl border border-slate-800">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs ring-2 ring-blue-400/50">
                        <Droplets className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-semibold text-white block">Marcador Temático Redondeado</span>
                        <span className="text-[10px] text-slate-400">Color por sector; halo exterior con indicación de estado operativo.</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-2 border-t border-slate-800">
                      <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center text-[9px] text-white font-bold" />
                      <div>
                        <span className="font-semibold text-white block">Verde: Estado 100% Operativo</span>
                        <span className="text-[10px] text-slate-400">Instalación en servicio regular sin incidencias.</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-2 border-t border-slate-800">
                      <div className="w-4 h-4 rounded-full bg-amber-500 flex items-center justify-center text-[9px] text-slate-900 font-bold" />
                      <div>
                        <span className="font-semibold text-white block">Ámbar: En Mantenimiento</span>
                        <span className="text-[10px] text-slate-400">Trabajos técnicos preventivos con capacidad reducida.</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-2 border-t border-slate-800">
                      <div className="w-4 h-4 rounded-full bg-red-600 flex items-center justify-center text-[9px] text-white font-bold animate-pulse" />
                      <div>
                        <span className="font-semibold text-white block">Rojo Pulsante: Alerta / Afección Activa</span>
                        <span className="text-[10px] text-slate-400">Instalación bajo escenario de emergencia o riesgo inminente.</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-2 border-t border-slate-800">
                      <div className="w-6 h-0.5 bg-emerald-500 rounded-full" />
                      <div>
                        <span className="font-semibold text-white block">Trazo Verde Continuo</span>
                        <span className="text-[10px] text-slate-400">Eje de evacuación de tráfico rodado hacia autovía A-30.</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Summary */}
            <div className="p-3 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                Catálogo Municipal de Protección Civil
              </span>
              <span className="text-slate-300 font-medium">Abarán, Murcia</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
