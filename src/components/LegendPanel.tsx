import React from 'react';
import { ChevronDown, ChevronUp, Eye, EyeOff, Layers } from 'lucide-react';
import { CategoryId, CriticalityLevel } from '../types/infrastructure';
import { CATEGORIES_META } from '../data/abaranData';

interface LegendPanelProps {
  selectedCategories: Set<CategoryId>; onToggleCategory: (id: CategoryId) => void; onSelectAllCategories: () => void; onDeselectAllCategories: () => void;
  selectedCriticality: Set<CriticalityLevel>; onToggleCriticality: (level: CriticalityLevel) => void;
  showRiskZones: boolean; onToggleRiskZones: () => void; showEvacuationRoutes: boolean; onToggleEvacuationRoutes: () => void;
  showSafetyRadius: boolean; onToggleSafetyRadius: () => void; activeBaseMap: string; onChangeBaseMap: (id: string) => void;
  categoryCounts: Record<CategoryId, number>; totalInfrastructures: number; isOpen: boolean; onToggleOpen: () => void;
}
const BLACKOUT_CATEGORIES: CategoryId[] = ['HEALTH_EMERGENCY', 'SECURITY_DEFENSE', 'PHARMACY_HEALTH', 'FOOD_SUPPLY', 'SHELTER_EDUCATION', 'WATER_HYDRAULIC', 'ENERGY_POWER', 'TRANSPORT_LOGISTICS', 'TELECOM_EARLY_WARNING'];

export const LegendPanel: React.FC<LegendPanelProps> = ({ selectedCategories, onToggleCategory, onSelectAllCategories, onDeselectAllCategories, categoryCounts, totalInfrastructures, isOpen, onToggleOpen, showSafetyRadius, onToggleSafetyRadius }) => <aside className={`fixed bottom-4 left-4 z-[1000] w-[calc(100vw-2rem)] max-w-sm transition-transform ${isOpen ? 'translate-y-0' : 'translate-y-[calc(100%-3.2rem)]'}`}>
  <div className="overflow-hidden rounded-2xl border border-slate-700 bg-slate-900/95 text-white shadow-2xl backdrop-blur-md">
    <button onClick={onToggleOpen} className="flex w-full items-center justify-between px-4 py-3 text-left"><span><span className="mr-2 inline-block rounded-lg bg-amber-400/15 p-1 text-amber-300"><Layers className="h-4 w-4" /></span><b>Mapa del apagón</b><small className="ml-2 text-slate-400">{totalInfrastructures} recursos</small></span>{isOpen ? <ChevronDown className="h-5 w-5" /> : <ChevronUp className="h-5 w-5" />}</button>
    {isOpen && <div className="border-t border-slate-700 p-3"><p className="mb-3 text-xs leading-relaxed text-slate-300">Solo se muestran lugares contrastados con al menos dos fuentes. Abre cada ficha para ver sus fuentes y comprobar su posición.</p><div className="mb-2 flex justify-between text-[11px]"><button onClick={onSelectAllCategories} className="font-bold text-amber-300">Mostrar todos</button><button onClick={onDeselectAllCategories} className="text-slate-400">Ocultar todos</button></div><div className="space-y-1.5">{BLACKOUT_CATEGORIES.map(id => { const meta = CATEGORIES_META[id]; const visible = selectedCategories.has(id); return <button key={id} onClick={() => onToggleCategory(id)} className={`flex w-full items-center justify-between rounded-xl border px-2.5 py-2 text-left text-xs ${visible ? 'border-slate-600 bg-slate-800' : 'border-slate-800 bg-slate-950 text-slate-500'}`}><span><i className="mr-2 inline-block h-2.5 w-2.5 rounded-full" style={{ background: meta.color }} />{meta.shortName}</span><span className="flex items-center gap-2">{categoryCounts[id] || 0}{visible ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}</span></button>; })}</div><button onClick={onToggleSafetyRadius} className="mt-3 text-[11px] text-slate-400 underline">{showSafetyRadius ? 'Ocultar' : 'Mostrar'} áreas orientativas</button><p className="mt-2 text-[10px] text-slate-500">Las áreas son visuales, no perímetros oficiales.</p></div>}
  </div>
</aside>;
