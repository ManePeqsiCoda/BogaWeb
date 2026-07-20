"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Logo } from "@/components/logo"
import { EmergencyButton } from "@/components/layout/emergency-button"
import { ThemeToggle } from "@/components/layout/theme-toggle"
import {
  Menu,
  X,
  ChevronDown,
  Star,
  Bath,
  Accessibility,
  Zap,
  Droplets,
  Truck,
  Users,
  Leaf,
  ArrowRight,
} from "lucide-react"

const serviceItems = [
  { name: "Baño VIP", href: "/servicios/bano-vip", icon: Star },
  { name: "Baño Estándar", href: "/servicios/bano-estandar", icon: Bath },
  { name: "Discapacitados", href: "/servicios/discapacitados", icon: Accessibility },
  { name: "Eléctricos", href: "/servicios/electricos", icon: Zap },
  { name: "Lavamanos", href: "/servicios/lavamanos", icon: Droplets },
  { name: "Trailer de Lujo", href: "/servicios/trailer-lujo", icon: Truck },
  { name: "Servicio de Operarios", href: "/servicios/operarios", icon: Users },
  { name: "Puntos Ecológicos", href: "/servicios/puntos-ecologicos", icon: Leaf },
]

const mainLinks = [
  { name: "Inicio", href: "/" },
  { name: "Servicios", href: "/servicios", children: serviceItems },
  { name: "Galería", href: "/galeria" },
  { name: "Quiénes Somos", href: "/quienes-somos" },
  { name: "Contacto", href: "/contacto" },
]

function NavLink({
  href,
  children,
  active,
  onClick,
  overHero,
}: {
  href: string
  children: React.ReactNode
  active?: boolean
  onClick?: () => void
  overHero?: boolean
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "relative text-sm font-medium transition-colors",
        overHero
          ? active
            ? "text-[var(--boga-lima-500)]"
            : "text-white/90 hover:text-white"
          : active
            ? "text-[var(--boga-electric-500)]"
            : "text-[var(--boga-text-secondary)] hover:text-[var(--boga-electric-500)]"
      )}
    >
      {children}
      {active && (
        <span
          className={cn(
            "absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full",
            overHero ? "bg-[var(--boga-lima-500)]" : "bg-[var(--boga-electric-500)]"
          )}
        />
      )}
    </Link>
  )
}

