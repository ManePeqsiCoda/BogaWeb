"use client"

import { useEffect } from "react"
import { useForm, useFieldArray, Controller } from "react-hook-form"
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { X, Plus, Loader2 } from "lucide-react"
import { slugify } from "@/lib/slugify"
import { cn } from "@/lib/utils"
import type { Producto, Categoria } from "@prisma/client"

const especificacionSchema = z.object({
  nombre: z.string().min(1, "Requerido"),
  valor: z.string().min(1, "Requerido"),
})

const formSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio"),
  nombreCorto: z.string().min(1).max(30),
  slug: z.string().min(1, "El slug es obligatorio"),
  descripcion: z.string().min(1, "La descripción es obligatoria"),
  descripcionCorta: z.string().min(1).max(150),
  categoriaId: z.string().min(1, "Selecciona una categoría"),
  tipo: z.enum(["PRODUCTO", "SERVICIO"]),
  badge: z.string().optional(),
  imagenPrincipal: z.string().min(1, "La imagen principal es obligatoria"),
  precioBase: z.string().optional(),
  unidadMedida: z.enum(["unidad", "turno", "hora"]),
  destacado: z.boolean(),
  orden: z.number().int(),
  estado: z.enum(["ACTIVO", "INACTIVO", "AGOTADO"]),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  especificaciones: z.array(especificacionSchema),
})

type FormData = z.infer<typeof formSchema>

interface ProductoFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  producto: (Producto & { categoria?: Categoria }) | null
  categorias: Categoria[]
  onSuccess: () => void
}

