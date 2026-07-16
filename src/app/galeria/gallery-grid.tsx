"use client"

import { useState, useMemo } from "react"
import { eventTypeLabels, type Event } from "@/data/events"
import { Badge } from "@/components/ui/badge"
import { FadeIn } from "@/components/home/fade-in"
import { cn } from "@/lib/utils"

interface GalleryGridProps {
  eventos: Event[]
}

const tipoColors: Record<string, string> = {
  concierto: "bg-purple-500",
  festival: "bg-pink-500",
  feria: "bg-blue-500",
  corporativo: "bg-emerald-500",
  privado: "bg-indigo-500",
}

export function GalleryGrid({ eventos }: GalleryGridProps) {
  const [activeYear, setActiveYear] = useState<string>("todos")
  const [activeType, setActiveType] = useState<string>("todos")

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

  return (
    <>
      {/* Hero */}
      <section className="bg-secondary pb-20 pt-32">
        <div className="container mx-auto px-4 text-center lg:px-6">
          <h1 className="text-3xl font-extrabold text-white md:text-5xl">
            Nuestra Experiencia
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-text-on-dark-muted">
            Eventos de gran magnitud que respaldan nuestra trayectoria
          </p>
          <p className="mx-auto mt-2 inline-block rounded-full bg-white/10 px-6 py-2 text-sm font-medium text-text-on-dark-muted">
            {eventos.length} eventos verificables · cobertura nacional
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="container mx-auto -mt-8 px-4 lg:px-6">
        <FadeIn>
          <div className="rounded-2xl bg-white p-4 shadow-md">
            <div className="mb-3 flex flex-wrap justify-center gap-2">
              <button
                type="button"
                onClick={() => setActiveYear("todos")}
                className={cn(
                  "rounded-xl px-4 py-2 text-sm font-medium transition-colors",
                  activeYear === "todos"
                    ? "bg-primary text-white"
                    : "text-body hover:bg-bg-light"
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
                      ? "bg-primary text-white"
                      : "text-body hover:bg-bg-light"
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
                    ? "bg-secondary text-white"
                    : "text-body hover:bg-bg-light"
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
                      ? "bg-secondary text-white"
                      : "text-body hover:bg-bg-light"
                  )}
                >
                  {eventTypeLabels[type] || type}
                </button>
              ))}
            </div>
          </div>
        </FadeIn>

        {/* Masonry grid */}
        <div className="mt-10 columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4">
          {filteredEvents.map((evento, index) => (
            <FadeIn
              key={evento.id}
              delay={index < 10 ? index * 0.03 : 0}
              className="mb-4 break-inside-avoid"
            >
              <div className="group relative overflow-hidden rounded-xl bg-bg-light">
                <div
                  className={cn(
                    "relative aspect-[4/3] w-full",
                    evento.highlighted && "aspect-square"
                  )}
                >
                  {/* Placeholder con texto descriptivo — sin foto genérica */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-secondary-800 to-secondary-900 p-4 text-center">
                    <span className="font-outfit text-lg font-semibold text-white">
                      {evento.name}
                    </span>
                    <span className="mt-1 text-sm text-neutral-400">
                      {evento.years.join(", ")}
                    </span>
                    {/* TODO: Reemplazar por foto real del evento */}
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute left-3 top-3">
                    <Badge
                      className={cn(
                        "border-0 text-xs font-semibold text-white",
                        tipoColors[evento.type] || "bg-primary"
                      )}
                    >
                      {eventTypeLabels[evento.type] || evento.type}
                    </Badge>
                  </div>
                  <div className="absolute inset-x-3 bottom-3">
                    <p className="text-lg font-bold text-white">{evento.name}</p>
                    <p className="text-sm text-white/80">{evento.years.join(", ")}</p>
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-muted">No hay eventos con los filtros seleccionados.</p>
          </div>
        )}
      </section>
    </>
  )
}
