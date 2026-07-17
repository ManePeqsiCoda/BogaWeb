"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { ShieldCheck, ArrowRight, CircleDot, LayoutGrid } from "lucide-react"

const stats = [
  { value: "500+", label: "Eventos completados" },
  { value: "24/7", label: "Soporte técnico" },
  { value: "99.9%", label: "Uptime garantizado" },
  { value: "10+", label: "Años experiencia" },
]

// TODO: Agregar número real de certificado ISO 9001 cuando esté disponible
const ISO_CERTIFICATE_NUMBER = ""

export function Hero() {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  const showImage = imageLoaded && !imageError

  return (
    <section
      className="relative flex min-h-[90vh] items-center justify-center overflow-hidden"
      aria-label="Sección principal"
    >
      {/* Fondo azul eléctrico BOGA con gradiente */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--boga-deep-500)] via-[var(--boga-electric-500)] to-[var(--boga-electric-400)]" />
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 30%, rgba(255,255,255,0.15) 0%, transparent 40%), radial-gradient(circle at 80% 70%, rgba(255,255,255,0.1) 0%, transparent 40%)",
        }}
      />

      {/* Fondo real con overlay */}
      {/* TODO: Reemplazar /images/hero-background.jpg por foto/video real de evento atendido por BOGA */}
      <Image
        src="/images/hero-background.jpg"
        alt=""
        fill
        className="absolute inset-0 -z-10 object-cover transition-opacity duration-700"
        style={{ opacity: showImage ? 0.3 : 0 }}
        priority
        quality={85}
        onLoad={() => setImageLoaded(true)}
        onError={() => setImageError(true)}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--boga-deep-500)]/90 via-[var(--boga-electric-500)]/70 to-[var(--boga-deep-500)]/85" />

      {/* Decorativo 3 círculos BOGA */}
      <div className="absolute top-24 right-8 hidden opacity-30 lg:block">
        <div className="boga-circles--l">
          <div className="circle" />
          <div className="circle" />
          <div className="circle" />
        </div>
      </div>

      <div className="container-boga relative z-10 py-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="badge-iso mx-auto mb-6">
            <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
            <span>ISO 9001</span>
            {ISO_CERTIFICATE_NUMBER && (
              <span className="ml-1 font-sans text-white/70">
                · {ISO_CERTIFICATE_NUMBER}
              </span>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mx-auto max-w-4xl"
        >
          <h1 className="font-sans text-display-2xl text-white md:text-display-3xl tracking-tight-sm">
            BOGA
          </h1>
          <p className="mt-2 text-overline text-white/80">
            Ingeniería Portátil
          </p>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto mt-6 max-w-2xl text-body-lg text-white/90"
        >
          Elevamos el estándar de tus eventos. Baños portátiles, unidades sanitarias
          y operación 24/7 para eventos de gran escala en Colombia.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Link href="/cotizacion" className="btn-primary">
            <CircleDot className="h-5 w-5" aria-hidden="true" />
            Cotizar ahora
          </Link>
          <Link href="/productos" className="btn-secondary">
            <LayoutGrid className="h-5 w-5" aria-hidden="true" />
            Ver productos
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </motion.div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mx-auto mt-16 max-w-5xl rounded-2xl border border-white/10 bg-[var(--boga-deep-500)]/60 px-6 py-8 backdrop-blur-sm md:mt-20"
        >
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="stat-number">{stat.value}</div>
                <div className="mt-2 text-xs font-medium uppercase tracking-wider text-white/70 md:text-sm">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
