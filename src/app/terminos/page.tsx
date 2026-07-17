import type { Metadata } from "next"
import {
  seoConfig,
  generateOpenGraph,
  generateTwitterCard,
  generateBreadcrumbJsonLd,
} from "@/lib/seo"
import { siteConfig } from "@/lib/site"

export const metadata: Metadata = {
  title: seoConfig.terminos.title,
  description: seoConfig.terminos.description,
  keywords: seoConfig.terminos.keywords,
  alternates: { canonical: "/terminos" },
  openGraph: generateOpenGraph("terminos", "/terminos"),
  twitter: generateTwitterCard("terminos"),
}

export default function TerminosPage() {
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Inicio", path: "/" },
    { name: "Términos y Condiciones", path: "/terminos" },
  ])

  return (
    <div className="min-h-screen bg-white py-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <article className="container mx-auto max-w-4xl px-4 lg:px-6">
        <h1 className="text-3xl font-bold text-dark md:text-4xl">
          Términos y Condiciones
        </h1>
        <p className="mt-4 text-body">
          El acceso y uso del sitio web de {siteConfig.legalName} implica la
          aceptación de los siguientes términos y condiciones de uso.
        </p>

        <section className="mt-10 space-y-4">
          <h2 className="text-xl font-bold text-dark">1. Información general</h2>
          <p className="text-body">
            Este sitio web es operado por {siteConfig.legalName}, con sedes
            en Medellín y Bogotá, Colombia. Nuestro teléfono de contacto es {siteConfig.phone}
            y nuestro correo electrónico es {siteConfig.email}.
          </p>
        </section>

        <section className="mt-8 space-y-4">
          <h2 className="text-xl font-bold text-dark">2. Uso del sitio</h2>
          <p className="text-body">
            El usuario se compromete a utilizar el sitio web de manera lícita,
            respetando la legislación colombiana vigente y los derechos de
            terceros. Queda prohibido el uso del sitio para fines ilícitos,
            fraudulentos o que puedan dañar la imagen de {siteConfig.name}.
          </p>
        </section>

        <section className="mt-8 space-y-4">
          <h2 className="text-xl font-bold text-dark">3. Propiedad intelectual</h2>
          <p className="text-body">
            Todos los contenidos del sitio, incluyendo textos, imágenes, logos,
            diseño y código, son propiedad de {siteConfig.legalName} o de
            terceros que han autorizado su uso. Queda prohibida su reproducción,
            distribución o comunicación pública sin autorización expresa.
          </p>
        </section>

        <section className="mt-8 space-y-4">
          <h2 className="text-xl font-bold text-dark">4. Cotizaciones y contratación</h2>
          <p className="text-body">
            Las cotizaciones realizadas a través del sitio web son preliminares
            y están sujetas a confirmación por parte de {siteConfig.name}. La
            contratación de servicios se formaliza mediante orden de servicio o
            contrato escrito, según corresponda.
          </p>
        </section>

        <section className="mt-8 space-y-4">
          <h2 className="text-xl font-bold text-dark">5. Limitación de responsabilidad</h2>
          <p className="text-body">
            {siteConfig.name} no garantiza la disponibilidad ininterrumpida del sitio
            web. No nos hacemos responsables por daños derivados del acceso o
            uso del sitio, salvo que resulten de dolo o negligencia grave.
          </p>
        </section>

        <section className="mt-8 space-y-4">
          <h2 className="text-xl font-bold text-dark">6. Modificaciones</h2>
          <p className="text-body">
            {siteConfig.name} se reserva el derecho de modificar estos términos y
            condiciones en cualquier momento. Los cambios entrarán en vigor
            desde su publicación en esta página.
          </p>
        </section>

        <section className="mt-8 space-y-4">
          <h2 className="text-xl font-bold text-dark">7. Ley aplicable</h2>
          <p className="text-body">
            Estos términos se rigen por las leyes de la República de Colombia.
            Cualquier controversia será sometida a los jueces y tribunales de
            la ciudad de Medellín.
          </p>
        </section>

        <p className="mt-10 text-sm text-muted">
          Última actualización: {new Date().getFullYear()}
        </p>
      </article>
    </div>
  )
}
