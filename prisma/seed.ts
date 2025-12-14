import { PrismaClient } from "../app/generated/prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";
import "dotenv/config";

async function main() {
    if (!process.env.DATABASE_URL) {
        throw new Error("DATABASE_URL no está definida");
    }

    const prisma = new PrismaClient({
        accelerateUrl: process.env.DATABASE_URL,
    }).$extends(withAccelerate());

    console.log("🌱 Iniciando seed...");

    // Limpiar datos existentes
    await prisma.asignacion.deleteMany();
    await prisma.participante.deleteMany();

    console.log("🗑️  Datos anteriores eliminados");

    // Crear participantes de prueba
    const participantes = [
        { nombre: "Papá" },
        { nombre: "Mamá" },
        { nombre: "Sebastián" },
        { nombre: "Hermano" },
    ];

    for (const p of participantes) {
        await prisma.participante.create({ data: p });
        console.log(`✅ Creado: ${p.nombre}`);
    }

    console.log("\n🎉 Seed completado! 4 participantes creados.");
}

main()
    .catch((e) => {
        console.error("❌ Error en seed:", e);
        process.exit(1);
    });
