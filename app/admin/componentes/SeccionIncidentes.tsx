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
    <section style={{ marginTop: "40px", borderTop: "2px solid #f44336", paddingTop: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>🚨 Incidentes de Seguridad ({incidentes.length})</h2>
        <button
          onClick={() => setVerIncidentes(!verIncidentes)}
          style={{
            padding: "8px 16px",
            backgroundColor: verIncidentes ? "#f44336" : "#ff9800",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          {verIncidentes ? "Ocultar" : "Ver incidentes"}
        </button>
      </div>

      {verIncidentes && (
        <div style={{ marginTop: "20px" }}>
          {incidentes.length === 0 ? (
            <p style={{ color: "#666" }}>No hay incidentes registrados. ¡Nadie ha intentado hackear! 🎉</p>
          ) : (
            <div>
              {incidentes.map((inc) => (
                <TarjetaIncidente key={inc.id} incidente={inc} />
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}

function TarjetaIncidente({ incidente: inc }: { incidente: Incidente }) {
  return (
    <div 
      style={{
        border: "1px solid #f44336",
        borderRadius: "8px",
        padding: "15px",
        marginBottom: "15px",
        backgroundColor: "#fff5f5",
      }}
    >
      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        {/* Foto del intruso */}
        <div>
          {inc.foto ? (
            <img 
              src={inc.foto} 
              alt="Intruso" 
              style={{ 
                width: "160px", 
                height: "120px", 
                objectFit: "cover",
                borderRadius: "5px",
                border: "2px solid #f44336",
              }} 
            />
          ) : (
            <div style={{
              width: "160px",
              height: "120px",
              backgroundColor: "#ffebee",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "5px",
              border: "2px solid #f44336",
              fontSize: "40px",
            }}>
              👤
            </div>
          )}
        </div>

        {/* Datos del incidente */}
        <div style={{ flex: 1, minWidth: "200px" }}>
          <p style={{ fontWeight: "bold", color: "#d32f2f", marginBottom: "10px" }}>
            📅 {new Date(inc.fecha).toLocaleString()}
          </p>
          <p><strong>IP:</strong> {inc.ip || "No capturada"}</p>
          <p><strong>Ubicación:</strong> {inc.ubicacion || "No disponible"}</p>
          <p><strong>Plataforma:</strong> {inc.plataforma || "Desconocida"}</p>
          <p><strong>Navegador:</strong> {inc.navegador || "Desconocido"}</p>
          <p><strong>Intentos fallidos:</strong> {inc.intentos}</p>
          {inc.passwords && inc.passwords.length > 0 && (
            <p>
              <strong>Contraseñas probadas:</strong>{" "}
              <span style={{ color: "#d32f2f", fontFamily: "monospace" }}>
                {inc.passwords.map(p => `"${p}"`).join(", ")}
              </span>
            </p>
          )}
        </div>

        {/* Mapa pequeño */}
        {inc.latitud && inc.longitud && (
          <div>
            <iframe
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${inc.longitud - 0.005}%2C${inc.latitud - 0.005}%2C${inc.longitud + 0.005}%2C${inc.latitud + 0.005}&layer=mapnik&marker=${inc.latitud}%2C${inc.longitud}`}
              style={{
                width: "180px",
                height: "120px",
                border: "1px solid #ccc",
                borderRadius: "5px",
              }}
            />
            <p style={{ fontSize: "10px", color: "#666", textAlign: "center" }}>
              {inc.latitud.toFixed(4)}, {inc.longitud.toFixed(4)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
