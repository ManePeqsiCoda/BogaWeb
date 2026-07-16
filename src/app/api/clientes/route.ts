import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

const clienteSchema = z.object({
  nombreEmpresa: z.string().min(1),
  nombreContacto: z.string().optional().nullable(),
  email: z.string().email(),
  telefono: z.string().min(1),
  sector: z.string().optional().nullable(),
  ciudad: z.string().optional().nullable(),
  direccion: z.string().optional().nullable(),
  notas: z.string().optional().nullable(),
  fuente: z.enum(["WEB", "REFERIDO", "WHATSAPP", "TELEFONO"]).default("WEB"),
  estado: z.enum(["PROSPECTO", "ACTIVO", "INACTIVO"]).default("PROSPECTO"),
})

export async function GET(request: NextRequest) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const { searchParams } = request.nextUrl
  const search = searchParams.get("search") || ""
  const estado = searchParams.get("estado") || undefined
  const ciudad = searchParams.get("ciudad") || undefined
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10))
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "10", 10)))
  const skip = (page - 1) * limit

  const where: Record<string, unknown> = {}
  if (search) {
    where.OR = [
      { nombreEmpresa: { contains: search } },
      { nombreContacto: { contains: search } },
      { email: { contains: search } },
      { telefono: { contains: search } },
    ]
  }
  if (estado) where.estado = estado
  if (ciudad) where.ciudad = { contains: ciudad }

  const [clientes, total] = await Promise.all([
    prisma.cliente.findMany({
      where,
      orderBy: { nombreEmpresa: "asc" },
      skip,
      take: limit,
    }),
    prisma.cliente.count({ where }),
  ])

  return NextResponse.json({ clientes, total, page, totalPages: Math.ceil(total / limit) })
}

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const parsed = clienteSchema.parse(body)

    const cliente = await prisma.cliente.create({
      data: parsed,
    })

    return NextResponse.json(cliente, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Datos inválidos", issues: error.issues },
        { status: 400 }
      )
    }
    console.error(error)
    return NextResponse.json(
      { error: "Error al crear el cliente" },
      { status: 500 }
    )
  }
}
