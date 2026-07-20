"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { CheckCircle2, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import type { Producto } from "@/lib/mocks"

interface ProductCardProps {
  producto: Producto
  className?: string
  /** Tarjeta más densa para grids de 3 columnas */
  compact?: boolean
}

function getProductImagePath(slug: string): string {
  return `/images/products/${slug}-photo.jpg`
}

function ProductImagePlaceholder({ producto }: { producto: Producto }) {
  const specs = (producto.especificaciones as Record<string, string> | undefined) || {}
  const firstSpec = Object.entries(specs)[0]

  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-[var(--boga-surface-muted)] to-[var(--boga-surface-inset)] p-4 text-center">
      <span className="font-sans text-sm font-semibold text-[var(--boga-text-secondary)]">
        {producto.nombre}
      </span>
      {firstSpec && (
        <span className="mt-1 text-xs text-[var(--boga-text-tertiary)]">
          {firstSpec[0]}: {firstSpec[1]}
        </span>
      )}
    </div>
  )
}

function getBadgeColor(badge: string): string {
  const lower = badge.toLowerCase()
  if (lower.includes("premium") || lower.includes("vip") || lower.includes("nuevo"))
    return "bg-[var(--boga-lima-500)] text-[var(--boga-text-on-lima)]"
  if (lower.includes("inclusivo") || lower.includes("tecnología") || lower.includes("popular"))
    return "bg-[var(--boga-electric-500)] text-white"
  if (lower.includes("sostenible") || lower.includes("eco"))
    return "bg-[var(--boga-success-500)] text-white"
  if (lower.includes("iso"))
    return "bg-[#c9a84c] text-[#1b1341]"
  return "bg-[var(--boga-neutral-200)] text-[var(--boga-neutral-700)]"
}

export function ProductCard({ producto, className, compact = false }: ProductCardProps) {
  const [imageError, setImageError] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  const specs = (producto.especificaciones as Record<string, string> | undefined) || {}
  const specEntries = Object.entries(specs).slice(0, compact ? 2 : 4)
  const imagePath = getProductImagePath(producto.slug)
  const detailHref = `/servicios/${producto.slug}`

  return (
    <article
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-2xl border border-boga-border-subtle bg-boga-surface-elevated shadow-boga-2 transition-all hover:-translate-y-1 hover:shadow-boga-3",
        className
      )}
    >
      <Link
        href={detailHref}
        className={cn(
          "relative block overflow-hidden",
          compact ? "aspect-[16/10]" : "aspect-[4/3]"
        )}
      >
        {!imageError ? (
          <Image
            src={imagePath}
            alt={`Fotografía de ${producto.nombre}`}
            fill
            className={cn(
              "object-cover transition-opacity duration-500",
              imageLoaded ? "opacity-100" : "opacity-0"
            )}
            sizes={
              compact
                ? "(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                : "(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 50vw"
            }
            onError={() => setImageError(true)}
            onLoad={() => setImageLoaded(true)}
          />
        ) : (
          <ProductImagePlaceholder producto={producto} />
        )}

        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[var(--boga-surface-muted)] to-[var(--boga-surface-inset)]">
            <span className="text-sm font-medium text-[var(--boga-text-tertiary)]">
              {producto.nombre}
            </span>
          </div>
        )}

        {producto.badge && (
          <span
            className={cn(
              "absolute left-3 top-3 rounded-full px-2.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wider",
              getBadgeColor(producto.badge)
            )}
          >
            {producto.badge}
          </span>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-[var(--boga-deep-500)]/50 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </Link>

      <div
        className={cn(
          "flex flex-1 flex-col",
          compact ? "p-4 md:p-5" : "p-6 md:p-7"
        )}
      >
        <Link href={detailHref}>
          <h3
            className={cn(
              "font-sans font-bold text-boga-text-primary transition-colors group-hover:text-boga-electric-500",
              compact ? "text-base md:text-lg" : "text-xl md:text-2xl"
            )}
          >
            {producto.nombre}
          </h3>
        </Link>
        <p
          className={cn(
            "text-boga-text-secondary",
            compact ? "mt-1.5 line-clamp-2 text-sm" : "mt-3"
          )}
        >
          {producto.descripcionCorta}
        </p>

        {specEntries.length > 0 && (
          <ul className={cn("flex-1 space-y-1.5", compact ? "mt-3" : "mt-5 space-y-2")}>
            {specEntries.map(([label, value]) => (
              <li
                key={label}
                className={cn(
                  "flex items-start gap-2 text-boga-text-secondary",
                  compact ? "text-xs" : "text-sm"
                )}
              >
                <CheckCircle2
                  className={cn(
                    "mt-0.5 shrink-0 text-boga-electric-500",
                    compact ? "h-3.5 w-3.5" : "h-4 w-4"
                  )}
                  strokeWidth={1.75}
                  aria-hidden="true"
                />
                <span>
                  <span className="font-medium text-boga-text-primary">
                    {label}:
                  </span>{" "}
                  {value}
                </span>
              </li>
            ))}
          </ul>
        )}

        <div
          className={cn(
            "flex flex-col gap-2 sm:flex-row",
            compact ? "mt-4" : "mt-6 gap-3"
          )}
        >
          <Link
            href={detailHref}
            className={cn(
              buttonVariants({
                variant: "outline",
                size: compact ? "sm" : "default",
              }),
              "w-full sm:flex-1"
            )}
          >
            Ver detalles
            <ArrowRight className="ml-1.5 h-3.5 w-3.5" aria-hidden="true" />
          </Link>
          <Link
            href="/cotizacion"
            className={cn(
              buttonVariants({ size: compact ? "sm" : "default" }),
              "btn-primary w-full sm:flex-1"
            )}
          >
            Solicitar info
          </Link>
        </div>
      </div>
    </article>
  )
}
