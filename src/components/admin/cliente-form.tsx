"use client"

import { useEffect } from "react"
import { useForm, Controller } from "react-hook-form"
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
import { Loader2 } from "lucide-react"
import type { Cliente } from "@prisma/client"

const formSchema = z.object({
  nombreEmpresa: z.string().min(1, "El nombre es obligatorio"),
  nombreContacto: z.string().optional(),
  email: z.string().email("Correo inválido"),
  telefono: z.string().min(1, "El teléfono es obligatorio"),
  sector: z.string().optional(),
  ciudad: z.string().optional(),
  direccion: z.string().optional(),
  notas: z.string().optional(),
  fuente: z.enum(["WEB", "REFERIDO", "WHATSAPP", "TELEFONO"]),
  estado: z.enum(["PROSPECTO", "ACTIVO", "INACTIVO"]),
})

type FormData = z.infer<typeof formSchema>

interface ClienteFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  cliente: Cliente | null
  onSuccess: () => void
}

const sectorOptions = [
  "Entretenimiento",
  "Construcción",
  "Gobierno",
  "Corporativo",
  "Deportes",
  "Otro",
]

const defaultValues: FormData = {
  nombreEmpresa: "",
  nombreContacto: "",
  email: "",
  telefono: "",
  sector: "",
  ciudad: "",
  direccion: "",
  notas: "",
  fuente: "WEB",
  estado: "PROSPECTO",
}

export function ClienteForm({
  open,
  onOpenChange,
  cliente,
  onSuccess,
}: ClienteFormProps) {
  const isEditing = Boolean(cliente)

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  useEffect(() => {
    if (cliente) {
      reset({
        nombreEmpresa: cliente.nombreEmpresa,
        nombreContacto: cliente.nombreContacto || "",
        email: cliente.email,
        telefono: cliente.telefono,
        sector: cliente.sector || "",
        ciudad: cliente.ciudad || "",
        direccion: cliente.direccion || "",
        notas: cliente.notas || "",
        fuente: cliente.fuente,
        estado: cliente.estado,
      })
    } else {
      reset(defaultValues)
    }
  }, [cliente, reset])

  const onSubmit = async (data: FormData) => {
    try {
      const url = isEditing
        ? `/api/clientes/${cliente!.id}`
        : "/api/clientes"
      const method = isEditing ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const result = await res.json()
        throw new Error(result.error || "Error al guardar el cliente")
      }

      toast.success(
        isEditing ? "Cliente actualizado" : "Cliente creado correctamente"
      )
      onSuccess()
      onOpenChange(false)
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Error al guardar el cliente"
      )
    }
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange} swipeDirection="right">
      <DrawerContent className="w-[450px] max-w-full">
        <DrawerHeader>
          <DrawerTitle className="text-base font-extrabold uppercase tracking-wider">
            {isEditing ? "Editar cliente" : "Nuevo cliente"}
          </DrawerTitle>
          <DrawerDescription>
            {isEditing
              ? "Actualiza la información del cliente."
              : "Completa la información para registrar un nuevo cliente."}
          </DrawerDescription>
        </DrawerHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-1 flex-col overflow-hidden"
        >
          <div className="flex-1 space-y-4 overflow-y-auto px-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="nombreEmpresa">
                Nombre empresa <span className="text-error">*</span>
              </Label>
              <Input id="nombreEmpresa" {...register("nombreEmpresa")} />
              {errors.nombreEmpresa && (
                <p className="text-xs text-error">
                  {errors.nombreEmpresa.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="nombreContacto">Nombre contacto</Label>
              <Input id="nombreContacto" {...register("nombreContacto")} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="email">
                  Email <span className="text-error">*</span>
                </Label>
                <Input id="email" type="email" {...register("email")} />
                {errors.email && (
                  <p className="text-xs text-error">{errors.email.message}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="telefono">
                  Teléfono <span className="text-error">*</span>
                </Label>
                <Input id="telefono" {...register("telefono")} />
                {errors.telefono && (
                  <p className="text-xs text-error">
                    {errors.telefono.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="sector">Sector</Label>
                <Controller
                  name="sector"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value || ""}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger id="sector" className="w-full">
                        <SelectValue placeholder="Seleccionar" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Sin sector</SelectItem>
                        {sectorOptions.map((s) => (
                          <SelectItem key={s} value={s}>
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="ciudad">Ciudad</Label>
                <Input id="ciudad" {...register("ciudad")} />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="direccion">Dirección</Label>
              <Textarea id="direccion" {...register("direccion")} rows={2} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="notas">Notas</Label>
              <Textarea id="notas" {...register("notas")} rows={3} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="fuente">Fuente</Label>
                <Controller
                  name="fuente"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger id="fuente" className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="WEB">Web</SelectItem>
                        <SelectItem value="REFERIDO">Referido</SelectItem>
                        <SelectItem value="WHATSAPP">WhatsApp</SelectItem>
                        <SelectItem value="TELEFONO">Teléfono</SelectItem>
                      </SelectContent>
                    </Select>
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
                        <SelectItem value="PROSPECTO">Prospecto</SelectItem>
                        <SelectItem value="ACTIVO">Activo</SelectItem>
                        <SelectItem value="INACTIVO">Inactivo</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
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
                "Guardar cliente"
              )}
            </Button>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  )
}
