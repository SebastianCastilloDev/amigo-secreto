"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";

interface Participante {
  id: number;
  nombre: string;
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

        {/* Lista de participantes */}
        {participantes.length === 0 ? (
          <div className="glass-card p-5 max-w-lg mx-auto text-center py-12">
            <div className="text-6xl mb-4">🎁</div>
            <p className="text-white/50 mb-2 text-lg">Aún no hay participantes</p>
            <p className="text-white/30 text-sm">¡Sé el primero en unirte a la celebración!</p>
          </div>
        ) : (
          <div className="max-w-lg mx-auto">
            <h2 className="text-white/40 text-xs uppercase tracking-widest mb-3 px-1 flex items-center gap-2">
              <span>🎄</span>
              <span>Quiénes participan</span>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {participantes.map((p, index) => (
                <div 
                  key={p.id} 
                  className="glass-card p-4 flex flex-col items-center text-center group hover:bg-white/10 transition-all duration-300 hover:scale-[1.02]"
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500/30 to-teal-600/30 border-2 border-emerald-500/40 flex items-center justify-center text-xl mb-3 group-hover:scale-110 transition-transform">
                    {["🎄", "⭐", "🎁", "❄️", "🔔", "🦌", "🍪", "🎅"][index % 8]}
                  </div>
                  <span className="text-white/90 font-medium text-sm leading-tight line-clamp-2">{p.nombre}</span>
                  <span className="text-white/30 text-xs mt-1">#{index + 1}</span>
                </div>
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
          
          {/* Link admin discreto */}
          <div className="text-center">
            <Link 
              href="/admin" 
              className="inline-flex items-center gap-2 text-white/30 hover:text-white/60 text-xs transition-colors"
            >
              <span>🔐</span>
              <span>Acceso organizador</span>
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
