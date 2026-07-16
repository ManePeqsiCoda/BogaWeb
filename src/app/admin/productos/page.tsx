"use client"

import { useEffect, useState, useCallback } from "react"
import Image from "next/image"
import { toast } from "sonner"
import { ProductoForm } from "@/components/admin/producto-form"
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
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Package,
  Loader2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { Producto, Categoria } from "@prisma/client"

type ProductoWithCategoria = Producto & { categoria: Categoria }

function formatCurrency(value: number | null | undefined) {
  if (value == null) return "—"
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(Number(value))
}

function mapEspecificaciones(
  data: unknown
): { nombre: string; valor: string }[] {
  if (typeof data !== "object" || data === null) return []
  return Object.entries(data as Record<string, string | number>).map(
    ([nombre, valor]) => ({
      nombre,
      valor: Array.isArray(valor) ? valor.join(", ") : String(valor),
    })
  )
}

const estadoStyles: Record<
  Producto["estado"],
  { label: string; bg: string; text: string }
> = {
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
  AGOTADO: {
    label: "Agotado",
    bg: "bg-[#F59E0B]/15",
    text: "text-[#F59E0B]",
  },
}

const tipoStyles: Record<Producto["tipo"], { label: string; bg: string; text: string }> = {
  PRODUCTO: {
    label: "Producto",
    bg: "bg-[#3B82F6]/15",
    text: "text-[#3B82F6]",
  },
  SERVICIO: {
    label: "Servicio",
    bg: "bg-purple-500/15",
    text: "text-purple-400",
  },
}

function buildPayload(producto: ProductoWithCategoria) {
  return {
    nombre: producto.nombre,
    nombreCorto: producto.nombreCorto,
    slug: producto.slug,
    descripcion: producto.descripcion,
    descripcionCorta: producto.descripcionCorta,
    categoriaId: producto.categoriaId,
    tipo: producto.tipo,
    badge: producto.badge,
    imagenPrincipal: producto.imagenPrincipal,
    precioBase: producto.precioBase ? Number(producto.precioBase) : null,
    unidadMedida: producto.unidadMedida,
    destacado: producto.destacado,
    orden: producto.orden,
    estado: producto.estado,
    seoTitle: producto.seoTitle,
    seoDescription: producto.seoDescription,
    especificaciones: mapEspecificaciones(producto.especificaciones),
  }
}

