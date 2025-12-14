import { prisma } from "../../lib/prisma";
import { NextResponse } from "next/server";

// Obtener participante por token
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const token = searchParams.get("token");

        if (!token) {
            return NextResponse.json(
                { error: "Token requerido" },
                { status: 400 }
            );
        }

        const participante = await prisma.participante.findUnique({
            where: { token },
            include: {
                regalaA: {
                    include: { quienRecibe: true },
                },
            },
        });

        if (!participante) {
            return NextResponse.json(
                { error: "Invitación no válida" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            id: participante.id,
            nombre: participante.nombre,
            yaParticipo: !!participante.regalaA,
            amigoSecreto: participante.regalaA?.quienRecibe.nombre || null,
        });
    } catch (error) {
        console.error("Error al verificar token:", error);
        return NextResponse.json(
            { error: "Error al verificar la invitación" },
            { status: 500 }
        );
    }
}
