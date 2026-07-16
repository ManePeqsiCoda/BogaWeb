"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { ShieldCheck, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

const stats = [
  { value: "500+", label: "Eventos atendidos" },
  { value: "24/7", label: "Soporte técnico" },
  { value: "99.9%", label: "Uptime garantizado" },
  { value: "10+", label: "Años de experiencia" },
]

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-secondary pt-24">
      {/* Industrial pattern background */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div
          className="h-full w-full"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, #ffffff 0, #ffffff 1px, transparent 0, transparent 50%), repeating-linear-gradient(-45deg, #ffffff 0, #ffffff 1px, transparent 0, transparent 50%)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-secondary via-secondary to-[#0f1419]" />

      <div className="container relative mx-auto px-4 py-20 lg:px-6 lg:py-28">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge className="mb-6 border-0 bg-accent-gold/15 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-accent-gold hover:bg-accent-gold/15">
              <ShieldCheck className="mr-1.5 h-3.5 w-3.5" />
              ISO 14001 Certificado
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl font-extrabold leading-tight text-white sm:text-4xl md:text-5xl lg:text-6xl"
          >
            Infraestructura sanitaria industrial de grado premium
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-6 max-w-2xl text-lg text-text-on-dark-muted md:text-xl"
          >
            Soluciones robustas y confiables para eventos de cualquier magnitud
            en Colombia. Tecnología avanzada, operación 24/7 y cumplimiento
            normativo.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Link
              href="/cotizacion"
              className={cn(
                buttonVariants({ size: "lg" }),
                "px-8 py-3 text-base font-semibold uppercase tracking-wide"
              )}
            >
              Solicitar presupuesto
            </Link>
            <Link
              href="/productos"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "border-white/20 px-8 py-3 text-base font-semibold text-white hover:bg-white/10 hover:text-white"
              )}
            >
              Ver productos
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </motion.div>
        </div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mx-auto mt-16 max-w-5xl rounded-2xl border border-white/10 bg-white/5 px-6 py-8 backdrop-blur-sm md:mt-20"
        >
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-extrabold text-accent-gold md:text-4xl">
                  {stat.value}
                </div>
                <div className="mt-1 text-xs font-medium uppercase tracking-wider text-text-on-dark-muted md:text-sm">
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
