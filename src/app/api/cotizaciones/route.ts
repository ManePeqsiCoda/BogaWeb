import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { EstadoCotizacion } from "@prisma/client"

const itemSchema = z.object({
  productoId: z.string().min(1),
  cantidad: z.number().int().positive(),
  precioUnitario: z.number().nonnegative(),
  precioTotal: z.number().nonnegative(),
  descripcionPersonalizada: z.string().optional().nullable(),
})

const cotizacionSchema = z.object({
  clienteId: z.string().optional(),
  nuevoCliente: z
    .object({
      nombreEmpresa: z.string().min(1),
      nombreContacto: z.string().optional().nullable(),
      email: z.string().email(),
      telefono: z.string().min(1),
      sector: z.string().optional().nullable(),
      ciudad: z.string().optional().nullable(),
    })
    .optional(),
  nombre: z.string().min(1),
  descripcion: z.string().optional().nullable(),
  fechaEvento: z.string().datetime().optional().nullable(),
  ubicacionEvento: z.string().optional().nullable(),
  tipoEvento: z.string().optional().nullable(),
  duracionDias: z.number().int().optional().nullable(),
  costoTotal: z.number().nonnegative(),
  precioVenta: z.number().nonnegative(),
  margen: z.number(),
  moneda: z.string().default("COP"),
  estado: z.enum(["BORRADOR", "ENVIADA", "APROBADA", "RECHAZADA", "EXPIRADA"]),
  notasInternas: z.string().optional().nullable(),
  items: z.array(itemSchema).min(1, "Debe incluir al menos un item"),
})

async function generateCodigo() {
  const year = new Date().getFullYear()
  const start = new Date(year, 0, 1)
  const end = new Date(year + 1, 0, 1)
  const count = await prisma.cotizacion.count({
    where: { createdAt: { gte: start, lt: end } },
  })
  const next = String(count + 1).padStart(4, "0")
  return `COT-${year}-${next}`
}

function getMonthRanges() {
  const now = new Date()
  const start = new Date(now.getFullYear(), now.getMonth(), 1)
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999)
  return { start, end }
}

export async function GET(request: NextRequest) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const { searchParams } = request.nextUrl
  const search = searchParams.get("search") || ""
  const estado = searchParams.get("estado") || undefined
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10))
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "10", 10)))
  const skip = (page - 1) * limit

  const where: Record<string, unknown> = {}
  if (search) {
    where.OR = [
      { nombre: { contains: search } },
      { codigo: { contains: search } },
      { cliente: { nombreEmpresa: { contains: search } } },
    ]
  }
  if (estado && Object.values(EstadoCotizacion).includes(estado as EstadoCotizacion)) {
    where.estado = estado
  }

  const { start, end } = getMonthRanges()

  const [cotizaciones, total, stats] = await Promise.all([
    prisma.cotizacion.findMany({
      where,
      include: {
        cliente: true,
        items: { include: { producto: true } },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.cotizacion.count({ where }),
    prisma.cotizacion.aggregate({
      where: { estado: "APROBADA", createdAt: { gte: start, lte: end } },
      _count: { id: true },
      _sum: { precioVenta: true },
    }),
  ])

  const totalCotizaciones = await prisma.cotizacion.count()
  const pendientes = await prisma.cotizacion.count({
    where: { estado: { in: ["BORRADOR", "ENVIADA"] } },
  })

  return NextResponse.json({
    cotizaciones,
    total,
    page,
    totalPages: Math.ceil(total / limit),
    stats: {
      totalCotizaciones,
      pendientes,
      aprobadasMes: stats._count.id,
      ingresosEstimados: stats._sum.precioVenta
        ? Number(stats._sum.precioVenta)
        : 0,
    },
  })
}

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const parsed = cotizacionSchema.parse(body)

    if (!parsed.clienteId && !parsed.nuevoCliente) {
      return NextResponse.json(
        { error: "Debe seleccionar o crear un cliente" },
        { status: 400 }
      )
    }

    const codigo = await generateCodigo()

    const result = await prisma.$transaction(async (tx) => {
      let clienteId = parsed.clienteId

      if (parsed.nuevoCliente) {
        const cliente = await tx.cliente.create({
          data: {
            ...parsed.nuevoCliente,
            fuente: "WEB",
            estado: "PROSPECTO",
          },
        })
        clienteId = cliente.id
      }

      const cotizacion = await tx.cotizacion.create({
        data: {
          codigo,
          clienteId: clienteId!,
          creadoPorId: session.user.id,
          nombre: parsed.nombre,
          descripcion: parsed.descripcion,
          fechaEvento: parsed.fechaEvento ? new Date(parsed.fechaEvento) : null,
          ubicacionEvento: parsed.ubicacionEvento,
          tipoEvento: parsed.tipoEvento,
          duracionDias: parsed.duracionDias,
          costoTotal: parsed.costoTotal,
          precioVenta: parsed.precioVenta,
          margen: parsed.margen,
          moneda: parsed.moneda,
          estado: parsed.estado,
          notasInternas: parsed.notasInternas,
          items: {
            create: parsed.items.map((item) => ({
              productoId: item.productoId,
              cantidad: item.cantidad,
              precioUnitario: item.precioUnitario,
              precioTotal: item.precioTotal,
              descripcionPersonalizada: item.descripcionPersonalizada,
            })),
          },
        },
        include: {
          cliente: true,
          items: { include: { producto: true } },
        },
      })

      return cotizacion
    })

    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Datos inválidos", issues: error.issues },
        { status: 400 }
      )
    }
    console.error(error)
    return NextResponse.json(
      { error: "Error al crear la cotización" },
      { status: 500 }
    )
  }
}
