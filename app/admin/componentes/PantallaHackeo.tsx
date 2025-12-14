"use client";

import type { DatosDispositivo, Coordenadas } from "../tipos";

interface Props {
  faseHackeo: number;
  ipCapturada: string;
  fotoCapturada: string | null;
  coordenadas: Coordenadas | null;
  datosDispositivo: DatosDispositivo | null;
  passwordsIntentadas: string[];
  intentosFallidos: number;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
}

export function PantallaHackeo({
  faseHackeo,
  ipCapturada,
  fotoCapturada,
  coordenadas,
  datosDispositivo,
  passwordsIntentadas,
  intentosFallidos,
  videoRef,
  canvasRef,
}: Props) {
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
        <SecuenciaHackeo 
          faseHackeo={faseHackeo} 
          ipCapturada={ipCapturada} 
          datosDispositivo={datosDispositivo} 
        />

        {/* Contenedor de foto y datos */}
        {faseHackeo >= 3 && (
          <PanelDatosCapturados
            faseHackeo={faseHackeo}
            fotoCapturada={fotoCapturada}
            coordenadas={coordenadas}
            datosDispositivo={datosDispositivo}
            ipCapturada={ipCapturada}
            passwordsIntentadas={passwordsIntentadas}
          />
        )}

        {/* Mensaje amenazante final */}
        {faseHackeo >= 5 && (
          <MensajeFinal
            ipCapturada={ipCapturada}
            intentosFallidos={intentosFallidos}
            passwordsIntentadas={passwordsIntentadas}
            fotoCapturada={fotoCapturada}
          />
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

function SecuenciaHackeo({ 
  faseHackeo, 
  ipCapturada, 
  datosDispositivo 
}: { 
  faseHackeo: number; 
  ipCapturada: string; 
  datosDispositivo: DatosDispositivo | null;
}) {
  return (
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
  );
}

function PanelDatosCapturados({
  faseHackeo,
  fotoCapturada,
  coordenadas,
  datosDispositivo,
  ipCapturada,
  passwordsIntentadas,
}: {
  faseHackeo: number;
  fotoCapturada: string | null;
  coordenadas: Coordenadas | null;
  datosDispositivo: DatosDispositivo | null;
  ipCapturada: string;
  passwordsIntentadas: string[];
}) {
  return (
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
  );
}

function MensajeFinal({
  ipCapturada,
  intentosFallidos,
  passwordsIntentadas,
  fotoCapturada,
}: {
  ipCapturada: string;
  intentosFallidos: number;
  passwordsIntentadas: string[];
  fotoCapturada: string | null;
}) {
  return (
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
  );
}
