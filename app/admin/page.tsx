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

  async function reiniciarSorteo() {
    if (!confirm("¿Estás seguro de reiniciar la tómbola? Se eliminarán todas las asignaciones y todos podrán sacar papelito de nuevo.")) {
      return;
    }

    try {
      const respuesta = await fetch("/api/sorteo", {
        method: "DELETE",
      });

      if (respuesta.ok) {
        setMensajeSorteo("🔄 Tómbola reiniciada. Todos pueden volver a participar.");
        setSorteoRealizado(false);
      }
    } catch (error) {
      setMensajeSorteo("❌ Error al reiniciar la tómbola");
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

      {/* Estado de la tómbola */}
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
              onClick={reiniciarSorteo}
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
    </main>
  );
}
