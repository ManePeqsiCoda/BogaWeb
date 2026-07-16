"use client"

import { Card, CardContent } from "@/components/ui/card"
import { FadeIn } from "./fade-in"
import { Quote, Star } from "lucide-react"

const testimonials = [
  {
    name: "Carlos Martínez",
    role: "Productor de eventos",
    company: "Festival Nacional",
    text: "Junisama entregó una operación impecable durante los 3 días del festival. El soporte 24/7 nos dio la tranquilidad que necesitábamos.",
  },
  {
    name: "Mariana López",
    role: "Coordinadora logística",
    company: "Eventos Corp",
    text: "La calidad de los baños VIP superó las expectativas de nuestros clientes. Son nuestro aliado estratégico para eventos corporativos de alto nivel.",
  },
  {
    name: "Andrés Gómez",
    role: "Jefe de obra",
    company: "Constructora del Norte",
    text: "En obra, la confiabilidad es todo. Junisama cumple con los tiempos, mantiene los equipos impecables y responde al instante.",
  },
]

export function Testimonials() {
  return (
    <section className="bg-bg-warm py-16 md:py-24">
      <div className="container mx-auto px-4 lg:px-6">
        <FadeIn className="mb-12 text-center">
          <h2 className="text-2xl font-bold text-dark md:text-4xl">
            Lo que dicen nuestros clientes
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-body">
            Experiencias reales de quienes han confiado en nuestra infraestructura
          </p>
        </FadeIn>

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <FadeIn key={testimonial.name} delay={index * 0.1}>
              <Card className="relative h-full border-border-subtle bg-white shadow-sm">
                <Quote className="absolute top-4 right-4 h-8 w-8 text-accent-gold/20" />
                <CardContent className="flex h-full flex-col p-6">
                  <div className="mb-4 flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-accent-gold text-accent-gold"
                      />
                    ))}
                  </div>
                  <p className="flex-1 text-body">&ldquo;{testimonial.text}&rdquo;</p>
                  <div className="mt-6 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-light text-sm font-bold text-primary">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-dark">
                        {testimonial.name}
                      </p>
                      <p className="text-xs text-muted">
                        {testimonial.role}, {testimonial.company}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
