"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import {
  LogOut,
  User,
  Menu,
  LayoutDashboard,
  FileText,
  Package,
  Users,
  Calendar,
  Settings,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { signOut } from "next-auth/react"
import { cn } from "@/lib/utils"

const titleMap: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/cotizaciones": "Cotizaciones",
  "/admin/productos": "Productos",
  "/admin/clientes": "Clientes",
  "/admin/eventos": "Eventos",
  "/admin/configuracion": "Configuración",
}

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

interface AdminHeaderProps {
  user?: {
    name?: string | null
    email?: string | null
  }
}

function MobileNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin"
    }
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  return (
    <nav className="flex flex-col gap-1 py-4">
      {navItems.map((item) => {
        const Icon = item.icon
        const active = isActive(item.href)
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "group flex items-center gap-3 rounded-md border-l-4 px-3 py-3 text-sm font-medium transition-colors",
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
        onClick={onNavigate}
        className={cn(
          "group flex items-center gap-3 rounded-md border-l-4 px-3 py-3 text-sm font-medium transition-colors",
          isActive(configItem.href)
            ? "border-primary bg-primary/10 text-primary"
            : "border-transparent text-muted-foreground hover:bg-muted/10 hover:text-foreground"
        )}
      >
        <configItem.icon className="h-4 w-4 shrink-0" />
        {configItem.label}
      </Link>
    </nav>
  )
}

export function AdminHeader({ user }: AdminHeaderProps) {
  const pathname = usePathname()
  const title = titleMap[pathname] || "Panel de Administración"
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = () => {
    signOut({ callbackUrl: "/admin/login" })
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card/80 px-6 backdrop-blur">
      <div className="flex items-center gap-4">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger
            className="inline-flex h-10 w-10 items-center justify-center rounded-md text-muted-foreground hover:bg-muted/10 hover:text-foreground lg:hidden"
            aria-label="Abrir menú"
          >
            <Menu className="h-5 w-5" />
          </SheetTrigger>
          <SheetContent side="left" className="w-[280px] bg-secondary p-0">
            <SheetHeader className="border-b border-border px-4 py-4">
              <SheetTitle className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-extrabold text-sm">
                  J
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-extrabold tracking-wide text-foreground">
                    JUNISAMA
                  </span>
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                    Admin
                  </span>
                </div>
              </SheetTitle>
            </SheetHeader>
            <div className="px-3">
              <MobileNav onNavigate={() => setMobileOpen(false)} />
            </div>
          </SheetContent>
        </Sheet>

        <h1 className="text-sm font-extrabold uppercase tracking-widest text-foreground">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden items-center gap-2 text-sm md:flex">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
            <User className="h-4 w-4" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-medium text-foreground">
              {user?.name || user?.email || "Usuario"}
            </span>
            <span className="text-xs text-muted-foreground">Administrador</span>
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={handleLogout}
          aria-label="Cerrar sesión"
          className="text-muted-foreground hover:text-foreground"
        >
          <LogOut className="h-5 w-5" />
        </Button>
      </div>
    </header>
  )
}
