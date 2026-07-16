import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

const especificacionSchema = z.object({
  nombre: z.string().min(1),
  valor: z.string().min(1),
})

export const productoSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio"),
  nombreCorto: z.string().min(1).max(30),
  slug: z.string().min(1),
  descripcion: z.string().min(1),
  descripcionCorta: z.string().min(1).max(150),
  categoriaId: z.string().min(1),
  tipo: z.enum(["PRODUCTO", "SERVICIO"]),
  badge: z.string().optional().nullable(),
  imagenPrincipal: z.string().min(1),
  precioBase: z.number().nonnegative().optional().nullable(),
  unidadMedida: z.enum(["unidad", "turno", "hora"]).default("unidad"),
  destacado: z.boolean().default(false),
  orden: z.number().int().default(0),
  estado: z.enum(["ACTIVO", "INACTIVO", "AGOTADO"]).default("ACTIVO"),
  seoTitle: z.string().optional().nullable(),
  seoDescription: z.string().optional().nullable(),
  especificaciones: z.array(especificacionSchema).default([]),
})

function buildEspecificaciones(
  items: { nombre: string; valor: string }[]
): Record<string, string> {
  return items.reduce((acc, item) => {
    acc[item.nombre] = item.valor
    return acc
  }, {} as Record<string, string>)
}

export async function GET(request: NextRequest) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const { searchParams } = request.nextUrl
  const search = searchParams.get("search") || ""
  const categoria = searchParams.get("categoria") || undefined
  const estado = searchParams.get("estado") || undefined
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10))
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "10", 10)))
  const skip = (page - 1) * limit

  const where: Record<string, unknown> = {}

  if (search) {
    where.OR = [
      { nombre: { contains: search } },
      { nombreCorto: { contains: search } },
      { descripcion: { contains: search } },
    ]
  }

  if (categoria) {
    where.categoriaId = categoria
  }

  if (estado && ["ACTIVO", "INACTIVO", "AGOTADO"].includes(estado)) {
    where.estado = estado
  }

  const [productos, total] = await Promise.all([
    prisma.producto.findMany({
      where,
      include: { categoria: true },
      orderBy: [{ orden: "asc" }, { createdAt: "desc" }],
      skip,
      take: limit,
    }),
    prisma.producto.count({ where }),
  ])

  return NextResponse.json({
    productos,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  })
}

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const parsed = productoSchema.parse(body)

    const existing = await prisma.producto.findUnique({
      where: { slug: parsed.slug },
    })
    if (existing) {
      return NextResponse.json(
        { error: "Ya existe un producto con ese slug" },
        { status: 409 }
      )
    }

    const producto = await prisma.producto.create({
      data: {
        ...parsed,
        especificaciones: buildEspecificaciones(parsed.especificaciones),
        imagenes: [],
        precioBase: parsed.precioBase ?? null,
      },
      include: { categoria: true },
    })

    return NextResponse.json(producto, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Datos inválidos", issues: error.issues },
        { status: 400 }
      )
    }
    console.error(error)
    return NextResponse.json(
      { error: "Error al crear el producto" },
      { status: 500 }
    )
  }
}