export function Navbar() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = React.useState(false)
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const [productsOpen, setProductsOpen] = React.useState(false)
  const productsRef = React.useRef<HTMLDivElement>(null)
  const isHome = pathname === "/"
  const overHero = isHome && !scrolled

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 24)
    }
    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        productsRef.current &&
        !productsRef.current.contains(event.target as Node)
      ) {
        setProductsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  React.useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setProductsOpen(false)
        setMobileOpen(false)
      }
    }
    if (productsOpen || mobileOpen) {
      document.addEventListener("keydown", handleEscape)
      return () => document.removeEventListener("keydown", handleEscape)
    }
  }, [productsOpen, mobileOpen])

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  return (
    <>
      <header
        className={cn(
          "fixed top-0 z-40 w-full transition-all duration-300",
          overHero
            ? "bg-transparent"
            : scrolled
              ? "bg-[var(--boga-surface-canvas)]/95 shadow-[var(--boga-shadow-2)] backdrop-blur-md"
              : "bg-[var(--boga-surface-canvas)]"
        )}
      >
        <nav
          className="container-boga flex h-[var(--header-height)] items-center justify-between gap-4"
          aria-label="Navegación principal"
        >
          {/* Logo */}
          <Logo variant={overHero ? "dark" : "light"} />

          {/* Desktop links — desde ~960px (antes lg:1024 dejaba hamburguesa en viewports grandes) */}
          <div className="hidden items-center gap-4 min-[960px]:flex xl:gap-7">
            {mainLinks.map((link) =>
              link.children ? (
                <div
                  key={link.name}
                  ref={productsRef}
                  className="relative"
                  onMouseEnter={() => setProductsOpen(true)}
                  onMouseLeave={() => setProductsOpen(false)}
                >
                  <Link
                    href={link.href}
                    onClick={() => setProductsOpen(false)}
                    className={cn(
                      "flex items-center gap-1 py-3 text-sm font-medium transition-colors",
                      overHero
                        ? isActive(link.href)
                          ? "text-[var(--boga-lima-500)]"
                          : "text-white/90 hover:text-white"
                        : isActive(link.href)
                          ? "text-[var(--boga-electric-500)]"
                          : "text-[var(--boga-text-secondary)] hover:text-[var(--boga-electric-500)]"
                    )}
                    aria-expanded={productsOpen}
                    aria-haspopup="true"
                    aria-controls="desktop-products-menu"
                  >
                    {link.name}
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 transition-transform",
                        productsOpen && "rotate-180"
                      )}
                      aria-hidden="true"
                    />
                  </Link>

                  {productsOpen && (
                    <div
                      className="absolute top-full left-1/2 z-50 w-[420px] -translate-x-1/2 pt-3"
                      id="desktop-products-menu"
                      role="menu"
                    >
                      <div className="rounded-xl border border-[var(--boga-border-subtle)] bg-[var(--boga-surface-floating)] p-4 shadow-[var(--boga-shadow-4)]">
                        <Link
                          href="/servicios"
                          onClick={() => setProductsOpen(false)}
                          className="mb-3 flex w-full items-center justify-center gap-2 rounded-lg bg-boga-electric-500 px-3 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-boga-electric-600"
                          role="menuitem"
                        >
                          Ver todos los servicios
                          <ArrowRight className="h-4 w-4" aria-hidden="true" />
                        </Link>
                        <div className="grid grid-cols-2 gap-2">
                          {link.children.map((child) => {
                            const Icon = child.icon
                            return (
                              <Link
                                key={child.href}
                                href={child.href}
                                onClick={() => setProductsOpen(false)}
                                className="flex items-center gap-3 rounded-lg p-2 text-sm font-medium text-[var(--boga-text-secondary)] transition-colors hover:bg-[var(--boga-surface-muted)] hover:text-[var(--boga-electric-500)]"
                                role="menuitem"
                              >
                                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[var(--boga-electric-50)] text-[var(--boga-electric-500)]">
                                  <Icon className="h-4 w-4" aria-hidden="true" />
                                </span>
                                {child.name}
                              </Link>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <NavLink
                  key={link.name}
                  href={link.href}
                  active={isActive(link.href)}
                  overHero={overHero}
                >
                  {link.name}
                </NavLink>
              )
            )}
          </div>

          {/* CTAs */}
          <div className="hidden items-center gap-3 min-[960px]:flex">
            <ThemeToggle overHero={overHero} />
            <EmergencyButton />
            <Link href="/cotizacion" className="btn-primary px-5 text-xs">
              Cotizar
            </Link>
          </div>

          {/* Mobile: toggle + hamburger */}
          <div className="flex items-center gap-1 min-[960px]:hidden">
            <ThemeToggle overHero={overHero} />
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className={cn(
                "inline-flex h-10 w-10 items-center justify-center rounded-lg",
                overHero
                  ? "text-white hover:bg-white/10"
                  : "text-[var(--boga-text-secondary)] hover:bg-[var(--boga-surface-muted)]"
              )}
              aria-label="Abrir menú"
            >
              <Menu className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile menu full-screen overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 min-[960px]:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Menú principal"
        >
          <div
            className="absolute inset-0 bg-[var(--boga-deep-500)]/95 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute inset-y-0 right-0 flex w-full max-w-sm flex-col bg-[var(--boga-deep-500)] p-6 shadow-[var(--boga-shadow-5)]">
            <div className="flex items-center justify-between">
              <Logo variant="dark" showTagline={false} />
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-white hover:bg-white/10"
                aria-label="Cerrar menú"
              >
                <X className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>

            <div className="mt-8 flex flex-col gap-1">
              {mainLinks.map((link) =>
                link.children ? (
                  <div key={link.name}>
                    <div
                      className={cn(
                        "flex items-center rounded-lg",
                        isActive(link.href)
                          ? "bg-[var(--boga-lima-500)]/10 text-[var(--boga-lima-500)]"
                          : "text-white"
                      )}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className="flex-1 px-4 py-3 text-base font-medium hover:bg-white/10"
                      >
                        {link.name}
                      </Link>
                      <button
                        type="button"
                        onClick={() => setProductsOpen((prev) => !prev)}
                        className="rounded-lg px-3 py-3 hover:bg-white/10"
                        aria-expanded={productsOpen}
                        aria-controls="mobile-products-menu"
                        aria-label="Abrir submenú de servicios"
                      >
                        <ChevronDown
                          className={cn(
                            "h-5 w-5 transition-transform",
                            productsOpen && "rotate-180"
                          )}
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                    {productsOpen && (
                      <div id="mobile-products-menu" className="mt-1 grid gap-1 px-2">
                        {link.children.map((child) => {
                          const Icon = child.icon
                          return (
                            <Link
                              key={child.href}
                              href={child.href}
                              onClick={() => setMobileOpen(false)}
                              className="flex items-center gap-3 rounded-lg px-4 py-2 text-sm text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                            >
                              <Icon className="h-4 w-4 text-[var(--boga-lima-500)]" aria-hidden="true" />
                              {child.name}
                            </Link>
                          )
                        })}
                      </div>
                    )}
                  </div>
                ) : (
                  <NavLink
                    key={link.name}
                    href={link.href}
                    active={isActive(link.href)}
                    onClick={() => setMobileOpen(false)}
                  >
                    <span
                      className={cn(
                        "block rounded-lg px-4 py-3 text-base",
                        isActive(link.href)
                          ? "bg-[var(--boga-lima-500)]/10 text-[var(--boga-lima-500)]"
                          : "text-white hover:bg-white/10"
                      )}
                    >
                      {link.name}
                    </span>
                  </NavLink>
                )
              )}
            </div>

            <div className="mt-auto flex flex-col gap-3 pt-8">
              <EmergencyButton className="w-full" />
              <Link
                href="/cotizacion"
                onClick={() => setMobileOpen(false)}
                className="btn-primary w-full text-center"
              >
                Cotizar
              </Link>
              <p className="text-center text-sm text-white/70">
                +57 350 708 9584
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
