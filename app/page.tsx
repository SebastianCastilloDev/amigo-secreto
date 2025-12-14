"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Participante {
  id: number;
  nombre: string;
}

export default function Inicio() {
  const [cargando, setCargando] = useState(true);
  const [participantes, setParticipantes] = useState<Participante[]>([]);
  const [seleccionado, setSeleccionado] = useState<Participante | null>(null);
  const [amigoSecreto, setAmigoSecreto] = useState<string | null>(null);
  const [buscando, setBuscando] = useState(false);
  const [error, setError] = useState("");

  const [yaParticipo, setYaParticipo] = useState(false);

  useEffect(() => {
    cargarParticipantes();
  }, []);

  async function cargarParticipantes() {
    try {
      const respuesta = await fetch("/api/participantes");
      const datos = await respuesta.json();
      setParticipantes(datos);
    } catch (error) {
      console.error("Error al cargar participantes:", error);
    } finally {
      setCargando(false);
    }
  }

  async function hacerTombola() {
    if (!seleccionado) return;

    setBuscando(true);
    setError("");
    setAmigoSecreto(null);

    try {
      // POST para hacer el sorteo individual
      const respuesta = await fetch("/api/sorteo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ participanteId: seleccionado.id }),
      });

      const datos = await respuesta.json();

      if (respuesta.ok) {
        setAmigoSecreto(datos.recibeNombre);
        setYaParticipo(datos.yaAsignado);
      } else {
        setError(datos.error || "Error al realizar el sorteo");
      }
    } catch (error) {
      setError("Error de conexión");
    } finally {
      setBuscando(false);
    }
  }

  function reiniciar() {
    setSeleccionado(null);
    setAmigoSecreto(null);
    setError("");
  }

  if (cargando) {
    return (
      <main>
        <h1>Amigo Secreto 🎁</h1>
        <div className="spinner"></div>
        <p>Cargando...</p>
      </main>
    );
  }

  // Si ya vio su amigo secreto
  if (amigoSecreto) {
    return (
      <main>
        <h1>Amigo Secreto 🎁</h1>
        <div style={{ marginTop: "30px", textAlign: "center" }}>
          {yaParticipo ? (
            <p style={{ fontSize: "16px", color: "#666" }}>
              Ya habías participado antes. Tu amigo secreto sigue siendo:
            </p>
          ) : (
            <p style={{ fontSize: "18px" }}>
              🎉 <strong>{seleccionado?.nombre}</strong>, sacaste de la tómbola a:
            </p>
          )}
          <p style={{ fontSize: "32px", marginTop: "20px" }}>
            🎁 <strong>{amigoSecreto}</strong> 🎁
          </p>
          <p style={{ marginTop: "20px", color: "#666" }}>
            ¡No se lo digas a nadie! 🤫
          </p>
          <button onClick={reiniciar} style={{ marginTop: "30px" }}>
            ← Volver
          </button>
        </div>
      </main>
    );
  }

  // Pantalla principal: ¿Quién eres?
  return (
    <main>
      <h1>Amigo Secreto 🎁</h1>

      {participantes.length === 0 ? (
        <div style={{ marginTop: "20px" }}>
          <p>No hay participantes registrados aún.</p>
          <Link href="/admin">Ir a configurar →</Link>
        </div>
      ) : (
        <div style={{ marginTop: "30px" }}>
          <h2>¿Quién eres?</h2>
          <p>Selecciona tu nombre para ver a quién le regalas:</p>

          <div style={{ marginTop: "20px" }}>
            {participantes.map((p) => (
              <button
                key={p.id}
                onClick={() => setSeleccionado(p)}
                style={{
                  display: "block",
                  width: "100%",
                  padding: "15px",
                  marginBottom: "10px",
                  fontSize: "18px",
                  backgroundColor: seleccionado?.id === p.id ? "#4CAF50" : "#f0f0f0",
                  color: seleccionado?.id === p.id ? "white" : "black",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                {p.nombre}
              </button>
            ))}
          </div>

          {seleccionado && (
            <button
              onClick={hacerTombola}
              disabled={buscando}
              style={{
                marginTop: "20px",
                padding: "15px 30px",
                fontSize: "18px",
                backgroundColor: "#2196F3",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              {buscando ? "Sacando papelito..." : "🎰 ¡Sacar de la tómbola!"}
            </button>
          )}

          {error && (
            <p style={{ marginTop: "20px", color: "red" }}>{error}</p>
          )}
        </div>
      )}

      <div style={{ marginTop: "40px", borderTop: "1px solid #ccc", paddingTop: "20px" }}>
        <Link href="/admin">⚙️ Administrar participantes</Link>
      </div>
    </main>
  );
}
