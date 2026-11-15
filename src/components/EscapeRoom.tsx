/**
 * Escape room «Abarán a oscuras · 72 horas» — interfaz.
 * La lógica vive en hooks/useEscapeRoom.ts y el mapa recibe `mapState`.
 */
import React, { useEffect, useMemo, useState } from 'react';
import { BatteryWarning, ChevronDown, ChevronUp, KeyRound, Lightbulb, LogOut, Printer, RotateCcw, Sparkles } from 'lucide-react';
import { InfrastructureItem } from '../types/infrastructure';
import {
  ESCAPE_DURATIONS, ESCAPE_ENIGMAS, ESCAPE_FINAL, ESCAPE_INTRO, ESCAPE_PENALTIES,
} from '../data/escapeRoom';
import { EscapeRoomController, temperatureOf } from '../hooks/useEscapeRoom';
import { toGridRef } from '../lib/grid';
import { formatMeters } from '../lib/geo';

interface Props {
  game: EscapeRoomController;
  resources: InfrastructureItem[];
}

const Overlay: React.FC<{ children: React.ReactNode; tone?: string }> = ({ children, tone = 'bg-slate-950/70' }) => (
  <div className={`fixed inset-0 z-[1600] flex items-center justify-center p-3 backdrop-blur-sm ${tone}`}>
    {children}
  </div>
);

const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <section className={`animate-pop-in max-h-[calc(100vh-1.5rem)] w-full overflow-y-auto rounded-3xl border-4 bg-white p-5 text-slate-800 shadow-2xl sm:p-6 ${className}`}>
    {children}
  </section>
);

const formatHours = (h: number) => {
  const v = Math.max(0, h);
  const hh = Math.floor(v);
  const mm = Math.floor((v - hh) * 60);
  return `${hh} h ${String(mm).padStart(2, '0')} min`;
};

