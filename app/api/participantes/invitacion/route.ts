import { prisma } from "../../../lib/prisma";
import { NextResponse } from "next/server";
import { randomBytes } from "crypto";

// Generar token para un participante
export async function POST(request: Request) {
    try {
        const { participanteId } = await request.json();

        if (!participanteId) {
            return NextResponse.json(
                { error: "Se requiere el id del participante" },
                { status: 400 }
            );
        }

        // Generar token único
        const token = randomBytes(8).toString("hex");

        // Actualizar participante con el token
        const participante = await prisma.participante.update({
            where: { id: participanteId },
            data: { token },
        });

        return NextResponse.json({
            token: participante.token,
            nombre: participante.nombre,
        });
    } catch (error) {
        console.error("Error al generar token:", error);
        return NextResponse.json(
            { error: "Error al generar la invitación" },
            { status: 500 }
        );
    }
}
