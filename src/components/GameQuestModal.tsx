import React, { useState } from 'react';
import { 
  X, Trophy, Star, CheckCircle, Target, Award, ArrowRight, Sparkles, HelpCircle, Flame
} from 'lucide-react';
import { Mission, PlayerStats } from '../types/game';
import { EDUCATIONAL_MISSIONS, PLAYER_RANKS } from '../data/missionsData';
import { InfrastructureItem } from '../types/infrastructure';

interface GameQuestModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: PlayerStats;
  onSelectMission: (mission: Mission) => void;
  onAnswerQuestion: (missionId: string, isCorrect: boolean, xp: number) => void;
  infrastructures: InfrastructureItem[];
}

export const GameQuestModal: React.FC<GameQuestModalProps> = ({
  isOpen,
  onClose,
  stats,
  onSelectMission,
  onAnswerQuestion,
  infrastructures,
}) => {
  const [activeQuizMission, setActiveQuizMission] = useState<Mission | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  if (!isOpen) return null;

  const currentRank = PLAYER_RANKS.slice().reverse().find(r => stats.xp >= r.minXp) || PLAYER_RANKS[0];
  const nextRank = PLAYER_RANKS.find(r => r.minXp > stats.xp);
  const xpForNext = nextRank ? nextRank.minXp - stats.xp : 0;
  const progressPercent = nextRank 
    ? Math.min(100, Math.round(((stats.xp - currentRank.minXp) / (nextRank.minXp - currentRank.minXp)) * 100))
    : 100;

  const handleStartQuiz = (m: Mission) => {
    setActiveQuizMission(m);
    setSelectedOption(null);
    setQuizSubmitted(false);
  };

  const handleConfirmAnswer = () => {
    if (!activeQuizMission?.question || selectedOption === null) return;
    setQuizSubmitted(true);
    const isCorrect = selectedOption === activeQuizMission.question.correctIndex;
    if (isCorrect) {
      onAnswerQuestion(activeQuizMission.id, true, activeQuizMission.xpReward);
    }
  };

  return (
    <div className="fixed inset-0 z-[1300] flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-indigo-500/50 rounded-3xl max-w-xl w-full max-h-[92vh] flex flex-col shadow-2xl text-white overflow-hidden ring-4 ring-indigo-500/20">
        {/* Header Gamificado */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 border-b border-indigo-700/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center text-2xl font-black shadow-lg shadow-amber-400/30 transform -rotate-3 border-2 border-white">
              {currentRank.icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-400 text-slate-950">
                  Nivel {currentRank.level}
                </span>
                <span className="font-extrabold text-base sm:text-lg text-white">
                  {currentRank.title}
                </span>
              </div>
              <p className="text-xs text-indigo-200 mt-0.5">
                Misión: Guardián de Abarán (1º ESO)
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-indigo-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Barra de Experiencia (XP) */}
        <div className="px-5 py-3 bg-slate-900/90 border-b border-slate-800">
          <div className="flex items-center justify-between text-xs mb-1.5 font-bold">
            <span className="text-amber-400 flex items-center gap-1">
              <Sparkles className="w-4 h-4 fill-amber-400" />
              {stats.xp} Puntos XP
            </span>
            <span className="text-slate-400">
              {nextRank ? `Faltan ${xpForNext} XP para ${nextRank.title}` : '¡Rango Máximo Alcanzado!'}
            </span>
          </div>
          <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden p-0.5 border border-slate-700">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-500 transition-all duration-500 shadow-sm"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Contenido del Modal */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {/* Si hay un mini-quiz activo */}
          {activeQuizMission && activeQuizMission.question ? (
            <div className="bg-indigo-950/50 border-2 border-indigo-500/70 rounded-2xl p-4 sm:p-5 space-y-4 animate-in zoom-in-95">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4" />
                  Reto de Pregunta (+{activeQuizMission.xpReward} XP)
                </span>
                <button
                  type="button"
                  onClick={() => setActiveQuizMission(null)}
                  className="text-xs text-indigo-300 hover:underline"
                >
                  Volver a misiones
                </button>
              </div>

              <h3 className="font-extrabold text-sm sm:text-base text-white leading-snug">
                {activeQuizMission.question.prompt}
              </h3>

              {/* Opciones */}
              <div className="space-y-2">
                {activeQuizMission.question.options.map((option, idx) => {
                  const isChosen = selectedOption === idx;
                  const isCorrectAnswer = idx === activeQuizMission.question!.correctIndex;
                  let btnStyle = 'bg-slate-800/90 border-slate-700 text-slate-200 hover:bg-slate-700';

                  if (quizSubmitted) {
                    if (isCorrectAnswer) {
                      btnStyle = 'bg-emerald-600/40 border-emerald-400 text-white font-bold ring-2 ring-emerald-400';
                    } else if (isChosen && !isCorrectAnswer) {
                      btnStyle = 'bg-red-600/40 border-red-400 text-red-200';
                    } else {
                      btnStyle = 'bg-slate-900/60 border-slate-800 text-slate-500';
                    }
                  } else if (isChosen) {
                    btnStyle = 'bg-indigo-600 border-indigo-400 text-white font-bold ring-2 ring-indigo-400';
                  }

                  return (
                    <button
                      key={idx}
                      type="button"
                      disabled={quizSubmitted}
                      onClick={() => setSelectedOption(idx)}
                      className={`w-full text-left p-3 rounded-xl border transition-all text-xs flex items-center gap-3 ${btnStyle}`}
                    >
                      <span className="w-6 h-6 rounded-lg bg-black/30 flex items-center justify-center font-black text-xs flex-shrink-0">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span>{option}</span>
                    </button>
                  );
                })}
              </div>

              {/* Feedback y Botón */}
              {!quizSubmitted ? (
                <button
                  type="button"
                  disabled={selectedOption === null}
                  onClick={handleConfirmAnswer}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 disabled:opacity-50 text-slate-950 font-black text-xs sm:text-sm shadow-lg transition-transform active:scale-95"
                >
                  ¡Comprobar mi respuesta!
                </button>
              ) : (
                <div className="space-y-3 pt-2">
                  <div className={`p-3 rounded-xl text-xs ${
                    selectedOption === activeQuizMission.question.correctIndex
                      ? 'bg-emerald-950/80 border border-emerald-500 text-emerald-200'
                      : 'bg-red-950/80 border border-red-500 text-red-200'
                  }`}>
                    <p className="font-bold">
                      {selectedOption === activeQuizMission.question.correctIndex
                        ? '🎉 ¡CORRECTO! ¡Has ganado ' + activeQuizMission.xpReward + ' XP y la insignia ' + activeQuizMission.badgeIcon + ' ' + activeQuizMission.badgeName + '!'
                        : '❌ Casi... La respuesta correcta era la ' + String.fromCharCode(65 + activeQuizMission.question.correctIndex)}
                    </p>
                    <p className="mt-1 text-slate-300">{activeQuizMission.question.explanation}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveQuizMission(null)}
                    className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs"
                  >
                    Continuar jugando
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Lista de Misiones */
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-xs uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <Target className="w-4 h-4 text-amber-400" />
                  Misiones y Retos del Mapa ({stats.completedMissionIds.length} / {EDUCATIONAL_MISSIONS.length})
                </span>
                <span className="text-[11px] text-amber-300 font-bold">
                  {stats.badges.length} Insignias conseguidas 🏅
                </span>
              </div>

              <div className="space-y-2.5">
                {EDUCATIONAL_MISSIONS.map((mission) => {
                  const isDone = stats.completedMissionIds.includes(mission.id);

                  return (
                    <div
                      key={mission.id}
                      className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                        isDone
                          ? 'bg-emerald-950/30 border-emerald-500/40 opacity-80'
                          : 'bg-slate-800/80 border-slate-700/80 hover:border-indigo-500 hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-xl flex-shrink-0">
                          {isDone ? '✅' : mission.badgeIcon}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-xs text-white truncate">{mission.title}</h4>
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30 flex-shrink-0">
                              +{mission.xpReward} XP
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 truncate mt-0.5">{mission.subtitle}</p>
                        </div>
                      </div>

                      <div className="flex-shrink-0 flex items-center gap-2">
                        {isDone ? (
                          <span className="px-2 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 text-[10px] font-bold flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Completada
                          </span>
                        ) : mission.question ? (
                          <button
                            type="button"
                            onClick={() => handleStartQuiz(mission)}
                            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs shadow flex items-center gap-1.5 transition-transform active:scale-95"
                          >
                            <span>¡Jugar Reto!</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              onSelectMission(mission);
                              onClose();
                            }}
                            className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow flex items-center gap-1.5 transition-transform active:scale-95"
                          >
                            <span>Ir al Mapa</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Galería de Insignias */}
              <div className="mt-4 pt-3 border-t border-slate-800">
                <span className="font-extrabold text-xs uppercase tracking-wider text-slate-300 block mb-2">
                  Tus Medallas de Explorador:
                </span>
                <div className="flex flex-wrap gap-2">
                  {EDUCATIONAL_MISSIONS.map((m) => {
                    const isEarned = stats.badges.includes(m.badgeName);
                    return (
                      <div
                        key={m.id}
                        className={`px-2.5 py-1.5 rounded-xl border text-[11px] font-bold flex items-center gap-1.5 ${
                          isEarned
                            ? 'bg-amber-500/20 border-amber-400/50 text-amber-200'
                            : 'bg-slate-900/40 border-slate-800 text-slate-600 opacity-50'
                        }`}
                        title={isEarned ? `Medalla: ${m.badgeName}` : 'Bloqueada'}
                      >
                        <span>{m.badgeIcon}</span>
                        <span>{m.badgeName}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>🎮 Geografía 1º ESO • Valle de Ricote</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
