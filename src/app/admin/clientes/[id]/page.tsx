import Link from "next/link"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
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
import { StatusBadge } from "@/components/admin/status-badge"
import { ArrowLeft, Plus } from "lucide-react"

interface ClienteDetailPageProps {
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

const estadoStyles: Record<string, { label: string; bg: string; text: string }> = {
  PROSPECTO: { label: "Prospecto", bg: "bg-gray-500/15", text: "text-gray-400" },
  ACTIVO: { label: "Activo", bg: "bg-[#22C55E]/15", text: "text-[#22C55E]" },
  INACTIVO: { label: "Inactivo", bg: "bg-[#EF4444]/15", text: "text-[#EF4444]" },
}

export default async function ClienteDetailPage({
  params,
}: ClienteDetailPageProps) {
  const { id } = await params

  const cliente = await prisma.cliente.findUnique({
    where: { id },
    include: { cotizaciones: { orderBy: { createdAt: "desc" } } },
  })

  if (!cliente) {
    notFound()
  }

  const estilo = estadoStyles[cliente.estado]

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-start gap-4">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Volver a clientes"
            render={(
              <Link href="/admin/clientes">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            )}
          />
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Cliente
            </p>
            <h1 className="text-xl font-extrabold text-foreground">
              {cliente.nombreEmpresa}
            </h1>
            <span
              className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${estilo.bg} ${estilo.text}`}
            >
              {estilo.label}
            </span>
          </div>
        </div>
        <Button
          className="bg-primary font-semibold text-primary-foreground hover:bg-primary-hover"
          render={(
            <Link href={`/admin/cotizaciones/nueva?clienteId=${cliente.id}`}>
              <Plus className="mr-2 h-4 w-4" />
              Nueva cotización
            </Link>
          )}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-card ring-1 ring-foreground/10">
          <CardHeader>
            <CardTitle className="text-sm font-extrabold uppercase tracking-wider">
              Información de contacto
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Contacto</span>
              <span className="text-foreground">
                {cliente.nombreContacto || "—"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Email</span>
              <span className="text-foreground">{cliente.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Teléfono</span>
              <span className="text-foreground">{cliente.telefono}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Sector</span>
              <span className="text-foreground">{cliente.sector || "—"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Ciudad</span>
              <span className="text-foreground">
                {cliente.ciudad || "—"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Dirección</span>
              <span className="text-foreground">
                {cliente.direccion || "—"}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card ring-1 ring-foreground/10">
          <CardHeader>
            <CardTitle className="text-sm font-extrabold uppercase tracking-wider">
              Notas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap text-sm text-foreground">
              {cliente.notas || "Sin notas registradas."}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card ring-1 ring-foreground/10">
        <CardHeader>
          <CardTitle className="text-sm font-extrabold uppercase tracking-wider">
            Historial de cotizaciones ({cliente.cotizaciones.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {cliente.cotizaciones.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No hay cotizaciones registradas para este cliente.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-muted-foreground">Código</TableHead>
                  <TableHead className="text-muted-foreground">Nombre</TableHead>
                  <TableHead className="text-muted-foreground">Estado</TableHead>
                  <TableHead className="text-muted-foreground">Total</TableHead>
                  <TableHead className="text-muted-foreground">Fecha</TableHead>
                  <TableHead className="text-right text-muted-foreground">
                    Acción
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cliente.cotizaciones.map((cot) => (
                  <TableRow key={cot.id} className="border-border">
                    <TableCell className="font-mono text-xs text-foreground">
                      {cot.codigo}
                    </TableCell>
                    <TableCell className="text-foreground">
                      {cot.nombre}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={cot.estado} />
                    </TableCell>
                    <TableCell className="text-foreground">
                      {formatCurrency(Number(cot.precioVenta))}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(cot.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-primary hover:text-primary-hover"
                        render={(
                          <Link href={`/admin/cotizaciones/${cot.id}`}>
                            Ver
                          </Link>
                        )}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
