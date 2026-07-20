import Link from "next/link"
import { ArrowRight, LayoutGrid } from "lucide-react"
import { ProductCard } from "./product-card"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import type { Producto } from "@/lib/mocks"

interface ProductGridProps {
  productos: Producto[]
  className?: string
  columns?: 2 | 3 | 4
  /** Tarjeta final que enlaza al listado completo de servicios */
  showViewAll?: boolean
  viewAllHref?: string
}

function ViewAllServicesCard({
  href = "/servicios",
  compact = false,
}: {
  href?: string
  compact?: boolean
}) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-boga-border-subtle bg-boga-surface-elevated shadow-boga-2 transition-all hover:-translate-y-1 hover:shadow-boga-3">
      <Link
        href={href}
        className={cn(
          "relative block overflow-hidden bg-boga-electric-500",
          compact ? "aspect-[16/10]" : "aspect-[4/3]"
        )}
      >
        <div
          className="absolute inset-0 opacity-40"
          style={{
            background:
              "radial-gradient(circle at 30% 30%, rgba(218,247,58,0.35), transparent 55%)",
          }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
          <span
            className={cn(
              "flex items-center justify-center rounded-2xl border border-boga-lima-500/50 bg-boga-lima-500/15 text-boga-lima-500 transition-transform duration-300 group-hover:scale-110 group-hover:bg-boga-lima-500 group-hover:text-boga-deep-500",
              compact ? "h-12 w-12" : "h-16 w-16"
            )}
          >
            <LayoutGrid
              className={compact ? "h-6 w-6" : "h-8 w-8"}
              strokeWidth={1.75}
              aria-hidden="true"
            />
          </span>
          <span className="font-sans text-sm font-semibold uppercase tracking-[0.18em] text-boga-lima-500">
            Catálogo
          </span>
        </div>
      </Link>

      <div className={cn("flex flex-1 flex-col", compact ? "p-4 md:p-5" : "p-6 md:p-7")}>
        <Link href={href}>
          <h3
            className={cn(
              "font-sans font-bold text-boga-text-primary transition-colors group-hover:text-boga-electric-500",
              compact ? "text-base md:text-lg" : "text-xl md:text-2xl"
            )}
          >
            Ver todo
          </h3>
        </Link>
        <p
          className={cn(
            "text-boga-text-secondary",
            compact ? "mt-1.5 line-clamp-2 text-sm" : "mt-3"
          )}
        >
          Explora el catálogo completo de soluciones BOGA para tu evento.
        </p>

        <div className={cn("mt-auto", compact ? "pt-4" : "pt-6")}>
          <Link
            href={href}
            className={cn(
              buttonVariants({ size: compact ? "sm" : "default" }),
              "btn-primary inline-flex w-full items-center justify-center"
            )}
          >
            Ver todos los servicios
            <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  )
}

export function ProductGrid({
  productos,
  className,
  columns = 3,
  showViewAll = false,
  viewAllHref = "/servicios",
}: ProductGridProps) {
  const compact = columns >= 3
  const columnClass =
    columns === 2
      ? "md:grid-cols-2"
      : columns === 4
        ? "md:grid-cols-2 lg:grid-cols-4"
        : "md:grid-cols-2 lg:grid-cols-3"

  return (
    <div
      className={
        className ||
        `grid grid-cols-1 ${compact ? "gap-4 md:gap-5" : "gap-6"} ${columnClass}`
      }
    >
      {productos.map((producto) => (
        <ProductCard
          key={producto.id}
          producto={producto}
          compact={compact}
        />
      ))}
      {showViewAll && <ViewAllServicesCard href={viewAllHref} compact={compact} />}
    </div>
  )
}
