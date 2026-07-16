"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Producto } from "@prisma/client"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button, buttonVariants } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { FadeIn } from "@/components/home/fade-in"
import { cn } from "@/lib/utils"
import {
  Loader2,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  ChevronLeft,
  Trash2,
} from "lucide-react"

const tipoEventoOptions = [
  "Concierto",
  "Festival",
  "Feria",
  "Corporativo",
  "Boda",
  "Obra",
  "Otro",
]

const step1Schema = z.object({
  nombre: z.string().min(2, "El nombre es requerido"),
  empresa: z.string().optional(),
  email: z.string().email("Ingresa un correo válido"),
  telefono: z.string().min(7, "El teléfono debe tener al menos 7 dígitos"),
  tipoEvento: z.string().min(1, "El tipo de evento es requerido"),
  fechaEvento: z.string().min(1, "La fecha es requerida"),
  ciudad: z.string().min(2, "La ciudad es requerida"),
  asistentes: z.number().int().optional(),
})

const step3Schema = z.object({
  duracionDias: z.number().int().optional(),
  ubicacionEvento: z.string().optional(),
  notasAdicionales: z.string().optional(),
  aceptaPrivacidad: z.boolean().refine((value) => value === true, {
    message: "Debes aceptar la política de privacidad",
  }),
})

type Step1Data = z.infer<typeof step1Schema>
type Step3Data = z.infer<typeof step3Schema>

interface QuoteItem {
  productoId: string
  cantidad: number
}

interface QuoteWizardProps {
  productos: Producto[]
}

