"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import {
  Target,
  Eye,
  Sparkles,
  ShieldCheck,
  Droplets,
  HeartHandshake,
  Handshake,
  Cpu,
} from "lucide-react"
import { FadeIn } from "./fade-in"
import { BogaCircles } from "@/components/brand/boga-circles"
import { BogaDecor } from "@/components/brand/boga-decor"
import { cn } from "@/lib/utils"

const values = [
  {
    name: "EXCELENCIA",
    description: "Valor guía que impulsa cada operación.",
    detail:
      "Cada montaje, cada entrega y cada detalle se miden con el mismo estándar: impecable.",
    angle: -90,
    icon: Sparkles,
    image: "/images/eventos/la-solar-2024.jpg",
    imageAlt: "Producción de gran escala en evento",
  },
  {
    name: "INTEGRIDAD",
    description: "Honestidad y transparencia en cada servicio.",
    detail:
      "Cumplimos lo que prometemos. Sin letras pequeñas, con claridad de punta a punta.",
    angle: -150,
    icon: ShieldCheck,
    image: "/images/quienes-somos/equipo.jpg",
    imageAlt: "Equipo BOGA en operación",
  },
  {
    name: "LIMPIEZA",
    description: "Core del negocio, absolutamente no negociable.",
    detail:
      "La higiene define nuestra firma. Es el punto de partida de toda experiencia BOGA.",
    angle: -210,
    icon: Droplets,
    image: "/images/products/bano-vip-photo.jpg",
    imageAlt: "Unidad sanitaria premium limpia",
  },
  {
    name: "SERVICIO",
    description: "Base de la relación con quienes confían en nosotros.",
    detail:
      "Acompañamos el evento como si fuera propio: presencia, respuesta y cuidado humano.",
    angle: 90,
    icon: HeartHandshake,
    image: "/images/products/operarios-photo.jpg",
    imageAlt: "Operarios de servicio en campo",
  },
  {
    name: "CONFIANZA",
    description: "Tranquilidad para el cliente en cada evento.",
    detail:
      "Sabes que llegamos a tiempo, operamos limpio y resolvemos antes de que se note.",
    angle: 30,
    icon: Handshake,
    image: "/images/eventos/stereo-picnic-2018.jpg",
    imageAlt: "Evento masivo con infraestructura confiable",
  },
  {
    name: "MODERNIDAD",
    description: "Innovación, actualidad y tecnología al servicio.",
    detail:
      "Equipos, procesos y presentación al día: infraestructura que eleva la imagen del evento.",
    angle: -30,
    icon: Cpu,
    image: "/images/products/trailer-lujo-photo.jpg",
    imageAlt: "Trailer de lujo con acabado moderno",
  },
] as const

type ValueItem = (typeof values)[number]

