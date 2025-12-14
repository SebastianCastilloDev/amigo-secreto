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
    <section style={{ marginTop: "30px" }}>
      <h2>🎰 Estado de la Tómbola</h2>
      
      {sorteoRealizado ? (
        <div>
          <p style={{ 
            backgroundColor: "#e8f5e9", 
            padding: "10px", 
            borderRadius: "5px",
            marginBottom: "15px" 
          }}>
            ✅ Algunos participantes ya sacaron su papelito de la tómbola.
          </p>
          
          <button
            onClick={onReiniciar}
            style={{ 
              padding: "10px 20px", 
              fontSize: "16px",
              backgroundColor: "#ffebee",
              border: "1px solid #f44336",
              cursor: "pointer"
            }}
          >
            🗑️ Reiniciar tómbola (borrar todas las asignaciones)
          </button>
          
          {mensajeSorteo && <p style={{ marginTop: "10px" }}>{mensajeSorteo}</p>}
        </div>
      ) : (
        <p style={{ color: "#666" }}>
          Nadie ha sacado papelito aún. Cuando los participantes entren a la página principal, 
          cada uno sacará su amigo secreto de la tómbola.
        </p>
      )}
    </section>
  );
}
