"use client"

import { useEffect, useState, useCallback } from "react"
import Link from "next/link"
import { toast } from "sonner"
import { ClienteForm } from "@/components/admin/cliente-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Search,
  Plus,
  Eye,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Users,
  Loader2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { Cliente, EstadoCliente } from "@prisma/client"

const estadoOptions: { value: EstadoCliente | "TODOS"; label: string }[] = [
  { value: "TODOS", label: "Todos" },
  { value: "PROSPECTO", label: "Prospecto" },
  { value: "ACTIVO", label: "Activo" },
  { value: "INACTIVO", label: "Inactivo" },
]

const estadoStyles: Record<
  EstadoCliente,
  { label: string; bg: string; text: string }
> = {
  PROSPECTO: {
    label: "Prospecto",
    bg: "bg-gray-500/15",
    text: "text-gray-400",
  },
  ACTIVO: {
    label: "Activo",
    bg: "bg-[#22C55E]/15",
    text: "text-[#22C55E]",
  },
  INACTIVO: {
    label: "Inactivo",
    bg: "bg-[#EF4444]/15",
    text: "text-[#EF4444]",
  },
}

export default function ClientesAdminPage() {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [estadoFiltro, setEstadoFiltro] = useState<EstadoCliente | "TODOS">(
    "TODOS"
  )
  const [ciudadFiltro, setCiudadFiltro] = useState("")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [refreshKey, setRefreshKey] = useState(0)

  const [drawerOpen, setDrawerOpen] = useState(false)
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null)
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean
    cliente: Cliente | null
  }>({ open: false, cliente: null })

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
      setPage(1)
    }, 300)
    return () => clearTimeout(timer)
  }, [search])

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      try {
        const estadoParam =
          estadoFiltro === "TODOS" ? "" : `&estado=${estadoFiltro}`
        const ciudadParam = ciudadFiltro
          ? `&ciudad=${encodeURIComponent(ciudadFiltro)}`
          : ""
        const res = await fetch(
          `/api/clientes?search=${encodeURIComponent(
            debouncedSearch
          )}&page=${page}&limit=10${estadoParam}${ciudadParam}`
        )
        if (!res.ok) throw new Error("Error")
        const data = await res.json()
        if (!cancelled) {
          setClientes(data.clientes)
          setTotalPages(data.totalPages)
        }
      } catch {
        if (!cancelled) toast.error("No se pudieron cargar los clientes")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [debouncedSearch, page, estadoFiltro, ciudadFiltro, refreshKey])

  const refresh = useCallback(() => setRefreshKey((k) => k + 1), [])

  const handleDelete = async () => {
    if (!deleteDialog.cliente) return
    try {
      const res = await fetch(`/api/clientes/${deleteDialog.cliente.id}`, {
        method: "DELETE",
      })
      if (!res.ok) throw new Error("Error")
      toast.success("Cliente eliminado")
      refresh()
    } catch {
      toast.error("No se pudo eliminar el cliente")
    } finally {
      setDeleteDialog({ open: false, cliente: null })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-sm font-extrabold uppercase tracking-widest text-foreground">
            Clientes
          </h1>
          <p className="text-sm text-muted-foreground">
            Gestión de clientes y prospectos
          </p>
        </div>
        <Button
          onClick={() => {
            setSelectedCliente(null)
            setDrawerOpen(true)
          }}
          className="bg-primary font-semibold text-primary-foreground hover:bg-primary-hover"
        >
          <Plus className="mr-2 h-4 w-4" />
          Nuevo cliente
        </Button>
      </div>

      <div className="flex flex-col gap-4 lg:flex-row">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre, email, teléfono..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-input bg-background pl-9 text-foreground"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {estadoOptions.map((e) => (
            <button
              key={e.value}
              onClick={() => setEstadoFiltro(e.value)}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                estadoFiltro === e.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted/20 text-muted-foreground hover:bg-muted/30"
              )}
            >
              {e.label}
            </button>
          ))}
        </div>
        <Input
          placeholder="Filtrar por ciudad"
          value={ciudadFiltro}
          onChange={(e) => setCiudadFiltro(e.target.value)}
          className="max-w-xs border-input bg-background text-foreground"
        />
      </div>

      <Card className="bg-card ring-1 ring-foreground/10">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground">Empresa</TableHead>
                <TableHead className="text-muted-foreground">Contacto</TableHead>
                <TableHead className="text-muted-foreground">Email</TableHead>
                <TableHead className="text-muted-foreground">Teléfono</TableHead>
                <TableHead className="text-muted-foreground">Ciudad</TableHead>
                <TableHead className="text-muted-foreground">Estado</TableHead>
                <TableHead className="text-right text-muted-foreground">
                  Acciones
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow className="border-border hover:bg-transparent">
                  <TableCell colSpan={7} className="py-12 text-center">
                    <Loader2 className="mx-auto h-6 w-6 animate-spin text-primary" />
                  </TableCell>
                </TableRow>
              ) : clientes.length === 0 ? (
                <TableRow className="border-border hover:bg-transparent">
                  <TableCell colSpan={7} className="py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <Users className="h-10 w-10" />
                      <p className="mt-2 text-sm">No se encontraron clientes.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                clientes.map((cliente) => {
                  const estilo = estadoStyles[cliente.estado]
                  return (
                    <TableRow key={cliente.id} className="border-border">
                      <TableCell className="font-medium text-foreground">
                        {cliente.nombreEmpresa}
                      </TableCell>
                      <TableCell className="text-foreground">
                        {cliente.nombreContacto || "—"}
                      </TableCell>
                      <TableCell className="text-foreground">
                        {cliente.email}
                      </TableCell>
                      <TableCell className="text-foreground">
                        {cliente.telefono}
                      </TableCell>
                      <TableCell className="text-foreground">
                        {cliente.ciudad || "—"}
                      </TableCell>
                      <TableCell>
                        <span
                          className={cn(
                            "inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold",
                            estilo.bg,
                            estilo.text
                          )}
                        >
                          {estilo.label}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label="Ver cliente"
                            className="text-muted-foreground hover:text-foreground"
                            render={(
                              <Link href={`/admin/clientes/${cliente.id}`}>
                                <Eye className="h-4 w-4" />
                              </Link>
                            )}
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label="Editar cliente"
                            onClick={() => {
                              setSelectedCliente(cliente)
                              setDrawerOpen(true)
                            }}
                            className="text-muted-foreground hover:text-foreground"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label="Eliminar cliente"
                            onClick={() =>
                              setDeleteDialog({ open: true, cliente })
                            }
                            className="text-muted-foreground hover:text-error"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>

          {!loading && clientes.length > 0 && (
            <div className="flex items-center justify-between border-t border-border px-4 py-3">
              <p className="text-sm text-muted-foreground">
                Página {page} de {totalPages}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  aria-label="Página anterior"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  aria-label="Página siguiente"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <ClienteForm
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        cliente={selectedCliente}
        onSuccess={refresh}
      />

      <Dialog
        open={deleteDialog.open}
        onOpenChange={(open) =>
          setDeleteDialog((prev) => ({ ...prev, open }))
        }
      >
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">
              ¿Eliminar cliente?
            </DialogTitle>
            <DialogDescription>
              Esta acción marcará a{" "}
              <strong>{deleteDialog.cliente?.nombreEmpresa}</strong> como
              inactivo.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col-reverse gap-2 sm:flex-row">
            <Button
              variant="outline"
              onClick={() =>
                setDeleteDialog({ open: false, cliente: null })
              }
              className="w-full sm:w-auto"
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              className="w-full sm:w-auto"
            >
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
