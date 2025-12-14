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
    <section style={{ marginTop: "20px" }}>
      <h2>Agregar Participante</h2>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          value={nuevoNombre}
          onChange={(e) => setNuevoNombre(e.target.value)}
          placeholder="Nombre del participante"
          disabled={guardando}
        />
        <button type="submit" disabled={guardando || !nuevoNombre.trim()}>
          {guardando ? "Agregando..." : "Agregar"}
        </button>
      </form>
      {errorAgregar && <p style={{ color: "red", marginTop: "5px" }}>{errorAgregar}</p>}
    </section>
  );
}
