/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useCallback } from 'react';
import { CATEGORIES_META } from './data/abaranData';
import { BLACKOUT_RESOURCES, BLACKOUT_GUIDE, MUNICIPAL_BLACKOUT_MEASURES, BLACKOUT_SOURCES } from './data/blackoutData';
import { CategoryId, CriticalityLevel, InfrastructureItem } from './types/infrastructure';
import { Mission, PlayerStats } from './types/game';
import { EDUCATIONAL_MISSIONS, PLAYER_RANKS } from './data/missionsData';
import { FENIX_INTRO, FENIX_TASKS } from './data/operationFenix';
import { Header } from './components/Header';
import { MapComponent } from './components/MapComponent';
import { LegendPanel } from './components/LegendPanel';
import { InfrastructureDetailDrawer } from './components/InfrastructureDetailDrawer';
import { GameQuestModal } from './components/GameQuestModal';
import { FenixGamePanel } from './components/FenixGamePanel';
import { Sparkles, Play, X, BatteryWarning } from 'lucide-react';

export default function App() {
  // Filters & Layers State (OpenStreetMap by default, and Satellite as alternative)
  const [selectedCategories, setSelectedCategories] = useState<Set<CategoryId>>(
    () => new Set(Object.keys(CATEGORIES_META) as CategoryId[])
  );
  const [selectedCriticality, setSelectedCriticality] = useState<Set<CriticalityLevel>>(
    () => new Set(['CRITICAL_1', 'HIGH_2', 'MEDIUM_3'])
  );
  const [showSafetyRadius, setShowSafetyRadius] = useState(false);
  const [activeBaseMap, setActiveBaseMap] = useState<'osm' | 'satellite'>('osm');

  // Gamification Player Stats (1º ESO Mode)
  const [playerStats, setPlayerStats] = useState<PlayerStats>({
    xp: 40,
    level: 1,
    levelTitle: 'Cadete de Protección Civil',
    discoveredIds: [],
    completedMissionIds: [],
    badges: ['🌱 Explorador de Abarán'],
  });
  const [celebrationMessage, setCelebrationMessage] = useState<string | null>(null);

  // Inspection & Modals State
  const [selectedInfrastructure, setSelectedInfrastructure] = useState<InfrastructureItem | null>(null);
  const [isMissionsModalOpen, setIsMissionsModalOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isLegendOpen, setIsLegendOpen] = useState(true);
  const [cursorCoordinates, setCursorCoordinates] = useState<{ lat: number; lng: number } | null>(null);

  // Juego guiado "Operación Fénix" (apagón 72h)
  const [isFenixGameOpen, setIsFenixGameOpen] = useState(false);
  const [fenixEmergencyFilter, setFenixEmergencyFilter] = useState(false);

  // Trigger celebration popup
  const showCelebration = (msg: string) => {
    setCelebrationMessage(msg);
    setTimeout(() => {
      setCelebrationMessage(null);
    }, 3500);
  };

  // Toggle Category
  const handleToggleCategory = (catId: CategoryId) => {
    setSelectedCategories(prev => {
      const next = new Set(prev);
      if (next.has(catId)) {
        next.delete(catId);
      } else {
        next.add(catId);
      }
      return next;
    });
  };

  const handleSelectAllCategories = () => {
    setSelectedCategories(new Set(Object.keys(CATEGORIES_META) as CategoryId[]));
  };

  const handleDeselectAllCategories = () => {
    setSelectedCategories(new Set());
  };

  // Toggle Criticality
  const handleToggleCriticality = (level: CriticalityLevel) => {
    setSelectedCriticality(prev => {
      const next = new Set(prev);
      if (next.has(level)) {
        if (next.size > 1) next.delete(level);
      } else {
        next.add(level);
      }
      return next;
    });
  };

  // Quick category filter from topbar
  const handleQuickFilterCategory = (catId: CategoryId | 'ALL') => {
    if (catId === 'ALL') {
      handleSelectAllCategories();
    } else {
      setSelectedCategories(new Set([catId]));
    }
  };

  // Switch Base Map (only OSM and Satellite)
  const handleChangeBaseMap = (newMap: 'osm' | 'satellite') => {
    setActiveBaseMap(newMap);
    if (newMap === 'satellite' && !playerStats.completedMissionIds.includes('m2-satellite')) {
      // Award XP for astronaut vision mission
      setPlayerStats(prev => ({
        ...prev,
        xp: prev.xp + 30,
        completedMissionIds: [...prev.completedMissionIds, 'm2-satellite'],
        badges: [...prev.badges, '🛰️ Explorador Espacial'],
      }));
      showCelebration('🛰️ ¡Misión completada: "Visión de Astronauta"! (+30 XP)');
    }
  };


  // Select Infrastructure & Gamified Discovery
  const handleSelectInfrastructure = useCallback((item: InfrastructureItem | null) => {
    setSelectedInfrastructure(item);
    if (!item) return;

    // Award discovery XP
    if (!playerStats.discoveredIds.includes(item.id)) {
      const newXp = playerStats.xp + 15;
      const matchingRank = PLAYER_RANKS.slice().reverse().find(r => newXp >= r.minXp) || PLAYER_RANKS[0];

      setPlayerStats(prev => ({
        ...prev,
        xp: newXp,
        level: matchingRank.level,
        levelTitle: matchingRank.title,
        discoveredIds: [...prev.discoveredIds, item.id],
      }));
      showCelebration(`✨ ¡Nuevo lugar descubierto: ${item.name}! (+15 XP)`);
    }

    // Juego guiado Operación Fénix: completar tarea si el elemento es objetivo de la tarea actual
    const currentTask = FENIX_TASKS.find((t) => !playerStats.completedMissionIds.includes(`fenix-${t.id}`));
    if (currentTask && fenixEmergencyFilter) {
      const targetCategories = currentTask.targetCategories as CategoryId[];
      if (targetCategories.includes(item.category as CategoryId)) {
        const taskId = `fenix-${currentTask.id}`;
        if (!playerStats.completedMissionIds.includes(taskId)) {
          setPlayerStats(prev => ({
            ...prev,
            xp: prev.xp + currentTask.xp,
            completedMissionIds: [...prev.completedMissionIds, taskId],
            badges: [...prev.badges, `${currentTask.badgeIcon} ${currentTask.badge}`],
          }));
          showCelebration(`🎯 ¡Tarea "${currentTask.title}" cumplida! (+${currentTask.xp} XP)`);
        }
      }
    }

    // Check target mission completion (original educational missions)
    const matchedMission = EDUCATIONAL_MISSIONS.find(m => m.targetInfraId === item.id && !playerStats.completedMissionIds.includes(m.id));
    if (matchedMission && !matchedMission.question) {
      setPlayerStats(prev => ({
        ...prev,
        xp: prev.xp + matchedMission.xpReward,
        completedMissionIds: [...prev.completedMissionIds, matchedMission.id],
        badges: [...prev.badges, `${matchedMission.badgeIcon} ${matchedMission.badgeName}`],
      }));
      showCelebration(`🏆 ¡Misión "${matchedMission.title}" completada! (+${matchedMission.xpReward} XP)`);
    }
  }, [playerStats, fenixEmergencyFilter]);

  // Answer Quiz Mission
  const handleAnswerQuestion = (missionId: string, isCorrect: boolean, xp: number) => {
    if (!isCorrect) return;
    const mission = EDUCATIONAL_MISSIONS.find(m => m.id === missionId);
    if (!mission) return;

    if (!playerStats.completedMissionIds.includes(missionId)) {
      setPlayerStats(prev => ({
        ...prev,
        xp: prev.xp + xp,
        completedMissionIds: [...prev.completedMissionIds, missionId],
        badges: [...prev.badges, `${mission.badgeIcon} ${mission.badgeName}`],
      }));
      showCelebration(`🌟 ¡Respuesta correcta! Ganaste +${xp} XP y medalla ${mission.badgeName}`);
    }
  };

  // Filtered infrastructures
  const filteredInfrastructures = useMemo(() => {
    let list = BLACKOUT_RESOURCES.filter(item => {
      const matchesCat = selectedCategories.has(item.category);
      const matchesCrit = selectedCriticality.has(item.criticality);
      return matchesCat && matchesCrit;
    });

    // Juego Operación Fénix: filtro de emergencia — solo categorías del apagón
    if (fenixEmergencyFilter) {
      const allCats = Object.keys(CATEGORIES_META) as CategoryId[];
      const emergencyCats = new Set(allCats.filter(c => FENIX_TASKS.some(t => t.targetCategories.includes(c))));
      list = list.filter(item => emergencyCats.has(item.category as CategoryId));
    }

    return list;
  }, [selectedCategories, selectedCriticality, fenixEmergencyFilter]);

  // Counts by category
  const categoryCounts = useMemo(() => {
    const counts: Record<CategoryId, number> = {} as any;
    (Object.keys(CATEGORIES_META) as CategoryId[]).forEach(id => {
      counts[id] = 0;
    });
    BLACKOUT_RESOURCES.forEach(item => {
      if (counts[item.category] !== undefined) {
        counts[item.category]++;
      }
    });
    return counts;
  }, []);

  return (
    <div className="flex flex-col w-screen h-screen overflow-hidden bg-slate-950 font-sans select-none">
      {/* Top Gamified Navigation & Live Search */}
      <Header
        infrastructures={BLACKOUT_RESOURCES}
        onSelectInfrastructure={handleSelectInfrastructure}
        isLegendOpen={isLegendOpen}
        onToggleLegend={() => setIsLegendOpen(!isLegendOpen)}
        selectedCategories={selectedCategories}
        onQuickFilterCategory={handleQuickFilterCategory}
        playerStats={playerStats}
        onOpenMissionsModal={() => setIsMissionsModalOpen(true)}
        onOpenGuide={() => setIsGuideOpen(true)}
      />

      {/* Floating Gamification Toast Celebration */}
      {celebrationMessage && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[1400] bg-gradient-to-r from-amber-400 via-yellow-300 to-orange-400 text-slate-950 px-5 py-2.5 rounded-full font-black text-xs sm:text-sm shadow-2xl border-2 border-white flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4 fill-slate-950" />
          <span>{celebrationMessage}</span>
        </div>
      )}

      {/* Main Fullscreen GIS Map */}
      <main className="flex-1 w-full relative min-h-0 overflow-hidden pt-20">
        <MapComponent
          infrastructures={filteredInfrastructures}
          selectedInfrastructure={selectedInfrastructure}
          onSelectInfrastructure={handleSelectInfrastructure}
          riskZones={[]}
          evacuationRoutes={[]}
          showRiskZones={false}
          showEvacuationRoutes={false}
          showSafetyRadius={showSafetyRadius}
          activeBaseMap={activeBaseMap}
          onChangeBaseMap={handleChangeBaseMap}
          activeScenario={null}
          cursorCoordinates={cursorCoordinates}
          onUpdateCoordinates={setCursorCoordinates}
        />

        {/* Botón flotante para abrir Operación Fénix */}
        <button
          type="button"
          onClick={() => {
            setFenixEmergencyFilter(true);
            setIsFenixGameOpen(true);
          }}
          className="fixed bottom-4 right-4 z-[1100] w-14 h-14 rounded-full bg-gradient-to-br from-orange-400 to-red-500 hover:from-orange-300 hover:to-red-400 text-white font-black shadow-2xl shadow-orange-200 flex items-center justify-center gap-2 transition-transform animate-wiggle active:scale-95 border-2 border-white"
          title="Abrir misión Operación Fénix (apagón 72h)"
        >
          <Play className="w-5 h-5" />
          <span className="hidden sm:inline text-[10px] font-black leading-none">FÉNIX</span>
        </button>
      </main>

      {/* Interactive Legend Panel with Multi-Tabs */}
      <LegendPanel
        selectedCategories={selectedCategories}
        onToggleCategory={handleToggleCategory}
        onSelectAllCategories={handleSelectAllCategories}
        onDeselectAllCategories={handleDeselectAllCategories}
        selectedCriticality={selectedCriticality}
        onToggleCriticality={handleToggleCriticality}
        showRiskZones={false}
        onToggleRiskZones={() => undefined}
        showEvacuationRoutes={false}
        onToggleEvacuationRoutes={() => undefined}
        showSafetyRadius={showSafetyRadius}
        onToggleSafetyRadius={() => setShowSafetyRadius(!showSafetyRadius)}
        activeBaseMap={activeBaseMap}
        onChangeBaseMap={(b) => handleChangeBaseMap(b as 'osm' | 'satellite')}
        categoryCounts={categoryCounts}
        totalInfrastructures={filteredInfrastructures.length}
        isOpen={isLegendOpen}
        onToggleOpen={() => setIsLegendOpen(!isLegendOpen)}
      />

      {/* Detailed Facility Inspection Drawer */}
      <InfrastructureDetailDrawer
        item={selectedInfrastructure}
        onClose={() => setSelectedInfrastructure(null)}
        onFocusOnMap={(item) => setSelectedInfrastructure(item)}
        activeScenario={null}
      />

      {/* 1º ESO Educational Missions Modal */}
      <GameQuestModal
        isOpen={isMissionsModalOpen}
        onClose={() => setIsMissionsModalOpen(false)}
        stats={playerStats}
        onSelectMission={(mission) => {
          if (mission.targetInfraId) {
            const item = BLACKOUT_RESOURCES.find(i => i.id === mission.targetInfraId);
            if (item) handleSelectInfrastructure(item);
          } else if (mission.targetAction === 'satellite_mode') {
            handleChangeBaseMap('satellite');
          }
        }}
        onAnswerQuestion={handleAnswerQuestion}
        infrastructures={BLACKOUT_RESOURCES}
      />

      {/* Juego guiado Operación Fénix */}
      <FenixGamePanel
        isOpen={isFenixGameOpen}
        onClose={() => {
          setIsFenixGameOpen(false);
          setFenixEmergencyFilter(false);
          setSelectedInfrastructure(null);
        }}
        stats={playerStats}
        infrastructures={BLACKOUT_RESOURCES}
        onSelectInfrastructure={handleSelectInfrastructure}
        onGiveXp={(xp, badge) => {
          setPlayerStats(prev => ({ ...prev, xp: prev.xp + xp, badges: [...prev.badges, badge] }));
          showCelebration(`+${xp} XP — ${badge}`);
        }}
        onFocusOnMap={(item) => setSelectedInfrastructure(item)}
      />

      {isGuideOpen && (
        <div className="fixed inset-0 z-[1500] flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-sm">
          <section className="max-h-[calc(100vh-2rem)] w-full max-w-2xl overflow-y-auto rounded-3xl border border-amber-400/40 bg-slate-900 p-5 text-white shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-slate-700 pb-4">
              <div><p className="text-xs font-black tracking-[0.18em] text-amber-300">APAGÓN DE 72 HORAS</p><h2 className="mt-1 text-xl font-black">Plan familiar básico</h2></div>
              <button onClick={() => setIsGuideOpen(false)} className="rounded-xl p-2 text-slate-400 hover:bg-slate-800 hover:text-white" aria-label="Cerrar guía"><X className="h-5 w-5" /></button>
            </div>
            <p className="mt-4 rounded-2xl border border-amber-400/20 bg-amber-400/10 p-3 text-sm text-amber-100"><BatteryWarning className="mr-2 inline h-4 w-4" />Esta guía es educativa. Ante peligro inmediato o urgencia sanitaria, llama al 112.</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">{BLACKOUT_GUIDE.map((tip) => <article key={tip.title} className="rounded-2xl border border-slate-700 bg-slate-950/50 p-3"><h3 className="font-bold text-amber-200">{tip.icon} {tip.title}</h3><p className="mt-1 text-sm leading-relaxed text-slate-300">{tip.text}</p></article>)}</div>
            <div className="mt-5 border-t border-slate-700 pt-4"><h3 className="font-black text-amber-200">Medidas municipales previstas ante fallo eléctrico</h3><p className="mt-1 text-xs text-slate-400">Resumen educativo de la Adenda al PEMU; en una emergencia, las instrucciones vigentes son siempre las que comuniquen las autoridades.</p><div className="mt-3 grid gap-3 sm:grid-cols-2">{MUNICIPAL_BLACKOUT_MEASURES.map((measure) => <article key={measure.title} className="rounded-2xl border border-indigo-400/25 bg-indigo-950/30 p-3"><h4 className="font-bold text-indigo-100">{measure.icon} {measure.title}</h4><p className="mt-1 text-sm leading-relaxed text-slate-300">{measure.text}</p></article>)}</div><p className="mt-4 text-[11px] text-slate-400">Fuentes: <a className="text-amber-300 underline" href={BLACKOUT_SOURCES.municipal} target="_blank" rel="noreferrer">Adenda al PEMU de Abarán</a> · <a className="text-amber-300 underline" href={BLACKOUT_SOURCES.preparedness} target="_blank" rel="noreferrer">kit de 72 h de Protección Civil</a> · <a className="text-amber-300 underline" href={BLACKOUT_SOURCES.electricalSafety} target="_blank" rel="noreferrer">seguridad eléctrica</a>.</p></div>
            <div className="sticky bottom-0 -mx-5 -mb-5 mt-5 border-t border-slate-700 bg-slate-900/95 px-5 py-3 backdrop-blur"><button type="button" onClick={() => setIsGuideOpen(false)} className="w-full rounded-xl bg-amber-400 py-2.5 text-sm font-black text-slate-950 hover:bg-amber-300">Cerrar guía y volver al mapa</button></div>
          </section>
        </div>
      )}
    </div>
  );
}
