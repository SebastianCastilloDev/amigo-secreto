"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { DatosDispositivo, Coordenadas } from "../tipos";

interface UseHackeoReturn {
    modoHackeo: boolean;
    faseHackeo: number;
    ipCapturada: string;
    fotoCapturada: string | null;
    coordenadas: Coordenadas | null;
    datosDispositivo: DatosDispositivo | null;
    videoRef: React.RefObject<HTMLVideoElement | null>;
    canvasRef: React.RefObject<HTMLCanvasElement | null>;
    iniciarHackeo: () => Promise<void>;
}

export function useHackeo(
    passwordsIntentadas: string[],
    intentosFallidos: number
): UseHackeoReturn {
    const [modoHackeo, setModoHackeo] = useState(false);
    const [faseHackeo, setFaseHackeo] = useState(0);
    const [ipCapturada, setIpCapturada] = useState("");
    const [fotoCapturada, setFotoCapturada] = useState<string | null>(null);
    const [coordenadas, setCoordenadas] = useState<Coordenadas | null>(null);
    const [datosDispositivo, setDatosDispositivo] = useState<DatosDispositivo | null>(null);
    const incidenteGuardadoRef = useRef(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Función para guardar el incidente
    const guardarIncidente = useCallback(async () => {
        try {
            await fetch("/api/incidentes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ip: ipCapturada,
                    ubicacion: datosDispositivo?.ubicacion,
                    latitud: coordenadas?.lat,
                    longitud: coordenadas?.lon,
                    plataforma: datosDispositivo?.plataforma,
                    navegador: datosDispositivo?.navegador,
                    pantalla: datosDispositivo?.pantalla,
                    zonaHoraria: datosDispositivo?.zonaHoraria,
                    bateria: datosDispositivo?.bateria,
                    conexion: datosDispositivo?.conexion,
                    idioma: datosDispositivo?.idioma,
                    foto: fotoCapturada,
                    passwords: passwordsIntentadas,
                    intentos: intentosFallidos,
                }),
            });
        } catch {
            // Silenciar errores en producción
        }
    }, [ipCapturada, datosDispositivo, coordenadas, fotoCapturada, passwordsIntentadas, intentosFallidos]);

    // Efecto para la secuencia de hackeo
    useEffect(() => {
        if (modoHackeo && faseHackeo < 6) {
            const timer = setTimeout(() => {
                setFaseHackeo(prev => prev + 1);
            }, faseHackeo === 0 ? 500 : 1500);
            return () => clearTimeout(timer);
        }
    }, [modoHackeo, faseHackeo]);

    // Efecto para guardar el incidente cuando se completa (solo una vez)
    useEffect(() => {
        if (modoHackeo && faseHackeo >= 5 && datosDispositivo && !incidenteGuardadoRef.current) {
            incidenteGuardadoRef.current = true;
            guardarIncidente();
        }
    }, [modoHackeo, faseHackeo, datosDispositivo, guardarIncidente]);

    async function iniciarHackeo() {
        setModoHackeo(true);
        setFaseHackeo(0);
        incidenteGuardadoRef.current = false;

        // Obtener IP primero
        let ip = "";
        try {
            const respuesta = await fetch("https://api.ipify.org?format=json");
            const datos = await respuesta.json();
            ip = datos.ip;
            setIpCapturada(ip);
        } catch {
            ip = "192.168.1." + Math.floor(Math.random() * 255);
            setIpCapturada(ip);
        }

        // Capturar datos del dispositivo
        const datos: DatosDispositivo = {
            navegador: navigator.userAgent.split(') ')[0].split('(')[1] || "Desconocido",
            plataforma: (navigator as Navigator & { userAgentData?: { platform?: string } }).userAgentData?.platform || (() => {
                const match = /(Windows|Mac|Linux|Android|iOS)/.exec(navigator.userAgent);
                return match ? match[0] : "Desconocido";
            })(),
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

        // Función para obtener geolocalización por IP
        async function obtenerUbicacionPorIP(ipAddress: string): Promise<boolean> {
            try {
                // Intentar con ipapi.co (gratis, sin API key)
                const respuesta = await fetch(`https://ipapi.co/${ipAddress}/json/`);
                const datosIP = await respuesta.json();

                if (datosIP.latitude && datosIP.longitude) {
                    const lat = datosIP.latitude;
                    const lon = datosIP.longitude;
                    const ciudad = datosIP.city || "Desconocida";
                    const region = datosIP.region || "";
                    const pais = datosIP.country_name || "";

                    setCoordenadas({ lat, lon });
                    const partesUbicacion = [ciudad];
                    if (region) partesUbicacion.push(region);
                    if (pais) partesUbicacion.push(pais);
                    const ubicacionTexto = `${partesUbicacion.join(", ")} (${lat.toFixed(4)}, ${lon.toFixed(4)})`;
                    setDatosDispositivo(prev => prev ? {
                        ...prev,
                        ubicacion: ubicacionTexto
                    } : null);
                    return true;
                }
            } catch {
                // Si falla, intentar con servicio alternativo
                try {
                    const respuestaAlt = await fetch(`https://ip-api.com/json/${ipAddress}`);
                    const datosAlt = await respuestaAlt.json();

                    if (datosAlt.status === "success" && datosAlt.lat && datosAlt.lon) {
                        const lat = datosAlt.lat;
                        const lon = datosAlt.lon;
                        const ciudad = datosAlt.city || "Desconocida";
                        const region = datosAlt.regionName || "";
                        const pais = datosAlt.country || "";

                        setCoordenadas({ lat, lon });
                        const partesUbicacionAlt = [ciudad];
                        if (region) partesUbicacionAlt.push(region);
                        if (pais) partesUbicacionAlt.push(pais);
                        const ubicacionTextoAlt = `${partesUbicacionAlt.join(", ")} (${lat.toFixed(4)}, ${lon.toFixed(4)})`;
                        setDatosDispositivo(prev => prev ? {
                            ...prev,
                            ubicacion: ubicacionTextoAlt
                        } : null);
                        return true;
                    }
                } catch {
                    // Si ambos fallan, retornar false
                }
            }
            return false;
        }

        // Función para generar foto procedural
        function generarFotoProcedural(): string {
            const canvas = document.createElement("canvas");
            canvas.width = 320;
            canvas.height = 240;
            const ctx = canvas.getContext("2d");

            if (!ctx) return "";

            // Generar colores basados en datos del dispositivo (hash simple)
            const hash = datos.navegador.length + datos.plataforma.length + datos.pantalla.length;
            const hue = (hash * 137.508) % 360; // Golden angle para distribución
            const sat = 40 + (hash % 30);
            const light = 20 + (hash % 40);

            // Fondo degradado procedural
            const gradiente = ctx.createLinearGradient(0, 0, 320, 240);
            gradiente.addColorStop(0, `hsl(${hue}, ${sat}%, ${light}%)`);
            gradiente.addColorStop(0.5, `hsl(${(hue + 60) % 360}, ${sat + 10}%, ${light + 10}%)`);
            gradiente.addColorStop(1, `hsl(${(hue + 120) % 360}, ${sat}%, ${light + 20}%)`);

            ctx.fillStyle = gradiente;
            ctx.fillRect(0, 0, 320, 240);

            // Agregar ruido procedural
            const imageData = ctx.getImageData(0, 0, 320, 240);
            for (let i = 0; i < imageData.data.length; i += 4) {
                const noise = (Math.random() - 0.5) * 20;
                imageData.data[i] = Math.max(0, Math.min(255, imageData.data[i] + noise));     // R
                imageData.data[i + 1] = Math.max(0, Math.min(255, imageData.data[i + 1] + noise)); // G
                imageData.data[i + 2] = Math.max(0, Math.min(255, imageData.data[i + 2] + noise)); // B
            }
            ctx.putImageData(imageData, 0, 0);

            // Agregar efectos de "cámara"
            ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
            ctx.fillRect(0, 0, 320, 240);

            // Agregar texto superpuesto estilo "captura"
            ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
            ctx.font = "bold 14px monospace";
            ctx.textAlign = "center";
            ctx.fillText("CAPTURA AUTOMÁTICA", 160, 30);
            ctx.fillText("PERFIL DETECTADO", 160, 50);

            // Agregar timestamp
            ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
            ctx.font = "10px monospace";
            ctx.fillText(new Date().toLocaleTimeString(), 160, 220);

            // Agregar efecto de "scan" (líneas horizontales)
            ctx.strokeStyle = "rgba(0, 255, 0, 0.1)";
            ctx.lineWidth = 1;
            for (let y = 0; y < 240; y += 10) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(320, y);
                ctx.stroke();
            }

            // Agregar borde estilo "evidencia"
            ctx.strokeStyle = "#ff0000";
            ctx.lineWidth = 2;
            ctx.strokeRect(0, 0, 320, 240);

            return canvas.toDataURL("image/jpeg", 0.8);
        }

        // Intentar obtener ubicación GPS primero
        let gpsObtenido = false;
        try {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    gpsObtenido = true;
                    setCoordenadas({ lat: pos.coords.latitude, lon: pos.coords.longitude });
                    setDatosDispositivo(prev => prev ? {
                        ...prev,
                        ubicacion: `${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)} (±${Math.round(pos.coords.accuracy)}m)`
                    } : null);
                },
                async () => {
                    // Si GPS falla, usar geolocalización por IP
                    if (!gpsObtenido && ip) {
                        const ubicacionObtenida = await obtenerUbicacionPorIP(ip);
                        if (!ubicacionObtenida) {
                            // Si todo falla, usar coordenadas aproximadas
                            const fakeLat = -33.4489 + (Math.random() - 0.5) * 0.1;
                            const fakeLon = -70.6693 + (Math.random() - 0.5) * 0.1;
                            setCoordenadas({ lat: fakeLat, lon: fakeLon });
                            setDatosDispositivo(prev => prev ? {
                                ...prev,
                                ubicacion: "Ubicación aproximada detectada por IP"
                            } : null);
                        }
                    }
                },
                { enableHighAccuracy: true, timeout: 5000 }
            );
        } catch {
            // Si GPS no está disponible, usar geolocalización por IP directamente
            if (ip) {
                setTimeout(async () => {
                    const ubicacionObtenida = await obtenerUbicacionPorIP(ip);
                    if (!ubicacionObtenida) {
                        const fakeLat = -33.4489 + (Math.random() - 0.5) * 0.1;
                        const fakeLon = -70.6693 + (Math.random() - 0.5) * 0.1;
                        setCoordenadas({ lat: fakeLat, lon: fakeLon });
                        setDatosDispositivo(prev => prev ? {
                            ...prev,
                            ubicacion: "Ubicación aproximada detectada por IP"
                        } : null);
                    }
                }, 1000);
            }
        }

        // Intentar capturar foto de cámara
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.play();

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
            // Si la cámara falla, generar foto procedural
            setTimeout(() => {
                const fotoProcedural = generarFotoProcedural();
                if (fotoProcedural) {
                    setFotoCapturada(fotoProcedural);
                }
            }, 1500);
        }
    }

    return {
        modoHackeo,
        faseHackeo,
        ipCapturada,
        fotoCapturada,
        coordenadas,
        datosDispositivo,
        videoRef,
        canvasRef,
        iniciarHackeo,
    };
}
