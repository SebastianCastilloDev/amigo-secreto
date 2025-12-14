import { prisma } from "../../lib/prisma";
import { NextResponse } from "next/server";

// Obtener todos los participantes (solo nombres, sin IDs ni tokens)
export async function GET() {
    try {
        const participantes = await prisma.participante.findMany({
            orderBy: { id: "asc" },
            select: {
                id: true,
                nombre: true,
                // NO exponer token
            },
        });
        return NextResponse.json(participantes);
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
