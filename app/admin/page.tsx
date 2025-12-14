"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";

interface Participante {
  id: number;
  nombre: string;
  token?: string;
}

export default function Admin() {
  const [autenticado, setAutenticado] = useState(false);
  const [verificandoAuth, setVerificandoAuth] = useState(true);
  const [password, setPassword] = useState("");
  const [errorAuth, setErrorAuth] = useState("");
  const [verificando, setVerificando] = useState(false);

  // Estados para el modo HACKEO 😈
  const [modoHackeo, setModoHackeo] = useState(false);
  const [faseHackeo, setFaseHackeo] = useState(0);
  const [ipCapturada, setIpCapturada] = useState("");
  const [fotoCapturada, setFotoCapturada] = useState<string | null>(null);
  const [intentosFallidos, setIntentosFallidos] = useState(0);
  const [passwordsIntentadas, setPasswordsIntentadas] = useState<string[]>([]);
  const [coordenadas, setCoordenadas] = useState<{ lat: number; lon: number } | null>(null);
  const [datosDispositivo, setDatosDispositivo] = useState<{
    navegador: string;
    plataforma: string;
    idioma: string;
    pantalla: string;
    zonaHoraria: string;
    bateria: string;
    conexion: string;
    ubicacion: string;
  } | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [cargando, setCargando] = useState(true);
  const [participantes, setParticipantes] = useState<Participante[]>([]);
  const [nuevoNombre, setNuevoNombre] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [mensajeSorteo, setMensajeSorteo] = useState("");
  const [sorteoRealizado, setSorteoRealizado] = useState(false);
  const [errorAgregar, setErrorAgregar] = useState("");
  const [copiado, setCopiado] = useState<number | null>(null);

  useEffect(() => {
    // Verificar si ya hay sesión guardada
    const sesion = sessionStorage.getItem("admin_auth");
    if (sesion === "true") {
      setAutenticado(true);
      cargarDatos();
    }
    setVerificandoAuth(false);
  }, []);

  // Efecto para la secuencia de hackeo
  useEffect(() => {
    if (modoHackeo && faseHackeo < 6) {
      const timer = setTimeout(() => {
        setFaseHackeo(prev => prev + 1);
      }, faseHackeo === 0 ? 500 : 1500);
      return () => clearTimeout(timer);
    }
  }, [modoHackeo, faseHackeo]);

  async function iniciarHackeo() {
    setModoHackeo(true);
    setFaseHackeo(0);

    // Obtener IP
    try {
      const respuesta = await fetch("https://api.ipify.org?format=json");
      const datos = await respuesta.json();
      setIpCapturada(datos.ip);
    } catch {
      setIpCapturada("192.168.1." + Math.floor(Math.random() * 255));
    }

    // Capturar datos del dispositivo
    const datos: typeof datosDispositivo = {
      navegador: navigator.userAgent.split(') ')[0].split('(')[1] || "Desconocido",
      plataforma: navigator.platform || "Desconocido",
      idioma: navigator.language || "Desconocido",
      pantalla: `${window.screen.width}x${window.screen.height}`,
      zonaHoraria: Intl.DateTimeFormat().resolvedOptions().timeZone,
      bateria: "Obteniendo...",
      conexion: "Analizando...",
      ubicacion: "Triangulando...",
    };

    // Intentar obtener batería
    try {
      const battery = await (navigator as Navigator & { getBattery?: () => Promise<{ level: number; charging: boolean }> }).getBattery?.();
      if (battery) {
        datos.bateria = `${Math.round(battery.level * 100)}% ${battery.charging ? "(Cargando)" : "(Descargando)"}`;
      }
    } catch {
      datos.bateria = "87% (Descargando)";
    }

    // Tipo de conexión
    const connection = (navigator as Navigator & { connection?: { effectiveType?: string; downlink?: number } }).connection;
    if (connection) {
      datos.conexion = `${connection.effectiveType?.toUpperCase() || "WiFi"} - ${connection.downlink || 10}Mbps`;
    } else {
      datos.conexion = "WiFi - Alta velocidad";
    }

    setDatosDispositivo(datos);

    // Intentar obtener ubicación GPS
    try {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCoordenadas({ lat: pos.coords.latitude, lon: pos.coords.longitude });
          setDatosDispositivo(prev => prev ? {
            ...prev,
            ubicacion: `${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)} (±${Math.round(pos.coords.accuracy)}m)`
          } : null);
        },
        () => {
          // Si rechaza, inventamos una ubicación cercana pero realista
          const fakeLat = -33.4489 + (Math.random() - 0.5) * 0.1;
          const fakeLon = -70.6693 + (Math.random() - 0.5) * 0.1;
          setCoordenadas({ lat: fakeLat, lon: fakeLon });
          setDatosDispositivo(prev => prev ? {
            ...prev,
            ubicacion: "Ubicación aproximada detectada por IP"
          } : null);
        },
        { enableHighAccuracy: true }
      );
    } catch {
      // Silencioso
    }

    // Intentar capturar foto
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        
        // Esperar un momento y tomar foto
        setTimeout(() => {
          if (videoRef.current && canvasRef.current) {
            const ctx = canvasRef.current.getContext("2d");
            canvasRef.current.width = 320;
            canvasRef.current.height = 240;
            ctx?.drawImage(videoRef.current, 0, 0, 320, 240);
            setFotoCapturada(canvasRef.current.toDataURL("image/jpeg"));
            stream.getTracks().forEach(track => track.stop());
          }
        }, 2000);
      }
    } catch {
      // No hay cámara o no dio permiso, igual continúa el susto
    }
  }

  async function verificarPassword(e: React.FormEvent) {
    e.preventDefault();
    if (!password.trim() || verificando) return;

    setVerificando(true);
    setErrorAuth("");

    try {
      const respuesta = await fetch("/api/admin/verificar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (respuesta.ok) {
        sessionStorage.setItem("admin_auth", "true");
        setAutenticado(true);
        cargarDatos();
      } else {
        const nuevosIntentos = intentosFallidos + 1;
        setIntentosFallidos(nuevosIntentos);
        setPasswordsIntentadas(prev => [...prev, password]);
        
        if (nuevosIntentos >= 2) {
          // ¡ACTIVAR MODO HACKEO! 😈
          iniciarHackeo();
        } else {
          setErrorAuth("Contraseña incorrecta");
        }
      }
    } catch (error) {
      setErrorAuth("Error de conexión");
    } finally {
      setVerificando(false);
    }
  }

  function cerrarSesion() {
    sessionStorage.removeItem("admin_auth");
    setAutenticado(false);
    setPassword("");
  }

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

  async function generarInvitacion(participante: Participante) {
    // Si ya tiene token, solo copiar
    if (participante.token) {
      copiarAlPortapapeles(participante);
      return;
    }

    // Generar token
    try {
      const respuesta = await fetch("/api/participantes/invitacion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ participanteId: participante.id }),
      });

      if (respuesta.ok) {
        const datos = await respuesta.json();
        // Actualizar el participante con el nuevo token
        setParticipantes(prev => 
          prev.map(p => 
            p.id === participante.id 
              ? { ...p, token: datos.token } 
              : p
          )
        );
        copiarAlPortapapeles({ ...participante, token: datos.token });
      }
    } catch (error) {
      console.error("Error al generar invitación:", error);
    }
  }

  function copiarAlPortapapeles(participante: Participante) {
    const url = `${window.location.origin}/participar/${participante.token}`;
    navigator.clipboard.writeText(url);
    setCopiado(participante.id);
    setTimeout(() => setCopiado(null), 2000);
  }

  // 🚨 PANTALLA DE HACKEO TERRORÍFICA 🚨
  if (modoHackeo) {
    return (
      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "#000",
        color: "#ff0000",
        fontFamily: "'Courier New', monospace",
        padding: "20px",
        overflowY: "auto",
        zIndex: 9999,
      }}>
        {/* Video oculto para captura */}
        <video ref={videoRef} style={{ display: "none" }} />
        <canvas ref={canvasRef} style={{ display: "none" }} />

        {/* Efecto de scanlines */}
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "repeating-linear-gradient(0deg, rgba(0,0,0,0.15), rgba(0,0,0,0.15) 1px, transparent 1px, transparent 2px)",
          pointerEvents: "none",
        }} />

        {/* Contenido principal */}
        <div style={{ position: "relative", zIndex: 1 }}>
          {/* Header parpadeante */}
          <div style={{
            textAlign: "center",
            animation: "parpadeo 0.5s infinite",
          }}>
            <h1 style={{ 
              fontSize: "48px", 
              marginBottom: "10px",
              textShadow: "0 0 10px #ff0000, 0 0 20px #ff0000, 0 0 30px #ff0000",
            }}>
              ⚠️ ALERTA DE SEGURIDAD ⚠️
            </h1>
            <h2 style={{ 
              fontSize: "32px",
              color: "#ff3333",
            }}>
              🚨 INTRUSO DETECTADO 🚨
            </h2>
          </div>

          {/* Secuencia de "hackeo" */}
          <div style={{ 
            marginTop: "30px", 
            fontSize: "16px",
            lineHeight: "1.8",
            maxWidth: "800px",
            margin: "30px auto 0",
          }}>
            {faseHackeo >= 1 && (
              <p style={{ color: "#00ff00" }}>
                {">"} Iniciando protocolo de seguridad... <span style={{ color: "#ff0000" }}>EJECUTANDO</span>
              </p>
            )}
            {faseHackeo >= 2 && (
              <p style={{ color: "#00ff00" }}>
                {">"} Capturando dirección IP... <span style={{ color: "#ffff00" }}>{ipCapturada || "Obteniendo..."}</span>
              </p>
            )}
            {faseHackeo >= 2 && datosDispositivo && (
              <p style={{ color: "#00ff00" }}>
                {">"} Escaneando dispositivo... <span style={{ color: "#ffff00" }}>{datosDispositivo.plataforma}</span>
              </p>
            )}
            {faseHackeo >= 3 && (
              <p style={{ color: "#00ff00" }}>
                {">"} Activando cámara frontal... <span style={{ color: "#ff0000" }}>CAPTURA EXITOSA</span>
              </p>
            )}
            {faseHackeo >= 3 && datosDispositivo && (
              <p style={{ color: "#00ff00" }}>
                {">"} Obteniendo ubicación GPS... <span style={{ color: "#ffff00" }}>{datosDispositivo.ubicacion}</span>
              </p>
            )}
            {faseHackeo >= 4 && (
              <p style={{ color: "#00ff00" }}>
                {">"} Extrayendo contraseñas intentadas... <span style={{ color: "#ff0000" }}>CAPTURADAS</span>
              </p>
            )}
            {faseHackeo >= 4 && datosDispositivo && (
              <p style={{ color: "#00ff00" }}>
                {">"} Nivel de batería detectado... <span style={{ color: "#ffff00" }}>{datosDispositivo.bateria}</span>
              </p>
            )}
            {faseHackeo >= 5 && (
              <p style={{ color: "#00ff00" }}>
                {">"} Enviando datos al administrador... <span style={{ color: "#ffff00" }}>100% COMPLETADO</span>
              </p>
            )}
            {faseHackeo >= 5 && (
              <p style={{ color: "#00ff00" }}>
                {">"} Registrando intento de acceso no autorizado... <span style={{ color: "#ff0000" }}>GUARDADO</span>
              </p>
            )}
          </div>

          {/* Contenedor de foto y datos */}
          {faseHackeo >= 3 && (
            <div style={{ 
              marginTop: "30px", 
              display: "flex",
              justifyContent: "center",
              gap: "30px",
              flexWrap: "wrap",
            }}>
              {/* Foto capturada */}
              <div style={{
                border: "4px solid #ff0000",
                padding: "5px",
                backgroundColor: "#1a0000",
              }}>
                {fotoCapturada ? (
                  <img 
                    src={fotoCapturada} 
                    alt="Intruso capturado" 
                    style={{ 
                      width: "320px", 
                      height: "240px",
                      filter: "contrast(1.2) saturate(0.8)",
                    }} 
                  />
                ) : (
                  <div style={{
                    width: "320px",
                    height: "240px",
                    backgroundColor: "#330000",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "60px",
                  }}>
                    📸
                  </div>
                )}
                <p style={{ 
                  color: "#ff0000", 
                  marginTop: "10px",
                  fontSize: "12px",
                  textAlign: "center",
                }}>
                  EVIDENCIA FOTOGRÁFICA
                </p>
              </div>

              {/* Panel de datos capturados */}
              {faseHackeo >= 4 && datosDispositivo && (
                <div style={{
                  border: "2px solid #00ff00",
                  padding: "15px",
                  backgroundColor: "rgba(0, 255, 0, 0.05)",
                  fontSize: "12px",
                  minWidth: "280px",
                }}>
                  <h3 style={{ color: "#00ff00", marginBottom: "10px", fontSize: "14px" }}>
                    📊 DATOS EXTRAÍDOS DEL DISPOSITIVO
                  </h3>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <tbody>
                      <tr><td style={{ color: "#888", padding: "3px 0" }}>IP:</td><td style={{ color: "#ffff00" }}>{ipCapturada}</td></tr>
                      <tr><td style={{ color: "#888", padding: "3px 0" }}>Ubicación:</td><td style={{ color: "#ffff00" }}>{datosDispositivo.ubicacion}</td></tr>
                      <tr><td style={{ color: "#888", padding: "3px 0" }}>Plataforma:</td><td style={{ color: "#ffff00" }}>{datosDispositivo.plataforma}</td></tr>
                      <tr><td style={{ color: "#888", padding: "3px 0" }}>Navegador:</td><td style={{ color: "#ffff00" }}>{datosDispositivo.navegador}</td></tr>
                      <tr><td style={{ color: "#888", padding: "3px 0" }}>Pantalla:</td><td style={{ color: "#ffff00" }}>{datosDispositivo.pantalla}</td></tr>
                      <tr><td style={{ color: "#888", padding: "3px 0" }}>Zona horaria:</td><td style={{ color: "#ffff00" }}>{datosDispositivo.zonaHoraria}</td></tr>
                      <tr><td style={{ color: "#888", padding: "3px 0" }}>Batería:</td><td style={{ color: "#ffff00" }}>{datosDispositivo.bateria}</td></tr>
                      <tr><td style={{ color: "#888", padding: "3px 0" }}>Conexión:</td><td style={{ color: "#ffff00" }}>{datosDispositivo.conexion}</td></tr>
                      <tr><td style={{ color: "#888", padding: "3px 0" }}>Idioma:</td><td style={{ color: "#ffff00" }}>{datosDispositivo.idioma}</td></tr>
                    </tbody>
                  </table>

                  {/* Contraseñas intentadas */}
                  {passwordsIntentadas.length > 0 && (
                    <div style={{ marginTop: "15px" }}>
                      <h4 style={{ color: "#ff0000", fontSize: "12px", marginBottom: "5px" }}>
                        🔑 CONTRASEÑAS CAPTURADAS:
                      </h4>
                      {passwordsIntentadas.map((pwd, i) => (
                        <p key={i} style={{ color: "#ff6666", fontFamily: "monospace" }}>
                          Intento {i + 1}: &quot;{pwd}&quot;
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* MAPA DE UBICACIÓN */}
              {faseHackeo >= 4 && coordenadas && (
                <div style={{
                  border: "2px solid #ff0000",
                  padding: "5px",
                  backgroundColor: "#1a0000",
                }}>
                  <iframe
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${coordenadas.lon - 0.01}%2C${coordenadas.lat - 0.01}%2C${coordenadas.lon + 0.01}%2C${coordenadas.lat + 0.01}&layer=mapnik&marker=${coordenadas.lat}%2C${coordenadas.lon}`}
                    style={{
                      width: "280px",
                      height: "200px",
                      border: "none",
                      filter: "hue-rotate(180deg) invert(90%)",
                    }}
                  />
                  <p style={{ 
                    color: "#ff0000", 
                    marginTop: "10px",
                    fontSize: "12px",
                    textAlign: "center",
                  }}>
                    📍 TU UBICACIÓN EXACTA
                  </p>
                  <p style={{ 
                    color: "#ffff00", 
                    fontSize: "10px",
                    textAlign: "center",
                  }}>
                    {coordenadas.lat.toFixed(6)}, {coordenadas.lon.toFixed(6)}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Mensaje amenazante final */}
          {faseHackeo >= 5 && (
            <div style={{
              marginTop: "40px",
              textAlign: "center",
              padding: "25px",
              border: "3px solid #ff0000",
              backgroundColor: "rgba(255, 0, 0, 0.15)",
              maxWidth: "700px",
              margin: "40px auto 0",
            }}>
              <h2 style={{ 
                fontSize: "32px",
                marginBottom: "20px",
                animation: "parpadeo 0.8s infinite",
                textShadow: "0 0 10px #ff0000",
              }}>
                🚫 ACCESO DENEGADO PERMANENTEMENTE 🚫
              </h2>
              
              <p style={{ fontSize: "20px", marginBottom: "15px", color: "#ff4444" }}>
                TODA TU INFORMACIÓN HA SIDO CAPTURADA Y ENVIADA.
              </p>
              
              <p style={{ fontSize: "22px", marginBottom: "15px" }}>
                <strong>¿QUIÉN TE CREES QUE ERES PARA INTENTAR HACKEAR EL AMIGO SECRETO?</strong>
              </p>

              <p style={{ fontSize: "18px", color: "#ff6666", marginBottom: "10px" }}>
                🎄 Este incidente será discutido en la cena de Navidad.
              </p>

              <p style={{ fontSize: "18px", color: "#ff6666", marginBottom: "10px" }}>
                👨‍👩‍👧‍👦 Toda la familia verá tu foto de INTRUSO.
              </p>

              <p style={{ fontSize: "18px", color: "#ff6666", marginBottom: "20px" }}>
                📱 Tu mamá ya recibió una notificación.
              </p>
              
              <div style={{ 
                fontSize: "28px", 
                marginTop: "25px",
                color: "#ffff00",
                animation: "parpadeo 1.5s infinite",
                padding: "15px",
                border: "2px dashed #ffff00",
              }}>
                ¡QUE VERGÜENZA! 😤<br/>
                ¡ESPERO QUE ESTÉS FELIZ CON LO QUE HICISTE!
              </div>

              <div style={{ 
                marginTop: "30px", 
                fontSize: "11px", 
                color: "#666",
                backgroundColor: "rgba(0,0,0,0.5)",
                padding: "10px",
                borderRadius: "5px",
              }}>
                <p style={{ marginBottom: "3px" }}>📋 RESUMEN DEL INCIDENTE:</p>
                <p>IP: {ipCapturada} | Fecha: {new Date().toLocaleString()}</p>
                <p>Intentos fallidos: {intentosFallidos} | Contraseñas probadas: {passwordsIntentadas.length}</p>
                <p>Evidencia fotográfica: {fotoCapturada ? "CAPTURADA" : "PENDIENTE"}</p>
                <p>Estado: ENVIADO A LA FAMILIA</p>
              </div>

              <p style={{ 
                marginTop: "20px", 
                fontSize: "14px", 
                color: "#888",
                fontStyle: "italic" 
              }}>
                Caso #AS-{Date.now().toString().slice(-6)} | Departamento de Seguridad Familiar
              </p>
            </div>
          )}
        </div>

        {/* CSS para animación de parpadeo */}
        <style>{`
          @keyframes parpadeo {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.3; }
          }
        `}</style>
      </div>
    );
  }

  // Verificando si hay sesión guardada
  if (verificandoAuth) {
    return (
      <main>
        <h1>⚙️ Administrar Amigo Secreto</h1>
        <div className="spinner"></div>
      </main>
    );
  }

  // Pantalla de login
  if (!autenticado) {
    return (
      <main>
        <h1>⚙️ Administrar Amigo Secreto</h1>
        <div style={{ marginTop: "30px", textAlign: "center" }}>
          <p style={{ fontSize: "48px" }}>🔐</p>
          <p style={{ marginBottom: "20px" }}>Ingresa la contraseña de administrador</p>
          <form onSubmit={verificarPassword}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
              disabled={verificando}
              style={{ 
                padding: "10px", 
                fontSize: "16px",
                marginRight: "10px" 
              }}
            />
            <button 
              type="submit" 
              disabled={verificando || !password.trim()}
              style={{ padding: "10px 20px", fontSize: "16px" }}
            >
              {verificando ? "Verificando..." : "Entrar"}
            </button>
          </form>
          {errorAuth && (
            <p style={{ color: "red", marginTop: "10px" }}>{errorAuth}</p>
          )}
        </div>
      </main>
    );
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
              <li key={p.id} style={{ marginBottom: "8px" }}>
                {p.nombre}
                <button
                  onClick={() => generarInvitacion(p)}
                  style={{ 
                    marginLeft: "10px",
                    backgroundColor: copiado === p.id ? "#4CAF50" : "#2196F3",
                    color: "white",
                    border: "none",
                    padding: "4px 8px",
                    borderRadius: "4px",
                    cursor: "pointer"
                  }}
                >
                  {copiado === p.id ? "✅ Copiado" : "📋 Copiar invitación"}
                </button>
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
