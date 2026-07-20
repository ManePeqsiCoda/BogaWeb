"use client"

import { useRef, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { differenceInCalendarDays, parseISO } from "date-fns"
import type { Producto } from "@/lib/mocks"
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
import { DateRangePicker } from "@/components/ui/date-range-picker"
import { FadeIn } from "@/components/home/fade-in"
import { PageHero } from "@/components/brand/page-hero"
import { BogaCircles } from "@/components/brand/boga-circles"
import { cn } from "@/lib/utils"
import {
  Loader2,
  CheckCircle2,
  Check,
  AlertCircle,
  ChevronRight,
  ChevronLeft,
  Trash2,
  MessageCircle,
  Percent,
} from "lucide-react"
import { siteConfig } from "@/lib/site"
import {
  calcularCarritoPublico,
  BUNDLE_DISCOUNT_RATE,
  isBundleTrigger,
} from "@/lib/cotizador/public-pricing"
import {
  PriceDisplay,
  PriceVisibilityToggle,
} from "@/components/pricing/price-visibility"

const tipoEventoOptions = [
  "Concierto",
  "Festival",
  "Feria",
  "Corporativo",
  "Boda",
  "Obra",
  "Otro",
]

const detailsSchema = z
  .object({
    tipoEvento: z.string().min(1, "Selecciona un tipo de evento"),
    fechaEvento: z.string().min(1, "Selecciona la fecha de inicio"),
    fechaFinEvento: z.string().min(1, "Selecciona la fecha de fin"),
    duracionDias: z.number().int().optional(),
    ubicacionEvento: z.string().optional(),
    notasAdicionales: z.string().optional(),
  })
  .refine(
    (data) =>
      !data.fechaEvento ||
      !data.fechaFinEvento ||
      data.fechaFinEvento >= data.fechaEvento,
    {
      message: "La fecha de fin debe ser igual o posterior al inicio",
      path: ["fechaFinEvento"],
    }
  )

const contactSchema = z.object({
  nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  empresa: z.string().optional(),
  email: z.string().email("Ingresa un correo electrónico válido"),
  telefono: z.string().min(7, "El teléfono debe tener al menos 7 dígitos"),
  ciudad: z.string().min(2, "Indica la ciudad"),
  asistentes: z.number().int().optional(),
  aceptaPrivacidad: z.boolean().refine((value) => value === true, {
    message: "Debes aceptar la política de privacidad",
  }),
})

type DetailsData = z.infer<typeof detailsSchema>
type ContactData = z.infer<typeof contactSchema>

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
  const [successRef, setSuccessRef] = useState("")
  const [whatsappUrl, setWhatsappUrl] = useState("")
  const formTopRef = useRef<HTMLDivElement>(null)

  const goToStep = (next: number) => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur()
    }
    setStep(next)
    requestAnimationFrame(() => {
      formTopRef.current?.scrollIntoView({ behavior: "auto", block: "start" })
    })
  }

  const {
    register: registerDetails,
    handleSubmit: handleSubmitDetails,
    getValues: getDetailsValues,
    setValue: setDetailsValue,
    control: controlDetails,
    watch: watchDetails,
    formState: { errors: errorsDetails },
  } = useForm<DetailsData>({
    resolver: zodResolver(detailsSchema),
    defaultValues: {
      tipoEvento: "",
      fechaEvento: "",
      fechaFinEvento: "",
      duracionDias: undefined,
      ubicacionEvento: "",
      notasAdicionales: "",
    },
  })

  const {
    register: registerContact,
    handleSubmit: handleSubmitContact,
    control: controlContact,
    formState: { errors: errorsContact },
  } = useForm<ContactData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      nombre: "",
      empresa: "",
      email: "",
      telefono: "",
      ciudad: "",
      asistentes: undefined,
      aceptaPrivacidad: false,
    },
  })

  const fechaEvento = watchDetails("fechaEvento")
  const fechaFinEvento = watchDetails("fechaFinEvento")

  const syncDurationFromRange = (from?: string, to?: string) => {
    if (!from || !to) return
    const days = differenceInCalendarDays(parseISO(to), parseISO(from)) + 1
    if (days > 0) {
      setDetailsValue("duracionDias", days, { shouldDirty: true })
    }
  }

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

  const cartTotals = calcularCarritoPublico(selectedItems)
  const discountPct = Math.round(BUNDLE_DISCOUNT_RATE * 100)

  const onSubmitStep1 = () => {
    if (items.length === 0) {
      setErrorMessage("Selecciona al menos un producto")
      return
    }
    setErrorMessage("")
    goToStep(2)
  }

  const onSubmitStep2 = () => {
    goToStep(3)
  }

  const onSubmitStep3 = async (contact: ContactData) => {
    setStatus("loading")
    setErrorMessage("")

    const details = getDetailsValues()

    try {
      const { addSolicitud, generateId } = await import(
        "@/lib/cotizador/storage"
      )
      const referencia = generateId("sol")
      const productosSeleccionados = items
        .map((i) => {
          const producto = productos.find((p) => p.id === i.productoId)
          if (!producto) return null
          return { nombre: producto.nombre, cantidad: i.cantidad }
        })
        .filter((p): p is { nombre: string; cantidad: number } => !!p)

      const payload = {
        referencia,
        nombre: contact.nombre,
        empresa: contact.empresa || undefined,
        email: contact.email,
        telefono: contact.telefono,
        ciudad: contact.ciudad,
        tipoEvento: details.tipoEvento,
        fechaEvento: details.fechaEvento,
        fechaFinEvento: details.fechaFinEvento || undefined,
        duracionDias: details.duracionDias,
        ubicacion: details.ubicacionEvento || undefined,
        asistentes:
          contact.asistentes != null ? String(contact.asistentes) : undefined,
        productos: productosSeleccionados,
        notas: details.notasAdicionales || undefined,
      }

      const response = await fetch("/api/cotizacion/enviar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const result = (await response.json()) as {
        ok: boolean
        whatsappUrl?: string
        emailSent?: boolean
        emailSkippedReason?: string
        error?: string
      }

      if (!response.ok || !result.ok) {
        throw new Error(result.error || "No pudimos enviar la cotización")
      }

      addSolicitud({
        id: referencia,
        fullName: contact.nombre,
        company: contact.empresa,
        email: contact.email,
        phone: contact.telefono,
        eventType: details.tipoEvento,
        eventDate: details.fechaFinEvento
          ? `${details.fechaEvento} → ${details.fechaFinEvento}`
          : details.fechaEvento,
        city: contact.ciudad,
        attendees:
          contact.asistentes != null ? String(contact.asistentes) : undefined,
        productSlugs: items
          .map((i) => productos.find((p) => p.id === i.productoId)?.slug)
          .filter((s): s is string => !!s),
        notes: [
          details.ubicacionEvento
            ? `Ubicación: ${details.ubicacionEvento}`
            : null,
          details.fechaEvento && details.fechaFinEvento
            ? `Fechas: ${details.fechaEvento} → ${details.fechaFinEvento}`
            : null,
          details.duracionDias
            ? `Duración: ${details.duracionDias} días`
            : null,
          details.notasAdicionales || null,
        ]
          .filter(Boolean)
          .join(" · ") || undefined,
        estado: "nueva",
        recibidoEn: new Date().toISOString(),
      })

      const waUrl =
        result.whatsappUrl ||
        `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(
          `Hola, ¿cómo estás? Te escribo por una cotización. Esta es la referencia: ${referencia}`
        )}`

      setSuccessRef(referencia)
      setWhatsappUrl(waUrl)
      setStatus("success")

      toast.success("Ya recibimos tu cotización", {
        description: `Referencia ${referencia}. ${
          result.emailSent
            ? "Te enviamos un resumen a tu correo."
            : "Te contactaremos en menos de 24 horas."
        }`,
        duration: 20000,
        action: {
          label: "WhatsApp",
          onClick: () => {
            window.open(waUrl, "_blank", "noopener,noreferrer")
          },
        },
      })
    } catch (error) {
      setStatus("error")
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Hubo un error. Por favor intenta de nuevo o contáctanos por WhatsApp."
      )
      toast.error("No pudimos enviar tu solicitud", {
        description: "Intenta de nuevo o contáctanos por WhatsApp.",
      })
    }
  }

  if (status === "success") {
    return (
      <section className="container mx-auto px-4 py-24 lg:px-6">
        <FadeIn>
          <Card className="mx-auto max-w-2xl border-boga-border-subtle bg-boga-surface-elevated shadow-boga-4">
            <CardContent className="p-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-boga-success-50 text-boga-success-600">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h2 className="text-2xl font-bold text-boga-text-primary">
                ¡Ya recibimos tu cotización!
              </h2>
              <p className="mt-3 text-boga-text-secondary">
                Te enviamos un resumen a tu correo. Nos pondremos en contacto en
                menos de 24 horas.
              </p>
              {successRef && (
                <div className="mx-auto mt-5 max-w-sm rounded-xl border border-boga-electric-200 bg-boga-electric-50 px-4 py-3">
                  <p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-boga-electric-600">
                    Número de referencia
                  </p>
                  <p className="mt-1 font-mono text-lg font-bold text-boga-text-primary">
                    {successRef}
                  </p>
                </div>
              )}
              <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    buttonVariants(),
                    "inline-flex items-center gap-2 bg-[#25D366] text-white hover:bg-[#1ebe57]"
                  )}
                >
                  <MessageCircle className="h-4 w-4" />
                  Continuar en WhatsApp
                </a>
                <Link
                  href="/"
                  className={cn(buttonVariants({ variant: "outline" }))}
                >
                  Volver al inicio
                </Link>
              </div>
            </CardContent>
          </Card>
        </FadeIn>
      </section>
    )
  }

  return (
    <>
      <PageHero
        overline="Cotización"
        title="Solicitar Cotización"
        description="Completa el formulario en 3 pasos y recibe una propuesta personalizada"
      />
      <section className="container-boga relative z-10 -mt-8 pb-24">
        <FadeIn delay={0.1}>
          <Card className="mx-auto max-w-5xl border-boga-border-subtle bg-boga-surface-elevated shadow-boga-4">
            <CardContent className="p-6 md:p-8">
              <div ref={formTopRef} className="scroll-mt-24" />
              <div className="mb-6 flex justify-center">
                <BogaCircles size="m" tone="electric" />
              </div>
              <StepIndicator currentStep={step} totalSteps={3} />

              <form id="quote-form" onSubmit={(e) => e.preventDefault()}>
                {step === 1 && (
                  <div className="space-y-5">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h2 className="text-xl font-bold text-boga-text-primary">
                          Paso 1: Selección de productos
                        </h2>
                        <p className="mt-1 text-sm text-boga-text-tertiary">
                          VIP, discapacitados o trailer de lujo activan{" "}
                          {discountPct}% off en todo el carrito (sin acumular).
                        </p>
                      </div>
                      <PriceVisibilityToggle showLabel size="sm" />
                    </div>

                    {errorMessage && (
                      <div className="flex items-start gap-2 rounded-lg bg-boga-error-50 p-3 text-sm text-boga-error-500">
                        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                        {errorMessage}
                      </div>
                    )}

                    {cartTotals.hasBundleTrigger && (
                      <div className="flex items-start gap-2 rounded-lg border border-boga-lima-500/40 bg-boga-lima-500/15 px-3 py-2 text-sm text-boga-text-primary">
                        <Percent className="mt-0.5 h-4 w-4 shrink-0 text-boga-lima-500" />
                        <span>
                          Bundle activo:{" "}
                          <strong className="text-boga-lima-500">
                            {discountPct}% de descuento
                          </strong>{" "}
                          en todo el carrito. Si hay más de un producto ancla
                          (VIP, discapacitados o trailer), el descuento no se
                          acumula.
                        </span>
                      </div>
                    )}

                    <div className="grid gap-6 lg:grid-cols-3">
                      <div className="lg:col-span-2">
                        <div className="grid gap-4 sm:grid-cols-2">
                          {productos.map((producto) => {
                            const selected = items.find(
                              (i) => i.productoId === producto.id
                            )
                            const line = cartTotals.lines.find(
                              (l) => l.productoId === producto.id
                            )
                            const showDiscountPreview =
                              cartTotals.hasBundleTrigger
                            const unitLista = producto.precioBase ?? 0
                            const unitFinal = showDiscountPreview
                              ? Math.round(
                                  unitLista * (1 - BUNDLE_DISCOUNT_RATE)
                                )
                              : unitLista
                            return (
                              <div
                                key={producto.id}
                                className={cn(
                                  "relative cursor-pointer rounded-xl border-2 p-4 transition-all",
                                  selected
                                    ? "border-boga-electric-500 bg-boga-electric-50/30"
                                    : "border-boga-border-default bg-boga-surface-elevated hover:border-boga-electric-500/50"
                                )}
                                onClick={() => toggleProduct(producto.id)}
                              >
                                <div className="flex items-start gap-3">
                                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-boga-surface-muted">
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
                                    <h3 className="font-semibold text-boga-text-primary">
                                      {producto.nombre}
                                    </h3>
                                    <p className="text-xs text-boga-text-secondary">
                                      {producto.descripcionCorta}
                                    </p>
                                    <div className="mt-1.5">
                                      <PriceDisplay
                                        amount={
                                          selected && line
                                            ? line.precioUnitarioFinal
                                            : unitFinal
                                        }
                                        compareAt={
                                          showDiscountPreview
                                            ? unitLista
                                            : undefined
                                        }
                                        unidadMedida={producto.unidadMedida}
                                        size="sm"
                                      />
                                    </div>
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

                      <div className="rounded-xl border border-boga-border-subtle bg-boga-surface-muted p-4">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="font-bold text-boga-text-primary">
                            Resumen
                          </h3>
                          <PriceVisibilityToggle size="sm" />
                        </div>
                        {selectedItems.length === 0 ? (
                          <p className="mt-2 text-sm text-boga-text-tertiary">
                            Selecciona al menos un producto
                          </p>
                        ) : (
                          <>
                            <ul className="mt-3 space-y-3">
                              {cartTotals.lines.map((line) => (
                                <li
                                  key={line.productoId}
                                  className="flex items-start justify-between gap-2 text-sm"
                                >
                                  <div className="min-w-0">
                                    <p className="text-boga-text-secondary">
                                      {line.nombre}{" "}
                                      <span className="text-boga-text-tertiary">
                                        ×{line.cantidad}
                                      </span>
                                    </p>
                                    {line.aplicaDescuento && (
                                      <p className="text-[11px] font-medium text-boga-electric-500">
                                        −{discountPct}% bundle
                                      </p>
                                    )}
                                    <PriceDisplay
                                      amount={line.subtotalFinal}
                                      compareAt={
                                        line.aplicaDescuento
                                          ? line.subtotalLista
                                          : undefined
                                      }
                                      size="sm"
                                    />
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => removeItem(line.productoId)}
                                    className="shrink-0 text-boga-text-tertiary hover:text-boga-error-500"
                                    aria-label="Eliminar"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </li>
                              ))}
                            </ul>
                            <div className="mt-4 space-y-1 border-t border-boga-border-subtle pt-3 text-sm">
                              {cartTotals.descuentoTotal > 0 && (
                                <div className="flex items-baseline justify-between gap-2 text-boga-text-secondary">
                                  <span>Descuento bundle (−{discountPct}%)</span>
                                  <span className="inline-flex items-baseline gap-0.5 font-medium text-boga-electric-500">
                                    <span aria-hidden>−</span>
                                    <PriceDisplay
                                      amount={cartTotals.descuentoTotal}
                                      size="sm"
                                    />
                                  </span>
                                </div>
                              )}
                              <div className="flex items-center justify-between font-semibold text-boga-text-primary">
                                <span>Total estimado</span>
                                <PriceDisplay
                                  amount={cartTotals.total}
                                  size="md"
                                />
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-end pt-4">
                      <Button type="button" onClick={onSubmitStep1}>
                        Siguiente
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-5">
                    <h2 className="text-xl font-bold text-boga-text-primary">
                      Paso 2: Detalles del evento
                    </h2>

                    <div className="space-y-2">
                      <Label htmlFor="tipoEvento">Tipo de evento *</Label>
                      <Controller
                        name="tipoEvento"
                        control={controlDetails}
                        render={({ field }) => (
                          <Select
                            value={field.value || undefined}
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
                      {errorsDetails.tipoEvento && (
                        <p
                          className="flex items-center gap-1 text-xs text-boga-error-500"
                          role="alert"
                        >
                          <AlertCircle className="h-3 w-3" aria-hidden="true" />
                          {errorsDetails.tipoEvento.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="fechaEvento">
                        Fechas del evento *{" "}
                        <span className="font-normal text-muted-foreground">
                          (inicio → fin)
                        </span>
                      </Label>
                      <DateRangePicker
                        id="fechaEvento"
                        value={{
                          from: fechaEvento || undefined,
                          to: fechaFinEvento || undefined,
                        }}
                        onChange={(range) => {
                          setDetailsValue("fechaEvento", range.from ?? "", {
                            shouldValidate: Boolean(range.from && range.to),
                            shouldDirty: true,
                          })
                          setDetailsValue(
                            "fechaFinEvento",
                            range.to ?? "",
                            {
                              shouldValidate: Boolean(range.from && range.to),
                              shouldDirty: true,
                            }
                          )
                          syncDurationFromRange(range.from, range.to)
                        }}
                        aria-invalid={
                          errorsDetails.fechaEvento ||
                          errorsDetails.fechaFinEvento
                            ? "true"
                            : "false"
                        }
                      />
                      {(errorsDetails.fechaEvento ||
                        errorsDetails.fechaFinEvento) && (
                        <p
                          className="flex items-center gap-1 text-xs text-boga-error-500"
                          role="alert"
                        >
                          <AlertCircle className="h-3 w-3" aria-hidden="true" />
                          {errorsDetails.fechaEvento?.message ||
                            errorsDetails.fechaFinEvento?.message}
                        </p>
                      )}
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="duracionDias">
                          Duración del evento (días)
                        </Label>
                        <Input
                          id="duracionDias"
                          type="number"
                          min={1}
                          {...registerDetails("duracionDias", {
                            valueAsNumber: true,
                          })}
                        />
                        <p className="text-xs text-muted-foreground">
                          Se actualiza automáticamente con las fechas elegidas.
                        </p>
                        {errorsDetails.duracionDias && (
                          <p
                            className="flex items-center gap-1 text-xs text-boga-error-500"
                            role="alert"
                          >
                            <AlertCircle className="h-3 w-3" aria-hidden="true" />
                            {errorsDetails.duracionDias.message}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="ubicacionEvento">
                          Ubicación / dirección
                        </Label>
                        <Input
                          id="ubicacionEvento"
                          {...registerDetails("ubicacionEvento")}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="notasAdicionales">Notas adicionales</Label>
                      <Textarea
                        id="notasAdicionales"
                        rows={4}
                        {...registerDetails("notasAdicionales")}
                      />
                    </div>

                    <div className="flex justify-between pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => goToStep(1)}
                      >
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        Anterior
                      </Button>
                      <Button
                        type="button"
                        onClick={handleSubmitDetails(onSubmitStep2)}
                      >
                        Siguiente
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-5">
                    <h2 className="text-xl font-bold text-boga-text-primary">
                      Paso 3: Datos de contacto
                    </h2>
                    <div className="grid gap-5 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="nombre">Nombre completo *</Label>
                        <Input
                          id="nombre"
                          {...registerContact("nombre")}
                          aria-invalid={errorsContact.nombre ? "true" : "false"}
                        />
                        {errorsContact.nombre && (
                          <p
                            className="flex items-center gap-1 text-xs text-boga-error-500"
                            role="alert"
                          >
                            <AlertCircle className="h-3 w-3" aria-hidden="true" />
                            {errorsContact.nombre.message}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="empresa">Empresa</Label>
                        <Input id="empresa" {...registerContact("empresa")} />
                      </div>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          {...registerContact("email")}
                          aria-invalid={errorsContact.email ? "true" : "false"}
                        />
                        {errorsContact.email && (
                          <p
                            className="flex items-center gap-1 text-xs text-boga-error-500"
                            role="alert"
                          >
                            <AlertCircle className="h-3 w-3" aria-hidden="true" />
                            {errorsContact.email.message}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="telefono">Teléfono *</Label>
                        <Input
                          id="telefono"
                          type="tel"
                          {...registerContact("telefono")}
                          aria-invalid={
                            errorsContact.telefono ? "true" : "false"
                          }
                        />
                        {errorsContact.telefono && (
                          <p
                            className="flex items-center gap-1 text-xs text-boga-error-500"
                            role="alert"
                          >
                            <AlertCircle className="h-3 w-3" aria-hidden="true" />
                            {errorsContact.telefono.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="ciudad">Ciudad *</Label>
                        <Input
                          id="ciudad"
                          {...registerContact("ciudad")}
                          aria-invalid={errorsContact.ciudad ? "true" : "false"}
                        />
                        {errorsContact.ciudad && (
                          <p
                            className="flex items-center gap-1 text-xs text-boga-error-500"
                            role="alert"
                          >
                            <AlertCircle className="h-3 w-3" aria-hidden="true" />
                            {errorsContact.ciudad.message}
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
                          {...registerContact("asistentes", {
                            valueAsNumber: true,
                          })}
                        />
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Controller
                        name="aceptaPrivacidad"
                        control={controlContact}
                        render={({ field }) => (
                          <Checkbox
                            id="aceptaPrivacidad"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        )}
                      />
                      <div>
                        <Label
                          htmlFor="aceptaPrivacidad"
                          className="font-normal"
                        >
                          Acepto la{" "}
                          <Link
                            href="/privacidad"
                            className="font-semibold text-boga-electric-500 hover:underline"
                          >
                            política de privacidad
                          </Link>
                        </Label>
                        {errorsContact.aceptaPrivacidad && (
                          <p
                            className="flex items-center gap-1 text-xs text-boga-error-500"
                            role="alert"
                          >
                            <AlertCircle className="h-3 w-3" aria-hidden="true" />
                            {errorsContact.aceptaPrivacidad.message}
                          </p>
                        )}
                      </div>
                    </div>

                    {status === "error" && (
                      <div className="flex items-start gap-2 rounded-lg bg-boga-error-50 p-3 text-sm text-boga-error-500">
                        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                        {errorMessage}
                      </div>
                    )}

                    <div className="flex justify-between pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => goToStep(2)}
                        disabled={status === "loading"}
                      >
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        Anterior
                      </Button>
                      <Button
                        type="button"
                        className="btn-primary"
                        onClick={handleSubmitContact(onSubmitStep3)}
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
    </>
  )
}

function StepIndicator({
  currentStep,
  totalSteps,
}: {
  currentStep: number
  totalSteps: number
}) {
  return (
    <div
      className="mb-10 flex items-center justify-center gap-4"
      aria-label={`Paso ${currentStep} de ${totalSteps}`}
    >
      {Array.from({ length: totalSteps }, (_, i) => {
        const stepNum = i + 1
        const isActive = stepNum === currentStep
        const isCompleted = stepNum < currentStep
        const isEmpty = !isActive && !isCompleted

        return (
          <div key={stepNum} className="flex items-center gap-4">
            <div
              className={cn(
                "flex h-11 w-11 items-center justify-center rounded-full text-sm font-bold transition-all",
                isActive &&
                  "bg-boga-lima-500 text-boga-text-on-lima ring-4 ring-boga-lima-500/25",
                isCompleted && "bg-boga-electric-500 text-white",
                isEmpty &&
                  "border-2 border-boga-electric-500 bg-transparent text-boga-electric-500"
              )}
              aria-current={isActive ? "step" : undefined}
            >
              {isCompleted ? (
                <Check className="h-5 w-5" strokeWidth={2.5} />
              ) : (
                stepNum
              )}
            </div>
            {stepNum < totalSteps && (
              <div
                className={cn(
                  "h-0.5 w-12 rounded-full transition-colors sm:w-16",
                  isCompleted ? "bg-boga-lima-500" : "bg-boga-silver"
                )}
                aria-hidden="true"
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
