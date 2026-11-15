import { useCallback, useEffect, useMemo, useState } from 'react';
import { InfrastructureItem } from '../types/infrastructure';
import { ESCAPE_ENIGMAS, ESCAPE_FINAL, ESCAPE_PENALTIES } from '../data/escapeRoom';
import { haversineMeters } from '../lib/geo';

export type EscapeStage = 'off' | 'intro' | 'playing' | 'final' | 'won';
export type EnigmaStep = 'locate' | 'dossier' | 'question';

export interface LocateFeedback {
  ok: boolean;
  placeName: string;
  distanceMeters?: number;
  /** Para forzar re-render aunque se repita el mismo mensaje. */
  stamp: number;
}

export interface EscapeState {
  stage: EscapeStage;
  team: string;
  durationMin: number;
  enigmaIndex: number;
  step: EnigmaStep;
  /** id encontrado en cada enigma (por índice). */
  foundIds: string[];
  /** Lugares pulsados por error (se revelan en gris). */
  checkedIds: string[];
  /** Nº de pistas usadas en cada enigma (0-3). */
  hintsUsed: number[];
  letters: string[];
  elapsedMs: number;
  penaltyHours: number;
  wrongLocations: number;
  wrongAnswers: number;
  wrongCodes: number;
  firstTryAnswers: number;
  /** Fallos de la pregunta del enigma actual. */
  currentAnswerFails: number;
  /** El equipo decidió seguir jugando aunque se agotó la batería. */
  overtime: boolean;
  finishedAtHours?: number;
}

const STORAGE_KEY = 'abaran-escape-room-v1';
const TOTAL_HOURS = 72;

const initialState = (): EscapeState => ({
  stage: 'off',
  team: '',
  durationMin: 45,
  enigmaIndex: 0,
  step: 'locate',
  foundIds: [],
  checkedIds: [],
  hintsUsed: ESCAPE_ENIGMAS.map(() => 0),
  letters: [],
  elapsedMs: 0,
  penaltyHours: 0,
  wrongLocations: 0,
  wrongAnswers: 0,
  wrongCodes: 0,
  firstTryAnswers: 0,
  currentAnswerFails: 0,
  overtime: false,
});

const load = (): EscapeState => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialState();
    const saved = { ...initialState(), ...JSON.parse(raw) } as EscapeState;
    // Al recargar la página no se abre el juego solo: se queda guardado para «Continuar».
    return { ...saved, stage: 'off' };
  } catch {
    return initialState();
  }
};

const save = (s: EscapeState) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  } catch {
    /* almacenamiento no disponible: el juego sigue sin guardar */
  }
};

/** Horas de batería restantes (puede ser negativo en tiempo extra). */
export const hoursLeft = (s: EscapeState) => {
  const msPerHour = (s.durationMin * 60 * 1000) / TOTAL_HOURS;
  return TOTAL_HOURS - s.elapsedMs / msPerHour - s.penaltyHours;
};

export const temperatureOf = (meters: number) => {
  if (meters < 200) return { icon: '🔥', label: '¡Muy caliente!', tone: 'text-red-600' };
  if (meters < 500) return { icon: '🌡️', label: 'Templado', tone: 'text-amber-600' };
  return { icon: '❄️', label: 'Frío', tone: 'text-sky-600' };
};

