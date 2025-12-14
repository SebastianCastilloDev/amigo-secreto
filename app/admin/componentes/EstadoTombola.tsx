"use client";

interface Props {
  sorteoRealizado: boolean;
  mensajeSorteo: string;
  onReiniciar: () => void;
}

export function EstadoTombola({
  sorteoRealizado,
  mensajeSorteo,
  onReiniciar,
}: Props) {
  return (
    <section className="bg-white/5 rounded-2xl p-5 mb-6">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <span>🎰</span> Estado de la Tómbola
      </h2>
      
      {sorteoRealizado ? (
        <div>
          <div className="bg-emerald-500/20 border border-emerald-500/30 rounded-xl p-4 mb-4">
            <p className="text-emerald-300 text-sm">✅ Algunos participantes ya sacaron su papelito de la tómbola.</p>
          </div>
          
          <button
            onClick={onReiniciar}
            className="w-full py-3 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-300 rounded-xl transition-colors text-sm"
          >
            🗑️ Reiniciar tómbola (borrar asignaciones)
          </button>
          
          {mensajeSorteo && <p className="mt-3 text-white/60 text-sm">{mensajeSorteo}</p>}
        </div>
      ) : (
        <p className="text-white/50 text-sm">
          Nadie ha sacado papelito aún. Los participantes verán su amigo secreto cuando accedan con su enlace personal.
        </p>
      )}
    </section>
  );
}
