"use client";

import type { Incidente } from "../tipos";

interface Props {
  incidentes: Incidente[];
  verIncidentes: boolean;
  setVerIncidentes: (ver: boolean) => void;
}

export function SeccionIncidentes({
  incidentes,
  verIncidentes,
  setVerIncidentes,
}: Props) {
  return (
    <section className="bg-white/5 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <span>🚨</span> Incidentes 
          <span className="text-white/50 font-normal">({incidentes.length})</span>
        </h2>
        <button
          onClick={() => setVerIncidentes(!verIncidentes)}
          className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
            verIncidentes 
              ? "bg-red-500 text-white" 
              : "bg-amber-500 hover:bg-amber-600 text-white"
          }`}
        >
          {verIncidentes ? "Ocultar" : "Ver"}
        </button>
      </div>

      {verIncidentes && (
        <div className="space-y-4">
          {incidentes.length === 0 ? (
            <p className="text-white/50 text-sm text-center py-4">No hay incidentes registrados 🎉</p>
          ) : (
            incidentes.map((inc) => (
              <TarjetaIncidente key={inc.id} incidente={inc} />
            ))
          )}
        </div>
      )}
    </section>
  );
}

function TarjetaIncidente({ incidente: inc }: { incidente: Incidente }) {
  return (
    <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
      <div className="flex gap-4 flex-wrap">
        {/* Foto del intruso */}
        <div className="shrink-0">
          {inc.foto ? (
            <img 
              src={inc.foto} 
              alt="Intruso" 
              className="w-32 h-24 object-cover rounded-lg border-2 border-red-500/50"
            />
          ) : (
            <div className="w-32 h-24 bg-red-500/20 flex items-center justify-center rounded-lg border-2 border-red-500/30 text-4xl">
              👤
            </div>
          )}
        </div>

        {/* Datos del incidente */}
        <div className="flex-1 min-w-0 text-sm space-y-1">
          <p className="text-red-300 font-medium mb-2">
            📅 {new Date(inc.fecha).toLocaleString()}
          </p>
          <p className="text-white/70"><span className="text-white/40">IP:</span> {inc.ip || "—"}</p>
          <p className="text-white/70"><span className="text-white/40">Ubicación:</span> {inc.ubicacion || "—"}</p>
          <p className="text-white/70"><span className="text-white/40">Plataforma:</span> {inc.plataforma || "—"}</p>
          <p className="text-white/70"><span className="text-white/40">Intentos:</span> {inc.intentos}</p>
          {inc.passwords && inc.passwords.length > 0 && (
            <p className="text-white/70">
              <span className="text-white/40">Contraseñas:</span>{" "}
              <code className="text-red-300 text-xs">
                {inc.passwords.map(p => `"${p}"`).join(", ")}
              </code>
            </p>
          )}
        </div>

        {/* Mapa pequeño */}
        {inc.latitud && inc.longitud && (
          <div className="shrink-0">
            <iframe
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${inc.longitud - 0.005}%2C${inc.latitud - 0.005}%2C${inc.longitud + 0.005}%2C${inc.latitud + 0.005}&layer=mapnik&marker=${inc.latitud}%2C${inc.longitud}`}
              className="w-36 h-24 border border-white/20 rounded-lg"
            />
            <p className="text-[10px] text-white/40 text-center mt-1">
              {inc.latitud.toFixed(4)}, {inc.longitud.toFixed(4)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
