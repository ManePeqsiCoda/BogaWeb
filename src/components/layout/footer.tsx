import Link from "next/link"
import { Logo } from "@/components/logo"
import { AdminLink } from "@/components/admin-link"
import { Phone, Mail, MapPin } from "lucide-react"

const footerServices = [
  { name: "Alquiler Industrial", href: "/servicios" },
  { name: "Mantenimiento 24/7", href: "/servicios" },
  { name: "Operarios Certificados", href: "/servicios" },
  { name: "Insumos Eco-friendly", href: "/servicios" },
]

const footerLinks = [
  { name: "Inicio", href: "/" },
  { name: "Productos", href: "/productos" },
  { name: "Servicios", href: "/servicios" },
  { name: "FAQ", href: "/faq" },
  { name: "Privacidad", href: "/privacidad" },
  { name: "Términos", href: "/terminos" },
  { name: "Cookies", href: "/cookies" },
]

const mapUrls = {
  medellin:
    "https://maps.google.com/maps?q=Calle+13+sur+%2351C-54%2C+Medell%C3%ADn%2C+Antioquia%2C+Colombia&t=&z=15&ie=UTF8&iwloc=&output=embed",
  bogota:
    "https://maps.google.com/maps?q=Cra+58b+bis+%23131A+51%2C+Bogot%C3%A1%2C+Colombia&t=&z=15&ie=UTF8&iwloc=&output=embed",
}

