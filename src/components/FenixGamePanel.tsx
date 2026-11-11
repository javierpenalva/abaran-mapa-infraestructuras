/**
 * Operación Fénix — Panel de juego guiado (1º ESO).
 *
 * Interfaz de aventura infantil para descubrir los puntos críticos del apagón
 * paso a paso, alineada con el cuaderno "Abarán sin luz · 72 horas" (F02/F03).
 *
 * Flujo de cada tarea:
 *   1. Pista → 2. "Ir al mapa" (se filtra la categoría y se resalta el objetivo)
 *   3. Alumno localiza el elemento en el mapa → 4. Se valida descubrimiento
 *   5. Celebración (+XP + insignia) → 6. Siguiente tarea
 */

import React, { useState, useMemo } from 'react';
import {
  X, CheckCircle, MapPin, Target, Trophy, Sparkles, AlertCircle,
  Shield, Droplets, ShoppingCart, School, Home, Play, ArrowRight, Star,
} from 'lucide-react';
import { InfrastructureItem, CategoryId } from '../types/infrastructure';
import { PlayerStats } from '../types/game';
import {
  FENIX_INTRO, FENIX_TASKS, FENIX_TOTAL_XP, FENIX_EMERGENCY_CATEGORIES,
  FenixTask,
} from '../data/operationFenix';
import { haversineMeters, formatMeters, walkMinutes } from '../lib/geo';

interface FenixGamePanelProps {
  isOpen: boolean;
  onClose: () => void;
  stats: PlayerStats;
  infrastructures: InfrastructureItem[];
  onSelectInfrastructure: (item: InfrastructureItem) => void;
  onGiveXp: (xp: number, badge: string) => void;
  onFocusOnMap: (item: InfrastructureItem) => void;
}

const CATEGORY_ICON: Record<CategoryId, string> = {
  WATER_HYDRAULIC: '💧',
  HEALTH_EMERGENCY: '🏥',
  PHARMACY_HEALTH: '💊',
  SECURITY_DEFENSE: '🚔',
  FOOD_SUPPLY: '🛒',
  ENERGY_POWER: '⚡',
  TRANSPORT_LOGISTICS: '🚉',
  TELECOM_EARLY_WARNING: '📡',
  SHELTER_EDUCATION: '🏕️',
  HAZMAT_INDUSTRY: '☢️',
};

const CATEGORY_NAME: Record<CategoryId, string> = {
  WATER_HYDRAULIC: 'Agua potable',
  HEALTH_EMERGENCY: 'Atención médica',
  PHARMACY_HEALTH: 'Farmacias',
  SECURITY_DEFENSE: 'Autoridades y seguridad',
  FOOD_SUPPLY: 'Alimentación',
  ENERGY_POWER: 'Energía',
  TRANSPORT_LOGISTICS: 'Transporte',
  TELECOM_EARLY_WARNING: 'Telecomunicaciones y alerta',
  SHELTER_EDUCATION: 'Albergues y centros educativos',
  HAZMAT_INDUSTRY: 'Riesgo químico',
};

const ICON_BY_CATEGORY: Record<CategoryId, typeof Star> = {
  WATER_HYDRAULIC: Droplets,
  HEALTH_EMERGENCY: School,
  PHARMACY_HEALTH: ShoppingCart,
  SECURITY_DEFENSE: Shield,
  FOOD_SUPPLY: ShoppingCart,
  ENERGY_POWER: AlertCircle,
  TRANSPORT_LOGISTICS: Home,
  TELECOM_EARLY_WARNING: MapPin,
  SHELTER_EDUCATION: Home,
  HAZMAT_INDUSTRY: AlertCircle,
};

