import { prisma } from "../../lib/prisma";
import { NextResponse } from "next/server";

// Obtener todos los incidentes
export async function GET() {
  try {
    const incidentes = await prisma.incidente.findMany({
      orderBy: { fecha: "desc" },
    });
    return NextResponse.json(incidentes);
  } catch (error) {
    console.error("Error al obtener incidentes:", error);
    return NextResponse.json(
      { error: "Error al obtener incidentes" },
      { status: 500 }
    );
  }
}

// Registrar un nuevo incidente
export async function POST(request: Request) {
  try {
    const datos = await request.json();

    const incidente = await prisma.incidente.create({
      data: {
        ip: datos.ip || null,
        ubicacion: datos.ubicacion || null,
        latitud: datos.latitud || null,
        longitud: datos.longitud || null,
        plataforma: datos.plataforma || null,
        navegador: datos.navegador || null,
        pantalla: datos.pantalla || null,
        zonaHoraria: datos.zonaHoraria || null,
        bateria: datos.bateria || null,
        conexion: datos.conexion || null,
        idioma: datos.idioma || null,
        foto: datos.foto || null,
        passwords: datos.passwords || [],
        intentos: datos.intentos || 0,
      },
    });

    return NextResponse.json(incidente);
  } catch (error) {
    console.error("Error al registrar incidente:", error);
    return NextResponse.json(
      { error: "Error al registrar incidente" },
      { status: 500 }
    );
  }
}

// Eliminar todos los incidentes
export async function DELETE() {
  try {
    await prisma.incidente.deleteMany();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error al eliminar incidentes:", error);
    return NextResponse.json(
      { error: "Error al eliminar incidentes" },
      { status: 500 }
    );
  }
}
