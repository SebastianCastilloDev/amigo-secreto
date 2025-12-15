import { prisma } from "../../lib/prisma";
import { NextResponse } from "next/server";

// Función para mezclar array (Fisher-Yates shuffle)
function mezclarArray<T>(array: T[]): T[] {
    const resultado = [...array];
    for (let i = resultado.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [resultado[i], resultado[j]] = [resultado[j], resultado[i]];
    }
    return resultado;
}

// POST: Realizar sorteo completo (solo admin) o revelar asignación (participante con token)
export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Si viene con token, es un participante queriendo ver su asignación
        if (body.token) {
            return revelarAsignacion(body.token);
        }

        // Si viene con realizarSorteo, es el admin queriendo hacer el sorteo
        if (body.realizarSorteo) {
            return realizarSorteoCompleto();
        }

        return NextResponse.json(
            { error: "Solicitud no válida" },
            { status: 400 }
        );
    } catch (error) {
        console.error("Error en sorteo:", error);
        return NextResponse.json(
            { error: "Error en el sorteo" },
            { status: 500 }
        );
    }
}

// Revelar la asignación de un participante (simula "sacar de la tómbola")
async function revelarAsignacion(token: string) {
    // Buscar participante por token
    const participante = await prisma.participante.findUnique({
        where: { token },
    });

    if (!participante) {
        return NextResponse.json(
            { error: "Invitación no válida" },
            { status: 403 }
        );
    }

    // Buscar su asignación
    const asignacion = await prisma.asignacion.findUnique({
        where: { quienRegalaId: participante.id },
        include: { quienRecibe: true },
    });

    if (!asignacion) {
        return NextResponse.json(
            { error: "El sorteo aún no se ha realizado. Espera a que el organizador lo haga." },
            { status: 404 }
        );
    }

    // Marcar como "visto" (para estadísticas del admin)
    // Por ahora solo devolvemos el resultado
    return NextResponse.json({
        yaAsignado: true, // Siempre true porque ya existe
        recibeNombre: asignacion.quienRecibe.nombre,
    });
}

// Realizar el sorteo completo (algoritmo de ciclo)
async function realizarSorteoCompleto() {
    // Verificar que no haya sorteo previo
    const asignacionesExistentes = await prisma.asignacion.count();
    if (asignacionesExistentes > 0) {
        return NextResponse.json(
            { error: "Ya existe un sorteo. Reinícialo primero si quieres hacer uno nuevo." },
            { status: 400 }
        );
    }

    // Obtener todos los participantes
    const participantes = await prisma.participante.findMany();

    if (participantes.length < 2) {
        return NextResponse.json(
            { error: "Se necesitan al menos 2 participantes para el sorteo" },
            { status: 400 }
        );
    }

    // Mezclar participantes aleatoriamente
    const mezclados = mezclarArray(participantes);

    // Crear asignaciones en ciclo: cada uno regala al siguiente
    // El último regala al primero (cierra el ciclo)
    const asignaciones = mezclados.map((participante, index) => {
        const siguienteIndex = (index + 1) % mezclados.length;
        return {
            quienRegalaId: participante.id,
            quienRecibeId: mezclados[siguienteIndex].id,
        };
    });

    // Guardar todas las asignaciones
    await prisma.asignacion.createMany({
        data: asignaciones,
    });

    return NextResponse.json({
        mensaje: "Sorteo realizado exitosamente",
        totalAsignaciones: asignaciones.length,
    });
}

// Obtener la asignación de un participante
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const participanteId = searchParams.get("participanteId");

        if (!participanteId) {
            return NextResponse.json(
                { error: "Se requiere el id del participante" },
                { status: 400 }
            );
        }

        const asignacion = await prisma.asignacion.findUnique({
            where: { quienRegalaId: parseInt(participanteId) },
            include: { quienRecibe: true },
        });

        if (!asignacion) {
            return NextResponse.json(
                { error: "No hay sorteo realizado aún" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            recibeNombre: asignacion.quienRecibe.nombre,
        });
    } catch (error) {
        console.error("Error al obtener asignación:", error);
        return NextResponse.json(
            { error: "Error al obtener la asignación" },
            { status: 500 }
        );
    }
}

// Eliminar el sorteo (reiniciar)
export async function DELETE() {
    try {
        await prisma.asignacion.deleteMany();
        return NextResponse.json({ mensaje: "Sorteo eliminado" });
    } catch (error) {
        console.error("Error al eliminar sorteo:", error);
        return NextResponse.json(
            { error: "Error al eliminar el sorteo" },
            { status: 500 }
        );
    }
}
