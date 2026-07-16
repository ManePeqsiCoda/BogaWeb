import type { Metadata } from "next"
import { Hero } from "@/components/home/hero"
import { ClientMarquee } from "@/components/client-marquee"
import { ProductGrid } from "@/components/product-grid"
import { WhyUs } from "@/components/home/why-us"
import { OurNumbers } from "@/components/our-numbers"
import { Contact } from "@/components/home/contact"
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
      <ProductGrid productos={productosDestacados} columns={4} />
      <WhyUs />
      <OurNumbers />
      <Contact />
    </>
  )
}
