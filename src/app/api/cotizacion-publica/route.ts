import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"

const itemSchema = z.object({
  productoId: z.string(),
  cantidad: z.number().int().min(1),
})

const quoteSchema = z.object({
  nombre: z.string().min(2, "El nombre es requerido"),
  empresa: z.string().optional(),
  email: z.string().email("Ingresa un correo válido"),
  telefono: z.string().min(7, "El teléfono debe tener al menos 7 dígitos"),
  tipoEvento: z.string().min(1, "El tipo de evento es requerido"),
  fechaEvento: z.string().min(1, "La fecha del evento es requerida"),
  ciudad: z.string().min(2, "La ciudad es requerida"),
  asistentes: z.number().int().optional(),
  duracionDias: z.number().int().optional(),
  ubicacionEvento: z.string().optional(),
  notasAdicionales: z.string().optional(),
  items: z.array(itemSchema).min(1, "Selecciona al menos un producto"),
})

function generateQuoteCode(): string {
  const prefix = "COT"
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 5).toUpperCase()
  return `${prefix}-${timestamp}-${random}`
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const result = quoteSchema.safeParse(body)

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

    const data = result.data

    // Find admin user as default creator for public quotes
    const adminUser = await prisma.usuario.findFirst({
      where: { rol: "ADMIN", activo: true },
      orderBy: { createdAt: "asc" },
    })

    if (!adminUser) {
      return NextResponse.json(
        {
          success: false,
          message: "No se encontró un usuario administrador para procesar la cotización",
        },
        { status: 500 }
      )
    }

    // Find or create client by email
    let cliente = await prisma.cliente.findFirst({
      where: { email: data.email },
      orderBy: { createdAt: "desc" },
    })

    if (!cliente) {
      cliente = await prisma.cliente.create({
        data: {
          nombreContacto: data.nombre,
          nombreEmpresa: data.empresa || "Sin empresa",
          email: data.email,
          telefono: data.telefono,
          ciudad: data.ciudad,
          fuente: "WEB",
          estado: "PROSPECTO",
        },
      })
    } else {
      cliente = await prisma.cliente.update({
        where: { id: cliente.id },
        data: {
          nombreContacto: data.nombre,
          nombreEmpresa: data.empresa || "Sin empresa",
          telefono: data.telefono,
          ciudad: data.ciudad,
        },
      })
    }

    // Fetch products to calculate prices
    const productos = await prisma.producto.findMany({
      where: { id: { in: data.items.map((i) => i.productoId) } },
    })

    const productMap = new Map(productos.map((p) => [p.id, p]))

    // Calculate totals
    let precioVenta = 0
    const itemsConPrecio = data.items.map((item) => {
      const producto = productMap.get(item.productoId)
      const precioUnitario = producto?.precioBase?.toNumber() || 0
      const precioTotal = precioUnitario * item.cantidad
      precioVenta += precioTotal
      return {
        productoId: item.productoId,
        cantidad: item.cantidad,
        precioUnitario,
        precioTotal,
        descripcionPersonalizada: producto?.nombre,
      }
    })

    const costoTotal = precioVenta * 0.6 // Estimated cost 60%
    const margen = precioVenta - costoTotal

    // Create quote
    const cotizacion = await prisma.cotizacion.create({
      data: {
        codigo: generateQuoteCode(),
        clienteId: cliente.id,
        creadoPorId: adminUser.id,
        nombre: `Cotización web - ${data.tipoEvento}`,
        descripcion: `Cotización solicitada desde la web para evento en ${data.ciudad}. Fecha: ${data.fechaEvento}.`,
        estado: "BORRADOR",
        fechaEvento: new Date(data.fechaEvento),
        ubicacionEvento: data.ubicacionEvento || undefined,
        tipoEvento: data.tipoEvento,
        duracionDias: data.duracionDias,
        precioVenta,
        costoTotal,
        margen,
        moneda: "COP",
        notasInternas: data.notasAdicionales || undefined,
        items: {
          create: itemsConPrecio,
        },
      },
      include: {
        items: true,
        cliente: true,
      },
    })

    return NextResponse.json(
      {
        success: true,
        message:
          "¡Gracias! Tu solicitud ha sido enviada. Te contactaremos en menos de 24 horas.",
        codigo: cotizacion.codigo,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("[Cotización Web Error]", error)
    return NextResponse.json(
      {
        success: false,
        message:
          "Hubo un error. Por favor intenta de nuevo o contáctanos por WhatsApp.",
      },
      { status: 500 }
    )
  }
}
