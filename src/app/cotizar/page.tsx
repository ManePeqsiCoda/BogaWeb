import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Cotizar",
  description:
    "Solicita una cotización personalizada para alquiler de unidades sanitarias portátiles en tu evento u obra.",
}

export default function CotizarPage() {
  return (
    <div className="container mx-auto px-4 py-24">
      <h1 className="text-4xl font-bold">Cotizar</h1>
      <p className="text-muted-foreground mt-4">
        Solicita una cotización personalizada para tu evento.
      </p>
    </div>
  )
}
