import type { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import { QuoteWizard } from "./quote-wizard"
import {
  seoConfig,
  generateOpenGraph,
  generateTwitterCard,
  generateBreadcrumbJsonLd,
} from "@/lib/seo"

export const metadata: Metadata = {
  title: seoConfig.cotizacion.title,
  description: seoConfig.cotizacion.description,
  keywords: seoConfig.cotizacion.keywords,
  alternates: { canonical: "/cotizacion" },
  openGraph: generateOpenGraph("cotizacion", "/cotizacion"),
  twitter: generateTwitterCard("cotizacion"),
}

export default async function CotizacionPage() {
  const productos = await prisma.producto.findMany({
    where: { estado: "ACTIVO" },
    orderBy: { orden: "asc" },
  })

  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Inicio", path: "/" },
    { name: "Cotización", path: "/cotizacion" },
  ])

  return (
    <div className="min-h-screen bg-bg-light">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <QuoteWizard productos={productos} />
    </div>
  )
}
