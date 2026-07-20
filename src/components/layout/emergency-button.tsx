"use client"

import { useState } from "react"
import { Phone, AlertTriangle, MessageCircle, ShieldAlert } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { siteConfig } from "@/lib/site"

const EMERGENCY_TYPES = [
  "Fuga o derrame",
  "Unidad dañada o bloqueada",
  "Falta de insumos / higiene crítica",
  "Personal o cobertura insuficiente",
  "Otro",
] as const

type Step = "form" | "calm"

export function EmergencyButton({ className }: { className?: string }) {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState<Step>("form")
  const [referencia, setReferencia] = useState("")
  const [tipo, setTipo] = useState("")
  const [error, setError] = useState("")

  const reset = () => {
    setStep("form")
    setReferencia("")
    setTipo("")
    setError("")
  }

  const handleOpenChange = (next: boolean) => {
    setOpen(next)
    if (!next) {
      // Pequeño delay visual al cerrar
      window.setTimeout(reset, 200)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const ref = referencia.trim()
    if (!ref) {
      setError("Indica la referencia del contrato")
      return
    }
    if (!tipo) {
      setError("Selecciona el tipo de emergencia")
      return
    }
    setError("")
    setStep("calm")
  }

  const goToWhatsApp = () => {
    const message = [
      "🚨 EMERGENCIA BOGA",
      "",
      `Referencia de contrato: ${referencia.trim()}`,
      `Tipo de emergencia: ${tipo}`,
      "",
      "Necesito asistencia urgente, por favor.",
    ].join("\n")

    const href = `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(message)}`
    window.open(href, "_blank", "noopener,noreferrer")
    handleOpenChange(false)
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn("btn-emergency", className)}
        aria-label="Reportar emergencia"
        title="Línea de emergencia BOGA"
      >
        <Phone className="h-4 w-4" aria-hidden="true" />
        <span>EMERGENCIA</span>
      </button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent
          className="max-w-md gap-0 overflow-hidden p-0 sm:max-w-md"
          showCloseButton
        >
          <div className="bg-boga-error-500 px-5 py-4 text-white">
            <DialogHeader className="gap-1">
              <DialogTitle className="flex items-center gap-2 text-base font-bold text-white">
                <ShieldAlert className="h-5 w-5" aria-hidden="true" />
                Línea de emergencia
              </DialogTitle>
              <DialogDescription className="text-sm text-white/85">
                {step === "form"
                  ? "Cuéntanos lo esencial para ubicar tu contrato y actuar más rápido."
                  : "Ya recibimos tu reporte. Sigue estos primeros pasos."}
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="p-5">
            {step === "form" ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="emergencia-referencia">
                    Referencia del contrato *
                  </Label>
                  <Input
                    id="emergencia-referencia"
                    value={referencia}
                    onChange={(e) => setReferencia(e.target.value)}
                    placeholder="Ej. CTR-2026-0142 o nombre del evento"
                    autoComplete="off"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emergencia-tipo">Tipo de emergencia *</Label>
                  <Select
                    value={tipo || undefined}
                    onValueChange={(value) => setTipo(value ?? "")}
                  >
                    <SelectTrigger id="emergencia-tipo" className="w-full">
                      <SelectValue placeholder="Selecciona una opción" />
                    </SelectTrigger>
                    <SelectContent>
                      {EMERGENCY_TYPES.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {error && (
                  <p
                    className="flex items-center gap-1.5 text-xs text-boga-error-500"
                    role="alert"
                  >
                    <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />
                    {error}
                  </p>
                )}

                <Button type="submit" className="w-full" variant="destructive">
                  Continuar
                </Button>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="rounded-xl border border-boga-lima-500/40 bg-boga-lima-50 px-4 py-3 text-sm leading-relaxed text-boga-deep-500">
                  <p className="font-semibold">
                    Entendemos la situación y agradecemos que nos lo haya
                    comunicado.
                  </p>
                  <p className="mt-2">
                    Mientras tanto, puede seguir estos primeros pasos: mantenga
                    la calma y despeje la zona. Estamos trabajando para ayudarle
                    y le responderemos por WhatsApp en breve.
                  </p>
                </div>

                <ul className="space-y-1.5 text-sm text-boga-text-secondary">
                  <li>
                    <span className="font-medium text-boga-text-primary">
                      Contrato:
                    </span>{" "}
                    {referencia.trim()}
                  </li>
                  <li>
                    <span className="font-medium text-boga-text-primary">
                      Tipo:
                    </span>{" "}
                    {tipo}
                  </li>
                </ul>

                <Button
                  type="button"
                  onClick={goToWhatsApp}
                  className="w-full bg-[#25D366] text-white hover:bg-[#1ebe57]"
                >
                  <MessageCircle className="h-4 w-4" aria-hidden="true" />
                  Continuar a WhatsApp
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
