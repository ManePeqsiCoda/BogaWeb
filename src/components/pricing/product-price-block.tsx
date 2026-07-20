"use client"

import type { Producto } from "@/lib/mocks"
import {
  PriceDisplay,
  PriceVisibilityToggle,
} from "@/components/pricing/price-visibility"
import { isBundleTrigger } from "@/lib/cotizador/public-pricing"
import { cn } from "@/lib/utils"

interface ProductPriceBlockProps {
  producto: Producto
  className?: string
  /** Muestra hint del descuento bundle (productos complementarios) */
  showBundleHint?: boolean
}

export function ProductPriceBlock({
  producto,
  className,
  showBundleHint = true,
}: ProductPriceBlockProps) {
  const esAncla = isBundleTrigger(producto.slug)

  return (
    <div
      className={cn(
        "flex flex-wrap items-end justify-between gap-3 rounded-xl border border-boga-border-subtle bg-boga-surface-muted/80 px-4 py-3",
        className
      )}
    >
      <div>
        <p className="text-xs font-medium uppercase tracking-wider text-boga-text-tertiary">
          Precio de referencia
        </p>
        <PriceDisplay
          amount={producto.precioBase}
          unidadMedida={producto.unidadMedida}
          size="lg"
        />
        {showBundleHint && !esAncla && (
          <p className="mt-1 max-w-sm text-xs text-boga-text-tertiary">
            Todo el carrito tiene 30% off si incluye VIP, baño para
            discapacitados o trailer de lujo (sin acumular).
          </p>
        )}
        {showBundleHint && esAncla && (
          <p className="mt-1 max-w-sm text-xs text-boga-text-tertiary">
            Al incluir este ítem, todo el carrito del cotizador recibe 30% off
            (un solo descuento, no acumulable).
          </p>
        )}
      </div>
      <PriceVisibilityToggle showLabel size="sm" />
    </div>
  )
}
