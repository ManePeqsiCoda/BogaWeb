import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { productoSchema } from "../route"

interface RouteParams {
  params: Promise<{ id: string }>
}

function buildEspecificaciones(
  items: { nombre: string; valor: string }[]
): Record<string, string> {
  return items.reduce((acc, item) => {
    acc[item.nombre] = item.valor
    return acc
  }, {} as Record<string, string>)
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const { id } = await params

  const producto = await prisma.producto.findUnique({
    where: { id },
    include: { categoria: true },
  })

  if (!producto) {
    return NextResponse.json(
      { error: "Producto no encontrado" },
      { status: 404 }
    )
  }

  return NextResponse.json(producto)
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const { id } = await params

  try {
    const body = await request.json()
    const parsed = productoSchema.parse(body)

    const existing = await prisma.producto.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json(
        { error: "Producto no encontrado" },
        { status: 404 }
      )
    }

    if (parsed.slug !== existing.slug) {
      const slugTaken = await prisma.producto.findUnique({
        where: { slug: parsed.slug },
      })
      if (slugTaken && slugTaken.id !== id) {
        return NextResponse.json(
          { error: "Ya existe un producto con ese slug" },
          { status: 409 }
        )
      }
    }

    const producto = await prisma.producto.update({
      where: { id },
      data: {
        ...parsed,
        especificaciones: buildEspecificaciones(parsed.especificaciones),
        precioBase: parsed.precioBase ?? null,
      },
      include: { categoria: true },
    })

    return NextResponse.json(producto)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Datos inválidos", issues: error.issues },
        { status: 400 }
      )
    }
    console.error(error)
    return NextResponse.json(
      { error: "Error al actualizar el producto" },
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
    const existing = await prisma.producto.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json(
        { error: "Producto no encontrado" },
        { status: 404 }
      )
    }

    await prisma.producto.update({
      where: { id },
      data: { estado: "INACTIVO" },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Error al eliminar el producto" },
      { status: 500 }
    )
  }
}
