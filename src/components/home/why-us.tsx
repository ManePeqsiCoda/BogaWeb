"use client"

import { useCallback, useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { ShieldCheck, Clock, MapPin, Leaf, ChevronLeft, ChevronRight } from "lucide-react"
import { FadeIn } from "./fade-in"
import { BogaCircles } from "@/components/brand/boga-circles"
import { BogaDecor } from "@/components/brand/boga-decor"
import { cn } from "@/lib/utils"

const AUTO_MS = 4500

const reasons = [
  {
    title: "Estándar de excelencia",
    description: "Procesos validados y operación impecable en cada evento.",
    icon: ShieldCheck,
    accent: "Cada detalle cuenta: montaje, higiene y entrega al mismo nivel.",
  },
  {
    title: "Operación 24/7",
    description: "Soporte técnico permanente durante todo el evento.",
    icon: Clock,
    accent: "Respuesta continua para que el evento nunca se detenga.",
  },
  {
    title: "Cobertura nacional",
    description: "Sedes operativas en Medellín y Bogotá para toda Colombia.",
    icon: MapPin,
    accent: "Logística propia y presencia donde tu proyecto lo necesite.",
  },
  {
    title: "Insumos eco-friendly",
    description: "Compromiso real con el medio ambiente y la sostenibilidad.",
    icon: Leaf,
    accent: "Operación responsable sin sacrificar calidad ni presentación.",
  },
]

export function WhyUs() {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [direction, setDirection] = useState(1)

  const goTo = useCallback((next: number, dir?: number) => {
    setDirection(dir ?? (next > index ? 1 : -1))
    setIndex((next + reasons.length) % reasons.length)
  }, [index])

  const next = useCallback(() => goTo(index + 1, 1), [goTo, index])
  const prev = useCallback(() => goTo(index - 1, -1), [goTo, index])

  useEffect(() => {
    if (paused) return
    const id = window.setInterval(() => {
      setDirection(1)
      setIndex((i) => (i + 1) % reasons.length)
    }, AUTO_MS)
    return () => window.clearInterval(id)
  }, [paused])

  const active = reasons[index]
  const ActiveIcon = active.icon

  return (
    <section className="relative overflow-hidden bg-[var(--boga-deep-500)] pt-16 pb-8 md:pt-20 md:pb-10">
      <BogaDecor
        variant="waves"
        tone="lima"
        className="absolute left-6 top-8 h-10 w-24 opacity-30"
      />
      <div
        className="pointer-events-none absolute -right-20 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-boga-electric-500/20 blur-3xl"
        aria-hidden="true"
      />

      <div className="container-boga relative z-10">
        <FadeIn className="mb-8 text-center md:mb-10">
          <span className="mb-3 inline-flex items-center gap-2 text-caption uppercase tracking-wider text-[var(--boga-lima-500)]">
            <BogaCircles size="s" tone="lima" />
            Por qué BOGA
          </span>
          <h2 className="text-2xl font-bold text-white md:text-4xl">
            La diferencia BOGA
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-white/70">
            Más de una década respaldando los eventos más importantes del país
          </p>
        </FadeIn>

        <div
          className="relative mx-auto max-w-4xl"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node)) {
              setPaused(false)
            }
          }}
        >
          {/* Stage */}
          <div className="relative min-h-[18rem] overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.04] shadow-boga-4 backdrop-blur-sm md:min-h-[20rem]">
            {/* Progress bar */}
            <div className="absolute left-0 right-0 top-0 z-20 h-1 bg-white/10">
              <motion.div
                key={index}
                className="h-full origin-left bg-boga-lima-500"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: paused ? 0 : 1 }}
                transition={
                  paused
                    ? { duration: 0.2 }
                    : { duration: AUTO_MS / 1000, ease: "linear" }
                }
              />
            </div>

            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={active.title}
                custom={direction}
                initial={{ opacity: 0, x: direction * 56, scale: 0.97 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: direction * -40, scale: 0.98 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="flex h-full flex-col items-center justify-center gap-6 px-6 py-12 text-center md:flex-row md:gap-10 md:px-12 md:text-left"
              >
                <motion.div
                  initial={{ scale: 0.8, rotate: -8 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 260, damping: 18 }}
                  className="relative flex h-24 w-24 shrink-0 items-center justify-center rounded-full border-2 border-boga-lima-500/50 bg-boga-lima-500/10 text-boga-lima-500 md:h-28 md:w-28"
                >
                  <span className="absolute inset-0 animate-ping rounded-full border border-boga-lima-500/20 opacity-40" />
                  <ActiveIcon className="relative h-11 w-11 md:h-12 md:w-12" strokeWidth={1.75} />
                </motion.div>

                <div className="max-w-xl">
                  <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-boga-lima-500">
                    0{index + 1} / 0{reasons.length}
                  </p>
                  <h3 className="mt-2 font-sans text-2xl font-black text-white md:text-3xl">
                    {active.title}
                  </h3>
                  <p className="mt-3 text-base text-white/80 md:text-lg">
                    {active.description}
                  </p>
                  <p className="mt-3 text-sm text-white/55 md:text-base">
                    {active.accent}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Controls */}
            <div className="absolute inset-y-0 left-2 flex items-center md:left-3">
              <button
                type="button"
                onClick={prev}
                aria-label="Anterior"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-boga-deep-500/60 text-white backdrop-blur-sm transition-colors hover:border-boga-lima-500/50 hover:text-boga-lima-500"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
            </div>
            <div className="absolute inset-y-0 right-2 flex items-center md:right-3">
              <button
                type="button"
                onClick={next}
                aria-label="Siguiente"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-boga-deep-500/60 text-white backdrop-blur-sm transition-colors hover:border-boga-lima-500/50 hover:text-boga-lima-500"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Thumbnails / dots strip */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5">
            {reasons.map((reason, i) => {
              const Icon = reason.icon
              const isActive = i === index
              return (
                <button
                  key={reason.title}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={reason.title}
                  aria-current={isActive}
                  className={cn(
                    "group flex items-center gap-2 rounded-full border px-3 py-2 text-left transition-all duration-300",
                    isActive
                      ? "border-boga-lima-500/60 bg-boga-lima-500/15 text-boga-lima-500"
                      : "border-white/10 bg-white/5 text-white/60 hover:border-white/25 hover:text-white"
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" strokeWidth={1.75} />
                  <span className="hidden text-xs font-semibold sm:inline">
                    {reason.title}
                  </span>
                  <span
                    className={cn(
                      "h-1.5 w-1.5 rounded-full sm:hidden",
                      isActive ? "bg-boga-lima-500" : "bg-white/40"
                    )}
                  />
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
