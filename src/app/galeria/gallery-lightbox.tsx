"use client"

import { useCallback, useEffect, useState } from "react"
import Image from "next/image"
import { AnimatePresence, motion } from "framer-motion"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import { eventTypeLabels, getEventAlbum, type Event } from "@/data/events"
import { cn } from "@/lib/utils"

const AUTO_MS = 4500

export type GallerySlide = {
  src: string
  title: string
  years: number[]
  type: Event["type"]
  eventId: string
}

interface GalleryLightboxProps {
  event: Event | null
  open: boolean
  onClose: () => void
}

export function buildEventSlides(evento: Event): GallerySlide[] {
  return getEventAlbum(evento).map((src) => ({
    src,
    title: evento.name,
    years: evento.years,
    type: evento.type,
    eventId: evento.id,
  }))
}

export function GalleryLightbox({ event, open, onClose }: GalleryLightboxProps) {
  const slides = event ? buildEventSlides(event) : []
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [direction, setDirection] = useState(1)

  useEffect(() => {
    if (open) setIndex(0)
  }, [open, event?.id])

  const goTo = useCallback(
    (next: number, dir: number) => {
      if (slides.length === 0) return
      setDirection(dir)
      setIndex((next + slides.length) % slides.length)
    },
    [slides.length]
  )

  const next = useCallback(() => goTo(index + 1, 1), [goTo, index])
  const prev = useCallback(() => goTo(index - 1, -1), [goTo, index])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
      if (e.key === "ArrowRight") next()
      if (e.key === "ArrowLeft") prev()
    }
    window.addEventListener("keydown", onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      window.removeEventListener("keydown", onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [open, onClose, next, prev])

  useEffect(() => {
    if (!open || paused || slides.length <= 1) return
    const id = window.setInterval(() => {
      setDirection(1)
      setIndex((i) => (i + 1) % slides.length)
    }, AUTO_MS)
    return () => window.clearInterval(id)
  }, [open, paused, slides.length, index])

  if (!open || !event || slides.length === 0) return null

  const slide = slides[index]
  const progress = (index + 1) / slides.length

  return (
    <div
      className="fixed inset-0 z-[80] flex flex-col bg-black/95"
      role="dialog"
      aria-modal="true"
      aria-label={`Álbum: ${slide.title}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative z-20 flex shrink-0 items-start justify-between gap-4 px-4 pb-3 pt-4 sm:px-6">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wider text-boga-lima-500">
            Álbum · {eventTypeLabels[slide.type]} · {slide.years.join(", ")}
          </p>
          <h2 className="truncate text-xl font-bold text-white sm:text-2xl">
            {slide.title}
          </h2>
          <p className="text-sm text-white/65">
            Foto {index + 1} de {slides.length}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="shrink-0 rounded-full bg-white/10 p-2.5 text-white transition-colors hover:bg-white/20"
          aria-label="Cerrar"
        >
          <X className="size-5" />
        </button>
      </div>

      <div className="mx-4 h-0.5 shrink-0 overflow-hidden rounded-full bg-white/15 sm:mx-6">
        <motion.div
          key={index}
          className="h-full bg-boga-lima-500"
          initial={{ width: "0%" }}
          animate={{ width: paused ? `${progress * 100}%` : "100%" }}
          transition={
            paused
              ? { duration: 0 }
              : { duration: AUTO_MS / 1000, ease: "linear" }
          }
        />
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 py-3 sm:px-10">
        <div className="relative aspect-video w-full max-w-5xl max-h-[min(58vh,560px)] overflow-hidden rounded-xl bg-black shadow-2xl">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={`${slide.eventId}-${index}-${slide.src}`}
              custom={direction}
              variants={{
                enter: (d: number) => ({ opacity: 0, x: d > 0 ? 40 : -40 }),
                center: { opacity: 1, x: 0 },
                exit: (d: number) => ({ opacity: 0, x: d > 0 ? -40 : 40 }),
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="absolute inset-0"
            >
              <Image
                src={slide.src}
                alt={`${slide.title} — foto ${index + 1} de ${slides.length}`}
                fill
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 1024px"
                priority
              />
            </motion.div>
          </AnimatePresence>

          {slides.length > 1 && (
            <>
              <button
                type="button"
                onClick={prev}
                className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/55 p-2.5 text-white backdrop-blur-sm transition-colors hover:bg-black/75 sm:left-3"
                aria-label="Imagen anterior"
              >
                <ChevronLeft className="size-6" />
              </button>
              <button
                type="button"
                onClick={next}
                className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/55 p-2.5 text-white backdrop-blur-sm transition-colors hover:bg-black/75 sm:right-3"
                aria-label="Imagen siguiente"
              >
                <ChevronRight className="size-6" />
              </button>
            </>
          )}
        </div>
      </div>

      {slides.length > 1 && (
        <div className="flex shrink-0 flex-wrap justify-center gap-1.5 px-4 py-4 sm:px-6">
          {slides.map((s, i) => (
            <button
              key={`${s.src}-${i}`}
              type="button"
              onClick={() => goTo(i, i > index ? 1 : -1)}
              className={cn(
                "h-1.5 rounded-full transition-all",
                i === index
                  ? "w-7 bg-boga-lima-500"
                  : "w-1.5 bg-white/30 hover:bg-white/50"
              )}
              aria-label={`Ir a foto ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