/* ------------------------------------------------------------------ */
/* Barra superior (sustituye a la cabecera mientras se juega)           */
/* ------------------------------------------------------------------ */
const TopBar: React.FC<Props> = ({ game }) => {
  const { state, hoursLeft } = game;
  const pct = Math.max(0, Math.min(100, (hoursLeft / 72) * 100));
  const barColor = pct > 50 ? 'bg-emerald-400' : pct > 20 ? 'bg-amber-400' : 'bg-red-500 animate-pulse';
  return (
    <header className="fixed inset-x-0 top-0 z-[1000] border-b-2 border-violet-500/50 bg-slate-950/95 text-white shadow-2xl backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-4 gap-y-2 px-3 py-2 sm:px-4">
        <div className="flex shrink-0 items-center gap-2">
          <div className="rounded-xl bg-violet-500 p-2"><KeyRound className="h-5 w-5" /></div>
          <div>
            <h1 className="text-sm font-black leading-tight sm:text-base">{ESCAPE_INTRO.title}</h1>
            <p className="text-[10px] font-bold text-violet-300">🛡️ {state.team}</p>
          </div>
        </div>

        <div className="min-w-[160px] flex-1">
          <div className="mb-1 flex items-center justify-between text-[11px] font-bold">
            <span className="flex items-center gap-1 text-slate-300"><BatteryWarning className="h-3.5 w-3.5" /> Batería del CECOPAL</span>
            <span className={hoursLeft <= 0 ? 'text-red-400' : 'text-white'}>
              {hoursLeft <= 0 ? (state.overtime ? 'Tiempo extra' : 'Agotada') : formatHours(hoursLeft)}
            </span>
          </div>
          <div className="h-3 w-full overflow-hidden rounded-full border border-slate-700 bg-slate-800">
            <div className={`h-full transition-all duration-1000 ${barColor}`} style={{ width: `${pct}%` }} />
          </div>
        </div>

        <div className="flex items-center gap-1" aria-label="Letras del candado">
          {ESCAPE_ENIGMAS.map((e, i) => (
            <div
              key={e.id}
              className={`flex h-8 w-7 items-center justify-center rounded-lg border-2 text-sm font-black ${
                state.letters[i] ? 'border-amber-300 bg-amber-400 text-slate-950' : 'border-dashed border-slate-600 text-slate-600'
              }`}
            >
              {state.letters[i] ?? '?'}
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => {
            if (window.confirm('¿Salir del escape room? La partida queda guardada en este navegador y podréis continuarla.')) game.close();
          }}
          className="flex items-center gap-1 rounded-xl bg-slate-800 px-2.5 py-1.5 text-xs font-bold text-slate-300 hover:bg-slate-700"
        >
          <LogOut className="h-3.5 w-3.5" /> Salir
        </button>
      </div>
    </header>
  );
};

/* ------------------------------------------------------------------ */
/* Pantalla de inicio                                                   */
/* ------------------------------------------------------------------ */
const Intro: React.FC<Props> = ({ game }) => {
  const [team, setTeam] = useState(game.state.team);
  const [duration, setDuration] = useState(game.state.durationMin);
  return (
    <Overlay tone="bg-slate-950/85">
      <Card className="max-w-2xl border-violet-400">
        <p className="text-xs font-black tracking-[0.2em] text-violet-600">ESCAPE ROOM · PROTECCIÓN CIVIL</p>
        <h1 className="mt-1 text-3xl font-black text-slate-900 sm:text-4xl">🔦 {ESCAPE_INTRO.title}</h1>
        <p className="text-lg font-bold text-violet-700">{ESCAPE_INTRO.subtitle}</p>

        <div className="mt-4 space-y-2 text-sm leading-relaxed text-slate-700">
          {ESCAPE_INTRO.story.map((p) => <p key={p}>{p}</p>)}
        </div>

        <div className="mt-4 rounded-2xl border-2 border-violet-100 bg-violet-50 p-3">
          <h2 className="mb-2 text-xs font-black uppercase tracking-wider text-violet-700">Cómo se juega</h2>
          <ul className="space-y-1.5 text-sm text-slate-700">
            {ESCAPE_INTRO.rules.map((r) => <li key={r.text} className="flex gap-2"><span>{r.icon}</span><span>{r.text}</span></li>)}
          </ul>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="block">
            <span className="text-xs font-black uppercase tracking-wider text-slate-500">Nombre del equipo</span>
            <input
              value={team}
              onChange={(e) => setTeam(e.target.value)}
              maxLength={40}
              placeholder="Ej.: Los Guardianes del Segura"
              className="mt-1 w-full rounded-xl border-2 border-slate-200 px-3 py-2 text-sm font-bold outline-none focus:border-violet-400"
            />
          </label>
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-slate-500">Duración (72 h de batería =)</span>
            <div className="mt-1 grid grid-cols-3 gap-1.5">
              {ESCAPE_DURATIONS.map((d) => (
                <button
                  key={d.minutes}
                  type="button"
                  onClick={() => setDuration(d.minutes)}
                  className={`rounded-xl border-2 px-2 py-1.5 text-xs font-black ${
                    duration === d.minutes ? 'border-violet-500 bg-violet-500 text-white' : 'border-slate-200 text-slate-600 hover:border-violet-300'
                  }`}
                >
                  {d.label}<span className="block text-[9px] font-bold opacity-80">{d.note}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => game.start(team, duration)}
          className="mt-5 w-full rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-500 py-4 text-lg font-black text-white shadow-lg hover:from-violet-500 hover:to-fuchsia-400 active:scale-[0.98]"
        >
          ▶ Empezar: ¡se va la luz!
        </button>
        {game.savedGame && (
          <button type="button" onClick={game.resume} className="mt-2 w-full rounded-2xl border-2 border-violet-300 py-2.5 text-sm font-black text-violet-700 hover:bg-violet-50">
            ↻ Continuar la partida guardada ({game.state.team || 'equipo'})
          </button>
        )}
        <button type="button" onClick={game.close} className="mt-2 w-full py-2 text-xs font-bold uppercase tracking-wide text-slate-400 hover:text-slate-700">
          Volver al mapa
        </button>
      </Card>
    </Overlay>
  );
};

/* ------------------------------------------------------------------ */
/* Tarjeta del enigma (flotante, deja el mapa libre)                    */
/* ------------------------------------------------------------------ */
const EnigmaCard: React.FC<Props> = ({ game, resources }) => {
  const { state, enigma, feedback } = game;
  const [collapsed, setCollapsed] = useState(false);
  const used = state.hintsUsed[state.enigmaIndex];
  const target = resources.find((r) => r.id === enigma.hintTargetId);
  const gridRef = target ? toGridRef(target.coordinates) : null;

  useEffect(() => setCollapsed(false), [state.enigmaIndex]);

  const hints = [
    enigma.textHint,
    gridRef
      ? `Está en la casilla ${gridRef}. Activad el botón «🔲 Cuadrícula» (arriba a la derecha del mapa).`
      : 'Está dentro del casco urbano de Abarán.',
    'Hemos marcado en el mapa una zona morada: el lugar está dentro del círculo.',
  ];

  const nextCost = ESCAPE_PENALTIES.hints[used];
  const temp = feedback && !feedback.ok && feedback.distanceMeters !== undefined ? temperatureOf(feedback.distanceMeters) : null;

  return (
    <aside className="fixed bottom-3 left-3 right-3 z-[950] sm:bottom-auto sm:right-auto sm:top-[5.5rem] sm:w-[370px]">
      <div className="overflow-hidden rounded-3xl border-4 border-violet-400 bg-white shadow-2xl">
        <button
          type="button"
          onClick={() => setCollapsed((c) => !c)}
          className="flex w-full items-center gap-3 bg-gradient-to-r from-violet-600 to-fuchsia-500 px-4 py-2.5 text-left text-white"
        >
          <span className="text-2xl">{enigma.icon}</span>
          <span className="min-w-0 flex-1">
            <span className="block text-[10px] font-black uppercase tracking-wider text-violet-100">
              Enigma {state.enigmaIndex + 1} de {ESCAPE_ENIGMAS.length} · Hora {enigma.hour} del apagón
            </span>
            <span className="block truncate font-black">{enigma.room}</span>
          </span>
          {collapsed ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </button>

        {!collapsed && (
          <div className="max-h-[45vh] space-y-3 overflow-y-auto p-4 sm:max-h-[calc(100vh-11rem)]">
            <p className="rounded-2xl bg-slate-100 p-3 text-sm text-slate-700">📻 <b>Aviso por radio:</b> {enigma.situation}</p>
            <div className="rounded-2xl border-2 border-dashed border-violet-300 bg-violet-50 p-3">
              <p className="text-[10px] font-black uppercase tracking-wider text-violet-600">🧩 Adivinanza</p>
              <p className="mt-1 text-sm font-bold italic leading-relaxed text-slate-800">«{enigma.riddle}»</p>
            </div>
            <p className="text-xs font-bold text-slate-500">👉 Pulsad en el mapa el ❓ que creáis que es la respuesta.</p>

            {feedback && !feedback.ok && temp && (
              <div key={feedback.stamp} className="animate-pop-in rounded-2xl border-2 border-red-200 bg-red-50 p-3 text-sm">
                <p className="font-black text-red-700">❌ Eso es «{feedback.placeName}». No es lo que buscáis (−{ESCAPE_PENALTIES.wrongLocation} h).</p>
                <p className={`mt-1 font-black ${temp.tone}`}>
                  {temp.icon} {temp.label}: el objetivo está a unos {formatMeters(Math.round(feedback.distanceMeters! / 50) * 50)}.
                </p>
              </div>
            )}

            {used > 0 && (
              <ol className="space-y-1.5">
                {hints.slice(0, used).map((h, i) => (
                  <li key={h} className="rounded-xl border border-amber-200 bg-amber-50 p-2 text-xs text-amber-900">
                    <b>💡 Pista {i + 1}:</b> {h}
                  </li>
                ))}
              </ol>
            )}

            {used < hints.length && (
              <button
                type="button"
                onClick={game.takeHint}
                className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-amber-300 bg-amber-100 py-2 text-xs font-black text-amber-900 hover:bg-amber-200"
              >
                <Lightbulb className="h-4 w-4" /> Pedir pista {used + 1} de 3 (−{nextCost} h de batería)
              </button>
            )}
          </div>
        )}
      </div>
    </aside>
  );
};

/* ------------------------------------------------------------------ */
/* Dossier del lugar encontrado + pregunta                              */
/* ------------------------------------------------------------------ */
const Dossier: React.FC<Props> = ({ game, resources }) => {
  const { enigma, state } = game;
  const place = resources.find((r) => r.id === state.foundIds[state.enigmaIndex]);
  if (!place) return null;
  return (
    <Overlay>
      <Card className="max-w-xl border-emerald-400">
        <p className="text-xs font-black tracking-[0.18em] text-emerald-600">✅ ¡LUGAR LOCALIZADO!</p>
        <h2 className="mt-1 text-2xl font-black text-slate-900">{enigma.icon} {place.name}</h2>
        <p className="text-sm text-slate-500">📍 {place.address}</p>

        <div className="mt-4 rounded-2xl border-2 border-slate-200 bg-slate-50 p-3">
          <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">📁 Dossier del CECOPAL · Papel en el apagón</p>
          <p className="mt-1 text-sm font-bold text-slate-800">{place.blackoutRole}</p>
        </div>

        <div className="mt-3 rounded-2xl border-2 border-red-200 bg-red-50 p-3">
          <p className="text-[10px] font-black uppercase tracking-wider text-red-600">⚠️ ¿Por qué es una infraestructura crítica?</p>
          <p className="mt-1 text-sm leading-relaxed text-slate-800">{enigma.whyCritical}</p>
        </div>

        <div className="mt-3">
          <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">🧠 Ideas clave</p>
          <ul className="mt-1 space-y-1.5">
            {enigma.keyIdeas.map((k) => <li key={k} className="flex gap-2 text-sm text-slate-700"><span>✔️</span><span>{k}</span></li>)}
          </ul>
        </div>

        <p className="mt-4 rounded-xl bg-violet-50 p-2 text-center text-xs font-bold text-violet-700">
          Leed bien el dossier: la siguiente pregunta trata sobre él.
        </p>
        <button
          type="button"
          onClick={game.goToQuestion}
          className="mt-3 w-full rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-500 py-3 font-black text-white shadow-lg hover:from-violet-500 hover:to-fuchsia-400"
        >
          Estamos listos: ¡pregunta! 🔓
        </button>
      </Card>
    </Overlay>
  );
};

const Question: React.FC<Props> = ({ game }) => {
  const { enigma, state } = game;
  const [wrong, setWrong] = useState<number[]>([]);
  const alreadySolved = state.letters.length > state.enigmaIndex;
  const [solved, setSolved] = useState(alreadySolved);

  useEffect(() => { setWrong([]); setSolved(state.letters.length > state.enigmaIndex); }, [state.enigmaIndex]);

  const pick = (i: number) => {
    if (solved || wrong.includes(i)) return;
    if (game.answer(i)) setSolved(true);
    else setWrong((w) => [...w, i]);
  };

  return (
    <Overlay>
      <Card className="max-w-xl border-violet-400">
        <p className="text-xs font-black tracking-[0.18em] text-violet-600">🔐 CERRADURA {state.enigmaIndex + 1} DE {ESCAPE_ENIGMAS.length}</p>
        <h2 className="mt-2 text-lg font-black leading-snug text-slate-900">{enigma.question.prompt}</h2>
        <div className="mt-4 space-y-2">
          {enigma.question.options.map((opt, i) => {
            const isWrong = wrong.includes(i);
            const isRight = solved && i === enigma.question.correctIndex;
            return (
              <button
                key={opt}
                type="button"
                disabled={solved || isWrong}
                onClick={() => pick(i)}
                className={`w-full rounded-2xl border-2 px-4 py-3 text-left text-sm font-bold transition ${
                  isRight ? 'border-emerald-400 bg-emerald-50 text-emerald-800'
                  : isWrong ? 'border-red-200 bg-red-50 text-red-400 line-through'
                  : solved ? 'border-slate-100 text-slate-400'
                  : 'border-slate-200 hover:border-violet-400 hover:bg-violet-50'
                }`}
              >
                <span className="mr-2 font-black">{String.fromCharCode(65 + i)}.</span>{opt}
              </button>
            );
          })}
        </div>

        {wrong.length > 0 && !solved && (
          <p key={wrong.length} className="animate-pop-in mt-3 rounded-xl bg-red-50 p-2 text-sm font-bold text-red-700">
            ❌ Respuesta incorrecta: −{ESCAPE_PENALTIES.wrongAnswer} h de batería. Releed el dossier mentalmente y probad otra vez.
          </p>
        )}

        {solved && (
          <div className="animate-pop-in mt-4 space-y-3">
            <p className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-900"><b>✅ ¡Correcto!</b> {enigma.question.explanation}</p>
            <div className="flex items-center justify-center gap-3 rounded-2xl border-2 border-amber-300 bg-amber-50 p-3">
              <Sparkles className="h-5 w-5 text-amber-500" />
              <span className="text-sm font-bold text-amber-900">Habéis conseguido la letra</span>
              <span className="flex h-12 w-10 items-center justify-center rounded-xl bg-amber-400 text-2xl font-black text-slate-950 shadow">{enigma.letter}</span>
            </div>
            <button
              type="button"
              onClick={game.nextEnigma}
              className="w-full rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-500 py-3 font-black text-white shadow-lg hover:from-violet-500 hover:to-fuchsia-400"
            >
              {state.enigmaIndex < ESCAPE_ENIGMAS.length - 1 ? 'Siguiente enigma ➜' : 'Ir al candado final 🔐'}
            </button>
          </div>
        )}
      </Card>
    </Overlay>
  );
};

/* ------------------------------------------------------------------ */
/* Candado final                                                       */
/* ------------------------------------------------------------------ */
const FinalLock: React.FC<Props> = ({ game }) => {
  const letters = game.state.letters;
  const [picked, setPicked] = useState<number[]>([]);
  const [error, setError] = useState(0);
  const word = picked.map((i) => letters[i]).join('');

  const check = () => {
    if (!game.tryCode(word)) {
      setError((e) => e + 1);
      setPicked([]);
    }
  };

  return (
    <Overlay tone="bg-slate-950/85">
      <Card className="max-w-lg border-amber-400 text-center">
        <p className="text-xs font-black tracking-[0.18em] text-amber-600">🔐 CANDADO FINAL</p>
        <h2 className="mt-1 text-2xl font-black text-slate-900">El plan de emergencia</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">{ESCAPE_FINAL.prompt}</p>

        <div className="mt-5 flex justify-center gap-2">
          {letters.map((_, slot) => (
            <div key={slot} className="flex h-14 w-11 items-center justify-center rounded-xl border-2 border-slate-300 bg-slate-50 text-2xl font-black text-slate-900">
              {word[slot] ?? ''}
            </div>
          ))}
        </div>

        <p className="mt-4 text-[10px] font-black uppercase tracking-wider text-slate-400">Pulsad las letras en orden</p>
        <div className="mt-2 flex justify-center gap-2">
          {letters.map((l, i) => (
            <button
              key={i}
              type="button"
              disabled={picked.includes(i)}
              onClick={() => setPicked((p) => [...p, i])}
              className="h-12 w-10 rounded-xl bg-amber-400 text-xl font-black text-slate-950 shadow hover:bg-amber-300 disabled:opacity-25"
            >
              {l}
            </button>
          ))}
        </div>

        {error > 0 && (
          <p key={error} className="animate-pop-in mt-3 text-sm font-bold text-red-600">
            ❌ El candado no se abre (−{ESCAPE_PENALTIES.wrongCode} h). Pista: piensa en lo contrario de «separados».
          </p>
        )}

        <div className="mt-5 grid grid-cols-2 gap-2">
          <button type="button" onClick={() => setPicked([])} className="flex items-center justify-center gap-1 rounded-2xl border-2 border-slate-200 py-3 text-sm font-black text-slate-600 hover:bg-slate-50">
            <RotateCcw className="h-4 w-4" /> Borrar
          </button>
          <button
            type="button"
            disabled={word.length < letters.length}
            onClick={check}
            className="rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 py-3 text-sm font-black text-white shadow-lg disabled:opacity-40"
          >
            🔓 Abrir
          </button>
        </div>
      </Card>
    </Overlay>
  );
};

/* ------------------------------------------------------------------ */
/* Batería agotada                                                      */
/* ------------------------------------------------------------------ */
const TimeOut: React.FC<Props> = ({ game }) => (
  <Overlay tone="bg-slate-950/90">
    <Card className="max-w-md border-red-400 text-center">
      <div className="text-5xl">🪫</div>
      <h2 className="mt-2 text-2xl font-black text-slate-900">¡Se agotó la batería!</h2>
      <p className="mt-2 text-sm text-slate-600">
        La radio del CECOPAL se ha apagado. Habéis conseguido {game.state.letters.length} de {ESCAPE_ENIGMAS.length} letras.
        En una emergencia real, cada minuto cuenta… pero aún podéis terminar la misión para aprender.
      </p>
      <button type="button" onClick={game.continueOvertime} className="mt-4 w-full rounded-2xl bg-violet-600 py-3 font-black text-white hover:bg-violet-500">
        Seguir jugando en tiempo extra
      </button>
      <button type="button" onClick={game.open} className="mt-2 w-full rounded-2xl border-2 border-slate-200 py-2.5 text-sm font-black text-slate-600 hover:bg-slate-50">
        Empezar de nuevo
      </button>
    </Card>
  </Overlay>
);

/* ------------------------------------------------------------------ */
/* Victoria y certificado                                              */
/* ------------------------------------------------------------------ */
const Victory: React.FC<Props> = ({ game, resources }) => {
  const { state } = game;
  const left = Math.max(0, state.finishedAtHours ?? 0);
  const stars = state.overtime ? 1 : left >= 30 ? 3 : left >= 12 ? 2 : 1;
  const hintsTotal = state.hintsUsed.reduce((a, b) => a + b, 0);
  const score = Math.round(left * 10) + state.firstTryAnswers * 50 + (state.overtime ? 0 : 200);
  const found = useMemo(
    () => ESCAPE_ENIGMAS.map((e, i) => ({ e, place: resources.find((r) => r.id === state.foundIds[i]) })),
    [resources, state.foundIds],
  );

  return (
    <Overlay tone="bg-slate-950/85">
      <Card className="escape-certificate max-w-2xl border-amber-400">
        <div className="text-center">
          <p className="text-xs font-black tracking-[0.2em] text-amber-600">CERTIFICADO DE CADETES DE PROTECCIÓN CIVIL</p>
          <div className="mt-2 text-5xl">{'⭐'.repeat(stars)}<span className="opacity-20">{'⭐'.repeat(3 - stars)}</span></div>
          <h2 className="mt-2 text-3xl font-black text-slate-900">¡Juntos, Abarán resiste!</h2>
          <p className="mt-1 text-lg font-bold text-violet-700">🛡️ {state.team}</p>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-slate-600">{ESCAPE_FINAL.success}</p>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 text-center sm:grid-cols-4">
          {[
            { label: 'Puntos', value: score },
            { label: 'Batería restante', value: state.overtime ? '0 h' : `${Math.floor(left)} h` },
            { label: 'Pistas usadas', value: hintsTotal },
            { label: 'Aciertos a la 1.ª', value: `${state.firstTryAnswers}/${ESCAPE_ENIGMAS.length}` },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl border-2 border-slate-100 bg-slate-50 p-2">
              <div className="text-xl font-black text-slate-900">{s.value}</div>
              <div className="text-[10px] font-bold uppercase tracking-wide text-slate-500">{s.label}</div>
            </div>
          ))}
        </div>

        <h3 className="mt-5 text-xs font-black uppercase tracking-wider text-slate-500">Infraestructuras críticas que habéis localizado</h3>
        <ul className="mt-2 space-y-1.5">
          {found.map(({ e, place }) => (
            <li key={e.id} className="flex gap-3 rounded-xl border border-slate-100 p-2">
              <span className="text-xl">{e.icon}</span>
              <span className="text-sm">
                <b className="text-slate-900">{place?.name}</b>
                <span className="block text-xs text-slate-500">{place?.blackoutRole}</span>
              </span>
            </li>
          ))}
        </ul>

        <p className="mt-3 text-center text-[11px] text-slate-400">
          Fallos de localización: {state.wrongLocations} · Respuestas incorrectas: {state.wrongAnswers} · Duración elegida: {state.durationMin} min
        </p>

        <div className="escape-no-print mt-4 grid gap-2 sm:grid-cols-3">
          <button type="button" onClick={() => window.print()} className="flex items-center justify-center gap-1 rounded-2xl border-2 border-slate-200 py-2.5 text-sm font-black text-slate-700 hover:bg-slate-50">
            <Printer className="h-4 w-4" /> Imprimir
          </button>
          <button type="button" onClick={game.open} className="rounded-2xl border-2 border-violet-300 py-2.5 text-sm font-black text-violet-700 hover:bg-violet-50">
            Jugar otra vez
          </button>
          <button type="button" onClick={game.close} className="rounded-2xl bg-violet-600 py-2.5 text-sm font-black text-white hover:bg-violet-500">
            Explorar el mapa
          </button>
        </div>
      </Card>
    </Overlay>
  );
};

/* ------------------------------------------------------------------ */
export const EscapeRoom: React.FC<Props> = (props) => {
  const { game } = props;
  const { state } = game;
  if (state.stage === 'off') return null;
  if (state.stage === 'intro') return <Intro {...props} />;

  return (
    <>
      <TopBar {...props} />
      {state.stage === 'playing' && state.step === 'locate' && <EnigmaCard {...props} />}
      {state.stage === 'playing' && state.step === 'dossier' && <Dossier {...props} />}
      {state.stage === 'playing' && state.step === 'question' && <Question {...props} />}
      {state.stage === 'final' && <FinalLock {...props} />}
      {state.stage === 'won' && <Victory {...props} />}
      {game.timeOut && state.stage !== 'won' && <TimeOut {...props} />}
    </>
  );
};