export function useEscapeRoom(resources: InfrastructureItem[]) {
  const [state, setState] = useState<EscapeState>(load);
  const [feedback, setFeedback] = useState<LocateFeedback | null>(null);
  const [savedGame, setSavedGame] = useState<boolean>(() => {
    const s = load();
    return s.team !== '' && s.letters.length + s.foundIds.length > 0 && s.finishedAtHours === undefined;
  });

  const enigma = ESCAPE_ENIGMAS[state.enigmaIndex];
  const active = state.stage !== 'off';
  const running = state.stage === 'playing' || state.stage === 'final';

  // Reloj: avanza cada segundo mientras se juega.
  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      setState((s) => ({ ...s, elapsedMs: s.elapsedMs + 1000 }));
    }, 1000);
    return () => window.clearInterval(id);
  }, [running]);

  useEffect(() => {
    // No se guarda en 'intro' para no pisar una partida guardada antes de pulsar «Continuar».
    if (state.stage !== 'off' && state.stage !== 'intro') save(state);
  }, [state]);

  const left = hoursLeft(state);
  const timeOut = running && left <= 0 && !state.overtime;

  const open = useCallback(() => {
    setState((s) => ({ ...initialState(), durationMin: s.durationMin, team: s.team, stage: 'intro' }));
    setFeedback(null);
  }, []);

  const resume = useCallback(() => {
    const s = load();
    setState({ ...s, stage: s.letters.length >= ESCAPE_ENIGMAS.length ? 'final' : 'playing' });
    setSavedGame(false);
  }, []);

  const start = useCallback((team: string, durationMin: number) => {
    setState({ ...initialState(), team: team.trim() || 'Equipo Fénix', durationMin, stage: 'playing' });
    setFeedback(null);
    setSavedGame(false);
  }, []);

  const close = useCallback(() => {
    setSavedGame(state.stage === 'playing' || state.stage === 'final');
    setState((s) => ({ ...s, stage: 'off' }));
    setFeedback(null);
  }, [state.stage]);

  const continueOvertime = useCallback(() => setState((s) => ({ ...s, overtime: true })), []);

  /** El alumnado pulsa un marcador del mapa. */
  const tryLocate = useCallback(
    (item: InfrastructureItem) => {
      if (state.stage !== 'playing' || state.step !== 'locate' || timeOut) return;
      if (state.foundIds.includes(item.id)) return;
      if (enigma.targetIds.includes(item.id)) {
        setState((s) => ({ ...s, step: 'dossier', foundIds: [...s.foundIds, item.id] }));
        setFeedback({ ok: true, placeName: item.name, stamp: Date.now() });
        return;
      }
      const distance = Math.min(
        ...enigma.targetIds
          .map((id) => resources.find((r) => r.id === id))
          .filter((r): r is InfrastructureItem => !!r)
          .map((r) => haversineMeters(item.coordinates, r.coordinates)),
      );
      setState((s) => ({
        ...s,
        penaltyHours: s.penaltyHours + ESCAPE_PENALTIES.wrongLocation,
        wrongLocations: s.wrongLocations + 1,
        checkedIds: s.checkedIds.includes(item.id) ? s.checkedIds : [...s.checkedIds, item.id],
      }));
      setFeedback({ ok: false, placeName: item.name, distanceMeters: distance, stamp: Date.now() });
    },
    [state.stage, state.step, state.foundIds, enigma, resources, timeOut],
  );

  const takeHint = useCallback(() => {
    setState((s) => {
      const used = s.hintsUsed[s.enigmaIndex];
      if (used >= ESCAPE_PENALTIES.hints.length) return s;
      const hintsUsed = [...s.hintsUsed];
      hintsUsed[s.enigmaIndex] = used + 1;
      return { ...s, hintsUsed, penaltyHours: s.penaltyHours + ESCAPE_PENALTIES.hints[used] };
    });
  }, []);

  const goToQuestion = useCallback(() => setState((s) => ({ ...s, step: 'question' })), []);

  /** Devuelve true si la respuesta es correcta. */
  const answer = useCallback(
    (optionIndex: number) => {
      const correct = optionIndex === enigma.question.correctIndex;
      setState((s) => {
        if (!correct) {
          return {
            ...s,
            penaltyHours: s.penaltyHours + ESCAPE_PENALTIES.wrongAnswer,
            wrongAnswers: s.wrongAnswers + 1,
            currentAnswerFails: s.currentAnswerFails + 1,
          };
        }
        return {
          ...s,
          // Evita duplicar la letra si se recarga la partida en esta pregunta.
          letters: s.letters.length > s.enigmaIndex ? s.letters : [...s.letters, enigma.letter],
          firstTryAnswers:
            s.letters.length > s.enigmaIndex ? s.firstTryAnswers : s.firstTryAnswers + (s.currentAnswerFails === 0 ? 1 : 0),
        };
      });
      return correct;
    },
    [enigma],
  );

  /** Pasa al siguiente enigma (o al candado final). */
  const nextEnigma = useCallback(() => {
    setFeedback(null);
    setState((s) => {
      if (s.enigmaIndex >= ESCAPE_ENIGMAS.length - 1) return { ...s, stage: 'final', currentAnswerFails: 0 };
      return { ...s, enigmaIndex: s.enigmaIndex + 1, step: 'locate', currentAnswerFails: 0 };
    });
  }, []);

  /** Devuelve true si el código es correcto. */
  const tryCode = useCallback((code: string) => {
    const normalized = code
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z]/g, '')
      .toUpperCase();
    const ok = normalized === ESCAPE_FINAL.code;
    setState((s) =>
      ok
        ? { ...s, stage: 'won', finishedAtHours: hoursLeft(s) }
        : { ...s, wrongCodes: s.wrongCodes + 1, penaltyHours: s.penaltyHours + ESCAPE_PENALTIES.wrongCode },
    );
    return ok;
  }, []);

  /** Ids que el mapa debe mostrar como «encontrados». */
  const mapState = useMemo(() => {
    if (!active || state.stage === 'intro') return null;
    let zone: { center: [number, number]; radius: number } | null = null;
    if (state.stage === 'playing' && state.step === 'locate' && state.hintsUsed[state.enigmaIndex] >= 3) {
      const t = resources.find((r) => r.id === enigma.hintTargetId);
      if (t) {
        // Círculo desplazado para que el objetivo no quede justo en el centro.
        const offset = 0.0011;
        zone = { center: [t.coordinates[0] + offset * 0.6, t.coordinates[1] - offset * 0.8], radius: 260 };
      }
    }
    return {
      foundIds: state.foundIds,
      checkedIds: state.checkedIds,
      zone,
      revealAll: state.stage === 'won',
    };
  }, [active, state.stage, state.step, state.foundIds, state.checkedIds, state.hintsUsed, state.enigmaIndex, enigma, resources]);

  return {
    state,
    enigma,
    active,
    hoursLeft: left,
    timeOut,
    feedback,
    savedGame,
    mapState,
    open,
    resume,
    start,
    close,
    continueOvertime,
    tryLocate,
    takeHint,
    goToQuestion,
    answer,
    nextEnigma,
    tryCode,
  };
}

export type EscapeRoomController = ReturnType<typeof useEscapeRoom>;
