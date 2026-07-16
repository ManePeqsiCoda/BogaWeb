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

// TODO: Agregar número real de certificado ISO 14001 cuando esté disponible
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
      {/* Fallback: gradiente industrial oscuro con patrón sutil */}
      <div className="absolute inset-0 bg-gradient-to-b from-secondary-900 via-secondary-800 to-secondary-900" />
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, #ffffff 0, #ffffff 1px, transparent 0, transparent 50%), repeating-linear-gradient(-45deg, #ffffff 0, #ffffff 1px, transparent 0, transparent 50%)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Fondo real con overlay oscuro */}
      {/* TODO: Reemplazar /images/hero-background.jpg por foto/video real de evento atendido por Junisama */}
      <Image
        src="/images/hero-background.jpg"
        alt=""
        fill
        className="absolute inset-0 -z-10 object-cover transition-opacity duration-700"
        style={{ opacity: showImage ? 1 : 0 }}
        priority
        quality={85}
        onLoad={() => setImageLoaded(true)}
        onError={() => setImageError(true)}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-secondary-900/90 via-secondary-900/70 to-secondary-900/85" />

      <div className="container-junisama relative z-10 py-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="badge-iso mx-auto mb-6">
            <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
            <span>ISO 14001 Certificado</span>
            {ISO_CERTIFICATE_NUMBER && (
              <span className="ml-1 font-space-grotesk text-neutral-400">
                · {ISO_CERTIFICATE_NUMBER}
              </span>
            )}
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-outfit text-display-md text-white md:text-display-lg max-w-4xl mx-auto"
        >
          Infraestructura Sanitaria{" "}
          <span className="text-primary-500">Industrial</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto mt-6 max-w-2xl text-body-lg text-neutral-300"
        >
          Soluciones robustas y confiables para eventos de gran escala.
          Tecnología avanzada, operación 24/7 y cumplimiento normativo garantizado.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Link href="/cotizacion" className="btn-primary">
            <CircleDot className="h-5 w-5" aria-hidden="true" />
            Solicitar presupuesto a la medida
          </Link>
          <Link href="/servicios" className="btn-secondary">
            <LayoutGrid className="h-5 w-5" aria-hidden="true" />
            Ver servicios
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </motion.div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mx-auto mt-16 max-w-5xl rounded-2xl border border-white/10 bg-secondary-800/60 px-6 py-8 backdrop-blur-sm md:mt-20"
        >
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="stat-number">{stat.value}</div>
                <div className="mt-2 text-xs font-medium uppercase tracking-wider text-neutral-400 md:text-sm">
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
