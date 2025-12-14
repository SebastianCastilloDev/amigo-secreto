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
    <section style={{ marginTop: "20px" }}>
      <h2>Participantes ({participantes.length})</h2>
      {participantes.length === 0 ? (
        <p>No hay participantes aún. ¡Agrega el primero!</p>
      ) : (
        <ul>
          {participantes.map((p) => (
            <li key={p.id} style={{ marginBottom: "8px" }}>
              {p.nombre}
              <button
                onClick={() => onGenerarInvitacion(p)}
                style={{ 
                  marginLeft: "10px",
                  backgroundColor: copiado === p.id ? "#4CAF50" : "#2196F3",
                  color: "white",
                  border: "none",
                  padding: "4px 8px",
                  borderRadius: "4px",
                  cursor: "pointer"
                }}
              >
                {copiado === p.id ? "✅ Copiado" : "📋 Copiar invitación"}
              </button>
              <button
                onClick={() => onEliminar(p.id)}
                style={{ marginLeft: "10px" }}
              >
                ❌
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