function useIsDesktop(minWidth = 1024) {
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${minWidth}px)`)
    const update = () => setIsDesktop(mq.matches)
    update()
    mq.addEventListener("change", update)
    return () => mq.removeEventListener("change", update)
  }, [minWidth])

  return isDesktop
}

function ValueOrbitCard({
  value,
  index,
  active,
  onFocus,
  onBlur,
}: {
  value: ValueItem
  index: number
  active: boolean
  onFocus: () => void
  onBlur: () => void
}) {
  const Icon = value.icon
  const radius = 38
  const rad = (value.angle * Math.PI) / 180
  const x = 50 + radius * Math.cos(rad)
  const y = 50 + radius * Math.sin(rad)

  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, scale: 0.7 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 22,
        delay: 0.08 + index * 0.07,
      }}
      whileHover={{ scale: 1.16, zIndex: 30 }}
      whileFocus={{ scale: 1.16, zIndex: 30 }}
      onMouseEnter={onFocus}
      onMouseLeave={onBlur}
      onFocus={onFocus}
      onBlur={onBlur}
      aria-label={`${value.name}: ${value.description}`}
      className={cn(
        "group absolute z-10 flex h-[12rem] w-[12rem] -translate-x-1/2 -translate-y-1/2 cursor-pointer flex-col items-center justify-center rounded-full border px-5 text-center outline-none transition-[box-shadow,background-color,border-color] duration-300 xl:h-[13.25rem] xl:w-[13.25rem]",
        active
          ? "border-boga-lima-500 bg-boga-electric-500/90 shadow-[0_0_0_2px_rgba(218,247,58,0.45),0_22px_48px_rgba(27,19,65,0.4)] backdrop-blur-md"
          : "border-white/35 bg-boga-electric-500/75 shadow-boga-3 backdrop-blur-sm hover:border-boga-lima-400 hover:bg-boga-electric-500/95"
      )}
      style={{ left: `${x}%`, top: `${y}%` }}
    >
      <span
        className={cn(
          "mb-2.5 flex h-11 w-11 items-center justify-center rounded-full border transition-colors duration-300",
          active
            ? "border-boga-lima-500 bg-boga-lima-500 text-boga-deep-500"
            : "border-boga-lima-500/60 bg-boga-lima-500/20 text-boga-lima-500 group-hover:border-boga-lima-500 group-hover:bg-boga-lima-500 group-hover:text-boga-deep-500"
        )}
      >
        <Icon className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
      </span>
      <span className="font-sans text-sm font-black uppercase tracking-[0.12em] text-boga-lima-500 xl:text-base">
        {value.name}
      </span>
      <span
        className={cn(
          "mt-2 max-w-[10.5rem] text-[0.8125rem] leading-snug transition-colors duration-300 xl:text-sm",
          active ? "text-white" : "text-white/90 group-hover:text-white"
        )}
      >
        {value.description}
      </span>
    </motion.button>
  )
}

/** Tarjeta responsive: imagen solo dentro al hover; fondo de sección intacto */
function ValueMobileCard({
  value,
  index,
}: {
  value: ValueItem
  index: number
}) {
  const Icon = value.icon

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      whileHover={{ scale: 1.02, y: -3 }}
      className="group relative min-h-[17rem] overflow-hidden rounded-3xl border border-white/35 bg-boga-electric-500 text-left shadow-boga-3 outline-none transition-[border-color,box-shadow] duration-300 hover:border-boga-lima-400 hover:shadow-[0_0_0_2px_rgba(218,247,58,0.35)]"
    >
      {/* Imagen solo dentro de la tarjeta, aparece en hover */}
      <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-within:opacity-100">
        <Image
          src={value.image}
          alt=""
          fill
          sizes="(max-width: 640px) 100vw, 50vw"
          className="object-cover scale-105 transition-transform duration-500 group-hover:scale-100"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(44,77,242,0.95) 0%, rgba(44,77,242,0.72) 48%, rgba(44,77,242,0.2) 100%)",
          }}
        />
      </div>

      <div className="relative z-10 flex h-full min-h-[17rem] flex-col justify-end p-6">
        <div className="mb-3 flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-full border border-boga-lima-500/70 bg-boga-lima-500/20 text-boga-lima-500 transition-colors duration-300 group-hover:border-boga-lima-500 group-hover:bg-boga-lima-500 group-hover:text-boga-deep-500">
            <Icon className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
          </span>
          <h3 className="font-sans text-lg font-black uppercase tracking-[0.1em] text-boga-lima-500">
            {value.name}
          </h3>
        </div>
        <p className="text-base leading-relaxed text-white">
          {value.description}
        </p>
        <p className="mt-2 text-sm leading-relaxed text-white/85">
          {value.detail}
        </p>
      </div>
    </motion.article>
  )
}

export function BogaValues() {
  const isDesktop = useIsDesktop(1024)
  const [activeName, setActiveName] = useState<string | null>(null)
  const activeValue = values.find((v) => v.name === activeName) ?? null
  // Fondo fotográfico de sección: solo desktop
  const showSectionPhoto = isDesktop && !!activeValue

  return (
    <>
      {/* ADN — misión / visión */}
      <section className="bg-boga-surface-muted py-16 md:py-24">
        <div className="container-boga">
          <FadeIn className="mb-12 text-center">
            <span className="mb-3 inline-flex items-center gap-2 text-caption uppercase tracking-wider text-boga-electric-500">
              <BogaCircles size="s" tone="electric" />
              La Marca
            </span>
            <h2 className="font-sans text-heading-lg text-boga-text-primary md:text-display-md">
              ADN BOGA
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-boga-text-secondary">
              Más que infraestructura, creamos experiencias limpias, modernas y
              confiables.
            </p>
          </FadeIn>

          <div className="grid gap-6 md:grid-cols-2">
            <FadeIn direction="left">
              <div className="rounded-2xl border border-boga-border-subtle bg-boga-surface-elevated p-6 shadow-boga-2 md:p-8">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border-2 border-boga-electric-500 text-boga-electric-500">
                  <Target className="h-6 w-6" strokeWidth={1.75} aria-hidden="true" />
                </div>
                <h3 className="text-lg font-bold text-boga-text-primary">Misión</h3>
                <p className="mt-2 text-boga-text-secondary">
                  Brindar un acompañamiento humano y personalizado, donde la limpieza
                  y la modernidad son nuestra firma.
                </p>
              </div>
            </FadeIn>

            <FadeIn direction="right">
              <div className="rounded-2xl border border-boga-border-subtle bg-boga-surface-elevated p-6 shadow-boga-2 md:p-8">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border-2 border-boga-electric-500 text-boga-electric-500">
                  <Eye className="h-6 w-6" strokeWidth={1.75} aria-hidden="true" />
                </div>
                <h3 className="text-lg font-bold text-boga-text-primary">Visión</h3>
                <p className="mt-2 text-boga-text-secondary">
                  Consolidarnos como el referente nacional de calidad y elegancia en
                  servicios sanitarios móviles.
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* VALORES */}
      <section className="relative overflow-hidden bg-boga-electric-500 py-20 md:py-28">
        {/* Fondo fotográfico de sección: SOLO escritorio */}
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <AnimatePresence mode="sync">
            {showSectionPhoto && activeValue && (
              <motion.div
                key={activeValue.name}
                className="absolute inset-0"
                initial={{ opacity: 0, scale: 1.06 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              >
                <Image
                  src={activeValue.image}
                  alt=""
                  fill
                  sizes="100vw"
                  className="object-cover object-center"
                  priority={false}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <div
            className="absolute inset-0 transition-[background] duration-500"
            style={{
              background: showSectionPhoto
                ? "linear-gradient(90deg, #2c4df2 0%, rgba(44,77,242,0.92) 28%, rgba(44,77,242,0.55) 58%, rgba(44,77,242,0.12) 82%, rgba(44,77,242,0) 100%)"
                : "#2c4df2",
            }}
          />

          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(27,19,65,0.18) 0%, transparent 35%, transparent 70%, rgba(27,19,65,0.28) 100%)",
            }}
          />
        </div>

        <BogaDecor
          variant="bubbles"
          tone="white"
          className="absolute -left-16 -top-8 z-[1] h-72 w-72 opacity-25"
        />
        <BogaDecor
          variant="waves"
          tone="lima"
          className="absolute right-8 top-10 z-[1] h-14 w-32 opacity-40"
        />
        <BogaDecor
          variant="arrows"
          tone="lima"
          className="absolute bottom-10 left-10 z-[1] h-16 w-16 opacity-30"
        />

        <div className="container-boga relative z-10">
          <FadeIn className="text-center">
            <div className="mb-4 flex justify-center">
              <BogaCircles size="m" tone="lima" />
            </div>
            <h2 className="font-sans text-display-md font-black uppercase tracking-wide text-boga-lima-500 md:text-display-lg">
              Valores
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-lg text-white md:text-xl">
              Lo que nos mueve en cada operación. Pasa el cursor para explorarlos.
            </p>
          </FadeIn>

          {/* Desktop: órbita + cambio de fondo de sección */}
          <div className="relative mx-auto mt-8 hidden min-h-[40rem] w-full max-w-5xl lg:block xl:min-h-[44rem]">
            <motion.div
              aria-hidden="true"
              className="absolute left-1/2 top-1/2 h-[74%] w-[74%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/20"
              animate={{ rotate: 360 }}
              transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              aria-hidden="true"
              className="absolute left-1/2 top-1/2 h-[90%] w-[90%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-boga-lima-500/30"
              animate={{ rotate: -360 }}
              transition={{ duration: 110, repeat: Infinity, ease: "linear" }}
            />

            <div className="absolute left-1/2 top-1/2 z-20 flex w-[15rem] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center xl:w-[17rem]">
              <motion.div
                className="flex h-[13.5rem] w-[13.5rem] flex-col items-center justify-center rounded-full border-2 border-boga-lima-500/70 bg-boga-electric-500/85 px-6 text-center shadow-[0_0_48px_rgba(218,247,58,0.2)] backdrop-blur-md xl:h-[15rem] xl:w-[15rem]"
                animate={{
                  boxShadow: [
                    "0 0 32px rgba(218,247,58,0.12)",
                    "0 0 56px rgba(218,247,58,0.28)",
                    "0 0 32px rgba(218,247,58,0.12)",
                  ],
                }}
                transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
              >
                <AnimatePresence mode="wait">
                  {activeValue ? (
                    <motion.div
                      key={activeValue.name}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.22 }}
                      className="px-1"
                    >
                      <p className="text-sm font-black uppercase tracking-[0.16em] text-boga-lima-500 xl:text-base">
                        {activeValue.name}
                      </p>
                      <p className="mt-2.5 text-sm leading-snug text-white xl:text-base">
                        {activeValue.detail}
                      </p>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="idle"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center"
                    >
                      <BogaCircles size="l" tone="lima" />
                      <p className="mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-white/85 xl:text-sm">
                        Explora un valor
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>

            {values.map((value, index) => (
              <ValueOrbitCard
                key={value.name}
                value={value}
                index={index}
                active={activeName === value.name}
                onFocus={() => setActiveName(value.name)}
                onBlur={() => setActiveName(null)}
              />
            ))}
          </div>

          {/* Responsive: tarjetas; imagen solo dentro al hover; sección siempre azul */}
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:hidden">
            {values.map((value, index) => (
              <ValueMobileCard
                key={value.name}
                value={value}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
