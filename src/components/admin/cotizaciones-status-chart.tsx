import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusBadge } from "./status-badge"
import { EstadoCotizacion } from "@prisma/client"
import { cn } from "@/lib/utils"

interface StatusCount {
  estado: EstadoCotizacion
  count: number
}

interface CotizacionesStatusChartProps {
  data: StatusCount[]
}

const statusOrder: EstadoCotizacion[] = [
  "BORRADOR",
  "ENVIADA",
  "APROBADA",
  "RECHAZADA",
  "EXPIRADA",
]

const statusBarColors: Record<EstadoCotizacion, string> = {
  BORRADOR: "bg-gray-500",
  ENVIADA: "bg-[#3B82F6]",
  APROBADA: "bg-[#22C55E]",
  RECHAZADA: "bg-[#EF4444]",
  EXPIRADA: "bg-[#F59E0B]",
}

export function CotizacionesStatusChart({
  data,
}: CotizacionesStatusChartProps) {
  const map = new Map(data.map((d) => [d.estado, d.count]))
  const ordered = statusOrder.map((estado) => ({
    estado,
    count: map.get(estado) || 0,
  }))
  const max = Math.max(1, ...ordered.map((d) => d.count))
  const total = ordered.reduce((sum, d) => sum + d.count, 0)

  return (
    <Card className="bg-card ring-1 ring-foreground/10">
      <CardHeader>
        <CardTitle className="text-sm font-extrabold uppercase tracking-wider">
          Cotizaciones por estado
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 text-3xl font-extrabold text-foreground">
          {total}{" "}
          <span className="text-sm font-medium text-muted-foreground">
            total
          </span>
        </div>

        <div className="space-y-4">
          {ordered.map((item) => {
            const percentage = (item.count / max) * 100
            return (
              <div key={item.estado} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <StatusBadge status={item.estado} />
                  <span className="font-semibold text-foreground">
                    {item.count}
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted/20">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all",
                      statusBarColors[item.estado]
                    )}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
