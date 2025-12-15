"use client";

import { useEffect, useRef } from "react";

export function MusicaFondo() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const musicaIniciadaRef = useRef(false);

  useEffect(() => {
    // Verificar si la música ya estaba reproduciéndose (persistencia entre navegaciones)
    const musicaYaReproduciendo = sessionStorage.getItem('musica_reproduciendo') === 'true';
    let intervalo: NodeJS.Timeout | null = null;
    
    const iniciarMusica = async () => {
      if (!audioRef.current || musicaIniciadaRef.current) return;

      try {
        // Configurar volumen
        audioRef.current.volume = 0.3; // Volumen moderado (30%)
        
        // Si ya estaba reproduciéndose, restaurar la posición
        if (musicaYaReproduciendo) {
          const tiempoGuardado = sessionStorage.getItem('musica_tiempo');
          if (tiempoGuardado) {
            audioRef.current.currentTime = parseFloat(tiempoGuardado);
          }
        }

        // Intentar reproducir inmediatamente
        await audioRef.current.play();
        musicaIniciadaRef.current = true;
        sessionStorage.setItem('musica_reproduciendo', 'true');

        // Guardar el tiempo de reproducción periódicamente para continuidad
        const guardarTiempo = () => {
          if (audioRef.current && !audioRef.current.paused) {
            sessionStorage.setItem('musica_tiempo', audioRef.current.currentTime.toString());
          }
        };

        intervalo = setInterval(guardarTiempo, 1000);
      } catch (error) {
        // Si falla el autoplay, intentar estrategias alternativas
        console.log('Autoplay bloqueado, intentando estrategias alternativas...');
        
        // Estrategia 1: Intentar con muted primero (algunos navegadores permiten esto)
        try {
          if (audioRef.current) {
            audioRef.current.muted = true;
            await audioRef.current.play();
            // Esperar un momento y luego desmutear
            setTimeout(() => {
              if (audioRef.current) {
                audioRef.current.muted = false;
                audioRef.current.volume = 0.3;
                musicaIniciadaRef.current = true;
                sessionStorage.setItem('musica_reproduciendo', 'true');
                
                // Iniciar guardado de tiempo
                intervalo = setInterval(() => {
                  if (audioRef.current && !audioRef.current.paused) {
                    sessionStorage.setItem('musica_tiempo', audioRef.current.currentTime.toString());
                  }
                }, 1000);
              }
            }, 500);
            return;
          }
        } catch {
          // Continuar con siguiente estrategia
        }

        // Estrategia 2: Intentar con cualquier interacción mínima
        const intentarConInteraccion = async () => {
          if (audioRef.current && !musicaIniciadaRef.current) {
            try {
              if (audioRef.current.muted) {
                audioRef.current.muted = false;
              }
              audioRef.current.volume = 0.3;
              await audioRef.current.play();
              musicaIniciadaRef.current = true;
              sessionStorage.setItem('musica_reproduciendo', 'true');
              
              // Iniciar guardado de tiempo
              intervalo = setInterval(() => {
                if (audioRef.current && !audioRef.current.paused) {
                  sessionStorage.setItem('musica_tiempo', audioRef.current.currentTime.toString());
                }
              }, 1000);
            } catch {
              // Silenciar errores
            }
          }
        };

        // Escuchar cualquier interacción del usuario
        const eventos = ['click', 'touchstart', 'keydown', 'mousemove', 'scroll'];
        eventos.forEach(evento => {
          document.addEventListener(evento, intentarConInteraccion, { once: true });
        });
      }
    };

    // Intentar reproducir inmediatamente (sin delay)
    iniciarMusica();

    // Cleanup: guardar estado al desmontar y limpiar intervalo
    return () => {
      if (intervalo) {
        clearInterval(intervalo);
      }
      if (audioRef.current && !audioRef.current.paused) {
        sessionStorage.setItem('musica_tiempo', audioRef.current.currentTime.toString());
      }
    };
  }, []);

  return (
    <audio
      ref={audioRef}
      src="/musica/musica-intro.mp3"
      loop
      preload="auto"
      autoPlay
      style={{ display: "none" }}
    />
  );
}

