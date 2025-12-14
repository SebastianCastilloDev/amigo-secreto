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
  return (
    <section className="bg-white/5 rounded-2xl p-5 mb-6">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <span>👥</span> Participantes 
        <span className="text-white/50 font-normal">({participantes.length})</span>
      </h2>
      
      {participantes.length === 0 ? (
        <p className="text-white/50 text-sm py-4 text-center">No hay participantes aún. ¡Agrega el primero!</p>
      ) : (
        <div className="space-y-2">
          {participantes.map((p) => (
            <div 
              key={p.id} 
              className="flex items-center gap-3 bg-white/5 rounded-xl p-3 group"
            >
              <span className="flex-1 font-medium truncate">{p.nombre}</span>
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
          ))}
        </div>
      )}
    </section>
  );
}
