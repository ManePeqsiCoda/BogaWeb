"use client"

import { useEffect } from "react"
import { useForm, Controller, useWatch, type Resolver } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer"
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
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2, Star, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Evento } from "@prisma/client"

interface ProductoOption {
  id: string
  nombre: string
}

interface EventoPortafolioFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  evento: Evento | null
  productos: ProductoOption[]
  onSuccess: () => void
}

const tipoEventoOptions = [
  { value: "CONCIERTO", label: "Concierto" },
  { value: "FESTIVAL", label: "Festival" },
  { value: "FERIA", label: "Feria" },
  { value: "CORPORATIVO", label: "Corporativo" },
  { value: "GOBIERNO", label: "Gobierno" },
  { value: "PRIVADO", label: "Privado" },
]

const estadoEventoOptions = [
  { value: "PUBLICADO", label: "Publicado" },
  { value: "BORRADOR", label: "Borrador" },
  { value: "ARCHIVADO", label: "Archivado" },
]

const formSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio"),
  anio: z.coerce.number().int().min(2000).max(2100),
  tipo: z.enum(["CONCIERTO", "FESTIVAL", "FERIA", "CORPORATIVO", "GOBIERNO", "PRIVADO"]),
  descripcion: z.string().optional().nullable(),
  imagenPrincipal: z.string().optional().nullable(),
  ciudad: z.string().optional().nullable(),
  cantidadUnidades: z.coerce.number().int().nonnegative().optional().nullable(),
  productosUsados: z.array(z.string()).default([]),
  testimonio: z.string().optional().nullable(),
  nombreTestimonio: z.string().optional().nullable(),
  cargoTestimonio: z.string().optional().nullable(),
  estrellasTestimonio: z.coerce.number().int().min(1).max(5).optional().nullable(),
  destacado: z.boolean().default(false),
  estado: z.enum(["PUBLICADO", "BORRADOR", "ARCHIVADO"]).default("BORRADOR"),
})

type FormData = z.infer<typeof formSchema>

const defaultValues: FormData = {
  nombre: "",
  anio: new Date().getFullYear(),
  tipo: "CORPORATIVO",
  descripcion: "",
  imagenPrincipal: "",
  ciudad: "",
  cantidadUnidades: null,
  productosUsados: [],
  testimonio: "",
  nombreTestimonio: "",
  cargoTestimonio: "",
  estrellasTestimonio: null,
  destacado: false,
  estado: "BORRADOR",
}

function getProductosUsados(evento: Evento | null): string[] {
  if (!evento || !evento.productosUsados) return []
  if (Array.isArray(evento.productosUsados)) return evento.productosUsados as string[]
  return []
}

