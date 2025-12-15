"use client";

interface Props {
  nuevoNombre: string;
  setNuevoNombre: (nombre: string) => void;
  guardando: boolean;
  errorAgregar: string;
  onSubmit: (e: React.FormEvent) => void;
}

export function FormularioParticipante({
  nuevoNombre,
  setNuevoNombre,
  guardando,
  errorAgregar,
  onSubmit,
}: Props) {
  return (
    <section className="bg-white/5 rounded-2xl p-5 mb-6">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <span>➕</span> Agregar Participante
      </h2>
      <form onSubmit={onSubmit} className="flex gap-3">
        <input
          type="text"
          value={nuevoNombre}
          onChange={(e) => setNuevoNombre(e.target.value)}
          placeholder="Nombre del participante"
          disabled={guardando}
          className="flex-1 px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-white/40 transition-colors"
        />
        <button 
          type="submit" 
          disabled={guardando || !nuevoNombre.trim()}
          className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors shrink-0"
        >
          {guardando ? "..." : "Agregar"}
        </button>
      </form>
      {errorAgregar && <p className="mt-3 text-red-400 text-sm">{errorAgregar}</p>}
    </section>
  );
}
