"use client";

import { useEffect, useState } from "react";

export default function Inicio() {
  const [cargando, setCargando] = useState(true);
  const [conectado, setConectado] = useState(false);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    verificarConexion();
  }, []);

  async function verificarConexion() {
    try {
      const respuesta = await fetch("/api/verificar-conexion");
      const datos = await respuesta.json();
      
      setConectado(datos.conectado);
      setMensaje(datos.mensaje);
    } catch (error) {
      setConectado(false);
      setMensaje("Error al verificar la conexión 😢");
    } finally {
      setCargando(false);
    }
  }

  if (cargando) {
    return (
      <main>
        <h1>Amigo Secreto 🎁</h1>
        <div style={{ marginTop: "20px" }}>
          <div className="spinner"></div>
          <p>Conectando a la base de datos...</p>
        </div>
      </main>
    );
  }

  if (!conectado) {
    return (
      <main>
        <h1>Amigo Secreto 🎁</h1>
        <div style={{ marginTop: "20px", color: "red" }}>
          <p>😢 {mensaje}</p>
          <p>Por favor, verifica tu conexión e intenta más tarde.</p>
        </div>
      </main>
    );
  }

  return (
    <main>
      <h1>Amigo Secreto 🎁</h1>
      <p style={{ marginTop: "20px", color: "green" }}>✅ {mensaje}</p>
    </main>
  );
}
