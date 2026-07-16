import { CotizacionWizard } from "@/components/admin/cotizacion-wizard"

interface NuevaCotizacionPageProps {
  searchParams: Promise<{ clienteId?: string; id?: string }>
}

export default async function NuevaCotizacionPage({
  searchParams,
}: NuevaCotizacionPageProps) {
  const { clienteId, id } = await searchParams
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-foreground">
          {id ? "Editar cotización" : "Nueva cotización"}
        </h1>
        <p className="text-sm text-muted-foreground">
          {id
            ? "Modifica la cotización existente."
            : "Completa el asistente para crear una cotización."}
        </p>
      </div>
      <CotizacionWizard
        cotizacionId={id}
        preselectedClienteId={clienteId}
      />
    </div>
  )
}
