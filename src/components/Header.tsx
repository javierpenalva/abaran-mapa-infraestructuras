import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, ShieldAlert, FileText, Layers, AlertCircle, Play, 
  RotateCcw, ShieldCheck, MapPin, ChevronRight, X, Trophy, Sparkles, Target,
  ShoppingCart, Pill, Droplets, HeartPulse, Shield
} from 'lucide-react';
import { InfrastructureItem, EmergencyScenario, CategoryId } from '../types/infrastructure';
import { CATEGORIES_META } from '../data/abaranData';
import { PlayerStats } from '../types/game';
import { PLAYER_RANKS, EDUCATIONAL_MISSIONS } from '../data/missionsData';

interface HeaderProps {
  infrastructures: InfrastructureItem[];
  onSelectInfrastructure: (item: InfrastructureItem) => void;
  onOpenSimulationModal: () => void;
  onOpenReportModal: () => void;
  activeScenario: EmergencyScenario | null;
  onDeactivateScenario: () => void;
  isLegendOpen: boolean;
  onToggleLegend: () => void;
  selectedCategories: Set<CategoryId>;
  onQuickFilterCategory: (catId: CategoryId | 'ALL') => void;
  playerStats: PlayerStats;
  onOpenMissionsModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  infrastructures,
  onSelectInfrastructure,
  onOpenSimulationModal,
  onOpenReportModal,
  activeScenario,
  onDeactivateScenario,
  isLegendOpen,
  onToggleLegend,
  selectedCategories,
  onQuickFilterCategory,
  playerStats,
  onOpenMissionsModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const currentRank = PLAYER_RANKS.slice().reverse().find(r => playerStats.xp >= r.minXp) || PLAYER_RANKS[0];

  // Close search dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchResults = searchQuery.trim() === '' 
    ? [] 
    : infrastructures.filter(item => {
        const q = searchQuery.toLowerCase();
        return (
          item.name.toLowerCase().includes(q) ||
          item.code.toLowerCase().includes(q) ||
          item.subcategory.toLowerCase().includes(q) ||
          item.address.toLowerCase().includes(q) ||
          (item.pedania && item.pedania.toLowerCase().includes(q))
        );
      }).slice(0, 7);

