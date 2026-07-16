import type { Metadata } from "next"
import ContactForm from "./contact-form"
import {
  seoConfig,
  generateOpenGraph,
  generateTwitterCard,
  generateBreadcrumbJsonLd,
  generateContactPageJsonLd,
} from "@/lib/seo"

export const metadata: Metadata = {
  title: seoConfig.contacto.title,
  description: seoConfig.contacto.description,
  keywords: seoConfig.contacto.keywords,
  alternates: { canonical: "/contacto" },
  openGraph: generateOpenGraph("contacto", "/contacto"),
  twitter: generateTwitterCard("contacto"),
}

export default function ContactoPage() {
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Inicio", path: "/" },
    { name: "Contacto", path: "/contacto" },
  ])

  const contactPageJsonLd = generateContactPageJsonLd()

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([breadcrumbJsonLd, contactPageJsonLd]),
        }}
      />
      <ContactForm />
    </>
  )
}
