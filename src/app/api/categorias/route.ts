import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function GET() {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const categorias = await prisma.categoria.findMany({
    orderBy: { orden: "asc" },
  })

  return NextResponse.json(categorias)
}
