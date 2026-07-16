import type { Metadata } from "next"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { FadeIn } from "@/components/home/fade-in"
import { cn } from "@/lib/utils"
import {
  Truck,
  Wrench,
  Users,
  Leaf,
  ShieldCheck,
  MapPin,
  Award,
  CheckCircle2,
  ArrowRight,
} from "lucide-react"
import {
  seoConfig,
  generateOpenGraph,
  generateTwitterCard,
  generateBreadcrumbJsonLd,
} from "@/lib/seo"

export const metadata: Metadata = {
  title: seoConfig.servicios.title,
  description: seoConfig.servicios.description,
  keywords: seoConfig.servicios.keywords,
  alternates: { canonical: "/servicios" },
  openGraph: generateOpenGraph("servicios", "/servicios"),
  twitter: generateTwitterCard("servicios"),
}

const services = [
  {
    icon: Truck,
    title: "Alquiler de Unidades",
    description:
      "Flota completa de unidades sanitarias portátiles de grado industrial. Disponibilidad inmediata y mantenimiento incluido.",
    items: [
      "Unidades estándar",
      "Unidades premium",
      "Unidades accesibles",
      "Instalación incluida",
    ],
  },
  {
    icon: Wrench,
    title: "Mantenimiento Especializado",
    description:
      "Servicio técnico profesional con protocolos de higiene industrial. Monitoreo continuo y respuesta inmediata.",
    items: [
      "Limpieza profunda",
      "Desinfección certificada",
      "Reposición de insumos",
      "Monitoreo 24/7",
    ],
  },
  {
    icon: Users,
    title: "Operarios Certificados",
    description:
      "Personal técnico altamente capacitado con turnos flexibles. Cobertura completa durante todo el evento.",
    items: [
      "Turnos de 8 horas",
      "Turnos de 12 horas",
      "Personal certificado",
      "Supervisión técnica",
    ],
  },
  {
    icon: Leaf,
    title: "Insumos Biodegradables",
    description:
      "Productos eco-friendly de grado industrial. Cumplimiento normativo ambiental garantizado.",
    items: [
      "Papel higiénico eco",
      "Desinfectantes bio",
      "Jabones orgánicos",
      "Certificación ambiental",
    ],
  },
]

const differentiators = [
  {
    icon: ShieldCheck,
    title: "ISO 14001 Certificado",
    description: "Cumplimiento ambiental en cada operación.",
  },
  {
    icon: MapPin,
    title: "Cobertura nacional",
    description: "Sedes en Medellín y Bogotá, operación en todo Colombia.",
  },
  {
    icon: Award,
    title: "Personal certificado",
    description: "Técnicos capacitados en higiene industrial y atención al cliente.",
  },
]

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Servicios Especializados Junisama",
  provider: {
    "@type": "Organization",
    name: "Junisama Inversiones S.A.S",
  },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Servicios de infraestructura sanitaria",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Alquiler de Unidades",
          description:
            "Flota completa de unidades sanitarias portátiles de grado industrial.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Mantenimiento Especializado",
          description:
            "Servicio técnico profesional con protocolos de higiene industrial.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Operarios Certificados",
          description:
            "Personal técnico altamente capacitado con turnos flexibles.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Insumos Biodegradables",
          description:
            "Productos eco-friendly de grado industrial.",
        },
      },
    ],
  },
}

export default function ServiciosPage() {
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Inicio", path: "/" },
    { name: "Servicios", path: "/servicios" },
  ])

  return (
    <div className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([breadcrumbJsonLd, serviceJsonLd]),
        }}
      />

      {/* Hero */}
      <section className="bg-secondary pb-16 pt-32">
        <div className="container mx-auto px-4 text-center lg:px-6">
          <Badge className="mb-4 border-0 bg-accent-gold/15 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-accent-gold hover:bg-accent-gold/15">
            Servicios Especializados
          </Badge>
          <h1 className="text-3xl font-extrabold text-white md:text-5xl">
            Servicios Especializados
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-text-on-dark-muted">
            Soluciones integrales de infraestructura sanitaria para eventos,
            obras y proyectos industriales
          </p>
        </div>
      </section>

      {/* Services grid */}
      <section className="container mx-auto -mt-8 px-4 pb-16 lg:px-6">
        <div className="grid gap-6 md:grid-cols-2">
          {services.map((service, index) => {
            const Icon = service.icon
            return (
              <FadeIn key={service.title} delay={index * 0.1}>
                <Card className="group h-full border-border-subtle bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
                  <CardContent className="flex h-full flex-col p-6 md:p-8">
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary-light text-primary">
                      <Icon className="h-7 w-7" />
                    </div>
                    <h2 className="text-xl font-bold text-dark md:text-2xl">
                      {service.title}
                    </h2>
                    <p className="mt-3 text-body">{service.description}</p>
                    <ul className="mt-5 flex-1 space-y-2">
                      {service.items.map((item) => (
                        <li
                          key={item}
                          className="flex items-center gap-2 text-sm text-body"
                        >
                          <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <Link
                      href="/cotizacion"
                      className={cn(
                        buttonVariants({ size: "default" }),
                        "mt-6 w-full sm:w-auto"
                      )}
                    >
                      Solicitar info
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </CardContent>
                </Card>
              </FadeIn>
            )
          })}
        </div>
      </section>

      {/* Differentiators */}
      <section className="bg-bg-light py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-6">
          <FadeIn className="mb-12 text-center">
            <h2 className="text-2xl font-bold text-dark md:text-3xl">
              ¿Por qué confiar en nuestros servicios?
            </h2>
          </FadeIn>
          <div className="grid gap-6 sm:grid-cols-3">
            {differentiators.map((diff, index) => {
              const Icon = diff.icon
              return (
                <FadeIn key={diff.title} delay={index * 0.1}>
                  <Card className="h-full border-border-subtle bg-white text-center shadow-sm">
                    <CardContent className="p-6">
                      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary-light text-primary">
                        <Icon className="h-7 w-7" />
                      </div>
                      <h3 className="text-lg font-bold text-dark">{diff.title}</h3>
                      <p className="mt-2 text-sm text-body">{diff.description}</p>
                    </CardContent>
                  </Card>
                </FadeIn>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}
