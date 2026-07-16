"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
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
} from "lucide-react"

const products = [
  {
    name: "Baño VIP",
    href: "/productos/bano-vip",
    icon: Star,
  },
  {
    name: "Baño Estándar",
    href: "/productos/bano-estandar",
    icon: Bath,
  },
  {
    name: "Discapacitados",
    href: "/productos/discapacitados",
    icon: Accessibility,
  },
  {
    name: "Eléctricos",
    href: "/productos/electricos",
    icon: Zap,
  },
  {
    name: "Lavamanos",
    href: "/productos/lavamanos",
    icon: Droplets,
  },
  {
    name: "Trailer de Lujo",
    href: "/productos/trailer-lujo",
    icon: Truck,
  },
  {
    name: "Servicio de Operarios",
    href: "/productos/operarios",
    icon: Users,
  },
  {
    name: "Puntos Ecológicos",
    href: "/productos/puntos-ecologicos",
    icon: Leaf,
  },
]

const mainLinks = [
  { name: "Inicio", href: "/" },
  {
    name: "Productos",
    href: "/productos",
    children: products,
  },
  { name: "Servicios", href: "/servicios" },
  { name: "Galería", href: "/galeria" },
  { name: "Quienes Somos", href: "/quienes-somos" },
  { name: "Contacto", href: "/contacto" },
]

function NavLink({
  href,
  children,
  active,
  onClick,
}: {
  href: string
  children: React.ReactNode
  active?: boolean
  onClick?: () => void
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "relative text-sm font-medium transition-colors",
        active ? "text-primary" : "text-body hover:text-primary"
      )}
    >
      {children}
      {active && (
        <span className="absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-primary" />
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

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 8)
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

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  return (
    <>
      <header
        className={cn(
          "fixed top-0 z-40 w-full transition-all duration-300",
          scrolled
            ? "bg-white/95 shadow-sm backdrop-blur-sm"
            : "bg-white"
        )}
      >
        <nav className="container mx-auto flex h-[72px] items-center justify-between px-4 lg:px-6">
          {/* Logo */}
          <Link href="/" className="relative flex h-10 w-40 items-center">
            <Image
              src="/logo.svg"
              alt="Junisama Inversiones S.A.S"
              fill
              className="object-contain object-left"
              priority
            />
          </Link>

          {/* Desktop links */}
          <div className="hidden items-center gap-8 lg:flex">
            {mainLinks.map((link) =>
              link.children ? (
                <div
                  key={link.name}
                  ref={productsRef}
                  className="relative"
                  onMouseEnter={() => setProductsOpen(true)}
                  onMouseLeave={() => setProductsOpen(false)}
                >
                  <button
                    type="button"
                    onClick={() => setProductsOpen((prev) => !prev)}
                    className={cn(
                      "flex items-center gap-1 text-sm font-medium transition-colors",
                      isActive(link.href)
                        ? "text-primary"
                        : "text-body hover:text-primary"
                    )}
                    aria-expanded={productsOpen}
                    aria-controls="desktop-products-menu"
                  >
                    {link.name}
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 transition-transform",
                        productsOpen && "rotate-180"
                      )}
                    />
                  </button>

                  {productsOpen && (
                    <div
                      id="desktop-products-menu"
                      className="absolute top-full left-1/2 mt-2 w-[420px] -translate-x-1/2 rounded-xl border border-border-subtle bg-white p-4 shadow-lg"
                    >
                      <div className="mb-3 border-b border-border-subtle pb-2">
                        <Link
                          href="/productos"
                          onClick={() => setProductsOpen(false)}
                          className="text-sm font-semibold text-dark hover:text-primary"
                        >
                          Ver todos los productos
                        </Link>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {link.children.map((child) => {
                          const Icon = child.icon
                          return (
                            <Link
                              key={child.href}
                              href={child.href}
                              onClick={() => setProductsOpen(false)}
                              className="flex items-center gap-3 rounded-lg p-2 text-sm font-medium text-body transition-colors hover:bg-bg-light hover:text-primary"
                            >
                              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary-light text-primary">
                                <Icon className="h-4 w-4" />
                              </span>
                              {child.name}
                            </Link>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <NavLink
                  key={link.name}
                  href={link.href}
                  active={isActive(link.href)}
                >
                  {link.name}
                </NavLink>
              )
            )}
          </div>

          {/* CTA */}
          <div className="hidden lg:block">
            <Link
              href="/cotizacion"
              className={buttonVariants({ size: "sm" }) + " px-5 font-semibold uppercase tracking-wide"}
            >
              Cotizar
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-body hover:bg-bg-light lg:hidden"
            aria-label="Abrir menú"
          >
            <Menu className="h-6 w-6" />
          </button>
        </nav>
      </header>

      {/* Mobile menu full-screen overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Menú principal"
        >
          <div
            className="absolute inset-0 bg-secondary/95 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute inset-y-0 right-0 flex w-full max-w-sm flex-col bg-secondary p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <Link
                href="/"
                onClick={() => setMobileOpen(false)}
                className="relative h-10 w-40"
              >
                <Image
                  src="/logo.svg"
                  alt="Junisama"
                  fill
                  className="object-contain object-left invert"
                />
              </Link>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-white hover:bg-white/10"
                aria-label="Cerrar menú"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="mt-8 flex flex-col gap-1">
              {mainLinks.map((link) =>
                link.children ? (
                  <div key={link.name}>
                    <button
                      type="button"
                      onClick={() => setProductsOpen((prev) => !prev)}
                      className={cn(
                        "flex w-full items-center justify-between rounded-lg px-4 py-3 text-left text-base font-medium transition-colors",
                        isActive(link.href)
                          ? "bg-primary/10 text-primary"
                          : "text-white hover:bg-white/10"
                      )}
                      aria-expanded={productsOpen}
                      aria-controls="mobile-products-menu"
                    >
                      {link.name}
                      <ChevronDown
                        className={cn(
                          "h-5 w-5 transition-transform",
                          productsOpen && "rotate-180"
                        )}
                      />
                    </button>
                    {productsOpen && (
                      <div id="mobile-products-menu" className="mt-1 grid gap-1 px-2">
                        <Link
                          href="/productos"
                          onClick={() => setMobileOpen(false)}
                          className="rounded-lg px-4 py-2 text-sm font-semibold text-text-on-dark-muted hover:bg-white/10 hover:text-white"
                        >
                          Ver todos los productos
                        </Link>
                        {link.children.map((child) => {
                          const Icon = child.icon
                          return (
                            <Link
                              key={child.href}
                              href={child.href}
                              onClick={() => setMobileOpen(false)}
                              className="flex items-center gap-3 rounded-lg px-4 py-2 text-sm text-text-on-dark-muted transition-colors hover:bg-white/10 hover:text-white"
                            >
                              <Icon className="h-4 w-4 text-primary" />
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
                          ? "bg-primary/10 text-primary"
                          : "text-white hover:bg-white/10"
                      )}
                    >
                      {link.name}
                    </span>
                  </NavLink>
                )
              )}
            </div>

            <div className="mt-auto pt-8">
              <Link
                href="/cotizacion"
                onClick={() => setMobileOpen(false)}
                className={buttonVariants({ size: "lg" }) + " w-full text-center font-semibold uppercase tracking-wide"}
              >
                Cotizar
              </Link>
              <p className="mt-4 text-center text-sm text-text-on-dark-muted">
                +57 350 708 9584
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
