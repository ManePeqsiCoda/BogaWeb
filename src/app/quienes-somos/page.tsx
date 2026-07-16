import type { Metadata } from "next"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FadeIn } from "@/components/home/fade-in"
import {
  Sparkles,
  Zap,
  Smile,
  Droplets,
  Bath,
  HandHelping,
  Wrench,
  Leaf,
  Recycle,
  Wind,
} from "lucide-react"
import {
  seoConfig,
  generateOpenGraph,
  generateTwitterCard,
  generateBreadcrumbJsonLd,
} from "@/lib/seo"

export const metadata: Metadata = {
  title: seoConfig["quienes-somos"].title,
  description: seoConfig["quienes-somos"].description,
  keywords: seoConfig["quienes-somos"].keywords,
  alternates: { canonical: "/quienes-somos" },
  openGraph: generateOpenGraph("quienes-somos", "/quienes-somos"),
  twitter: generateTwitterCard("quienes-somos"),
}

const commitments = [
  {
    icon: Sparkles,
    title: "Altos estándares de higiene",
    description:
      "Protocolos de limpieza y desinfección certificados para garantizar la salud de los usuarios.",
  },
  {
    icon: Zap,
    title: "Máxima eficiencia",
    description:
      "Logística optimizada, tiempos de respuesta rápidos y operación sin contratiempos.",
  },
  {
    icon: Smile,
    title: "Experiencia superior",
    description:
      "Atención cercana y profesional para que tu evento u obra transcurra sin preocupaciones.",
  },
]

const equipment = [
  { icon: Droplets, label: "Duchas" },
  { icon: Bath, label: "Baños" },
  { icon: HandHelping, label: "Lavamanos" },
  { icon: Wrench, label: "Equipos especializados" },
]

const environmental = [
  {
    icon: Leaf,
    title: "Insumos biodegradables",
    description: "Papel, jabones y desinfectantes amigables con el medio ambiente.",
  },
  {
    icon: Recycle,
    title: "Descomposición de materia",
    description: "Procesos que minimizan el impacto ambiental de los residuos.",
  },
  {
    icon: Wind,
    title: "Eliminación de olores",
    description: "Tecnología de neutralización para espacios frescos y limpios.",
  },
]

const sedes = [
  {
    city: "Medellín",
    address: "Calle 13 sur #51C-54",
    mapUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.521260322283!2d-75.612!3d6.208!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMTInMjguOCJOIDc1wrAzNic0My4yIlc!5e0!3m2!1ses!2sco!4v1600000000000!5m2!1ses!2sco",
  },
  {
    city: "Bogotá",
    address: "Cra 58b bis #131A 51",
    mapUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3976.123456789012!2d-74.085!3d4.710!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNMKwNDInMzYuMCJOIDc0wrAwNScwNi4wIlc!5e0!3m2!1ses!2sco!4v1600000000000!5m2!1ses!2sco",
  },
]

