import type { Metadata } from "next"
import { clientes, eventos } from "@/lib/mocks"
import { Card, CardContent } from "@/components/ui/card"
import { FadeIn } from "@/components/home/fade-in"
import { Star, Users, MapPin, Calendar, Award } from "lucide-react"
import {
  seoConfig,
  generateOpenGraph,
  generateTwitterCard,
  generateBreadcrumbJsonLd,
} from "@/lib/seo"

export const metadata: Metadata = {
  title: seoConfig.clientes.title,
  description: seoConfig.clientes.description,
  keywords: seoConfig.clientes.keywords,
  alternates: { canonical: "/clientes" },
  openGraph: generateOpenGraph("clientes", "/clientes"),
  twitter: generateTwitterCard("clientes"),
}

const testimonials = [
  {
    name: "Carlos Martínez",
    role: "Productor de eventos",
    company: "Festival Nacional",
    text: "BOGA entregó una operación impecable durante los 3 días del festival. El soporte 24/7 nos dio la tranquilidad que necesitábamos.",
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
    text: "En obra, la confiabilidad es todo. BOGA cumple con los tiempos, mantiene los equipos impecables y responde al instante.",
  },
  {
    name: "Laura Fernández",
    role: "Directora de producción",
    company: "Conciertos Live",
    text: "Hemos trabajado con BOGA en múltiples conciertos masivos. Su capacidad logística y atención al detalle son inigualables.",
  },
  {
    name: "Diego Ramírez",
    role: "Gerente de operaciones",
    company: "Ferias del País",
    text: "Para ferias de gran magnitud, necesitamos un aliado que responda rápido. BOGA cumple siempre con los estándares de higiene y puntualidad.",
  },
]

const stats = [
  { icon: Calendar, value: "33+", label: "Eventos atendidos" },
  { icon: Award, value: "500+", label: "Servicios completados" },
  { icon: MapPin, value: "2", label: "Sedes operativas" },
  { icon: Users, value: "10+", label: "Años de experiencia" },
]

const featuredClients = [
  "Shakira",
  "Foo Fighters",
  "Feria de las Flores",
  "Papa Francisco",
  "Estéreo Picnic",
  "Rock al Parque",
  "Soda Stereo",
  "La Solar",
  "Carl Cox",
  "Alvaro Díaz",
  "Luis Miguel",
  "Alejandro Sanz",
  "Colombiamoda",
  "F-AIR Colombia",
  "Carnaval de Barranquilla",
]

export default function ClientesPage() {
  const publicEventos = eventos
    .filter((e) => e.estado === "PUBLICADO" && e.destacado)
    .slice(0, 15)
    .sort((a, b) => b.anio - a.anio)

  const clientNames = [
    ...featuredClients,
    ...clientes.map((c) => c.nombreEmpresa),
    ...publicEventos.map((e) => e.nombre),
  ].slice(0, 30)

  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Inicio", path: "/" },
    { name: "Clientes", path: "/clientes" },
  ])

  return (
    <div className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Hero */}
      <section className="bg-secondary pb-16 pt-32">
        <div className="container mx-auto px-4 text-center lg:px-6">
          <h1 className="text-3xl font-extrabold text-white md:text-5xl">
            Quiénes Confían en Nosotros
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-text-on-dark-muted">
            Respaldo de las principales organizaciones y eventos del país
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="container mx-auto -mt-8 px-4 lg:px-6">
        <FadeIn>
          <div className="grid grid-cols-2 gap-4 rounded-2xl bg-white p-6 shadow-md md:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon
              return (
                <div key={stat.label} className="text-center">
                  <Icon className="mx-auto h-8 w-8 text-primary" />
                  <p className="mt-2 text-3xl font-extrabold text-dark">
                    {stat.value}
                  </p>
                  <p className="text-sm text-muted">{stat.label}</p>
                </div>
              )
            })}
          </div>
        </FadeIn>
      </section>

      {/* Client grid */}
      <section className="container mx-auto px-4 py-16 lg:px-6">
        <FadeIn className="mb-10 text-center">
          <h2 className="text-2xl font-bold text-dark md:text-3xl">
            Eventos y organizaciones
          </h2>
        </FadeIn>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {clientNames.map((client, index) => (
            <FadeIn key={`${client}-${index}`} delay={index * 0.02}>
              <div className="flex h-24 items-center justify-center rounded-xl border border-border bg-bg-light px-4 text-center shadow-sm transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-md">
                <span className="text-sm font-semibold text-dark">{client}</span>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-bg-warm py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-6">
          <FadeIn className="mb-12 text-center">
            <h2 className="text-2xl font-bold text-dark md:text-3xl">
              Lo que dicen nuestros clientes
            </h2>
          </FadeIn>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.slice(0, 3).map((testimonial, index) => (
              <FadeIn key={testimonial.name} delay={index * 0.1}>
                <Card className="h-full border-border-subtle bg-white shadow-sm">
                  <CardContent className="flex h-full flex-col p-6">
                    <div className="mb-4 flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 fill-accent-gold text-accent-gold"
                        />
                      ))}
                    </div>
                    <p className="flex-1 text-body">
                      &ldquo;{testimonial.text}&rdquo;
                    </p>
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
    </div>
  )
}
