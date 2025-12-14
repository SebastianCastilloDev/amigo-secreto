import { prisma } from "../../lib/prisma";
import { NextResponse } from "next/server";

// Realizar el sorteo
export async function POST() {
    try {
        // Obtener todos los participantes
        const participantes = await prisma.participante.findMany();

        if (participantes.length < 2) {
            return NextResponse.json(
                { error: "Se necesitan al menos 2 participantes" },
                { status: 400 }
            );
        }

        // Eliminar asignaciones anteriores
        await prisma.asignacion.deleteMany();

        // Crear una copia mezclada para asignar receptores
        const receptores = [...participantes];

        // Mezclar usando Fisher-Yates
        for (let i = receptores.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [receptores[i], receptores[j]] = [receptores[j], receptores[i]];
        }

        // Verificar que nadie se regale a sí mismo y reasignar si es necesario
        let intentos = 0;
        const maxIntentos = 100;

        while (intentos < maxIntentos) {
            let valido = true;

            for (let i = 0; i < participantes.length; i++) {
                if (participantes[i].id === receptores[i].id) {
                    valido = false;
                    // Intercambiar con el siguiente
                    const siguiente = (i + 1) % receptores.length;
                    [receptores[i], receptores[siguiente]] = [receptores[siguiente], receptores[i]];
                }
            }

            if (valido) break;
            intentos++;
        }

        // Verificación final
        for (let i = 0; i < participantes.length; i++) {
            if (participantes[i].id === receptores[i].id) {
                return NextResponse.json(
                    { error: "No se pudo realizar un sorteo válido. Intenta de nuevo." },
                    { status: 500 }
                );
            }
        }

        // Crear las asignaciones
        for (let i = 0; i < participantes.length; i++) {
            await prisma.asignacion.create({
                data: {
                    quienRegalaId: participantes[i].id,
                    quienRecibeId: receptores[i].id,
                },
            });
        }

        return NextResponse.json({
            mensaje: "Sorteo realizado con éxito",
            asignaciones: participantes.length
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
