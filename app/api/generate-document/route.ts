import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { generateDocument } from "@/lib/templates";

export async function POST(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    verifyToken(token);
  } catch {
    return NextResponse.json({ error: "Token inválido" }, { status: 401 });
  }

  try {
    const { templatePath, formData } = await request.json();

    if (!templatePath || !formData) {
      return NextResponse.json(
        { error: "Faltan datos: templatePath y formData son requeridos" },
        { status: 400 },
      );
    }

    const buffer = generateDocument(templatePath, formData);

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="${encodeURIComponent(templatePath.split("/").pop()?.replace(/\.docx$/, "") || "documento")}.docx"`,
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Error al generar el documento" },
      { status: 500 },
    );
  }
}
