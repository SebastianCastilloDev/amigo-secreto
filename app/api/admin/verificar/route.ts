import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { password } = await request.json();

    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      return NextResponse.json(
        { error: "Contraseña de admin no configurada" },
        { status: 500 }
      );
    }

    if (password === adminPassword) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: "Contraseña incorrecta" },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Error al verificar contraseña:", error);
    return NextResponse.json(
      { error: "Error al verificar" },
      { status: 500 }
    );
  }
}
