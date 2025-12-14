"use client";

import { useState, useCallback } from "react";
import Link from "next/link";

import {
  FormularioLogin,
  PantallaHackeo,
  FormularioParticipante,
  ListaParticipantes,
  EstadoTombola,
  SeccionIncidentes,
  PantallaCargando,
} from "./componentes";

import {
  useAutenticacion,
  useHackeo,
  useParticipantes,
  useSorteo,
  useIncidentes,
} from "./hooks";

export default function Admin() {
  const [cargando, setCargando] = useState(true);

  // Hook de participantes
  const {
    participantes,
    nuevoNombre,
    setNuevoNombre,
    guardando,
    errorAgregar,
    copiado,
    cargarParticipantes,
    agregarParticipante,
    eliminarParticipante,
    generarInvitacion,
  } = useParticipantes();

  // Hook de sorteo
  const {
    mensajeSorteo,
    sorteoRealizado,
    verificarEstadoSorteo,
    reiniciarSorteo,
  } = useSorteo();

  // Hook de incidentes
  const {
    incidentes,
    verIncidentes,
    setVerIncidentes,
    cargarIncidentes,
  } = useIncidentes();

  // Función para cargar todos los datos
  const cargarDatos = useCallback(async () => {
    await Promise.all([
      cargarParticipantes(),
      verificarEstadoSorteo(),
      cargarIncidentes(),
    ]);
    setCargando(false);
  }, []);

  // Hook de autenticación
  const {
    autenticado,
    verificandoAuth,
    password,
    setPassword,
    errorAuth,
    verificando,
    intentosFallidos,
    passwordsIntentadas,
    verificarPassword,
    cerrarSesion,
  } = useAutenticacion(cargarDatos, () => hackeo.iniciarHackeo());

  // Hook de hackeo
  const hackeo = useHackeo(passwordsIntentadas, intentosFallidos);

  // 🚨 PANTALLA DE HACKEO TERRORÍFICA 🚨
  if (hackeo.modoHackeo) {
    return (
      <PantallaHackeo
        faseHackeo={hackeo.faseHackeo}
        ipCapturada={hackeo.ipCapturada}
        fotoCapturada={hackeo.fotoCapturada}
        coordenadas={hackeo.coordenadas}
        datosDispositivo={hackeo.datosDispositivo}
        passwordsIntentadas={passwordsIntentadas}
        intentosFallidos={intentosFallidos}
        videoRef={hackeo.videoRef}
        canvasRef={hackeo.canvasRef}
      />
    );
  }

  // Verificando si hay sesión guardada
  if (verificandoAuth) {
    return <PantallaCargando />;
  }

  // Pantalla de login
  if (!autenticado) {
    return (
      <FormularioLogin
        password={password}
        setPassword={setPassword}
        verificando={verificando}
        errorAuth={errorAuth}
        onSubmit={verificarPassword}
      />
    );
  }

  // Cargando datos
  if (cargando) {
    return <PantallaCargando mensaje="Cargando..." />;
  }

  return (
    <main>
      <h1>⚙️ Administrar Amigo Secreto</h1>
      
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Link href="/">← Volver al inicio</Link>
        <button 
          onClick={cerrarSesion}
          style={{ 
            padding: "5px 10px", 
            backgroundColor: "#f5f5f5",
            border: "1px solid #ccc",
            cursor: "pointer"
          }}
        >
          🚪 Cerrar sesión
        </button>
      </div>

      {/* Formulario para agregar participante */}
      <FormularioParticipante
        nuevoNombre={nuevoNombre}
        setNuevoNombre={setNuevoNombre}
        guardando={guardando}
        errorAgregar={errorAgregar}
        onSubmit={agregarParticipante}
      />

      {/* Lista de participantes */}
      <ListaParticipantes
        participantes={participantes}
        copiado={copiado}
        onGenerarInvitacion={generarInvitacion}
        onEliminar={eliminarParticipante}
      />

      {/* Estado de la tómbola */}
      <EstadoTombola
        sorteoRealizado={sorteoRealizado}
        mensajeSorteo={mensajeSorteo}
        onReiniciar={reiniciarSorteo}
      />

      {/* Sección de Incidentes de Seguridad */}
      <SeccionIncidentes
        incidentes={incidentes}
        verIncidentes={verIncidentes}
        setVerIncidentes={setVerIncidentes}
      />
    </main>
  );
}