export default function QuienesSomosPage() {
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Inicio", path: "/" },
    { name: "Quiénes Somos", path: "/quienes-somos" },
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
          <Badge className="mb-4 border-0 bg-accent-gold/15 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-accent-gold hover:bg-accent-gold/15">
            Más de 10 años de experiencia
          </Badge>
          <h1 className="text-3xl font-extrabold text-white md:text-5xl">
            Nuestra Empresa
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-text-on-dark-muted">
            Infraestructura sanitaria industrial con respaldo, tecnología y
            compromiso ambiental
          </p>
        </div>
      </section>

      {/* About */}
      <section className="container mx-auto px-4 py-16 lg:px-6 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <FadeIn direction="left">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-bg-light">
              <Image
                src="/images/productos/placeholder.svg"
                alt="Equipo Junisama"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </FadeIn>
          <FadeIn direction="right">
            <div className="space-y-5">
              <h2 className="text-2xl font-bold text-dark md:text-3xl">
                Nuestra Empresa
              </h2>
              <p className="text-body">
                Somos una empresa especializada en el alquiler y operación de
                unidades sanitarias portátiles para eventos de diversa magnitud.
                Desde conciertos masivos y ferias corporativas hasta obras de
                construcción y campamentos industriales, brindamos soluciones
                confiables que cumplen con los más altos estándares de higiene y
                servicio.
              </p>
              <p className="text-body">
                Con más de una década de trayectoria en Colombia, hemos
                acompañado eventos icónicos como la Feria de las Flores,
                conciertos internacionales y visitas de alto perfil. Nuestra
                flota, nuestro equipo humano y nuestros protocolos están
                preparados para responder con eficiencia y profesionalismo.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Commitments */}
      <section className="bg-bg-light py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-6">
          <FadeIn className="mb-12 text-center">
            <h2 className="text-2xl font-bold text-dark md:text-3xl">
              Nuestro Compromiso
            </h2>
          </FadeIn>
          <div className="grid gap-6 md:grid-cols-3">
            {commitments.map((item, index) => {
              const Icon = item.icon
              return (
                <FadeIn key={item.title} delay={index * 0.1}>
                  <Card className="h-full border-border-subtle bg-white text-center shadow-sm">
                    <CardContent className="p-6">
                      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary-light text-primary">
                        <Icon className="h-7 w-7" />
                      </div>
                      <h3 className="text-lg font-bold text-dark">{item.title}</h3>
                      <p className="mt-2 text-sm text-body">{item.description}</p>
                    </CardContent>
                  </Card>
                </FadeIn>
              )
            })}
          </div>
        </div>
      </section>

      {/* Equipment */}
      <section className="container mx-auto px-4 py-16 lg:px-6 lg:py-24">
        <FadeIn className="mb-12 text-center">
          <h2 className="text-2xl font-bold text-dark md:text-3xl">
            Equipos Disponibles
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-body">
            Contamos con una flota diversa para cubrir cualquier necesidad
          </p>
        </FadeIn>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {equipment.map((item, index) => {
            const Icon = item.icon
            return (
              <FadeIn key={item.label} delay={index * 0.1}>
                <Card className="border-border-subtle bg-white text-center shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
                  <CardContent className="flex flex-col items-center p-6">
                    <Icon className="h-10 w-10 text-primary" />
                    <span className="mt-3 font-semibold text-dark">{item.label}</span>
                  </CardContent>
                </Card>
              </FadeIn>
            )
          })}
        </div>
      </section>

      {/* Technical service */}
      <section className="bg-secondary py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <FadeIn direction="left">
              <div className="space-y-5">
                <h2 className="text-2xl font-bold text-white md:text-3xl">
                  Servicio Técnico
                </h2>
                <p className="text-text-on-dark-muted">
                  Nuestro equipo de mantenimiento cuenta con vehículos tipo
                  vactor y unidades móviles equipadas para atender cualquier
                  situación en campo. Realizamos limpieza profunda,
                  desinfección, reposición de insumos y revisión técnica
                  preventiva para garantizar el funcionamiento óptimo de cada
                  unidad.
                </p>
                <p className="text-text-on-dark-muted">
                  Operamos con turnos flexibles y cobertura 24/7, asegurando
                  que tu evento u obra nunca se detenga por problemas de
                  infraestructura sanitaria.
                </p>
              </div>
            </FadeIn>
            <FadeIn direction="right">
              <div className="relative aspect-video overflow-hidden rounded-2xl bg-white/5">
                <Image
                  src="/images/productos/placeholder.svg"
                  alt="Servicio técnico Junisama"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Environmental commitment */}
      <section className="container mx-auto px-4 py-16 lg:px-6 lg:py-24">
        <FadeIn className="mb-12 text-center">
          <h2 className="text-2xl font-bold text-dark md:text-3xl">
            Compromiso Ambiental
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-body">
            Prácticas sostenibles que cuidan el entorno sin comprometer la calidad
          </p>
        </FadeIn>
        <div className="grid gap-6 md:grid-cols-3">
          {environmental.map((item, index) => {
            const Icon = item.icon
            return (
              <FadeIn key={item.title} delay={index * 0.1}>
                <Card className="h-full border-border-subtle bg-white shadow-sm">
                  <CardContent className="p-6">
                    <Icon className="h-10 w-10 text-accent-gold" />
                    <h3 className="mt-4 text-lg font-bold text-dark">{item.title}</h3>
                    <p className="mt-2 text-sm text-body">{item.description}</p>
                  </CardContent>
                </Card>
              </FadeIn>
            )
          })}
        </div>
      </section>

      {/* Locations */}
      <section className="bg-bg-light py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-6">
          <FadeIn className="mb-12 text-center">
            <h2 className="text-2xl font-bold text-dark md:text-3xl">
              Nuestras Sedes
            </h2>
          </FadeIn>
          <div className="grid gap-8 lg:grid-cols-2">
            {sedes.map((sede, index) => (
              <FadeIn key={sede.city} delay={index * 0.1}>
                <Card className="overflow-hidden border-border-subtle bg-white shadow-sm">
                  <CardContent className="p-0">
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-dark">{sede.city}</h3>
                      <p className="mt-1 text-body">{sede.address}</p>
                    </div>
                    <iframe
                      src={sede.mapUrl}
                      width="100%"
                      height="300"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title={`Mapa ${sede.city}`}
                      className="grayscale-[20%]"
                    />
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
