/**
 * DistanceRuler — Regla de escala y medidor de distancias (fichas F04 y F06).
 *
 * Presentacional: recibe los puntos medidos y el estado activo como props.
 * Permite al alumnado marcar dos puntos en el mapa y ver la distancia real +
 * tiempo a pie (4 km/h y 2 km/h movilidad reducida).
 */

import React from 'react';
import { MapPin, Trash2, X, Ruler } from 'lucide-react';
import { haversineMeters, formatMeters, walkMinutes } from '../lib/geo';

interface MeasuredPoint {
  lat: number;
  lng: number;
  label: 'A' | 'B';
}

interface DistanceRulerProps {
  points: MeasuredPoint[];
  isMeasuring: boolean;
  onToggle: () => void;
  onClear: () => void;
}

export const DistanceRuler: React.FC<DistanceRulerProps> = ({
  points,
  isMeasuring,
  onToggle,
  onClear,
}) => {
  const distanceM = points.length === 2
    ? haversineMeters([points[0].lat, points[0].lng], [points[1].lat, points[1].lng])
    : 0;

  return (
    <div className="fixed bottom-4 left-4 z-[1000] flex flex-col gap-2 w-64">
      {/* Barra de control */}
      <div className="flex items-center justify-between bg-white rounded-xl p-3 shadow-xl border-2 border-amber-200">
        <button
          type="button"
          onClick={onToggle}
          className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs font-black transition-all ${
            isMeasuring
              ? 'bg-emerald-100 text-emerald-700 shadow-emerald-200'
              : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
          }`}
        >
          <Ruler className={`w-4 h-4 ${isMeasuring ? 'animate-pulse' : ''}`} />
          <span>{isMeasuring ? 'Medición ON' : 'Medir distancia'}</span>
        </button>
        <button
          type="button"
          onClick={onClear}
          className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
          title="Borrar puntos"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Instrucción */}
      {!isMeasuring && (
        <div className="bg-amber-50 rounded-lg p-2.5 border border-amber-100">
          <div className="flex items-center gap-2 text-[11px] text-amber-700 font-bold mb-1">
            <MapPin className="w-3 h-3" />
            <span>Haz clic en dos puntos del mapa</span>
          </div>
          <div className="text-[10px] text-slate-500">
            Útil para la ficha F04 (escala) y F06 (ruta rápida vs segura).
          </div>
        </div>
      )}

      {/* Resultado */}
      {isMeasuring && points.length > 0 && (
        <div className="bg-white rounded-xl p-3 shadow-xl border-2 border-indigo-200">
          {points.length === 1 && (
            <div className="text-center py-2">
              <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto text-xs font-bold mb-1">
                {points[0].label}
              </div>
              <div className="text-[11px] text-slate-600 font-bold">Punto {points[0].label} marcado</div>
              <div className="text-[10px] text-slate-400 mt-1">Haz clic en un segundo punto</div>
            </div>
          )}

          {points.length === 2 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">
                  Distancia real
                </span>
                <span className="text-xl font-black text-orange-700">
                  {formatMeters(distanceM)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-1">
                <div className="bg-slate-50 rounded-lg p-1.5">
                  <div className="text-[10px] text-slate-500 font-bold uppercase">A pie (4 km/h)</div>
                  <div className="text-sm font-bold text-slate-700">
                    {walkMinutes(distanceM, 4)} min
                  </div>
                </div>
                <div className="bg-slate-50 rounded-lg p-1.5">
                  <div className="text-[10px] text-slate-500 font-bold uppercase">Reducida (2 km/h)</div>
                  <div className="text-sm font-bold text-slate-700">
                    {walkMinutes(distanceM, 2)} min
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold">
                  {points[0].label} → {points[1].label}
                </span>
                <button
                  type="button"
                  onClick={onClear}
                  className="text-[10px] text-slate-400 hover:text-red-500 font-bold"
                >
                  <X className="w-3 h-3" /> Borrar
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
