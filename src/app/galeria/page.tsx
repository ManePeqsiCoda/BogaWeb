import type { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import { GalleryGrid } from "./gallery-grid"
import {
  seoConfig,
  generateOpenGraph,
  generateTwitterCard,
  generateBreadcrumbJsonLd,
} from "@/lib/seo"

export const metadata: Metadata = {
  title: seoConfig.galeria.title,
  description: seoConfig.galeria.description,
  keywords: seoConfig.galeria.keywords,
  alternates: { canonical: "/galeria" },
  openGraph: generateOpenGraph("galeria", "/galeria"),
  twitter: generateTwitterCard("galeria"),
}

export default async function GaleriaPage() {
  const eventos = await prisma.evento.findMany({
    where: { estado: "PUBLICADO" },
    orderBy: { anio: "desc" },
  })

  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Inicio", path: "/" },
    { name: "Galería", path: "/galeria" },
  ])

  return (
    <div className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <GalleryGrid eventos={eventos} />
    </div>
  )
}
