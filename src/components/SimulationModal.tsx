import React from 'react';
import { 
  X, AlertTriangle, ShieldAlert, CheckCircle2, Flame, Droplets, Zap, 
  ArrowRight, Play, RotateCcw, Shield, Radio, Navigation
} from 'lucide-react';
import { EmergencyScenario } from '../types/infrastructure';
import { EMERGENCY_SCENARIOS, ABARAN_INFRASTRUCTURES } from '../data/abaranData';

interface SimulationModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeScenario: EmergencyScenario | null;
  onActivateScenario: (scenario: EmergencyScenario) => void;
  onDeactivateScenario: () => void;
  onFocusAffectedInfrastructure: (infraId: string) => void;
}

export const SimulationModal: React.FC<SimulationModalProps> = ({
  isOpen,
  onClose,
  activeScenario,
  onActivateScenario,
  onDeactivateScenario,
  onFocusAffectedInfrastructure,
}) => {
  if (!isOpen) return null;

  const getScenarioIcon = (type: EmergencyScenario['type']) => {
    switch (type) {
      case 'FLOOD': return <Droplets className="w-5 h-5 text-blue-400" />;
      case 'BLACKOUT': return <Zap className="w-5 h-5 text-amber-400" />;
      case 'WILDFIRE': return <Flame className="w-5 h-5 text-red-400" />;
      case 'WATER_SHORTAGE': return <Droplets className="w-5 h-5 text-cyan-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl text-white overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-base text-white">Simulador de Escenarios de Emergencia</h2>
              <p className="text-xs text-slate-400">Planes de contingencia y resiliencia para Abarán</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          {activeScenario && (
            <div className="p-4 rounded-xl bg-red-950/50 border border-red-500/70 shadow-lg space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                  <span className="font-bold text-red-200 text-sm">ESCENARIO EN CURSO: {activeScenario.title}</span>
                </div>
                <button
                  type="button"
                  onClick={onDeactivateScenario}
                  className="px-2.5 py-1 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Detener Simulación</span>
                </button>
              </div>

              <p className="text-red-100 text-xs leading-relaxed">{activeScenario.description}</p>

              {/* Affected Infrastructures List */}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-red-300 block mb-1">
                  Infraestructuras Afectadas ({activeScenario.affectedInfrasIds.length}):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {activeScenario.affectedInfrasIds.map((id) => {
                    const infra = ABARAN_INFRASTRUCTURES.find(i => i.id === id);
                    if (!infra) return null;
                    return (
                      <div 
                        key={id}
                        onClick={() => {
                          onFocusAffectedInfrastructure(id);
                          onClose();
                        }}
                        className="p-2 rounded-lg bg-red-900/40 border border-red-700/60 hover:bg-red-800/60 cursor-pointer flex items-center justify-between gap-2 transition-colors"
                      >
                        <div className="truncate">
                          <span className="font-semibold text-white block truncate">{infra.name}</span>
                          <span className="text-[10px] text-red-200">{infra.code} • {infra.pedania}</span>
                        </div>
                        <Navigation className="w-3.5 h-3.5 text-red-300 flex-shrink-0" />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action checklist */}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-red-300 block mb-1">
                  Protocolos y Medidas de Respuesta Inmediata:
                </span>
                <div className="space-y-1 bg-red-950/60 p-2.5 rounded-lg border border-red-800/60">
                  {activeScenario.recommendedActions.map((action, i) => (
                    <div key={i} className="flex items-start gap-2 text-red-100">
                      <CheckCircle2 className="w-3.5 h-3.5 text-red-400 flex-shrink-0 mt-0.5" />
                      <span>{action}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Catalog of Scenarios */}
          <div>
            <span className="font-bold text-slate-300 text-xs block mb-2">
              Seleccione un Escenario de Protección Civil para simular:
            </span>
            <div className="space-y-2.5">
              {EMERGENCY_SCENARIOS.map((scenario) => {
                const isSelected = activeScenario?.id === scenario.id;
                return (
                  <div
                    key={scenario.id}
                    className={`p-3.5 rounded-xl border transition-all ${
                      isSelected
                        ? 'bg-blue-950/40 border-blue-500 shadow-md ring-1 ring-blue-500/50'
                        : 'bg-slate-800/60 border-slate-700/80 hover:bg-slate-800 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-xl bg-slate-900 border border-slate-700 flex-shrink-0 mt-0.5">
                          {getScenarioIcon(scenario.type)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white text-xs">{scenario.title}</span>
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                              {scenario.badge}
                            </span>
                          </div>
                          <p className="text-slate-300 text-[11px] mt-1 leading-relaxed">
                            {scenario.description}
                          </p>
                          <div className="text-[10px] text-slate-400 mt-1.5">
                            ⚡ <strong>Detonante:</strong> {scenario.triggerEvent}
                          </div>
                        </div>
                      </div>

                      <div className="flex-shrink-0">
                        {isSelected ? (
                          <button
                            type="button"
                            onClick={onDeactivateScenario}
                            className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Detener</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              onActivateScenario(scenario);
                              onClose();
                            }}
                            className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
                          >
                            <Play className="w-3.5 h-3.5 fill-current" />
                            <span>Activar</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <span>Coordinación Operativa: CECOPAL Abarán & Consorcio CEIS</span>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-white transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
