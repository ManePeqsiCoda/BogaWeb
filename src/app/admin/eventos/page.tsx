"use client"

import { useEffect, useState, useCallback } from "react"
import { toast } from "sonner"
import { EventoPortafolioForm } from "@/components/admin/evento-portafolio-form"
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  Table as TableIcon,
  Calendar,
  Loader2,
  Star,
} from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import type { Evento } from "@prisma/client"

const tipoEventoOptions = [
  { value: "TODOS", label: "Todos los tipos" },
  { value: "CONCIERTO", label: "Concierto" },
  { value: "FESTIVAL", label: "Festival" },
  { value: "FERIA", label: "Feria" },
  { value: "CORPORATIVO", label: "Corporativo" },
  { value: "GOBIERNO", label: "Gobierno" },
  { value: "PRIVADO", label: "Privado" },
]

const estadoEventoStyles: Record<string, { label: string; bg: string; text: string }> = {
  PUBLICADO: { label: "Publicado", bg: "bg-[#22C55E]/15", text: "text-[#22C55E]" },
  BORRADOR: { label: "Borrador", bg: "bg-gray-500/15", text: "text-gray-400" },
  ARCHIVADO: { label: "Archivado", bg: "bg-[#F59E0B]/15", text: "text-[#F59E0B]" },
}

interface ProductoOption {
  id: string
  nombre: string
}

function formatTipo(tipo: string | null) {
  const found = tipoEventoOptions.find((t) => t.value === tipo)
  return found?.label || tipo || "—"
}

function getProductosUsados(evento: Evento): string[] {
  if (!evento.productosUsados) return []
  if (Array.isArray(evento.productosUsados)) return evento.productosUsados as string[]
  return []
}

