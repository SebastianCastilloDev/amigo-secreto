"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Gift, Snowflake, TreePine, Star, PartyPopper, Sparkles, Link2Off } from "lucide-react";

// Componente de copos de nieve - CSS puro
function Snowfall() {
  return (
    <div className="snowfall">
      <div className="snowflake-layer"></div>
      <div className="snowflake-layer"></div>
      <div className="snowflake-layer"></div>
      <div className="snowflake-layer"></div>
      <div className="snowflake-layer"></div>
    </div>
  );
}

export default function Participar() {
  const params = useParams();
  const token = params.token as string;

  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [sorteoNoRealizado, setSorteoNoRealizado] = useState(false);
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
    } catch {
      setError("Error de conexión");
    } finally {
      setCargando(false);
    }
  }

  async function sacarDeTombola() {
    if (!token) return;

    setSacando(true);
    try {
      const respuesta = await fetch("/api/sorteo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      const datos = await respuesta.json();

      if (respuesta.ok) {
        setAmigoSecreto(datos.recibeNombre);
        setYaParticipo(true);
      } else if (respuesta.status === 404) {
        // Sorteo no realizado aún
        setSorteoNoRealizado(true);
      } else {
        setError(datos.error || "Error al sacar de la tómbola");
      }
    } catch {
      setError("Error de conexión");
    } finally {
      setSacando(false);
    }
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
          <p className="text-white/80 text-lg">Verificando invitación...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative">
        <Snowfall />
        <div className="relative z-10 w-full max-w-md">
          <div className="bg-red-900/50 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-red-500/30 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-red-500/20 rounded-full mb-6">
              <Link2Off className="w-10 h-10 text-red-400" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-4">
              Invitación no válida
            </h1>
            <p className="text-red-200/80 mb-2">{error}</p>
            <p className="text-white/50 text-sm">
              Pide al organizador que te envíe un nuevo enlace.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Sorteo no realizado aún
  if (sorteoNoRealizado) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative">
        <Snowfall />
        <div className="relative z-10 w-full max-w-md">
          <div className="bg-amber-900/50 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-amber-500/30 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-amber-500/20 rounded-full mb-6">
              <Gift className="w-10 h-10 text-amber-400" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">
              ¡Hola {nombre}!
            </h2>
            <h1 className="text-2xl font-bold text-amber-200 mb-4">
              El sorteo aún no se ha realizado
            </h1>
            <p className="text-amber-200/80 mb-4">
              El organizador todavía no ha hecho el sorteo. Vuelve a intentarlo más tarde.
            </p>
            <button
              onClick={() => {
                setSorteoNoRealizado(false);
                sacarDeTombola();
              }}
              className="mt-4 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-xl transition-colors"
            >
              🔄 Volver a intentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Ya tiene asignación - Mostrar resultado
  if (amigoSecreto) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative">
        <Snowfall />
        <div className="relative z-10 w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-6 animate-fade-in">
            <div className="flex justify-center gap-2 mb-4">
              <TreePine className="w-6 h-6 text-green-400" />
              <Snowflake className="w-6 h-6 text-blue-300 animate-spin" style={{ animationDuration: '8s' }} />
              <TreePine className="w-6 h-6 text-green-400" />
            </div>
            <h1 className="text-3xl font-bold text-white flex items-center justify-center gap-2">
              <Gift className="w-8 h-8 text-red-400" />
              Amigo Secreto
            </h1>
          </div>

          {/* Card de resultado */}
          <div className="bg-gradient-to-br from-green-900/90 to-green-950/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-green-700/30 animate-celebrate">
            {/* Header con estrella */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full mb-4 shadow-lg shadow-yellow-500/30">
                <Star className="w-10 h-10 text-yellow-900" fill="currentColor" />
              </div>
              <h2 className="text-2xl font-bold text-white flex items-center justify-center gap-2">
                <PartyPopper className="w-6 h-6 text-yellow-400" />
                ¡Hola {nombre}!
                <PartyPopper className="w-6 h-6 text-yellow-400" />
              </h2>
            </div>

            <p className="text-center text-green-200/80 mb-4">
              {yaParticipo ? "Tu amigo secreto es:" : "🎉 Sacaste de la tómbola a:"}
            </p>

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
          </div>
        </div>
      </div>
    );
  }

  // Puede sacar de la tómbola
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <Snowfall />
      
      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
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
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/20 animate-fade-in text-center" style={{ animationDelay: '0.2s' }}>
          {/* Saludo */}
          <div className="mb-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-3xl font-bold text-white mx-auto mb-4 shadow-lg shadow-green-500/30">
              {nombre.charAt(0).toUpperCase()}
            </div>
            <h2 className="text-2xl font-bold text-white">
              ¡Hola {nombre}!
            </h2>
            <p className="text-white/70 mt-2">
              Es hora de descubrir a quién le regalas...
            </p>
          </div>

          {/* Botón de tómbola */}
          <button
            onClick={sacarDeTombola}
            disabled={sacando}
            className="w-full py-5 px-6 bg-gradient-to-r from-red-500 via-red-600 to-red-500 text-white rounded-2xl font-bold text-xl transition-all duration-300 shadow-lg shadow-red-500/40 hover:shadow-red-500/60 hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-3 btn-christmas"
          >
            {sacando ? (
              <>
                <div className="w-7 h-7 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                Sacando papelito...
              </>
            ) : (
              <>
                <Gift className="w-7 h-7" />
                ¡Sacar de la tómbola!
              </>
            )}
          </button>

          {/* Mensaje informativo */}
          <p className="text-white/50 text-sm mt-6">
            Solo puedes sacar una vez. ¡Que tengas suerte! 🍀
          </p>
        </div>
      </div>
    </div>
  );
}
