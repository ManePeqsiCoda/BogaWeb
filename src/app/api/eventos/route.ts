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

const eventoSchema = z.object({
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

function generateSlug(nombre: string, anio: number) {
  const base = nombre
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
  return `${base}-${anio}-${Date.now()}`
}

export async function GET(request: NextRequest) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const { searchParams } = request.nextUrl
  const search = searchParams.get("search") || ""
  const anio = searchParams.get("anio") || undefined
  const tipo = searchParams.get("tipo") || undefined
  const estado = searchParams.get("estado") || undefined
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10))
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "10", 10)))
  const skip = (page - 1) * limit

  const where: Record<string, unknown> = {}
  if (estado) where.estado = estado
  if (tipo && tipoEventoValues.includes(tipo as (typeof tipoEventoValues)[number])) {
    where.tipo = tipo
  }
  if (anio) where.anio = parseInt(anio, 10)
  if (search) {
    where.OR = [
      { nombre: { contains: search } },
      { descripcion: { contains: search } },
      { ciudad: { contains: search } },
    ]
  }

  const [eventos, total] = await Promise.all([
    prisma.evento.findMany({
      where,
      orderBy: [{ anio: "desc" }, { createdAt: "desc" }],
      skip,
      take: limit,
    }),
    prisma.evento.count({ where }),
  ])

  return NextResponse.json({
    eventos,
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
    const parsed = eventoSchema.parse(body)

    const slug = generateSlug(parsed.nombre, parsed.anio)

    const evento = await prisma.evento.create({
      data: {
        nombre: parsed.nombre,
        slug,
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

    return NextResponse.json(evento, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Datos inválidos", issues: error.issues },
        { status: 400 }
      )
    }
    console.error("Error creando evento:", error)
    return NextResponse.json(
      { error: "Error al crear el evento" },
      { status: 500 }
    )
  }
}
