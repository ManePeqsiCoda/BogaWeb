import type { Metadata } from "next"
import {
  seoConfig,
  generateOpenGraph,
  generateTwitterCard,
  generateBreadcrumbJsonLd,
} from "@/lib/seo"
import { siteConfig } from "@/lib/site"

export const metadata: Metadata = {
  title: seoConfig.cookies.title,
  description: seoConfig.cookies.description,
  keywords: seoConfig.cookies.keywords,
  alternates: { canonical: "/cookies" },
  openGraph: generateOpenGraph("cookies", "/cookies"),
  twitter: generateTwitterCard("cookies"),
}

export default function CookiesPage() {
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Inicio", path: "/" },
    { name: "Política de Cookies", path: "/cookies" },
  ])

  return (
    <div className="min-h-screen bg-white py-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <article className="container mx-auto max-w-4xl px-4 lg:px-6">
        <h1 className="text-3xl font-bold text-dark md:text-4xl">
          Política de Cookies
        </h1>
        <p className="mt-4 text-body">
          {siteConfig.legalName} utiliza cookies y tecnologías similares en
          su sitio web para mejorar la experiencia del usuario y analizar el
          tráfico de la plataforma.
        </p>

        <section className="mt-10 space-y-4">
          <h2 className="text-xl font-bold text-dark">1. ¿Qué son las cookies?</h2>
          <p className="text-body">
            Las cookies son pequeños archivos de texto que se almacenan en el
            dispositivo del usuario al visitar un sitio web. Estas permiten
            recordar información sobre la navegación y preferencias del usuario.
          </p>
        </section>

        <section className="mt-8 space-y-4">
          <h2 className="text-xl font-bold text-dark">2. Tipos de cookies que utilizamos</h2>
          <ul className="list-disc space-y-2 pl-5 text-body">
            <li>
              <strong>Cookies técnicas:</strong> necesarias para el
              funcionamiento básico del sitio web.
            </li>
            <li>
              <strong>Cookies de preferencias:</strong> permiten recordar
              configuraciones seleccionadas por el usuario.
            </li>
            <li>
              <strong>Cookies analíticas:</strong> ayudan a comprender cómo los
              usuarios interactúan con el sitio.
            </li>
          </ul>
        </section>

        <section className="mt-8 space-y-4">
          <h2 className="text-xl font-bold text-dark">3. Gestión de cookies</h2>
          <p className="text-body">
            El usuario puede configurar su navegador para aceptar, rechazar o
            eliminar cookies. Sin embargo, algunas funcionalidades del sitio
            pueden no estar disponibles si se deshabilitan las cookies
            técnicas.
          </p>
        </section>

        <section className="mt-8 space-y-4">
          <h2 className="text-xl font-bold text-dark">4. Terceros</h2>
          <p className="text-body">
            El sitio puede utilizar servicios de terceros como Google Maps o
            WhatsApp, los cuales pueden utilizar sus propias cookies de acuerdo
            con sus políticas de privacidad.
          </p>
        </section>

        <section className="mt-8 space-y-4">
          <h2 className="text-xl font-bold text-dark">5. Cambios en la política</h2>
          <p className="text-body">
            {siteConfig.name} puede actualizar esta política de cookies en cualquier
            momento. Se recomienda revisar periódicamente esta página para
            conocer las actualizaciones.
          </p>
        </section>

        <p className="mt-10 text-sm text-muted">
          Última actualización: {new Date().getFullYear()}
        </p>
      </article>
    </div>
  )
}
