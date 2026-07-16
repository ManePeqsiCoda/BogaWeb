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

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const { id } = await params
  const cliente = await prisma.cliente.findUnique({
    where: { id },
    include: { cotizaciones: { orderBy: { createdAt: "desc" } } },
  })

  if (!cliente) {
    return NextResponse.json(
      { error: "Cliente no encontrado" },
      { status: 404 }
    )
  }

  return NextResponse.json(cliente)
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const { id } = await params

  try {
    const body = await request.json()
    const parsed = clienteSchema.parse(body)

    const existing = await prisma.cliente.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json(
        { error: "Cliente no encontrado" },
        { status: 404 }
      )
    }

    const cliente = await prisma.cliente.update({
      where: { id },
      data: parsed,
    })

    return NextResponse.json(cliente)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Datos inválidos", issues: error.issues },
        { status: 400 }
      )
    }
    console.error(error)
    return NextResponse.json(
      { error: "Error al actualizar el cliente" },
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
    const existing = await prisma.cliente.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json(
        { error: "Cliente no encontrado" },
        { status: 404 }
      )
    }

    await prisma.cliente.update({
      where: { id },
      data: { estado: "INACTIVO" },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Error al eliminar el cliente" },
      { status: 500 }
    )
  }
}
