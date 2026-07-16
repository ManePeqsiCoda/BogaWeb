import { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { buttonVariants } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { FadeIn } from "@/components/home/fade-in"
import { cn } from "@/lib/utils"
import {
  ChevronRight,
  ArrowRight,
  Star,
  Bath,
  Accessibility,
  Users,
  Leaf,
} from "lucide-react"
import {
  siteConfig,
  generateBreadcrumbJsonLd,
} from "@/lib/seo"

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Crown: Star,
  Bath: Bath,
  Accessibility: Accessibility,
  Leaf: Leaf,
  Users: Users,
}

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const productos = await prisma.producto.findMany({
    where: { estado: "ACTIVO" },
    select: { slug: true },
  })

  return productos.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params
  const producto = await prisma.producto.findUnique({
    where: { slug },
    select: {
      seoTitle: true,
      seoDescription: true,
      nombre: true,
      imagenPrincipal: true,
    },
  })

  if (!producto) {
    return {
      title: "Producto no encontrado",
    }
  }

  const title =
    producto.seoTitle ||
    `${producto.nombre} | Alquiler en Colombia | Junisama`
  const description =
    producto.seoDescription ||
    `Conoce el ${producto.nombre} de Junisama. Soluciones sanitarias portátiles para eventos y obras en Colombia.`

  return {
    title,
    description,
    alternates: { canonical: `/productos/${slug}` },
    openGraph: {
      title,
      description,
      url: `${siteConfig.url}/productos/${slug}`,
      siteName: siteConfig.fullName,
      locale: siteConfig.locale,
      type: "website",
      images: [
        {
          url: `${siteConfig.url}${producto.imagenPrincipal}`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${siteConfig.url}${producto.imagenPrincipal}`],
    },
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params
  const producto = await prisma.producto.findUnique({
    where: { slug },
    include: { categoria: true },
  })

  if (!producto) {
    notFound()
  }

  const relatedProducts = await prisma.producto.findMany({
    where: {
      categoriaId: producto.categoriaId,
      estado: "ACTIVO",
      id: { not: producto.id },
    },
    include: { categoria: true },
    take: 3,
    orderBy: { orden: "asc" },
  })

  const especificaciones =
    typeof producto.especificaciones === "object" &&
    producto.especificaciones !== null
      ? (producto.especificaciones as Record<string, string | number>)
      : {}

  const imagenes =
    Array.isArray(producto.imagenes) && producto.imagenes.length > 0
      ? [producto.imagenPrincipal, ...(producto.imagenes as string[])]
      : [producto.imagenPrincipal]

  const Icon = iconMap[producto.categoria.icono || ""] || Bath

  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Inicio", path: "/" },
    { name: "Productos", path: "/productos" },
    { name: producto.nombre, path: `/productos/${slug}` },
  ])

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: producto.nombre,
    description: producto.descripcion,
    image: `${siteConfig.url}${producto.imagenPrincipal}`,
    brand: {
      "@type": "Brand",
      name: siteConfig.fullName,
    },
    offers: {
      "@type": "Offer",
      url: `${siteConfig.url}/productos/${slug}`,
      priceCurrency: "COP",
      price: producto.precioBase?.toString() || "0",
      availability: "https://schema.org/InStock",
    },
  }

  return (
    <div className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([breadcrumbJsonLd, productJsonLd]),
        }}
      />

      {/* Breadcrumb */}
      <div className="border-b border-border-subtle bg-bg-light">
        <div className="container mx-auto px-4 py-4 lg:px-6">
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-1 text-sm">
              <li>
                <Link href="/" className="text-muted hover:text-primary">
                  Inicio
                </Link>
              </li>
              <ChevronRight className="h-4 w-4 text-muted" />
              <li>
                <Link
                  href="/productos"
                  className="text-muted hover:text-primary"
                >
                  Productos
                </Link>
              </li>
              <ChevronRight className="h-4 w-4 text-muted" />
              <li>
                <span className="font-medium text-dark">{producto.nombre}</span>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Hero product */}
      <section className="container mx-auto px-4 py-12 lg:px-6 lg:py-20">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <FadeIn direction="left">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <Badge className="bg-accent-gold text-white hover:bg-accent-gold">
                  {producto.badge || producto.categoria.nombre}
                </Badge>
                <span className="text-sm text-muted">
                  {producto.categoria.nombre}
                </span>
              </div>
              <h1 className="text-3xl font-extrabold text-dark md:text-4xl lg:text-5xl">
                {producto.nombre}
              </h1>
              <p className="text-lg text-body">{producto.descripcion}</p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/cotizacion"
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "px-8 font-semibold"
                  )}
                >
                  Solicitar cotización
                </Link>
                <Link
                  href="/productos"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "lg" }),
                    "px-8"
                  )}
                >
                  Ver todos los productos
                </Link>
              </div>
            </div>
          </FadeIn>

          <FadeIn direction="right">
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-bg-light lg:aspect-[4/3]">
              <Image
                src={producto.imagenPrincipal || "/images/productos/placeholder.svg"}
                alt={producto.nombre}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute top-4 left-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white/90 text-primary shadow-sm">
                <Icon className="h-6 w-6" />
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Specifications */}
      <section className="bg-bg-light py-12 lg:py-20">
        <div className="container mx-auto px-4 lg:px-6">
          <FadeIn>
            <h2 className="mb-8 text-center text-2xl font-bold text-dark md:text-3xl">
              Especificaciones técnicas
            </h2>
          </FadeIn>
          <FadeIn delay={0.1}>
            <Card className="mx-auto max-w-3xl border-border-subtle">
              <CardContent className="p-0">
                <dl>
                  {Object.entries(especificaciones).map(([key, value], index, arr) => {
                    const label = key
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, (str) => str.toUpperCase())
                    return (
                      <div key={key}>
                        <div className="flex items-center justify-between px-6 py-4">
                          <dt className="text-sm font-medium text-muted">
                            {label}
                          </dt>
                          <dd className="text-right font-semibold text-dark">
                            {Array.isArray(value)
                              ? value.join(", ")
                              : String(value)}
                          </dd>
                        </div>
                        {index < arr.length - 1 && (
                          <Separator className="last:hidden" />
                        )}
                      </div>
                    )
                  })}
                </dl>
              </CardContent>
            </Card>
          </FadeIn>
        </div>
      </section>

      {/* Gallery */}
      <section className="container mx-auto px-4 py-12 lg:px-6 lg:py-20">
        <FadeIn>
          <h2 className="mb-8 text-center text-2xl font-bold text-dark md:text-3xl">
            Galería
          </h2>
        </FadeIn>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {imagenes.slice(0, 4).map((imagen, index) => (
            <FadeIn key={`${imagen}-${index}`} delay={index * 0.1}>
              <div className="group relative aspect-square overflow-hidden rounded-xl bg-bg-light">
                <Image
                  src={imagen || "/images/productos/placeholder.svg"}
                  alt={`${producto.nombre} - imagen ${index + 1}`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* Related products */}
      {relatedProducts.length > 0 && (
        <section className="bg-bg-warm py-12 lg:py-20">
          <div className="container mx-auto px-4 lg:px-6">
            <FadeIn>
              <h2 className="mb-8 text-center text-2xl font-bold text-dark md:text-3xl">
                Productos relacionados
              </h2>
            </FadeIn>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedProducts.map((related, index) => {
                const RelatedIcon =
                  iconMap[related.categoria.icono || ""] || Bath
                return (
                  <FadeIn key={related.id} delay={index * 0.1}>
                    <Card className="group h-full overflow-hidden border-border-subtle bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
                      <Link href={`/productos/${related.slug}`}>
                        <div className="relative h-48 overflow-hidden bg-bg-light">
                          <Image
                            src={related.imagenPrincipal || "/images/productos/placeholder.svg"}
                            alt={related.nombre}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            loading="lazy"
                          />
                        </div>
                      </Link>
                      <CardContent className="p-5">
                        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary-light text-primary">
                          <RelatedIcon className="h-5 w-5" />
                        </div>
                        <h3 className="text-lg font-bold text-dark">
                          <Link
                            href={`/productos/${related.slug}`}
                            className="hover:text-primary"
                          >
                            {related.nombre}
                          </Link>
                        </h3>
                        <p className="mt-2 text-sm text-body">
                          {related.descripcionCorta}
                        </p>
                        <Link
                          href={`/productos/${related.slug}`}
                          className="mt-4 inline-flex items-center text-sm font-semibold text-primary hover:text-primary-hover"
                        >
                          Ver más
                          <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                      </CardContent>
                    </Card>
                  </FadeIn>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* Final CTA */}
      <section className="bg-secondary py-16 lg:py-24">
        <div className="container mx-auto px-4 text-center lg:px-6">
          <FadeIn>
            <h2 className="text-2xl font-bold text-white md:text-4xl">
              ¿Listo para tu evento?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-text-on-dark-muted">
              Solicita una cotización personalizada y recibe asesoría de
              nuestro equipo en menos de 24 horas.
            </p>
            <Link
              href="/cotizacion"
              className={cn(
                buttonVariants({ size: "lg" }),
                "mt-8 px-8 font-semibold"
              )}
            >
              Solicita una cotización
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </FadeIn>
        </div>
      </section>
    </div>
  )
}
