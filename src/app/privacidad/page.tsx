import type { Metadata } from "next"
import {
  seoConfig,
  generateOpenGraph,
  generateTwitterCard,
  generateBreadcrumbJsonLd,
} from "@/lib/seo"

export const metadata: Metadata = {
  title: seoConfig.privacidad.title,
  description: seoConfig.privacidad.description,
  keywords: seoConfig.privacidad.keywords,
  alternates: { canonical: "/privacidad" },
  openGraph: generateOpenGraph("privacidad", "/privacidad"),
  twitter: generateTwitterCard("privacidad"),
}

export default function PrivacidadPage() {
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Inicio", path: "/" },
    { name: "Política de Privacidad", path: "/privacidad" },
  ])

  return (
    <div className="min-h-screen bg-white py-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <article className="container mx-auto max-w-4xl px-4 lg:px-6">
        <h1 className="text-3xl font-bold text-dark md:text-4xl">
          Política de Privacidad
        </h1>
        <p className="mt-4 text-body">
          Junisama Inversiones S.A.S, en cumplimiento de la Ley 1581 de 2012,
          el Decreto 1377 de 2013 y demás normas concordantes, presenta la
          siguiente política de tratamiento de datos personales.
        </p>

        <section className="mt-10 space-y-4">
          <h2 className="text-xl font-bold text-dark">1. Responsable del tratamiento</h2>
          <p className="text-body">
            <strong>Razón social:</strong> Junisama Inversiones S.A.S
            <br />
            <strong>Correo electrónico:</strong> soporte@junisama.com
            <br />
            <strong>Teléfono:</strong> +57 350 708 9584
            <br />
            <strong>Sedes:</strong> Medellín (Calle 13 sur #51C-54) y Bogotá
            (Cra 58b bis #131A 51).
          </p>
        </section>

        <section className="mt-8 space-y-4">
          <h2 className="text-xl font-bold text-dark">2. Datos recopilados</h2>
          <p className="text-body">
            Recopilamos datos personales como nombre, empresa, correo
            electrónico, teléfono, ciudad, tipo de evento y detalles del
            servicio solicitado. Estos datos son proporcionados de manera
            voluntaria por el titular al completar formularios de contacto o
            cotización.
          </p>
        </section>

        <section className="mt-8 space-y-4">
          <h2 className="text-xl font-bold text-dark">3. Finalidades del tratamiento</h2>
          <ul className="list-disc space-y-2 pl-5 text-body">
            <li>Atender solicitudes de información, cotización y servicio.</li>
            <li>Contactar al titular para confirmar detalles del evento u obra.</li>
            <li>Gestionar contratos, facturación y servicio postventa.</li>
            <li>Enviar comunicaciones comerciales cuando el titular haya autorizado.</li>
            <li>Cumplir con obligaciones legales y contractuales.</li>
          </ul>
        </section>

        <section className="mt-8 space-y-4">
          <h2 className="text-xl font-bold text-dark">4. Derechos de los titulares</h2>
          <p className="text-body">
            De acuerdo con la Ley 1581 de 2012, el titular de los datos tiene
            derecho a conocer, actualizar, rectificar y suprimir su información
            personal, así como a revocar la autorización otorgada para su
            tratamiento.
          </p>
        </section>

        <section className="mt-8 space-y-4">
          <h2 className="text-xl font-bold text-dark">5. Procedimiento para ejercer derechos</h2>
          <p className="text-body">
            Para consultas, reclamaciones o ejercer sus derechos, el titular
            puede enviar un correo electrónico a soporte@junisama.com con su
            nombre completo, identificación, descripción de la solicitud y
            datos de contacto. Responderemos en un término máximo de 15 días
            hábiles.
          </p>
        </section>

        <section className="mt-8 space-y-4">
          <h2 className="text-xl font-bold text-dark">6. Seguridad de la información</h2>
          <p className="text-body">
            Junisama adopta medidas técnicas, administrativas y físicas para
            proteger los datos personales contra acceso no autorizado, pérdida,
            alteración o divulgación.
          </p>
        </section>

        <section className="mt-8 space-y-4">
          <h2 className="text-xl font-bold text-dark">7. Modificaciones</h2>
          <p className="text-body">
            La presente política puede ser modificada en cualquier momento.
            Cualquier cambio será publicado en esta página con su fecha de
            actualización correspondiente.
          </p>
        </section>

        <p className="mt-10 text-sm text-muted">
          Última actualización: {new Date().getFullYear()}
        </p>
      </article>
    </div>
  )
}
