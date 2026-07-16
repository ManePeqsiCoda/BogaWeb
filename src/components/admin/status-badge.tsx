"use client"

import { cn } from "@/lib/utils"
import { EstadoCotizacion } from "@prisma/client"

const statusConfig: Record<
  EstadoCotizacion,
  { label: string; bg: string; text: string; border: string }
> = {
  BORRADOR: {
    label: "Borrador",
    bg: "bg-gray-500/15",
    text: "text-gray-400",
    border: "border-gray-500/20",
  },
  ENVIADA: {
    label: "Enviada",
    bg: "bg-[#3B82F6]/15",
    text: "text-[#3B82F6]",
    border: "border-[#3B82F6]/20",
  },
  APROBADA: {
    label: "Aprobada",
    bg: "bg-[#22C55E]/15",
    text: "text-[#22C55E]",
    border: "border-[#22C55E]/20",
  },
  RECHAZADA: {
    label: "Rechazada",
    bg: "bg-[#EF4444]/15",
    text: "text-[#EF4444]",
    border: "border-[#EF4444]/20",
  },
  EXPIRADA: {
    label: "Expirada",
    bg: "bg-[#F59E0B]/15",
    text: "text-[#F59E0B]",
    border: "border-[#F59E0B]/20",
  },
}

interface StatusBadgeProps {
  status: EstadoCotizacion
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status]

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold",
        config.bg,
        config.text,
        config.border,
        className
      )}
    >
      {config.label}
    </span>
  )
}