export function QuoteWizard({ productos }: QuoteWizardProps) {
  const [step, setStep] = useState(1)
  const [items, setItems] = useState<QuoteItem[]>([])
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  )
  const [errorMessage, setErrorMessage] = useState("")

  const {
    register: registerStep1,
    handleSubmit: handleSubmitStep1,
    control: controlStep1,
    formState: { errors: errorsStep1 },
  } = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
  })

  const {
    register: registerStep3,
    handleSubmit: handleSubmitStep3,
    control: controlStep3,
    formState: { errors: errorsStep3 },
  } = useForm<Step3Data>({
    resolver: zodResolver(step3Schema),
  })

  const toggleProduct = (productoId: string) => {
    setItems((prev) => {
      const exists = prev.find((i) => i.productoId === productoId)
      if (exists) {
        return prev.filter((i) => i.productoId !== productoId)
      }
      return [...prev, { productoId, cantidad: 1 }]
    })
  }

  const updateQuantity = (productoId: string, cantidad: number) => {
    setItems((prev) =>
      prev.map((i) =>
        i.productoId === productoId ? { ...i, cantidad: Math.max(1, cantidad) } : i
      )
    )
  }

  const removeItem = (productoId: string) => {
    setItems((prev) => prev.filter((i) => i.productoId !== productoId))
  }

  const selectedItems = items
    .map((item) => ({
      ...item,
      producto: productos.find((p) => p.id === item.productoId)!,
    }))
    .filter((item) => item.producto)

  const onSubmitStep1 = () => {
    setStep(2)
  }

  const onSubmitStep2 = () => {
    if (items.length === 0) {
      setErrorMessage("Selecciona al menos un producto")
      return
    }
    setErrorMessage("")
    setStep(3)
  }

  const onSubmitStep3 = async (data: Step3Data) => {
    setStatus("loading")
    setErrorMessage("")

    const step1Data = {} as Step1Data // Will be gathered from form
    const formValues = document.forms.namedItem("quote-form") as HTMLFormElement
    if (formValues) {
      const fd = new FormData(formValues)
      Object.assign(step1Data, {
        nombre: fd.get("nombre"),
        empresa: fd.get("empresa") || undefined,
        email: fd.get("email"),
        telefono: fd.get("telefono"),
        tipoEvento: fd.get("tipoEvento"),
        fechaEvento: fd.get("fechaEvento"),
        ciudad: fd.get("ciudad"),
        asistentes: fd.get("asistentes")
          ? Number(fd.get("asistentes"))
          : undefined,
      })
    }

    try {
      const response = await fetch("/api/cotizacion-publica", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...step1Data,
          duracionDias: data.duracionDias,
          ubicacionEvento: data.ubicacionEvento,
          notasAdicionales: data.notasAdicionales,
          items,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || "Error al enviar la cotización")
      }

      setStatus("success")
    } catch (error) {
      setStatus("error")
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Hubo un error. Por favor intenta de nuevo o contáctanos por WhatsApp."
      )
    }
  }

  if (status === "success") {
    return (
      <section className="container mx-auto px-4 py-24 lg:px-6">
        <FadeIn>
          <Card className="mx-auto max-w-2xl border-border-subtle bg-white shadow-lg">
            <CardContent className="p-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success-bg text-success">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h2 className="text-2xl font-bold text-dark">
                ¡Gracias por tu solicitud!
              </h2>
              <p className="mt-3 text-body">
                Tu solicitud ha sido enviada. Te contactaremos en menos de 24
                horas.
              </p>
              <Link href="/" className={cn(buttonVariants(), "mt-6")}>
                Volver al inicio
              </Link>
            </CardContent>
          </Card>
        </FadeIn>
      </section>
    )
  }

  return (
    <section className="container mx-auto px-4 py-24 lg:px-6">
      <FadeIn className="mb-8 text-center">
        <h1 className="text-3xl font-extrabold text-dark md:text-4xl">
          Solicitar Cotización
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-body">
          Completa el formulario en 3 pasos y recibe una propuesta personalizada
        </p>
      </FadeIn>

      <FadeIn delay={0.1}>
        <Card className="mx-auto max-w-5xl border-border-subtle bg-white shadow-lg">
          <CardContent className="p-6 md:p-8">
            {/* Step indicator */}
            <div className="mb-8 flex items-center justify-center gap-2">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold",
                    step >= s
                      ? "bg-primary text-white"
                      : "bg-bg-light text-muted"
                  )}
                >
                  {s}
                </div>
              ))}
            </div>

            <form id="quote-form" onSubmit={(e) => e.preventDefault()}>
              {step === 1 && (
                <div className="space-y-5">
                  <h2 className="text-xl font-bold text-dark">
                    Paso 1: Datos de contacto
                  </h2>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="nombre">Nombre completo *</Label>
                      <Input
                        id="nombre"
                        {...registerStep1("nombre")}
                        aria-invalid={errorsStep1.nombre ? "true" : "false"}
                      />
                      {errorsStep1.nombre && (
                        <p className="text-xs text-error">
                          {errorsStep1.nombre.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="empresa">Empresa</Label>
                      <Input id="empresa" {...registerStep1("empresa")} />
                    </div>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        {...registerStep1("email")}
                        aria-invalid={errorsStep1.email ? "true" : "false"}
                      />
                      {errorsStep1.email && (
                        <p className="text-xs text-error">
                          {errorsStep1.email.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="telefono">Teléfono *</Label>
                      <Input
                        id="telefono"
                        type="tel"
                        {...registerStep1("telefono")}
                        aria-invalid={errorsStep1.telefono ? "true" : "false"}
                      />
                      {errorsStep1.telefono && (
                        <p className="text-xs text-error">
                          {errorsStep1.telefono.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="tipoEvento">Tipo de evento *</Label>
                      <Controller
                        name="tipoEvento"
                        control={controlStep1}
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger id="tipoEvento" className="w-full">
                              <SelectValue placeholder="Selecciona" />
                            </SelectTrigger>
                            <SelectContent>
                              {tipoEventoOptions.map((option) => (
                                <SelectItem key={option} value={option}>
                                  {option}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errorsStep1.tipoEvento && (
                        <p className="text-xs text-error">
                          {errorsStep1.tipoEvento.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fechaEvento">Fecha del evento *</Label>
                      <Input
                        id="fechaEvento"
                        type="date"
                        {...registerStep1("fechaEvento")}
                        aria-invalid={errorsStep1.fechaEvento ? "true" : "false"}
                      />
                      {errorsStep1.fechaEvento && (
                        <p className="text-xs text-error">
                          {errorsStep1.fechaEvento.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="ciudad">Ciudad *</Label>
                      <Input
                        id="ciudad"
                        {...registerStep1("ciudad")}
                        aria-invalid={errorsStep1.ciudad ? "true" : "false"}
                      />
                      {errorsStep1.ciudad && (
                        <p className="text-xs text-error">
                          {errorsStep1.ciudad.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="asistentes">
                        Número aproximado de asistentes
                      </Label>
                      <Input
                        id="asistentes"
                        type="number"
                        {...registerStep1("asistentes", { valueAsNumber: true })}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <Button
                      type="button"
                      onClick={handleSubmitStep1(onSubmitStep1)}
                    >
                      Siguiente
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-5">
                  <h2 className="text-xl font-bold text-dark">
                    Paso 2: Selección de productos
                  </h2>

                  {errorMessage && (
                    <div className="flex items-start gap-2 rounded-lg bg-error-bg p-3 text-sm text-error">
                      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                      {errorMessage}
                    </div>
                  )}

                  <div className="grid gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-2">
                      <div className="grid gap-4 sm:grid-cols-2">
                        {productos.map((producto) => {
                          const selected = items.find(
                            (i) => i.productoId === producto.id
                          )
                          return (
                            <div
                              key={producto.id}
                              className={cn(
                                "relative cursor-pointer rounded-xl border-2 p-4 transition-all",
                                selected
                                  ? "border-primary bg-primary-light/30"
                                  : "border-border bg-white hover:border-primary/50"
                              )}
                              onClick={() => toggleProduct(producto.id)}
                            >
                              <div className="flex items-start gap-3">
                                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-bg-light">
                                  <Image
                                    src={producto.imagenPrincipal}
                                    alt={producto.nombre}
                                    fill
                                    className="object-cover"
                                    sizes="64px"
                                    loading="lazy"
                                  />
                                </div>
                                <div className="flex-1">
                                  <h3 className="font-semibold text-dark">
                                    {producto.nombre}
                                  </h3>
                                  <p className="text-xs text-body">
                                    {producto.descripcionCorta}
                                  </p>
                                </div>
                                <Checkbox checked={!!selected} />
                              </div>
                              {selected && (
                                <div
                                  className="mt-3 flex items-center gap-2"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <Label
                                    htmlFor={`cantidad-${producto.id}`}
                                    className="text-xs"
                                  >
                                    Cantidad
                                  </Label>
                                  <Input
                                    id={`cantidad-${producto.id}`}
                                    type="number"
                                    min={1}
                                    value={selected.cantidad}
                                    onChange={(e) =>
                                      updateQuantity(
                                        producto.id,
                                        Number(e.target.value)
                                      )
                                    }
                                    className="w-20"
                                  />
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    <div className="rounded-xl border border-border-subtle bg-bg-light p-4">
                      <h3 className="font-bold text-dark">Resumen</h3>
                      {selectedItems.length === 0 ? (
                        <p className="mt-2 text-sm text-muted">
                          Selecciona al menos un producto
                        </p>
                      ) : (
                        <ul className="mt-3 space-y-2">
                          {selectedItems.map((item) => (
                            <li
                              key={item.productoId}
                              className="flex items-center justify-between text-sm"
                            >
                              <span className="text-body">
                                {item.producto.nombre} x{item.cantidad}
                              </span>
                              <button
                                type="button"
                                onClick={() => removeItem(item.productoId)}
                                className="text-muted hover:text-error"
                                aria-label="Eliminar"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep(1)}
                    >
                      <ChevronLeft className="mr-2 h-4 w-4" />
                      Anterior
                    </Button>
                    <Button type="button" onClick={onSubmitStep2}>
                      Siguiente
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-5">
                  <h2 className="text-xl font-bold text-dark">
                    Paso 3: Detalles y envío
                  </h2>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="duracionDias">
                        Duración del evento (días)
                      </Label>
                      <Input
                        id="duracionDias"
                        type="number"
                        min={1}
                        {...registerStep3("duracionDias", {
                          valueAsNumber: true,
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ubicacionEvento">
                        Ubicación / dirección
                      </Label>
                      <Input
                        id="ubicacionEvento"
                        {...registerStep3("ubicacionEvento")}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notasAdicionales">Notas adicionales</Label>
                    <Textarea
                      id="notasAdicionales"
                      rows={4}
                      {...registerStep3("notasAdicionales")}
                    />
                  </div>

                  <div className="flex items-start gap-3">
                    <Controller
                      name="aceptaPrivacidad"
                      control={controlStep3}
                      render={({ field }) => (
                        <Checkbox
                          id="aceptaPrivacidad"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      )}
                    />
                    <div>
                      <Label htmlFor="aceptaPrivacidad" className="font-normal">
                        Acepto la{" "}
                        <Link
                          href="/privacidad"
                          className="font-semibold text-primary hover:underline"
                        >
                          política de privacidad
                        </Link>
                      </Label>
                      {errorsStep3.aceptaPrivacidad && (
                        <p className="text-xs text-error">
                          {errorsStep3.aceptaPrivacidad.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {status === "error" && (
                    <div className="flex items-start gap-2 rounded-lg bg-error-bg p-3 text-sm text-error">
                      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                      {errorMessage}
                    </div>
                  )}

                  <div className="flex justify-between pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep(2)}
                      disabled={status === "loading"}
                    >
                      <ChevronLeft className="mr-2 h-4 w-4" />
                      Anterior
                    </Button>
                    <Button
                      type="button"
                      onClick={handleSubmitStep3(onSubmitStep3)}
                      disabled={status === "loading"}
                    >
                      {status === "loading" && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Enviar cotización
                    </Button>
                  </div>
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </FadeIn>
    </section>
  )
}
