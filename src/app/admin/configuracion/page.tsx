"use client"

import { useEffect, useState } from "react"
import { useForm, type Resolver } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Save, Store, Share2, Search } from "lucide-react"
import type { Configuracion } from "@prisma/client"

const configSchema = z.object({
  nombreSitio: z.string().min(1, "El nombre del sitio es obligatorio"),
  telefono: z.string().optional().nullable(),
  email: z.string().email("Correo inválido").optional().nullable().or(z.literal("")),
  direccionMedellin: z.string().optional().nullable(),
  direccionBogota: z.string().optional().nullable(),
  whatsappNumero: z.string().optional().nullable(),
  instagramUrl: z.string().optional().nullable(),
  linkedinUrl: z.string().optional().nullable(),
  mensajeWhatsApp: z.string().optional().nullable(),
  seoTitleDefault: z.string().optional().nullable(),
  seoDescriptionDefault: z.string().optional().nullable(),
  scriptAnalytics: z.string().optional().nullable(),
})

type FormData = z.infer<typeof configSchema>

export default function ConfiguracionAdminPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<FormData>({
    resolver: zodResolver(configSchema) as Resolver<FormData>,
    defaultValues: {
      nombreSitio: "",
      telefono: "",
      email: "",
      direccionMedellin: "",
      direccionBogota: "",
      whatsappNumero: "",
      instagramUrl: "",
      linkedinUrl: "",
      mensajeWhatsApp: "",
      seoTitleDefault: "",
      seoDescriptionDefault: "",
      scriptAnalytics: "",
    },
  })

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/configuracion")
        if (!res.ok) throw new Error("Error")
        const data: Configuracion = await res.json()
        reset({
          nombreSitio: data.nombreSitio,
          telefono: data.telefono || "",
          email: data.email || "",
          direccionMedellin: data.direccionMedellin || "",
          direccionBogota: data.direccionBogota || "",
          whatsappNumero: data.whatsappNumero || "",
          instagramUrl: data.instagramUrl || "",
          linkedinUrl: data.linkedinUrl || "",
          mensajeWhatsApp: data.mensajeWhatsApp || "",
          seoTitleDefault: data.seoTitleDefault || "",
          seoDescriptionDefault: data.seoDescriptionDefault || "",
          scriptAnalytics: data.scriptAnalytics || "",
        })
      } catch {
        toast.error("No se pudo cargar la configuración")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [reset])

  const onSubmit = async (data: FormData) => {
    setSaving(true)
    try {
      const res = await fetch("/api/configuracion", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          telefono: data.telefono?.trim() || null,
          email: data.email?.trim() || null,
          direccionMedellin: data.direccionMedellin?.trim() || null,
          direccionBogota: data.direccionBogota?.trim() || null,
          whatsappNumero: data.whatsappNumero?.trim() || null,
          instagramUrl: data.instagramUrl?.trim() || null,
          linkedinUrl: data.linkedinUrl?.trim() || null,
          mensajeWhatsApp: data.mensajeWhatsApp?.trim() || null,
          seoTitleDefault: data.seoTitleDefault?.trim() || null,
          seoDescriptionDefault: data.seoDescriptionDefault?.trim() || null,
          scriptAnalytics: data.scriptAnalytics?.trim() || null,
        }),
      })

      if (!res.ok) throw new Error("Error")

      const updated = await res.json()
      reset({
        nombreSitio: updated.nombreSitio,
        telefono: updated.telefono || "",
        email: updated.email || "",
        direccionMedellin: updated.direccionMedellin || "",
        direccionBogota: updated.direccionBogota || "",
        whatsappNumero: updated.whatsappNumero || "",
        instagramUrl: updated.instagramUrl || "",
        linkedinUrl: updated.linkedinUrl || "",
        mensajeWhatsApp: updated.mensajeWhatsApp || "",
        seoTitleDefault: updated.seoTitleDefault || "",
        seoDescriptionDefault: updated.seoDescriptionDefault || "",
        scriptAnalytics: updated.scriptAnalytics || "",
      })
      toast.success("Configuración guardada correctamente")
    } catch {
      toast.error("No se pudo guardar la configuración")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-sm font-extrabold uppercase tracking-widest text-foreground">
            Configuración
          </h1>
          <p className="text-sm text-muted-foreground">
            Ajustes generales del sitio y la aplicación
          </p>
        </div>
        <Button
          onClick={handleSubmit(onSubmit)}
          disabled={saving || !isDirty}
          className="bg-primary font-semibold text-primary-foreground hover:bg-primary-hover"
        >
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Guardando...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Guardar cambios
            </>
          )}
        </Button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card className="bg-card ring-1 ring-foreground/10">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Store className="h-4 w-4 text-primary" />
              <CardTitle className="text-sm font-extrabold uppercase tracking-wider">
                Datos del negocio
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="nombreSitio">
                Nombre del sitio <span className="text-error">*</span>
              </Label>
              <Input id="nombreSitio" {...register("nombreSitio")} />
              {errors.nombreSitio && (
                <p className="text-xs text-error">{errors.nombreSitio.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="telefono">Teléfono</Label>
              <Input id="telefono" {...register("telefono")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...register("email")} />
              {errors.email && (
                <p className="text-xs text-error">{errors.email.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="direccionMedellin">Dirección Medellín</Label>
              <Input id="direccionMedellin" {...register("direccionMedellin")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="direccionBogota">Dirección Bogotá</Label>
              <Input id="direccionBogota" {...register("direccionBogota")} />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="whatsappNumero">Número WhatsApp</Label>
              <Input
                id="whatsappNumero"
                {...register("whatsappNumero")}
                placeholder="573507089584"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card ring-1 ring-foreground/10">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Share2 className="h-4 w-4 text-primary" />
              <CardTitle className="text-sm font-extrabold uppercase tracking-wider">
                Redes sociales
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="instagramUrl">URL Instagram</Label>
              <Input
                id="instagramUrl"
                {...register("instagramUrl")}
                placeholder="https://instagram.com/..."
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="linkedinUrl">URL LinkedIn</Label>
              <Input
                id="linkedinUrl"
                {...register("linkedinUrl")}
                placeholder="https://linkedin.com/company/..."
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="mensajeWhatsApp">Mensaje predeterminado WhatsApp</Label>
              <Textarea
                id="mensajeWhatsApp"
                {...register("mensajeWhatsApp")}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card ring-1 ring-foreground/10">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-primary" />
              <CardTitle className="text-sm font-extrabold uppercase tracking-wider">
                SEO Default
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="seoTitleDefault">Título por defecto</Label>
              <Input id="seoTitleDefault" {...register("seoTitleDefault")} />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="seoDescriptionDefault">Descripción por defecto</Label>
              <Textarea
                id="seoDescriptionDefault"
                {...register("seoDescriptionDefault")}
                rows={3}
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="scriptAnalytics">Script de Analytics</Label>
              <Textarea
                id="scriptAnalytics"
                {...register("scriptAnalytics")}
                rows={4}
                placeholder="<!-- Google tag (gtag.js) -->"
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={saving || !isDirty}
            className="bg-primary font-semibold text-primary-foreground hover:bg-primary-hover"
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Guardar cambios
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
