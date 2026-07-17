"use client"

import { events } from "@/data/events"
import { cn } from "@/lib/utils"

interface ClientMarqueeProps {
  filterType?: string
  filterYear?: number
  className?: string
}

export function ClientMarquee({ filterType, filterYear, className }: ClientMarqueeProps) {
  const filtered = events.filter((e) => {
    if (filterType && e.type !== filterType) return false
    if (filterYear && !e.years.includes(filterYear)) return false
    return true
  })

  // Duplicar para efecto infinito sin gap visual
  const duplicated = [...filtered, ...filtered]

  return (
    <section
      className={cn("overflow-hidden bg-[var(--boga-surface-muted)] py-12 md:py-16", className)}
      aria-labelledby="clients-heading"
    >
      <div className="container-boga mb-8 text-center">
        <span className="inline-flex items-center gap-2 text-caption uppercase tracking-wider text-[var(--boga-text-tertiary)]">
          <span className="boga-circles--s boga-circles--electric">
            <span className="circle" />
            <span className="circle" />
            <span className="circle" />
          </span>
          Empresas y eventos que han confiado en nosotros
          <span className="boga-circles--s boga-circles--electric">
            <span className="circle" />
            <span className="circle" />
            <span className="circle" />
          </span>
        </span>
      </div>

      {/* Marquee Track 1 — izquierda a derecha */}
      <div className="marquee-container mb-5">
        <div className="marquee-track">
          {duplicated.map((event, i) => (
            <EventPill key={`${event.id}-${i}`} event={event} />
          ))}
        </div>
      </div>

      {/* Marquee Track 2 — derecha a izquierda (reversa) */}
      <div className="marquee-container">
        <div className="marquee-track-reverse">
          {[...duplicated].reverse().map((event, i) => (
            <EventPill key={`${event.id}-rev-${i}`} event={event} variant="outline" />
          ))}
        </div>
      </div>
    </section>
  )
}

interface EventPillProps {
  event: (typeof events)[0]
  variant?: "filled" | "outline"
}

function Separator() {
  return (
    <span className="boga-circles--s boga-circles--electric mx-4 self-center opacity-60">
      <span className="circle" />
      <span className="circle" />
      <span className="circle" />
    </span>
  )
}

function EventPill({ event, variant = "filled" }: EventPillProps) {
  return (
    <div className="flex items-center">
      <div
        className={cn(
          "flex-shrink-0 whitespace-nowrap rounded-full border px-6 py-3",
          variant === "filled"
            ? "border-[var(--boga-border-subtle)] bg-[var(--boga-surface-elevated)] text-[var(--boga-text-primary)] shadow-[var(--boga-shadow-1)]"
            : "border-[var(--boga-border-default)] bg-transparent text-[var(--boga-text-secondary)]"
        )}
      >
        <span className="font-sans text-sm font-semibold uppercase tracking-wider">{event.name}</span>
        <span className="ml-3 text-xs text-[var(--boga-text-tertiary)]">{event.years.join(", ")}</span>
      </div>
      <Separator />
    </div>
  )
}
