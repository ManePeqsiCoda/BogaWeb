"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { FadeIn } from "./fade-in"
import {
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { siteConfig } from "@/lib/site"
import { BogaCircles } from "@/components/brand/boga-circles"
import { BogaDecor } from "@/components/brand/boga-decor"

const contactSchema = z.object({
  nombre: z.string().min(2, "El nombre es requerido"),
  empresa: z.string().optional(),
  email: z.string().email("Ingresa un correo válido"),
  telefono: z.string().min(7, "El teléfono debe tener al menos 7 dígitos"),
  mensaje: z.string().min(10, "El mensaje debe tener al menos 10 caracteres"),
})

type ContactForm = z.infer<typeof contactSchema>

const contactInfo = [
  {
    icon: Phone,
    label: "Teléfono",
    value: siteConfig.phone,
    href: `tel:+${siteConfig.phoneRaw}`,
  },
  {
    icon: Mail,
    label: "Email",
    value: siteConfig.email,
    href: `mailto:${siteConfig.email}`,
  },
  {
    icon: MessageCircle,
    label: "WhatsApp 24/7",
    value: siteConfig.phone,
    href: `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(siteConfig.whatsappMessage)}`,
  },
]

const sedes = [
  { city: siteConfig.addresses[0].city, address: siteConfig.addresses[0].street },
  { city: siteConfig.addresses[1].city, address: siteConfig.addresses[1].street },
]

export function Contact() {
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle")
  const [errorMessage, setErrorMessage] = useState("")

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
  })

  const onSubmit = async (data: ContactForm) => {
    setStatus("loading")
    setErrorMessage("")

    try {
      const response = await fetch("/api/contacto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Error al enviar el mensaje")
      }

      setStatus("success")
      reset()
      setTimeout(() => setStatus("idle"), 5000)
    } catch {
      setStatus("error")
      setErrorMessage(
        "No pudimos enviar tu mensaje. Por favor intenta de nuevo o contáctanos por WhatsApp."
      )
    }
  }

  return (
    <section className="relative overflow-hidden bg-[var(--boga-deep-500)] pt-8 pb-16 md:pt-10 md:pb-24">
      <BogaDecor
        variant="bars"
        tone="lima"
        className="absolute bottom-10 right-8 opacity-40"
      />
      <div className="container-boga relative z-10">
        <FadeIn className="mb-12 text-center">
          <span className="mb-3 inline-flex items-center gap-2 text-caption uppercase tracking-wider text-[var(--boga-lima-500)]">
            <BogaCircles size="s" tone="lima" />
            Contacto
          </span>
          <h2 className="text-2xl font-bold text-white md:text-4xl">
            Contáctanos
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-white/70">
            Soporte técnico 24/7 para proyectos de cualquier magnitud
          </p>
        </FadeIn>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Form */}
          <FadeIn direction="left">
            <Card className="border-white/10 bg-[var(--boga-surface-elevated)] text-[var(--boga-text-primary)] shadow-[var(--boga-shadow-4)]">
              <CardContent className="p-6 md:p-8">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="nombre" className="text-[var(--boga-text-secondary)]">
                        Nombre completo *
                      </Label>
                      <Input
                        id="nombre"
                        placeholder="Tu nombre"
                        {...register("nombre")}
                        aria-invalid={errors.nombre ? "true" : "false"}
                        className="border-[var(--boga-border-default)] bg-[var(--boga-surface-inset)] text-[var(--boga-text-primary)] placeholder:text-[var(--boga-text-muted)] focus-visible:border-[var(--boga-border-focus)] focus-visible:ring-[var(--boga-border-focus)]"
                      />
                      {errors.nombre && (
                        <p className="text-xs text-[var(--boga-error-500)]">
                          {errors.nombre.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="empresa" className="text-[var(--boga-text-secondary)]">
                        Empresa
                      </Label>
                      <Input
                        id="empresa"
                        placeholder="Nombre de tu empresa"
                        {...register("empresa")}
                        className="border-[var(--boga-border-default)] bg-[var(--boga-surface-inset)] text-[var(--boga-text-primary)] placeholder:text-[var(--boga-text-muted)] focus-visible:border-[var(--boga-border-focus)] focus-visible:ring-[var(--boga-border-focus)]"
                      />
                    </div>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-[var(--boga-text-secondary)]">
                        Correo electrónico *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="correo@ejemplo.com"
                        {...register("email")}
                        aria-invalid={errors.email ? "true" : "false"}
                        className="border-[var(--boga-border-default)] bg-[var(--boga-surface-inset)] text-[var(--boga-text-primary)] placeholder:text-[var(--boga-text-muted)] focus-visible:border-[var(--boga-border-focus)] focus-visible:ring-[var(--boga-border-focus)]"
                      />
                      {errors.email && (
                        <p className="text-xs text-[var(--boga-error-500)]">
                          {errors.email.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="telefono" className="text-[var(--boga-text-secondary)]">
                        Teléfono *
                      </Label>
                      <Input
                        id="telefono"
                        type="tel"
                        placeholder="350 708 9584"
                        {...register("telefono")}
                        aria-invalid={errors.telefono ? "true" : "false"}
                        className="border-[var(--boga-border-default)] bg-[var(--boga-surface-inset)] text-[var(--boga-text-primary)] placeholder:text-[var(--boga-text-muted)] focus-visible:border-[var(--boga-border-focus)] focus-visible:ring-[var(--boga-border-focus)]"
                      />
                      {errors.telefono && (
                        <p className="text-xs text-[var(--boga-error-500)]">
                          {errors.telefono.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mensaje" className="text-[var(--boga-text-secondary)]">
                      Mensaje *
                    </Label>
                    <Textarea
                      id="mensaje"
                      placeholder="Cuéntanos sobre tu evento o proyecto..."
                      rows={4}
                      {...register("mensaje")}
                      aria-invalid={errors.mensaje ? "true" : "false"}
                      className="border-[var(--boga-border-default)] bg-[var(--boga-surface-inset)] text-[var(--boga-text-primary)] placeholder:text-[var(--boga-text-muted)] focus-visible:border-[var(--boga-border-focus)] focus-visible:ring-[var(--boga-border-focus)]"
                    />
                    {errors.mensaje && (
                      <p className="text-xs text-[var(--boga-error-500)]">
                        {errors.mensaje.message}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={status === "loading" || status === "success"}
                    className="w-full bg-[var(--boga-lima-500)] text-[var(--boga-text-on-lima)] hover:bg-[var(--boga-lima-600)] font-semibold uppercase tracking-wider"
                    size="lg"
                  >
                    {status === "loading" && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {status === "success"
                      ? "Mensaje enviado"
                      : "Enviar solicitud"}
                  </Button>

                  {status === "success" && (
                    <div className="flex items-start gap-2 rounded-lg bg-[var(--boga-success-50)] p-3 text-sm text-[var(--boga-success-700)]">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                      Gracias por contactarnos. Te responderemos en menos de 24 horas.
                    </div>
                  )}

                  {status === "error" && (
                    <div className="flex items-start gap-2 rounded-lg bg-[var(--boga-error-50)] p-3 text-sm text-[var(--boga-error-700)]">
                      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                      {errorMessage}
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>
          </FadeIn>

          {/* Contact info */}
          <FadeIn direction="right">
            <div className="flex flex-col justify-center space-y-6">
              <div className="grid gap-4 sm:grid-cols-3">
                {contactInfo.map((item) => {
                  const Icon = item.icon
                  return (
                    <a
                      key={item.label}
                      href={item.href}
                      target={item.href.startsWith("http") ? "_blank" : undefined}
                      rel={
                        item.href.startsWith("http")
                          ? "noopener noreferrer"
                          : undefined
                      }
                      className="group rounded-xl border border-white/10 bg-white/5 p-4 text-white transition-colors hover:border-[var(--boga-lima-500)]/30 hover:bg-white/10"
                    >
                      <Icon
                        className="mb-3 h-6 w-6 text-[var(--boga-lima-500)]"
                        strokeWidth={1.75}
                      />
                      <p className="text-xs font-medium uppercase tracking-wider text-white/70">
                        {item.label}
                      </p>
                      <p className="mt-1 text-sm font-semibold text-[var(--boga-lima-500)]">
                        {item.value}
                      </p>
                    </a>
                  )
                })}
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 p-6">
                <div className="mb-4 flex items-center gap-2">
                  <MapPin
                    className="h-5 w-5 text-[var(--boga-lima-500)]"
                    strokeWidth={1.75}
                  />
                  <h3 className="font-semibold text-white">Nuestras sedes</h3>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {sedes.map((sede) => (
                    <div key={sede.city}>
                      <p className="font-semibold text-white">{sede.city}</p>
                      <p className="text-sm text-white/70">{sede.address}</p>
                    </div>
                  ))}
                </div>
              </div>

              <a
                href={`https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(siteConfig.whatsappMessage)}`}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "inline-flex items-center justify-center gap-2 rounded-full bg-[var(--boga-lima-500)] px-6 py-3 text-sm font-bold uppercase tracking-wider text-[var(--boga-text-on-lima)] transition-colors hover:bg-[var(--boga-lima-600)]",
                )}
              >
                <MessageCircle className="h-5 w-5" strokeWidth={1.75} />
                Escríbenos por WhatsApp
              </a>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}
