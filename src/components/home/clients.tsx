"use client"

import { FadeIn } from "./fade-in"

const featuredClients = [
  "Shakira — El Dorado World Tour 2018",
  "Foo Fighters — Concrete and Gold Tour 2019",
  "Feria de las Flores — 2021-2024",
  "Papa Francisco — Visita Colombia 2017",
  "Estéreo Picnic — 2018",
  "Rock al Parque",
  "Soda Stereo — Gracias Totales 2020",
  "La Solar",
  "Carl Cox",
  "Alvaro Díaz",
]

export function Clients() {
  return (
    <section className="bg-bg-light py-16 md:py-20">
      <div className="container mx-auto px-4 lg:px-6">
        <FadeIn className="mb-12 text-center">
          <h2 className="text-2xl font-bold text-dark md:text-3xl">
            Empresas y eventos que confían en nosotros
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-body">
            Respaldo de las principales organizaciones del país
          </p>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {featuredClients.map((client) => (
              <div
                key={client}
                className="group flex h-24 items-center justify-center rounded-xl border border-border bg-white px-4 py-3 shadow-sm transition-all hover:-translate-y-1 hover:border-accent-gold/30 hover:shadow-md"
              >
                <span className="text-center text-sm font-semibold text-muted transition-colors group-hover:text-dark">
                  {client}
                </span>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
