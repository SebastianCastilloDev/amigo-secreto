import { prisma } from "../../lib/prisma";
import { NextResponse } from "next/server";

// Obtener todos los participantes
export async function GET() {
    try {
        const participantes = await prisma.participante.findMany({
            orderBy: { id: "asc" },
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
