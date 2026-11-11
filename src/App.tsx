/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useCallback } from 'react';
import { 
  ABARAN_INFRASTRUCTURES, 
  ABARAN_RISK_ZONES, 
  ABARAN_EVACUATION_ROUTES,
  CATEGORIES_META,
  EMERGENCY_SCENARIOS
} from './data/abaranData';
import { 
  CategoryId, 
  CriticalityLevel, 
  EmergencyScenario, 
  InfrastructureItem 
} from './types/infrastructure';
import { Mission, PlayerStats } from './types/game';
import { EDUCATIONAL_MISSIONS, PLAYER_RANKS } from './data/missionsData';
import { FENIX_INTRO, FENIX_TASKS } from './data/operationFenix';
import { Header } from './components/Header';
import { MapComponent } from './components/MapComponent';
import { LegendPanel } from './components/LegendPanel';
import { InfrastructureDetailDrawer } from './components/InfrastructureDetailDrawer';
import { SimulationModal } from './components/SimulationModal';
import { ExportReportModal } from './components/ExportReportModal';
import { GameQuestModal } from './components/GameQuestModal';
import { FenixGamePanel } from './components/FenixGamePanel';
import { DistanceRuler } from './components/DistanceRuler';
import { RotateCcw, Sparkles, Play, AlertCircle } from 'lucide-react';

