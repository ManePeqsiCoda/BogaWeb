"use client"

import { useState } from "react"
import Link from "next/link"
import { ProductGrid } from "@/components/product-grid"
import type { Producto, Categoria } from "@/lib/mocks"
import { buttonVariants } from "@/components/ui/button"
import { FadeIn } from "@/components/home/fade-in"
import { cn } from "@/lib/utils"
import { ArrowRight } from "lucide-react"

interface ProductCatalogProps {
  productos: Producto[]
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
      <ProductGrid productos={filteredProducts} columns={4} />

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