  return (
    <header className="fixed top-0 left-0 right-0 z-[1000] bg-slate-900/95 backdrop-blur-md border-b-2 border-indigo-500/40 text-white shadow-2xl">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2 flex items-center justify-between gap-2.5">
        {/* Logo and Municipality Title */}
        <div className="flex items-center gap-2.5 flex-shrink-0">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-amber-400 p-0.5 shadow-lg flex items-center justify-center transform -rotate-2">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-amber-300 font-black text-sm tracking-tighter">
              {currentRank.icon}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-black text-sm sm:text-base tracking-tight text-white leading-tight">
                Abarán <span className="text-amber-400 font-extrabold text-xs sm:text-sm">Guardián SIG</span>
              </h1>
              <span className="hidden lg:inline-block px-1.5 py-0.5 rounded-full text-[9px] font-black bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                1º ESO
              </span>
            </div>
            <p className="text-[10px] text-slate-400 hidden sm:block">
              Valle de Ricote • Mapa de Infraestructuras y Protección Civil
            </p>
          </div>
        </div>

        {/* Gamified Missions & Level Status Pill */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            type="button"
            onClick={onOpenMissionsModal}
            className="px-2.5 py-1.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs shadow-md shadow-amber-500/20 flex items-center gap-1.5 transition-transform active:scale-95 animate-pulse"
            title="Abrir panel de retos y misiones de 1º ESO"
          >
            <Trophy className="w-4 h-4 fill-slate-950" />
            <span className="hidden sm:inline">Misiones:</span>
            <span>{playerStats.completedMissionIds.length}/{EDUCATIONAL_MISSIONS.length}</span>
            <span className="px-1.5 py-0.2 rounded-full bg-black/20 text-[10px]">
              {playerStats.xp} XP
            </span>
          </button>
        </div>

        {/* Search Bar with Live Autocomplete */}
        <div ref={searchContainerRef} className="relative flex-1 max-w-xs sm:max-w-sm mx-1">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              placeholder="Buscar súper, farmacia, noria..."
              className="w-full pl-9 pr-7 py-1.5 rounded-xl bg-slate-800/90 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Autocomplete Results Box */}
          {isSearchFocused && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-slate-900 border-2 border-indigo-500/50 rounded-2xl shadow-2xl overflow-hidden z-50 text-xs divide-y divide-slate-800">
              {searchResults.map((item) => {
                const meta = CATEGORIES_META[item.category];
                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      onSelectInfrastructure(item);
                      setIsSearchFocused(false);
                      setSearchQuery('');
                    }}
                    className="p-2.5 hover:bg-slate-800 cursor-pointer flex items-center justify-between gap-2 transition-colors"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] font-bold text-amber-400">{item.code}</span>
                        <span className="font-bold text-white truncate text-xs">{item.name}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 truncate block mt-0.5">
                        {meta.shortName} • 📍 {item.pedania || 'Casco Urbano'}
                      </span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {/* Active scenario alert pill or simulation launcher */}
          {activeScenario ? (
            <div className="flex items-center gap-1.5 bg-red-950/90 border border-red-500 text-red-200 px-2.5 py-1.5 rounded-xl text-xs shadow-md">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              <span className="font-bold hidden md:inline">{activeScenario.title}</span>
              <button
                type="button"
                onClick={onDeactivateScenario}
                className="ml-1 p-0.5 rounded hover:bg-red-900/60 text-red-300 hover:text-white"
                title="Detener simulación"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={onOpenSimulationModal}
              className="py-1.5 px-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors"
              title="Abrir simulador de emergencias"
            >
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">Simulador</span>
            </button>
          )}

          {/* Dossier Report Button */}
          <button
            type="button"
            onClick={onOpenReportModal}
            className="py-1.5 px-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors"
            title="Ver informe oficial para imprimir o PDF"
          >
            <FileText className="w-4 h-4 text-blue-400" />
            <span className="hidden md:inline">Informe</span>
          </button>

          {/* Toggle Legend Button */}
          <button
            type="button"
            onClick={onToggleLegend}
            className={`py-1.5 px-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors ${
              isLegendOpen 
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' 
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span className="hidden sm:inline">Leyenda</span>
          </button>
        </div>
      </div>

      {/* Quick Filter Bar with New Sectors (Supermercados & Farmacias) */}
      <div className="bg-slate-950/80 px-3 sm:px-4 py-1.5 flex items-center gap-2 overflow-x-auto text-[11px] border-t border-slate-800/80">
        <span className="text-slate-400 font-bold flex-shrink-0">Filtrar:</span>
        <button
          type="button"
          onClick={() => onQuickFilterCategory('ALL')}
          className={`px-2.5 py-0.5 rounded-full font-bold transition-all flex-shrink-0 ${
            selectedCategories.size >= Object.keys(CATEGORIES_META).length
              ? 'bg-amber-400 text-slate-950 shadow-sm'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          🌟 Todos los sectores
        </button>
        <button
          type="button"
          onClick={() => onQuickFilterCategory('FOOD_SUPPLY')}
          className={`px-2.5 py-0.5 rounded-full font-bold transition-all flex items-center gap-1 flex-shrink-0 ${
            selectedCategories.has('FOOD_SUPPLY') && selectedCategories.size === 1
              ? 'bg-emerald-500 text-white shadow-sm ring-2 ring-emerald-400'
              : 'bg-slate-800 text-emerald-300 hover:bg-slate-700'
          }`}
        >
          <ShoppingCart className="w-3 h-3" />
          <span>🛒 Supermercados ({infrastructures.filter(i => i.category === 'FOOD_SUPPLY').length})</span>
        </button>
        <button
          type="button"
          onClick={() => onQuickFilterCategory('PHARMACY_HEALTH')}
          className={`px-2.5 py-0.5 rounded-full font-bold transition-all flex items-center gap-1 flex-shrink-0 ${
            selectedCategories.has('PHARMACY_HEALTH') && selectedCategories.size === 1
              ? 'bg-cyan-500 text-white shadow-sm ring-2 ring-cyan-400'
              : 'bg-slate-800 text-cyan-300 hover:bg-slate-700'
          }`}
        >
          <Pill className="w-3 h-3" />
          <span>💊 Farmacias ({infrastructures.filter(i => i.category === 'PHARMACY_HEALTH').length})</span>
        </button>
        <button
          type="button"
          onClick={() => onQuickFilterCategory('WATER_HYDRAULIC')}
          className={`px-2.5 py-0.5 rounded-full font-bold transition-all flex items-center gap-1 flex-shrink-0 ${
            selectedCategories.has('WATER_HYDRAULIC') && selectedCategories.size === 1
              ? 'bg-sky-500 text-white shadow-sm ring-2 ring-sky-400'
              : 'bg-slate-800 text-sky-300 hover:bg-slate-700'
          }`}
        >
          <Droplets className="w-3 h-3" />
          <span>💧 Agua y Norias</span>
        </button>
        <button
          type="button"
          onClick={() => onQuickFilterCategory('HEALTH_EMERGENCY')}
          className={`px-2.5 py-0.5 rounded-full font-bold transition-all flex items-center gap-1 flex-shrink-0 ${
            selectedCategories.has('HEALTH_EMERGENCY') && selectedCategories.size === 1
              ? 'bg-red-500 text-white shadow-sm ring-2 ring-red-400'
              : 'bg-slate-800 text-red-300 hover:bg-slate-700'
          }`}
        >
          <HeartPulse className="w-3 h-3" />
          <span>🚑 Sanidad y Urgencias</span>
        </button>
        <button
          type="button"
          onClick={() => onQuickFilterCategory('SECURITY_DEFENSE')}
          className={`px-2.5 py-0.5 rounded-full font-bold transition-all flex items-center gap-1 flex-shrink-0 ${
            selectedCategories.has('SECURITY_DEFENSE') && selectedCategories.size === 1
              ? 'bg-blue-500 text-white shadow-sm ring-2 ring-blue-400'
              : 'bg-slate-800 text-blue-300 hover:bg-slate-700'
          }`}
        >
          <Shield className="w-3 h-3" />
          <span>👮 Policía y Bomberos</span>
        </button>
      </div>
    </header>
  );
};
