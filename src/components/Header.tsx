import React, { useEffect, useRef, useState } from 'react';
import { BatteryWarning, Layers, Search, Trophy, X } from 'lucide-react';
import { CategoryId, InfrastructureItem } from '../types/infrastructure';
import { PlayerStats } from '../types/game';
import { EDUCATIONAL_MISSIONS } from '../data/missionsData';

interface HeaderProps {
  infrastructures: InfrastructureItem[]; onSelectInfrastructure: (item: InfrastructureItem) => void;
  isLegendOpen: boolean; onToggleLegend: () => void; selectedCategories: Set<CategoryId>;
  onQuickFilterCategory: (catId: CategoryId | 'ALL') => void; playerStats: PlayerStats;
  onOpenMissionsModal: () => void; onOpenGuide: () => void;
}

export const Header: React.FC<HeaderProps> = ({ infrastructures, onSelectInfrastructure, isLegendOpen, onToggleLegend, selectedCategories, onQuickFilterCategory, playerStats, onOpenMissionsModal, onOpenGuide }) => {
  const [query, setQuery] = useState(''); const [focused, setFocused] = useState(false); const container = useRef<HTMLDivElement>(null);
  useEffect(() => { const close = (event: MouseEvent) => { if (!container.current?.contains(event.target as Node)) setFocused(false); }; document.addEventListener('mousedown', close); return () => document.removeEventListener('mousedown', close); }, []);
  const results = query.trim() ? infrastructures.filter(item => `${item.name} ${item.address} ${item.subcategory}`.toLowerCase().includes(query.toLowerCase())).slice(0, 6) : [];
  const filters: { id: CategoryId | 'ALL'; label: string }[] = [{ id: 'ALL', label: 'Todos' }, { id: 'HEALTH_EMERGENCY', label: '🚑 Salud' }, { id: 'SECURITY_DEFENSE', label: '👮 Coordinación' }, { id: 'PHARMACY_HEALTH', label: '💊 Farmacias' }, { id: 'FOOD_SUPPLY', label: '🛒 Alimentos' }, { id: 'SHELTER_EDUCATION', label: '🏫 Comunidad' }];
  return <header className="fixed inset-x-0 top-0 z-[1000] border-b border-amber-400/30 bg-slate-950/95 text-white shadow-2xl backdrop-blur-md">
    <div className="mx-auto flex max-w-7xl items-center gap-2 px-3 py-2 sm:px-4">
      <div className="flex shrink-0 items-center gap-2"><div className="rounded-xl bg-amber-400 p-2 text-slate-950"><BatteryWarning className="h-5 w-5" /></div><div><h1 className="text-sm font-black sm:text-base">Abarán · Apagón 72 h</h1><p className="hidden text-[10px] text-slate-400 sm:block">Recursos públicos y aprendizaje de autoprotección</p></div></div>
      <div ref={container} className="relative mx-1 min-w-0 flex-1"><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={query} onChange={e => setQuery(e.target.value)} onFocus={() => setFocused(true)} placeholder="Buscar recurso…" className="w-full rounded-xl border border-slate-700 bg-slate-900 py-1.5 pl-9 pr-7 text-xs outline-none focus:border-amber-400" />{query && <button onClick={() => setQuery('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400"><X className="h-3.5 w-3.5" /></button>}{focused && results.length > 0 && <div className="absolute left-0 right-0 top-full mt-1 overflow-hidden rounded-xl border border-slate-700 bg-slate-900 shadow-2xl">{results.map(item => <button key={item.id} onClick={() => { onSelectInfrastructure(item); setFocused(false); setQuery(''); }} className="block w-full border-b border-slate-800 px-3 py-2 text-left last:border-0 hover:bg-slate-800"><b className="text-xs">{item.name}</b><span className="block text-[10px] text-slate-400">{item.address}</span></button>)}</div>}</div>
      <button onClick={onOpenGuide} className="rounded-xl bg-amber-400 px-2.5 py-1.5 text-xs font-black text-slate-950"><span className="hidden sm:inline">Guía </span>72 h</button>
      <button onClick={onOpenMissionsModal} className="rounded-xl bg-indigo-600 px-2.5 py-1.5 text-xs font-black"><Trophy className="mr-1 inline h-3.5 w-3.5" />{playerStats.completedMissionIds.length}/{EDUCATIONAL_MISSIONS.length}</button>
      <button onClick={onToggleLegend} className={`rounded-xl p-1.5 ${isLegendOpen ? 'bg-slate-700 text-white' : 'bg-slate-900 text-slate-300'}`}><Layers className="h-4 w-4" /></button>
    </div>
    <div className="flex gap-1.5 overflow-x-auto border-t border-slate-800 px-3 py-1.5 sm:px-4">{filters.map(filter => <button key={filter.id} onClick={() => onQuickFilterCategory(filter.id)} className={`whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-bold ${filter.id === 'ALL' ? selectedCategories.size > 5 ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-300' : selectedCategories.size === 1 && selectedCategories.has(filter.id) ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-300'}`}>{filter.label}</button>)}</div>
  </header>;
};
