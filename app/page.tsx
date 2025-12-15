"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";

interface Participante {
  id: number;
  nombre: string;
}

// 📱 Configura aquí tu número de WhatsApp (con código de país, sin + ni espacios)
const WHATSAPP_ORGANIZADOR = "56956109322"; // Ejemplo: Chile +56 9 1234 5678

function generarEnlaceWhatsApp(nombreParticipante: string): string {
  const mensaje = encodeURIComponent(
    `Hola! Soy ${nombreParticipante} y quiero ver mi amigo secreto. Me envias mi enlace personal para Navidad 2025?`
  );
  return `https://wa.me/${WHATSAPP_ORGANIZADOR}?text=${mensaje}`;
}

function Copos() {
  const copos = useMemo(() => {
    return Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 5 + Math.random() * 10,
      size: 0.5 + Math.random() * 1,
    }));
  }, []);

  return (
    <>
      {copos.map((copo) => (
        <span
          key={copo.id}
          className="snowflake"
          style={{
            left: `${copo.left}%`,
            animationDelay: `${copo.delay}s`,
            animationDuration: `${copo.duration}s`,
            fontSize: `${copo.size}rem`,
          }}
        >
          ❄
        </span>
      ))}
    </>
  );
}

function Estrellas() {
  const estrellas = useMemo(() => {
    return Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 50,
      delay: Math.random() * 3,
      duration: 2 + Math.random() * 2,
    }));
  }, []);

  return (
    <>
      {estrellas.map((estrella) => (
        <span
          key={estrella.id}
          className="star"
          style={{
            left: `${estrella.left}%`,
            top: `${estrella.top}%`,
            animationDelay: `${estrella.delay}s`,
            animationDuration: `${estrella.duration}s`,
          }}
        />
      ))}
    </>
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

  if (cargando) {
    return (
      <main className="min-h-dvh flex flex-col items-center justify-center p-6">
        <div className="flex flex-col items-center gap-4">
          <div className="text-6xl animate-bounce">🎁</div>
          <div className="flex gap-1">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: "0s" }} />
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: "0.2s" }} />
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: "0.4s" }} />
          </div>
          <p className="text-white/70 text-sm">Preparando la magia navideña...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-dvh flex flex-col relative overflow-hidden safe-bottom">
      {/* Efectos de fondo */}
      <Copos />
      <Estrellas />
      
      {/* Decoración superior */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-red-600 via-green-600 to-red-600" />
      
      {/* Header */}
      <header className="relative z-10 pt-8 pb-6 px-6 text-center">
        <div className="inline-flex items-center gap-2 mb-4">
          <span className="badge-navidad">✨ Navidad 2025</span>
        </div>
        
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-3 text-gradient leading-tight">
          Amigo Secreto
        </h1>
        
        <p className="text-white/60 text-base sm:text-lg max-w-md mx-auto leading-relaxed">
          🎄 Este año, la magia de dar está en tus manos
        </p>
      </header>

      {/* Contenido principal */}
      <section className="flex-1 px-4 sm:px-6 pb-8 relative z-10">
        {/* Stats rápidos */}
        <div className="glass-card p-4 sm:p-5 max-w-lg mx-auto mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-2xl shadow-lg">
                🎅
              </div>
              <div>
                <p className="text-white/50 text-xs uppercase tracking-wider">Participantes</p>
                <p className="text-2xl font-bold text-white">{participantes.length}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-white/50 text-xs uppercase tracking-wider">Estado</p>
              <span className="inline-flex items-center gap-1.5 text-emerald-400 text-sm font-medium">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                Activo
              </span>
            </div>
          </div>
        </div>
         {/* Link admin - visible para atraer curiosos 😈 */}
          <div className="text-center">
            <Link 
              href="/admin" 
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full text-white/70 hover:text-white text-sm font-medium transition-all hover:scale-105"
            >
              <span>🔐</span>
              <span>Panel de Administración</span>
            </Link>
          </div>

        {/* Lista de participantes */}
        {participantes.length === 0 ? (
          <div className="glass-card p-5 max-w-lg mx-auto text-center py-12">
            <div className="text-6xl mb-4">🎁</div>
            <p className="text-white/50 mb-2 text-lg">Aún no hay participantes</p>
            <p className="text-white/30 text-sm">¡Sé el primero en unirte a la celebración!</p>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-5">
              <h2 className="text-white/90 text-lg font-medium mb-1">
                👆 Toca tu nombre para pedir tu enlace
              </h2>
              <p className="text-white/40 text-sm">Te llegará por WhatsApp en segundos</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {participantes.map((p, index) => (
                <a 
                  key={p.id}
                  href={generarEnlaceWhatsApp(p.nombre)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-card p-5 flex items-center gap-4 group hover:bg-white/15 transition-all duration-300 active:scale-[0.97] cursor-pointer text-left w-full border-2 border-transparent hover:border-green-400/50 active:border-green-400 relative overflow-hidden no-underline"
                >
                  {/* Indicador de WhatsApp */}
                  <div className="absolute top-2 right-2 flex items-center gap-1 text-green-400 text-xs font-medium">
                    <span className="text-base">💬</span>
                  </div>
                  
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500/20 via-emerald-500/20 to-teal-600/20 border-2 border-white/20 flex items-center justify-center text-3xl shrink-0 group-hover:scale-110 group-active:scale-95 transition-transform shadow-lg">
                    {["🎄", "⭐", "🎁", "❄️", "🔔", "🦌", "🍪", "🎅"][index % 8]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-white font-semibold text-lg block truncate group-hover:text-green-200 transition-colors">{p.nombre}</span>
                    <span className="text-green-400/70 text-sm group-hover:text-green-300 transition-colors flex items-center gap-1">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      Pedir mi enlace
                    </span>
                  </div>
                  
                  {/* Efecto de brillo en hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
                </a>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Footer con CTA */}
      <footer className="sticky bottom-0 z-20 px-4 pb-6 pt-4 bg-gradient-to-t from-slate-900 via-slate-900/95 to-transparent">
        <div className="max-w-lg mx-auto space-y-4">
          {/* Mensaje informativo */}
          <div className="glass-card p-4 flex items-start gap-3">
            <span className="text-2xl">💌</span>
            <div>
              <p className="text-white/80 text-sm leading-relaxed">
                ¿No tienes tu enlace personal? <span className="text-amber-400 font-medium">Pídelo al organizador</span> para participar en el sorteo.
              </p>
            </div>
          </div>
          
         
        </div>
      </footer>
    </main>
  );
}
