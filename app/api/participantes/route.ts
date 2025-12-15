import { prisma } from "../../lib/prisma";
import { NextResponse } from "next/server";

// Obtener todos los participantes con su asignación (para admin)
export async function GET() {
    try {
        // Obtener participantes
        const participantes = await prisma.participante.findMany({
            orderBy: { id: "asc" },
        });

        // Obtener asignaciones
        const asignaciones = await prisma.asignacion.findMany({
            include: {
                quienRecibe: true,
            },
        });

        // Crear mapa de asignaciones: quienRegalaId -> nombreQuienRecibe
        const mapaAsignaciones = new Map<number, string>();
        for (const a of asignaciones) {
            mapaAsignaciones.set(a.quienRegalaId, a.quienRecibe.nombre);
        }

        // Transformar para incluir el nombre del amigo secreto asignado
        const resultado = participantes.map((p) => ({
            id: p.id,
            nombre: p.nombre,
            amigoSecreto: mapaAsignaciones.get(p.id) || null,
        }));

        return NextResponse.json(resultado);
    } catch (error) {
        console.error("Error al obtener participantes:", error);
        return NextResponse.json(
            { error: "Error al obtener participantes" },
            { status: 500 }
        );
    }
}

// Agregar un nuevo participante
export async function POST(request: Request) {
    try {
        const { nombre } = await request.json();

        if (!nombre || nombre.trim() === "") {
            return NextResponse.json(
                { error: "El nombre es requerido" },
                { status: 400 }
            );
        }

        // Validar duplicados
        const existente = await prisma.participante.findFirst({
            where: { nombre: { equals: nombre.trim(), mode: "insensitive" } },
        });

        if (existente) {
            return NextResponse.json(
                { error: "Ya existe un participante con ese nombre" },
                { status: 400 }
            );
        }

        const participante = await prisma.participante.create({
            data: { nombre: nombre.trim() },
        });

        return NextResponse.json(participante);
    } catch (error) {
        console.error("Error al crear participante:", error);
        return NextResponse.json(
            { error: "Error al crear participante" },
            { status: 500 }
        );
    }
}

// Eliminar un participante
export async function DELETE(request: Request) {
    try {
        const { id } = await request.json();

        if (!id) {
            return NextResponse.json(
                { error: "El id es requerido" },
                { status: 400 }
            );
        }

        // Primero eliminar asignaciones relacionadas
        await prisma.asignacion.deleteMany({
            where: {
                OR: [
                    { quienRegalaId: id },
                    { quienRecibeId: id },
                ],
            },
        });

        // Luego eliminar el participante
        await prisma.participante.delete({
            where: { id },
        });

        return NextResponse.json({ mensaje: "Participante eliminado" });
    } catch (error) {
        console.error("Error al eliminar participante:", error);
        return NextResponse.json(
            { error: "Error al eliminar participante" },
            { status: 500 }
        );
    }
}
