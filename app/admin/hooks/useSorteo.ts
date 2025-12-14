"use client";

import { useState } from "react";

interface UseSorteoReturn {
    mensajeSorteo: string;
    sorteoRealizado: boolean;
    verificarEstadoSorteo: () => Promise<void>;
    reiniciarSorteo: () => Promise<void>;
}

export function useSorteo(): UseSorteoReturn {
    const [mensajeSorteo, setMensajeSorteo] = useState("");
    const [sorteoRealizado, setSorteoRealizado] = useState(false);

    async function verificarEstadoSorteo() {
        try {
            const respuesta = await fetch("/api/sorteo/estado");
            const datos = await respuesta.json();
            setSorteoRealizado(datos.sorteoRealizado);
        } catch (error) {
            console.error("Error al verificar estado:", error);
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
        } catch {
            setMensajeSorteo("❌ Error al reiniciar la tómbola");
        }
    }

    return {
        mensajeSorteo,
        sorteoRealizado,
        verificarEstadoSorteo,
        reiniciarSorteo,
    };
}
