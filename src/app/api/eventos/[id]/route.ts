import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

const tipoEventoValues = [
  "CONCIERTO",
  "FESTIVAL",
  "FERIA",
  "CORPORATIVO",
  "GOBIERNO",
  "PRIVADO",
] as const

const estadoEventoValues = ["PUBLICADO", "BORRADOR", "ARCHIVADO"] as const

const eventoUpdateSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio"),
  anio: z.coerce.number().int().min(2000).max(2100),
  tipo: z.enum(tipoEventoValues),
  descripcion: z.string().optional().nullable(),
  imagenPrincipal: z.string().optional().nullable(),
  ciudad: z.string().optional().nullable(),
  cantidadUnidades: z.coerce.number().int().nonnegative().optional().nullable(),
  productosUsados: z.array(z.string()).default([]),
  testimonio: z.string().optional().nullable(),
  nombreTestimonio: z.string().optional().nullable(),
  cargoTestimonio: z.string().optional().nullable(),
  estrellasTestimonio: z.coerce.number().int().min(1).max(5).optional().nullable(),
  destacado: z.boolean().default(false),
  estado: z.enum(estadoEventoValues).default("BORRADOR"),
})

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const { id } = await params

  try {
    const evento = await prisma.evento.findUnique({ where: { id } })
    if (!evento) {
      return NextResponse.json(
        { error: "Evento no encontrado" },
        { status: 404 }
      )
    }
    return NextResponse.json(evento)
  } catch (error) {
    console.error("Error obteniendo evento:", error)
    return NextResponse.json(
      { error: "Error obteniendo evento" },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const { id } = await params

  try {
    const body = await request.json()
    const parsed = eventoUpdateSchema.parse(body)

    const existing = await prisma.evento.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json(
        { error: "Evento no encontrado" },
        { status: 404 }
      )
    }

    const evento = await prisma.evento.update({
      where: { id },
      data: {
        nombre: parsed.nombre,
        anio: parsed.anio,
        tipo: parsed.tipo,
        descripcion: parsed.descripcion,
        imagenPrincipal: parsed.imagenPrincipal,
        ciudad: parsed.ciudad,
        cantidadUnidades: parsed.cantidadUnidades,
        productosUsados: parsed.productosUsados,
        testimonio: parsed.testimonio,
        nombreTestimonio: parsed.nombreTestimonio,
        cargoTestimonio: parsed.cargoTestimonio,
        estrellasTestimonio: parsed.estrellasTestimonio,
        destacado: parsed.destacado,
        estado: parsed.estado,
      },
    })

    return NextResponse.json(evento)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Datos inválidos", issues: error.issues },
        { status: 400 }
      )
    }
    console.error("Error actualizando evento:", error)
    return NextResponse.json(
      { error: "Error al actualizar el evento" },
      { status: 500 }
    )
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const { id } = await params

  try {
    const existing = await prisma.evento.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json(
        { error: "Evento no encontrado" },
        { status: 404 }
      )
    }

    await prisma.evento.update({
      where: { id },
      data: { estado: "ARCHIVADO" },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error eliminando evento:", error)
    return NextResponse.json(
      { error: "Error al eliminar el evento" },
      { status: 500 }
    )
  }
}
