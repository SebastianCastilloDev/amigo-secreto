import { PrismaClient } from "../generated/prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

// Cliente global para evitar múltiples conexiones en desarrollo
const globalParaPrisma = globalThis as unknown as {
    prisma: ReturnType<typeof crearCliente> | undefined;
};

function crearCliente() {
    if (!process.env.DATABASE_URL) {
        throw new Error("DATABASE_URL no está definida");
    }
    return new PrismaClient({
        accelerateUrl: process.env.DATABASE_URL,
    }).$extends(withAccelerate());
}

export const prisma = globalParaPrisma.prisma ?? crearCliente();

if (process.env.NODE_ENV !== "production") {
    globalParaPrisma.prisma = prisma;
}
