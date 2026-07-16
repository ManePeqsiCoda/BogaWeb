"use client"

import { useEffect } from "react"
import { useForm, Controller, type Resolver } from "react-hook-form"
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

const formSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio"),
  fecha: z.string().min(1, "La fecha es obligatoria"),
  horaInicio: z.string().optional().nullable(),
  horaFin: z.string().optional().nullable(),
  ubicacion: z.string().min(1, "La ubicación es obligatoria"),
  tipoEvento: z.string().optional().nullable(),
  numeroInvitados: z.preprocess(
    (val) => {
      if (val === "" || val === null || val === undefined) return null
      const num = Number(val)
      return Number.isNaN(num) ? null : num
    },
    z.number().int().nonnegative().nullable().optional()
  ),
  clienteId: z.string().min(1, "El cliente es obligatorio"),
  contactoNombre: z.string().optional().nullable(),
  contactoTelefono: z.string().optional().nullable(),
  contactoEmail: z.string().email().optional().nullable().or(z.literal("")),
  notas: z.string().optional().nullable(),
  estado: z.enum(["PENDIENTE", "CONFIRMADO", "CANCELADO", "COMPLETADO"]),
})

type FormData = z.infer<typeof formSchema>

interface ClienteOption {
  id: string
  nombreEmpresa: string
}

interface EventoFormData {
  id: string
  nombre: string
  fecha: string | Date
  horaInicio: string | null
  horaFin: string | null
  ubicacion: string
  tipoEvento: string | null
  numeroInvitados: number | null
  clienteId: string
  contactoNombre: string | null
  contactoTelefono: string | null
  contactoEmail: string | null
  notas: string | null
  estado: "PENDIENTE" | "CONFIRMADO" | "CANCELADO" | "COMPLETADO"
  cliente?: ClienteOption
}

interface EventoFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  evento: EventoFormData | null
  clientes: ClienteOption[]
  onSuccess: () => void
}

const defaultValues: FormData = {
  nombre: "",
  fecha: "",
  horaInicio: "",
  horaFin: "",
  ubicacion: "",
  tipoEvento: "",
  numeroInvitados: null,
  clienteId: "",
  contactoNombre: "",
  contactoTelefono: "",
  contactoEmail: "",
  notas: "",
  estado: "PENDIENTE",
}