export default function ProductosAdminPage() {
  const [productos, setProductos] = useState<ProductoWithCategoria[]>([])
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] =
    useState<ProductoWithCategoria | null>(null)
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean
    producto: ProductoWithCategoria | null
  }>({ open: false, producto: null })
  const [refreshKey, setRefreshKey] = useState(0)

  // Debounce search
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
        const res = await fetch(
          `/api/productos?search=${encodeURIComponent(
            debouncedSearch
          )}&page=${page}&limit=10`
        )
        if (!res.ok) throw new Error("Error al cargar productos")
        const data = await res.json()
        if (!cancelled) {
          setProductos(data.productos)
          setTotalPages(data.totalPages)
        }
      } catch {
        if (!cancelled) {
          toast.error("No se pudieron cargar los productos")
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [debouncedSearch, page, refreshKey])

  const refresh = useCallback(() => setRefreshKey((k) => k + 1), [])

  useEffect(() => {
    async function fetchCategorias() {
      try {
        const res = await fetch("/api/categorias")
        if (res.ok) {
          const data = await res.json()
          setCategorias(data)
        }
      } catch {
        toast.error("No se pudieron cargar las categorías")
      }
    }
    fetchCategorias()
  }, [])

  const handleCreate = () => {
    setSelectedProduct(null)
    setDrawerOpen(true)
  }

  const handleEdit = (producto: ProductoWithCategoria) => {
    setSelectedProduct(producto)
    setDrawerOpen(true)
  }

  const handleDelete = async () => {
    if (!deleteDialog.producto) return
    try {
      const res = await fetch(`/api/productos/${deleteDialog.producto.id}`, {
        method: "DELETE",
      })
      if (!res.ok) throw new Error("Error al eliminar")
      toast.success("Producto eliminado")
      refresh()
    } catch {
      toast.error("No se pudo eliminar el producto")
    } finally {
      setDeleteDialog({ open: false, producto: null })
    }
  }

  const handleToggleEstado = async (producto: ProductoWithCategoria) => {
    const nuevoEstado = producto.estado === "ACTIVO" ? "INACTIVO" : "ACTIVO"
    try {
      const res = await fetch(`/api/productos/${producto.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...buildPayload(producto), estado: nuevoEstado }),
      })
      if (!res.ok) throw new Error("Error al cambiar estado")
      toast.success(`Estado actualizado a ${nuevoEstado.toLowerCase()}`)
      refresh()
    } catch {
      toast.error("No se pudo cambiar el estado")
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-sm font-extrabold uppercase tracking-widest text-foreground">
            Productos
          </h1>
          <p className="text-sm text-muted-foreground">
            Gestión del catálogo de productos y servicios
          </p>
        </div>
        <Button
          onClick={handleCreate}
          className="bg-primary font-semibold text-primary-foreground hover:bg-primary-hover"
        >
          <Plus className="mr-2 h-4 w-4" />
          Nuevo producto
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar por nombre..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border-input bg-background pl-9 text-foreground"
        />
      </div>

      {/* Table */}
      <Card className="bg-card ring-1 ring-foreground/10">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground">Imagen</TableHead>
                <TableHead className="text-muted-foreground">Nombre</TableHead>
                <TableHead className="text-muted-foreground">
                  Categoría
                </TableHead>
                <TableHead className="text-muted-foreground">Tipo</TableHead>
                <TableHead className="text-muted-foreground">Estado</TableHead>
                <TableHead className="text-muted-foreground">Precio</TableHead>
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
              ) : productos.length === 0 ? (
                <TableRow className="border-border hover:bg-transparent">
                  <TableCell colSpan={7}>
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted/20">
                        <Package className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <h3 className="mt-4 text-base font-semibold text-foreground">
                        No hay productos
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Crea el primer producto para comenzar.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                productos.map((producto) => {
                  const estadoStyle = estadoStyles[producto.estado]
                  const tipoStyle = tipoStyles[producto.tipo]
                  return (
                    <TableRow key={producto.id} className="border-border">
                      <TableCell>
                        <Image
                          src={producto.imagenPrincipal}
                          alt={producto.nombre}
                          width={40}
                          height={40}
                          className="rounded-md bg-muted object-cover"
                        />
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-foreground">
                          {producto.nombre}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {producto.nombreCorto}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
                          {producto.categoria.nombre}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span
                          className={cn(
                            "inline-flex rounded-full px-2 py-0.5 text-xs font-semibold",
                            tipoStyle.bg,
                            tipoStyle.text
                          )}
                        >
                          {tipoStyle.label}
                        </span>
                      </TableCell>
                      <TableCell>
                        <button
                          onClick={() => handleToggleEstado(producto)}
                          className={cn(
                            "inline-flex cursor-pointer items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold transition-opacity hover:opacity-80",
                            estadoStyle.bg,
                            estadoStyle.text
                          )}
                        >
                          <span
                            className={cn(
                              "h-1.5 w-1.5 rounded-full",
                              producto.estado === "ACTIVO"
                                ? "bg-[#22C55E]"
                                : producto.estado === "AGOTADO"
                                  ? "bg-[#F59E0B]"
                                  : "bg-[#EF4444]"
                            )}
                          />
                          {estadoStyle.label}
                        </button>
                      </TableCell>
                      <TableCell className="text-foreground">
                        {formatCurrency(
                          producto.precioBase ? Number(producto.precioBase) : null
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label="Editar producto"
                            onClick={() => handleEdit(producto)}
                            className="text-muted-foreground hover:text-foreground"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label="Eliminar producto"
                            onClick={() =>
                              setDeleteDialog({ open: true, producto })
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

          {/* Pagination */}
          {!loading && productos.length > 0 && (
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

      {/* Drawer */}
      <ProductoForm
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        producto={selectedProduct}
        categorias={categorias}
        onSuccess={refresh}
      />

      {/* Delete dialog */}
      <Dialog
        open={deleteDialog.open}
        onOpenChange={(open) =>
          setDeleteDialog((prev) => ({ ...prev, open }))
        }
      >
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">
              ¿Eliminar producto?
            </DialogTitle>
            <DialogDescription>
              Esta acción desactivará el producto{" "}
              <strong>{deleteDialog.producto?.nombre}</strong>. Puedes
              reactivarlo después.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col-reverse gap-2 sm:flex-row">
            <Button
              variant="outline"
              onClick={() =>
                setDeleteDialog({ open: false, producto: null })
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
