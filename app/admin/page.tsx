"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Participante {
  id: number;
  nombre: string;
}

export default function Admin() {
  const [cargando, setCargando] = useState(true);
  const [participantes, setParticipantes] = useState<Participante[]>([]);
  const [nuevoNombre, setNuevoNombre] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [sorteando, setSorteando] = useState(false);
  const [mensajeSorteo, setMensajeSorteo] = useState("");
  const [sorteoRealizado, setSorteoRealizado] = useState(false);
  const [errorAgregar, setErrorAgregar] = useState("");

  useEffect(() => {
    cargarDatos();
  }, []);

  async function cargarDatos() {
    await Promise.all([cargarParticipantes(), verificarEstadoSorteo()]);
    setCargando(false);
  }

  async function verificarEstadoSorteo() {
    try {
      const respuesta = await fetch("/api/sorteo/estado");
      const datos = await respuesta.json();
      setSorteoRealizado(datos.sorteoRealizado);
    } catch (error) {
      console.error("Error al verificar estado:", error);
    }
  }

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

  async function agregarParticipante(e: React.FormEvent) {
    e.preventDefault();
    if (!nuevoNombre.trim() || guardando) return;

    setGuardando(true);
    setErrorAgregar("");
    
    try {
      const respuesta = await fetch("/api/participantes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: nuevoNombre }),
      });

      const datos = await respuesta.json();

      if (respuesta.ok) {
        setNuevoNombre("");
        cargarParticipantes();
      } else {
        setErrorAgregar(datos.error || "Error al agregar");
      }
    } catch (error) {
      console.error("Error al agregar:", error);
      setErrorAgregar("Error de conexión");
    } finally {
      setGuardando(false);
    }
  }

  async function eliminarParticipante(id: number) {
    try {
      const respuesta = await fetch("/api/participantes", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (respuesta.ok) {
        cargarParticipantes();
      }
    } catch (error) {
      console.error("Error al eliminar:", error);
    }
  }

  async function hacerSorteo() {
    if (participantes.length < 2) {
      setMensajeSorteo("❌ Se necesitan al menos 2 participantes");
      return;
    }

    setSorteando(true);
    setMensajeSorteo("");

    try {
      const respuesta = await fetch("/api/sorteo", {
        method: "POST",
      });

      const datos = await respuesta.json();

      if (respuesta.ok) {
        setMensajeSorteo("✅ ¡Sorteo realizado con éxito!");
        setSorteoRealizado(true);
      } else {
        setMensajeSorteo(`❌ ${datos.error}`);
      }
    } catch (error) {
      setMensajeSorteo("❌ Error al realizar el sorteo");
    } finally {
      setSorteando(false);
    }
  }

  async function reiniciarSorteo() {
    if (!confirm("¿Estás seguro de reiniciar el sorteo? Se eliminarán todas las asignaciones.")) {
      return;
    }

    try {
      const respuesta = await fetch("/api/sorteo", {
        method: "DELETE",
      });

      if (respuesta.ok) {
        setMensajeSorteo("🔄 Sorteo reiniciado. Puedes hacer uno nuevo.");
        setSorteoRealizado(false);
      }
    } catch (error) {
      setMensajeSorteo("❌ Error al reiniciar el sorteo");
    }
  }

  if (cargando) {
    return (
      <main>
        <h1>⚙️ Administrar Amigo Secreto</h1>
        <div className="spinner"></div>
        <p>Cargando...</p>
      </main>
    );
  }

  return (
    <main>
      <h1>⚙️ Administrar Amigo Secreto</h1>
      
      <Link href="/">← Volver al inicio</Link>

      {/* Formulario para agregar participante */}
      <section style={{ marginTop: "20px" }}>
        <h2>Agregar Participante</h2>
        <form onSubmit={agregarParticipante}>
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

      {/* Lista de participantes */}
      <section style={{ marginTop: "20px" }}>
        <h2>Participantes ({participantes.length})</h2>
        {participantes.length === 0 ? (
          <p>No hay participantes aún. ¡Agrega el primero!</p>
        ) : (
          <ul>
            {participantes.map((p) => (
              <li key={p.id}>
                {p.nombre}
                <button
                  onClick={() => eliminarParticipante(p.id)}
                  style={{ marginLeft: "10px" }}
                >
                  ❌
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Botón de sorteo */}
      <section style={{ marginTop: "30px" }}>
        <h2>🎲 Realizar Sorteo</h2>
        <p>Una vez que todos estén agregados, haz el sorteo.</p>
        <button
          onClick={hacerSorteo}
          disabled={sorteando || participantes.length < 2}
          style={{ padding: "10px 20px", fontSize: "16px" }}
        >
          {sorteando ? "Sorteando..." : "🎲 ¡Hacer el Sorteo!"}
        </button>
        {mensajeSorteo && <p style={{ marginTop: "10px" }}>{mensajeSorteo}</p>}
      </section>
    </main>
  );
}
