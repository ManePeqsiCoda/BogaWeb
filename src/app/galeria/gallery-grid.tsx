"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import { Images } from "lucide-react"
import { eventTypeLabels, getEventAlbum, type Event } from "@/data/events"
import { Badge } from "@/components/ui/badge"
import { FadeIn } from "@/components/home/fade-in"
import { cn } from "@/lib/utils"
import { GalleryLightbox } from "@/app/galeria/gallery-lightbox"

interface GalleryGridProps {
  eventos: Event[]
}

const tipoColors: Record<string, string> = {
  concierto: "bg-boga-electric-500",
  festival: "bg-boga-lima-500 text-boga-text-on-lima",
  feria: "bg-boga-deep-500",
  corporativo: "bg-boga-neutral-500",
  privado: "bg-boga-electric-700",
}

export function GalleryGrid({ eventos }: GalleryGridProps) {
  const [activeYear, setActiveYear] = useState<string>("todos")
  const [activeType, setActiveType] = useState<string>("todos")
  const [activeEvent, setActiveEvent] = useState<Event | null>(null)

  const years = useMemo(
    () => Array.from(new Set(eventos.flatMap((e) => e.years))).sort((a, b) => b - a),
    [eventos]
  )

  const types = useMemo(
    () => Array.from(new Set(eventos.map((e) => e.type))),
    [eventos]
  )

  const filteredEvents = useMemo(() => {
    return eventos.filter((e) => {
      const yearMatch = activeYear === "todos" || e.years.includes(Number(activeYear))
      const typeMatch = activeType === "todos" || e.type === activeType
      return yearMatch && typeMatch
    })
  }, [eventos, activeYear, activeType])

  const openEventAlbum = (evento: Event) => {
    setActiveEvent(evento)
  }

  return (
    <>
      <section className="bg-boga-deep-500 pb-20 pt-32">
        <div className="container-boga text-center">
          <h1 className="text-3xl font-extrabold text-boga-text-inverted md:text-5xl">
            Nuestra Experiencia
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-boga-text-inverted/70">
            Eventos de gran magnitud que respaldan nuestra trayectoria
          </p>
          <p className="mx-auto mt-2 inline-block rounded-full bg-boga-text-inverted/10 px-6 py-2 text-sm font-medium text-boga-text-inverted/70">
            {eventos.length} eventos verificables · cobertura nacional
          </p>
        </div>
      </section>

      <section className="container-boga relative z-10 -mt-8 pb-20">
        <FadeIn>
          <div className="rounded-2xl bg-boga-surface-elevated p-4 shadow-boga-3">
            <div className="mb-3 flex flex-wrap justify-center gap-2">
              <button
                type="button"
                onClick={() => setActiveYear("todos")}
                className={cn(
                  "rounded-xl px-4 py-2 text-sm font-medium transition-colors",
                  activeYear === "todos"
                    ? "bg-boga-electric-500 text-boga-text-on-electric"
                    : "text-boga-text-secondary hover:bg-boga-surface-muted"
                )}
              >
                Todos los años
              </button>
              {years.map((year) => (
                <button
                  key={year}
                  type="button"
                  onClick={() => setActiveYear(year.toString())}
                  className={cn(
                    "rounded-xl px-4 py-2 text-sm font-medium transition-colors",
                    activeYear === year.toString()
                      ? "bg-boga-electric-500 text-boga-text-on-electric"
                      : "text-boga-text-secondary hover:bg-boga-surface-muted"
                  )}
                >
                  {year}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              <button
                type="button"
                onClick={() => setActiveType("todos")}
                className={cn(
                  "rounded-xl px-4 py-2 text-sm font-medium transition-colors",
                  activeType === "todos"
                    ? "bg-boga-deep-500 text-boga-text-inverted"
                    : "text-boga-text-secondary hover:bg-boga-surface-muted"
                )}
              >
                Todos los tipos
              </button>
              {types.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setActiveType(type)}
                  className={cn(
                    "rounded-xl px-4 py-2 text-sm font-medium transition-colors",
                    activeType === type
                      ? "bg-boga-deep-500 text-boga-text-inverted"
                      : "text-boga-text-secondary hover:bg-boga-surface-muted"
                  )}
                >
                  {eventTypeLabels[type] || type}
                </button>
              ))}
            </div>
          </div>
        </FadeIn>

        <div className="mt-10 columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4">
          {filteredEvents.map((evento, index) => {
            const albumCount = getEventAlbum(evento).length
            return (
              <FadeIn
                key={evento.id}
                delay={index < 10 ? index * 0.03 : 0}
                className="mb-4 break-inside-avoid"
              >
                <button
                  type="button"
                  onClick={() => openEventAlbum(evento)}
                  className="group relative block w-full overflow-hidden rounded-xl bg-boga-surface-muted text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-boga-electric-500 focus-visible:ring-offset-2"
                  aria-label={`Abrir álbum de ${evento.name}`}
                >
                  <div
                    className={cn(
                      "relative aspect-[4/3] w-full",
                      evento.highlighted && "aspect-square"
                    )}
                  >
                    <Image
                      src={evento.image}
                      alt={`Ambiente de evento: ${evento.name}`}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
                    <div className="absolute left-3 top-3 flex items-center gap-2">
                      <Badge
                        className={cn(
                          "border-0 text-xs font-semibold text-boga-text-inverted",
                          tipoColors[evento.type] || "bg-boga-electric-500"
                        )}
                      >
                        {eventTypeLabels[evento.type] || evento.type}
                      </Badge>
                      {albumCount > 1 && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-black/55 px-2 py-0.5 text-[11px] font-medium text-white backdrop-blur-sm">
                          <Images className="size-3" aria-hidden />
                          {albumCount}
                        </span>
                      )}
                    </div>
                    <div className="absolute inset-x-3 bottom-3">
                      <p className="text-lg font-bold text-boga-text-inverted">
                        {evento.name}
                      </p>
                      <p className="text-sm text-boga-text-inverted/80">
                        {evento.years.join(", ")}
                        {albumCount > 1 ? " · Ver álbum" : " · Ver imagen"}
                      </p>
                    </div>
                  </div>
                </button>
              </FadeIn>
            )
          })}
        </div>

        {filteredEvents.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-boga-text-tertiary">
              No hay eventos con los filtros seleccionados.
            </p>
          </div>
        )}
      </section>

      <GalleryLightbox
        event={activeEvent}
        open={activeEvent !== null}
        onClose={() => setActiveEvent(null)}
      />
    </>
  )
}
