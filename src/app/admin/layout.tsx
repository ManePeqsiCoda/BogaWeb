"use client"

import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"
import { AdminSidebar } from "@/components/layout/admin-sidebar"
import { AdminHeader } from "@/components/layout/admin-header"
import { Loader2 } from "lucide-react"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const { data: session, status } = useSession()

  const isLoginPage = pathname === "/admin/login"

  if (isLoginPage) {
    return (
      <div
        data-admin-theme="dark"
        className="min-h-screen bg-background text-foreground"
      >
        {children}
      </div>
    )
  }

  if (status === "loading") {
    return (
      <div
        data-admin-theme="dark"
        className="flex min-h-screen items-center justify-center bg-background"
      >
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div
      data-admin-theme="dark"
      className="min-h-screen bg-background text-foreground"
    >
      <a
        href="#admin-main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        Saltar al contenido
      </a>
      <AdminSidebar />
      <div className="flex min-h-screen flex-col lg:ml-[260px]">
        <AdminHeader user={session?.user} />
        <main id="admin-main-content" className="flex-1 overflow-y-auto p-6" tabIndex={-1}>
          {children}
        </main>
      </div>
    </div>
  )
}
