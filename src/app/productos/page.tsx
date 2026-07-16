import type { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import { ProductCatalog } from "./product-catalog"
import {
  seoConfig,
  generateOpenGraph,
  generateTwitterCard,
  generateBreadcrumbJsonLd,
} from "@/lib/seo"

export const metadata: Metadata = {
  title: seoConfig.productos.title,
  description: seoConfig.productos.description,
  keywords: seoConfig.productos.keywords,
  alternates: { canonical: "/productos" },
  openGraph: generateOpenGraph("productos", "/productos"),
  twitter: generateTwitterCard("productos"),
}

export default async function ProductosPage() {
  const [productos, categorias] = await Promise.all([
    prisma.producto.findMany({
      where: { estado: "ACTIVO" },
      include: { categoria: true },
      orderBy: { orden: "asc" },
    }),
    prisma.categoria.findMany({ orderBy: { orden: "asc" } }),
  ])

  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Inicio", path: "/" },
    { name: "Productos", path: "/productos" },
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
            Nuestros Productos
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-text-on-dark-muted">
            Soluciones sanitarias portátiles para todo tipo de evento
          </p>
        </div>
      </section>

      <ProductCatalog productos={productos} categorias={categorias} />
    </div>
  )
}
