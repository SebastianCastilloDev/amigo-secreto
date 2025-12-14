import { prisma } from "../../../lib/prisma";
import { NextResponse } from "next/server";

// Ver el estado del sorteo
export async function GET() {
    try {
        const totalAsignaciones = await prisma.asignacion.count();

        return NextResponse.json({
            sorteoRealizado: totalAsignaciones > 0,
            totalAsignaciones,
        });
    } catch (error) {
        console.error("Error al obtener estado:", error);
        return NextResponse.json(
            { error: "Error al obtener el estado del sorteo" },
            { status: 500 }
        );
    }
}
