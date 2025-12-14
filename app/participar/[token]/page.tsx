"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function Participar() {
  const params = useParams();
  const token = params.token as string;

  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [nombre, setNombre] = useState("");
  const [participanteId, setParticipanteId] = useState<number | null>(null);
  const [amigoSecreto, setAmigoSecreto] = useState<string | null>(null);
  const [yaParticipo, setYaParticipo] = useState(false);
  const [sacando, setSacando] = useState(false);

  useEffect(() => {
    verificarToken();
  }, [token]);

  async function verificarToken() {
    try {
      const respuesta = await fetch(`/api/participar?token=${token}`);
      const datos = await respuesta.json();

      if (respuesta.ok) {
        setNombre(datos.nombre);
        setParticipanteId(datos.id);
        setYaParticipo(datos.yaParticipo);
        setAmigoSecreto(datos.amigoSecreto);
      } else {
        setError(datos.error || "Invitación no válida");
      }
    } catch (err) {
      setError("Error de conexión");
    } finally {
      setCargando(false);
    }
  }

  async function sacarDeTombola() {
    if (!participanteId) return;

    setSacando(true);
    try {
      const respuesta = await fetch("/api/sorteo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ participanteId }),
      });

      const datos = await respuesta.json();

      if (respuesta.ok) {
        setAmigoSecreto(datos.recibeNombre);
        setYaParticipo(true);
      } else {
        setError(datos.error || "Error al sacar de la tómbola");
      }
    } catch (err) {
      setError("Error de conexión");
    } finally {
      setSacando(false);
    }
  }

  if (cargando) {
    return (
      <main>
        <h1>Amigo Secreto 🎁</h1>
        <div className="spinner"></div>
        <p>Verificando invitación...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main>
        <h1>Amigo Secreto 🎁</h1>
        <div style={{ marginTop: "30px", textAlign: "center" }}>
          <p style={{ fontSize: "48px" }}>❌</p>
          <p style={{ color: "red", fontSize: "18px" }}>{error}</p>
          <p style={{ marginTop: "10px", color: "#666" }}>
            Pide a quien organiza que te envíe un nuevo link.
          </p>
        </div>
      </main>
    );
  }

  // Ya tiene asignación
  if (amigoSecreto) {
    return (
      <main>
        <h1>Amigo Secreto 🎁</h1>
        <div style={{ marginTop: "30px", textAlign: "center" }}>
          <p style={{ fontSize: "18px" }}>
            ¡Hola <strong>{nombre}</strong>!
          </p>
          {yaParticipo ? (
            <p style={{ color: "#666", marginTop: "10px" }}>Tu amigo secreto es:</p>
          ) : (
            <p style={{ color: "#666", marginTop: "10px" }}>🎉 Sacaste de la tómbola a:</p>
          )}
          <p style={{ fontSize: "36px", marginTop: "20px" }}>
            🎁 <strong>{amigoSecreto}</strong> 🎁
          </p>
          <p style={{ marginTop: "30px", color: "#666" }}>
            ¡No se lo digas a nadie! 🤫
          </p>
        </div>
      </main>
    );
  }

  // Puede sacar de la tómbola
  return (
    <main>
      <h1>Amigo Secreto 🎁</h1>
      <div style={{ marginTop: "30px", textAlign: "center" }}>
        <p style={{ fontSize: "18px" }}>
          ¡Hola <strong>{nombre}</strong>!
        </p>
        <p style={{ marginTop: "10px", color: "#666" }}>
          Es hora de sacar tu papelito de la tómbola...
        </p>

        <button
          onClick={sacarDeTombola}
          disabled={sacando}
          style={{
            marginTop: "30px",
            padding: "20px 40px",
            fontSize: "20px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "10px",
            cursor: sacando ? "not-allowed" : "pointer",
          }}
        >
          {sacando ? "Sacando..." : "🎰 ¡Sacar de la tómbola!"}
        </button>
      </div>
    </main>
  );
}
