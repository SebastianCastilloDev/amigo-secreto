"use client";

import { useEffect, useState, useCallback } from "react";
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

// Componente de animación de sorteo tipo slot machine
function AnimacionSorteo({ 
  nombreFinal,
  nombresParticipantes,
  onComplete 
}: { 
  nombreFinal: string;
  nombresParticipantes: string[];
  onComplete: () => void;
}) {
  const [nombreActual, setNombreActual] = useState(nombresParticipantes[0] || nombreFinal);
  const [fase, setFase] = useState<"rapido" | "medio" | "lento" | "final" | "revelado">("rapido");
  const [indice, setIndice] = useState(0);

  // Mezclar nombres de participantes y agregar el final
  const listaNombres = useCallback(() => {
    // Filtrar el nombre final para que no aparezca antes
    const otrosNombres = nombresParticipantes.filter(n => n !== nombreFinal);
    // Mezclar y tomar algunos nombres, luego agregar el final
    const mezclados = [...otrosNombres].sort(() => Math.random() - 0.5);
    // Repetir la lista para hacer más larga la animación si hay pocos participantes
    const repetidos = [...mezclados, ...mezclados, ...mezclados].slice(0, 15);
    return [...repetidos, nombreFinal];
  }, [nombreFinal, nombresParticipantes])();


  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const velocidades = {
      rapido: 60,
      medio: 120,
      lento: 200,
      final: 400,
      revelado: 0
    };

    if (fase === "revelado") {
      timeout = setTimeout(onComplete, 1500);
      return () => clearTimeout(timeout);
    }

    const siguienteNombre = () => {
      setIndice(prev => {
        const siguiente = prev + 1;
        
        // Transiciones de fase basadas en progreso
        if (siguiente >= listaNombres.length - 1) {
          setFase("revelado");
          setNombreActual(nombreFinal);
          return prev;
        } else if (siguiente >= listaNombres.length - 3) {
          setFase("final");
        } else if (siguiente >= listaNombres.length - 6) {
          setFase("lento");
        } else if (siguiente >= listaNombres.length - 10) {
          setFase("medio");
        }

        setNombreActual(listaNombres[siguiente]);
        return siguiente;
      });
    };

    timeout = setTimeout(siguienteNombre, velocidades[fase]);

    return () => clearTimeout(timeout);
  }, [fase, indice, listaNombres, nombreFinal, onComplete]);

  const esRevelado = fase === "revelado";

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <Snowfall />
      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-6">
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

        {/* Card de animación */}
        <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/10 text-center overflow-hidden">
          {/* Indicador de estado */}
          {!esRevelado && (
            <div className="mb-6">
              <p className="text-white/60 text-sm mb-2">Buscando en la tómbola...</p>
              <div className="flex justify-center gap-1">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: "0s" }} />
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: "0.2s" }} />
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: "0.4s" }} />
              </div>
            </div>
          )}

          {esRevelado && (
            <div className="mb-6 animate-bounce">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full shadow-lg shadow-yellow-500/40">
                <Star className="w-8 h-8 text-yellow-900" fill="currentColor" />
              </div>
            </div>
          )}

          {/* Slot machine de nombres */}
          <div className={`relative py-6 px-4 rounded-2xl mb-6 transition-all duration-500 ${
            esRevelado 
              ? "bg-gradient-to-r from-red-600 to-red-700 shadow-lg shadow-red-500/50" 
              : "bg-white/5 border-2 border-dashed border-white/20"
          }`}>
            {/* Efecto de brillo lateral */}
            {!esRevelado && (
              <>
                <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-slate-800 to-transparent z-10" />
                <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-slate-800 to-transparent z-10" />
              </>
            )}
            
            {/* Nombre actual */}
            <div className={`transition-all duration-300 ${
              esRevelado ? "scale-110" : ""
            }`}>
              {esRevelado && (
                <Gift className="w-10 h-10 text-white/90 mx-auto mb-2 animate-bounce" />
              )}
              <p className={`font-bold tracking-wide transition-all duration-300 ${
                esRevelado 
                  ? "text-4xl text-white" 
                  : "text-3xl text-white/80"
              }`} style={{
                textShadow: esRevelado ? "0 0 20px rgba(255,255,255,0.5)" : "none"
              }}>
                {nombreActual}
              </p>
            </div>
          </div>

          {/* Barra de progreso */}
          {!esRevelado && (
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mb-4">
              <div 
                className="h-full bg-gradient-to-r from-red-500 via-green-500 to-red-500 transition-all duration-100 rounded-full"
                style={{ 
                  width: `${(indice / (listaNombres.length - 1)) * 100}%`,
                  backgroundSize: "200% 100%",
                  animation: "shimmer 1s linear infinite"
                }}
              />
            </div>
          )}

          {/* Mensaje según fase */}
          <p className={`text-sm transition-all duration-300 ${
            esRevelado ? "text-white/90" : "text-white/50"
          }`}>
            {fase === "rapido" && "🎰 Girando la tómbola..."}
            {fase === "medio" && "🎲 Buscando tu papelito..."}
            {fase === "lento" && "✨ Ya casi..."}
            {fase === "final" && "🥁 ¡Un momento!"}
            {esRevelado && (
              <span className="flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4" />
                ¡Este es tu amigo secreto!
                <Sparkles className="w-4 h-4" />
              </span>
            )}
          </p>
        </div>

        {/* Confetti effect en revelado */}
        {esRevelado && (
          <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
            {Array.from({ length: 50 }).map((_, i) => (
              <div
                key={i}
                className="absolute animate-confetti"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: "-20px",
                  animationDelay: `${Math.random() * 0.5}s`,
                  animationDuration: `${2 + Math.random() * 2}s`
                }}
              >
                {["🎉", "⭐", "🎁", "❄️", "✨", "🎄"][Math.floor(Math.random() * 6)]}
              </div>
            ))}
          </div>
        )}
      </div>
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
  const [animando, setAnimando] = useState(false);
  const [nombreRevelado, setNombreRevelado] = useState<string | null>(null);
  const [animacionMostrada, setAnimacionMostrada] = useState(false);
  const [nombresParticipantes, setNombresParticipantes] = useState<string[]>([]);

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
        
        // Cargar nombres de todos los participantes para la animación
        if (datos.participantes) {
          setNombresParticipantes(datos.participantes);
        }
        
        // Si ya tiene asignación, mostrar animación primero
        if (datos.amigoSecreto) {
          setNombreRevelado(datos.amigoSecreto);
          setCargando(false);
          setAnimando(true);
        } else {
          // No tiene asignación, intentar obtenerla del sorteo
          setCargando(false);
          obtenerAsignacion();
        }
      } else {
        setError(datos.error || "Invitación no válida");
        setCargando(false);
      }
    } catch {
      setError("Error de conexión");
      setCargando(false);
    }
  }

  async function obtenerAsignacion() {
    if (!token) return;

    try {
      const respuesta = await fetch("/api/sorteo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      const datos = await respuesta.json();

      if (respuesta.ok) {
        setNombreRevelado(datos.recibeNombre);
        setAnimando(true);
      } else if (respuesta.status === 404) {
        setSorteoNoRealizado(true);
      } else {
        setError(datos.error || "Error al obtener asignación");
      }
    } catch {
      setError("Error de conexión");
    }
  }

  // Cuando termina la animación
  function onAnimacionCompleta() {
    setAnimando(false);
    setAnimacionMostrada(true);
    setAmigoSecreto(nombreRevelado);
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

  // Animación de sorteo
  if (animando && nombreRevelado) {
    return (
      <AnimacionSorteo 
        nombreFinal={nombreRevelado}
        nombresParticipantes={nombresParticipantes}
        onComplete={onAnimacionCompleta}
      />
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
                obtenerAsignacion();
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
              Tu amigo secreto es:
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

  // Estado de espera mientras obtiene asignación
  return (
    <div className="min-h-screen flex items-center justify-center relative">
      <Snowfall />
      <div className="relative z-10 text-center">
        <div className="animate-bounce mb-6">
          <Gift className="w-16 h-16 text-red-400 mx-auto" />
        </div>
        <div className="spinner mx-auto mb-4"></div>
        <p className="text-white/80 text-lg">Preparando tu sorteo...</p>
      </div>
    </div>
  );
}
