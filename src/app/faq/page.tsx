import type { Metadata } from "next"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { FaqAccordion } from "./faq-accordion"
import { FadeIn } from "@/components/home/fade-in"
import { ArrowRight } from "lucide-react"
import {
  seoConfig,
  generateOpenGraph,
  generateTwitterCard,
  generateBreadcrumbJsonLd,
} from "@/lib/seo"

export const metadata: Metadata = {
  title: seoConfig.faq.title,
  description: seoConfig.faq.description,
  keywords: seoConfig.faq.keywords,
  alternates: { canonical: "/faq" },
  openGraph: generateOpenGraph("faq", "/faq"),
  twitter: generateTwitterCard("faq"),
}

const categoryLabels: Record<string, string> = {
  GENERAL: "General",
  PRODUCTOS: "Productos",
  SERVICIOS: "Servicios",
  PRECIOS: "Precios",
  EVENTOS: "Eventos",
}

export default async function FaqPage() {
  const faqs = await prisma.faq.findMany({
    where: { estado: "PUBLICADO" },
    orderBy: [{ categoria: "asc" }, { orden: "asc" }],
  })

  const categories = Array.from(
    new Set(faqs.map((f) => f.categoria))
  ) as string[]

  const mainEntity = faqs.map((faq) => ({
    "@type": "Question",
    name: faq.pregunta,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.respuesta,
    },
  }))

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity,
  }

  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Inicio", path: "/" },
    { name: "Preguntas Frecuentes", path: "/faq" },
  ])

  return (
    <div className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([breadcrumbJsonLd, jsonLd]),
        }}
      />

      {/* Hero */}
      <section className="bg-secondary pb-16 pt-32">
        <div className="container mx-auto px-4 text-center lg:px-6">
          <h1 className="text-3xl font-extrabold text-white md:text-5xl">
            Preguntas Frecuentes
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-text-on-dark-muted">
            Resolvemos tus dudas sobre nuestros productos y servicios
          </p>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="container mx-auto -mt-8 px-4 pb-20 lg:px-6">
        <FaqAccordion
          faqs={faqs}
          categories={categories}
          categoryLabels={categoryLabels}
        />

        <FadeIn delay={0.2} className="mt-16 text-center">
          <div className="rounded-2xl bg-bg-light px-6 py-10 md:px-12">
            <h2 className="text-xl font-bold text-dark md:text-2xl">
              ¿Tienes otra pregunta?
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-body">
              Nuestro equipo está listo para ayudarte. Escríbenos y te
              responderemos en menos de 24 horas.
            </p>
            <Button
              size="lg"
              className="mt-6 px-8"
              render={(
                <Link href="/contacto">
                  Contáctanos
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              )}
            />
          </div>
        </FadeIn>
      </section>
    </div>
  )
}