export function Footer() {
  return (
    <footer className="bg-secondary-900 text-white" role="contentinfo">
      {/* CTA Banner */}
      <div className="border-y border-white/10 bg-gradient-to-r from-primary-500/20 to-accent-gold-500/20">
        <div className="container-junisama flex flex-col items-center justify-between gap-6 py-12 md:flex-row md:py-16">
          <div>
            <h3 className="font-outfit text-heading-lg text-white">
              Contacto Industrial
            </h3>
            <p className="mt-2 text-neutral-300">
              Soporte técnico 24/7 para proyectos de cualquier magnitud
            </p>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <a
              href="tel:+573507089584"
              className="flex items-center gap-3 rounded-xl bg-white/10 px-5 py-3 transition-colors hover:bg-white/20"
            >
              <Phone className="h-5 w-5 text-primary-500" aria-hidden="true" />
              <div>
                <div className="text-xs uppercase tracking-wider text-neutral-400">Línea directa</div>
                <div className="font-semibold">+57 350 708 9584</div>
              </div>
            </a>
            <a
              href="mailto:soporte@junisama.com"
              className="flex items-center gap-3 rounded-xl bg-white/10 px-5 py-3 transition-colors hover:bg-white/20"
            >
              <Mail className="h-5 w-5 text-primary-500" aria-hidden="true" />
              <div>
                <div className="text-xs uppercase tracking-wider text-neutral-400">Email técnico</div>
                <div className="font-semibold">soporte@junisama.com</div>
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container-junisama py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Column 1: Brand */}
          <div className="lg:col-span-1">
            <Logo variant="dark" />
            <p className="mt-4 text-sm leading-relaxed text-neutral-400">
              Infraestructura sanitaria de grado industrial para eventos de gran escala.
              Cumplimiento normativo y operación 24/7 garantizada.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-accent-gold-500/30 bg-accent-gold-500/10 px-3 py-1.5">
              <ShieldIcon className="h-4 w-4 text-accent-gold-500" aria-hidden="true" />
              <span className="text-xs font-medium uppercase tracking-wider text-accent-gold-500">
                ISO 14001 Certificado
              </span>
            </div>
          </div>

          {/* Column 2: Servicios técnicos */}
          <div>
            <h4 className="mb-4 font-outfit text-sm font-semibold uppercase tracking-wider text-neutral-300">
              Servicios Técnicos
            </h4>
            <ul className="space-y-3">
              {footerServices.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="flex items-center gap-2 text-sm text-neutral-400 transition-colors hover:text-primary-500"
                  >
                    <ChevronRightIcon className="h-3 w-3" aria-hidden="true" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contacto */}
          <div>
            <h4 className="mb-4 font-outfit text-sm font-semibold uppercase tracking-wider text-neutral-300">
              Contacto 24/7
            </h4>
            <ul className="space-y-3 text-sm text-neutral-400">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary-500" aria-hidden="true" />
                <a href="tel:+573507089584" className="hover:text-white transition-colors">
                  +57 350 708 9584
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary-500" aria-hidden="true" />
                <a href="mailto:soporte@junisama.com" className="hover:text-white transition-colors">
                  soporte@junisama.com
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 text-primary-500" aria-hidden="true" />
                <div>
                  <p>
                    <span className="font-medium text-neutral-300">Medellín:</span> Calle 13 sur #51C-54
                  </p>
                  <p className="mt-1">
                    <span className="font-medium text-neutral-300">Bogotá:</span> Cra 58b bis #131A 51
                  </p>
                </div>
              </li>
            </ul>
          </div>

          {/* Column 4: Redes */}
          <div>
            <h4 className="mb-4 font-outfit text-sm font-semibold uppercase tracking-wider text-neutral-300">
              Síguenos
            </h4>
            <p className="mb-4 text-sm text-neutral-400">
              Síguenos en nuestras redes sociales para estar al día con nuestras novedades y promociones.
            </p>
            <div className="flex gap-3">
              <a
                href="https://www.instagram.com/junisama_inversiones"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-primary-500"
                aria-label="Instagram de Junisama"
              >
                <InstagramIcon className="h-5 w-5" aria-hidden="true" />
              </a>
              <a
                href="https://www.linkedin.com/company/inversiones-junisama-s-a-s"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-primary-500"
                aria-label="LinkedIn de Junisama"
              >
                <LinkedInIcon className="h-5 w-5" aria-hidden="true" />
              </a>
            </div>

            <div className="mt-8 flex items-center gap-2 rounded-lg bg-white/5 px-4 py-3">
              <span className="relative flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-success" />
              </span>
              <span className="text-sm font-medium text-neutral-400">WhatsApp en línea</span>
            </div>

            <div className="mt-6 rounded-lg border border-white/10 bg-white/5 p-4">
              <h5 className="mb-2 text-xs font-semibold uppercase tracking-wider text-neutral-300">
                Acceso interno
              </h5>
              <AdminLink className="text-sm text-neutral-400 hover:text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Sedes / Mapas */}
      <div className="border-y border-white/10 bg-secondary-800/50">
        <div className="container-junisama py-12">
          <div className="mb-8 flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary-500" aria-hidden="true" />
            <h3 className="font-outfit text-heading-sm text-white">Nuestras Sedes</h3>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-secondary-900">
              <div className="aspect-[16/9] w-full">
                <iframe
                  src={mapUrls.medellin}
                  title="Sede Junisama Medellín"
                  className="h-full w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
              <div className="p-4">
                <p className="font-medium text-white">Medellín</p>
                <p className="text-sm text-neutral-400">Calle 13 sur #51C-54</p>
              </div>
            </div>
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-secondary-900">
              <div className="aspect-[16/9] w-full">
                <iframe
                  src={mapUrls.bogota}
                  title="Sede Junisama Bogotá"
                  className="h-full w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
              <div className="p-4">
                <p className="font-medium text-white">Bogotá</p>
                <p className="text-sm text-neutral-400">Cra 58b bis #131A 51</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-white/10">
        <div className="container-junisama flex flex-col items-center justify-between gap-4 py-6 md:flex-row">
          <p className="text-center text-sm text-neutral-500 md:text-left">
            © 2025 JUNISAMA INVERSIONES S.A.S — Todos los derechos reservados
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-neutral-500">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-white transition-colors"
              >
                {link.name}
              </Link>
            ))}
            <AdminLink />
          </div>
        </div>
      </div>
    </footer>
  )
}

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  )
}

function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  )
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  )
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  )
}
