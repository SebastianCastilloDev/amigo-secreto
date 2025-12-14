import { prisma } from "../../lib/prisma";
import { NextResponse } from "next/server";

// Realizar sorteo individual (tómbola)
export async function POST(request: Request) {
    try {
        const { participanteId } = await request.json();

        if (!participanteId) {
            return NextResponse.json(
                { error: "Se requiere el id del participante" },
                { status: 400 }
            );
        }

        // Verificar si ya tiene asignación
        const asignacionExistente = await prisma.asignacion.findUnique({
            where: { quienRegalaId: participanteId },
            include: { quienRecibe: true },
        });

        if (asignacionExistente) {
            // Ya tiene asignación, devolver la existente
            return NextResponse.json({
                yaAsignado: true,
                recibeNombre: asignacionExistente.quienRecibe.nombre,
            });
        }

        // Obtener IDs de participantes que YA fueron asignados a alguien
        const asignacionesExistentes = await prisma.asignacion.findMany({
            select: { quienRecibeId: true },
        });
        const idsYaAsignados = asignacionesExistentes.map((a) => a.quienRecibeId);

        // Obtener participantes disponibles (no asignados y no es él mismo)
        const disponibles = await prisma.participante.findMany({
            where: {
                id: {
                    notIn: [...idsYaAsignados, participanteId],
                },
            },
        });

        if (disponibles.length === 0) {
            return NextResponse.json(
                { error: "No hay participantes disponibles para asignar" },
                { status: 400 }
            );
        }

        // Elegir uno al azar
        const indiceAleatorio = Math.floor(Math.random() * disponibles.length);
        const elegido = disponibles[indiceAleatorio];

        // Crear la asignación
        await prisma.asignacion.create({
            data: {
                quienRegalaId: participanteId,
                quienRecibeId: elegido.id,
            },
        });

        return NextResponse.json({
            yaAsignado: false,
            recibeNombre: elegido.nombre,
        });
    } catch (error) {
        console.error("Error al realizar sorteo:", error);
        return NextResponse.json(
            { error: "Error al realizar el sorteo" },
            { status: 500 }
        );
    }
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
