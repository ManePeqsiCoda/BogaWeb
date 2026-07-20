import type { Producto } from "@/lib/mocks"
import { formatCOP } from "@/lib/cotizador/calc"

/** Descuento único (no acumulable) aplicado a todo el carrito. */
export const BUNDLE_DISCOUNT_RATE = 0.3

/**
 * Si el carrito incluye al menos uno de estos, TODO el carrito recibe 30% off.
 * Varios anclas no acumulan descuento: siempre un solo 30%.
 */
export const BUNDLE_TRIGGER_SLUGS = new Set([
  "bano-vip",
  "discapacitados",
  "trailer-lujo",
])

export const BUNDLE_TRIGGER_LABELS = [
  "Baño Portátil VIP",
  "Baño para Discapacitados",
  "Trailer de Lujo",
] as const

export function isBundleTrigger(slug: string): boolean {
  return BUNDLE_TRIGGER_SLUGS.has(slug)
}

export type PublicCartLineInput = {
  producto: Producto
  cantidad: number
}

export type PublicCartLine = {
  productoId: string
  slug: string
  nombre: string
  cantidad: number
  unidadMedida: string
  precioUnitarioLista: number
  precioUnitarioFinal: number
  subtotalLista: number
  subtotalFinal: number
  aplicaDescuento: boolean
  esAncla: boolean
}

export type PublicCartTotals = {
  lines: PublicCartLine[]
  hasBundleTrigger: boolean
  subtotalLista: number
  descuentoTotal: number
  total: number
}

export function calcularCarritoPublico(
  items: PublicCartLineInput[]
): PublicCartTotals {
  const hasBundleTrigger = items.some((i) => isBundleTrigger(i.producto.slug))
  // Un solo 30% sobre todo el carrito; no se acumula por anclas adicionales
  const aplicaDescuentoCarrito = hasBundleTrigger

  const lines: PublicCartLine[] = items.map((item) => {
    const precioUnitarioLista = Math.max(0, item.producto.precioBase ?? 0)
    const cantidad = Math.max(1, item.cantidad)
    const esAncla = isBundleTrigger(item.producto.slug)
    const precioUnitarioFinal = aplicaDescuentoCarrito
      ? Math.round(precioUnitarioLista * (1 - BUNDLE_DISCOUNT_RATE))
      : precioUnitarioLista
    const subtotalLista = precioUnitarioLista * cantidad
    const subtotalFinal = precioUnitarioFinal * cantidad

    return {
      productoId: item.producto.id,
      slug: item.producto.slug,
      nombre: item.producto.nombre,
      cantidad,
      unidadMedida: item.producto.unidadMedida,
      precioUnitarioLista,
      precioUnitarioFinal,
      subtotalLista,
      subtotalFinal,
      aplicaDescuento: aplicaDescuentoCarrito,
      esAncla,
    }
  })

  const subtotalLista = lines.reduce((s, l) => s + l.subtotalLista, 0)
  const total = lines.reduce((s, l) => s + l.subtotalFinal, 0)
  const descuentoTotal = Math.max(0, subtotalLista - total)

  return {
    lines,
    hasBundleTrigger,
    subtotalLista,
    descuentoTotal,
    total,
  }
}

export function formatPrecioPublico(v: number): string {
  return formatCOP(v)
}

export function labelUnidadPublica(unidad: string): string {
  const u = unidad.toLowerCase()
  if (u.includes("turno")) return "/turno"
  if (u.includes("día") || u.includes("dia")) return "/día"
  return "/unidad"
}
