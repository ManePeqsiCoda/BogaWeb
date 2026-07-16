"use client"

import { Card, CardContent } from "@/components/ui/card"
import { FadeIn } from "./fade-in"
import { ShieldCheck, Clock, MapPin, Leaf } from "lucide-react"

const reasons = [
  {
    title: "ISO 14001 Certificado",
    description: "Cumplimiento ambiental garantizado en cada operación.",
    icon: ShieldCheck,
  },
  {
    title: "Operación 24/7",
    description: "Soporte técnico permanente durante todo el evento.",
    icon: Clock,
  },
  {
    title: "Cobertura nacional",
    description: "Sedes operativas en Medellín y Bogotá para toda Colombia.",
    icon: MapPin,
  },
  {
    title: "Insumos biodegradables",
    description: "Compromiso real con el medio ambiente y la sostenibilidad.",
    icon: Leaf,
  },
]

export function WhyUs() {
  return (
    <section className="bg-secondary py-16 md:py-24">
      <div className="container mx-auto px-4 lg:px-6">
        <FadeIn className="mb-12 text-center">
          <h2 className="text-2xl font-bold text-white md:text-4xl">
            La diferencia Junisama
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-text-on-dark-muted">
            Más de una década respaldando los eventos más importantes del país
          </p>
        </FadeIn>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {reasons.map((reason, index) => {
            const Icon = reason.icon
            return (
              <FadeIn key={reason.title} delay={index * 0.1}>
                <Card className="h-full border-white/10 bg-white/5 text-white backdrop-blur-sm transition-all hover:border-accent-gold/30 hover:bg-white/10">
                  <CardContent className="flex flex-col items-center p-6 text-center">
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-accent-gold/15 text-accent-gold">
                      <Icon className="h-7 w-7" />
                    </div>
                    <h3 className="text-lg font-bold text-white">
                      {reason.title}
                    </h3>
                    <p className="mt-2 text-sm text-text-on-dark-muted">
                      {reason.description}
                    </p>
                  </CardContent>
                </Card>
              </FadeIn>
            )
          })}
        </div>
      </div>
    </section>
  )
}
