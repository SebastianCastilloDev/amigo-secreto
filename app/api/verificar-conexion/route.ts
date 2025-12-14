import { prisma } from "../../lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        // Intentamos hacer una consulta simple para verificar la conexión
        await prisma.$queryRaw`SELECT 1`;

        return NextResponse.json({
            conectado: true,
            mensaje: "¡Conexión exitosa a la base de datos!"
        });
    } catch (error) {
        console.error("Error de conexión:", error);

        return NextResponse.json({
            conectado: false,
            mensaje: "No se pudo conectar a la base de datos 😢"
        }, { status: 500 });
    }
}
