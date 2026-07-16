"use client"

import { SessionProvider } from "next-auth/react"
import { ThemeProvider } from "next-themes"
import { usePathname } from "next/navigation"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { WhatsAppButton } from "@/components/layout/whatsapp-button"
import { Toaster } from "@/components/ui/sonner"

export function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdmin = pathname?.startsWith("/admin")

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <SessionProvider>
        {!isAdmin && (
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
          >
            Saltar al contenido
          </a>
        )}
        {!isAdmin && <Navbar />}
        <main
          id="main-content"
          className={isAdmin ? "flex-1" : "flex-1 pt-[72px]"}
          tabIndex={-1}
        >
          {children}
        </main>
        {!isAdmin && <Footer />}
        {!isAdmin && <WhatsAppButton />}
        <Toaster position="top-right" richColors />
      </SessionProvider>
    </ThemeProvider>
  )
}