export const FenixGamePanel: React.FC<FenixGamePanelProps> = ({
  isOpen,
  onClose,
  stats,
  infrastructures,
  onSelectInfrastructure,
  onGiveXp,
  onFocusOnMap,
}) => {
  if (!isOpen) return null;

  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completedTaskIds, setCompletedTaskIds] = useState<Set<string>>(
    new Set(stats.completedMissionIds.filter((id) => id.startsWith('fenix-')))
  );
  const [showCelebration, setShowCelebration] = useState<FenixTask | null>(null);
  const [focusedItemId, setFocusedItemId] = useState<string | null>(null);

  const currentTask = FENIX_TASKS[currentIndex];
  const allDone = completedTaskIds.size >= FENIX_TASKS.length;
  const progressPercent = Math.round((completedTaskIds.size / FENIX_TASKS.length) * 100);

  // Elementos del mapa que coinciden con la categoría de la tarea actual
  const matchingTargets = useMemo(() => {
    if (!currentTask) return [];
    return infrastructures.filter((i) =>
      currentTask.targetCategories.includes(i.category as CategoryId)
    );
  }, [infrastructures, currentTask]);

  const isTargetDiscovered = (item: InfrastructureItem) =>
    stats.discoveredIds.includes(item.id);

  const handleStart = () => {
    setStarted(true);
  };

  const handleGoToMap = () => {
    // Filtrar solo las categorías de esta tarea y resaltar el primero disponible
    const targetCats = currentTask.targetCategories as CategoryId[];
    onSelectInfrastructure(matchingTargets[0] || null);
    setFocusedItemId(matchingTargets[0]?.id || null);
  };

  const handleCompleteTask = (task: FenixTask) => {
    setCompletedTaskIds((prev) => {
      const next = new Set(prev);
      next.add(task.id);
      return next;
    });
    setShowCelebration(task);
    setShowCelebration(null); // se gestiona el toast fuera si se quiere; aquí solo estado
    // Avanzar a la siguiente tarea tras un breve respiro (el celebration toast lo hace App)
    setTimeout(() => {
      if (currentIndex < FENIX_TASKS.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setFocusedItemId(null);
      }
    }, 700);
  };

  const handleClose = () => {
    onClose();
  };

  const badgeIcon = currentTask ? currentTask.badgeIcon : '🎖️';

  return (
    <div className="fixed inset-0 z-[1250] flex items-center justify-center bg-amber-50/40 backdrop-blur-sm">
      {/* Pantalla de inicio */}
      {!started && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl border-4 border-amber-300 animate-pop-in text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-r from-orange-400 via-amber-200 to-yellow-300" />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-800 font-black text-xs mb-4 animate-bounce">
              <Star className="w-4 h-4 fill-amber-500" /> ¡MISIÓN EMPEZANDO!
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-amber-800 mb-2 tracking-tight">
              OPERACIÓN FÉNIX
            </h1>
            <h2 className="text-xl sm:text-2xl font-bold text-orange-700 mb-4">
              Abarán sin luz · 72 horas
            </h2>
            <p className="text-slate-700 text-sm sm:text-base leading-relaxed mb-6">
              {FENIX_INTRO.scenario}
            </p>
            <div className="bg-slate-100 rounded-2xl p-4 mb-6 border border-slate-200 text-left">
              <div className="flex items-center gap-3 mb-3">
                <AlertCircle className="w-5 h-5 text-orange-500" />
                <span className="font-bold text-slate-800 text-sm">{FENIX_INTRO.filterPrompt}</span>
              </div>
              <p className="text-xs text-slate-600">
                Activa el <strong>FILTRO DE EMERGENCIA</strong> para ver los 5 puntos críticos del apagón.
              </p>
            </div>
            <button
              type="button"
              onClick={handleStart}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-400 hover:from-orange-300 hover:via-amber-200 hover:to-yellow-300 text-slate-900 font-black text-lg shadow-lg shadow-orange-200 transition-transform active:scale-95 flex items-center justify-center gap-2"
            >
              <Play className="w-6 h-6 fill-slate-900" /> ¡Comenzar misión!
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="mt-3 text-slate-400 hover:text-slate-700 font-bold text-xs tracking-wide uppercase"
            >
              Volver al mapa
            </button>
          </div>
        </div>
      )}

      {/* Panel de juego en curso */}
      {started && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 max-w-md w-[420px] shadow-2xl border-4 border-amber-300 animate-pop-in flex flex-col">
          {/* Barra superior */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center text-xl shadow-md">
                {badgeIcon}
              </div>
              <div>
                <div className="font-black text-amber-800 text-xs uppercase tracking-wider">
                  Nivel {stats.level} — {stats.levelTitle}
                </div>
                <div className="text-slate-500 text-xs">{stats.xp} XP de explorador</div>
              </div>
            </div>
            <button
              type="button"
              onClick={handleClose}
              className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Progreso */}
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs font-bold text-amber-700 mb-1">
              <span>Progreso de la misión</span>
              <span>{completedTaskIds.size} / {FENIX_TASKS.length}</span>
            </div>
            <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden border border-slate-300">
              <div
                className="h-full bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-300 transition-all duration-700 shadow-sm"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="text-[10px] text-slate-500 mt-1 text-center uppercase tracking-wider font-bold">
              {allDone ? '¡MISIÓN CUMPLIDA!' : 'Tareas pendientes'}
            </div>
          </div>

          {/* Tarea actual */}
          <div className="flex-1 overflow-y-auto pr-2">
            <div className="flex items-center justify-between mb-2">
              <span className="font-extrabold text-xs uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Target className="w-3 h-3 text-amber-400" /> Tarea actual
              </span>
              <span className="px-2 py-0.5 rounded text-[9px] font-black bg-amber-100 text-amber-700 border border-amber-200">
                {currentIndex + 1} de {FENIX_TASKS.length}
              </span>
            </div>

            {currentTask && (
              <div className="bg-gradient-to-b from-amber-50 to-white rounded-2xl p-4 border-2 border-amber-200 shadow-inner mb-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-2 opacity-20 text-4xl">{currentTask.icon}</div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center text-xl flex-shrink-0">
                    {currentTask.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-extrabold text-orange-800 text-sm sm:text-base mb-1 leading-snug">
                      {currentTask.title}
                    </h3>
                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                      {currentTask.whatToFind}
                    </p>
                    <div className="mt-3 pt-2 border-t border-amber-100">
                      <div className="flex items-center gap-2 text-xs mb-1">
                        <MapPin className="w-3 h-3 text-amber-500" />
                        <span className="font-bold text-slate-700">Pista:</span>
                      </div>
                      <p className="text-slate-500 text-xs italic">
                        "{currentTask.hint}"
                      </p>
                      <div className="mt-2 pt-2 border-t border-amber-50">
                        <div className="text-[10px] font-bold text-amber-600 uppercase tracking-wider mb-1">
                          Dato de la misión
                        </div>
                        <p className="text-slate-600 text-xs">{currentTask.fact}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    disabled={completedTaskIds.has(currentTask.id)}
                    onClick={handleGoToMap}
                    className={`flex-1 py-3 rounded-xl text-xs sm:text-sm font-black shadow transition-all ${
                      completedTaskIds.has(currentTask.id)
                        ? 'bg-slate-200 text-slate-400 border border-slate-300'
                        : 'bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-400 text-slate-900 shadow-orange-200 hover:from-orange-300 hover:via-amber-200 hover:to-yellow-300 active:scale-95'
                    } flex items-center justify-center gap-2`}
                  >
                    {completedTaskIds.has(currentTask.id) ? (
                      <><CheckCircle className="w-4 h-4" /> Hecha</>
                    ) : (
                      <><MapPin className="w-4 h-4 fill-slate-900" /> Ir al mapa</>
                    )}
                  </button>
                  {completedTaskIds.has(currentTask.id) && (
                    <button
                      type="button"
                      onClick={() => {
                        if (currentIndex < FENIX_TASKS.length - 1) {
                          setCurrentIndex((i) => i + 1);
                          setFocusedItemId(null);
                        }
                      }}
                      className="px-3 py-3 rounded-xl text-xs sm:text-sm font-black text-white bg-indigo-500 hover:bg-indigo-600 shadow transition-transform active:scale-95 flex items-center justify-center gap-2"
                    >
                      <ArrowRight className="w-4 h-4" /> Siguiente
                    </button>
                  )}
                </div>
              </div>
            )}

            {allDone && (
              <div className="bg-gradient-to-b from-emerald-50 to-white rounded-2xl p-4 border-2 border-emerald-200 shadow-inner text-center animate-bounce">
                <div className="text-4xl mb-2">🎉</div>
                <h3 className="font-extrabold text-emerald-800 text-sm sm:text-base mb-2">¡MISIÓN CUMPLIDA!</h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-3">
                  Has localizado los 5 puntos críticos de Abarán para el apagón.
                  ¡Eres un/a verdadero/a Guardián de la Protección Civil!
                </p>
                <div className="text-[11px] font-bold text-amber-700 bg-amber-100 px-3 py-1 rounded-full inline-block">
                  +{FENIX_TOTAL_XP} XP totales
                </div>
                <button
                  type="button"
                  onClick={handleClose}
                  className="mt-3 w-full py-2.5 rounded-xl bg-orange-400 hover:bg-orange-500 text-slate-900 font-black text-xs shadow transition-transform active:scale-95"
                >
                  Cerrar misión
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Toast de celebración por tarea completada */}
      {showCelebration && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[1500] bg-white border-4 border-orange-300 rounded-3xl px-5 py-3 shadow-2xl flex items-center gap-3 animate-bounce">
          <div className="text-3xl">{showCelebration.icon}</div>
          <div>
            <div className="font-black text-orange-800 text-xs uppercase tracking-wider">
              ¡Tarea completada!
            </div>
            <div className="font-bold text-slate-700 text-sm">{showCelebration.title}</div>
            <div className="text-[10px] text-amber-600 font-bold">+{showCelebration.xp} XP</div>
          </div>
          <button
            type="button"
            onClick={() => setShowCelebration(null)}
            className="ml-2 p-1 rounded text-orange-400 hover:bg-orange-50"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
