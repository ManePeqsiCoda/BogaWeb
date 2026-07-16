"use client"

import { useState } from "react"
import { Faq } from "@prisma/client"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { FadeIn } from "@/components/home/fade-in"
import { cn } from "@/lib/utils"

interface FaqAccordionProps {
  faqs: Faq[]
  categories: string[]
  categoryLabels: Record<string, string>
}

export function FaqAccordion({
  faqs,
  categories,
  categoryLabels,
}: FaqAccordionProps) {
  const [activeCategory, setActiveCategory] = useState<string>("TODOS")

  const filteredFaqs =
    activeCategory === "TODOS"
      ? faqs
      : faqs.filter((f) => f.categoria === activeCategory)

  return (
    <>
      <FadeIn>
        <div className="mb-8 flex flex-wrap justify-center gap-2 rounded-2xl bg-white p-3 shadow-md">
          <button
            type="button"
            onClick={() => setActiveCategory("TODOS")}
            className={cn(
              "rounded-xl px-4 py-2 text-sm font-medium transition-colors",
              activeCategory === "TODOS"
                ? "bg-primary text-white"
                : "text-body hover:bg-bg-light"
            )}
          >
            Todos
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "rounded-xl px-4 py-2 text-sm font-medium transition-colors",
                activeCategory === cat
                  ? "bg-primary text-white"
                  : "text-body hover:bg-bg-light"
              )}
            >
              {categoryLabels[cat] || cat}
            </button>
          ))}
        </div>
      </FadeIn>

      <FadeIn delay={0.1}>
        <div className="rounded-2xl border border-border-subtle bg-white p-4 shadow-sm md:p-6">
          <Accordion>
            {filteredFaqs.map((faq) => (
              <AccordionItem key={faq.id} value={faq.id}>
                <AccordionTrigger className="text-base font-semibold text-dark hover:text-primary">
                  {faq.pregunta}
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-body">{faq.respuesta}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {filteredFaqs.length === 0 && (
            <p className="py-8 text-center text-muted">
              No hay preguntas en esta categoría.
            </p>
          )}
        </div>
      </FadeIn>
    </>
  )
}
