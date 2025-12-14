"use client";

import { useState } from "react";
import type { Participante } from "../tipos";

interface UseParticipantesReturn {
    participantes: Participante[];
    nuevoNombre: string;
    setNuevoNombre: (nombre: string) => void;
    guardando: boolean;
    errorAgregar: string;
    copiado: number | null;
    cargarParticipantes: () => Promise<void>;
    agregarParticipante: (e: React.FormEvent) => Promise<void>;
    eliminarParticipante: (id: number) => Promise<void>;
    generarInvitacion: (participante: Participante) => Promise<void>;
}

export function useParticipantes(): UseParticipantesReturn {
    const [participantes, setParticipantes] = useState<Participante[]>([]);
    const [nuevoNombre, setNuevoNombre] = useState("");
    const [guardando, setGuardando] = useState(false);
    const [errorAgregar, setErrorAgregar] = useState("");
    const [copiado, setCopiado] = useState<number | null>(null);

    async function cargarParticipantes() {
        try {
            const respuesta = await fetch("/api/participantes");
            const datos = await respuesta.json();
            setParticipantes(datos);
        } catch (error) {
            console.error("Error al cargar participantes:", error);
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

    function copiarAlPortapapeles(participante: Participante) {
        const url = `${window.location.origin}/participar/${participante.token}`;
        navigator.clipboard.writeText(url);
        setCopiado(participante.id);
        setTimeout(() => setCopiado(null), 2000);
    }

    async function generarInvitacion(participante: Participante) {
        if (participante.token) {
            copiarAlPortapapeles(participante);
            return;
        }

        try {
            const respuesta = await fetch("/api/participantes/invitacion", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ participanteId: participante.id }),
            });

            if (respuesta.ok) {
                const datos = await respuesta.json();
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

    return {
        participantes,
        nuevoNombre,
        setNuevoNombre,
        guardando,
        errorAgregar,
        copiado,
        cargarParticipantes,
        agregarParticipante,
        eliminarParticipante,
        generarInvitacion,
    };
}
