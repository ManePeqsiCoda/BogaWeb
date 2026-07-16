import { cn } from "@/lib/utils"
import { ArrowDown, ArrowUp, Minus } from "lucide-react"

interface KpiCardProps {
  title: string
  value: string | number
  icon: React.ComponentType<{ className?: string }>
  trend?: "up" | "down" | "neutral"
  trendValue?: string
  color?: "primary" | "green" | "blue" | "red" | "orange" | "gray"
}

const colorStyles: Record<
  NonNullable<KpiCardProps["color"]>,
  { iconBg: string; iconText: string }
> = {
  primary: {
    iconBg: "bg-primary/10",
    iconText: "text-primary",
  },
  green: {
    iconBg: "bg-[#22C55E]/10",
    iconText: "text-[#22C55E]",
  },
  blue: {
    iconBg: "bg-[#3B82F6]/10",
    iconText: "text-[#3B82F6]",
  },
  red: {
    iconBg: "bg-[#EF4444]/10",
    iconText: "text-[#EF4444]",
  },
  orange: {
    iconBg: "bg-[#F59E0B]/10",
    iconText: "text-[#F59E0B]",
  },
  gray: {
    iconBg: "bg-gray-500/10",
    iconText: "text-gray-400",
  },
}

export function KpiCard({
  title,
  value,
  icon: Icon,
  trend = "neutral",
  trendValue,
  color = "primary",
}: KpiCardProps) {
  const styles = colorStyles[color]

  const TrendIcon = trend === "up" ? ArrowUp : trend === "down" ? ArrowDown : Minus
  const trendColor =
    trend === "up"
      ? "text-[#22C55E]"
      : trend === "down"
        ? "text-[#EF4444]"
        : "text-muted-foreground"

  return (
    <div className="flex flex-col gap-4 rounded-xl bg-card p-5 ring-1 ring-foreground/10">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {title}
          </p>
          <p className="mt-2 text-3xl font-extrabold tracking-tight text-foreground">
            {value}
          </p>
        </div>
        <div
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-lg",
            styles.iconBg,
            styles.iconText
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>

      {trendValue && (
        <div className="flex items-center gap-1.5 text-xs">
          <TrendIcon className={cn("h-3.5 w-3.5", trendColor)} />
          <span className={cn("font-medium", trendColor)}>{trendValue}</span>
          <span className="text-muted-foreground">vs mes anterior</span>
        </div>
      )}
    </div>
  )
}
