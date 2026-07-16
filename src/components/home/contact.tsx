"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button, buttonVariants } from "@/components/ui/button"
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
    value: "+57 350 708 9584",
    href: "tel:+573507089584",
  },
  {
    icon: Mail,
    label: "Email",
    value: "soporte@junisama.com",
    href: "mailto:soporte@junisama.com",
  },
  {
    icon: MessageCircle,
    label: "WhatsApp 24/7",
    value: "+57 350 708 9584",
    href: "https://wa.me/573507089584?text=Hola,%20me%20gustaría%20recibir%20información%20sobre%20sus%20servicios",
  },
]

const sedes = [
  { city: "Medellín", address: "Calle 13 sur #51C-54" },
  { city: "Bogotá", address: "Cra 58b bis #131A 51" },
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
    <section className="bg-secondary-elevated py-16 md:py-24">
      <div className="container mx-auto px-4 lg:px-6">
        <FadeIn className="mb-12 text-center">
          <h2 className="text-2xl font-bold text-white md:text-4xl">
            Contáctanos
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-text-on-dark-muted">
            Soporte técnico 24/7 para proyectos de cualquier magnitud
          </p>
        </FadeIn>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Form */}
          <FadeIn direction="left">
            <Card className="border-white/10 bg-white text-dark shadow-lg">
              <CardContent className="p-6 md:p-8">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="nombre">Nombre completo *</Label>
                      <Input
                        id="nombre"
                        placeholder="Tu nombre"
                        {...register("nombre")}
                        aria-invalid={errors.nombre ? "true" : "false"}
                      />
                      {errors.nombre && (
                        <p className="text-xs text-error">
                          {errors.nombre.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="empresa">Empresa</Label>
                      <Input
                        id="empresa"
                        placeholder="Nombre de tu empresa"
                        {...register("empresa")}
                      />
                    </div>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="email">Correo electrónico *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="correo@ejemplo.com"
                        {...register("email")}
                        aria-invalid={errors.email ? "true" : "false"}
                      />
                      {errors.email && (
                        <p className="text-xs text-error">
                          {errors.email.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="telefono">Teléfono *</Label>
                      <Input
                        id="telefono"
                        type="tel"
                        placeholder="350 708 9584"
                        {...register("telefono")}
                        aria-invalid={errors.telefono ? "true" : "false"}
                      />
                      {errors.telefono && (
                        <p className="text-xs text-error">
                          {errors.telefono.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mensaje">Mensaje *</Label>
                    <Textarea
                      id="mensaje"
                      placeholder="Cuéntanos sobre tu evento o proyecto..."
                      rows={4}
                      {...register("mensaje")}
                      aria-invalid={errors.mensaje ? "true" : "false"}
                    />
                    {errors.mensaje && (
                      <p className="text-xs text-error">
                        {errors.mensaje.message}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={status === "loading" || status === "success"}
                    className="w-full"
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
                    <div className="flex items-start gap-2 rounded-lg bg-success-bg p-3 text-sm text-success">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                      Gracias por contactarnos. Te responderemos en menos de 24
                      horas.
                    </div>
                  )}

                  {status === "error" && (
                    <div className="flex items-start gap-2 rounded-lg bg-error-bg p-3 text-sm text-error">
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
                      className="group rounded-xl border border-white/10 bg-white/5 p-4 text-white transition-colors hover:border-accent-gold/30 hover:bg-white/10"
                    >
                      <Icon className="mb-3 h-6 w-6 text-accent-gold" />
                      <p className="text-xs font-medium uppercase tracking-wider text-text-on-dark-muted">
                        {item.label}
                      </p>
                      <p className="mt-1 text-sm font-semibold">{item.value}</p>
                    </a>
                  )
                })}
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 p-6">
                <div className="mb-4 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-accent-gold" />
                  <h3 className="font-semibold text-white">Nuestras sedes</h3>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {sedes.map((sede) => (
                    <div key={sede.city}>
                      <p className="font-semibold text-white">{sede.city}</p>
                      <p className="text-sm text-text-on-dark-muted">
                        {sede.address}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <a
                href="https://wa.me/573507089584?text=Hola,%20me%20gustaría%20recibir%20información%20sobre%20sus%20servicios"
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "w-full bg-whatsapp font-semibold hover:bg-whatsapp/90"
                )}
              >
                <MessageCircle className="mr-2 h-5 w-5 fill-current" />
                Escríbenos por WhatsApp
              </a>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}
