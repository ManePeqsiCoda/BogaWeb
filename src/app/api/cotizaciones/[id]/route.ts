import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

const itemSchema = z.object({
  productoId: z.string().min(1),
  cantidad: z.number().int().positive(),
  precioUnitario: z.number().nonnegative(),
  precioTotal: z.number().nonnegative(),
  descripcionPersonalizada: z.string().optional().nullable(),
})

const updateSchema = z.object({
  nombre: z.string().min(1).optional(),
  descripcion: z.string().optional().nullable(),
  fechaEvento: z.string().datetime().optional().nullable(),
  ubicacionEvento: z.string().optional().nullable(),
  tipoEvento: z.string().optional().nullable(),
  duracionDias: z.number().int().optional().nullable(),
  costoTotal: z.number().nonnegative().optional(),
  precioVenta: z.number().nonnegative().optional(),
  margen: z.number().optional(),
  moneda: z.string().optional(),
  estado: z
    .enum(["BORRADOR", "ENVIADA", "APROBADA", "RECHAZADA", "EXPIRADA"])
    .optional(),
  notasInternas: z.string().optional().nullable(),
  items: z.array(itemSchema).optional(),
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

  const cotizacion = await prisma.cotizacion.findUnique({
    where: { id },
    include: {
      cliente: true,
      items: { include: { producto: true } },
      creadoPor: { select: { id: true, nombre: true, email: true } },
    },
  })

  if (!cotizacion) {
    return NextResponse.json(
      { error: "Cotización no encontrada" },
      { status: 404 }
    )
  }

  return NextResponse.json(cotizacion)
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const { id } = await params

  try {
    const body = await request.json()
    const parsed = updateSchema.parse(body)

    const existing = await prisma.cotizacion.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json(
        { error: "Cotización no encontrada" },
        { status: 404 }
      )
    }

    const result = await prisma.$transaction(async (tx) => {
      if (parsed.items) {
        await tx.cotizacionItem.deleteMany({ where: { cotizacionId: id } })
      }

      const cotizacion = await tx.cotizacion.update({
        where: { id },
        data: {
          nombre: parsed.nombre,
          descripcion: parsed.descripcion,
          fechaEvento: parsed.fechaEvento
            ? new Date(parsed.fechaEvento)
            : parsed.fechaEvento === null
              ? null
              : undefined,
          ubicacionEvento: parsed.ubicacionEvento,
          tipoEvento: parsed.tipoEvento,
          duracionDias: parsed.duracionDias,
          costoTotal: parsed.costoTotal,
          precioVenta: parsed.precioVenta,
          margen: parsed.margen,
          moneda: parsed.moneda,
          estado: parsed.estado,
          notasInternas: parsed.notasInternas,
          items: parsed.items
            ? {
                create: parsed.items.map((item) => ({
                  productoId: item.productoId,
                  cantidad: item.cantidad,
                  precioUnitario: item.precioUnitario,
                  precioTotal: item.precioTotal,
                  descripcionPersonalizada: item.descripcionPersonalizada,
                })),
              }
            : undefined,
        },
        include: {
          cliente: true,
          items: { include: { producto: true } },
        },
      })

      return cotizacion
    })

    return NextResponse.json(result)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Datos inválidos", issues: error.issues },
        { status: 400 }
      )
    }
    console.error(error)
    return NextResponse.json(
      { error: "Error al actualizar la cotización" },
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
    const existing = await prisma.cotizacion.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json(
        { error: "Cotización no encontrada" },
        { status: 404 }
      )
    }

    await prisma.cotizacion.update({
      where: { id },
      data: { estado: "EXPIRADA" },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Error al eliminar la cotización" },
      { status: 500 }
    )
  }
}
