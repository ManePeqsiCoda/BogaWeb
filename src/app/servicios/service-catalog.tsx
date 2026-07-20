"use client"

import { useState } from "react"
import Link from "next/link"
import { ProductGrid } from "@/components/product-grid"
import type { Producto, Categoria } from "@/lib/mocks"
import { buttonVariants } from "@/components/ui/button"
import { FadeIn } from "@/components/home/fade-in"
import { cn } from "@/lib/utils"
import { ArrowRight } from "lucide-react"

interface ServiceCatalogProps {
  servicios: Producto[]
  categorias: Categoria[]
}

export function ServiceCatalog({ servicios, categorias }: ServiceCatalogProps) {
  const [activeCategory, setActiveCategory] = useState<string>("todos")

  const filtered =
    activeCategory === "todos"
      ? servicios
      : servicios.filter((p) => p.categoria.slug === activeCategory)

  return (
    <section className="container-boga relative z-10 -mt-8 pb-20">
      <FadeIn>
        <div className="mb-10 flex flex-wrap justify-center gap-2 rounded-2xl bg-boga-surface-elevated p-3 shadow-boga-2">
          <button
            type="button"
            onClick={() => setActiveCategory("todos")}
            className={cn(
              "rounded-xl px-4 py-2 text-sm font-medium transition-colors",
              activeCategory === "todos"
                ? "bg-boga-electric-500 text-boga-text-on-electric"
                : "text-boga-text-secondary hover:bg-boga-surface-muted"
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
                  ? "bg-boga-electric-500 text-boga-text-on-electric"
                  : "text-boga-text-secondary hover:bg-boga-surface-muted"
              )}
            >
              {cat.nombre}
            </button>
          ))}
        </div>
      </FadeIn>

      <h2 className="sr-only">Catálogo de servicios</h2>
      <ProductGrid productos={filtered} columns={3} />

      {filtered.length === 0 && (
        <div className="py-20 text-center">
          <p className="text-boga-text-tertiary">No hay servicios en esta categoría.</p>
        </div>
      )}

      <FadeIn delay={0.2} className="mt-16 text-center">
        <div className="rounded-2xl bg-boga-surface-muted px-6 py-10 md:px-12">
          <h2 className="text-xl font-bold text-boga-text-primary md:text-2xl">
            ¿Necesitas una solución personalizada?
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-boga-text-secondary">
            Contáctanos y diseñamos juntos la infraestructura sanitaria ideal
            para tu evento.
          </p>
          <Link
            href="/cotizacion"
            className={cn(
              buttonVariants({ size: "lg" }),
              "btn-primary mt-6 px-8"
            )}
          >
            Contáctanos
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </FadeIn>
    </section>
  )
}
