"use client";

interface Props {
  sorteoRealizado: boolean;
  mensajeSorteo: string;
  realizandoSorteo: boolean;
  totalParticipantes: number;
  onRealizarSorteo: () => void;
  onReiniciar: () => void;
}

export function EstadoTombola({
  sorteoRealizado,
  mensajeSorteo,
  realizandoSorteo,
  totalParticipantes,
  onRealizarSorteo,
  onReiniciar,
}: Props) {
  const puedeRealizarSorteo = totalParticipantes >= 2 && !sorteoRealizado;

  return (
    <section className="bg-white/5 rounded-2xl p-5 mb-6">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <span>🎰</span> Sorteo
      </h2>
      
      {sorteoRealizado ? (
        <div>
          <div className="bg-emerald-500/20 border border-emerald-500/30 rounded-xl p-4 mb-4">
            <p className="text-emerald-300 text-sm">✅ Sorteo realizado. Los participantes pueden ver su asignación con su enlace personal.</p>
          </div>
          
          <button
            onClick={onReiniciar}
            className="w-full py-3 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-300 rounded-xl transition-colors text-sm"
          >
            🗑️ Reiniciar sorteo (borrar asignaciones)
          </button>
          
          {mensajeSorteo && <p className="mt-3 text-white/60 text-sm">{mensajeSorteo}</p>}
        </div>
      ) : (
        <div>
          {totalParticipantes < 2 ? (
            <div className="bg-amber-500/20 border border-amber-500/30 rounded-xl p-4 mb-4">
              <p className="text-amber-300 text-sm">⚠️ Necesitas al menos 2 participantes para realizar el sorteo.</p>
            </div>
          ) : (
            <div className="bg-blue-500/20 border border-blue-500/30 rounded-xl p-4 mb-4">
              <p className="text-blue-300 text-sm">🎲 Listo para sortear. Tienes {totalParticipantes} participantes.</p>
            </div>
          )}
          
          <button
            onClick={onRealizarSorteo}
            disabled={!puedeRealizarSorteo || realizandoSorteo}
            className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 disabled:bg-white/10 disabled:text-white/30 text-white font-medium rounded-xl transition-colors"
          >
            {realizandoSorteo ? "Realizando sorteo..." : "🎉 Realizar Sorteo"}
          </button>
          
          {mensajeSorteo && <p className="mt-3 text-white/60 text-sm">{mensajeSorteo}</p>}
        </div>
      )}
    </section>
  );
}
