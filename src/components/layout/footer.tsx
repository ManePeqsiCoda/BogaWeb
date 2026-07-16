import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Phone, Mail, MapPin } from "lucide-react"

const footerProducts = [
  { name: "Baño VIP", href: "/productos/bano-vip" },
  { name: "Baño Estándar", href: "/productos/bano-estandar" },
  { name: "Discapacitados", href: "/productos/discapacitados" },
  { name: "Eléctricos", href: "/productos/electricos" },
  { name: "Lavamanos", href: "/productos/lavamanos" },
  { name: "Trailer de Lujo", href: "/productos/trailer-lujo" },
  { name: "Servicio de Operarios", href: "/productos/operarios" },
  { name: "Puntos Ecológicos", href: "/productos/puntos-ecologicos" },
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

const socialLinks = [
  {
    name: "Instagram",
    href: "https://www.instagram.com/junisama_inversiones/",
    icon: InstagramIcon,
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/company/inversiones-junisama-s-a-s/",
    icon: LinkedInIcon,
  },
]

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

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-secondary text-white">
      <div className="container mx-auto px-4 py-16 lg:px-6">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Column 1: Brand */}
          <div className="space-y-5">
            <Link href="/" className="relative block h-10 w-44">
              <Image
                src="/logo.svg"
                alt="Junisama Inversiones S.A.S"
                fill
                className="object-contain object-left invert"
              />
            </Link>
            <p className="text-base font-medium text-text-on-dark">
              Infraestructura Sanitaria Industrial
            </p>
            <Badge className="border-0 bg-accent-gold/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent-gold hover:bg-accent-gold/20">
              ISO 14001 Certificado
            </Badge>
          </div>

          {/* Column 2: Products */}
          <div>
            <h3 className="mb-5 text-sm font-bold uppercase tracking-wider text-white">
              Productos
            </h3>
            <ul className="space-y-3">
              {footerProducts.map((product) => (
                <li key={product.href}>
                  <Link
                    href={product.href}
                    className="text-sm text-text-on-dark-muted transition-colors hover:text-white"
                  >
                    {product.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div>
            <h3 className="mb-5 text-sm font-bold uppercase tracking-wider text-white">
              Contacto
            </h3>
            <ul className="space-y-4">
              <li>
                <a
                  href="tel:+573507089584"
                  className="flex items-start gap-3 text-sm text-text-on-dark-muted transition-colors hover:text-white"
                >
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  +57 350 708 9584
                </a>
              </li>
              <li>
                <a
                  href="mailto:soporte@junisama.com"
                  className="flex items-start gap-3 text-sm text-text-on-dark-muted transition-colors hover:text-white"
                >
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  soporte@junisama.com
                </a>
              </li>
              <li className="flex items-start gap-3 text-sm text-text-on-dark-muted">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>
                  <strong className="block text-white">Medellín</strong>
                  Calle 13 sur #51C-54
                </span>
              </li>
              <li className="flex items-start gap-3 text-sm text-text-on-dark-muted">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>
                  <strong className="block text-white">Bogotá</strong>
                  Cra 58b bis #131A 51
                </span>
              </li>
            </ul>
          </div>

          {/* Column 4: Social */}
          <div>
            <h3 className="mb-5 text-sm font-bold uppercase tracking-wider text-white">
              Síguenos
            </h3>
            <div className="flex gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-primary hover:text-white"
                    aria-label={social.name}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                )
              })}
            </div>

            <div className="mt-8 flex items-center gap-2 rounded-lg bg-white/5 px-4 py-3">
              <span className="relative flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-success" />
              </span>
              <span className="text-sm font-medium text-text-on-dark-muted">
                WhatsApp en línea
              </span>
            </div>
          </div>
        </div>
      </div>

      <Separator className="bg-white/10" />

      {/* Bottom bar */}
      <div className="container mx-auto px-4 py-6 lg:px-6">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-center text-sm text-text-on-dark-muted md:text-left">
            © {currentYear} JUNISAMA INVERSIONES S.A.S — Todos los derechos
            reservados
          </p>
          <nav className="flex flex-wrap items-center justify-center gap-4">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-text-on-dark-muted transition-colors hover:text-white"
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  )
}