const defaultValues: FormData = {
  nombre: "",
  nombreCorto: "",
  slug: "",
  descripcion: "",
  descripcionCorta: "",
  categoriaId: "",
  tipo: "PRODUCTO",
  badge: "",
  imagenPrincipal: "",
  precioBase: "",
  unidadMedida: "unidad",
  destacado: false,
  orden: 0,
  estado: "ACTIVO",
  seoTitle: "",
  seoDescription: "",
  especificaciones: [],
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

export function ProductoForm({
  open,
  onOpenChange,
  producto,
  categorias,
  onSuccess,
}: ProductoFormProps) {
  const isEditing = Boolean(producto)

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: "especificaciones",
  })

  useEffect(() => {
    if (producto) {
      reset({
        nombre: producto.nombre,
        nombreCorto: producto.nombreCorto,
        slug: producto.slug,
        descripcion: producto.descripcion,
        descripcionCorta: producto.descripcionCorta,
        categoriaId: producto.categoriaId,
        tipo: producto.tipo,
        badge: producto.badge || "",
        imagenPrincipal: producto.imagenPrincipal,
        precioBase: producto.precioBase?.toString() || "",
        unidadMedida: producto.unidadMedida as "unidad" | "turno" | "hora",
        destacado: producto.destacado,
        orden: producto.orden,
        estado: producto.estado,
        seoTitle: producto.seoTitle || "",
        seoDescription: producto.seoDescription || "",
        especificaciones: mapEspecificaciones(producto.especificaciones),
      })
    } else {
      reset(defaultValues)
    }
  }, [producto, reset])

  const onSubmit = async (data: FormData) => {
    try {
      const payload = {
        ...data,
        badge: data.badge?.trim() || null,
        seoTitle: data.seoTitle?.trim() || null,
        seoDescription: data.seoDescription?.trim() || null,
        precioBase: data.precioBase ? parseFloat(data.precioBase) : null,
      }

      const url = isEditing
        ? `/api/productos/${producto!.id}`
        : "/api/productos"
      const method = isEditing ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const result = await response.json()
        throw new Error(result.error || "Error al guardar el producto")
      }

      toast.success(
        isEditing
          ? "Producto actualizado correctamente"
          : "Producto creado correctamente"
      )
      onSuccess()
      onOpenChange(false)
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Error al guardar el producto"
      )
    }
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange} swipeDirection="right">
      <DrawerContent className="w-[450px] max-w-full">
        <DrawerHeader>
          <DrawerTitle className="text-base font-extrabold uppercase tracking-wider">
            {isEditing ? "Editar producto" : "Nuevo producto"}
          </DrawerTitle>
          <DrawerDescription>
            {isEditing
              ? "Actualiza la información del producto o servicio."
              : "Completa la información para crear un nuevo producto o servicio."}
          </DrawerDescription>
        </DrawerHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-1 flex-col overflow-hidden"
        >
          <Tabs defaultValue="informacion" className="flex flex-1 flex-col px-4">
            <TabsList className="w-full">
              <TabsTrigger value="informacion" className="flex-1">
                Información
              </TabsTrigger>
              <TabsTrigger value="especificaciones" className="flex-1">
                Especificaciones
              </TabsTrigger>
              <TabsTrigger value="seo" className="flex-1">
                SEO
              </TabsTrigger>
            </TabsList>

            <TabsContent
              value="informacion"
              className="flex-1 space-y-4 overflow-y-auto py-4"
            >
              {/* Nombre */}
              <div className="space-y-1.5">
                <Label htmlFor="nombre">
                  Nombre <span className="text-error">*</span>
                </Label>
                <Input
                  id="nombre"
                  placeholder="Ej. Baño Portátil VIP"
                  {...register("nombre")}
                  onBlur={(e) => {
                    if (!isEditing && !getValues("slug")) {
                      setValue("slug", slugify(e.target.value))
                    }
                  }}
                />
                {errors.nombre && (
                  <p className="text-xs text-error">{errors.nombre.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="nombreCorto">
                    Nombre corto <span className="text-error">*</span>
                  </Label>
                  <Input
                    id="nombreCorto"
                    placeholder="VIP"
                    maxLength={30}
                    {...register("nombreCorto")}
                  />
                  {errors.nombreCorto && (
                    <p className="text-xs text-error">
                      {errors.nombreCorto.message}
                    </p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="slug">
                    Slug <span className="text-error">*</span>
                  </Label>
                  <Input id="slug" placeholder="bano-vip" {...register("slug")} />
                  {errors.slug && (
                    <p className="text-xs text-error">{errors.slug.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="descripcion">
                  Descripción <span className="text-error">*</span>
                </Label>
                <Textarea
                  id="descripcion"
                  placeholder="Descripción detallada del producto"
                  rows={3}
                  {...register("descripcion")}
                />
                {errors.descripcion && (
                  <p className="text-xs text-error">
                    {errors.descripcion.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="descripcionCorta">
                  Descripción corta <span className="text-error">*</span>
                </Label>
                <Textarea
                  id="descripcionCorta"
                  placeholder="Breve resumen"
                  maxLength={150}
                  rows={2}
                  {...register("descripcionCorta")}
                />
                {errors.descripcionCorta && (
                  <p className="text-xs text-error">
                    {errors.descripcionCorta.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="categoriaId">
                    Categoría <span className="text-error">*</span>
                  </Label>
                  <Controller
                    name="categoriaId"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger id="categoriaId" className="w-full">
                          <SelectValue placeholder="Seleccionar" />
                        </SelectTrigger>
                        <SelectContent>
                          {categorias.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>
                              {cat.nombre}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.categoriaId && (
                    <p className="text-xs text-error">
                      {errors.categoriaId.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label id="tipo-label">Tipo</Label>
                  <Controller
                    name="tipo"
                    control={control}
                    render={({ field }) => (
                      <div
                        role="group"
                        aria-labelledby="tipo-label"
                        className="flex rounded-lg border border-input p-1"
                      >
                        {(["PRODUCTO", "SERVICIO"] as const).map((tipo) => (
                          <button
                            key={tipo}
                            type="button"
                            onClick={() => field.onChange(tipo)}
                            className={cn(
                              "flex-1 rounded-md px-2 py-1 text-xs font-medium transition-colors",
                              field.value === tipo
                                ? "bg-primary text-primary-foreground"
                                : "text-muted-foreground hover:text-foreground"
                            )}
                          >
                            {tipo === "PRODUCTO" ? "Producto" : "Servicio"}
                          </button>
                        ))}
                      </div>
                    )}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="badge">Badge</Label>
                  <Input
                    id="badge"
                    placeholder="Ej. SERVICIO PROFESIONAL"
                    {...register("badge")}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="orden">Orden</Label>
                  <Input
                    id="orden"
                    type="number"
                    {...register("orden", { valueAsNumber: true })}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="imagenPrincipal">
                  Imagen principal (URL) <span className="text-error">*</span>
                </Label>
                <Input
                  id="imagenPrincipal"
                  placeholder="/images/productos/ejemplo.svg"
                  {...register("imagenPrincipal")}
                />
                {errors.imagenPrincipal && (
                  <p className="text-xs text-error">
                    {errors.imagenPrincipal.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="precioBase">Precio base</Label>
                  <Input
                    id="precioBase"
                    type="number"
                    step="any"
                    placeholder="0"
                    {...register("precioBase")}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="unidadMedida">Unidad de medida</Label>
                  <Controller
                    name="unidadMedida"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger id="unidadMedida" className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="unidad">Unidad</SelectItem>
                          <SelectItem value="turno">Turno</SelectItem>
                          <SelectItem value="hora">Hora</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between rounded-lg border border-input p-3">
                <div className="space-y-0.5">
                  <Label htmlFor="destacado">Producto destacado</Label>
                  <p className="text-xs text-muted-foreground">
                    Mostrar en secciones destacadas
                  </p>
                </div>
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
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="estado">Estado</Label>
                <Controller
                  name="estado"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger id="estado" className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ACTIVO">Activo</SelectItem>
                        <SelectItem value="INACTIVO">Inactivo</SelectItem>
                        <SelectItem value="AGOTADO">Agotado</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </TabsContent>

            <TabsContent
              value="especificaciones"
              className="flex-1 space-y-4 overflow-y-auto py-4"
            >
              <div className="flex items-center justify-between">
                <Label>Especificaciones técnicas</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append({ nombre: "", valor: "" })}
                >
                  <Plus className="mr-1 h-3.5 w-3.5" />
                  Agregar
                </Button>
              </div>

              {fields.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No hay especificaciones. Agrega una con el botón superior.
                </p>
              )}

              <div className="space-y-3">
                {fields.map((field, index) => (
                  <div key={field.id} className="flex items-start gap-2">
                    <div className="grid flex-1 grid-cols-2 gap-2">
                      <Input
                        placeholder="Nombre"
                        {...register(`especificaciones.${index}.nombre`)}
                      />
                      <Input
                        placeholder="Valor"
                        {...register(`especificaciones.${index}.valor`)}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => remove(index)}
                      className="text-muted-foreground hover:text-error"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent
              value="seo"
              className="flex-1 space-y-4 overflow-y-auto py-4"
            >
              <div className="space-y-1.5">
                <Label htmlFor="seoTitle">SEO Title</Label>
                <Input
                  id="seoTitle"
                  placeholder="Título para buscadores"
                  {...register("seoTitle")}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="seoDescription">SEO Description</Label>
                <Textarea
                  id="seoDescription"
                  placeholder="Descripción para buscadores"
                  rows={4}
                  {...register("seoDescription")}
                />
              </div>
            </TabsContent>
          </Tabs>

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
                "Guardar producto"
              )}
            </Button>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  )
}
