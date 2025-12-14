"use client";

import { useState } from "react";
import type { Incidente } from "../tipos";

interface UseIncidentesReturn {
    incidentes: Incidente[];
    verIncidentes: boolean;
    setVerIncidentes: (ver: boolean) => void;
    cargarIncidentes: () => Promise<void>;
}

export function useIncidentes(): UseIncidentesReturn {
    const [incidentes, setIncidentes] = useState<Incidente[]>([]);
    const [verIncidentes, setVerIncidentes] = useState(false);

    async function cargarIncidentes() {
        try {
            const respuesta = await fetch("/api/incidentes");
            const datos = await respuesta.json();
            setIncidentes(datos);
        } catch (error) {
            console.error("Error al cargar incidentes:", error);
        }
    }

    return {
        incidentes,
        verIncidentes,
        setVerIncidentes,
        cargarIncidentes,
    };
}
