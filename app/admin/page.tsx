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
    realizandoSorteo,
    verificarEstadoSorteo,
    realizarSorteo,
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
    <main className="min-h-dvh bg-slate-900 text-white p-4 sm:p-6 pb-10">
      {/* Header */}
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Link 
            href="/" 
            className="text-white/60 hover:text-white transition-colors text-sm flex items-center gap-1"
          >
            ← Volver
          </Link>
          <button 
            onClick={cerrarSesion}
            className="px-3 py-1.5 text-sm bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
          >
            Cerrar sesión
          </button>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold mb-8">⚙️ Panel de Admin</h1>

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
          realizandoSorteo={realizandoSorteo}
          totalParticipantes={participantes.length}
          onRealizarSorteo={async () => {
            const exito = await realizarSorteo();
            if (exito) {
              cargarParticipantes(); // Recargar para ver asignaciones
            }
          }}
          onReiniciar={async () => {
            await reiniciarSorteo();
            cargarParticipantes(); // Recargar para limpiar asignaciones
          }}
        />

        {/* Sección de Incidentes de Seguridad */}
        <SeccionIncidentes
          incidentes={incidentes}
          verIncidentes={verIncidentes}
          setVerIncidentes={setVerIncidentes}
        />
      </div>
    </main>
  );
}
