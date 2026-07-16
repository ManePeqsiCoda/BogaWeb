"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { EstadoCotizacion } from "@prisma/client"

export async function updateEstadoCotizacion(
  id: string,
  nuevoEstado: EstadoCotizacion
) {
  const session = await auth()
  if (!session) {
    throw new Error("No autorizado")
  }

  await prisma.cotizacion.update({
    where: { id },
    data: { estado: nuevoEstado },
  })

  revalidatePath(`/admin/cotizaciones/${id}`)
  redirect(`/admin/cotizaciones/${id}`)
}