function formatDateInput(value: string | Date | null | undefined) {
  if (!value) return ""
  const d = typeof value === "string" ? new Date(value) : value
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

export function EventoForm({
  open,
  onOpenChange,
  evento,
  clientes,
  onSuccess,
}: EventoFormProps) {
  const isEditing = Boolean(evento)

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema) as Resolver<FormData>,
    defaultValues,
  })

  useEffect(() => {
    if (evento) {
      reset({
        nombre: evento.nombre,
        fecha: formatDateInput(evento.fecha),
        horaInicio: evento.horaInicio || "",
        horaFin: evento.horaFin || "",
        ubicacion: evento.ubicacion,
        tipoEvento: evento.tipoEvento || "",
        numeroInvitados: evento.numeroInvitados,
        clienteId: evento.clienteId,
        contactoNombre: evento.contactoNombre || "",
        contactoTelefono: evento.contactoTelefono || "",
        contactoEmail: evento.contactoEmail || "",
        notas: evento.notas || "",
        estado: evento.estado,
      })
    } else {
      reset(defaultValues)
    }
  }, [evento, reset])

  const onSubmit = async (data: FormData) => {
    try {
      const payload = {
        ...data,
        tipoEvento: data.tipoEvento?.trim() || null,
        contactoNombre: data.contactoNombre?.trim() || null,
        contactoTelefono: data.contactoTelefono?.trim() || null,
        contactoEmail: data.contactoEmail?.trim() || null,
        notas: data.notas?.trim() || null,
        horaInicio: data.horaInicio || null,
        horaFin: data.horaFin || null,
      }

      const url = isEditing ? `/api/eventos/${evento!.id}` : "/api/eventos"
      const method = isEditing ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const result = await response.json()
        throw new Error(result.error || "Error al guardar el evento")
      }

      toast.success(
        isEditing ? "Evento actualizado correctamente" : "Evento creado correctamente"
      )
      onSuccess()
      onOpenChange(false)
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Error al guardar el evento"
      )
    }
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange} swipeDirection="right">
      <DrawerContent className="w-[450px] max-w-full">
        <DrawerHeader>
          <DrawerTitle className="text-base font-extrabold uppercase tracking-wider">
            {isEditing ? "Editar evento" : "Nuevo evento"}
          </DrawerTitle>
          <DrawerDescription>
            {isEditing
              ? "Actualiza los datos del evento."
              : "Registra un nuevo evento en el sistema."}
          </DrawerDescription>
        </DrawerHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 p-6">
          <div className="space-y-2">
            <Label htmlFor="clienteId" className="text-xs font-bold uppercase">
              Cliente <span className="text-destructive">*</span>
            </Label>
            <Controller
              name="clienteId"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value || undefined}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccionar cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {clientes.map((cliente) => (
                      <SelectItem key={cliente.id} value={cliente.id}>
                        {cliente.nombreEmpresa}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.clienteId && (
              <p className="text-xs text-destructive">
                {errors.clienteId.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="nombre" className="text-xs font-bold uppercase">
              Nombre del evento <span className="text-destructive">*</span>
            </Label>
            <Input id="nombre" {...register("nombre")} />
            {errors.nombre && (
              <p className="text-xs text-destructive">{errors.nombre.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fecha" className="text-xs font-bold uppercase">
                Fecha <span className="text-destructive">*</span>
              </Label>
              <Input id="fecha" type="date" {...register("fecha")} />
              {errors.fecha && (
                <p className="text-xs text-destructive">{errors.fecha.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="estado" className="text-xs font-bold uppercase">
                Estado <span className="text-destructive">*</span>
              </Label>
              <Controller
                name="estado"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PENDIENTE">Pendiente</SelectItem>
                      <SelectItem value="CONFIRMADO">Confirmado</SelectItem>
                      <SelectItem value="COMPLETADO">Completado</SelectItem>
                      <SelectItem value="CANCELADO">Cancelado</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="horaInicio" className="text-xs font-bold uppercase">
                Hora inicio
              </Label>
              <Input id="horaInicio" type="time" {...register("horaInicio")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="horaFin" className="text-xs font-bold uppercase">
                Hora fin
              </Label>
              <Input id="horaFin" type="time" {...register("horaFin")} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="ubicacion" className="text-xs font-bold uppercase">
              Ubicación <span className="text-destructive">*</span>
            </Label>
            <Input id="ubicacion" {...register("ubicacion")} />
            {errors.ubicacion && (
              <p className="text-xs text-destructive">
                {errors.ubicacion.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tipoEvento" className="text-xs font-bold uppercase">
                Tipo de evento
              </Label>
              <Input
                id="tipoEvento"
                placeholder="Ej. Boda corporativa"
                {...register("tipoEvento")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="numeroInvitados" className="text-xs font-bold uppercase">
                Invitados
              </Label>
              <Input
                id="numeroInvitados"
                type="number"
                min={0}
                {...register("numeroInvitados")}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contactoNombre" className="text-xs font-bold uppercase">
                Contacto evento
              </Label>
              <Input id="contactoNombre" {...register("contactoNombre")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactoTelefono" className="text-xs font-bold uppercase">
                Teléfono contacto
              </Label>
              <Input id="contactoTelefono" {...register("contactoTelefono")} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactoEmail" className="text-xs font-bold uppercase">
              Email contacto
            </Label>
            <Input id="contactoEmail" type="email" {...register("contactoEmail")} />
            {errors.contactoEmail && (
              <p className="text-xs text-destructive">
                {errors.contactoEmail.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notas" className="text-xs font-bold uppercase">
              Notas
            </Label>
            <Textarea id="notas" rows={3} {...register("notas")} />
          </div>

          <DrawerFooter className="px-0 pt-2">
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <DrawerClose render={<Button type="button" variant="outline" className="w-full sm:w-auto">Cancelar</Button>} />
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary font-semibold text-primary-foreground hover:bg-primary-hover sm:w-auto"
              >
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isEditing ? "Guardar cambios" : "Crear evento"}
              </Button>
            </div>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  )
}
