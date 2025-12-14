"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Gift, Snowflake, TreePine, Users, Settings, Heart } from "lucide-react";

interface Participante {
  id: number;
  nombre: string;
}

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

export default function Inicio() {
  const [cargando, setCargando] = useState(true);
  const [participantes, setParticipantes] = useState<Participante[]>([]);

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

  // Pantalla principal - Solo informativa
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <Snowfall />
      
      <div className="relative z-10 w-full max-w-lg">
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
          
          {/* Mensaje de bienvenida */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full mb-4 shadow-lg shadow-red-500/30">
              <Heart className="w-8 h-8 text-white" fill="currentColor" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">
              ¡Bienvenido al intercambio!
            </h2>
            <p className="text-white/70 text-sm leading-relaxed">
              Este año compartimos regalos entre amigos. 
              <br />
              <span className="text-yellow-300/90">Recibirás un link personal</span> para descubrir a quién le regalas.
            </p>
          </div>

          {/* Separador */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-white/20"></div>
            <Users className="w-5 h-5 text-white/40" />
            <div className="flex-1 h-px bg-white/20"></div>
          </div>

          {/* Lista de participantes */}
          <div>
            <h3 className="text-white/80 text-sm font-medium mb-3 text-center">
              Participantes ({participantes.length})
            </h3>
            
            {participantes.length === 0 ? (
              <div className="text-center py-6">
                <Snowflake className="w-12 h-12 text-blue-300/30 mx-auto mb-3" />
                <p className="text-white/50 text-sm">
                  Aún no hay participantes registrados.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {participantes.map((p, index) => (
                  <a
                    key={p.id}
                    href={`https://wa.me/56956109322?text=${encodeURIComponent(`¡Hola! Soy ${p.nombre} y quiero participar en el Amigo Secreto 🎁. ¿Me puedes enviar mi enlace?`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white/5 border border-white/10 rounded-xl p-3 text-center animate-fade-in hover:bg-white/10 hover:border-green-500/30 transition-all duration-300 cursor-pointer group"
                    style={{ animationDelay: `${0.05 * index}s` }}
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-bold mx-auto mb-2 group-hover:scale-110 transition-transform">
                      {p.nombre.charAt(0).toUpperCase()}
                    </div>
                    <p className="text-white/90 text-sm font-medium truncate">
                      {p.nombre}
                    </p>
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Información adicional */}
          <div className="mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
            <p className="text-green-200/90 text-sm text-center">
              🎁 ¿No tienes tu link? Pídelo al organizador del evento.
            </p>
          </div>
        </div>

        {/* Link a admin */}
        <div className="mt-6 text-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <Link 
            href="/admin"
            className="inline-flex items-center gap-2 text-white/40 hover:text-white/70 transition-colors duration-300 text-sm"
          >
            <Settings className="w-4 h-4" />
            Administrar
          </Link>
        </div>
      </div>
    </div>
  );
}
