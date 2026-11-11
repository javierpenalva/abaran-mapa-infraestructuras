import React from 'react';
import { X, Printer, Download, ShieldCheck, Phone, Check, MapPin, AlertTriangle } from 'lucide-react';
import { InfrastructureItem, RiskZone, EvacuationRoute } from '../types/infrastructure';
import { CATEGORIES_META } from '../data/abaranData';

interface ExportReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  infrastructures: InfrastructureItem[];
  riskZones: RiskZone[];
  evacuationRoutes: EvacuationRoute[];
}

export const ExportReportModal: React.FC<ExportReportModalProps> = ({
  isOpen,
  onClose,
  infrastructures,
  riskZones,
  evacuationRoutes,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white text-slate-900 rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-300 overflow-hidden">
        {/* Header with Print Controls */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-400" />
            <div>
              <h2 className="font-bold text-sm">Dossier Oficial de Infraestructuras Críticas</h2>
              <p className="text-[11px] text-slate-400">Término Municipal de Abarán (Región de Murcia)</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors shadow"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir / PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Report Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-slate-800 font-sans print:p-0 print:text-black">
          {/* Official Document Banner */}
          <div className="border-b-2 border-slate-900 pb-4 flex items-start justify-between">
            <div>
              <div className="text-[10px] font-bold tracking-widest uppercase text-slate-500">
                Plan de Emergencia Municipal (PEMU) • Catálogo PIC
              </div>
              <h1 className="text-xl font-black text-slate-900 uppercase tracking-tight mt-0.5">
                Inventario Municipal de Infraestructuras Críticas
              </h1>
              <p className="text-xs text-slate-600 font-medium">
                Ayuntamiento de Abarán • Valle de Ricote • Región de Murcia
              </p>
            </div>
            <div className="text-right text-[11px] text-slate-500">
              <span className="font-mono block font-bold text-slate-800">FECHA: {new Date().toISOString().slice(0, 10)}</span>
              <span className="block">Total Instalaciones: {infrastructures.length}</span>
              <span className="inline-block px-2 py-0.5 mt-1 rounded bg-slate-100 text-slate-800 font-bold border border-slate-300">
                Nivel Difusión: Protección Civil
              </span>
            </div>
          </div>

          {/* Criticality Summary Matrix */}
          <div>
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700 mb-2 border-b border-slate-200 pb-1">
              1. Resumen de Criticidad y Clasificación
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <div className="p-2.5 rounded-lg border border-red-200 bg-red-50">
                <span className="text-[10px] font-bold text-red-800 uppercase block">Nivel 1 (Muy Crítica)</span>
                <span className="text-lg font-black text-red-600 block">
                  {infrastructures.filter(i => i.criticality === 'CRITICAL_1').length} activos
                </span>
                <span className="text-[10px] text-red-700">Sin alternativa inmediata; impacto catastrófico.</span>
              </div>
              <div className="p-2.5 rounded-lg border border-amber-200 bg-amber-50">
                <span className="text-[10px] font-bold text-amber-800 uppercase block">Nivel 2 (Alta Criticidad)</span>
                <span className="text-lg font-black text-amber-600 block">
                  {infrastructures.filter(i => i.criticality === 'HIGH_2').length} activos
                </span>
                <span className="text-[10px] text-amber-700">Sustituibles con graves dificultades.</span>
              </div>
              <div className="p-2.5 rounded-lg border border-blue-200 bg-blue-50">
                <span className="text-[10px] font-bold text-blue-800 uppercase block">Nivel 3 (Media / Soporte)</span>
                <span className="text-lg font-black text-blue-600 block">
                  {infrastructures.filter(i => i.criticality === 'MEDIUM_3').length} activos
                </span>
                <span className="text-[10px] text-blue-700">Equipamientos complementarios y albergues.</span>
              </div>
            </div>
          </div>

          {/* Directory Table */}
          <div>
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700 mb-2 border-b border-slate-200 pb-1">
              2. Directorio Detallado de Infraestructuras Catalogadas
            </h3>
            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-left border-collapse text-[10px]">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 uppercase font-bold">
                    <th className="p-2">Código</th>
                    <th className="p-2">Nombre de la Instalación</th>
                    <th className="p-2">Sector</th>
                    <th className="p-2">Criticidad</th>
                    <th className="p-2">Ubicación / Pedanía</th>
                    <th className="p-2">Coordenadas</th>
                    <th className="p-2">Emergencia</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-normal">
                  {infrastructures.map((item) => {
                    const meta = CATEGORIES_META[item.category];
                    return (
                      <tr key={item.id} className="hover:bg-slate-50">
                        <td className="p-2 font-mono font-bold text-slate-600">{item.code}</td>
                        <td className="p-2 font-semibold text-slate-900">{item.name}</td>
                        <td className="p-2 text-slate-600">{meta.shortName}</td>
                        <td className="p-2">
                          {item.criticality === 'CRITICAL_1' && <span className="text-red-700 font-bold">Nivel 1</span>}
                          {item.criticality === 'HIGH_2' && <span className="text-amber-700 font-bold">Nivel 2</span>}
                          {item.criticality === 'MEDIUM_3' && <span className="text-blue-700 font-bold">Nivel 3</span>}
                        </td>
                        <td className="p-2 text-slate-600">{item.pedania || 'Casco Urbano'}</td>
                        <td className="p-2 font-mono text-[9px] text-slate-500">
                          {item.coordinates[0].toFixed(4)}, {item.coordinates[1].toFixed(4)}
                        </td>
                        <td className="p-2 font-bold text-slate-800">{item.emergencyPhone}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Risk Zones & Evacuation */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700 mb-2 border-b border-slate-200 pb-1">
                3. Zonas de Riesgo Especial Identificadas
              </h3>
              <ul className="space-y-1.5 text-[11px]">
                {riskZones.map((rz) => (
                  <li key={rz.id} className="p-2 bg-slate-50 border border-slate-200 rounded">
                    <strong className="text-slate-900">{rz.name}</strong>
                    <p className="text-slate-600 text-[10px] mt-0.5">{rz.description}</p>
                    <span className="text-[10px] text-blue-700 font-semibold mt-1 block">
                      Afectación estimada: ~{rz.affectedPopulationEst} hab.
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700 mb-2 border-b border-slate-200 pb-1">
                4. Rutas Troncales de Evacuación
              </h3>
              <ul className="space-y-1.5 text-[11px]">
                {evacuationRoutes.map((er) => (
                  <li key={er.id} className="p-2 bg-slate-50 border border-slate-200 rounded">
                    <strong className="text-slate-900">{er.name}</strong>
                    <p className="text-slate-600 text-[10px] mt-0.5">{er.destination}</p>
                    <span className="text-[10px] text-emerald-700 font-semibold mt-1 block">
                      Capacidad: {er.estimatedCapacityVehPerHour} veh/hora
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
