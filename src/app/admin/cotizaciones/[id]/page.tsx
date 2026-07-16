import Link from "next/link"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { StatusBadge } from "@/components/admin/status-badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ArrowLeft, Pencil } from "lucide-react"
import { updateEstadoCotizacion } from "./actions"
import type { EstadoCotizacion } from "@prisma/client"

interface CotizacionDetailPageProps {
  params: Promise<{ id: string }>
}

function formatCurrency(value: number | null | undefined) {
  if (value == null) return "—"
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(Number(value))
}

function formatDate(date: Date | string | null) {
  if (!date) return "—"
  return new Intl.DateTimeFormat("es-CO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date))
}

export default async function CotizacionDetailPage({
  params,
}: CotizacionDetailPageProps) {
  const { id } = await params

  const cotizacion = await prisma.cotizacion.findUnique({
    where: { id },
    include: {
      cliente: true,
      items: { include: { producto: true } },
      creadoPor: { select: { nombre: true, email: true } },
    },
  })

  if (!cotizacion) {
    notFound()
  }

  const costoTotal = Number(cotizacion.costoTotal)
  const precioVenta = Number(cotizacion.precioVenta)
  const margen = Number(cotizacion.margen)
  const ganancia = precioVenta - costoTotal

  const acciones: { estado: EstadoCotizacion; label: string; variant: "default" | "outline" | "destructive" }[] = []

  if (cotizacion.estado === "BORRADOR") {
    acciones.push({ estado: "ENVIADA", label: "Enviar cotización", variant: "default" })
  }
  if (cotizacion.estado === "ENVIADA") {
    acciones.push({ estado: "APROBADA", label: "Aprobar", variant: "default" })
    acciones.push({ estado: "RECHAZADA", label: "Rechazar", variant: "destructive" })
  }
  if (cotizacion.estado !== "EXPIRADA") {
    acciones.push({ estado: "EXPIRADA", label: "Marcar expirada", variant: "outline" })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-start gap-4">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Volver a cotizaciones"
            render={(
              <Link href="/admin/cotizaciones">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            )}
          />
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Cotización
            </p>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-extrabold text-foreground">
                {cotizacion.codigo}
              </h1>
              <StatusBadge status={cotizacion.estado} />
            </div>
            <p className="text-sm text-muted-foreground">{cotizacion.nombre}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {acciones.map((accion) => (
            <form
              key={accion.estado}
              action={async () => {
                "use server"
                await updateEstadoCotizacion(id, accion.estado)
              }}
            >
              <Button
                type="submit"
                variant={accion.variant}
                className={
                  accion.variant === "default"
                    ? "bg-primary font-semibold text-primary-foreground hover:bg-primary-hover"
                    : ""
                }
              >
                {accion.label}
              </Button>
            </form>
          ))}
          <Button
            variant="outline"
            render={(
              <Link href={`/admin/cotizaciones/nueva?id=${id}`}>
                <Pencil className="mr-2 h-4 w-4" />
                Editar
              </Link>
            )}
          />
        </div>
      </div>

      {/* Info cards */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-card ring-1 ring-foreground/10">
          <CardHeader>
            <CardTitle className="text-sm font-extrabold uppercase tracking-wider">
              Cliente
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Empresa</span>
              <span className="font-medium text-foreground">
                {cotizacion.cliente.nombreEmpresa}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Contacto</span>
              <span className="text-foreground">
                {cotizacion.cliente.nombreContacto || "—"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Email</span>
              <span className="text-foreground">{cotizacion.cliente.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Teléfono</span>
              <span className="text-foreground">
                {cotizacion.cliente.telefono}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Ciudad</span>
              <span className="text-foreground">
                {cotizacion.cliente.ciudad || "—"}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card ring-1 ring-foreground/10">
          <CardHeader>
            <CardTitle className="text-sm font-extrabold uppercase tracking-wider">
              Evento
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Nombre</span>
              <span className="font-medium text-foreground">
                {cotizacion.nombre}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Fecha</span>
              <span className="text-foreground">
                {formatDate(cotizacion.fechaEvento)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Ubicación</span>
              <span className="text-foreground">
                {cotizacion.ubicacionEvento || "—"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tipo</span>
              <span className="text-foreground">
                {cotizacion.tipoEvento || "—"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Duración</span>
              <span className="text-foreground">
                {cotizacion.duracionDias
                  ? `${cotizacion.duracionDias} días`
                  : "—"}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Items */}
      <Card className="bg-card ring-1 ring-foreground/10">
        <CardHeader>
          <CardTitle className="text-sm font-extrabold uppercase tracking-wider">
            Productos ({cotizacion.items.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground">Producto</TableHead>
                <TableHead className="text-muted-foreground">Cantidad</TableHead>
                <TableHead className="text-muted-foreground">
                  Precio unitario
                </TableHead>
                <TableHead className="text-right text-muted-foreground">
                  Subtotal
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cotizacion.items.map((item) => (
                <TableRow key={item.id} className="border-border">
                  <TableCell className="text-foreground">
                    {item.producto.nombre}
                  </TableCell>
                  <TableCell className="text-foreground">
                    {item.cantidad}
                  </TableCell>
                  <TableCell className="text-foreground">
                    {formatCurrency(Number(item.precioUnitario))}
                  </TableCell>
                  <TableCell className="text-right font-medium text-foreground">
                    {formatCurrency(Number(item.precioTotal))}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Totals */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-card ring-1 ring-foreground/10">
          <CardHeader>
            <CardTitle className="text-sm font-extrabold uppercase tracking-wider">
              Totales
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Costo total</span>
              <span className="font-medium text-foreground">
                {formatCurrency(costoTotal)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Precio de venta</span>
              <span className="font-medium text-foreground">
                {formatCurrency(precioVenta)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Margen</span>
              <span className="font-medium text-foreground">
                {margen.toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between border-t border-border pt-3">
              <span className="text-muted-foreground">Ganancia</span>
              <span
                className={
                  ganancia >= 0 ? "font-bold text-[#22C55E]" : "font-bold text-[#EF4444]"
                }
              >
                {formatCurrency(ganancia)}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card ring-1 ring-foreground/10">
          <CardHeader>
            <CardTitle className="text-sm font-extrabold uppercase tracking-wider">
              Notas internas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap text-sm text-foreground">
              {cotizacion.notasInternas || "Sin notas internas."}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
