"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  FileText,
  Package,
  Users,
  Calendar,
  Settings,
} from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/cotizaciones", label: "Cotizaciones", icon: FileText },
  { href: "/admin/productos", label: "Productos", icon: Package },
  { href: "/admin/clientes", label: "Clientes", icon: Users },
  { href: "/admin/eventos", label: "Eventos", icon: Calendar },
]

const configItem = {
  href: "/admin/configuracion",
  label: "Configuración",
  icon: Settings,
}

export function AdminSidebar() {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin"
    }
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-[260px] flex-col border-r border-border bg-secondary lg:flex">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-border px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-extrabold text-sm">
          B
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-extrabold tracking-wide text-foreground">
            BOGA
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            Admin
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-4">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-md border-l-4 px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-transparent text-muted-foreground hover:bg-muted/10 hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          )
        })}

        <div className="my-3 h-px bg-border" />

        <Link
          href={configItem.href}
          className={cn(
            "group flex items-center gap-3 rounded-md border-l-4 px-3 py-2.5 text-sm font-medium transition-colors",
            isActive(configItem.href)
              ? "border-primary bg-primary/10 text-primary"
              : "border-transparent text-muted-foreground hover:bg-muted/10 hover:text-foreground"
          )}
        >
          <configItem.icon className="h-4 w-4 shrink-0" />
          {configItem.label}
        </Link>
      </nav>

      {/* Footer */}
      <div className="border-t border-border px-6 py-4">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} BOGA
        </p>
      </div>
    </aside>
  )
}
