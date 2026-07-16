"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Producto, Categoria } from "@prisma/client"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { FadeIn } from "@/components/home/fade-in"
import { cn } from "@/lib/utils"
import { ArrowRight, Star, Bath, Accessibility, Users, Leaf } from "lucide-react"

type ProductoConCategoria = Producto & { categoria: Categoria }

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Crown: Star,
  Bath: Bath,
  Accessibility: Accessibility,
  Leaf: Leaf,
  Users: Users,
}

interface ProductCatalogProps {
  productos: ProductoConCategoria[]
  categorias: Categoria[]
}

export function ProductCatalog({ productos, categorias }: ProductCatalogProps) {
  const [activeCategory, setActiveCategory] = useState<string>("todos")

  const filteredProducts =
    activeCategory === "todos"
      ? productos
      : productos.filter((p) => p.categoria.slug === activeCategory)

  return (
    <section className="container mx-auto -mt-8 px-4 pb-20 lg:px-6">
      {/* Filter tabs */}
      <FadeIn>
        <div className="mb-10 flex flex-wrap justify-center gap-2 rounded-2xl bg-white p-3 shadow-md">
          <button
            type="button"
            onClick={() => setActiveCategory("todos")}
            className={cn(
              "rounded-xl px-4 py-2 text-sm font-medium transition-colors",
              activeCategory === "todos"
                ? "bg-primary text-white"
                : "text-body hover:bg-bg-light"
            )}
          >
            Todos
          </button>
          {categorias.map((cat) => (
            <button
              key={cat.slug}
              type="button"
              onClick={() => setActiveCategory(cat.slug)}
              className={cn(
                "rounded-xl px-4 py-2 text-sm font-medium transition-colors",
                activeCategory === cat.slug
                  ? "bg-primary text-white"
                  : "text-body hover:bg-bg-light"
              )}
            >
              {cat.nombre}
            </button>
          ))}
        </div>
      </FadeIn>

      {/* Product grid */}
      <h2 className="sr-only">Catálogo de productos</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {filteredProducts.map((producto, index) => {
          const Icon = iconMap[producto.categoria.icono || ""] || Bath
          return (
            <FadeIn key={producto.id} delay={index * 0.05}>
              <Card className="group h-full overflow-hidden border-border-subtle bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
                <Link href={`/productos/${producto.slug}`}>
                  <div className="relative h-48 overflow-hidden bg-bg-light">
                    <Image
                      src={producto.imagenPrincipal}
                      alt={producto.nombre}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-white/60 opacity-0 transition-opacity group-hover:opacity-100">
                      <span className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white">
                        Ver detalles
                      </span>
                    </div>
                    {producto.badge && (
                      <Badge className="absolute top-3 right-3 bg-accent-gold text-white hover:bg-accent-gold">
                        {producto.badge}
                      </Badge>
                    )}
                  </div>
                </Link>
                <CardContent className="flex flex-col p-5">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary-light text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-bold text-dark">
                    <Link
                      href={`/productos/${producto.slug}`}
                      className="hover:text-primary"
                    >
                      {producto.nombre}
                    </Link>
                  </h3>
                  <p className="mt-2 flex-1 text-sm text-body">
                    {producto.descripcionCorta}
                  </p>
                  <Link
                    href={`/productos/${producto.slug}`}
                    className="mt-4 inline-flex items-center text-sm font-semibold text-primary hover:text-primary-hover"
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

      {filteredProducts.length === 0 && (
        <div className="py-20 text-center">
          <p className="text-muted">No hay productos en esta categoría.</p>
        </div>
      )}

      {/* CTA */}
      <FadeIn delay={0.2} className="mt-16 text-center">
        <div className="rounded-2xl bg-bg-light px-6 py-10 md:px-12">
          <h2 className="text-xl font-bold text-dark md:text-2xl">
            ¿Necesitas una solución personalizada?
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-body">
            Contáctanos y diseñamos juntos la infraestructura sanitaria ideal
            para tu evento.
          </p>
          <Link
            href="/cotizacion"
            className={cn(buttonVariants({ size: "lg" }), "mt-6 px-8")}
          >
            Contáctanos
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </FadeIn>
    </section>
  )
}
