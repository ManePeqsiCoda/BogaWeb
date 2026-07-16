"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, Plus, Trash2, ArrowRight, ArrowLeft, Save, Send } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"
import type { Categoria, Cliente, Producto, EstadoCotizacion } from "@prisma/client"

type ProductoWithCategoria = Producto & { categoria: Categoria }

type CotizacionItemInput = {
  productoId: string
  producto: ProductoWithCategoria
  cantidad: number
  precioUnitario: number
  precioTotal: number
}

type CotizacionWithDetails = {
  id: string
  codigo: string
  nombre: string
  descripcion: string | null
  estado: EstadoCotizacion
  fechaEvento: string | null
  ubicacionEvento: string | null
  tipoEvento: string | null
  duracionDias: number | null
  costoTotal: number
  precioVenta: number
  margen: number
  notasInternas: string | null
  cliente: Cliente
  items: {
    productoId: string
    cantidad: number
    precioUnitario: number
    precioTotal: number
    producto: ProductoWithCategoria
  }[]
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(value)
}

const tipoEventoOptions = [
  "Concierto",
  "Festival",
  "Feria",
  "Corporativo",
  "Boda",
  "Privado",
  "Gubernamental",
  "Obra",
  "Otro",
]

interface CotizacionWizardProps {
  cotizacionId?: string
  preselectedClienteId?: string
}