export default function EventosAdminPage() {
  const [eventos, setEventos] = useState<Evento[]>([])
  const [productos, setProductos] = useState<ProductoOption[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [anioFiltro, setAnioFiltro] = useState("")
  const [tipoFiltro, setTipoFiltro] = useState("TODOS")
  const [vista, setVista] = useState<"tabla" | "grid">("tabla")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [refreshKey, setRefreshKey] = useState(0)

  const [drawerOpen, setDrawerOpen] = useState(false)
  const [selectedEvento, setSelectedEvento] = useState<Evento | null>(null)
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean
    evento: Evento | null
  }>({ open: false, evento: null })

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
        const anioParam = anioFiltro ? `&anio=${encodeURIComponent(anioFiltro)}` : ""
        const tipoParam = tipoFiltro && tipoFiltro !== "TODOS" ? `&tipo=${tipoFiltro}` : ""
        const res = await fetch(
          `/api/eventos?search=${encodeURIComponent(
            debouncedSearch
          )}&page=${page}&limit=9${anioParam}${tipoParam}`
        )
        if (!res.ok) throw new Error("Error")
        const data = await res.json()
        if (!cancelled) {
          setEventos(data.eventos)
          setTotalPages(data.totalPages)
        }
      } catch {
        if (!cancelled) toast.error("No se pudieron cargar los eventos")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [debouncedSearch, page, anioFiltro, tipoFiltro, refreshKey])

  useEffect(() => {
    async function loadProductos() {
      try {
        const res = await fetch("/api/productos?estado=ACTIVO&limit=100")
        if (!res.ok) throw new Error("Error")
        const data = await res.json()
        setProductos(
          (data.productos || []).map((p: { id: string; nombre: string }) => ({
            id: p.id,
            nombre: p.nombre,
          }))
        )
      } catch {
        toast.error("No se pudieron cargar los productos")
      }
    }
    loadProductos()
  }, [])

  const refresh = useCallback(() => setRefreshKey((k) => k + 1), [])

  const handleDelete = async () => {
    if (!deleteDialog.evento) return
    try {
      const res = await fetch(`/api/eventos/${deleteDialog.evento.id}`, {
        method: "DELETE",
      })
      if (!res.ok) throw new Error("Error")
      toast.success("Evento archivado")
      refresh()
    } catch {
      toast.error("No se pudo archivar el evento")
    } finally {
      setDeleteDialog({ open: false, evento: null })
    }
  }

  const años = Array.from(
    new Set(eventos.map((e) => e.anio).filter(Boolean))
  ).sort((a, b) => b - a)

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-sm font-extrabold uppercase tracking-widest text-foreground">
            Eventos
          </h1>
          <p className="text-sm text-muted-foreground">
            Portafolio de eventos atendidos
          </p>
        </div>
        <Button
          onClick={() => {
            setSelectedEvento(null)
            setDrawerOpen(true)
          }}
          className="bg-primary font-semibold text-primary-foreground hover:bg-primary-hover"
        >
          <Plus className="mr-2 h-4 w-4" />
          Nuevo evento
        </Button>
      </div>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre, ciudad, descripción..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-input bg-background pl-9 text-foreground"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Select value={anioFiltro} onValueChange={(v) => setAnioFiltro(v || "")}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Año" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos los años</SelectItem>
              {años.map((a) => (
                <SelectItem key={a} value={String(a)}>
                  {a}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={tipoFiltro} onValueChange={(v) => setTipoFiltro(v || "TODOS")}>
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {tipoEventoOptions.map((t) => (
                <SelectItem key={t.value} value={t.value}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex items-center rounded-md border border-input bg-background p-1">
            <button
              onClick={() => setVista("tabla")}
              className={cn(
                "rounded p-1.5 transition-colors",
                vista === "tabla"
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
              aria-label="Vista tabla"
            >
              <TableIcon className="h-4 w-4" />
            </button>
            <button
              onClick={() => setVista("grid")}
              className={cn(
                "rounded p-1.5 transition-colors",
                vista === "grid"
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
              aria-label="Vista grid"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {vista === "tabla" ? (
        <Card className="bg-card ring-1 ring-foreground/10">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-muted-foreground">Nombre</TableHead>
                  <TableHead className="text-muted-foreground">Año</TableHead>
                  <TableHead className="text-muted-foreground">Tipo</TableHead>
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
                    <TableCell colSpan={6} className="py-12 text-center">
                      <Loader2 className="mx-auto h-6 w-6 animate-spin text-primary" />
                    </TableCell>
                  </TableRow>
                ) : eventos.length === 0 ? (
                  <TableRow className="border-border hover:bg-transparent">
                    <TableCell colSpan={6} className="py-12 text-center">
                      <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <Calendar className="h-10 w-10" />
                        <p className="mt-2 text-sm">No se encontraron eventos.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  eventos.map((evento) => {
                    const estilo = estadoEventoStyles[evento.estado] || estadoEventoStyles.BORRADOR
                    return (
                      <TableRow key={evento.id} className="border-border">
                        <TableCell className="font-medium text-foreground">
                          <div className="flex items-center gap-3">
                            {evento.imagenPrincipal ? (
                              <Image
                                src={evento.imagenPrincipal}
                                alt=""
                                width={36}
                                height={36}
                                unoptimized
                                className="rounded-md object-cover"
                              />
                            ) : (
                              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-muted">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                              </div>
                            )}
                            <div>
                              <p className="text-foreground">{evento.nombre}</p>
                              {evento.destacado && (
                                <p className="text-[10px] text-primary">Destacado</p>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-foreground">{evento.anio}</TableCell>
                        <TableCell className="text-foreground">
                          {formatTipo(evento.tipo)}
                        </TableCell>
                        <TableCell className="text-foreground">
                          {evento.ciudad || "—"}
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
                              aria-label="Editar evento"
                              onClick={() => {
                                setSelectedEvento(evento)
                                setDrawerOpen(true)
                              }}
                              className="text-muted-foreground hover:text-foreground"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              aria-label="Archivar evento"
                              onClick={() =>
                                setDeleteDialog({ open: true, evento })
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
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            <div className="col-span-full py-12 text-center">
              <Loader2 className="mx-auto h-6 w-6 animate-spin text-primary" />
            </div>
          ) : eventos.length === 0 ? (
            <div className="col-span-full py-12 text-center text-muted-foreground">
              <Calendar className="mx-auto h-10 w-10" />
              <p className="mt-2 text-sm">No se encontraron eventos.</p>
            </div>
          ) : (
            eventos.map((evento) => {
              const estilo = estadoEventoStyles[evento.estado] || estadoEventoStyles.BORRADOR
              const productosCount = getProductosUsados(evento).length
              return (
                <Card
                  key={evento.id}
                  className="group overflow-hidden bg-card ring-1 ring-foreground/10"
                >
                  <div className="relative aspect-video overflow-hidden bg-muted">
                    {evento.imagenPrincipal ? (
                      <Image
                        src={evento.imagenPrincipal}
                        alt={evento.nombre}
                        fill
                        unoptimized
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <Calendar className="h-10 w-10 text-muted-foreground" />
                      </div>
                    )}
                    {evento.destacado && (
                      <div className="absolute left-2 top-2 rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-primary-foreground">
                        DESTACADO
                      </div>
                    )}
                    <div className="absolute right-2 top-2">
                      <span
                        className={cn(
                          "inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold",
                          estilo.bg,
                          estilo.text
                        )}
                      >
                        {estilo.label}
                      </span>
                    </div>
                  </div>
                  <CardContent className="space-y-3 p-4">
                    <div>
                      <h3 className="font-semibold text-foreground">
                        {evento.nombre}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {evento.anio} • {formatTipo(evento.tipo)}
                        {evento.ciudad ? ` • ${evento.ciudad}` : ""}
                      </p>
                    </div>
                    {evento.testimonio && (
                      <div className="space-y-1">
                        <div className="flex text-[#F59E0B]">
                          {Array.from({ length: evento.estrellasTestimonio || 0 }).map((_, i) => (
                            <Star key={i} className="h-3 w-3" fill="currentColor" />
                          ))}
                        </div>
                        <p className="line-clamp-2 text-xs italic text-muted-foreground">
                          “{evento.testimonio}”
                        </p>
                      </div>
                    )}
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{productosCount} producto(s)</span>
                      <span>{evento.cantidadUnidades || 0} unidades</span>
                    </div>
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Editar evento"
                        onClick={() => {
                          setSelectedEvento(evento)
                          setDrawerOpen(true)
                        }}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Archivar evento"
                        onClick={() => setDeleteDialog({ open: true, evento })}
                        className="text-muted-foreground hover:text-error"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })
          )}
        </div>
      )}

      {!loading && eventos.length > 0 && (
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

      <EventoPortafolioForm
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        evento={selectedEvento}
        productos={productos}
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
              ¿Archivar evento?
            </DialogTitle>
            <DialogDescription>
              Se marcará <strong>{deleteDialog.evento?.nombre}</strong> como
              archivado.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col-reverse gap-2 sm:flex-row">
            <Button
              variant="outline"
              onClick={() => setDeleteDialog({ open: false, evento: null })}
              className="w-full sm:w-auto"
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              className="w-full sm:w-auto"
            >
              Archivar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
