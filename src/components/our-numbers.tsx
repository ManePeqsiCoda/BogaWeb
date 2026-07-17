import {
  CalendarDays,
  Clock,
  Shield,
  MapPin,
  Leaf,
  Users,
} from "lucide-react"

const statsData = [
  {
    icon: CalendarDays,
    value: "500+",
    label: "Eventos Atendidos",
    description: "Desde conciertos hasta ferias internacionales",
  },
  {
    icon: Clock,
    value: "24/7",
    label: "Soporte Técnico",
    description: "Equipo de operarios certificados siempre disponible",
  },
  {
    icon: Shield,
    value: "99.9%",
    label: "Uptime Garantizado",
    description: "Infraestructura confiable en todo momento",
  },
  {
    icon: MapPin,
    value: "2",
    label: "Sedes Operativas",
    description: "Medellín y Bogotá con cobertura nacional",
  },
  {
    icon: Leaf,
    value: "100%",
    label: "Insumos Eco-friendly",
    description: "Compromiso ambiental certificado",
  },
  {
    icon: Users,
    value: "30+",
    label: "Clientes Recurrentes",
    description: "Organizaciones que confían año tras año",
  },
]

export function OurNumbers() {
  return (
    <section className="bg-[var(--boga-deep-500)] py-20 md:py-28" aria-labelledby="numbers-heading">
      <div className="container-boga">
        <div className="mb-16 text-center">
          <span className="mb-4 inline-flex items-center gap-2 text-caption uppercase tracking-wider text-[var(--boga-lima-500)]">
            <span className="boga-circles--s">
              <span className="circle" />
              <span className="circle" />
              <span className="circle" />
            </span>
            La diferencia BOGA
          </span>
          <h2
            id="numbers-heading"
            className="font-sans text-heading-lg text-white md:text-display-md"
          >
            Más de una década respaldando los eventos más importantes del país
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 md:gap-8">
          {statsData.map((stat) => (
            <div
              key={stat.label}
              className="group rounded-2xl border border-white/10 bg-white/5 p-6 transition-all duration-300 hover:border-[var(--boga-lima-500)]/30 hover:bg-white/10 md:p-8"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--boga-lima-500)]/15 transition-colors group-hover:bg-[var(--boga-lima-500)]">
                <stat.icon
                  className="h-6 w-6 text-[var(--boga-lima-500)] transition-colors group-hover:text-[var(--boga-text-on-lima)]"
                  aria-hidden="true"
                />
              </div>
              <div className="font-sans text-3xl font-bold text-[var(--boga-lima-500)]">
                {stat.value}
              </div>
              <h3 className="mt-2 font-sans text-heading-sm text-white">
                {stat.label}
              </h3>
              <p className="mt-1 text-body-sm text-white/70">{stat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
