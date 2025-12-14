"use client";

import type { Participante } from "../tipos";

interface Props {
  participantes: Participante[];
  copiado: number | null;
  onGenerarInvitacion: (participante: Participante) => void;
  onEliminar: (id: number) => void;
}

export function ListaParticipantes({
  participantes,
  copiado,
  onGenerarInvitacion,
  onEliminar,
}: Props) {
  const asignados = participantes.filter(p => p.amigoSecreto).length;
  
  return (
    <section className="bg-white/5 rounded-2xl p-5 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <span>👥</span> Participantes 
          <span className="text-white/50 font-normal">({participantes.length})</span>
        </h2>
        {participantes.length > 0 && (
          <span className={`text-xs px-2 py-1 rounded-full ${
            asignados === participantes.length 
              ? "bg-emerald-500/20 text-emerald-300" 
              : "bg-amber-500/20 text-amber-300"
          }`}>
            {asignados}/{participantes.length} asignados
          </span>
        )}
      </div>
      
      {participantes.length === 0 ? (
        <p className="text-white/50 text-sm py-4 text-center">No hay participantes aún. ¡Agrega el primero!</p>
      ) : (
        <div className="space-y-2">
          {participantes.map((p) => (
            <div 
              key={p.id} 
              className="bg-white/5 rounded-xl p-3 group"
            >
              <div className="flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <span className="font-medium block truncate">{p.nombre}</span>
                  {p.amigoSecreto ? (
                    <span className="text-xs text-emerald-400 flex items-center gap-1">
                      <span>🎁</span> Regala a: <strong>{p.amigoSecreto}</strong>
                    </span>
                  ) : (
                    <span className="text-xs text-white/30">Sin asignar aún</span>
                  )}
                </div>
                <button
                  onClick={() => onGenerarInvitacion(p)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors shrink-0 ${
                    copiado === p.id 
                      ? "bg-emerald-500 text-white" 
                      : "bg-blue-500 hover:bg-blue-600 text-white"
                  }`}
                >
                  {copiado === p.id ? "✓ Copiado" : "📋 Copiar link"}
                </button>
                <button
                  onClick={() => onEliminar(p.id)}
                  className="p-1.5 text-white/30 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  title="Eliminar"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
