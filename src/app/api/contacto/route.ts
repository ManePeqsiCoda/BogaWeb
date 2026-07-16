import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

const contactSchema = z.object({
  nombre: z.string().min(2, "El nombre es requerido"),
  empresa: z.string().optional(),
  email: z.string().email("Ingresa un correo válido"),
  telefono: z.string().min(7, "El teléfono debe tener al menos 7 dígitos"),
  tipoEvento: z.string().optional(),
  fechaAproximada: z.string().optional(),
  mensaje: z.string().min(10, "El mensaje debe tener al menos 10 caracteres"),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const result = contactSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Datos inválidos",
          errors: result.error.flatten().fieldErrors,
        },
        { status: 400 }
      )
    }

    // TODO: Conectar servicio de email (Resend, SendGrid, AWS SES) o guardar en DB
    // Por ahora, la solicitud se valida y registra exitosamente.

    return NextResponse.json(
      {
        success: true,
        message:
          "Mensaje recibido. Nuestro equipo te contactará en menos de 24 horas.",
      },
      { status: 200 }
    )
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Error al procesar la solicitud",
      },
      { status: 500 }
    )
  }
}
