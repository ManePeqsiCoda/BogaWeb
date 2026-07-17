export { siteConfig } from "@/lib/site"
import { siteConfig } from "@/lib/site"

export const seoConfig = {
  home: {
    title:
      "BOGA | Alquiler de Baños Portátiles en Colombia | Ingeniería Portátil 24/7",
    description:
      "BOGA ofrece alquiler de baños portátiles y unidades sanitarias para eventos en Colombia. Servicio premium con baños VIP, estándar, eléctricos y para discapacitados. Operarios profesionales disponibles 24/7.",
    keywords:
      "baños portátiles Colombia, alquiler baños portátiles, baños portátiles Medellín, baños portátiles Bogotá, baños portátiles VIP, baños portátiles eventos, unidades sanitarias portátiles, ingeniería portátil, baños para discapacitados, tráiler de lujo sanitario",
  },
  productos: {
    title: "Productos | Baños Portátiles y Unidades Sanitarias BOGA",
    description:
      "Catálogo BOGA de baños portátiles VIP, estándar, eléctricos, para discapacitados, lavamanos, trailers de lujo y puntos ecológicos en Colombia.",
    keywords:
      "baños portátiles, baño VIP, baño estándar, lavamanos portátil, trailer de lujo",
  },
  servicios: {
    title: "Servicios Especializados | Alquiler y Operación BOGA",
    description:
      "Alquiler de unidades sanitarias, mantenimiento especializado, operarios certificados e insumos biodegradables para eventos y obras.",
    keywords:
      "servicios sanitarios, operarios para baños, mantenimiento baños portátiles",
  },
  galeria: {
    title: "Galería | Eventos Atendidos por BOGA",
    description:
      "Conoce los eventos de gran magnitud que han confiado en BOGA para su ingeniería portátil sanitaria.",
    keywords: "eventos atendidos, galería BOGA, baños para eventos",
  },
  clientes: {
    title: "Clientes | Quiénes Confían en BOGA",
    description:
      "Empresas, festivales, conciertos y organizaciones que confían en BOGA para sus eventos en Colombia.",
    keywords: "clientes BOGA, testimonios, eventos corporativos",
  },
  "quienes-somos": {
    title: "Nuestra Empresa | BOGA — Ingeniería Portátil",
    description:
      "Más de 10 años de experiencia en alquiler y operación de unidades sanitarias portátiles para eventos y obras en Colombia.",
    keywords: "BOGA, empresa baños portátiles, ingeniería portátil",
  },
  faq: {
    title: "Preguntas Frecuentes | BOGA",
    description:
      "Resolvemos tus dudas sobre baños portátiles, servicios, cotizaciones y atención de eventos en Colombia.",
    keywords: "preguntas frecuentes, FAQ baños portátiles",
  },
  contacto: {
    title: "Contacto | BOGA",
    description:
      "Contácta a BOGA. Línea directa +57 350 708 9584, WhatsApp 24/7, sedes en Medellín y Bogotá. Solicita tu cotización.",
    keywords: "contacto BOGA, cotización baños portátiles",
  },
  cotizacion: {
    title: "Solicitar Cotización | BOGA",
    description:
      "Solicita una cotización personalizada para tu evento u obra. Baños portátiles, lavamanos, trailers de lujo y operarios profesionales.",
    keywords: "cotizar baños portátiles, cotización eventos",
  },
  privacidad: {
    title: "Política de Privacidad | BOGA",
    description:
      "Política de privacidad de BOGA conforme a la Ley 1581 de 2012 de Colombia.",
    keywords: "política de privacidad, protección de datos",
  },
  terminos: {
    title: "Términos y Condiciones | BOGA",
    description:
      "Términos y condiciones de uso del sitio web de BOGA.",
    keywords: "términos y condiciones",
  },
  cookies: {
    title: "Política de Cookies | BOGA",
    description:
      "Política de cookies del sitio web de BOGA.",
    keywords: "política de cookies",
  },
}

export function generateOpenGraph(
  page: keyof typeof seoConfig,
  path: string = "/"
) {
  const config = seoConfig[page]
  return {
    title: config.title,
    description: config.description,
    url: `${siteConfig.url}${path}`,
    siteName: siteConfig.fullName,
    locale: siteConfig.locale,
    type: "website",
    images: [
      {
        url: `${siteConfig.url}/images/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: config.title,
      },
    ],
  }
}

export function generateTwitterCard(page: keyof typeof seoConfig) {
  const config = seoConfig[page]
  return {
    card: "summary_large_image",
    title: config.title,
    description: config.description,
    images: [`${siteConfig.url}/images/og-image.png`],
  }
}

export function generateOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteConfig.url}/#organization`,
    name: siteConfig.fullName,
    url: siteConfig.url,
    logo: siteConfig.logo,
    description:
      "Ingeniería portátil: alquiler de baños portátiles, lavamanos, puntos ecológicos y servicios de operarios en Colombia.",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: siteConfig.phone,
      contactType: "customer service",
      email: siteConfig.email,
      areaServed: "CO",
      availableLanguage: ["Spanish"],
    },
    sameAs: [siteConfig.social.instagram.url, siteConfig.social.linkedin.url],
  }
}

export function generateLocalBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${siteConfig.url}/#localbusiness`,
    name: siteConfig.fullName,
    image: siteConfig.logo,
    telephone: siteConfig.phone,
    email: siteConfig.email,
    url: siteConfig.url,
    address: siteConfig.addresses.map((addr) => ({
      "@type": "PostalAddress",
      streetAddress: addr.street,
      addressLocality: addr.city,
      addressCountry: addr.country,
    })),
    priceRange: "$$",
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "08:00",
      closes: "18:00",
    },
  }
}

export function generateWebsiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.fullName,
    url: siteConfig.url,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteConfig.url}/productos?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  }
}

export function generateContactPageJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contacto | BOGA",
    url: `${siteConfig.url}/contacto`,
    mainEntity: {
      "@type": "Organization",
      name: siteConfig.fullName,
      telephone: siteConfig.phone,
      email: siteConfig.email,
      url: siteConfig.url,
      address: siteConfig.addresses.map((addr) => ({
        "@type": "PostalAddress",
        streetAddress: addr.street,
        addressLocality: addr.city,
        addressCountry: addr.country,
      })),
    },
  }
}

export function generateBreadcrumbJsonLd(
  items: { name: string; path: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteConfig.url}${item.path}`,
    })),
  }
}
