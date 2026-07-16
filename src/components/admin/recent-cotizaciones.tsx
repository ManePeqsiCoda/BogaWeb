import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { StatusBadge } from "./status-badge"
import { ArrowUpRight } from "lucide-react"
import type { Cotizacion, Cliente } from "@prisma/client"

type RecentCotizacion = Cotizacion & { cliente: Cliente }

interface RecentCotizacionesProps {
  cotizaciones: RecentCotizacion[]
}

function formatCurrency(value: number | null | undefined) {
  if (value == null) return "—"
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(value)
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("es-CO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date))
}

export function RecentCotizaciones({ cotizaciones }: RecentCotizacionesProps) {
  return (
    <Card className="bg-card ring-1 ring-foreground/10">
      <CardHeader>
        <CardTitle className="text-sm font-extrabold uppercase tracking-wider">
          Cotizaciones recientes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-muted-foreground">Código</TableHead>
              <TableHead className="text-muted-foreground">Cliente</TableHead>
              <TableHead className="text-muted-foreground">Estado</TableHead>
              <TableHead className="text-muted-foreground">Total</TableHead>
              <TableHead className="text-muted-foreground">Fecha</TableHead>
              <TableHead className="text-right text-muted-foreground">Acción</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cotizaciones.length === 0 && (
              <TableRow className="border-border hover:bg-transparent">
                <TableCell
                  colSpan={6}
                  className="py-8 text-center text-muted-foreground"
                >
                  No hay cotizaciones registradas.
                </TableCell>
              </TableRow>
            )}
            {cotizaciones.map((cotizacion) => (
              <TableRow key={cotizacion.id} className="border-border">
                <TableCell className="font-mono text-xs text-foreground">
                  {cotizacion.codigo}
                </TableCell>
                <TableCell className="text-foreground">
                  {cotizacion.cliente.nombreEmpresa}
                </TableCell>
                <TableCell>
                  <StatusBadge status={cotizacion.estado} />
                </TableCell>
                <TableCell className="text-foreground">
                  {formatCurrency(
                    cotizacion.precioVenta
                      ? Number(cotizacion.precioVenta)
                      : null
                  )}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formatDate(cotizacion.createdAt)}
                </TableCell>
                <TableCell className="text-right">
                  <Link
                    href={`/admin/cotizaciones/${cotizacion.id}`}
                    className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:text-primary-hover"
                  >
                    Ver
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
