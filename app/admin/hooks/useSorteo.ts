"use client";

import { useState } from "react";

interface UseSorteoReturn {
    mensajeSorteo: string;
    sorteoRealizado: boolean;
    realizandoSorteo: boolean;
    verificarEstadoSorteo: () => Promise<void>;
    realizarSorteo: () => Promise<boolean>;
    reiniciarSorteo: () => Promise<void>;
}

export function useSorteo(): UseSorteoReturn {
    const [mensajeSorteo, setMensajeSorteo] = useState("");
    const [sorteoRealizado, setSorteoRealizado] = useState(false);
    const [realizandoSorteo, setRealizandoSorteo] = useState(false);

    async function verificarEstadoSorteo() {
        try {
            const respuesta = await fetch("/api/sorteo/estado");
            const datos = await respuesta.json();
            setSorteoRealizado(datos.sorteoRealizado);
        } catch (error) {
            console.error("Error al verificar estado:", error);
        }
    }

    async function realizarSorteo(): Promise<boolean> {
        if (!confirm("¿Realizar el sorteo ahora? Una vez hecho, cada participante podrá ver a quién le toca regalar.")) {
            return false;
        }

        setRealizandoSorteo(true);
        setMensajeSorteo("");

        try {
            const respuesta = await fetch("/api/sorteo", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ realizarSorteo: true }),
            });

            const datos = await respuesta.json();

            if (respuesta.ok) {
                setMensajeSorteo(`✅ ¡Sorteo realizado! ${datos.totalAsignaciones} asignaciones creadas.`);
                setSorteoRealizado(true);
                return true;
            } else {
                setMensajeSorteo(`❌ ${datos.error}`);
                return false;
            }
        } catch {
            setMensajeSorteo("❌ Error de conexión al realizar el sorteo");
            return false;
        } finally {
            setRealizandoSorteo(false);
        }
    }

    async function reiniciarSorteo() {
        if (!confirm("¿Estás seguro de reiniciar el sorteo? Se eliminarán TODAS las asignaciones.")) {
            return;
        }

        try {
            const respuesta = await fetch("/api/sorteo", {
                method: "DELETE",
            });

            if (respuesta.ok) {
                setMensajeSorteo("🔄 Sorteo reiniciado. Puedes volver a realizarlo.");
                setSorteoRealizado(false);
            }
        } catch {
            setMensajeSorteo("❌ Error al reiniciar el sorteo");
        }
    }

    return {
        mensajeSorteo,
        sorteoRealizado,
        realizandoSorteo,
        verificarEstadoSorteo,
        realizarSorteo,
        reiniciarSorteo,
    };
}