export default function App() {
  // Filters & Layers State (OpenStreetMap by default, and Satellite as alternative)
  const [selectedCategories, setSelectedCategories] = useState<Set<CategoryId>>(
    () => new Set(Object.keys(CATEGORIES_META) as CategoryId[])
  );
  const [selectedCriticality, setSelectedCriticality] = useState<Set<CriticalityLevel>>(
    () => new Set(['CRITICAL_1', 'HIGH_2', 'MEDIUM_3'])
  );
  const [showRiskZones, setShowRiskZones] = useState(true);
  const [showEvacuationRoutes, setShowEvacuationRoutes] = useState(true);
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
  const [activeScenario, setActiveScenario] = useState<EmergencyScenario | null>(null);
  const [isSimulationModalOpen, setIsSimulationModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isMissionsModalOpen, setIsMissionsModalOpen] = useState(false);
  const [isLegendOpen, setIsLegendOpen] = useState(true);
  const [cursorCoordinates, setCursorCoordinates] = useState<{ lat: number; lng: number } | null>(null);

  // Medidor de distancias (fichas F04 y F06)
  const [measurementPoints, setMeasurementPoints] = useState<{ lat: number; lng: number; label: 'A' | 'B' }[]>(
    []
  );
  const [isMeasuring, setIsMeasuring] = useState(false);

  const handleMapClick = (coords: { lat: number; lng: number }) => {
    if (!isMeasuring) return;
    if (measurementPoints.length >= 2) {
      setMeasurementPoints([]);
    }
    setMeasurementPoints((prev) => [
      ...prev,
      { lat: coords.lat, lng: coords.lng, label: prev.length === 0 ? 'A' : 'B' },
    ]);
  };

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

  // Toggle Flood Zones
  const handleToggleRiskZones = () => {
    const nextVal = !showRiskZones;
    setShowRiskZones(nextVal);
    if (nextVal && !playerStats.completedMissionIds.includes('m4-rio-inundacion')) {
      setPlayerStats(prev => ({
        ...prev,
        xp: prev.xp + 40,
        completedMissionIds: [...prev.completedMissionIds, 'm4-rio-inundacion'],
        badges: [...prev.badges, '🌊 Vigilante de Riadas'],
      }));
      showCelebration('🌊 ¡Misión completada: "¡Cuidado con la DANA!"! (+40 XP)');
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
    let list = ABARAN_INFRASTRUCTURES.filter(item => {
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
    ABARAN_INFRASTRUCTURES.forEach(item => {
      if (counts[item.category] !== undefined) {
        counts[item.category]++;
      }
    });
    return counts;
  }, []);

  // Scenario activation
  const handleActivateScenario = (scenario: EmergencyScenario) => {
    setActiveScenario(scenario);
    const affected = ABARAN_INFRASTRUCTURES.filter(i => scenario.affectedInfrasIds.includes(i.id));
    const neededCategories = new Set(selectedCategories);
    affected.forEach(a => neededCategories.add(a.category));
    setSelectedCategories(neededCategories);

    setShowRiskZones(true);
    if (scenario.evacuationRouteId) {
      setShowEvacuationRoutes(true);
    }

    if (affected.length > 0) {
      setSelectedInfrastructure(affected[0]);
    }
  };

  const handleDeactivateScenario = () => {
    setActiveScenario(null);
  };

  const handleFocusAffectedInfrastructure = (infraId: string) => {
    const item = ABARAN_INFRASTRUCTURES.find(i => i.id === infraId);
    if (item) {
      setSelectedInfrastructure(item);
    }
  };

  return (
    <div className="flex flex-col w-screen h-screen overflow-hidden bg-slate-950 font-sans select-none">
      {/* Top Gamified Navigation & Live Search */}
      <Header
        infrastructures={ABARAN_INFRASTRUCTURES}
        onSelectInfrastructure={handleSelectInfrastructure}
        onOpenSimulationModal={() => setIsSimulationModalOpen(true)}
        onOpenReportModal={() => setIsReportModalOpen(true)}
        activeScenario={activeScenario}
        onDeactivateScenario={handleDeactivateScenario}
        isLegendOpen={isLegendOpen}
        onToggleLegend={() => setIsLegendOpen(!isLegendOpen)}
        selectedCategories={selectedCategories}
        onQuickFilterCategory={handleQuickFilterCategory}
        playerStats={playerStats}
        onOpenMissionsModal={() => setIsMissionsModalOpen(true)}
      />

      {/* Floating Gamification Toast Celebration */}
      {celebrationMessage && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[1400] bg-gradient-to-r from-amber-400 via-yellow-300 to-orange-400 text-slate-950 px-5 py-2.5 rounded-full font-black text-xs sm:text-sm shadow-2xl border-2 border-white flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4 fill-slate-950" />
          <span>{celebrationMessage}</span>
        </div>
      )}

      {/* Active Emergency Alert Bar (if simulation running) */}
      {activeScenario && (
        <div className="fixed top-20 left-0 right-0 z-[950] bg-red-600 text-white px-4 py-2 shadow-lg flex items-center justify-between text-xs animate-in slide-in-from-top duration-200">
          <div className="flex items-center gap-2 max-w-4xl mx-auto w-full">
            <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
            <span className="font-extrabold uppercase tracking-wider">
              {activeScenario.badge}:
            </span>
            <span className="font-medium truncate">{activeScenario.title}</span>
            <span className="hidden md:inline text-red-100 font-light truncate">
              — {activeScenario.recommendedActions[0]}
            </span>
          </div>
          <button
            type="button"
            onClick={handleDeactivateScenario}
            className="px-2.5 py-1 rounded bg-red-800 hover:bg-red-900 text-white font-bold text-[11px] flex items-center gap-1 transition-colors flex-shrink-0"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden sm:inline">Finalizar</span>
          </button>
        </div>
      )}

      {/* Main Fullscreen GIS Map */}
      <main className="flex-1 w-full relative min-h-0 overflow-hidden pt-20">
        <MapComponent
          infrastructures={filteredInfrastructures}
          selectedInfrastructure={selectedInfrastructure}
          onSelectInfrastructure={handleSelectInfrastructure}
          riskZones={ABARAN_RISK_ZONES}
          evacuationRoutes={ABARAN_EVACUATION_ROUTES}
          showRiskZones={showRiskZones}
          showEvacuationRoutes={showEvacuationRoutes}
          showSafetyRadius={showSafetyRadius}
          activeBaseMap={activeBaseMap}
          onChangeBaseMap={handleChangeBaseMap}
          activeScenario={activeScenario}
          cursorCoordinates={cursorCoordinates}
          onUpdateCoordinates={setCursorCoordinates}
          onMapClick={handleMapClick}
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
        showRiskZones={showRiskZones}
        onToggleRiskZones={handleToggleRiskZones}
        showEvacuationRoutes={showEvacuationRoutes}
        onToggleEvacuationRoutes={() => setShowEvacuationRoutes(!showEvacuationRoutes)}
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
        onSimulateImpact={(item) => {
          const matchingScenario = EMERGENCY_SCENARIOS.find((s: EmergencyScenario) => s.affectedInfrasIds.includes(item.id));
          if (matchingScenario) {
            handleActivateScenario(matchingScenario);
          } else {
            setIsSimulationModalOpen(true);
          }
        }}
        activeScenario={activeScenario}
      />

      {/* 1º ESO Educational Missions Modal */}
      <GameQuestModal
        isOpen={isMissionsModalOpen}
        onClose={() => setIsMissionsModalOpen(false)}
        stats={playerStats}
        onSelectMission={(mission) => {
          if (mission.targetInfraId) {
            const item = ABARAN_INFRASTRUCTURES.find(i => i.id === mission.targetInfraId);
            if (item) handleSelectInfrastructure(item);
          } else if (mission.targetAction === 'satellite_mode') {
            handleChangeBaseMap('satellite');
          } else if (mission.targetAction === 'flood_zone') {
            setShowRiskZones(true);
          }
        }}
        onAnswerQuestion={handleAnswerQuestion}
        infrastructures={ABARAN_INFRASTRUCTURES}
      />

      {/* Emergency Scenarios Modal */}
      <SimulationModal
        isOpen={isSimulationModalOpen}
        onClose={() => setIsSimulationModalOpen(false)}
        activeScenario={activeScenario}
        onActivateScenario={handleActivateScenario}
        onDeactivateScenario={handleDeactivateScenario}
        onFocusAffectedInfrastructure={handleFocusAffectedInfrastructure}
      />

      {/* Dossier Report Modal */}
      <ExportReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        infrastructures={ABARAN_INFRASTRUCTURES}
        riskZones={ABARAN_RISK_ZONES}
        evacuationRoutes={ABARAN_EVACUATION_ROUTES}
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
        infrastructures={ABARAN_INFRASTRUCTURES}
        onSelectInfrastructure={handleSelectInfrastructure}
        onGiveXp={(xp, badge) => {
          setPlayerStats(prev => ({ ...prev, xp: prev.xp + xp, badges: [...prev.badges, badge] }));
          showCelebration(`+${xp} XP — ${badge}`);
        }}
        onFocusOnMap={(item) => setSelectedInfrastructure(item)}
      />

      {/* Medidor de distancias (fichas F04 y F06) */}
      <DistanceRuler
        points={measurementPoints}
        isMeasuring={isMeasuring}
        onToggle={() => setIsMeasuring((p) => !p)}
        onClear={() => setMeasurementPoints([])}
      />
    </div>
  );
}
