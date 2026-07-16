import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

const configSchema = z.object({
  nombreSitio: z.string().min(1).optional(),
  telefono: z.string().optional().nullable(),
  email: z.string().email().optional().nullable(),
  direccionMedellin: z.string().optional().nullable(),
  direccionBogota: z.string().optional().nullable(),
  whatsappNumero: z.string().optional().nullable(),
  instagramUrl: z.string().optional().nullable(),
  linkedinUrl: z.string().optional().nullable(),
  mensajeWhatsApp: z.string().optional().nullable(),
  seoTitleDefault: z.string().optional().nullable(),
  seoDescriptionDefault: z.string().optional().nullable(),
  scriptAnalytics: z.string().optional().nullable(),
})

export async function GET() {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  try {
    const config = await prisma.configuracion.upsert({
      where: { id: 1 },
      update: {},
      create: {
        id: 1,
        nombreSitio: "Junisama Inversiones S.A.S",
        telefono: "+57 350 708 9584",
        email: "soporte@junisama.com",
        direccionMedellin: "Calle 13 sur #51C-54",
        direccionBogota: "Cra 58b bis # 131A 51",
        whatsappNumero: "573507089584",
        mensajeWhatsApp: "Hola, me gustaría recibir información sobre sus servicios.",
      },
    })

    return NextResponse.json(config)
  } catch (error) {
    console.error("Error obteniendo configuración:", error)
    return NextResponse.json(
      { error: "Error al obtener la configuración" },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const parsed = configSchema.parse(body)

    const data = Object.fromEntries(
      Object.entries(parsed).map(([key, value]) => [
        key,
        value === null ? undefined : value,
      ])
    )

    const config = await prisma.configuracion.upsert({
      where: { id: 1 },
      update: {
        ...data,
        updatedAt: new Date(),
      },
      create: {
        id: 1,
        ...data,
      },
    })

    return NextResponse.json(config)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Datos inválidos", issues: error.issues },
        { status: 400 }
      )
    }
    console.error("Error actualizando configuración:", error)
    return NextResponse.json(
      { error: "Error al actualizar la configuración" },
      { status: 500 }
    )
  }
}
