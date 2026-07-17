"use client"

import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { FadeIn } from "@/components/home/fade-in"
import { siteConfig } from "@/lib/site"
import {
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Clock,
  Loader2,
  CheckCircle2,
} from "lucide-react"

const contactSchema = z.object({
  nombre: z.string().min(2, "El nombre es requerido"),
  empresa: z.string().optional(),
  email: z.string().email("Ingresa un correo válido"),
  telefono: z.string().min(7, "El teléfono debe tener al menos 7 dígitos"),
  tipoEvento: z.string().optional(),
  fechaAproximada: z.string().optional(),
  mensaje: z.string().min(10, "El mensaje debe tener al menos 10 caracteres"),
})

type ContactForm = z.infer<typeof contactSchema>

const contactInfo = [
  {
    icon: Phone,
    label: "Línea directa",
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
    label: "WhatsApp",
    value: "Chat inmediato",
    href: `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(siteConfig.whatsappMessage)}`,
  },
  {
    icon: Clock,
    label: "Horario",
    value: "Atención 24/7",
    href: undefined,
  },
]

const sedes = [
  {
    city: `Sede ${siteConfig.addresses[0].city}`,
    address: siteConfig.addresses[0].street,
    mapUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.521260322283!2d-75.612!3d6.208!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMTInMjguOCJOIDc1wrAzNic0My4yIlc!5e0!3m2!1ses!2sco!4v1600000000000!5m2!1ses!2sco",
  },
  {
    city: `Sede ${siteConfig.addresses[1].city}`,
    address: siteConfig.addresses[1].street,
    mapUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3976.123456789012!2d-74.085!3d4.710!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNMKwNDInMzYuMCJOIDc0wrAwNScwNi4wIlc!5e0!3m2!1ses!2sco!4v1600000000000!5m2!1ses!2sco",
  },
]

const tipoEventoOptions = [
  "Concierto / Festival",
  "Feria / Corferias",
  "Evento corporativo",
  "Obra / Construcción",
  "Boda / Evento social",
  "Gubernamental",
  "Otro",
]

export default function ContactForm() {
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle")

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
  })

  const onSubmit = async (data: ContactForm) => {
    setStatus("loading")

    try {
      // Simulated API call — no backend in static prototype
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setStatus("success")
      reset()
      toast.success(`Gracias ${data.nombre}`, {
        description: "Tu mensaje fue recibido. Te responderemos en menos de 24 horas.",
      })
      setTimeout(() => setStatus("idle"), 5000)
    } catch {
      setStatus("error")
      toast.error("No pudimos enviar tu mensaje", {
        description: "Por favor intenta de nuevo o contáctanos por WhatsApp.",
      })
    }
  }

  return (
    <div className="min-h-screen bg-boga-surface-canvas">
      {/* Hero */}
      <section className="bg-boga-deep-500 pb-16 pt-32">
        <div className="container mx-auto px-4 text-center lg:px-6">
          <h1 className="text-3xl font-extrabold text-boga-text-inverted md:text-5xl">
            Contacto
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-boga-text-inverted/70">
            Estamos listos para atender tu evento u obra en cualquier parte de
            Colombia
          </p>
        </div>
      </section>

      <section className="container mx-auto -mt-8 px-4 pb-20 lg:px-6">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Form */}
          <FadeIn direction="left">
            <Card className="border-boga-border-subtle bg-boga-surface-elevated shadow-boga-4">
              <CardContent className="p-6 md:p-8">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="nombre">
                        Nombre completo <span className="text-boga-error-500">*</span>
                      </Label>
                      <Input
                        id="nombre"
                        placeholder="Tu nombre"
                        {...register("nombre")}
                        aria-invalid={errors.nombre ? "true" : "false"}
                      />
                      {errors.nombre && (
                        <p className="text-xs text-boga-error-500">
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
                      <Label htmlFor="email">
                        Correo electrónico <span className="text-boga-error-500">*</span>
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="correo@ejemplo.com"
                        {...register("email")}
                        aria-invalid={errors.email ? "true" : "false"}
                      />
                      {errors.email && (
                        <p className="text-xs text-boga-error-500">
                          {errors.email.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="telefono">
                        Teléfono <span className="text-boga-error-500">*</span>
                      </Label>
                      <Input
                        id="telefono"
                        type="tel"
                        placeholder="350 708 9584"
                        {...register("telefono")}
                        aria-invalid={errors.telefono ? "true" : "false"}
                      />
                      {errors.telefono && (
                        <p className="text-xs text-boga-error-500">
                          {errors.telefono.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="tipoEvento">Tipo de evento</Label>
                      <Controller
                        name="tipoEvento"
                        control={control}
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
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fechaAproximada">Fecha aproximada</Label>
                      <Input
                        id="fechaAproximada"
                        type="date"
                        {...register("fechaAproximada")}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mensaje">
                      Mensaje <span className="text-boga-error-500">*</span>
                    </Label>
                    <Textarea
                      id="mensaje"
                      placeholder="Cuéntanos sobre tu evento o proyecto..."
                      rows={4}
                      {...register("mensaje")}
                      aria-invalid={errors.mensaje ? "true" : "false"}
                    />
                    {errors.mensaje && (
                      <p className="text-xs text-boga-error-500">
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
                      : "Enviar mensaje"}
                  </Button>

                  {status === "success" && (
                    <div className="flex items-start gap-2 rounded-lg bg-boga-success-50 p-3 text-sm text-boga-success-600">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                      Gracias por contactarnos. Te responderemos en menos de 24
                      horas.
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>
          </FadeIn>

          {/* Contact info */}
          <FadeIn direction="right">
            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                {contactInfo.map((item) => {
                  const Icon = item.icon
                  const content = (
                    <>
                      <Icon className="mb-3 h-6 w-6 text-boga-electric-500" />
                      <p className="text-xs font-medium uppercase tracking-wider text-boga-text-tertiary">
                        {item.label}
                      </p>
                      <p className="mt-1 font-semibold text-boga-text-primary">
                        {item.value}
                      </p>
                    </>
                  )
                  return item.href ? (
                    <a
                      key={item.label}
                      href={item.href}
                      target={item.href.startsWith("http") ? "_blank" : undefined}
                      rel={
                        item.href.startsWith("http")
                          ? "noopener noreferrer"
                          : undefined
                      }
                      className="block rounded-xl border border-boga-border-default bg-boga-surface-elevated p-5 shadow-boga-2 transition-all hover:-translate-y-1 hover:border-boga-electric-500/30 hover:shadow-boga-3"
                    >
                      {content}
                    </a>
                  ) : (
                    <div
                      key={item.label}
                      className="rounded-xl border border-boga-border-default bg-boga-surface-elevated p-5 shadow-boga-2"
                    >
                      {content}
                    </div>
                  )
                })}
              </div>

              {sedes.map((sede) => (
                <Card
                  key={sede.city}
                  className="overflow-hidden border-boga-border-subtle bg-boga-surface-elevated shadow-boga-2"
                >
                  <CardContent className="p-0">
                    <div className="flex items-start gap-3 p-5">
                      <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-boga-electric-500" />
                      <div>
                        <h3 className="font-bold text-boga-text-primary">{sede.city}</h3>
                        <p className="text-sm text-boga-text-secondary">{sede.address}</p>
                      </div>
                    </div>
                    <iframe
                      src={sede.mapUrl}
                      width="100%"
                      height="250"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title={`Mapa ${sede.city}`}
                      className="grayscale-[20%]"
                    />
                  </CardContent>
                </Card>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  )
}
