"use client"

import Link from "next/link"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { FadeIn } from "./fade-in"
import { ArrowRight, Star, Bath, Zap, Truck } from "lucide-react"
import { cn } from "@/lib/utils"

const products = [
  {
    name: "Baño VIP",
    href: "/productos/bano-vip",
    description:
      "Unidad premium con acabados de lujo, espejo e iluminación LED para eventos de alto nivel.",
    badge: "Premium",
    icon: Star,
  },
  {
    name: "Baños Estándar",
    href: "/productos/bano-estandar",
    description:
      "Solución práctica y confiable para obras, festivales y eventos masivos.",
    badge: "Más popular",
    icon: Bath,
  },
  {
    name: "Baños Eléctricos",
    href: "/productos/electricos",
    description:
      "Equipos con ventilación forzada, iluminación interior y funcionamiento autónomo.",
    badge: "Tecnología",
    icon: Zap,
  },
  {
    name: "Trailer de Lujo",
    href: "/productos/trailer-lujo",
    description:
      "Múltiples cabinas climatizadas con distribución optimizada para grandes eventos.",
    badge: "Alto volumen",
    icon: Truck,
  },
]

export function FeaturedProducts() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container mx-auto px-4 lg:px-6">
        <FadeIn className="mb-12 text-center">
          <h2 className="text-2xl font-bold text-dark md:text-4xl">
            Nuestras soluciones
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-body">
            Equipos sanitarios portátiles para todo tipo de evento
          </p>
        </FadeIn>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product, index) => {
            const Icon = product.icon
            return (
              <FadeIn key={product.name} delay={index * 0.1}>
                <Card className="group h-full border-border-subtle bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
                  <div className="relative h-44 overflow-hidden rounded-t-xl bg-bg-light">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary-light text-primary transition-transform group-hover:scale-110">
                        <Icon className="h-10 w-10" />
                      </div>
                    </div>
                    <Badge className="absolute top-3 right-3 bg-accent-gold text-white hover:bg-accent-gold">
                      {product.badge}
                    </Badge>
                  </div>
                  <CardHeader>
                    <h3 className="text-lg font-medium text-dark">
                      {product.name}
                    </h3>
                    <CardDescription>{product.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="mt-auto">
                    <Link
                      href={product.href}
                      className="inline-flex items-center text-sm font-semibold text-primary hover:text-primary-hover"
                    >
                      Ver más
                      <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </CardContent>
                </Card>
              </FadeIn>
            )
          })}
        </div>

        <FadeIn delay={0.4} className="mt-12 text-center">
          <Link
            href="/productos"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "px-8 font-semibold"
            )}
          >
            Ver todos los productos
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </FadeIn>
      </div>
    </section>
  )
}
