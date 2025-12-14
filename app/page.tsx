"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { Gift, Snowflake, TreePine, Star, PartyPopper, ArrowLeft, Settings, Sparkles } from "lucide-react";

interface Participante {
  id: number;
  nombre: string;
}

// Componente de copos de nieve
function Snowfall() {
  const snowflakes = useMemo(() => {
    return Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 10,
      duration: 5 + Math.random() * 10,
      size: 0.5 + Math.random() * 1,
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {snowflakes.map((flake) => (
        <div
          key={flake.id}
          className="absolute text-white/60"
          style={{
            left: `${flake.left}%`,
            top: "-20px",
            fontSize: `${flake.size}rem`,
            animation: `fall ${flake.duration}s linear infinite`,
            animationDelay: `${flake.delay}s`,
          }}
        >
          ❄
        </div>
      ))}
    </div>
  );
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
    } catch {
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

  // Loading state
  if (cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center relative">
        <Snowfall />
        <div className="relative z-10 text-center">
          <div className="animate-bounce mb-6">
            <Gift className="w-16 h-16 text-red-400 mx-auto" />
          </div>
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-white/80 text-lg">Cargando la magia navideña...</p>
        </div>
      </div>
    );
  }

  // Resultado: Ya vio su amigo secreto
  if (amigoSecreto) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative">
        <Snowfall />
        <div className="relative z-10 w-full max-w-md">
          {/* Card de resultado */}
          <div className="bg-gradient-to-br from-green-900/90 to-green-950/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-green-700/30 animate-celebrate">
            {/* Header con estrella */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full mb-4 shadow-lg shadow-yellow-500/30">
                <Star className="w-10 h-10 text-yellow-900" fill="currentColor" />
              </div>
              <h1 className="text-2xl font-bold text-white flex items-center justify-center gap-2">
                <PartyPopper className="w-6 h-6 text-yellow-400" />
                ¡Felicidades!
                <PartyPopper className="w-6 h-6 text-yellow-400" />
              </h1>
            </div>

            {yaParticipo ? (
              <p className="text-center text-green-200/80 mb-4">
                Ya habías participado. Tu amigo secreto sigue siendo:
              </p>
            ) : (
              <p className="text-center text-green-100 mb-4 text-lg">
                <span className="font-semibold text-white">{seleccionado?.nombre}</span>, 
                <br />sacaste de la tómbola a:
              </p>
            )}

            {/* Nombre del amigo secreto */}
            <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-6 text-center shadow-lg shadow-red-900/50 transform hover:scale-105 transition-transform duration-300">
              <Gift className="w-12 h-12 text-white/90 mx-auto mb-3 animate-bounce" />
              <p className="text-3xl font-bold text-white tracking-wide">
                {amigoSecreto}
              </p>
            </div>

            <p className="text-center text-green-200/70 mt-6 flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4" />
              ¡No se lo digas a nadie!
              <Sparkles className="w-4 h-4" />
            </p>

            <button
              onClick={reiniciar}
              className="mt-8 w-full py-3 px-6 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 border border-white/20"
            >
              <ArrowLeft className="w-5 h-5" />
              Volver al inicio
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Pantalla principal
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <Snowfall />
      
      <div className="relative z-10 w-full max-w-md">
        {/* Header decorativo */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex justify-center gap-2 mb-4">
            <TreePine className="w-8 h-8 text-green-400" />
            <Snowflake className="w-8 h-8 text-blue-300 animate-spin" style={{ animationDuration: '8s' }} />
            <TreePine className="w-8 h-8 text-green-400" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-3">
            <Gift className="w-10 h-10 text-red-400" />
            Amigo Secreto
          </h1>
          <p className="text-white/60">Navidad 2024</p>
        </div>

        {/* Card principal */}
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 shadow-2xl border border-white/20 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          {participantes.length === 0 ? (
            <div className="text-center py-8">
              <Snowflake className="w-16 h-16 text-blue-300/50 mx-auto mb-4" />
              <p className="text-white/80 mb-4">No hay participantes registrados aún.</p>
              <Link 
                href="/admin"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-medium hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg shadow-red-500/30"
              >
                <Settings className="w-5 h-5" />
                Ir a configurar
              </Link>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-semibold text-white text-center mb-2">
                ¿Quién eres?
              </h2>
              <p className="text-white/60 text-center text-sm mb-6">
                Selecciona tu nombre para descubrir a quién le regalas
              </p>

              {/* Lista de participantes */}
              <div className="space-y-3 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                {participantes.map((p, index) => (
                  <button
                    key={p.id}
                    onClick={() => setSeleccionado(p)}
                    className={`w-full p-4 rounded-xl font-medium transition-all duration-300 flex items-center gap-3 animate-fade-in ${
                      seleccionado?.id === p.id
                        ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-500/30 scale-[1.02]"
                        : "bg-white/10 text-white hover:bg-white/20 border border-white/10"
                    }`}
                    style={{ animationDelay: `${0.1 * index}s` }}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold ${
                      seleccionado?.id === p.id
                        ? "bg-white/20"
                        : "bg-gradient-to-br from-red-400 to-red-600"
                    }`}>
                      {p.nombre.charAt(0).toUpperCase()}
                    </div>
                    {p.nombre}
                  </button>
                ))}
              </div>

              {/* Botón de sorteo */}
              {seleccionado && (
                <button
                  onClick={hacerTombola}
                  disabled={buscando}
                  className="mt-6 w-full py-4 px-6 bg-gradient-to-r from-red-500 via-red-600 to-red-500 text-white rounded-xl font-bold text-lg transition-all duration-300 shadow-lg shadow-red-500/40 hover:shadow-red-500/60 hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-3 animate-fade-in btn-christmas"
                >
                  {buscando ? (
                    <>
                      <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Sacando papelito...
                    </>
                  ) : (
                    <>
                      <Gift className="w-6 h-6" />
                      ¡Sacar de la tómbola!
                    </>
                  )}
                </button>
              )}

              {/* Error */}
              {error && (
                <div className="mt-4 p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-200 text-center animate-fade-in">
                  {error}
                </div>
              )}
            </>
          )}
        </div>

        {/* Link a admin */}
        <div className="mt-6 text-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <Link 
            href="/admin"
            className="inline-flex items-center gap-2 text-white/50 hover:text-white/80 transition-colors duration-300 text-sm"
          >
            <Settings className="w-4 h-4" />
            Administrar participantes
          </Link>
        </div>
      </div>
    </div>
  );
}