export function EventoPortafolioForm({
  open,
  onOpenChange,
  evento,
  productos,
  onSuccess,
}: EventoPortafolioFormProps) {
  const isEditing = Boolean(evento)

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema) as Resolver<FormData>,
    defaultValues,
  })

  useEffect(() => {
    if (evento) {
      reset({
        nombre: evento.nombre,
        anio: evento.anio,
        tipo: evento.tipo || "CORPORATIVO",
        descripcion: evento.descripcion || "",
        imagenPrincipal: evento.imagenPrincipal || "",
        ciudad: evento.ciudad || "",
        cantidadUnidades: evento.cantidadUnidades,
        productosUsados: getProductosUsados(evento),
        testimonio: evento.testimonio || "",
        nombreTestimonio: evento.nombreTestimonio || "",
        cargoTestimonio: evento.cargoTestimonio || "",
        estrellasTestimonio: evento.estrellasTestimonio,
        destacado: evento.destacado,
        estado: (evento.estado as FormData["estado"]) || "BORRADOR",
      })
    } else {
      reset(defaultValues)
    }
  }, [evento, reset])

  const onSubmit = async (data: FormData) => {
    try {
      const url = isEditing ? `/api/eventos/${evento!.id}` : "/api/eventos"
      const method = isEditing ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          descripcion: data.descripcion?.trim() || null,
          imagenPrincipal: data.imagenPrincipal?.trim() || null,
          ciudad: data.ciudad?.trim() || null,
          testimonio: data.testimonio?.trim() || null,
          nombreTestimonio: data.nombreTestimonio?.trim() || null,
          cargoTestimonio: data.cargoTestimonio?.trim() || null,
        }),
      })

      if (!res.ok) {
        const result = await res.json()
        throw new Error(result.error || "Error al guardar el evento")
      }

      toast.success(
        isEditing ? "Evento actualizado" : "Evento creado correctamente"
      )
      onSuccess()
      onOpenChange(false)
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Error al guardar el evento"
      )
    }
  }

  const productosSeleccionados = useWatch({ control, name: "productosUsados" })

  return (
    <Drawer open={open} onOpenChange={onOpenChange} swipeDirection="right">
      <DrawerContent className="w-[500px] max-w-full">
        <DrawerHeader>
          <DrawerTitle className="text-base font-extrabold uppercase tracking-wider">
            {isEditing ? "Editar evento" : "Nuevo evento"}
          </DrawerTitle>
          <DrawerDescription>
            {isEditing
              ? "Actualiza la información del portafolio de eventos."
              : "Registra un nuevo evento para el portafolio."}
          </DrawerDescription>
        </DrawerHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-1 flex-col overflow-hidden"
        >
          <div className="flex-1 space-y-4 overflow-y-auto px-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="nombre">
                Nombre <span className="text-error">*</span>
              </Label>
              <Input id="nombre" {...register("nombre")} />
              {errors.nombre && (
                <p className="text-xs text-error">{errors.nombre.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="anio">
                  Año <span className="text-error">*</span>
                </Label>
                <Input
                  id="anio"
                  type="number"
                  {...register("anio")}
                />
                {errors.anio && (
                  <p className="text-xs text-error">{errors.anio.message}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="tipo">Tipo</Label>
                <Controller
                  name="tipo"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id="tipo">
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
                  )}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="descripcion">Descripción</Label>
              <Textarea
                id="descripcion"
                {...register("descripcion")}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="imagenPrincipal">Imagen principal (URL)</Label>
                <Input
                  id="imagenPrincipal"
                  {...register("imagenPrincipal")}
                  placeholder="https://..."
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="ciudad">Ciudad</Label>
                <Input id="ciudad" {...register("ciudad")} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="cantidadUnidades">
                  Cantidad de unidades
                </Label>
                <Input
                  id="cantidadUnidades"
                  type="number"
                  min={0}
                  {...register("cantidadUnidades")}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="estado">Estado</Label>
                <Controller
                  name="estado"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id="estado">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {estadoEventoOptions.map((e) => (
                          <SelectItem key={e.value} value={e.value}>
                            {e.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="productos-usados">Productos usados</Label>
              <Controller
                name="productosUsados"
                control={control}
                render={({ field }) => (
                  <div
                    id="productos-usados"
                    className="max-h-40 overflow-y-auto rounded-md border border-input bg-background p-2"
                  >
                    {productos.length === 0 ? (
                      <p className="text-xs text-muted-foreground">
                        No hay productos activos.
                      </p>
                    ) : (
                      productos.map((producto) => {
                        const checked = field.value?.includes(producto.id)
                        return (
                          <label
                            key={producto.id}
                            className="flex cursor-pointer items-center gap-2 rounded px-1 py-1.5 hover:bg-muted/50"
                          >
                            <Checkbox
                              checked={checked}
                              onCheckedChange={(isChecked) => {
                                const value = field.value || []
                                if (isChecked) {
                                  field.onChange([...value, producto.id])
                                } else {
                                  field.onChange(
                                    value.filter((id) => id !== producto.id)
                                  )
                                }
                              }}
                            />
                            <span className="text-sm text-foreground">
                              {producto.nombre}
                            </span>
                            {checked && (
                              <Check className="ml-auto h-3.5 w-3.5 text-primary" />
                            )}
                          </label>
                        )
                      })
                    )}
                  </div>
                )}
              />
              {productosSeleccionados && productosSeleccionados.length > 0 && (
                <p className="text-xs text-muted-foreground">
                  {productosSeleccionados.length} producto(s) seleccionado(s)
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="testimonio">Testimonio</Label>
              <Textarea
                id="testimonio"
                {...register("testimonio")}
                rows={2}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="nombreTestimonio">Nombre testimonio</Label>
                <Input id="nombreTestimonio" {...register("nombreTestimonio")} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="cargoTestimonio">Cargo testimonio</Label>
                <Input id="cargoTestimonio" {...register("cargoTestimonio")} />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="estrellas">Estrellas</Label>
              <Controller
                name="estrellasTestimonio"
                control={control}
                render={({ field }) => (
                  <div id="estrellas" className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => {
                      const active = (field.value || 0) >= star
                      return (
                        <button
                          key={star}
                          type="button"
                          onClick={() => field.onChange(star)}
                          className={cn(
                            "rounded p-1 transition-colors",
                            active
                              ? "text-[#F59E0B]"
                              : "text-muted-foreground hover:text-foreground"
                          )}
                        >
                          <Star
                            className="h-5 w-5"
                            fill={active ? "currentColor" : "none"}
                          />
                        </button>
                      )
                    })}
                    {field.value ? (
                      <button
                        type="button"
                        onClick={() => field.onChange(null)}
                        className="ml-2 text-xs text-muted-foreground underline"
                      >
                        Limpiar
                      </button>
                    ) : null}
                  </div>
                )}
              />
            </div>

            <div className="flex items-center gap-2">
              <Controller
                name="destacado"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    id="destacado"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              <Label htmlFor="destacado" className="cursor-pointer text-sm font-normal">
                Marcar como evento destacado
              </Label>
            </div>
          </div>

          <DrawerFooter className="border-t border-border bg-card/50">
            <DrawerClose
              render={(
                <Button type="button" variant="outline" className="w-full">
                  Cancelar
                </Button>
              )}
            />
            <Button
              type="submit"
              className="w-full bg-primary font-semibold text-primary-foreground hover:bg-primary-hover"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                "Guardar evento"
              )}
            </Button>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  )
}
