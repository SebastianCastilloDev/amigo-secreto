"use client";

import { useState, useEffect, useRef } from "react";
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
    const [incidenteGuardado, setIncidenteGuardado] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

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
        console.log("[Hackeo] Estado actual:", { 
            modoHackeo, 
            faseHackeo, 
            datosDispositivo: !!datosDispositivo, 
            incidenteGuardado 
        });
        
        if (modoHackeo && faseHackeo >= 5 && datosDispositivo && !incidenteGuardado) {
            console.log("[Hackeo] Guardando incidente...");
            setIncidenteGuardado(true);
            guardarIncidente();
        }
    }, [modoHackeo, faseHackeo, datosDispositivo, incidenteGuardado]);

    async function guardarIncidente() {
        console.log("[Hackeo] Enviando incidente al servidor...");
        try {
            const response = await fetch("/api/incidentes", {
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
            console.log("[Hackeo] Respuesta del servidor:", response.status, response.ok);
            if (!response.ok) {
                const error = await response.text();
                console.error("[Hackeo] Error del servidor:", error);
            }
        } catch (error) {
            console.error("[Hackeo] Error al guardar incidente:", error);
        }
    }

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
        const datos: DatosDispositivo = {
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
            // No hay cámara o no dio permiso
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