export function CotizacionWizard({
  cotizacionId,
  preselectedClienteId,
}: CotizacionWizardProps) {
  const router = useRouter()
  const isEditing = Boolean(cotizacionId)

  const [step, setStep] = useState(1)
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [productos, setProductos] = useState<ProductoWithCategoria[]>([])
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [loadingInit, setLoadingInit] = useState(true)
  const [saving, setSaving] = useState(false)

  const [clienteId, setClienteId] = useState(
    !cotizacionId && preselectedClienteId ? preselectedClienteId : ""
  )
  const [isNewClient, setIsNewClient] = useState(false)
  const [newClient, setNewClient] = useState({
    nombreEmpresa: "",
    nombreContacto: "",
    email: "",
    telefono: "",
    sector: "",
    ciudad: "",
  })

  const [evento, setEvento] = useState({
    nombre: "",
    fecha: "",
    ubicacion: "",
    tipo: "",
    duracion: 1,
  })

  const [cotizacionNombre, setCotizacionNombre] = useState("")
  const [descripcion, setDescripcion] = useState("")
  const [items, setItems] = useState<CotizacionItemInput[]>([])
  const [precioVenta, setPrecioVenta] = useState(0)
  const [notasInternas, setNotasInternas] = useState("")
  const [estado, setEstado] = useState<EstadoCotizacion>("BORRADOR")

  const [searchProducto, setSearchProducto] = useState("")
  const [categoriaActiva, setCategoriaActiva] = useState("Todas")

  // Load initial data
  useEffect(() => {
    async function load() {
      try {
        const [clientesRes, productosRes, categoriasRes] = await Promise.all([
          fetch("/api/clientes"),
          fetch("/api/productos?estado=ACTIVO&limit=100"),
          fetch("/api/categorias"),
        ])

        if (clientesRes.ok) setClientes(await clientesRes.json())
        if (productosRes.ok) {
          const data = await productosRes.json()
          setProductos(data.productos)
        }
        if (categoriasRes.ok) setCategorias(await categoriasRes.json())
      } catch {
        toast.error("Error al cargar datos iniciales")
      } finally {
        setLoadingInit(false)
      }
    }
    load()
  }, [])

  // Load existing cotizacion for edit
  useEffect(() => {
    if (!cotizacionId) return
    async function loadCotizacion() {
      try {
        const res = await fetch(`/api/cotizaciones/${cotizacionId}`)
        if (!res.ok) throw new Error("Error")
        const c: CotizacionWithDetails = await res.json()

        setClienteId(c.cliente.id)
        setIsNewClient(false)
        setEvento({
          nombre: c.nombre,
          fecha: c.fechaEvento ? c.fechaEvento.split("T")[0] : "",
          ubicacion: c.ubicacionEvento || "",
          tipo: c.tipoEvento || "",
          duracion: c.duracionDias || 1,
        })
        setCotizacionNombre(c.nombre)
        setDescripcion(c.descripcion || "")
        setItems(
          c.items.map((item) => ({
            productoId: item.productoId,
            producto: item.producto,
            cantidad: item.cantidad,
            precioUnitario: Number(item.precioUnitario),
            precioTotal: Number(item.precioTotal),
          }))
        )
        setPrecioVenta(Number(c.precioVenta))
        setNotasInternas(c.notasInternas || "")
        setEstado(c.estado)
      } catch {
        toast.error("No se pudo cargar la cotización")
        router.push("/admin/cotizaciones")
      }
    }
    loadCotizacion()
  }, [cotizacionId, router])

  const costoTotal = useMemo(
    () => items.reduce((sum, item) => sum + item.precioTotal, 0),
    [items]
  )

  const margen = useMemo(() => {
    return precioVenta > 0
      ? parseFloat((((precioVenta - costoTotal) / precioVenta) * 100).toFixed(2))
      : 0
  }, [precioVenta, costoTotal])

  const nombreSugerido = useMemo(() => {
    if (!evento.nombre) return ""
    const clienteName = isNewClient
      ? newClient.nombreEmpresa
      : clientes.find((c) => c.id === clienteId)?.nombreEmpresa
    return clienteName ? `${evento.nombre} - ${clienteName}` : ""
  }, [evento.nombre, clienteId, isNewClient, newClient.nombreEmpresa, clientes])

  const productosFiltrados = useMemo(() => {
    return productos.filter((p) => {
      const matchesSearch =
        !searchProducto ||
        p.nombre.toLowerCase().includes(searchProducto.toLowerCase()) ||
        p.descripcionCorta.toLowerCase().includes(searchProducto.toLowerCase())
      const matchesCat =
        categoriaActiva === "Todas" || p.categoria.nombre === categoriaActiva
      return matchesSearch && matchesCat
    })
  }, [productos, searchProducto, categoriaActiva])

  const handleAddProduct = (producto: ProductoWithCategoria) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productoId === producto.id)
      if (existing) {
        return prev.map((i) =>
          i.productoId === producto.id
            ? {
                ...i,
                cantidad: i.cantidad + 1,
                precioTotal: (i.cantidad + 1) * i.precioUnitario,
              }
            : i
        )
      }
      const unitPrice = producto.precioBase ? Number(producto.precioBase) : 0
      return [
        ...prev,
        {
          productoId: producto.id,
          producto,
          cantidad: 1,
          precioUnitario: unitPrice,
          precioTotal: unitPrice,
        },
      ]
    })
  }

  const updateItem = (
    productoId: string,
    field: "cantidad" | "precioUnitario",
    value: number
  ) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.productoId !== productoId) return item
        const cantidad = field === "cantidad" ? value : item.cantidad
        const precioUnitario =
          field === "precioUnitario" ? value : item.precioUnitario
        return {
          ...item,
          cantidad,
          precioUnitario,
          precioTotal: cantidad * precioUnitario,
        }
      })
    )
  }

  const removeItem = (productoId: string) => {
    setItems((prev) => prev.filter((i) => i.productoId !== productoId))
  }

  const handleMargenChange = (value: number) => {
    const nuevoPrecio = value >= 100 ? costoTotal : costoTotal / (1 - value / 100)
    setPrecioVenta(parseFloat(nuevoPrecio.toFixed(2)))
  }

  const handlePrecioVentaChange = (value: number) => {
    setPrecioVenta(value)
  }

  const validateStep1 = () => {
    if (!isNewClient && !clienteId) {
      toast.error("Selecciona un cliente existente")
      return false
    }
    if (isNewClient) {
      if (!newClient.nombreEmpresa || !newClient.email || !newClient.telefono) {
        toast.error("Completa los datos del nuevo cliente")
        return false
      }
    }
    if (!evento.nombre || !evento.fecha) {
      toast.error("Nombre del evento y fecha son obligatorios")
      return false
    }
    if (!cotizacionNombre && !nombreSugerido) {
      toast.error("El nombre de la cotización es obligatorio")
      return false
    }
    return true
  }

  const validateStep2 = () => {
    if (items.length === 0) {
      toast.error("Agrega al menos un producto")
      return false
    }
    return true
  }

  const handleNext = () => {
    if (step === 1 && !validateStep1()) return
    if (step === 2 && !validateStep2()) return
    setStep((s) => Math.min(3, s + 1))
  }

  const handleBack = () => setStep((s) => Math.max(1, s - 1))

  const handleSave = async (enviar: boolean) => {
    if (!validateStep1() || !validateStep2()) return

    setSaving(true)
    try {
      const payload = {
        clienteId: isNewClient ? undefined : clienteId,
        nuevoCliente: isNewClient ? newClient : undefined,
        nombre: cotizacionNombre || nombreSugerido,
        descripcion: descripcion || null,
        fechaEvento: evento.fecha ? new Date(evento.fecha).toISOString() : null,
        ubicacionEvento: evento.ubicacion || null,
        tipoEvento: evento.tipo || null,
        duracionDias: evento.duracion || null,
        costoTotal,
        precioVenta,
        margen,
        moneda: "COP",
        estado: enviar ? "ENVIADA" : estado === "BORRADOR" ? "BORRADOR" : estado,
        notasInternas: notasInternas || null,
        items: items.map((item) => ({
          productoId: item.productoId,
          cantidad: item.cantidad,
          precioUnitario: item.precioUnitario,
          precioTotal: item.precioTotal,
          descripcionPersonalizada: null,
        })),
      }

      const url = isEditing
        ? `/api/cotizaciones/${cotizacionId}`
        : "/api/cotizaciones"
      const method = isEditing ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Error al guardar")
      }

      const result = await res.json()
      toast.success(
        enviar ? "Cotización guardada y enviada" : "Cotización guardada como borrador"
      )
      router.push(`/admin/cotizaciones/${result.id}`)
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Error al guardar la cotización"
      )
    } finally {
      setSaving(false)
    }
  }

  if (loadingInit) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="flex min-h-[calc(100vh-8rem)] flex-col">
      {/* Step header */}
      <div className="mb-6">
        <h1 className="text-sm font-extrabold uppercase tracking-widest text-foreground">
          {isEditing ? "Editar cotización" : "Nueva cotización"}
        </h1>
        <div className="mt-4 flex items-center gap-2">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold",
                  step >= s
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted/20 text-muted-foreground"
                )}
              >
                {s}
              </div>
              <span
                className={cn(
                  "text-xs font-medium",
                  step >= s ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {s === 1 ? "Cliente" : s === 2 ? "Productos" : "Revisión"}
              </span>
              {s < 3 && <div className="mx-2 h-px w-8 bg-border" />}
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-6 lg:flex-row">
        {/* Main content */}
        <div className="flex-1">
          {step === 1 && (
            <div className="space-y-6">
              <Card className="bg-card ring-1 ring-foreground/10">
                <CardContent className="space-y-4 p-5">
                  <h2 className="text-sm font-extrabold uppercase tracking-wider text-foreground">
                    Cliente
                  </h2>

                  <div className="space-y-1.5">
                    <Label htmlFor="clienteId">Seleccionar cliente</Label>
                    <Select
                      value={isNewClient ? "nuevo" : clienteId}
                      onValueChange={(value) => {
                        if (value === "nuevo") {
                          setIsNewClient(true)
                          setClienteId("")
                        } else {
                          setIsNewClient(false)
                          setClienteId(value || "")
                        }
                      }}
                    >
                      <SelectTrigger id="clienteId" className="w-full">
                        <SelectValue placeholder="Seleccionar cliente" />
                      </SelectTrigger>
                      <SelectContent>
                        {clientes.map((c) => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.nombreEmpresa}
                          </SelectItem>
                        ))}
                        <SelectItem value="nuevo">+ Nuevo cliente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {isNewClient && (
                    <div className="grid gap-4 rounded-lg border border-border bg-background/50 p-4 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <Label>Nombre empresa *</Label>
                        <Input
                          value={newClient.nombreEmpresa}
                          onChange={(e) =>
                            setNewClient((p) => ({
                              ...p,
                              nombreEmpresa: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label>Contacto</Label>
                        <Input
                          value={newClient.nombreContacto}
                          onChange={(e) =>
                            setNewClient((p) => ({
                              ...p,
                              nombreContacto: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label>Email *</Label>
                        <Input
                          type="email"
                          value={newClient.email}
                          onChange={(e) =>
                            setNewClient((p) => ({ ...p, email: e.target.value }))
                          }
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label>Teléfono *</Label>
                        <Input
                          value={newClient.telefono}
                          onChange={(e) =>
                            setNewClient((p) => ({
                              ...p,
                              telefono: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label>Sector</Label>
                        <Input
                          value={newClient.sector}
                          onChange={(e) =>
                            setNewClient((p) => ({ ...p, sector: e.target.value }))
                          }
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label>Ciudad</Label>
                        <Input
                          value={newClient.ciudad}
                          onChange={(e) =>
                            setNewClient((p) => ({ ...p, ciudad: e.target.value }))
                          }
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-card ring-1 ring-foreground/10">
                <CardContent className="space-y-4 p-5">
                  <h2 className="text-sm font-extrabold uppercase tracking-wider text-foreground">
                    Evento
                  </h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label>Nombre del evento *</Label>
                      <Input
                        value={evento.nombre}
                        onChange={(e) =>
                          setEvento((p) => ({ ...p, nombre: e.target.value }))
                        }
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Fecha del evento *</Label>
                      <Input
                        type="date"
                        value={evento.fecha}
                        onChange={(e) =>
                          setEvento((p) => ({ ...p, fecha: e.target.value }))
                        }
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Ubicación</Label>
                      <Input
                        value={evento.ubicacion}
                        onChange={(e) =>
                          setEvento((p) => ({ ...p, ubicacion: e.target.value }))
                        }
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="tipoEvento">Tipo de evento</Label>
                      <Select
                        value={evento.tipo}
                        onValueChange={(value) =>
                          setEvento((p) => ({ ...p, tipo: value || "" }))
                        }
                      >
                        <SelectTrigger id="tipoEvento" className="w-full">
                          <SelectValue placeholder="Seleccionar" />
                        </SelectTrigger>
                        <SelectContent>
                          {tipoEventoOptions.map((t) => (
                            <SelectItem key={t} value={t}>
                              {t}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label>Duración (días)</Label>
                      <Input
                        type="number"
                        min={1}
                        value={evento.duracion}
                        onChange={(e) =>
                          setEvento((p) => ({
                            ...p,
                            duracion: parseInt(e.target.value) || 1,
                          }))
                        }
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card ring-1 ring-foreground/10">
                <CardContent className="space-y-4 p-5">
                  <h2 className="text-sm font-extrabold uppercase tracking-wider text-foreground">
                    Cotización
                  </h2>
                  <div className="space-y-1.5">
                    <Label>Nombre de la cotización *</Label>
                    <Input
                      value={cotizacionNombre}
                      onChange={(e) => setCotizacionNombre(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Descripción</Label>
                    <Textarea
                      value={descripcion}
                      onChange={(e) => setDescripcion(e.target.value)}
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="relative">
                <Input
                  placeholder="Buscar productos..."
                  value={searchProducto}
                  onChange={(e) => setSearchProducto(e.target.value)}
                  className="border-input bg-background pl-4"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setCategoriaActiva("Todas")}
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                    categoriaActiva === "Todas"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted/20 text-muted-foreground hover:bg-muted/30"
                  )}
                >
                  Todas
                </button>
                {categorias.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setCategoriaActiva(cat.nombre)}
                    className={cn(
                      "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                      categoriaActiva === cat.nombre
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted/20 text-muted-foreground hover:bg-muted/30"
                    )}
                  >
                    {cat.nombre}
                  </button>
                ))}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {productosFiltrados.map((producto) => (
                  <Card
                    key={producto.id}
                    className="bg-card ring-1 ring-foreground/10"
                  >
                    <CardContent className="flex gap-4 p-4">
                      <Image
                        src={producto.imagenPrincipal}
                        alt={producto.nombre}
                        width={64}
                        height={64}
                        className="rounded-lg bg-muted object-cover"
                      />
                      <div className="flex flex-1 flex-col">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="font-semibold text-foreground">
                              {producto.nombre}
                            </h3>
                            <p className="text-xs text-muted-foreground line-clamp-2">
                              {producto.descripcionCorta}
                            </p>
                          </div>
                          <span className="shrink-0 rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium text-secondary-foreground">
                            {producto.categoria.nombre}
                          </span>
                        </div>
                        <div className="mt-auto flex items-center justify-between pt-3">
                          <span className="text-sm font-medium text-foreground">
                            {formatCurrency(
                              producto.precioBase
                                ? Number(producto.precioBase)
                                : 0
                            )}
                          </span>
                          <Button
                            size="sm"
                            onClick={() => handleAddProduct(producto)}
                            className="bg-primary text-primary-foreground hover:bg-primary-hover"
                          >
                            <Plus className="mr-1 h-3.5 w-3.5" />
                            Agregar
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <Card className="bg-card ring-1 ring-foreground/10">
                <CardContent className="space-y-3 p-5">
                  <h2 className="text-sm font-extrabold uppercase tracking-wider text-foreground">
                    Cliente y evento
                  </h2>
                  <div className="grid gap-4 text-sm sm:grid-cols-2">
                    <div>
                      <p className="text-muted-foreground">Cliente</p>
                      <p className="font-medium text-foreground">
                        {isNewClient
                          ? newClient.nombreEmpresa
                          : clientes.find((c) => c.id === clienteId)
                              ?.nombreEmpresa}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Evento</p>
                      <p className="font-medium text-foreground">
                        {evento.nombre}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Fecha</p>
                      <p className="text-foreground">
                        {evento.fecha || "No definida"}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Ubicación</p>
                      <p className="text-foreground">
                        {evento.ubicacion || "No definida"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card ring-1 ring-foreground/10">
                <CardContent className="space-y-3 p-5">
                  <h2 className="text-sm font-extrabold uppercase tracking-wider text-foreground">
                    Productos
                  </h2>
                  <div className="space-y-2">
                    {items.map((item) => (
                      <div
                        key={item.productoId}
                        className="flex items-center justify-between rounded-lg border border-border bg-background/50 p-3 text-sm"
                      >
                        <div>
                          <p className="font-medium text-foreground">
                            {item.producto.nombre}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {item.cantidad} x{" "}
                            {formatCurrency(item.precioUnitario)}
                          </p>
                        </div>
                        <p className="font-semibold text-foreground">
                          {formatCurrency(item.precioTotal)}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card ring-1 ring-foreground/10">
                <CardContent className="space-y-3 p-5">
                  <Label htmlFor="notas">Notas internas</Label>
                  <Textarea
                    id="notas"
                    value={notasInternas}
                    onChange={(e) => setNotasInternas(e.target.value)}
                    rows={4}
                    placeholder="Información adicional para el equipo interno"
                  />
                </CardContent>
              </Card>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="mt-8 flex items-center justify-between">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={step === 1 || saving}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Atrás
            </Button>
            {step < 3 ? (
              <Button
                onClick={handleNext}
                className="bg-primary font-semibold text-primary-foreground hover:bg-primary-hover"
              >
                Siguiente
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => handleSave(false)}
                  disabled={saving}
                >
                  {saving ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
                  Guardar borrador
                </Button>
                <Button
                  onClick={() => handleSave(true)}
                  disabled={saving}
                  className="bg-primary font-semibold text-primary-foreground hover:bg-primary-hover"
                >
                  {saving ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="mr-2 h-4 w-4" />
                  )}
                  Guardar y enviar
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Resumen panel */}
        <aside className="w-full shrink-0 lg:w-[380px]">
          <div className="sticky top-4 rounded-xl bg-card p-5 ring-1 ring-foreground/10">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-foreground">
              Resumen
            </h2>
            <p className="text-xs text-muted-foreground">
              {items.length} producto{items.length !== 1 ? "s" : ""} seleccionado
              {items.length !== 1 ? "s" : ""}
            </p>

            <div className="mt-4 max-h-[400px] space-y-3 overflow-y-auto">
              {items.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No hay productos seleccionados.
                </p>
              )}
              {items.map((item) => (
                <div
                  key={item.productoId}
                  className="rounded-lg border border-border bg-background/50 p-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium text-foreground">
                      {item.producto.nombre}
                    </p>
                    <button
                      onClick={() => removeItem(item.productoId)}
                      className="text-muted-foreground hover:text-error"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-[10px] text-muted-foreground">
                        Cantidad
                      </Label>
                      <Input
                        type="number"
                        min={1}
                        value={item.cantidad}
                        onChange={(e) =>
                          updateItem(
                            item.productoId,
                            "cantidad",
                            parseInt(e.target.value) || 1
                          )
                        }
                        className="h-8 text-sm"
                      />
                    </div>
                    <div>
                      <Label className="text-[10px] text-muted-foreground">
                        Precio unitario
                      </Label>
                      <Input
                        type="number"
                        min={0}
                        step="any"
                        value={item.precioUnitario}
                        onChange={(e) =>
                          updateItem(
                            item.productoId,
                            "precioUnitario",
                            parseFloat(e.target.value) || 0
                          )
                        }
                        className="h-8 text-sm"
                      />
                    </div>
                  </div>
                  <p className="mt-2 text-right text-sm font-semibold text-foreground">
                    {formatCurrency(item.precioTotal)}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-5 space-y-3 border-t border-border pt-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Costo total</span>
                <span className="font-semibold text-foreground">
                  {formatCurrency(costoTotal)}
                </span>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label className="text-xs text-muted-foreground">
                    Precio de venta
                  </Label>
                  <span className="text-xs text-muted-foreground">
                    Margen: {margen.toFixed(1)}%
                  </span>
                </div>
                <Input
                  type="number"
                  min={0}
                  step="any"
                  value={precioVenta}
                  onChange={(e) =>
                    handlePrecioVentaChange(parseFloat(e.target.value) || 0)
                  }
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">
                  Margen: {margen.toFixed(1)}%
                </Label>
                <input
                  type="range"
                  min={0}
                  max={95}
                  step={0.5}
                  value={margen}
                  onChange={(e) =>
                    handleMargenChange(parseFloat(e.target.value))
                  }
                  className="w-full accent-primary"
                />
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Ganancia</span>
                <span
                  className={cn(
                    "font-semibold",
                    precioVenta - costoTotal >= 0
                      ? "text-[#22C55E]"
                      : "text-[#EF4444]"
                  )}
                >
                  {formatCurrency(precioVenta - costoTotal)}
                </span>
              </div>

              <div className="flex justify-between border-t border-border pt-3 text-base">
                <span className="font-semibold text-foreground">TOTAL</span>
                <span className="font-extrabold text-primary">
                  {formatCurrency(precioVenta)}
                </span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
