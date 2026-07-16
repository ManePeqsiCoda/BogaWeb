"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import { Evento, TipoEvento } from "@prisma/client"
import { Badge } from "@/components/ui/badge"
import { FadeIn } from "@/components/home/fade-in"
import { cn } from "@/lib/utils"

interface GalleryGridProps {
  eventos: Evento[]
}

const tipoLabels: Record<string, string> = {
  CONCIERTO: "Concierto",
  FESTIVAL: "Festival",
  FERIA: "Feria",
  CORPORATIVO: "Corporativo",
  GOBIERNO: "Gobierno",
  PRIVADO: "Privado",
}

const tipoColors: Record<string, string> = {
  CONCIERTO: "bg-purple-500",
  FESTIVAL: "bg-pink-500",
  FERIA: "bg-blue-500",
  CORPORATIVO: "bg-emerald-500",
  GOBIERNO: "bg-amber-500",
  PRIVADO: "bg-indigo-500",
}

export function GalleryGrid({ eventos }: GalleryGridProps) {
  const [activeYear, setActiveYear] = useState<string>("todos")
  const [activeType, setActiveType] = useState<string>("todos")

  const years = useMemo(
    () => Array.from(new Set(eventos.map((e) => e.anio))).sort((a, b) => b - a),
    [eventos]
  )

  const types = useMemo(
    () =>
      Array.from(new Set(eventos.map((e) => e.tipo))).filter(
        (t): t is TipoEvento => t !== null
      ),
    [eventos]
  )

  const filteredEvents = useMemo(() => {
    return eventos.filter((e) => {
      const yearMatch = activeYear === "todos" || e.anio.toString() === activeYear
      const typeMatch = activeType === "todos" || e.tipo === activeType
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
            33+ eventos de gran magnitud respaldan nuestra trayectoria
          </p>
          <p className="mx-auto mt-2 inline-block rounded-full bg-white/10 px-6 py-2 text-sm font-medium text-text-on-dark-muted">
            {eventos.length}+ eventos · 500+ servicios completados
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
                  {tipoLabels[type] || type}
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
                    evento.destacado && "aspect-square"
                  )}
                >
                  <Image
                    src={evento.imagenPrincipal || "/images/eventos/placeholder.svg"}
                    alt={evento.nombre}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    loading={index < 8 ? "eager" : "lazy"}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute top-3 left-3">
                    <Badge
                      className={cn(
                        "border-0 text-xs font-semibold text-white",
                        tipoColors[evento.tipo || ""] || "bg-primary"
                      )}
                    >
                      {tipoLabels[evento.tipo || ""] || evento.tipo}
                    </Badge>
                  </div>
                  <div className="absolute right-3 bottom-3 left-3">
                    <p className="text-lg font-bold text-white">
                      {evento.nombre}
                    </p>
                    <p className="text-sm text-white/80">{evento.anio}</p>
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
