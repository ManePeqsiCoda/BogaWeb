import type { Metadata } from "next"
import { Hero } from "@/components/home/hero"
import { ClientMarquee } from "@/components/client-marquee"
import { BogaValues } from "@/components/home/boga-values"
import { ProductGrid } from "@/components/product-grid"
import { WhyUs } from "@/components/home/why-us"
import { Contact } from "@/components/home/contact"
import { BogaCircles } from "@/components/brand/boga-circles"
import { getProductosDestacados } from "@/lib/mocks"
import {
  seoConfig,
  generateOpenGraph,
  generateTwitterCard,
} from "@/lib/seo"

export const metadata: Metadata = {
  title: seoConfig.home.title,
  description: seoConfig.home.description,
  keywords: seoConfig.home.keywords,
  alternates: { canonical: "/" },
  openGraph: generateOpenGraph("home", "/"),
  twitter: generateTwitterCard("home"),
}

export default function HomePage() {
  const productosDestacados = getProductosDestacados(4)

  return (
    <>
      <Hero />
      <ClientMarquee />
      <BogaValues />
      <section className="bg-boga-surface-canvas py-16 md:py-24">
        <div className="container-boga">
          <div className="mb-12 text-center">
            <span className="mb-3 inline-flex items-center gap-2 text-caption uppercase tracking-wider text-boga-electric-500">
              <BogaCircles size="s" tone="electric" />
              Servicios destacados
            </span>
            <h2 className="font-sans text-heading-lg text-boga-text-primary md:text-display-md">
              Nuestras soluciones
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-boga-text-secondary">
              Equipos sanitarios portátiles para todo tipo de evento
            </p>
          </div>
          <ProductGrid
            productos={productosDestacados}
            columns={2}
            showViewAll
            viewAllHref="/servicios"
          />
        </div>
      </section>
      <WhyUs />
      <Contact />
    </>
  )
}
